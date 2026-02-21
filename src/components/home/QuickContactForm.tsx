import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Loader2,
    Upload,
    X,
    ArrowRight,
    Phone,
    MapPin
} from "lucide-react";
import { DistrictSelect } from "@/components/ui/district-select";
import { jsPDF } from "jspdf";

/* -------------------- Schema -------------------- */
const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    email: z.string().email().optional().or(z.literal("")),
    district: z.string().min(1, "Please select a district"),
    interestedIn: z.string().min(1, "Please select a service"),
    sqft: z.string().optional(),
    projectDetails: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

/* -------------------- Helper -------------------- */
const processImageForPdf = (file: File): Promise<{ dataUrl: string; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };

        img.onload = () => {
            const canvas = document.createElement('canvas');
            // Keep original dimensions
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0);

            // Reduce quality to 0.7 (30% reduction), keep image/jpeg for compression
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

            resolve({
                dataUrl,
                width: img.width,
                height: img.height
            });
        };

        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

/* -------------------- Component -------------------- */
interface QuickContactFormProps {
    isHero?: boolean;
}

export const QuickContactForm = ({ isHero = false }: QuickContactFormProps) => {
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            district: "",
            interestedIn: "",
            sqft: "",
            projectDetails: "",
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        if (imageFiles.length + files.length > 5) {
            toast.error("Maximum 5 images allowed");
            return;
        }
        setImageFiles((prev) => [...prev, ...files]);
    };

    const removeFile = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (values: FormValues) => {
        try {
            setLoading(true);
            console.log("Submitting QuickContactForm...", values);
            const imageUrls: string[] = [];

            // 1. Upload Images in Parallel for maximum speed
            const uploadPromises = imageFiles.map(async (file) => {
                const ext = file.name.split(".").pop();
                const path = `enquiry_attachments/${crypto.randomUUID()}.${ext}`;
                const { error } = await supabase.storage.from("enquiry-attachments").upload(path, file);
                if (!error) {
                    const { data } = supabase.storage.from("enquiry-attachments").getPublicUrl(path);
                    return data.publicUrl;
                }
                return null;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            imageUrls.push(...uploadedUrls.filter((url): url is string => url !== null));

            // 2. Generate PDF
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.text("KPH - Painting Enquiry", 20, 20);
            doc.setFontSize(12);
            doc.text(`Name: ${values.name}`, 20, 40);
            doc.text(`Phone: ${values.phone}`, 20, 50);
            doc.text(`District: ${values.district}`, 20, 60);
            doc.text(`Service: ${values.interestedIn}`, 20, 70);
            doc.text(`Sq.Ft: ${values.sqft || "N/A"}`, 20, 80);
            doc.text("Project Details:", 20, 90);
            doc.text(values.projectDetails || "N/A", 20, 100, { maxWidth: 170 });

            // Add Images to PDF
            let yPos = 130;

            if (imageFiles.length > 0) {
                doc.addPage();
                doc.text("Project Images:", 20, 20);
                yPos = 30;

                for (const file of imageFiles) {
                    try {
                        const { dataUrl, width, height } = await processImageForPdf(file);
                        const ext = 'JPEG';

                        // Calculate dimensions to fit PDF width (170mm) while maintaining aspect ratio
                        const maxWidth = 170;
                        const ratio = width / height;
                        const pdfHeight = maxWidth / ratio;

                        // Check if we need a new page
                        if (yPos + pdfHeight > 280) {
                            doc.addPage();
                            yPos = 20;
                        }

                        doc.addImage(dataUrl, ext, 20, yPos, maxWidth, pdfHeight);
                        yPos += pdfHeight + 10;
                    } catch (err) {
                        console.error("Error adding image to PDF:", err);
                    }
                }
            }

            const pdfBlob = doc.output("blob");
            const sanitizedName = values.name.replace(/[^a-z0-9]/gi, '').toLowerCase();
            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0');
            const month = date.toLocaleString('default', { month: 'short' }).toLowerCase();
            const year = date.getFullYear();
            const pdfPath = `enquiry-pdfs/${sanitizedName}_enquiry_${day}${month}${year}.pdf`;

            await supabase.storage.from("enquiry-pdfs").upload(pdfPath, pdfBlob, {
                contentType: "application/pdf",
                cacheControl: "3600",
                upsert: false
            });
            const { data: pdfData } = supabase.storage.from("enquiry-pdfs").getPublicUrl(pdfPath);
            const pdfUrl = pdfData.publicUrl;

            // 3. Save to Database
            const { error: dbError } = await supabase.from("enquiries").insert({
                name: values.name,
                phone: values.phone,
                email: values.email || null,
                district: values.district,
                interested_in: values.interestedIn,
                sqft: values.sqft || null,
                project_details: values.projectDetails || null,
                image_urls: imageUrls,
                pdf_url: pdfUrl,
                status: "New",
            });

            if (dbError) throw dbError;

            const { error: functionError } = await supabase.functions.invoke('send-whatsapp', {
                body: { name: values.name, phone: values.phone, service: values.interestedIn, pdfUrl, district: values.district }
            });

            if (functionError) {
                console.error("WhatsApp Error:", functionError);
            }

            toast.success("Enquiry successful! Our experts will contact you soon.");
            form.reset({
                name: "",
                phone: "",
                email: "",
                district: "",
                interestedIn: "",
                sqft: "",
                projectDetails: ""
            });
            setImageFiles([]);
            setTimeout(() => {
                window.location.reload();
            }, 4000); // 4 second delay to allow toast to be readable
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (isHero) {
        /* ORIGINAL ROYAL THEME UI */
        return (
            <div id="contact" className="w-full max-w-[500px] bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden flex flex-col group/form transition-all duration-500 border border-white/50 ring-1 ring-purple-100">
                <div className="bg-[#0f0a1e] text-white p-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1.5 h-4 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                            <span className="text-[10px] font-black text-purple-300 uppercase tracking-[0.4em]">Direct Consultation</span>
                        </div>
                        <h3 className="text-2xl font-black font-heading tracking-tight leading-none uppercase text-white drop-shadow-lg">
                            Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Project</span>
                        </h3>
                    </div>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormControl><Input {...field} placeholder="Name *" className="h-12 bg-white border-slate-300 rounded-none focus-visible:ring-1 focus-visible:ring-slate-900 font-normal text-sm px-4" /></FormControl>
                                    <FormMessage className="text-[10px] text-red-500" />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormControl><Input {...field} placeholder="Phone *" className="h-12 bg-white border-slate-300 rounded-none focus-visible:ring-1 focus-visible:ring-slate-900 font-normal text-sm px-4" /></FormControl>
                                    <FormMessage className="text-[10px] text-red-500" />
                                </FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="district" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <DistrictSelect value={field.value} onValueChange={field.onChange} isHero={true} className="h-12 bg-white border-slate-300 rounded-none px-4 text-slate-900 text-sm font-normal" placeholder="Select District *" />
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-500" />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="sqft" render={({ field }) => (
                                <FormItem>
                                    <FormControl><Input {...field} placeholder="Sq. Ft (Optional)" className="h-12 bg-white border-slate-300 rounded-none focus-visible:ring-1 focus-visible:ring-slate-900 font-normal text-sm px-4" /></FormControl>
                                    <FormMessage className="text-[10px] text-red-500" />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="interestedIn" render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 bg-white border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 text-sm font-normal px-4 text-slate-900">
                                            <SelectValue placeholder="Service Required *" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-none border-slate-300 bg-white max-h-[300px]">
                                        {["Interior Painting",
                                            "Exterior Painting",
                                            "Waterproofing",
                                            "Full Home Makeover",
                                            "Wood Polishing & Varnishing",
                                            "Metal Painting",
                                            "Texture Design & Stenciling",
                                            "Wallpaper Installation",
                                            "Damp Proofing Solutions",
                                            "New Paint Service",
                                            "Repainting Services",
                                            "Project-Based Painting Services",
                                            "Plinth Area Painting & Protection",
                                            "Floor Painting",
                                            "Epoxy Metal Painting",
                                            "Safe Paint Services"].map(s => (
                                                <SelectItem key={s} value={s} className="rounded-none text-sm font-normal text-slate-700 cursor-pointer focus:bg-slate-900 focus:text-white">{s}</SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-[10px] text-red-500" />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="projectDetails" render={({ field }) => (
                            <FormItem>
                                <FormControl><Textarea {...field} placeholder="Project requirements (Optional)..." className="min-h-[80px] bg-white border-slate-300 rounded-none focus-visible:ring-1 focus-visible:ring-slate-900 font-normal text-sm px-4 py-3 resize-none" /></FormControl>
                            </FormItem>
                        )} />

                        <div className="relative group/upload">
                            <div className="border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-colors p-4 text-center cursor-pointer relative rounded-none">
                                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 z-20 cursor-pointer" />
                                <div className="flex items-center justify-center gap-2 text-slate-500"><Upload className="w-4 h-4" /><span className="text-[11px] font-medium">Upload Images (Max 5)</span></div>
                            </div>
                            {imageFiles.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {imageFiles.map((file, index) => (
                                        <div key={index} className="relative w-10 h-10 border border-slate-300 rounded-none overflow-hidden">
                                            <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeFile(index)} className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 hover:opacity-100"><X className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            onClick={(e) => {
                                // Prevent any default behavior that might cause a redirect
                                // Though form handleSubmit usually handles this, we're being explicit as requested.
                                if (loading) e.preventDefault();
                            }}
                            className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black rounded-xl transition-all shadow-lg text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Get Quote"}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </Button>
                    </form>
                </Form>
            </div>
        );
    }

    /* ORIGINAL SHOWROOM THEME UI */
    return (
        <section id="contact" className="py-24 bg-slate-100 relative">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
                    <div className="lg:w-5/12 pt-4">
                        <div className="pb-8 border-b border-black/10 mb-8">
                            <span className="block text-xs font-bold tracking-[0.2em] text-slate-500 mb-4 uppercase">Contact Us</span>
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[0.95] mb-6">
                                VISIT OUR <br /><span className="text-slate-400">SHOWROOM</span> <br />TODAY
                            </h2>
                            <p className="text-slate-600 font-medium leading-relaxed max-w-sm">
                                We primarily serve customers in Alappuzha and Pathanamthitta with premium painting solutions.
                            </p>
                        </div>
                        <div className="grid gap-8">
                            {[
                                { label: "Call Us", value: "0477-2212444 | 9446194178", icon: Phone },
                                { label: "Location", value: "St. George Shopping Complex, Edathua", icon: MapPin },
                            ].map((item, idx) => (
                                <div key={idx} className="group flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-900"><item.icon className="w-5 h-5" /></div>
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.label}</div>
                                        <p className="text-lg font-bold text-slate-900">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-7/12">
                        <div className="bg-white p-8 md:p-12 shadow-2xl border border-slate-200 relative">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="name" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-900">Full Name</FormLabel>
                                                <FormControl><Input {...field} placeholder="Enter your name" className="h-14 bg-white border-slate-900 rounded-none focus:ring-1 focus:ring-black" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="phone" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-900">Phone Number</FormLabel>
                                                <FormControl><Input {...field} placeholder="+91 ..." className="h-14 bg-white border-slate-900 rounded-none focus:ring-1 focus:ring-black" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="district" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-900">District</FormLabel>
                                                <DistrictSelect value={field.value} onValueChange={field.onChange} className="h-14 bg-white border-slate-900 rounded-none" placeholder="Select District" />
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="sqft" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-900">Square Feet</FormLabel>
                                                <FormControl><Input {...field} placeholder="Approx Area" className="h-14 bg-white border-slate-900 rounded-none" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="interestedIn" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-900">Service Required</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                                <FormControl><SelectTrigger className="h-14 bg-white border-slate-900 rounded-none"><SelectValue placeholder="Select Service" /></SelectTrigger></FormControl>
                                                <SelectContent className="bg-white border-black rounded-none">
                                                    {["Interior Painting", "Exterior Painting", "Waterproofing", "Safe Paint"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="projectDetails" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-900">Project Details</FormLabel>
                                            <FormControl><Textarea {...field} placeholder="Tell us more..." className="min-h-[120px] bg-white border-slate-900 rounded-none resize-none" /></FormControl>
                                        </FormItem>
                                    )} />
                                    <div className="border border-slate-900 border-dashed p-8 text-center relative cursor-pointer hover:bg-slate-50 transition-colors">
                                        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <div className="flex flex-col items-center gap-3"><Upload className="w-10 h-10 text-slate-400" /><span className="text-sm font-bold text-slate-900">Click to Upload Images</span></div>
                                    </div>
                                    {imageFiles.length > 0 && <div className="flex flex-wrap gap-4">{imageFiles.map((f, i) => <div key={i} className="relative w-20 h-20 border border-slate-200"><img src={URL.createObjectURL(f)} className="w-full h-full object-cover" /><button onClick={() => removeFile(i)} className="absolute -top-2 -right-2 bg-black text-white p-1 rounded-full"><X className="w-3 h-3" /></button></div>)}</div>}
                                    <Button type="submit" disabled={loading} className="w-full h-16 bg-black text-white hover:bg-zinc-800 rounded-none text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2">
                                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Submit Free Enquiry <ArrowRight className="w-5 h-5" /></>}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuickContactForm;
