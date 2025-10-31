import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import ENV from "@/config";

type Props = React.HTMLAttributes<
    HTMLImageElement | HTMLVideoElement | HTMLPreElement
> & {
    src: string;
};

export const Media: React.FC<Props> = ({ src, ...rest }) => {
    const fullSrc =
        src.startsWith("http://") || src.startsWith("https://")
            ? src
            : `${ENV.BASE_URL}${src}`;

    const [contentType, setContentType] = useState<string>("");
    const [textContent, setTextContent] = useState<string>("");
    const [blobUrl, setBlobUrl] = useState<string>("");

    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true); // Start muted to improve autoplay chances
    const [volume, setVolume] = useState(1);
    const [showControls, setShowControls] = useState(false);
    const [hasUserPaused, setHasUserPaused] = useState(false);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const res = await fetch(fullSrc);
                if (!res.ok) throw new Error("Failed to fetch media");
                const type = res.headers.get("Content-Type") || "";
                setContentType(type);

                if (type.startsWith("image/") || type.startsWith("video/")) {
                    const blob = await res.blob();
                    setBlobUrl(URL.createObjectURL(blob));
                } else {
                    const text = await res.text();
                    setTextContent(text);
                }
            } catch (err) {
                setTextContent("Failed to load media.");
            }
        };

        fetchMedia();

        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [fullSrc]);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.muted = isMuted;
            video.volume = volume;
        }
    }, [isMuted, volume]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !blobUrl) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    if (!hasUserPaused) {
                        video.play().catch(() => {
                            setHasUserPaused(true); // Treat autoplay block as user pause
                        });
                        setIsPlaying(true);
                    }
                } else {
                    video.pause();
                    setIsPlaying(false);
                }
            },
            { threshold: 0.5 } // Play when at least 50% visible
        );

        observer.observe(video);

        return () => observer.disconnect();
    }, [blobUrl, hasUserPaused]);

    const togglePlay = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
            setHasUserPaused(true);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
            setHasUserPaused(false);
        }
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        const newMuted = !isMuted;
        videoRef.current.muted = newMuted;
        setIsMuted(newMuted);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            if (newVolume === 0) {
                setIsMuted(true);
                videoRef.current.muted = true;
            } else if (isMuted) {
                setIsMuted(false);
                videoRef.current.muted = false;
            }
        }
    };

    if (contentType.startsWith("image/") && blobUrl) {
        return (
            <img
                src={blobUrl}
                alt=""
                style={{
                    maxHeight: "100%",
                    width: "100%",
                    objectFit: "contain",
                }}
                {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
            />
        );
    }

    if (contentType.startsWith("video/") && blobUrl) {
        return (
            <div
                style={{
                    position: "relative",
                    maxHeight: "100%",
                    width: "100%",
                }}
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
                className="overflow-hidden"
            >
                <video
                    ref={videoRef}
                    src={blobUrl}
                    style={{
                        maxHeight: "100%",
                        width: "100%",
                        objectFit: "cover",
                    }}
                    className=" mx-auto overflow-hidden"
                    onClick={togglePlay}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    {...(rest as React.VideoHTMLAttributes<HTMLVideoElement>)}
                />

                {/* {showControls && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background:
                                "linear-gradient(transparent, rgba(0,0,0,0.7))",
                            padding: "20px 16px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                        className=" justify-center"
                    >
                        <button
                            onClick={togglePlay}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                padding: 0,
                            }}
                        >
                            {isPlaying ? (
                                <Pause size={24} />
                            ) : (
                                <Play size={24} />
                            )}
                        </button>

                        <button
                            onClick={toggleMute}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                padding: 0,
                            }}
                        >
                            {isMuted || volume === 0 ? (
                                <VolumeX size={24} />
                            ) : (
                                <Volume2 size={24} />
                            )}
                        </button>

                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            style={{
                                flex: "0 0 100px",
                                cursor: "pointer",
                                accentColor: "white",
                            }}
                            className="w-2xl"
                        />
                    </div>
                )} */}
            </div>
        );
    }

    if (textContent) {
        console.log("text content ==> ", textContent);
        return (
            <pre
                style={{
                    maxHeight: "100%",
                    overflowX: "auto",
                    background: "#f4f4f4",
                    padding: "10px",
                    whiteSpace: "pre-wrap",
                }}
                {...(rest as React.HTMLAttributes<HTMLPreElement>)}
            >
                {textContent}
            </pre>
        );
    }

    return <div>Loading media…</div>;
};
