import React, { useState } from 'react';
import type { Order } from '../types';
import { api } from '../api';
import { PrintContractModal } from './PrintContractModal';
import {
  Search,
  Printer,
  Trash2,
  Phone,
  User,
  MapPin,
  Calendar,
  Eye,
  X,
} from 'lucide-react';

interface Props {
  orders: Order[];
  onOrdersUpdated: () => void;
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'Новый заказ', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' },
  in_progress: { label: 'В распиле / цеху', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  engraving: { label: 'Гравировка / Художник', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  ready: { label: 'Готов на складе', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  installed: { label: 'Установлен на кладбище', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  completed: { label: 'Завершен и сдан', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30' },
};

export const OrdersList: React.FC<Props> = ({ orders, onOrdersUpdated }) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);
  const [contractOrderForPrint, setContractOrderForPrint] = useState<Order | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      o.orderNumber.toLowerCase().includes(query) ||
      o.clientName.toLowerCase().includes(query) ||
      o.clientPhone.toLowerCase().includes(query) ||
      (o.deceasedName && o.deceasedName.toLowerCase().includes(query)) ||
      (o.cemetery && o.cemetery.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      onOrdersUpdated();
    } catch (err) {
      alert('Ошибка при обновлении статуса');
    }
  };

  const handleAddPayment = async (orderId: string) => {
    const amt = parseFloat(paymentAmount);
    if (!amt || amt <= 0) return;
    try {
      await api.updateOrderStatus(orderId, undefined, amt);
      setPaymentAmount('');
      onOrdersUpdated();
      if (activeOrderModal && activeOrderModal.id === orderId) {
        setActiveOrderModal({
          ...activeOrderModal,
          prepayment: activeOrderModal.prepayment + amt,
          remainingPayment: Math.max(0, activeOrderModal.remainingPayment - amt),
        });
      }
    } catch (err) {
      alert('Ошибка добавления оплаты');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) return;
    try {
      await api.deleteOrder(orderId);
      if (activeOrderModal?.id === orderId) setActiveOrderModal(null);
      onOrdersUpdated();
    } catch (err) {
      alert('Ошибка удаления заказа');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Status Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по номеру заказа, ФИО заказчика, покойного или телефону..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-medium"
            />
            <Search size={18} className="absolute left-3.5 top-3.5 text-slate-500" />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Все заказы ({orders.length})</option>
            <option value="new">Новые заказы</option>
            <option value="in_progress">В цеху</option>
            <option value="engraving">Гравировка</option>
            <option value="ready">Готовы на складе</option>
            <option value="installed">Установлены</option>
            <option value="completed">Завершенные</option>
          </select>
        </div>
      </div>

      {/* Orders Table / Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/60 border border-slate-800/80 rounded-3xl text-slate-500">
            Заказы не найдены
          </div>
        ) : (
          filteredOrders.map((order) => {
            const stInfo = STATUS_LABELS[order.status] || STATUS_LABELS.new;
            return (
              <div
                key={order.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-blue-400 text-base">
                      {order.orderNumber}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${stInfo.bg} ${stInfo.color}`}>
                      {stInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={14} />
                    <span>Дата заказа: {order.orderDate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Client Info */}
                  <div className="space-y-1.5">
                    <span className="text-slate-500 uppercase font-semibold text-[10px]">Заказчик:</span>
                    <div className="font-bold text-white text-sm flex items-center gap-1.5">
                      <User size={14} className="text-slate-400" />
                      {order.clientName}
                    </div>
                    <div className="text-slate-400 flex items-center gap-1.5">
                      <Phone size={14} />
                      {order.clientPhone}
                    </div>
                    {order.deceasedName && (
                      <div className="text-slate-400">
                        Покойный: <span className="text-slate-200">{order.deceasedName}</span>
                      </div>
                    )}
                    {order.cemetery && (
                      <div className="text-slate-400 flex items-center gap-1">
                        <MapPin size={13} />
                        {order.cemetery}
                      </div>
                    )}
                  </div>

                  {/* Monument specs */}
                  <div className="space-y-1.5">
                    <span className="text-slate-500 uppercase font-semibold text-[10px]">Комплектация:</span>
                    <div className="text-slate-200 font-semibold">{order.steleName}</div>
                    <div className="text-slate-400">
                      Камень: <span className="text-slate-300 font-medium">{order.materialName}</span>
                    </div>
                    {order.standName && order.standName !== 'Без тумбы' && (
                      <div className="text-slate-400">Тумба: {order.standName}</div>
                    )}
                    {order.flowerBedName && order.flowerBedName !== 'Без цветников' && (
                      <div className="text-slate-400">Цветники: {order.flowerBedName}</div>
                    )}
                    {order.plateName && order.plateName !== 'Без плиты' && (
                      <div className="text-slate-400">Плита: {order.plateName}</div>
                    )}
                    {order.tileName && (
                      <div className="text-slate-400">
                        Плитка: {order.tilesCount} шт. (~{order.plotArea} м²)
                      </div>
                    )}
                  </div>

                  {/* Financials */}
                  <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 flex flex-col justify-center">
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-400">Сумма заказа:</span>
                      <span className="font-mono text-base font-bold text-white">
                        {order.totalSellPrice.toLocaleString()} ₽
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-400">Оплачено:</span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        {order.prepayment.toLocaleString()} ₽
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-400">Остаток долга:</span>
                      <span className="font-mono text-amber-400 font-bold">
                        {order.remainingPayment.toLocaleString()} ₽
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1 border-t border-slate-800 text-[11px]">
                      <span className="text-slate-500">Прибыль мастерской:</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        +{order.profit.toLocaleString()} ₽
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Статус:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    >
                      <option value="new">Новый</option>
                      <option value="in_progress">В цеху</option>
                      <option value="engraving">Гравировка</option>
                      <option value="ready">Готов на складе</option>
                      <option value="installed">Установлен</option>
                      <option value="completed">Завершен</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveOrderModal(order)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye size={14} />
                      <span>Подробнее</span>
                    </button>

                    <button
                      onClick={() => setContractOrderForPrint(order)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Printer size={14} />
                      <span>Печать договора</span>
                    </button>

                    <button
                      onClick={() => handleDelete(order.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Удалить заказ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Details Modal */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Заказ {activeOrderModal.orderNumber}
                </h3>
                <span className="text-xs text-slate-400">
                  Дата оформления: {activeOrderModal.orderDate}
                </span>
              </div>
              <button
                onClick={() => setActiveOrderModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-bold text-white text-sm">Данные заказчика и объекта:</div>
                <div>Заказчик: <span className="text-white font-medium">{activeOrderModal.clientName}</span> ({activeOrderModal.clientPhone})</div>
                {activeOrderModal.deceasedName && <div>ФИО покойного: <span className="text-white">{activeOrderModal.deceasedName}</span></div>}
                {activeOrderModal.cemetery && <div>Кладбище: <span className="text-white">{activeOrderModal.cemetery}</span></div>}
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-bold text-white text-sm">Состав сметы:</div>
                <div>Камень: <span className="text-slate-200">{activeOrderModal.materialName}</span></div>
                <div>Стела: <span className="text-slate-200">{activeOrderModal.steleName}</span></div>
                <div>Тумба: <span className="text-slate-200">{activeOrderModal.standName}</span></div>
                <div>Цветники: <span className="text-slate-200">{activeOrderModal.flowerBedName}</span></div>
                <div>Плита: <span className="text-slate-200">{activeOrderModal.plateName}</span></div>
                {activeOrderModal.tileName && (
                  <div>
                    Облицовка: <span className="text-slate-200">{activeOrderModal.tileName}</span> —{' '}
                    {activeOrderModal.tilesCount} шт. (~{activeOrderModal.plotArea} м²)
                  </div>
                )}
                <div>Портрет: <span className="text-slate-200">{activeOrderModal.portraitType}</span></div>
                {activeOrderModal.servicesList?.length > 0 && (
                  <div>
                    <span className="text-slate-400">Услуги:</span>
                    <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-300">
                      {activeOrderModal.servicesList.map((srv, idx) => (
                        <li key={idx}>{srv}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeOrderModal.notes && (
                  <div className="pt-2 text-slate-400 italic">
                    «{activeOrderModal.notes}»
                  </div>
                )}
              </div>

              {/* Add Payment Form */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">Финансы заказа:</span>
                  <span className="font-mono text-base font-bold text-amber-400">
                    Итого: {activeOrderModal.totalSellPrice.toLocaleString()} ₽
                  </span>
                </div>
                <div className="flex gap-4">
                  <div>Оплачено: <span className="font-mono text-emerald-400 font-bold">{activeOrderModal.prepayment.toLocaleString()} ₽</span></div>
                  <div>Остаток долга: <span className="font-mono text-rose-400 font-bold">{activeOrderModal.remainingPayment.toLocaleString()} ₽</span></div>
                </div>

                {activeOrderModal.remainingPayment > 0 && (
                  <div className="pt-2 flex gap-2">
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Сумма доплаты (₽)"
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono w-44"
                    />
                    <button
                      onClick={() => handleAddPayment(activeOrderModal.id)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Внести оплату
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setContractOrderForPrint(activeOrderModal)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer size={15} />
                <span>Печать договора-заказа</span>
              </button>
              <button
                onClick={() => setActiveOrderModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contract Print Modal */}
      {contractOrderForPrint && (
        <PrintContractModal
          order={contractOrderForPrint}
          onClose={() => setContractOrderForPrint(null)}
        />
      )}
    </div>
  );
};
