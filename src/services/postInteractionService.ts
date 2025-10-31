import apiClient from "./apiClient";
import type { Comment } from "./types";

export const likePost = (postId: number) => {
    return apiClient.post("/content/interactions/like/", null, {
        params: { post_id: postId },
    });
};

export const savePost = (postId: number) => {
    return apiClient.post("/content/interactions/save/", null, {
        params: { post_id: postId },
    });
};

export const commentPost = (postId: number, text: string): Promise < Comment > => {
    return apiClient
        .post("/content/interactions/comment/", { post_id: postId, text })
        .then((res) => res.data);
};

export const sharePost = (postId: number): Promise < { slug: string } > => {
    return apiClient
        .post("/content/interactions/share/", { post_id: postId })
        .then((res) => res.data);
};

export const getComments = (postId: number): Promise<Comment[]> => {
    return apiClient
        .get("/content/interactions/comments/", {
            params: { post_id: postId },
        })
        .then((res) => res.data);
};