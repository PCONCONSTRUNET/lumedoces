import { Instagram, MapPin, Clock, Phone, Mail, FileText, Shield } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo_lume.png";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { useBusinessStatus, type BusinessHour } from "@/hooks/useBusinessStatus";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function formatWeeklyHours(hours: BusinessHour[]) {
  if (!hours || hours.length === 0) return ["Carregando..."];
  
  const groups: { days: string[], open: string, close: string, isClosed: boolean, is24h: boolean }[] = [];
  const sorted = [...hours].sort((a, b) => a.day_of_week - b.day_of_week);
  
  sorted.forEach((h) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.isClosed === h.is_closed && lastGroup.is24h === h.is_24h && lastGroup.open === h.open_time && lastGroup.close === h.close_time) {
      lastGroup.days.push(DAYS[h.day_of_week]);
    } else {
      groups.push({
        days: [DAYS[h.day_of_week]],
        open: h.open_time,
        close: h.close_time,
        isClosed: h.is_closed,
        is24h: !!h.is_24h
      });
    }
  });

  return groups
    .filter(g => !g.isClosed)
    .map(g => {
      const daysStr = g.days.length > 2 ? `${g.days[0]} a ${g.days[g.days.length - 1]}` : g.days.join(" e ");
      if (g.is24h) return `${daysStr}: Aberto 24 horas`;
      return `${daysStr}: ${g.open.slice(0,5)} às ${g.close.slice(0,5)}`;
    });
}

export function Footer() {
  const { allHours } = useBusinessStatus();

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
            <a href="https://www.instagram.com/lumeartesanaisc/" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full text-white/80 hover:text-white hover:bg-[#E1306C] transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href={`https://wa.me/5548996915303`} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full text-white/80 hover:text-white hover:bg-[#25D366] transition-colors"><WhatsAppIcon className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-white font-semibold text-lg">Contato</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="tel:5548996915303" className="flex items-center space-x-3 hover:text-white/80 transition-colors">
                <Phone className="w-4 h-4 text-amber-200" />
                <span>(48) 99691-5303 (WhatsApp)</span>
              </a>
            </li>
            <li>
              <a href="mailto:lumeartesanaisc@gmail.com" className="flex items-center space-x-3 hover:text-white/80 transition-colors">
                <Mail className="w-4 h-4 text-amber-200" />
                <span>lumeartesanaisc@gmail.com</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Location & Hours */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-white font-semibold text-lg">Funcionamento e Entrega com Retirada no Local</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start space-x-3">
              <Clock className="w-4 h-4 text-amber-200 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                {formatWeeklyHours(allHours).map((line, idx) => (
                  <span key={idx}>{line}</span>
                ))}
              </div>
            </li>
            {/* <li className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-amber-200 mt-0.5" />
              <span>Entregamos em toda a região. Consulte as taxas no momento da compra.</span>
            </li> */}
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
                <span>Horários e Entrega com Retirada no Local</span>
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
