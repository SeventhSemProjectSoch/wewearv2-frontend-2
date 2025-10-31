"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Media } from "./CostumeTags";
import { ReelModal } from "./reel-modal";

interface Post {
    id: number;
    author_id: string;
    author_username: string;
    media_url: string;
    caption: string;
    themes: string[];
    created_at: string;
    likes_count: number;
    comments_count: number;
    saves_count: number;
    shares_count: number;
    liked: boolean;
    saved: boolean;
}

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    const [liked, setLiked] = useState(post.liked);
    const [saved, setSaved] = useState(post.saved);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [isOpenReel, setIsOpenReel] = useState(false);

    const handleLike = () => {
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    };

    const handleSave = () => {
        setSaved(!saved);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return `${Math.floor(diffDays / 30)}m ago`;
    };

    console.log("modal wala post ==> ", post);

    return (
        <>
            <div
                className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300"
                onClick={() => setIsOpenReel(true)}
            >
                {/* Post image */}
                <div className="relative w-full aspect-square overflow-hidden bg-muted group cursor-pointer border-2 flex items-center justify-center">
                    {/* <img
                    src={post.media_url || "/placeholder.svg"}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                /> */}
                    <Media
                        src={post.media_url}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        enableIntersectionAutoplay={false}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center gap-8 opacity-0 group-hover:opacity-100">
                        <div className="flex items-center gap-2 text-white">
                            <Heart className="w-6 h-6" fill="white" />
                            <span className="font-semibold">{likesCount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                            <MessageCircle className="w-6 h-6" />
                            <span className="font-semibold">
                                {post.comments_count}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Post info */}
                <div className="p-4">
                    {/* Caption */}
                    <p className="text-sm text-foreground mb-3 line-clamp-2">
                        <span className="font-semibold">
                            {post.author_username}
                        </span>{" "}
                        {post.caption}
                    </p>

                    {/* Themes */}
                    {post.themes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {post.themes.map((theme) => (
                                <span
                                    key={theme}
                                    className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                                >
                                    #{theme}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Engagement stats */}
                    <p className="text-xs text-muted-foreground mb-3">
                        {formatDate(post.created_at)}
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLike}
                            className="flex-1 gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <Heart
                                className="w-4 h-4"
                                fill={liked ? "currentColor" : "none"}
                                color={liked ? "#ef4444" : "currentColor"}
                            />
                            <span className="text-xs">{likesCount}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs">
                                {post.comments_count}
                            </span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="text-xs">{post.shares_count}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSave}
                            className="flex-1 gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <Bookmark
                                className="w-4 h-4"
                                fill={saved ? "currentColor" : "none"}
                                color={saved ? "#3b82f6" : "currentColor"}
                            />
                        </Button>
                    </div>
                </div>
            </div>
            <ReelModal
                isOpen={isOpenReel}
                onClose={() => setIsOpenReel(false)}
                author_username={post.author_username}
                postID={post.id}
                media_url={post.media_url}
                author_id={post.author_id}
            />
        </>
    );
}
