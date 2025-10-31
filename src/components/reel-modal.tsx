"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import ENV from "@/config";
import { Media } from "./CostumeTags";
import apiClient from "@/services/apiClient";
import type { User } from "./user-profile";

interface Comment {
    id: number;
    user_id: string;
    username: string;
    text: string;
    created_at: string;
}

const DUMMY_COMMENTS: Comment[] = [
    {
        id: 0,
        user_id: "user_1",
        username: "heydom7",
        text: "sparky BOOM!!!",
        created_at: "2025-10-24T10:00:00.000Z",
    },
    {
        id: 1,
        user_id: "user_2",
        username: "luke.newman35013",
        text: "Clash royale players when someone uses a card",
        created_at: "2025-10-24T05:00:00.000Z",
    },
    {
        id: 2,
        user_id: "user_3",
        username: "afridged",
        text: "Who gave bowler a phone 😍😍😍😍",
        created_at: "2025-10-26T08:00:00.000Z",
    },
    {
        id: 3,
        user_id: "user_4",
        username: "mr.sparky0",
        text: "🥰🥰🥰🥰",
        created_at: "2025-10-24T10:00:00.000Z",
    },
    {
        id: 4,
        user_id: "user_5",
        username: "avivgardy",
        text: "The smartest sparky main",
        created_at: "2025-10-24T10:00:00.000Z",
    },
    {
        id: 5,
        user_id: "user_6",
        username: "gaming.pro",
        text: "This is insane!",
        created_at: "2025-10-23T10:00:00.000Z",
    },
];

interface ReelModalProps {
    isOpen: boolean;
    onClose: () => void;
    author_username: string;
    postID: number;
    media_url: string;
    author_id: string;
}

export function ReelModal({
    isOpen,
    onClose,
    author_username,
    postID,
    media_url,
    author_id,
}: ReelModalProps) {
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const commentsEndRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<User | null>(null);

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [comments]);

    useEffect(() => {
        const apiRequest = async () => {
            const response = await apiClient.get(
                `/profile/profile/${author_id}`
            );
            console.log("creator response author ==> ", response);
            setUser(response.data);
        };
        apiRequest();
    }, [author_id]);

    const handlePostComment = async () => {
        if (commentText.trim()) {
            const newComment: Comment = {
                id: comments.length,
                user_id: "current_user",
                username: "yourname",
                text: commentText,
                created_at: new Date().toISOString(),
            };
            console.log("This is the comment ==> ", newComment);
            const postComment = await apiClient.post(
                `/content/interactions/comment/`,
                {
                    post_id: postID,
                    text: newComment.text,
                }
            );
            // console.log("post comment ==> ", postComment);

            setComments([...comments, postComment.data]);
            setCommentText("");
        }
    };

    useEffect(() => {
        const fetchComment = async () => {
            const allComments = await apiClient.get(
                `/content/interactions/comments`,
                {
                    params: {
                        post_id: postID,
                    },
                }
            );

            // console.log("all comments ==> ", allComments);
            setComments(allComments.data.comments);
        };

        fetchComment();
    }, [postID]);

    const formatTimeAgo = (dateString: string): string => {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return "now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
        if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w`;

        return `${Math.floor(seconds / 2592000)}mo`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl w-full max-w-4xl h-[90vh] flex">
                <div className="w-1/2 bg-black flex items-center justify-center relative">
                    {/* <video
                        className="w-full h-full object-cover"
                        controls
                        src={`${media_url}`}
                    >
                        Your browser does not support the video tag.
                    </video> */}
                    <Media src={media_url || ""} />
                </div>

                <div className="w-1/2 bg-white flex flex-col relative">
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-2 p-1 hover:bg-gray-100 rounded-full z-10 transition-colors"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>

                    {/* Username section */}
                    <div className="border-b p-4 px-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex-shrink-0">
                                <img
                                    src={`${ENV.BASE_URL}/${user?.profile_picture}`}
                                    alt=""
                                    className="h-full w-full object-cover rounded-full"
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">
                                    {author_username}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Original audio
                                </p>
                            </div>
                        </div>
                        {/* <button className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition-colors">
                            Follow
                        </button> */}
                    </div>

                    {/* Comments section - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {comments.length > 0 ? (
                            <>
                                {" "}
                                {comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="flex gap-3 pb-4 border-b last:border-b-0"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold text-sm">
                                                    {comment.username}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatTimeAgo(
                                                        comment.created_at
                                                    )}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-800 break-words">
                                                {comment.text}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <button className="text-gray-500 hover:text-red-500 transition-colors text-xs font-semibold">
                                                    ♥ Like
                                                </button>
                                                <button className="text-gray-500 hover:text-blue-500 transition-colors text-xs font-semibold">
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                <div className="flex-1 flex flex-col items-center justify-center p-8">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="w-12 h-12 text-gray-300 mb-3"
                                    >
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                    <p className="text-sm font-semibold text-gray-600 mb-1">
                                        No comments yet
                                    </p>
                                    <span className="text-xs text-gray-500">
                                        Be the first to comment!
                                    </span>
                                </div>
                            </>
                        )}

                        <div ref={commentsEndRef} />
                    </div>

                    {/* Comment input section */}
                    <div className="border-t p-4 bg-white">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        handlePostComment();
                                    }
                                }}
                                placeholder="Add a comment..."
                                className="flex-1 outline-none text-sm placeholder-gray-400"
                            />
                            <button
                                onClick={handlePostComment}
                                disabled={!commentText.trim()}
                                className={`font-semibold text-sm transition-colors ${
                                    commentText.trim()
                                        ? "text-blue-500 hover:text-blue-600 cursor-pointer"
                                        : "text-gray-300 cursor-not-allowed"
                                }`}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
