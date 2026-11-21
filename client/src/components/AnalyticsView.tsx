import React from 'react';
import type { Stats, Order } from '../types';
import {
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  BarChart3,
} from 'lucide-react';

interface Props {
  stats: Stats | null;
  orders?: Order[];
}

export const AnalyticsView: React.FC<Props> = ({ stats }) => {
  if (!stats) return <div className="text-slate-500">Загрузка аналитики...</div>;

  const marginRate =
    stats.totalTurnover > 0 ? Math.round((stats.totalProfit / stats.totalTurnover) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Turnover */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="uppercase font-semibold tracking-wider">Выручка (Оборот)</span>
            <DollarSign size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {stats.totalTurnover.toLocaleString()} ₽
          </div>
          <div className="text-[11px] text-slate-500">Всего заказов: {stats.totalOrders}</div>
        </div>

        {/* Profit */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="uppercase font-semibold tracking-wider">Чистая прибыль</span>
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            +{stats.totalProfit.toLocaleString()} ₽
          </div>
          <div className="text-[11px] text-emerald-500/80 font-semibold">
            Рентабельность: {marginRate}%
          </div>
        </div>

        {/* Paid / Cash in */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="uppercase font-semibold tracking-wider">Оплачено клиентами</span>
            <CheckCircle2 size={16} className="text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono">
            {stats.totalPrepaid.toLocaleString()} ₽
          </div>
          <div className="text-[11px] text-slate-500">Фактическая касса мастерской</div>
        </div>

        {/* Pending Debts */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="uppercase font-semibold tracking-wider">Ожидается доплата</span>
            <Clock size={16} className="text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {stats.totalPendingPayment.toLocaleString()} ₽
          </div>
          <div className="text-[11px] text-rose-400/80 font-semibold">
            Долги клиентов при сдаче
          </div>
        </div>
      </div>

      {/* Production Pipeline & Cost Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-amber-400" />
            Структура себестоимости и маржи
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Себестоимость камня и работ резчиков:</span>
              <span className="font-mono font-bold text-white">
                {stats.totalCost.toLocaleString()} ₽
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden flex">
              <div
                style={{
                  width: `${stats.totalTurnover > 0 ? (stats.totalCost / stats.totalTurnover) * 100 : 50}%`,
                }}
                className="bg-slate-600 h-full"
                title="Себестоимость"
              />
              <div
                style={{
                  width: `${marginRate}%`,
                }}
                className="bg-emerald-500 h-full"
                title="Чистая прибыль"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
                Себестоимость: {100 - marginRate}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Чистая прибыль: {marginRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Pipeline status overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock size={18} className="text-sky-400" />
            Загрузка цеха
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Заказов в работе:</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {stats.activeOrdersCount}
              </span>
            </div>
            <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Завершенных и сданных:</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {stats.completedOrdersCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
