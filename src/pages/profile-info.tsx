import PostGrid from "@/components/post-grid";
import UserProfile, { type User } from "@/components/user-profile";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";

function ProfileInfo() {
    const [owner, setOwner] = useState<User>();

    useEffect(() => {
        const apiRequest2 = async () => {
            const response = await apiClient.get(`/profile/profile`);
            // console.log("owner response 2 ==> ", response);
            setOwner(response.data);
        };

        apiRequest2();
    }, []);

    // console.log("owner id = ", owner?.id);
    return (
        <main className="min-h-screen bg-background">
            <UserProfile role="owner" />
            <PostGrid id={owner?.id} />
        </main>
    );
}

export default ProfileInfo;
