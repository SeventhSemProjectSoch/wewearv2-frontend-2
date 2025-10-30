import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Upload, Zap } from "lucide-react";

export function HowItWorksSection() {
    const steps = [
        {
            icon: UserPlus,
            step: "01",
            title: "Sign Up & Create Profile",
            description:
                "Join our community and set up your fashion profile to showcase your unique style and interests.",
        },
        {
            icon: Upload,
            step: "02",
            title: "Post & Advertise",
            description:
                "Upload your fashion videos, list items for sale, or create content promoting your favorite brands.",
        },
        {
            icon: Zap,
            step: "03",
            title: "Connect & Grow",
            description:
                "Engage with the community, build your following, and start earning through sales and partnerships.",
        },
    ];

    return (
        <section className="py-20 bg-card/30">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-balance">
                        How WeWear Works
                    </h2>
                    <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                        Getting started is simple. Follow these three steps to
                        join the fashion revolution.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className="p-8 text-center space-y-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
                                            <step.icon className="h-10 w-10 text-secondary-foreground" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-primary-foreground">
                                                {step.step}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold">
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {step.description}
                                    </p>
                                </CardContent>
                            </Card>

                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border transform -translate-y-1/2 z-10"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
