"use client";

import type React from "react";
import "./feed.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { getFeed, getUploadFeed } from "@/services/feedService";
import type { Post, FeedType } from "@/services/types";
import { Media } from "@/components/CostumeTags";
import {
    likePost,
    savePost,
    commentPost,
    sharePost,
} from "@/services/postInteractionService";
import { useLoader } from "@/context/LoaderContext";
import toast from "react-hot-toast";
import "./feed.css";
import { CommentsPopover } from "@/components/ui/comment-popover";
import { Link } from "react-router-dom";

interface Props {
    feedType: FeedType;
}

const Feed: React.FC<Props> = ({ feedType }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [message, setMessage] = useState<string>("");
    const { showLoader, hideLoader } = useLoader();
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPostIndex, setCurrentPostIndex] = useState(0);
    // const buttonRef = useRef<HTMLButtonElement>(null);

    // Refs for scroll management
    const postRefs = useRef<{ [key: string]: HTMLDivElement }>({});
    const isScrollingRef = useRef(false);
    const lastScrollTime = useRef(0);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const PAGE_SIZE = 5;

    // Fetch feed logic
    const fetchFeed = useCallback(
        async (isInitialLoad = false) => {
            if (isLoading || !hasMore) return;
            setIsLoading(true);

            if (isInitialLoad) {
                showLoader();
            }

            try {
                if (feedType === "upload") {
                    const data = await getUploadFeed(offset, PAGE_SIZE);
                    const newPosts = data.posts;

                    setPosts((prevPosts) => {
                        const existingIds = new Set(prevPosts.map((p) => p.id));
                        const uniqueNewPosts = newPosts.filter(
                            (p) => !existingIds.has(p.id)
                        );
                        return isInitialLoad
                            ? newPosts
                            : [...prevPosts, ...uniqueNewPosts];
                    });

                    setOffset((prevOffset) => prevOffset + PAGE_SIZE);
                    setHasMore(newPosts.length === PAGE_SIZE);
                } else {
                    const data = await getFeed(feedType);
                    console.log("data ==> ", data);
                    if ("detail" in data) {
                        setMessage(data.detail);
                        setHasMore(false);
                    } else {
                        const singlePost = data as Post;
                        setPosts((prevPosts) => {
                            const existingIds = new Set(
                                prevPosts.map((p) => p.id)
                            );
                            if (existingIds.has(singlePost.id))
                                return prevPosts;
                            return [...prevPosts, singlePost];
                        });
                        setHasMore(true);
                    }
                }
            } catch (error) {
                toast.error("Failed to load feed");
                console.error("Feed fetch error:", error);
            } finally {
                setIsLoading(false);
                if (isInitialLoad) {
                    hideLoader();
                }
            }
        },
        [feedType, isLoading, hasMore, offset, showLoader, hideLoader]
    );

    // Reset on feed type change
    useEffect(() => {
        setPosts([]);
        setOffset(0);
        setHasMore(true);
        setMessage("");
        setCurrentPostIndex(0);
        setIsLoading(false);
        postRefs.current = {};

        fetchFeed(true);
    }, [feedType]);

    // Intersection observer for post visibility and infinite scroll
    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const postElement = entry.target as HTMLElement;
                        const postIndex = Number.parseInt(
                            postElement.dataset.postIndex || "0"
                        );
                        setCurrentPostIndex(postIndex);

                        // Trigger fetch when approaching end
                        if (
                            postIndex >= posts.length - 2 &&
                            hasMore &&
                            !isLoading
                        ) {
                            fetchFeed();
                        }
                    }
                });
            },
            {
                threshold: 0.5,
                rootMargin: "0px 0px 200px 0px", // Start loading before reaching the end
            }
        );

        // Observe all post elements
        Object.values(postRefs.current).forEach((postRef) => {
            if (postRef) observerRef.current?.observe(postRef);
        });

        // Observe sentinel for infinite scroll
        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current);
        }

        return () => {
            observerRef.current?.disconnect();
        };
    }, [posts, hasMore, isLoading, fetchFeed]);

    const handleLike = useCallback((post: Post) => {
        likePost(post.id)
            .then(() => {
                setPosts((prev) =>
                    prev.map((p) =>
                        p.id === post.id
                            ? {
                                  ...p,
                                  liked: !p.liked,
                                  likes_count:
                                      p.likes_count + (post.liked ? -1 : 1),
                              }
                            : p
                    )
                );
            })
            .catch(() => toast.error("Failed to like post"));
    }, []);

    const handleSave = useCallback((post: Post) => {
        savePost(post.id)
            .then(() => {
                setPosts((prev) =>
                    prev.map((p) =>
                        p.id === post.id
                            ? {
                                  ...p,
                                  saved: !p.saved,
                                  saves_count:
                                      p.saves_count + (post.saved ? -1 : 1),
                              }
                            : p
                    )
                );
            })
            .catch(() => toast.error("Failed to save post"));
    }, []);

    const handleComment = useCallback((post: Post, text: string) => {
        console.log("comment ==> ", text);
        if (!text.trim()) return;
        commentPost(post.id, text)
            .then(() => {
                toast.success("Comment posted");
            })
            .catch(() => toast.error("Failed to post comment"));
    }, []);

    const handleShare = useCallback((post: Post) => {
        sharePost(post.id)
            .then(({ slug }) => {
                navigator.clipboard.writeText(
                    `${window.location.origin}/api/content/share/${slug}/`
                );
                toast.success("Share link copied!");
            })
            .catch(() => toast.error("Failed to share post"));
    }, []);

    if (message && posts.length === 0)
        return (
            <div className="feed-message-container">
                <p className="feed-message-text">{message}</p>
            </div>
        );

    if (posts.length === 0 && !isLoading)
        return (
            <div className="feed-empty-state">
                <svg
                    className="feed-empty-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
                <p className="feed-empty-text">No posts available</p>
            </div>
        );

    return (
        <div className="feed-container">
            <div className="feed-wrapper">
                {posts.map((post, index) => (
                    <div
                        key={post.id}
                        className="feed-post"
                        ref={(el) => {
                            if (el) postRefs.current[post.id] = el;
                        }}
                        data-post-index={index}
                    >
                        <div className="feed-post-inner">
                            {/* Media Container */}
                            <div className="feed-media-container">
                                <div className="feed-media">
                                    <Media src={post.media_url || ""} />
                                </div>

                                {/* Media Overlay Content */}
                                <div className="feed-overlay">
                                    {/* Author Info - Left Bottom */}
                                    <div className="feed-content-left">
                                        <div className="feed-author ">
                                            <div className="feed-author-avatar">
                                                <span className="feed-author-initial">
                                                    {(
                                                        post.author_username ||
                                                        "U"
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                            <Link
                                                to={`/feed-profile/${post.author_id}`}
                                                className="feed-author-info  cursor-pointer"
                                            >
                                                <h3 className="feed-author-username">
                                                    @
                                                    {post.author_username ||
                                                        "unknown"}
                                                </h3>
                                            </Link>
                                        </div>

                                        {/* Caption */}
                                        {post.caption && (
                                            <div className="feed-caption">
                                                <p className="feed-caption-text">
                                                    {post.caption}
                                                </p>
                                            </div>
                                        )}

                                        {/* Themes */}
                                        {post.themes.filter(Boolean).length >
                                            0 && (
                                            <div className="feed-themes">
                                                {post.themes
                                                    .filter(Boolean)
                                                    .map(
                                                        (theme, themeIndex) => (
                                                            <span
                                                                key={themeIndex}
                                                                className="feed-theme-tag"
                                                            >
                                                                #{theme}
                                                            </span>
                                                        )
                                                    )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons - Right Side */}
                                    <div className="feed-actions">
                                        <div className="feed-actions-container">
                                            {/* Like Button */}
                                            <div className="feed-action-item">
                                                <button
                                                    className={`feed-action-btn feed-like-btn ${
                                                        post.liked
                                                            ? "feed-action-active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleLike(post)
                                                    }
                                                    aria-label="Like post"
                                                >
                                                    <svg
                                                        className="feed-action-icon"
                                                        viewBox="0 0 24 24"
                                                        fill={
                                                            post.liked
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                    </svg>
                                                </button>
                                                <span className="feed-action-count">
                                                    {post.likes_count}
                                                </span>
                                            </div>

                                            {/* Comment Button */}
                                            <div className="feed-action-item   ">
                                                {/* <button
                                                    className="feed-action-btn feed-comment-btn"
                                                    aria-label="Comment on post"
                                                >
                                                    <svg
                                                        className="feed-action-icon"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                    </svg>
                                                </button>
                                                <span className="feed-action-count">
                                                    {post.comments_count || 0}
                                                </span> */}
                                                <CommentsPopover
                                                    postId={post.id}
                                                />
                                            </div>

                                            {/* Save Button */}
                                            <div className="feed-action-item">
                                                <button
                                                    className={`feed-action-btn feed-save-btn ${
                                                        post.saved
                                                            ? "feed-action-active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleSave(post)
                                                    }
                                                    aria-label="Save post"
                                                >
                                                    <svg
                                                        className="feed-action-icon"
                                                        viewBox="0 0 24 24"
                                                        fill={
                                                            post.saved
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                                    </svg>
                                                </button>
                                                <span className="feed-action-count">
                                                    {post.saves_count}
                                                </span>
                                            </div>

                                            {/* Share Button */}
                                            <div className="feed-action-item">
                                                <button
                                                    className="feed-action-btn feed-share-btn"
                                                    onClick={() =>
                                                        handleShare(post)
                                                    }
                                                    aria-label="Share post"
                                                >
                                                    <svg
                                                        className="feed-action-icon"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <circle
                                                            cx="18"
                                                            cy="5"
                                                            r="3"
                                                        />
                                                        <circle
                                                            cx="6"
                                                            cy="12"
                                                            r="3"
                                                        />
                                                        <circle
                                                            cx="18"
                                                            cy="19"
                                                            r="3"
                                                        />
                                                        <line
                                                            x1="8.59"
                                                            y1="13.51"
                                                            x2="15.42"
                                                            y2="17.49"
                                                        />
                                                        <line
                                                            x1="15.41"
                                                            y1="6.51"
                                                            x2="8.59"
                                                            y2="10.49"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comment Input */}
                            <div className="feed-comment-section">
                                <form
                                    className="feed-comment-form"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const form =
                                            e.target as HTMLFormElement;
                                        const input = form.elements.namedItem(
                                            "comment"
                                        ) as HTMLInputElement;
                                        handleComment(post, input.value);
                                        input.value = "";
                                    }}
                                >
                                    <input
                                        type="text"
                                        name="comment"
                                        className="feed-comment-input"
                                        placeholder="Add a comment..."
                                    />
                                    <button
                                        type="submit"
                                        className="feed-comment-submit"
                                        aria-label="Post comment"
                                    >
                                        <svg
                                            className="feed-comment-submit-icon"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && posts.length > 0 && (
                    <div className="feed-loading-container">
                        <div className="feed-loading-spinner">
                            <div className="feed-spinner"></div>
                        </div>
                    </div>
                )}

                {/* End of Feed Indicator */}
                {!hasMore && posts.length > 0 && (
                    <div className="feed-end-indicator">
                        <div className="feed-end-content">
                            <svg
                                className="feed-end-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                            <p className="feed-end-text">
                                You're all caught up!
                            </p>
                        </div>
                    </div>
                )}
                <div ref={sentinelRef} style={{ height: 1 }} />
            </div>
        </div>
    );
};

export default Feed;
