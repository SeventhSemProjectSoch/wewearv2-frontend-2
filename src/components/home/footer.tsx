import { Button } from "@/components/ui/button";
import {
    Instagram,
    Twitter,
    TicketIcon as TikTok,
    Youtube,
} from "lucide-react";

export function Footer() {
    const footerLinks = {
        Company: ["About Us", "Careers", "Press", "Blog"],
        Support: [
            "Help Center",
            "Safety",
            "Community Guidelines",
            "Contact Us",
        ],
        Legal: [
            "Terms of Service",
            "Privacy Policy",
            "Cookie Policy",
            "Copyright",
        ],
        Creators: [
            "Creator Program",
            "Brand Partnerships",
            "Resources",
            "Success Stories",
        ],
    };

    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold">WeWear</h3>
                            <p className="text-primary-foreground/80 mt-2">
                                Connecting fashion creators, brands, and style
                                enthusiasts through the power of social
                                commerce.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="hover:bg-primary-foreground/10"
                            >
                                <Instagram className="h-5 w-5" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="hover:bg-primary-foreground/10"
                            >
                                <TikTok className="h-5 w-5" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="hover:bg-primary-foreground/10"
                            >
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="hover:bg-primary-foreground/10"
                            >
                                <Youtube className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} className="space-y-4">
                            <h4 className="font-semibold">{category}</h4>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-primary-foreground/60 text-sm">
                        © 2024 WeWear. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <a
                            href="#"
                            className="text-primary-foreground/80 hover:text-primary-foreground"
                        >
                            Terms
                        </a>
                        <a
                            href="#"
                            className="text-primary-foreground/80 hover:text-primary-foreground"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="text-primary-foreground/80 hover:text-primary-foreground"
                        >
                            Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
