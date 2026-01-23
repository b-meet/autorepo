import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-black/40 backdrop-blur-xl relative z-10">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                                <span className="font-bold text-white">V</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight">Autorepo</span>
                        </Link>
                        <p className="text-sm text-white/50 leading-relaxed">
                            Automated documentation for modern engineering teams. Built by Vertical AI.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
                            <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-white/40">
                        &copy; {new Date().getFullYear()} Vertical AI. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6">
                        <Link href="#" className="text-white/40 hover:text-white transition-colors">
                            <Github className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="text-white/40 hover:text-white transition-colors">
                            <Twitter className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="text-white/40 hover:text-white transition-colors">
                            <Linkedin className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
