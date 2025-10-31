"use client";
import apiClient from "@/services/apiClient";
import type React from "react";
import { useEffect, useState } from "react";

interface ThemesDropdownProps {
    value: string[];
    onChange: (themes: string[]) => void;
    placeholder?: string;
    className?: string;
}

const THEME_OPTIONS = ["fitness", "traditional", "trend"];

export function ThemesDropdown({
    value = [],
    onChange,
    placeholder = "e.g., Minimalist, Streetwear, Vintage, Bohemian",
    className = "h-11",
}: ThemesDropdownProps) {
    const safeValue = Array.isArray(value) ? value : [];
    const [theme, setTheme] = useState<string[]>([]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = e.target.value;
        if (selectedOption && !safeValue.includes(selectedOption)) {
            onChange([...safeValue, selectedOption]);
            e.target.value = ""; // Reset select to placeholder
        }
    };

    useEffect(() => {
        const apiRequest = async () => {
            const theme = await apiClient.get(`/meta/themes/`);
            setTheme(theme.data);
        };

        apiRequest();
    }, []);

    return (
        <div className="w-full space-y-3">
            <select
                onChange={handleSelectChange}
                className={`w-full px-3 py-2 border-1 border-gray-300 rounded-md  text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
                defaultValue=""
            >
                <option value="">{placeholder}</option>
                {theme.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            {safeValue.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {safeValue.map((theme) => (
                        <div
                            key={theme}
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
                        >
                            <span>{theme}</span>
                            <button
                                type="button"
                                onClick={() =>
                                    onChange(
                                        safeValue.filter((t) => t !== theme)
                                    )
                                }
                                className="ml-1 hover:opacity-70 transition-opacity"
                                aria-label={`Remove ${theme}`}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
