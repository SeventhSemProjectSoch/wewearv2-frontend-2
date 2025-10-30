import React from "react";
import { useLoader } from "@/context/LoaderContext";

const Loader: React.FC = () => {
    const { loading } = useLoader();

    if (!loading) return null;

    return (
        <div>
            <div></div>
        </div>
    );
};

export default Loader;
