import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail, Globe } from 'lucide-react';

export function Footer() {
    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>
            
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                    {/* About Section */}
                    <div className="lg:col-span-2">
                        <div className="mb-4">
                            <img
                                src="/logo_lpem.png"
                                alt="LPEM FEB UI Logo"
                                className="h-14 w-auto brightness-0 invert"
                            />
                        </div>
                        
                        <p className="mb-4 text-sm leading-relaxed text-gray-400">
                            Lembaga Penyelidikan Ekonomi dan Masyarakat Fakultas Ekonomi dan Bisnis Universitas Indonesia <br />
                            <i className="text-white">Pusat penelitian dan analisis kebijakan ekonomi terkemuka di Indonesia.</i>
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Globe className="h-4 w-4 text-yellow-400" />
                            <a
                                href="https://lpem.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-yellow-400"
                            >
                                www.lpem.org
                            </a>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="mb-4 text-base font-bold text-white">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
                                <span className="text-gray-400">
                                    Jl. Salemba Raya No. 4. Gedung Ali Wardhana, RT.4/RW.5, Kenari, Kec. Senen, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10430
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 flex-shrink-0 text-yellow-400" />
                                <a
                                    href="tel:+622177200001"
                                    className="text-gray-400 transition-colors hover:text-yellow-400"
                                >
                                    (021) 3143177
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 flex-shrink-0 text-yellow-400" />
                                <a
                                    href="mailto:lpem@lpem-febui.org"
                                    className="text-gray-400 transition-colors hover:text-yellow-400"
                                >
                                    lpem@lpem-febui.org
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media Section */}
                    <div>
                        <h3 className="mb-4 text-base font-bold text-white">Follow Me</h3>
                        <p className="mb-4 text-sm text-gray-400">
                            Connect with us on social media for the latest updates and news.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="https://facebook.com/lpemfebui"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-300 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-yellow-500 hover:text-gray-900 hover:shadow-yellow-500/50"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="https://instagram.com/lpemfebui"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-300 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-yellow-500 hover:text-gray-900 hover:shadow-yellow-500/50"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="https://twitter.com/lpemfebui"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-300 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-yellow-500 hover:text-gray-900 hover:shadow-yellow-500/50"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="https://linkedin.com/company/lpem-feb-ui"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-300 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-yellow-500 hover:text-gray-900 hover:shadow-yellow-500/50"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 border-t border-gray-800 pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="text-center text-sm text-gray-400">
                            &copy; {new Date().getFullYear()}{' '}
                            <span className="font-bold text-yellow-400">
                                LPEM FEB UI
                            </span>
                            . All rights reserved.
                        </p>
                        <p className="text-center text-xs text-gray-500">
                            Created by BinSETO
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
