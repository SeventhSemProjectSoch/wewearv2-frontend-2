import { Link, useLocation } from "react-router-dom";
import {
    Home,
    Users,
    Compass,
    Plus,
    User,
    LogOut,
    Edit,
    Search,
} from "lucide-react";

const Navbar = () => {
    const { pathname } = useLocation();

    const navItems = [
        {
            path: "/search",
            icon: Search,
            label: "Search",
            isActive: pathname === "/search",
        },
        {
            path: "/feeds/foryou",
            icon: Home,
            label: "For You",
            isActive: pathname === "/feeds/foryou",
        },

        {
            path: "/feeds/explore",
            icon: Compass,
            label: "Explore",
            isActive: pathname === "/feeds/explore",
        },
        {
            path: "/feeds/upload",
            icon: Plus,
            label: "Upload",
            isActive: pathname === "/feeds/upload",
            // isSpecial: true,
        },
        {
            path: "/profile",
            icon: User,
            label: "Profile",
            isActive: pathname === "/profile",
        },
        {
            path: "/edit-profile",
            icon: Edit,
            label: "Edit Profile",
            isActive: pathname === "/edit-profile",
        },
        {
            path: "/logout",
            icon: LogOut,
            label: "Logout",
            isActive: false,
        },
    ];
    // fixed bottom-0 left-0 right-0

    return (
        <nav className=" w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-9999">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-bamboo-600">We Wear</h1>
            </div>
            <div className="flex-1 overflow-y-auto py-4 ">
                <ul className="space-y-2 px-4">
                    {navItems.map((item) => {
                        const IconComponent = item.icon;

                        return (
                            <li key={item.path} className="">
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                                        item.isActive
                                            ? "text-bamboo-600"
                                            : "text-gray-500 hover:text-bamboo-500 hover:bg-gray-50"
                                    }`}
                                >
                                    <div
                                        className={`relative ${
                                            item?.isSpecial
                                                ? "bg-bamboo-600 rounded-full p-2 mb-1"
                                                : "mb-1"
                                        }`}
                                    >
                                        <IconComponent
                                            size={24}
                                            className={`${
                                                item.isActive
                                                    ? "text-[#b9ba73]"
                                                    : "text-[#81824d]"
                                            }`}
                                        />

                                        {item.isActive && !item?.isSpecial && (
                                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-bamboo-600 rounded-full"></div>
                                        )}
                                    </div>

                                    <span
                                        className={`text-xs font-medium ${
                                            item.isActive
                                                ? "text-[#b9ba73]"
                                                : "text-[#81824d]"
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
