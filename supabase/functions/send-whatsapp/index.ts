import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { name, phone, service, pdfUrl, district } = await req.json()

        console.log("=== WhatsApp Function Called ===")
        console.log("Customer:", name)
        console.log("PDF URL:", pdfUrl)

        const WATTI_BEARER_TOKEN = Deno.env.get('WATTI_BEARER_TOKEN')
        let WATTI_API_ENDPOINT = Deno.env.get('WATTI_API_ENDPOINT') || 'https://api.watti.io'
        
        // Clean up endpoint
        WATTI_API_ENDPOINT = WATTI_API_ENDPOINT.replace(/\/api\/v1\/sendTemplateMessages\/?$/, '')
                                               .replace(/\/api\/v1\/sendTemplateMessage\/?$/, '')
                                               .replace(/\/$/, '')

        const ADMIN_1_WHATSAPP = Deno.env.get('WATTI_ADMIN_1_WHATSAPP')
        const ADMIN_2_WHATSAPP = Deno.env.get('WATTI_ADMIN_2_WHATSAPP')
        
        const TEMPLATE_NAME = 'admin_req'

        const normalizedDistrict = (district || '').toString().trim().toLowerCase()
        const allowedDistricts = ['alappuzha', 'alleppey', 'kottayam', 'pathanamthitta']
        const shouldNotifyAdmin = allowedDistricts.includes(normalizedDistrict)

        if (!shouldNotifyAdmin) {
            return new Response(JSON.stringify({ success: true, skipped: true, reason: 'district_not_in_admin_region' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        if (!WATTI_BEARER_TOKEN) {
            throw new Error("Watti configuration missing in secrets.")
        }

        const sendWattiMessage = async (to: string, label: string) => {
            let formattedTo = to.trim()
            if (!formattedTo.startsWith('+')) {
                formattedTo = `+${formattedTo}`
            }

            // 1. Define the parameters mapping for the template body variables
            //    Variables in template: {{name}}, {{phone}}, {{service}}
            //    Header variable: {{url}} (as defined in WATI template)
            const parameters = [
                { name: "name", value: name },
                { name: "phone", value: phone },
                { name: "service", value: service }
            ];

            // 2. Add the Document URL
            //    User configured header as {{url}}, so we pass the PDF URL with name "url"
            if (pdfUrl) {
                parameters.push({
                    name: "url", 
                    value: pdfUrl,
                    filename: "Enquiry.pdf" // Optional: helps WATI name the file
                })
            }

            const payload = {
                template_name: TEMPLATE_NAME,
                broadcast_name: `Enquiry_${Date.now()}`,
                parameters: parameters
            }

            const url = `${WATTI_API_ENDPOINT}/api/v1/sendTemplateMessage?whatsappNumber=${encodeURIComponent(formattedTo)}`

            console.log(`Sending to ${label}...`)
            
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `${WATTI_BEARER_TOKEN.startsWith('Bearer ') ? '' : 'Bearer '}${WATTI_BEARER_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const text = await res.text()
            
            let json = {}
            try {
                json = JSON.parse(text)
            } catch {
                json = { raw: text }
            }

            if (!res.ok) {
                console.error(`Error sending to ${label}:`, text)
                // Don't throw immediately so we can try the next admin
                return { success: false, error: text }
            }
            
            return { success: true, data: json }
        }

        const results = []

        if (ADMIN_1_WHATSAPP) {
            results.push(await sendWattiMessage(ADMIN_1_WHATSAPP, "Admin 1"))
        }
        if (ADMIN_2_WHATSAPP) {
            results.push(await sendWattiMessage(ADMIN_2_WHATSAPP, "Admin 2"))
        }

        return new Response(JSON.stringify({ success: true, results }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error: any) {
        console.error("Function Error:", error)
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
