"use client";

import ENV from "@/config";
import apiClient from "@/services/apiClient";
import { useState, useEffect, useRef } from "react";
import { FaRegComment } from "react-icons/fa";

interface Comment {
    id: number;
    user_id: string;
    username: string;
    text: string;
    created_at: string;
}

interface CommentsResponse {
    comments: Comment[];
    total: number;
    offset: number;
    limit: number;
}

interface CommentsPopoverProps {
    postId: string | number;
    commentsCount?: number;
}

export function CommentsPopover({
    postId,
    commentsCount,
}: CommentsPopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const fetchComments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                console.log("comment1");
                const response = await apiClient.get(
                    "/content/interactions/comments/",
                    { params: { post_id: postId } }
                );
                console.log("comments ==> ", response);
                // const data: CommentsResponse = await response.json();
                setComments(response.data.comments);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
                console.log("error ==> ", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [isOpen, postId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative inline-block">
            {/* Comment Button */}
            <div className="flex flex-col">
                <button
                    ref={buttonRef}
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white border-1 h-13 w-13 rounded-full items-center justify-center flex  hover:scale-[1.01] transition cursor-pointer"
                    aria-label="Comment on post"
                >
                    {/* <svg
                    className="feed-action-count"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg> */}
                    <FaRegComment />
                </button>
                <span className="text-center text-white text-sm font-semibold">
                    {comments.length > 0 ? comments.length : 0}
                </span>
            </div>

            {/* Popover */}
            {isOpen && (
                <div
                    ref={popoverRef}
                    className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-lg z-50 flex flex-col max-h-96 overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-border flex-shrink-0">
                        <h3 className="font-semibold text-sm text-foreground">
                            Comments
                        </h3>
                    </div>

                    {/* Comments List */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full py-8">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-muted-foreground border-t-foreground rounded-full animate-spin" />
                                    <span className="text-xs text-muted-foreground">
                                        Loading comments...
                                    </span>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center h-full px-4 py-8">
                                <div className="text-center">
                                    <p className="text-sm text-destructive font-medium">
                                        Error loading comments
                                    </p>
                                    {/* <p className="text-xs text-muted-foreground mt-1">
                                        {error}
                                    </p> */}
                                </div>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full px-4 py-8">
                                <svg
                                    className="w-12 h-12 text-muted-foreground mb-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                                <p className="text-sm text-foreground font-medium">
                                    No comments yet
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Be the first to comment
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="px-4 py-3 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex gap-3">
                                            {/* Avatar */}
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex-shrink-0 flex items-center justify-center">
                                                <span className="text-xs font-semibold text-primary-foreground">
                                                    {comment.username
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Comment Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-sm font-semibold text-foreground">
                                                        {comment.username}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDate(
                                                            comment.created_at
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground mt-1 break-words">
                                                    {comment.text}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
