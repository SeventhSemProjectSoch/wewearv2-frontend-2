import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/services/profileServices";
import { useLoader } from "@/context/LoaderContext";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, Loader2, Save, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThemesDropdown } from "@/components/theme-dropdown";
import { BodyTypeDropdown } from "@/components/body-type-dropdown";
import type { IProfile } from "@/services/types";

const Profile = () => {
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [saving, setSaving] = useState(false);
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        showLoader();
        getProfile()
            .then(setProfile)
            .catch(() => toast.error("Failed to load profile"))
            .finally(() => hideLoader());
    }, []);

    const handleChange = (field: keyof IProfile, value: any) => {
        if (!profile) return;
        setProfile({ ...profile, [field]: value });
    };

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);
        toast("Saving...", {
            duration: 300,
        });
        let save_success = false;
        try {
            console.log("profile ==> ", profile);
            const updated = await updateProfile(profile);
            setProfile(updated);
            save_success = true;
        } catch {
            toast.error("Failed to save profile");
        } finally {
            if (save_success) toast.success("Profile saved sucessfully");
            setSaving(false);
        }
    };

    if (!profile) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center">
                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            No profile data available
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="space-y-8">
                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                            <User className="h-10 w-10 text-secondary" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-red-600">
                                Edit Your Profile
                            </h1>
                            <p className="text-xl text-muted-foreground text-pretty">
                                Customize your WeWear profile to showcase your
                                unique style
                            </p>
                        </div>
                    </div>

                    {/* Profile Form Card */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-6">
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Edit3 className="h-6 w-6 text-secondary" />
                                Profile Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSave();
                                }}
                                className="space-y-6"
                            >
                                {/* Basic Information */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="username"
                                            className="text-sm font-medium"
                                        >
                                            Username
                                        </Label>
                                        <Input
                                            id="username"
                                            value={profile.username || ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    "username",
                                                    e.target.value
                                                )
                                            }
                                            className="h-11 border-1 border-gray-300"
                                            placeholder="Enter your username"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="fullName"
                                            className="text-sm font-medium"
                                        >
                                            Full Name
                                        </Label>
                                        <Input
                                            id="fullName"
                                            value={profile.full_name || ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    "full_name",
                                                    e.target.value
                                                )
                                            }
                                            className="h-11 border-1 border-gray-300"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>

                                {/* Bio Section */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="bio"
                                        className="text-sm font-medium"
                                    >
                                        Bio
                                    </Label>
                                    <Textarea
                                        id="bio"
                                        value={profile.bio || ""}
                                        onChange={(e) =>
                                            handleChange("bio", e.target.value)
                                        }
                                        className="min-h-[100px] resize-none border-1 border-gray-300"
                                        placeholder="Tell us about your style and fashion interests..."
                                    />
                                </div>

                                {/* Physical Information */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="bodyType"
                                            className="text-sm font-medium"
                                        >
                                            Body Type
                                        </Label>
                                        {/* <Input
                                            id="bodyType"
                                            value={profile.body_type || ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    "body_type",
                                                    e.target.value
                                                )
                                            }
                                            className="h-11"
                                            placeholder="e.g., Athletic, Curvy"
                                        /> */}
                                        <BodyTypeDropdown
                                            value={profile.body_type}
                                            onChange={(bodyType) =>
                                                handleChange(
                                                    "body_type",
                                                    bodyType
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="height"
                                            className="text-sm font-medium"
                                        >
                                            Height (cm)
                                        </Label>
                                        <Input
                                            id="height"
                                            type="number"
                                            value={profile.height ?? ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    "height",
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="h-11 border-1 border-gray-300"
                                            placeholder="170"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="weight"
                                            className="text-sm font-medium"
                                        >
                                            Weight (kg)
                                        </Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            value={profile.weight ?? ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    "weight",
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="h-11 border-1 border-gray-300"
                                            placeholder="65"
                                        />
                                    </div>
                                </div>

                                {/* Themes Section */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="themes"
                                        className="text-sm font-medium"
                                    >
                                        Fashion Themes
                                    </Label>
                                    {/* <Input
                                        id="themes"
                                        value={profile.themes.join(", ")}
                                        onChange={(e) =>
                                            handleChange(
                                                "themes",
                                                e.target.value
                                                    .split(",")
                                                    .map((t) => t.trim())
                                            )
                                        }
                                        className="h-11"
                                        placeholder="e.g., Minimalist, Streetwear, Vintage, Bohemian"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Separate multiple themes with commas
                                    </p> */}
                                    <ThemesDropdown
                                        value={profile.themes}
                                        onChange={(themes) =>
                                            handleChange("themes", themes)
                                        }
                                    />
                                </div>

                                {/* Save Button */}
                                <div className="pt-6">
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        size="lg"
                                        className="w-full md:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Saving Profile...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-5 w-5" />
                                                Save Profile
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
