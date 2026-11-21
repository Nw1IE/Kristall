import React from 'react';
import type { Order } from '../types';
import { Printer, X } from 'lucide-react';
import { CrystalIcon } from './CrystalLogo';

interface Props {
  order: Order;
  onClose: () => void;
}

export const PrintContractModal: React.FC<Props> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl relative my-auto">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">Предпросмотр бланка заказа:</span>
            <span className="font-mono text-blue-600 font-bold">{order.orderNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Printer size={16} />
              <span>Распечатать договор</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PRINTABLE CONTRACT SHEET */}
        <div className="print-area text-slate-900 text-xs leading-relaxed space-y-4 font-sans">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 border border-slate-300 rounded-xl">
                <CrystalIcon size={38} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  «Кристалл»
                </h1>
                <p className="text-[11px] font-semibold text-slate-700">
                  Изготовление памятников, надгробий, комплексов и оград
                </p>
                <p className="text-[10px] text-slate-500">
                  Высокое качество обработки камня • Компьютерная и ручная гравировка
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-sm text-slate-900 font-mono">+7 909 02 03 283</div>
              <div className="text-[10px] text-slate-600">Ежедневно с 10:00 до 18:00</div>
              <div className="text-[10px] text-slate-500 mt-1">Официальный бланк заказа</div>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center py-1">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
              ДОГОВОР-ЗАКАЗ {order.orderNumber}
            </h2>
            <p className="text-[11px] text-slate-600">
              на изготовление ритуального изделия и художественное оформление от {order.orderDate} г.
            </p>
          </div>

          {/* Parties & Client Info */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Заказчик:</span>
              <div className="font-bold text-xs text-slate-900">{order.clientName}</div>
              <div className="text-slate-700">Телефон: <span className="font-mono font-semibold">{order.clientPhone}</span></div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Данные захоронения:</span>
              <div className="text-slate-900">
                {order.deceasedName ? (
                  <>ФИО на памятнике: <span className="font-semibold">{order.deceasedName}</span></>
                ) : (
                  <span className="text-slate-400">ФИО на памятнике не указано</span>
                )}
              </div>
              <div className="text-slate-700">
                Кладбище: <span className="font-medium">{order.cemetery || 'По согласованию'}</span>
              </div>
            </div>
          </div>

          {/* Specification Table */}
          <div>
            <div className="font-bold text-[11px] uppercase tracking-wider text-slate-800 mb-1.5">
              1. Спецификация и комплектация заказа:
            </div>
            <table className="w-full border-collapse border border-slate-300 text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="border border-slate-300 px-2.5 py-1.5 text-center w-8">№</th>
                  <th className="border border-slate-300 px-2.5 py-1.5 text-left">Наименование элемента / услуги</th>
                  <th className="border border-slate-300 px-2.5 py-1.5 text-center">Размеры / Характеристики</th>
                  <th className="border border-slate-300 px-2.5 py-1.5 text-right w-24">Стоимость</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-2.5 py-1.5 text-center">1</td>
                  <td className="border border-slate-300 px-2.5 py-1.5 font-semibold">
                    Стела ({order.materialName})
                  </td>
                  <td className="border border-slate-300 px-2.5 py-1.5 text-center">
                    {order.steleSize || order.steleName}
                  </td>
                  <td className="border border-slate-300 px-2.5 py-1.5 text-right font-mono font-semibold">
                    Включено
                  </td>
                </tr>

                {order.standName && order.standName !== 'Без тумбы' && (
                  <tr>
                    <td className="border border-slate-300 px-2.5 py-1.5 text-center">2</td>
                    <td className="border border-slate-300 px-2.5 py-1.5">Тумба под стелу</td>
                    <td className="border border-slate-300 px-2.5 py-1.5 text-center">
                      {order.standSize || order.standName}
                    </td>
                    <td className="border border-slate-300 px-2.5 py-1.5 text-right font-mono">
                      В комплекте
                    </td>
                  </tr>
                )}

                {order.flowerBedName && order.flowerBedName !== 'Без цветников' && (
                  <tr>
                    <td className="border border-slate-300 px-2.5 py-1.5 text-center">3</td>
                    <td className="border border-slate-300 px-2.5 py-1.5">Цветники</td>
                    <td className="border border-slate-300 px-2.5 py-1.5 text-center">
                      {order.flowerBedSize || order.flowerBedName}
                    </td>
                    <td className="border border-slate-300 px-2.5 py-1.5 text-right font-mono">
                      В комплекте
                    </td>
                  </tr>
                )}

                {order.plateName && order.plateName !== 'Без плиты' && (
                  <tr>
                    <td className="border border-slate-300 px-2.5 py-1.5 text-center">4</td>
                    <td className="border border-slate-300 px-2.5 py-1.5">Надгробная плита</td>
                    <td className="border border-slate-300 px-2.5 py-1.5 text-center">
                      {order.plateSize || order.plateName}
                    </td>
                    <td className="border border-slate-300 px-2.5 py-1.5 text-right font-mono">
                      Включено
                    </td>
                  </tr>
                )}

                {order.tileName && (
                  <tr>
                    <td className="border border-slate-300 px-2.5 py-1.5 text-center">5</td>
                    <td className="border border-slate-300 px-2.5 py-1.5">
                      Площадка и плитка: {order.tileName}
                    </td>
                    <td className="border border-slate-300 px-2.5 py-1.5 text-center">
                      Участок: {order.plotLength}×{order.plotWidth} м ({order.plotArea} м²), ~{order.tilesCount} шт.
                    </td>
                    <td className="border border-slate-300 px-2.5 py-1.5 text-right font-mono">
                      {order.tileTotalSell ? `${order.tileTotalSell.toLocaleString()} ₽` : 'Включено'}
                    </td>
                  </tr>
                )}

                {/* Services list */}
                {order.servicesList && order.servicesList.length > 0 && (
                  <tr>
                    <td className="border border-slate-300 px-2.5 py-1.5 text-center">6</td>
                    <td className="border border-slate-300 px-2.5 py-1.5" colSpan={2}>
                      <span className="font-semibold block mb-0.5">Художественные работы и услуги:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-700 text-[10px]">
                        {order.servicesList.map((srv, idx) => (
                          <li key={idx}>{srv}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="border border-slate-300 px-2.5 py-1.5 text-right font-mono">
                      Включено
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Box */}
          <div className="border-2 border-slate-900 rounded-xl p-3 bg-slate-50 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900 uppercase">2. Расчет стоимости:</div>
              <div className="text-[11px] text-slate-600">Все цены окончательные и изменению не подлежат.</div>
            </div>
            <div className="text-right space-y-0.5 font-mono">
              <div>Общая стоимость: <span className="font-bold text-sm text-slate-900">{order.totalSellPrice.toLocaleString()} ₽</span></div>
              <div className="text-emerald-700">Внесен аванс (предоплата): <span className="font-bold">{order.prepayment.toLocaleString()} ₽</span></div>
              <div className="text-blue-900 font-bold">Остаток к доплате при приёмке: <span className="text-sm underline">{order.remainingPayment.toLocaleString()} ₽</span></div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="p-2 border border-slate-200 rounded-lg text-[10px] text-slate-600 bg-white">
              <span className="font-bold text-slate-800">Особые отметки и пожелания:</span> {order.notes}
            </div>
          )}

          {/* Terms & Warranty */}
          <div className="text-[9px] text-slate-500 leading-tight space-y-1 border-t border-slate-200 pt-2">
            <p>1. Исполнитель гарантирует соответствие материала стандартам ГОСТ и высокое качество художественных работ.</p>
            <p>2. Эскиз расположения портрета, дат и надписей утверждается Заказчиком до начала гравировальных работ.</p>
            <p>3. Окончательный расчет производится Заказчиком в момент осмотра и подписания акта приема-передачи готового изделия.</p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t-2 border-slate-900 text-xs">
            <div>
              <div className="font-bold uppercase text-slate-900 mb-6">Исполнитель:</div>
              <div className="border-b border-slate-900 pb-1 flex justify-between text-[11px]">
                <span>«Кристалл»</span>
                <span className="text-slate-400">М.П. / Подпись</span>
              </div>
            </div>

            <div>
              <div className="font-bold uppercase text-slate-900 mb-6">Заказчик:</div>
              <div className="border-b border-slate-900 pb-1 flex justify-between text-[11px]">
                <span>{order.clientName}</span>
                <span className="text-slate-400">Подпись</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
