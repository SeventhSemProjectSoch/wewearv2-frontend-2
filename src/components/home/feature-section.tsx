import { Card, CardContent } from "@/components/ui/card";
import {
    Camera,
    ShoppingBag,
    TrendingUp,
    Heart,
    MessageCircle,
    Share2,
} from "lucide-react";

export function FeaturesSection() {
    const features = [
        {
            icon: Camera,
            title: "Video-First Content",
            description:
                "Create engaging fashion videos that showcase your style and personality",
        },
        {
            icon: ShoppingBag,
            title: "Seamless Selling",
            description:
                "List and sell your clothes with integrated payment and shipping solutions",
        },
        {
            icon: TrendingUp,
            title: "Brand Partnerships",
            description:
                "Connect with fashion brands for sponsored content and collaborations",
        },
        {
            icon: Heart,
            title: "Style Discovery",
            description:
                "Discover new trends and styles from creators around the world",
        },
        {
            icon: MessageCircle,
            title: "Community Engagement",
            description:
                "Build relationships with fellow fashion enthusiasts and creators",
        },
        {
            icon: Share2,
            title: "Social Sharing",
            description:
                "Share your favorite finds and outfits across all social platforms",
        },
    ];

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-balance">
                        Everything You Need for Fashion Success
                    </h2>
                    <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
                        From content creation to commerce, WeWear provides all
                        the tools you need to thrive in the fashion ecosystem.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                        >
                            <CardContent className="p-6 space-y-4">
                                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                                    <feature.icon className="h-6 w-6 text-secondary" />
                                </div>
                                <h3 className="text-lg font-semibold">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
