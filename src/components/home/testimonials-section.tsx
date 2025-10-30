import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Fashion Creator",
            avatar: "/young-asian-woman-fashion-creator-profile-photo.jpg",
            content:
                "WeWear has transformed how I connect with brands. I've built amazing partnerships and grown my audience by 300% in just 6 months!",
            rating: 5,
        },
        {
            name: "Marcus Johnson",
            role: "Sustainable Fashion Enthusiast",
            avatar: "/young-black-man-sustainable-fashion-enthusiast-pro.jpg",
            content:
                "I love how easy it is to sell my clothes and discover unique pieces. The community here really cares about sustainable fashion.",
            rating: 5,
        },
        {
            name: "Emma Rodriguez",
            role: "Brand Manager at StyleCo",
            avatar: "/professional-latina-woman-brand-manager-profile-ph.jpg",
            content:
                "The authentic creator partnerships we've built through WeWear have driven incredible engagement and sales for our brand.",
            rating: 5,
        },
    ];

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-balance">
                        Loved by Our Community
                    </h2>
                    <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                        See what creators, users, and brands are saying about
                        their WeWear experience.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(testimonial.rating)].map(
                                        (_, i) => (
                                            <Star
                                                key={i}
                                                className="h-5 w-5 fill-yellow-400 text-yellow-400"
                                            />
                                        )
                                    )}
                                </div>

                                <div className="relative">
                                    <Quote className="h-8 w-8 text-secondary/20 absolute -top-2 -left-2" />
                                    <p className="text-muted-foreground italic pl-6">
                                        "{testimonial.content}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <img
                                        src={
                                            testimonial.avatar ||
                                            "/placeholder.svg"
                                        }
                                        alt={`${testimonial.name} profile`}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
