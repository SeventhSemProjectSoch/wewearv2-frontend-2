"use client";

import type React from "react";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchPosts() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log("Searching for:", searchQuery);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
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
            <form onSubmit={handleSearch} className="w-full max-w-2xl">
                <div className="flex items-center bg-white border border-gray-300 rounded-full px-6 py-3 shadow-sm hover:shadow-md hover:border-gray-400 transition-all">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search posts..."
                        className="flex-1 outline-none text-gray-900 placeholder-gray-500 bg-transparent text-base"
                    />
                </div>
            </form>

            {/* Suggestions */}
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 mb-4">Popular searches:</p>
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
    );
}
