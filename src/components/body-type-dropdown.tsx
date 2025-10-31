"use client";

import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";

interface BodyTypeDropdownProps {
    value: string | undefined | null;
    onChange: (value: string) => void;
}

export function BodyTypeDropdown({ value, onChange }: BodyTypeDropdownProps) {
    const [bodyType, setBodyType] = useState<string[]>([]);

    useEffect(() => {
        const apiRequest2 = async () => {
            const bodyType = await apiClient.get(`/meta/bodytypes/`);
            console.log("body type ==> ", bodyType);
            setBodyType(bodyType.data);
        };

        apiRequest2();
    }, []);

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-11 w-full px-3 py-2   rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-1 border-gray-300"
        >
            <option value="">Select a body type</option>
            {bodyType.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}
