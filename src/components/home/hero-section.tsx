import { Button } from "@/components/ui/button";
import { Play, Sparkles, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate("/login");
    };
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background">
            <nav className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                            <span className="text-secondary-foreground font-bold text-sm">
                                W
                            </span>
                        </div>
                        <span className="text-xl font-bold">WeWear</span>
                    </div>
                    <Button
                        variant="outline"
                        className="border-secondary text-secondary hover:bg-secondary/10 bg-transparent cursor-pointer"
                        onClick={handleNavigation}
                    >
                        Login
                    </Button>
                </div>
            </nav>

            <div className="container mx-auto px-4 md:px-20 py-10 lg:py-32 ">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
                                Where Fashion
                                <span className="text-secondary">
                                    {" "}
                                    Creators
                                </span>
                                ,<span className="text-secondary">
                                    {" "}
                                    Brands
                                </span>{" "}
                                &<span className="text-secondary">
                                    {" "}
                                    Style
                                </span>{" "}
                                Connect
                            </h1>
                            <p className="text-xl text-muted-foreground text-pretty max-w-lg">
                                Join the social platform revolutionizing
                                fashion. Sell your clothes, discover new styles,
                                and connect with brands through engaging video
                                content.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                            >
                                Join WeWear
                                <Sparkles className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-secondary text-secondary hover:bg-secondary/10 bg-transparent"
                            >
                                <Play className="mr-2 h-5 w-5" />
                                Watch Demo
                            </Button>
                        </div>

                        <div className="flex items-center gap-8 pt-4">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-secondary" />
                                <span className="text-sm text-muted-foreground">
                                    50K+ Creators
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-secondary" />
                                <span className="text-sm text-muted-foreground">
                                    1M+ Items Sold
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative z-10">
                            <img
                                src={`https://plus.unsplash.com/premium_photo-1683288295841-782fa47e4770?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                                alt="WeWear app interface showing fashion videos and clothing items"
                                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-2xl blur-3xl transform rotate-6"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
