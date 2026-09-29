import { Instagram, MapPin, Clock, Phone, Mail, FileText, Shield } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo_lume.png";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function Footer() {
  return (
    <footer className="bg-brand text-white/90 py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Brand & Slogan */}
        <div className="flex flex-col space-y-4">
          <div className="bg-white p-2 rounded-xl inline-block w-fit">
            <img src={logo} alt="Lume Doces" className="w-24 h-auto object-contain" />
          </div>
          <p className="text-sm text-white/80 mt-2 font-medium">
            Lume Artesanais
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="bg-white/10 p-2 rounded-full text-white/80 hover:text-white hover:bg-[#E1306C] transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="bg-white/10 p-2 rounded-full text-white/80 hover:text-white hover:bg-[#25D366] transition-colors"><WhatsAppIcon className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-white font-semibold text-lg">Contato</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-amber-200" />
              <span>(00) 90000-0000 (WhatsApp)</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-amber-200" />
              <span>contato@lumedoces.com.br</span>
            </li>
          </ul>
        </div>

        {/* Location & Hours */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-white font-semibold text-lg">Funcionamento e Entrega</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start space-x-3">
              <Clock className="w-4 h-4 text-amber-200 mt-0.5" />
              <span>Terça a Domingo<br/>18:00 às 23:30</span>
            </li>
            <li className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-amber-200 mt-0.5" />
              <span>Entregamos em toda a região. Consulte as taxas no momento da compra.</span>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-white font-semibold text-lg">Links Úteis</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/termos" className="flex items-center space-x-3 hover:text-white/80 transition-colors">
                <FileText className="w-4 h-4 text-amber-200" />
                <span>Termos de Uso</span>
              </Link>
            </li>
            <li>
              <Link to="/privacidade" className="flex items-center space-x-3 hover:text-white/80 transition-colors">
                <Shield className="w-4 h-4 text-amber-200" />
                <span>Política de Privacidade</span>
              </Link>
            </li>
            <li>
              <Link to="/funcionamento" className="flex items-center space-x-3 hover:text-white/80 transition-colors">
                <Clock className="w-4 h-4 text-amber-200" />
                <span>Horários e Entregas</span>
              </Link>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/60">
        <p>&copy; {new Date().getFullYear()} Lume Doces. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
