"use client";

import type React from "react";
import "./upload.css";
import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import {
    Upload as UploadIcon,
    Link as LinkIcon,
    X,
    ArrowRight,
    ArrowLeft,
    Camera,
    Video,
    Square,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    createPost,
    createPostWithMultipleFiles,
} from "../services/postService";

interface UploadedFile {
    file: File;
    preview: string;
    type: "image" | "video";
    themes: string[];
}

const CameraPreview = ({
    onClose,
    onPhotoCapture,
    onVideoCapture,
}: {
    onClose: () => void;
    onPhotoCapture: (blob: Blob) => void;
    onVideoCapture: (blob: Blob) => void;
}) => {
    const webcamRef = useRef<Webcam>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const recordedChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRecording]);

    const capturePhoto = () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            // Convert base64 to blob
            fetch(imageSrc)
                .then((res) => res.blob())
                .then((blob) => {
                    onPhotoCapture(blob);
                    toast.success("Photo captured!");
                });
        }
    };

    const startRecording = () => {
        recordedChunksRef.current = [];
        setRecordingTime(0);
        
        if (webcamRef.current && webcamRef.current.stream) {
            const stream = webcamRef.current.stream;
            
            const options = { mimeType: "video/webm" };
            const mediaRecorder = new MediaRecorder(stream, options);
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                // Create blob when recording stops
                if (recordedChunksRef.current.length > 0) {
                    const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
                    onVideoCapture(blob);
                    toast.success("Video recorded!");
                    recordedChunksRef.current = [];
                }
            };
            
            mediaRecorder.start(100); // Collect data every 100ms
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);
            toast.success("Recording started!");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="camera-preview"
        >
            <Webcam
                ref={webcamRef}
                audio={true}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    facingMode: "user",
                    width: 1280,
                    height: 720,
                }}
                className="camera-video"
            />
            
            <button onClick={onClose} className="camera-close-btn">
                <X size={24} />
            </button>
            
            {isRecording && (
                <div className="camera-timer">
                    <div className="timer-pulse"></div>
                    {formatTime(recordingTime)}
                </div>
            )}
            
            <div className="camera-controls">
                <button
                    onClick={capturePhoto}
                    disabled={isRecording}
                    className="capture-btn"
                    title="Take Photo"
                >
                    <Camera size={28} />
                </button>
                
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`record-btn ${isRecording ? "recording" : ""}`}
                    title={isRecording ? "Stop Recording" : "Start Recording"}
                >
                    {isRecording ? <Square size={24} /> : <Video size={24} />}
                </button>
            </div>
        </motion.div>
    );
};

