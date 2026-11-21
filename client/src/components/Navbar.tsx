import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CrystalIcon } from './CrystalLogo';
import {
  Calculator,
  ClipboardList,
  Layers,
  BarChart3,
  LogOut,
  Phone,
} from 'lucide-react';

interface Props {
  activeTab: 'calc' | 'orders' | 'catalog' | 'analytics';
  setActiveTab: (tab: 'calc' | 'orders' | 'catalog' | 'analytics') => void;
  ordersCount: number;
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, ordersCount }) => {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-md shadow-blue-500/10">
            <CrystalIcon size={26} />
          </div>
          <div>
            <div className="font-black text-white text-base leading-tight tracking-tight flex items-center gap-2">
              «Кристалл»
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                CRM
              </span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              Изготовление памятников, надгробий, комплексов и оград
            </div>
          </div>
        </div>

        {/* Center navigation tabs */}
        <nav className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('calc')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'calc'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator size={15} />
            <span className="hidden md:inline">Калькулятор</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClipboardList size={15} />
            <span>Заказы</span>
            {ordersCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === 'orders' ? 'bg-slate-950 text-blue-300' : 'bg-blue-500/20 text-blue-300'
              }`}>
                {ordersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers size={15} />
            <span className="hidden md:inline">Справочник цен</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 size={15} />
            <span className="hidden md:inline">Прибыль</span>
          </button>
        </nav>

        {/* Right side contact & logout */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col items-end text-right">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1">
              <Phone size={12} className="text-blue-400" />
              +7 909 02 03 283
            </span>
            <span className="text-[10px] text-slate-400">Ежедневно 10:00 — 18:00</span>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-colors cursor-pointer"
            title="Выйти из системы"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
