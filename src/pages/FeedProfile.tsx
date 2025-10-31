"use client";

import PostGrid from "@/components/post-grid";
import UserProfile from "@/components/user-profile";
import { useState } from "react";
import { useParams } from "react-router-dom";

// Dummy user data
const dummyUser = {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    username: "sarah_chen",
    full_name: "Sarah Chen",
    bio: "Designer & photographer | Coffee enthusiast ☕ | Exploring the world one frame at a time",
    profile_picture: "/profile-picture-woman.jpg",
    body_type: "Athletic",
    height: 170,
    weight: 65,
    themes: ["Photography", "Travel", "Design"],
    followers_count: 2543,
    following_count: 487,
    posts_count: 128,
};

// Dummy posts data
const dummyPosts = [
    {
        id: 1,
        author_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        author_username: "sarah_chen",
        media_url: "/sunset-beach-photography.jpg",
        caption: "Golden hour at the beach 🌅",
        themes: ["Photography", "Travel"],
        created_at: "2025-10-28T10:30:00.000Z",
        likes_count: 342,
        comments_count: 28,
        saves_count: 45,
        shares_count: 12,
        liked: true,
        saved: true,
    },
    {
        id: 2,
        author_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        author_username: "sarah_chen",
        media_url: "/majestic-mountain-vista.png",
        caption: "Mountain views never get old",
        themes: ["Travel", "Photography"],
        created_at: "2025-10-26T14:15:00.000Z",
        likes_count: 521,
        comments_count: 42,
        saves_count: 67,
        shares_count: 18,
        liked: false,
        saved: false,
    },
    {
        id: 3,
        author_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        author_username: "sarah_chen",
        media_url: "/urban-street-photography.jpg",
        caption: "City lights and late nights",
        themes: ["Photography"],
        created_at: "2025-10-24T18:45:00.000Z",
        likes_count: 289,
        comments_count: 19,
        saves_count: 38,
        shares_count: 8,
        liked: true,
        saved: false,
    },
    {
        id: 4,
        author_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        author_username: "sarah_chen",
        media_url: "/coffee-latte-art.jpg",
        caption: "My happy place ☕",
        themes: ["Design"],
        created_at: "2025-10-22T09:20:00.000Z",
        likes_count: 198,
        comments_count: 15,
        saves_count: 22,
        shares_count: 5,
        liked: false,
        saved: true,
    },
    {
        id: 5,
        author_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        author_username: "sarah_chen",
        media_url: "/forest-nature-walk.jpg",
        caption: "Nature therapy 🌿",
        themes: ["Travel", "Photography"],
        created_at: "2025-10-20T11:00:00.000Z",
        likes_count: 456,
        comments_count: 34,
        saves_count: 52,
        shares_count: 14,
        liked: true,
        saved: true,
    },
    {
        id: 6,
        author_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        author_username: "sarah_chen",
        media_url: "/design-workspace.jpg",
        caption: "Creative workspace setup",
        themes: ["Design"],
        created_at: "2025-10-18T16:30:00.000Z",
        likes_count: 312,
        comments_count: 26,
        saves_count: 41,
        shares_count: 11,
        liked: false,
        saved: false,
    },
];

export default function FeedProfile() {
    const { id } = useParams<{ id: string }>();
    // const [selectedUser, setSelectedUser] = useState(dummyUser);

    return (
        <main className="min-h-screen bg-background">
            <UserProfile id={id} role="creator" />
            <PostGrid id={id} />
        </main>
    );
}
