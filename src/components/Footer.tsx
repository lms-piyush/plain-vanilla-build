
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-talent-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <div className="h-12 w-48 relative">
                <img
                  src="/lovable-uploads/b1650d07-3bd0-4177-87ad-8710731d1032.png"
                  alt="TalentSchool Logo"
                  className="h-full object-contain brightness-0 invert"
                />
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              TalentSchool connects passionate tutors with eager learners for live, interactive online classes in any subject. Discover your passion today.
            </p>
            <div className="flex space-x-4">
              <SocialLink icon={<Facebook size={18} />} href="#" />
              <SocialLink icon={<Instagram size={18} />} href="#" />
              <SocialLink icon={<Twitter size={18} />} href="#" />
              <SocialLink icon={<Youtube size={18} />} href="#" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">For Families</h4>
            <ul className="space-y-3">
              <FooterLink href="#" label="Browse Classes" />
              <FooterLink href="#" label="How It Works" />
              <FooterLink href="#" label="Testimonials" />
              <FooterLink href="#" label="Gift Cards" />
              <FooterLink href="#" label="FAQs" />
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">For Tutors</h4>
            <ul className="space-y-3">
              <FooterLink href="#" label="Become a Tutor" />
              <FooterLink href="#" label="Teacher Success" />
              <FooterLink href="#" label="Teacher Resources" />
              <FooterLink href="#" label="Earnings Calculator" />
              <FooterLink href="#" label="Support Center" />
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-4 text-sm">
              Subscribe to our newsletter for the latest classes and educational tips.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="bg-gray-800 border-gray-700" />
              <Button className="bg-talent-primary hover:bg-talent-secondary">
                Subscribe
              </Button>
            </div>
            <div className="mt-6">
              <div className="flex items-center text-gray-400 text-sm mb-2">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:support@talentschool.com">support@talentschool.com</a>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Phone className="h-4 w-4 mr-2" />
                <a href="tel:+918800TALENT">+91 8800 TALENT</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} TalentSchool. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
  <a 
    href={href} 
    className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-talent-primary transition-colors"
  >
    {icon}
  </a>
);

const FooterLink = ({ href, label }: { href: string; label: string }) => (
  <li>
    <a 
      href={href} 
      className="text-gray-400 hover:text-white transition-colors"
    >
      {label}
    </a>
  </li>
);

export default Footer;