const Upload: React.FC = () => {
    const [step, setStep] = useState<"media" | "details">("media");
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [caption, setCaption] = useState("");
    const [themes, setThemes] = useState<string[]>([]);
    const [currentTheme, setCurrentTheme] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCamera, setShowCamera] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (files: File[]) => {
        const validFiles = files.filter(
            (file) =>
                file.type.startsWith("image/") || file.type.startsWith("video/")
        );
        if (validFiles.length === 0) {
            toast.error("Unsupported file type.");
            return;
        }
        const newFiles: UploadedFile[] = validFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            type: file.type.startsWith("image/")
                ? "image"
                : ("video" as "image" | "video"),
            themes: []
        }));
        setUploadedFiles((prev) => [...prev, ...newFiles]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) =>
        handleFiles(Array.from(e.target.files || []));
    
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleFiles(Array.from(e.dataTransfer.files));
    };

    const removeFile = (index: number) =>
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

    const handlePhotoCapture = (blob: Blob) => {
        const file = new File([blob], `photo-${Date.now()}.jpg`, {
            type: "image/jpeg",
        });
        setUploadedFiles((prev) => [
            ...prev,
            {
                file,
                preview: URL.createObjectURL(blob),
                type: "image",
                themes: []
            },
        ]);
        setShowCamera(false);
    };

    const handleVideoCapture = (blob: Blob) => {
        const file = new File([blob], `video-${Date.now()}.webm`, {
            type: "video/webm",
        });
        setUploadedFiles((prev) => [
            ...prev,
            {
                file,
                preview: URL.createObjectURL(blob),
                type: "video",
                themes: []
            },
        ]);
        setShowCamera(false);
    };

    const addTheme = () => {
        if (currentTheme.trim() && !themes.includes(currentTheme.trim())) {
            setThemes((prev) => [...prev, currentTheme.trim()]);
            setCurrentTheme("");
        }
    };

    const removeTheme = (themeToRemove: string) =>
        setThemes((prev) => prev.filter((theme) => theme !== themeToRemove));

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const toastId = toast.loading("Publishing post...");

        try {
            let result;
            if (uploadedFiles.length > 1) {
                console.log(caption, " ", themes);
                result = await createPostWithMultipleFiles(
                    caption,
                    themes,
                    uploadedFiles.map((f) => f.file),
                    mediaUrl || undefined
                );
            } else if (uploadedFiles.length === 1) {
                result = await createPost({
                    caption,
                    themes,
                    media_file: uploadedFiles[0].file,
                    media_url: mediaUrl || null,
                });
            } else if (mediaUrl) {
                result = await createPost({
                    caption,
                    themes,
                    media_url: mediaUrl,
                });
            } else {
                throw new Error("No media provided.");
            }

            if (result) {
                toast.success("Post published successfully!", { id: toastId });
                setUploadedFiles([]);
                setCaption("");
                setThemes([]);
                setMediaUrl("");
                setStep("media");
            } else {
                throw new Error("Failed to publish post. Please try again.");
            }
        } catch (error: any) {
            console.error("Error submitting post:", error);
            const errorMessage =
                error.response?.data?.detail ||
                error.message ||
                "An unknown error occurred.";
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceedToDetails =
        uploadedFiles.length > 0 || mediaUrl.trim() !== "";

    const pageVariants = {
        initial: { opacity: 0, x: 50 },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: -50 },
    };

    const pageTransition = { duration: 0.4 };

    return (
        <div className="upload-container">
            <AnimatePresence>
                {showCamera && (
                    <CameraPreview
                        onClose={() => setShowCamera(false)}
                        onPhotoCapture={handlePhotoCapture}
                        onVideoCapture={handleVideoCapture}
                    />
                )}
            </AnimatePresence>

            <div className="container">
                <AnimatePresence mode="wait">
                    {step === "media" && (
                        <motion.div
                            key="media"
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            <h1>Upload Content</h1>
                            <p className="subtitle">
                                Share your moments with the world
                            </p>
                            <div
                                className="drop-zone"
                                onClick={() => fileInputRef.current?.click()}
                                onDragEnter={(e) => e.preventDefault()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    onChange={handleFileSelect}
                                    className="hidden-input"
                                />
                                <div className="drop-zone-icon">
                                    <UploadIcon size={48} />
                                </div>
                                <p className="drop-zone-text-main">
                                    Drop files here or click to browse
                                </p>
                                <p className="drop-zone-text-sub">
                                    Supports Images and Videos
                                </p>
                            </div>
                            <div className="center-flex">
                                <button
                                    onClick={() => setShowCamera(true)}
                                    className="btn"
                                >
                                    <Camera size={20} />
                                    Open Camera
                                </button>
                            </div>
                            {uploadedFiles.length > 0 && (
                                <div className="preview-section">
                                    <h3 className="preview-title">Preview</h3>
                                    <div className="preview-grid">
                                        {uploadedFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="preview-item"
                                            >
                                                {file.type === "image" ? (
                                                    <img
                                                        src={file.preview}
                                                        alt={`preview ${index}`}
                                                    />
                                                ) : (
                                                    <video
                                                        src={file.preview}
                                                        loop
                                                        muted
                                                        autoPlay
                                                        playsInline
                                                    />
                                                )}
                                                <div className="preview-item-overlay">
                                                    <button
                                                        onClick={() =>
                                                            removeFile(index)
                                                        }
                                                        className="btn-delete"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {canProceedToDetails && (
                                <div
                                    className="center-flex"
                                    style={{ marginTop: "2rem" }}
                                >
                                    <button
                                        onClick={() => setStep("details")}
                                        className="btn btn-next"
                                    >
                                        Next <ArrowRight size={22} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                    {step === "details" && (
                        <motion.div
                            key="details"
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                            className="details-grid"
                        >
                            <div className="details-preview">
                                {uploadedFiles.length > 0 && (
                                    <>
                                        {uploadedFiles[0].type === "image" ? (
                                            <img
                                                src={uploadedFiles[0].preview}
                                                alt="preview"
                                            />
                                        ) : (
                                            <video
                                                src={uploadedFiles[0].preview}
                                                controls
                                                autoPlay
                                                loop
                                                playsInline
                                            />
                                        )}
                                    </>
                                )}
                                {mediaUrl && !uploadedFiles.length && (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            height: "100%",
                                            color: "#4b5563",
                                        }}
                                    >
                                        <LinkIcon size={64} />
                                    </div>
                                )}
                            </div>
                            <div className="details-form">
                                <button
                                    onClick={() => setStep("media")}
                                    className="btn-back"
                                >
                                    <ArrowLeft size={20} /> Back
                                </button>
                                <div className="form-group">
                                    <label>Caption</label>
                                    <textarea
                                        value={caption}
                                        onChange={(e) =>
                                            setCaption(e.target.value)
                                        }
                                        placeholder="Describe your post..."
                                        className="form-textarea"
                                        rows={4}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Themes</label>
                                    <div className="theme-input-group">
                                        <input
                                            type="text"
                                            value={currentTheme}
                                            onChange={(e) =>
                                                setCurrentTheme(e.target.value)
                                            }
                                            onKeyPress={(e) =>
                                                e.key === "Enter" && addTheme()
                                            }
                                            placeholder="Add themes..."
                                            className="form-input"
                                        />
                                        <button onClick={addTheme}>Add</button>
                                    </div>
                                    <div className="theme-tags">
                                        {themes.map((theme) => (
                                            <span
                                                key={theme}
                                                className="theme-tag"
                                            >
                                                {theme}
                                                <button
                                                    onClick={() =>
                                                        removeTheme(theme)
                                                    }
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Media URL (Optional)</label>
                                    <input
                                        type="url"
                                        value={mediaUrl}
                                        onChange={(e) =>
                                            setMediaUrl(e.target.value)
                                        }
                                        placeholder="https://example.com/media"
                                        className="form-input"
                                    />
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="btn btn-next"
                                >
                                    {isSubmitting
                                        ? "Publishing..."
                                        : "Publish Post"}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Upload;
