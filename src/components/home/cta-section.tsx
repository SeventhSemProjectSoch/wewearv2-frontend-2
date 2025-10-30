import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";

export function CTASection() {
    return (
        <section className="py-20 bg-gradient-to-r from-secondary via-secondary to-accent">
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-secondary-foreground text-balance">
                        Ready to Transform Your Fashion Journey?
                    </h2>
                    <p className="text-xl text-secondary-foreground/90 text-pretty max-w-2xl mx-auto">
                        Join thousands of creators, brands, and fashion
                        enthusiasts who are already building their future on
                        WeWear.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="bg-background text-foreground hover:bg-background/90"
                        >
                            Join WeWear Today
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10 bg-transparent"
                        >
                            <Download className="mr-2 h-5 w-5" />
                            Download App
                        </Button>
                    </div>

                    <div className="pt-8 text-secondary-foreground/80">
                        <p className="text-sm">
                            Available on iOS and Android • Free to join • No
                            credit card required
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
