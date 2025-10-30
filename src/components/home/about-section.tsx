import { Card, CardContent } from "@/components/ui/card";
import { Shirt, Video, Handshake } from "lucide-react";

export function AboutSection() {
    return (
        <section className="py-20 bg-card/50">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-balance">
                        Revolutionizing Fashion Commerce
                    </h2>
                    <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
                        WeWear bridges the gap between fashion creators, brands,
                        and style enthusiasts through an innovative social
                        platform that makes fashion discovery and commerce
                        seamless.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-8 text-center space-y-4">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                                <Video className="h-8 w-8 text-secondary" />
                            </div>
                            <h3 className="text-xl font-semibold">
                                For Creators
                            </h3>
                            <p className="text-muted-foreground">
                                Showcase your style, promote brands, and
                                monetize your fashion content through engaging
                                videos that inspire your audience.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-8 text-center space-y-4">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                                <Shirt className="h-8 w-8 text-secondary" />
                            </div>
                            <h3 className="text-xl font-semibold">For Users</h3>
                            <p className="text-muted-foreground">
                                Sell your pre-loved clothes, discover unique
                                pieces, and connect with a community that shares
                                your passion for sustainable fashion.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-8 text-center space-y-4">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                                <Handshake className="h-8 w-8 text-secondary" />
                            </div>
                            <h3 className="text-xl font-semibold">
                                For Brands
                            </h3>
                            <p className="text-muted-foreground">
                                Partner with authentic creators, reach engaged
                                audiences, and showcase your products through
                                genuine, creative content.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
