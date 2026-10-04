import Link from "next/link";
import Image from "next/image";
import { siteConfig, whatsappMessages } from "@/data/config";


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black py-16 border-t border-brand-silver/10">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link href="/" className="inline-block mb-6">
            <Image 
              src="/logo-transparent-final.png" 
              alt="Quantum Club Logo" 
              width={225} 
              height={62} 
              className="h-[60px] w-auto object-contain"
            />
          </Link>
          <p className="text-brand-gray max-w-sm font-medium">
            {siteConfig.description}
          </p>
          <p className="mt-4 text-brand-silver font-bold uppercase tracking-widest text-sm">
            {siteConfig.location}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-widest text-brand-white uppercase mb-6">Navigation</h3>
          <ul className="space-y-4">
            <li>
              <Link href="/#events" className="text-brand-gray font-medium hover:text-brand-white transition-colors">
                Upcoming Events
              </Link>
            </li>
            <li>
              <Link href="/#past-events" className="text-brand-gray font-medium hover:text-brand-white transition-colors">
                Past Events
              </Link>
            </li>
            <li>
              <Link href="/#about" className="text-brand-gray font-medium hover:text-brand-white transition-colors">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-widest text-brand-white uppercase mb-6">Connect</h3>
          <div className="flex space-x-4">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-brand-silver/20 flex items-center justify-center hover:bg-brand-white hover:text-brand-black transition-colors text-brand-silver"
              aria-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(whatsappMessages.general)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-brand-silver/20 flex items-center justify-center hover:bg-green-500 hover:text-brand-white transition-colors text-brand-silver"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-brand-silver/10 flex flex-col md:flex-row items-center justify-between">
        <p className="text-brand-gray text-sm font-medium">
          &copy; {currentYear} {siteConfig.name}. All rights reserved.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0 text-sm font-medium">
          <Link href="/privacy" className="text-brand-gray hover:text-brand-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-brand-gray hover:text-brand-white transition-colors">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
