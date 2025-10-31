"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";
import ENV from "@/config";

export interface User {
    id: string;
    username: string;
    full_name: string;
    bio: string;
    profile_picture: string;
    body_type: string;
    height: number;
    weight: number;
    themes: string[];
    followers_count: number;
    following_count: number;
    posts_count: number;
}

interface UserProfileProps {
    // user?: User;
    id?: string;
    role: "owner" | "creator";
}

export default function UserProfile({ id, role }: UserProfileProps) {
    // 49945347-5fe4-4f86-bd9f-7220f2c9be68
    const [user, setUser] = useState<null | User>(null);
    const [follow, setFollow] = useState(false);
    console.log("latest user ==> ", user);
    useEffect(() => {
        const apiRequest = async () => {
            const response = await apiClient.get(`/profile/profile/${id}`);
            console.log("creator response 1 ==> ", response);
            setUser(response.data);
        };
        const apiRequest2 = async () => {
            const response = await apiClient.get(`/profile/profile`);
            console.log("owner response 2 ==> ", response);
            setUser(response.data);
        };

        if (role === "creator") {
            apiRequest();
        } else {
            apiRequest2();
        }
    }, [id, follow]);

    const handleFollow = async () => {
        try {
            const profile = await apiClient.get(`/profile/profile`);
            if (follow) {
                const unfollowProfile = await apiClient.delete(
                    `/follow/follow/${id}/`,
                    {
                        user_id: profile.data.id,
                    }
                );
                console.log("undollow ==> ", unfollowProfile);
                if (unfollowProfile.status === 200) {
                    setFollow(false);
                    toast.success(
                        `You successfully unfollowed ${user?.username} `
                    );
                }
            } else {
                console.log("profile ==> ", profile);
                const response = await apiClient.post(`/follow/follow/${id}/`, {
                    user_id: profile.data.id,
                });
                console.log("follow ==> ", response);
                if (response.status === 200) {
                    setFollow(true);
                    toast.success(
                        `You successfully followed ${user?.username} `
                    );
                }
            }
        } catch (err) {
            console.error("Failed:", err);
        }
    };
    return (
        <div className="border-b border-border bg-background">
            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                {/* Header with more options */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-foreground">
                        {user?.username}
                    </h1>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-6 h-6" />
                    </Button>
                </div>

                {/* Profile info section */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                    {/* Profile picture */}
                    <div className="flex justify-center md:justify-start">
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-balance">
                            {user?.profile_picture ? (
                                <img
                                    src={`${ENV.BASE_URL}/${user?.profile_picture}`}
                                    alt={user?.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-6xl text-secondary h-full w-full rounded-full flex items-center justify-center">
                                    PP
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile details */}
                    <div className="flex-1">
                        {/* Name and action buttons */}
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                                {user?.full_name}
                            </h2>
                            {role === "creator" ? (
                                <>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleFollow}
                                            className="bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90"
                                        >
                                            {follow ? "Following" : "Follow"}
                                        </Button>
                                        {/* <Button variant="outline">Message</Button> */}
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 mb-6">
                            <div className="text-center md:text-left">
                                <p className="text-xl md:text-2xl font-bold text-foreground">
                                    {user?.posts_count}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Posts
                                </p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-xl md:text-2xl font-bold text-foreground">
                                    {user?.followers_count.toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Followers
                                </p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-xl md:text-2xl font-bold text-foreground">
                                    {user?.following_count}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Following
                                </p>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="mb-4">
                            <p className="text-foreground text-sm md:text-base leading-relaxed">
                                {user?.bio}
                            </p>
                        </div>

                        {/* Themes/Interests */}
                        <div className="flex flex-wrap gap-2">
                            {user?.themes.map((theme) => (
                                <span
                                    key={theme}
                                    className="px-3 py-1 bg-secondary text-secondary-foreground text-xs md:text-sm rounded-full"
                                >
                                    {theme}
                                </span>
                            ))}
                        </div>

                        {/* Additional info */}
                        <div className="mt-4 text-xs md:text-sm text-muted-foreground space-y-1">
                            <p>Height: {user?.height} cm</p>
                            <p>Body Type: {user?.body_type}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
