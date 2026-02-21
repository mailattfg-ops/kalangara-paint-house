import { Play, Instagram, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const VideoSection = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoUrl, setVideoUrl] = useState<string>("https://cdn.pixabay.com/video/2023/10/26/186638-878453471_large.mp4");

    useEffect(() => {
        const fetchReel = async () => {
            try {
                const { data, error } = await supabase
                    .from("reels")
                    .select("*")
                    .limit(1);

                if (error) {
                    console.error("Error fetching reel:", error);
                    return;
                }

                if (data && data.length > 0 && data[0].video_url) {
                    setVideoUrl(data[0].video_url);
                }
            } catch (err) {
                console.error("Unexpected error fetching reel:", err);
            }
        };

        fetchReel();
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            // Attempt playback whenever url changes
            videoRef.current.load(); // Reload video element with new source
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Autoplay was prevented:", error);
                });
            }
        }
    }, [videoUrl]);

    return (
        <section className="bg-white py-12 md:py-24 relative overflow-hidden group">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#00000008_0%,transparent_70%)] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col items-center">

                    {/* Minimalist Narrative */}
                    <div className="mb-16 text-center space-y-4">
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px w-8 bg-primary/40" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">The Showcase</span>
                            <div className="h-px w-8 bg-primary/40" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-heading font-normal text-slate-900 uppercase tracking-tighter leading-none">
                            Legacy In <span className="text-primary font-serif">Motion</span>
                        </h2>
                        <p className="text-slate-500 text-xs md:text-sm font-medium tracking-widest uppercase">
                            Step Inside Kalangara Paint House • Edathua
                        </p>
                    </div>

                    {/* The Video: Large, Frameless, High-Impact */}
                    <div className="relative w-full max-w-4xl aspect-[16/9] bg-slate-900 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] group/video rounded-sm overflow-hidden">
                        {/* Decorative Corner Accents */}
                        <div className="absolute -top-1 -left-1 w-12 h-12 border-t border-l border-primary/30 group-hover/video:w-full group-hover/video:h-full transition-all duration-1000 z-20" />
                        <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b border-r border-primary/30 group-hover/video:w-full group-hover/video:h-full transition-all duration-1000 z-20" />

                        {/* Autoplay Video Tag */}
                        <div className="w-full h-full overflow-hidden relative">
                            <video
                                ref={videoRef}
                                src={videoUrl}
                                className="w-full h-full object-cover opacity-90"
                                autoPlay
                                muted={true}
                                loop
                                playsInline
                                preload="auto"
                                poster="/images/kph-shop-1.webp"
                                onCanPlay={() => {
                                    if (videoRef.current) {
                                        videoRef.current.play().catch(e => console.log("Play failed:", e));
                                    }
                                }}
                            />

                            {/* Cinematic Overlay - Lightened */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Centered Focus Glyph */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover/video:opacity-100 transition-opacity duration-1000">
                            <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm bg-black/10">
                                <Play className="w-6 h-6 text-white fill-current" />
                            </div>
                        </div>

                        {/* Side Branding */}
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 vertical-text">
                            <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.8em]">PREMIUM QUALITY</span>
                        </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-12">
                        <a
                            href="https://www.instagram.com/reel/DJmKDihz7yK/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] hover:text-primary transition-colors group/link"
                        >
                            <Instagram className="w-4 h-4" />
                            Watch Original Reel
                            <ArrowUpRight className="w-3 h-3 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default VideoSection;
