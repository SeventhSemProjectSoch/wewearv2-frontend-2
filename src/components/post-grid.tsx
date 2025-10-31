"use client";

import { useEffect, useState } from "react";
import PostCard from "./post-card";
import apiClient from "@/services/apiClient";

// import PostCard from "./post-card";

export interface Post {
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

interface PostGridProps {
    // posts: Post[];
    id?: string;
}

export default function PostGrid({ id }: PostGridProps) {
    const [allPost, setAllPost] = useState<Post[]>([]);

    useEffect(() => {
        console.log("owner id 2 ==> ", id);
        const apiRequest2 = async () => {
            const apiAllPost = await apiClient.get(`/content/posts/user/${id}`);
            console.log("body type ==> ", apiAllPost);
            setAllPost(apiAllPost.data);
        };

        apiRequest2();
    }, [id]);

    console.log("owner id 1 ==> ", id);
    console.log("owner data ==> ", allPost);
    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Section title */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground uppercase tracking-wider">
                    Posts
                </h3>
                <div className="h-1 w-12 bg-primary mt-2"></div>
            </div>

            {/* Posts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allPost?.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
