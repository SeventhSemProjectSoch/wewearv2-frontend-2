import Login from "@/pages/Login";
import Logout from "@/pages/Logout";
import Profile from "@/pages/Profile";
import Feed from "@/pages/Feed";
import Upload from "@/pages/Upload";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/layout/MainLayout";
import Home from "../pages/Home";
import type { RouteObject } from "react-router-dom";
import FeedProfile from "@/pages/FeedProfile";

const routes: RouteObject[] = [
    {
        path: "/",
        // element: <Navigate to="/login" replace />,
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/logout",
        element: <Logout />,
    },
    {
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/profile",
                element: <Profile />,
            },
            {
                path: "/feeds/foryou",
                element: <Feed feedType="foryou" />,
            },
            {
                path: "/feeds/friends",
                element: <Feed feedType="friends" />,
            },
            {
                path: "/feeds/explore",
                element: <Feed feedType="explore" />,
            },
            {
                path: "/feeds/upload",
                element: <Upload />,
            },
            {
                path: "/feed-profile/:id",
                element: <FeedProfile />,
            },
        ],
    },
];

export default routes;
