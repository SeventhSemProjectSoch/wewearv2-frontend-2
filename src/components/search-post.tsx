"use client";

import type React from "react";

import { useState } from "react";
import { Search } from "lucide-react";
import apiClient from "@/services/apiClient";
import PostCard from "./post-card";
import type { Post } from "./post-grid";

export const allPosts: Post[] = [
    {
        id: 1,
        author_id: "user_001",
        author_username: "ashura",
        media_url: "/media/post1.jpg",
        caption: "Chasing dreams, one step at a time 🌟",
        themes: ["motivation", "lifestyle"],
        created_at: "2025-01-21T10:32:00Z",
        likes_count: 230,
        comments_count: 18,
        saves_count: 45,
        shares_count: 9,
        liked: true,
        saved: false,
    },
    {
        id: 2,
        author_id: "user_002",
        author_username: "explorer_jane",
        media_url: "/media/post2.jpg",
        caption: "Lost in the mountains ⛰️✨",
        themes: ["travel", "nature"],
        created_at: "2025-01-22T08:12:00Z",
        likes_count: 520,
        comments_count: 33,
        saves_count: 120,
        shares_count: 22,
        liked: false,
        saved: true,
    },
    {
        id: 3,
        author_id: "user_003",
        author_username: "fit_with_aarav",
        media_url: "/media/post3.jpg",
        caption: "No excuses 💪 Grind continues!",
        themes: ["fitness", "motivation"],
        created_at: "2025-01-23T14:50:00Z",
        likes_count: 890,
        comments_count: 76,
        saves_count: 210,
        shares_count: 50,
        liked: true,
        saved: true,
    },
    {
        id: 4,
        author_id: "user_004",
        author_username: "foodielife",
        media_url: "/media/post4.jpg",
        caption: "Best ramen in town 🍜🔥",
        themes: ["food", "lifestyle"],
        created_at: "2025-01-24T12:10:00Z",
        likes_count: 430,
        comments_count: 21,
        saves_count: 98,
        shares_count: 14,
        liked: false,
        saved: false,
    },
    {
        id: 5,
        author_id: "user_005",
        author_username: "tech_guy",
        media_url: "/media/post5.jpg",
        caption: "AI is not the future — it’s the present 🤖",
        themes: ["tech", "innovation"],
        created_at: "2025-01-25T15:00:00Z",
        likes_count: 650,
        comments_count: 44,
        saves_count: 190,
        shares_count: 75,
        liked: true,
        saved: true,
    },
    {
        id: 6,
        author_id: "user_006",
        author_username: "artist_mia",
        media_url: "/media/post6.jpg",
        caption: "Colors speak where words fail 🎨",
        themes: ["art", "creativity"],
        created_at: "2025-01-26T09:25:00Z",
        likes_count: 780,
        comments_count: 55,
        saves_count: 140,
        shares_count: 30,
        liked: false,
        saved: true,
    },
    {
        id: 7,
        author_id: "user_007",
        author_username: "coder_sam",
        media_url: "/media/post7.jpg",
        caption: "Fix one bug, get two for free 🤡",
        themes: ["coding", "humor"],
        created_at: "2025-01-27T18:40:00Z",
        likes_count: 300,
        comments_count: 12,
        saves_count: 50,
        shares_count: 8,
        liked: false,
        saved: false,
    },
    {
        id: 8,
        author_id: "user_008",
        author_username: "travel_soul",
        media_url: "/media/post8.jpg",
        caption: "Golden hour hits different 🌅",
        themes: ["travel", "photography"],
        created_at: "2025-01-28T07:45:00Z",
        likes_count: 910,
        comments_count: 68,
        saves_count: 260,
        shares_count: 40,
        liked: true,
        saved: true,
    },
    {
        id: 9,
        author_id: "user_009",
        author_username: "minimalist_lee",
        media_url: "/media/post9.jpg",
        caption: "Less but better ✨",
        themes: ["minimalism", "design"],
        created_at: "2025-01-29T11:00:00Z",
        likes_count: 410,
        comments_count: 29,
        saves_count: 90,
        shares_count: 18,
        liked: false,
        saved: true,
    },
    {
        id: 10,
        author_id: "user_010",
        author_username: "daily_quotes",
        media_url: "/media/post10.jpg",
        caption: "Progress > Perfection ✅",
        themes: ["quotes", "self_growth"],
        created_at: "2025-01-30T17:22:00Z",
        likes_count: 720,
        comments_count: 31,
        saves_count: 160,
        shares_count: 60,
        liked: true,
        saved: false,
    },
];

export default function SearchPosts() {
    const [searchQuery, setSearchQuery] = useState("");

    const [searchPost, setSearchPost] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log("Searching for:", searchQuery);
            const searchResult = await apiClient.get(`/search/posts/`, {
                params: {
                    q: searchQuery,
                },
            });

            console.log("search results ==> ", searchQuery);
            // setSearchPost(searchResult.data)
        }
    };

    return (
        <>
            <div className="  flex flex-col items-center justify-center px-4  mt-20">
                {/* Title */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bold text-black mb-2">
                        Search Posts
                    </h1>
                    <p className="text-gray-600 text-base">
                        Find the posts you're looking for
                    </p>
                </div>

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="w-full max-w-2xl flex gap-2"
                >
                    <div className="flex items-center bg-white border flex-1 border-gray-300 rounded-full px-6 py-3 shadow-sm hover:shadow-md hover:border-gray-400 transition-all">
                        <Search className="w-5 h-5 text-gray-400 mr-3" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search posts..."
                            className="flex-1 outline-none text-gray-900 placeholder-gray-500 bg-transparent text-base"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-2xl px-4 cursor-pointer md:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    >
                        Search
                    </button>
                </form>

                {/* Suggestions */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 mb-4">
                        Popular searches:
                    </p>
                    <div className="flex gap-3 flex-wrap justify-center">
                        {["Fitness", "Travel", "Technology", "Lifestyle"].map(
                            (suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => setSearchQuery(suggestion)}
                                    className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    {suggestion}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 py-12  mr-40 ">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* {searchPost?.map((post) => ( */}
                    {allPosts?.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </>
    );
}
