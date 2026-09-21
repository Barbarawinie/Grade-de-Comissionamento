import React from 'react';
import {
  LayoutDashboard,
  User,
  Users,
  Grid,
  BookOpen,
  Car,
  Landmark,
  HeartPulse,
  Building2,
} from 'lucide-react';
import { SectionType } from '../types';

interface MobileBottomNavProps {
  currentSection: SectionType;
  onSelectSection: (section: SectionType) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentSection,
  onSelectSection,
}) => {
  const navItems = [
    { id: 'dashboard' as SectionType, label: 'Início', icon: LayoutDashboard },
    { id: 'pf' as SectionType, label: 'PF', icon: User },
    { id: 'pme' as SectionType, label: 'PME', icon: Users },
    { id: 'adesao' as SectionType, label: 'Adesão', icon: Grid },
    { id: 'auto' as SectionType, label: 'Auto', icon: Car },
    { id: 'consorcio' as SectionType, label: 'Consórcio', icon: Landmark },
    { id: 'vida' as SectionType, label: 'Vida', icon: HeartPulse },
    { id: 'demais' as SectionType, label: 'Demais', icon: Building2 },
    { id: 'regras' as SectionType, label: 'Regras', icon: BookOpen },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#071B3A] border-t border-white/10 flex items-center overflow-x-auto z-40 px-2 select-none no-scrollbar"
    >
      <div className="flex items-center gap-1 mx-auto min-w-max px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-white bg-[#4A86D9] font-bold shadow-xs'
                  : 'text-white/65 hover:text-white font-medium'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9.5px] mt-0.5 whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
