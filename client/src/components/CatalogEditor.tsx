import React, { useState } from 'react';
import type { CatalogData } from '../types';
import { api } from '../api';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Edit2,
  X,
} from 'lucide-react';

interface Props {
  catalog: CatalogData;
  onCatalogUpdated: () => void;
}

export const CatalogEditor: React.FC<Props> = ({ catalog, onCatalogUpdated }) => {
  const [activeTab, setActiveTab] = useState<string>('steles');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingItem, setEditingItem] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleSaveItem = async (category: string, item: unknown) => {
    try {
      await api.saveCatalogItem(category, item);
      setStatusMessage('Цены успешно сохранены!');
      setEditingItem(null);
      onCatalogUpdated();
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      alert('Ошибка при сохранении позиции');
    }
  };

  const handleDeleteItem = async (category: string, id: string) => {
    if (!confirm('Вы точно хотите удалить эту позицию из номенклатуры?')) return;
    try {
      await api.deleteCatalogItem(category, id);
      setStatusMessage('Позиция удалена');
      onCatalogUpdated();
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const tabs = [
    { id: 'steles', label: '🗿 Стелы' },
    { id: 'stands', label: '🏛️ Тумбы' },
    { id: 'flowerBeds', label: '🌷 Цветники' },
    { id: 'plates', label: '⬛ Надгробные плиты' },
    { id: 'tiles', label: '🧱 Плитка' },
    { id: 'materials', label: '🪨 Камни (Материалы)' },
    { id: 'services', label: '🎨 Услуги и гравировка' },
  ];

  return (
    <div className="space-y-6">
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-xl">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setEditingItem(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
            <p className="text-xs text-slate-400">
              Здесь можно быстро изменять розничные цены, себестоимость закупки и добавлять новые размеры
            </p>
          </div>
          <button
            onClick={() => setEditingItem({ isNew: true })}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>Добавить позицию</span>
          </button>
        </div>

        {/* STELES LIST */}
        {activeTab === 'steles' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-2">
                <tr>
                  <th className="py-2.5">Наименование стелы</th>
                  <th>Размеры (ВхШхТ см)</th>
                  <th>Форма</th>
                  <th>Закупочная цена</th>
                  <th>Розничная цена</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {catalog.steles.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-950/40">
                    <td className="py-3 font-semibold text-white">{item.name}</td>
                    <td>{item.height} × {item.width} × {item.thickness} см</td>
                    <td><span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{item.form}</span></td>
                    <td className="font-mono text-slate-400">{item.buyPrice.toLocaleString()} ₽</td>
                    <td className="font-mono font-bold text-amber-400">{item.sellPrice.toLocaleString()} ₽</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1 text-slate-400 hover:text-amber-400 cursor-pointer"
                        title="Редактировать цену"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('steles', item.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                        title="Удалить"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* STANDS LIST */}
        {activeTab === 'stands' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-2">
                <tr>
                  <th className="py-2.5">Подставка (Тумба)</th>
                  <th>Размеры (ДхШхВ см)</th>
                  <th>Закупочная цена</th>
                  <th>Розничная цена</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {catalog.stands.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-950/40">
                    <td className="py-3 font-semibold text-white">{item.name}</td>
                    <td>{item.length} × {item.width} × {item.height} см</td>
                    <td className="font-mono text-slate-400">{item.buyPrice.toLocaleString()} ₽</td>
                    <td className="font-mono font-bold text-amber-400">{item.sellPrice.toLocaleString()} ₽</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1 text-slate-400 hover:text-amber-400 cursor-pointer"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('stands', item.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FLOWER BEDS LIST */}
        {activeTab === 'flowerBeds' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-2">
                <tr>
                  <th className="py-2.5">Цветник</th>
                  <th>Размеры (ДхШ см)</th>
                  <th>Закупочная цена</th>
                  <th>Розничная цена</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {catalog.flowerBeds.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-950/40">
                    <td className="py-3 font-semibold text-white">{item.name}</td>
                    <td>{item.length} × {item.width} см</td>
                    <td className="font-mono text-slate-400">{item.buyPrice.toLocaleString()} ₽</td>
                    <td className="font-mono font-bold text-amber-400">{item.sellPrice.toLocaleString()} ₽</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1 text-slate-400 hover:text-amber-400 cursor-pointer"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('flowerBeds', item.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PLATES LIST */}
        {activeTab === 'plates' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-2">
                <tr>
                  <th className="py-2.5">Надгробная плита</th>
                  <th>Размеры (ДхШхТ см)</th>
                  <th>Закупочная цена</th>
                  <th>Розничная цена</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {catalog.plates.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-950/40">
                    <td className="py-3 font-semibold text-white">{item.name}</td>
                    <td>{item.length} × {item.width} × {item.thickness} см</td>
                    <td className="font-mono text-slate-400">{item.buyPrice.toLocaleString()} ₽</td>
                    <td className="font-mono font-bold text-amber-400">{item.sellPrice.toLocaleString()} ₽</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1 text-slate-400 hover:text-amber-400 cursor-pointer"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('plates', item.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TILES LIST */}
        {activeTab === 'tiles' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-2">
                <tr>
                  <th className="py-2.5">Плитка для площадки</th>
                  <th>Размер элемента (см)</th>
                  <th>Закупка за 1 м²</th>
                  <th>Продажа за 1 м²</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {catalog.tiles.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-950/40">
                    <td className="py-3 font-semibold text-white">{item.name}</td>
                    <td>{item.lengthCm} × {item.widthCm} × {item.thicknessCm} см</td>
                    <td className="font-mono text-slate-400">{item.buyPricePerM2.toLocaleString()} ₽/м²</td>
                    <td className="font-mono font-bold text-amber-400">{item.sellPricePerM2.toLocaleString()} ₽/м²</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1 text-slate-400 hover:text-amber-400 cursor-pointer"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('tiles', item.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MATERIALS LIST */}
        {activeTab === 'materials' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-2">
                <tr>
                  <th className="py-2.5">Порода камня</th>
                  <th>Месторождение</th>
                  <th>Коэф. закупки</th>
                  <th>Описание</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {catalog.materials.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-950/40">
                    <td className="py-3 font-semibold text-white">{item.name}</td>
                    <td>{item.origin}</td>
                    <td className="font-mono font-bold text-amber-400">×{item.buyMultiplier}</td>
                    <td className="text-slate-400 max-w-xs">{item.description}</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1 text-slate-400 hover:text-amber-400 cursor-pointer"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('materials', item.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SERVICES LIST */}
        {activeTab === 'services' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-2">
                <tr>
                  <th className="py-2.5">Услуга / Работа</th>
                  <th>Категория</th>
                  <th>Оплата мастеру (закупка)</th>
                  <th>Цена для клиента</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {catalog.services.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-950/40">
                    <td className="py-3 font-semibold text-white">
                      <div>{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.description}</div>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="font-mono text-slate-400">{item.buyPrice.toLocaleString()} ₽</td>
                    <td className="font-mono font-bold text-amber-400">{item.sellPrice.toLocaleString()} ₽</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1 text-slate-400 hover:text-amber-400 cursor-pointer"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('services', item.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingItem.id ? 'Редактировать позицию' : 'Добавить новую позицию'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveItem(activeTab, editingItem);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 uppercase font-semibold text-[10px] mb-1">
                  Наименование
                </label>
                <input
                  type="text"
                  required
                  value={(editingItem.name as string) || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Например: Стела волна 110х55х8"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              {activeTab === 'steles' && (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Высота (см)</label>
                    <input
                      type="number"
                      value={(editingItem.height as number) || 100}
                      onChange={(e) => setEditingItem({ ...editingItem, height: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Ширина (см)</label>
                    <input
                      type="number"
                      value={(editingItem.width as number) || 50}
                      onChange={(e) => setEditingItem({ ...editingItem, width: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Толщина (см)</label>
                    <input
                      type="number"
                      value={(editingItem.thickness as number) || 8}
                      onChange={(e) => setEditingItem({ ...editingItem, thickness: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'tiles' ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Закупка (₽ / м²)</label>
                    <input
                      type="number"
                      required
                      value={(editingItem.buyPricePerM2 as number) || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, buyPricePerM2: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Продажа (₽ / м²)</label>
                    <input
                      type="number"
                      required
                      value={(editingItem.sellPricePerM2 as number) || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, sellPricePerM2: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                </div>
              ) : activeTab === 'materials' ? (
                <div>
                  <label className="block text-slate-400 mb-1">Коэффициент наценки</label>
                  <input
                    type="number"
                    step="0.05"
                    value={(editingItem.buyMultiplier as number) || 1.0}
                    onChange={(e) => setEditingItem({ ...editingItem, buyMultiplier: parseFloat(e.target.value) || 1.0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Себестоимость закупки (₽)</label>
                    <input
                      type="number"
                      required
                      value={(editingItem.buyPrice as number) || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, buyPrice: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Розничная цена (₽)</label>
                    <input
                      type="number"
                      required
                      value={(editingItem.sellPrice as number) || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, sellPrice: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Сохранить в базу
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
