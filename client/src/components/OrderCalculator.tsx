import React, { useState, useMemo } from 'react';
import type { CatalogData, Order } from '../types';
import { api } from '../api';
import { PrintContractModal } from './PrintContractModal';
import {
  Calculator,
  Save,
  Printer,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Plus,
} from 'lucide-react';

interface Props {
  catalog: CatalogData;
  onOrderCreated: (order: Order) => void;
}

export const OrderCalculator: React.FC<Props> = ({ catalog, onOrderCreated }) => {
  // 1. Material (Камень)
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(catalog.materials[0]?.id || 'gabbro');
  const [isCustomMaterial, setIsCustomMaterial] = useState<boolean>(false);
  const [customMaterialName, setCustomMaterialName] = useState<string>('');
  const [showAddMaterialInput, setShowAddMaterialInput] = useState<boolean>(false);
  const [newMaterialInput, setNewMaterialInput] = useState<string>('');

  // 2. Stele (Стела: из каталога или свободный ввод)
  const [steleMode, setSteleMode] = useState<'catalog' | 'custom'>('catalog');
  const [selectedSteleId, setSelectedSteleId] = useState<string>(catalog.steles[0]?.id || '');
  const [customSteleName, setCustomSteleName] = useState<string>('Стела 100х50х8 (свой размер)');
  const [customSteleH, setCustomSteleH] = useState<number>(100);
  const [customSteleW, setCustomSteleW] = useState<number>(50);
  const [customSteleT, setCustomSteleT] = useState<number>(8);
  const [customSteleSell, setCustomSteleSell] = useState<number>(28500);
  const [customSteleBuy, setCustomSteleBuy] = useState<number>(14500);

  // 3. Stand (Тумба: каталог / свободный ввод / без тумбы)
  const [standMode, setStandMode] = useState<'catalog' | 'custom' | 'none'>('catalog');
  const [selectedStandId, setSelectedStandId] = useState<string>(catalog.stands[0]?.id || '');
  const [customStandName, setCustomStandName] = useState<string>('Тумба 60х20х15');
  const [customStandSell, setCustomStandSell] = useState<number>(7800);
  const [customStandBuy, setCustomStandBuy] = useState<number>(3800);

  // 4. FlowerBeds (Цветники: каталог / свободный ввод / без цветников)
  const [flowerBedMode, setFlowerBedMode] = useState<'catalog' | 'custom' | 'none'>('catalog');
  const [selectedFlowerBedId, setSelectedFlowerBedId] = useState<string>(catalog.flowerBeds[0]?.id || '');
  const [customFlowerBedName, setCustomFlowerBedName] = useState<string>('Цветники 100х50 (комплект)');
  const [customFlowerBedSell, setCustomFlowerBedSell] = useState<number>(9500);
  const [customFlowerBedBuy, setCustomFlowerBedBuy] = useState<number>(4500);

  // 5. Plate (Надгробная плита: без плиты / каталог / свободный ввод)
  const [plateMode, setPlateMode] = useState<'none' | 'catalog' | 'custom'>('none');
  const [selectedPlateId, setSelectedPlateId] = useState<string>(catalog.plates[0]?.id || '');
  const [customPlateName, setCustomPlateName] = useState<string>('Надгробная плита 100х50х5');
  const [customPlateSell, setCustomPlateSell] = useState<number>(15500);
  const [customPlateBuy, setCustomPlateBuy] = useState<number>(7500);

  // 6. Plot & Tiles (Площадка и плитка со свободным вводом)
  const [hasPlot, setHasPlot] = useState<boolean>(true);
  const [plotLength, setPlotLength] = useState<number>(2.0);
  const [plotWidth, setPlotWidth] = useState<number>(1.8);

  const [hasTiles, setHasTiles] = useState<boolean>(true);
  const [tileName, setTileName] = useState<string>('Гранитная плитка 30х30х2');
  const [tileLengthCm, setTileLengthCm] = useState<number>(30);
  const [tileWidthCm, setTileWidthCm] = useState<number>(30);
  const [tileSellPerM2, setTileSellPerM2] = useState<number>(5200);
  const [tileBuyPerM2, setTileBuyPerM2] = useState<number>(2400);

  // 7. Art & Cutting (Портрет, гравировка ФИО пескоструй/станок, вырез форм)
  const [portraitType, setPortraitType] = useState<'none' | 'machine' | 'manual'>('machine');
  const [portraitPrice, setPortraitPrice] = useState<number>(4500);
  const [portraitCost, setPortraitCost] = useState<number>(1200);

  const [fioEngravingType, setFioEngravingType] = useState<'none' | 'sandblast' | 'machine' | 'manual'>('sandblast');
  const [fioEngravingPrice, setFioEngravingPrice] = useState<number>(2000);
  const [fioEngravingCost, setFioEngravingCost] = useState<number>(500);

  // Form cut (Свободный ввод формы)
  const [formCutEnabled, setFormCutEnabled] = useState<boolean>(true);
  const [formCutName, setFormCutName] = useState<string>('Волна со снятием фаски');
  const [formCutPrice, setFormCutPrice] = useState<number>(3500);
  const [formCutCost, setFormCutCost] = useState<number>(1000);

  const [hasCrossFlowers, setHasCrossFlowers] = useState<boolean>(true);
  const [crossFlowersPrice] = useState<number>(1500);
  const [crossFlowersCost] = useState<number>(300);

  const [epitaphChars, setEpitaphChars] = useState<number>(0);
  const [epitaphPricePerChar] = useState<number>(65);
  const [epitaphCostPerChar] = useState<number>(15);

  const [hasInstallation, setHasInstallation] = useState<boolean>(true);
  const [installationPrice] = useState<number>(8000);
  const [installationCost] = useState<number>(3000);

  // 8. Client Info (NO dueDate!)
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [deceasedName, setDeceasedName] = useState<string>('');
  const [cemetery, setCemetery] = useState<string>('');
  const [prepayment, setPrepayment] = useState<number>(30000);
  const [notes, setNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Contract print modal state
  const [contractOrderForPrint, setContractOrderForPrint] = useState<Order | null>(null);

  // Current Material resolved
  const currentMaterial = useMemo(() => {
    if (isCustomMaterial) {
      return { id: 'custom', name: customMaterialName || 'Индивидуальный камень', buyMultiplier: 1.0 };
    }
    return catalog.materials.find((m) => m.id === selectedMaterialId) || catalog.materials[0];
  }, [isCustomMaterial, customMaterialName, catalog.materials, selectedMaterialId]);

  // Stele values
  const steleVal = useMemo(() => {
    if (steleMode === 'custom') {
      return {
        name: customSteleName,
        size: `${customSteleH}×${customSteleW}×${customSteleT} см`,
        sell: customSteleSell,
        buy: customSteleBuy,
      };
    }
    const s = catalog.steles.find((x) => x.id === selectedSteleId) || catalog.steles[0];
    return {
      name: s?.name || 'Стела',
      size: s ? `${s.height}×${s.width}×${s.thickness} см` : '',
      sell: s?.sellPrice || 0,
      buy: s?.buyPrice || 0,
    };
  }, [steleMode, customSteleName, customSteleH, customSteleW, customSteleT, customSteleSell, customSteleBuy, catalog.steles, selectedSteleId]);

  // Stand values
  const standVal = useMemo(() => {
    if (standMode === 'none') return { name: 'Без тумбы', size: '', sell: 0, buy: 0 };
    if (standMode === 'custom') {
      return { name: customStandName, size: customStandName, sell: customStandSell, buy: customStandBuy };
    }
    const st = catalog.stands.find((x) => x.id === selectedStandId) || catalog.stands[0];
    return {
      name: st?.name || 'Тумба',
      size: st ? `${st.length}×${st.width}×${st.height} см` : '',
      sell: st?.sellPrice || 0,
      buy: st?.buyPrice || 0,
    };
  }, [standMode, customStandName, customStandSell, customStandBuy, catalog.stands, selectedStandId]);

  // FlowerBed values
  const flowerBedVal = useMemo(() => {
    if (flowerBedMode === 'none') return { name: 'Без цветников', size: '', sell: 0, buy: 0 };
    if (flowerBedMode === 'custom') {
      return { name: customFlowerBedName, size: customFlowerBedName, sell: customFlowerBedSell, buy: customFlowerBedBuy };
    }
    const fb = catalog.flowerBeds.find((x) => x.id === selectedFlowerBedId) || catalog.flowerBeds[0];
    return {
      name: fb?.name || 'Цветники',
      size: fb ? `${fb.length}×${fb.width} см` : '',
      sell: fb?.sellPrice || 0,
      buy: fb?.buyPrice || 0,
    };
  }, [flowerBedMode, customFlowerBedName, customFlowerBedSell, customFlowerBedBuy, catalog.flowerBeds, selectedFlowerBedId]);

  // Plate values
  const plateVal = useMemo(() => {
    if (plateMode === 'none') return { name: 'Без надгробной плиты', size: '', sell: 0, buy: 0 };
    if (plateMode === 'custom') {
      return { name: customPlateName, size: customPlateName, sell: customPlateSell, buy: customPlateBuy };
    }
    const pl = catalog.plates.find((x) => x.id === selectedPlateId) || catalog.plates[0];
    return {
      name: pl?.name || 'Надгробная плита',
      size: pl ? `${pl.length}×${pl.width}×${pl.thickness} см` : '',
      sell: pl?.sellPrice || 0,
      buy: pl?.buyPrice || 0,
    };
  }, [plateMode, customPlateName, customPlateSell, customPlateBuy, catalog.plates, selectedPlateId]);

  // Plot Area
  const plotArea = hasPlot ? Math.round(plotLength * plotWidth * 100) / 100 : 0;

  // Tiles Calc
  const tileCalculation = useMemo(() => {
    if (!hasPlot || !hasTiles) return { tilesCount: 0, totalSell: 0, totalBuy: 0 };
    const oneTileAreaM2 = (tileLengthCm * tileWidthCm) / 10000;
    const baseCount = oneTileAreaM2 > 0 ? Math.ceil(plotArea / oneTileAreaM2) : 0;
    const reservePercent = catalog.settings?.tileReservePercent || 10;
    const tilesCount = Math.ceil(baseCount * (1 + reservePercent / 100));

    const totalSell = Math.round(plotArea * tileSellPerM2);
    const totalBuy = Math.round(plotArea * tileBuyPerM2);

    return { tilesCount, totalSell, totalBuy };
  }, [hasPlot, hasTiles, plotArea, tileLengthCm, tileWidthCm, tileSellPerM2, tileBuyPerM2, catalog.settings]);

  // Total Sell & Buy
  const totalSellPrice = useMemo(() => {
    let sum = steleVal.sell + standVal.sell + flowerBedVal.sell + plateVal.sell;
    if (hasPlot && hasTiles) sum += tileCalculation.totalSell;
    if (portraitType !== 'none') sum += portraitPrice;
    if (fioEngravingType !== 'none') sum += fioEngravingPrice;
    if (formCutEnabled) sum += formCutPrice;
    if (hasCrossFlowers) sum += crossFlowersPrice;
    if (epitaphChars > 0) sum += epitaphChars * epitaphPricePerChar;
    if (hasInstallation) sum += installationPrice;
    return sum;
  }, [
    steleVal, standVal, flowerBedVal, plateVal, hasPlot, hasTiles, tileCalculation,
    portraitType, portraitPrice, fioEngravingType, fioEngravingPrice,
    formCutEnabled, formCutPrice, hasCrossFlowers, crossFlowersPrice,
    epitaphChars, epitaphPricePerChar, hasInstallation, installationPrice,
  ]);

  const totalBuyCost = useMemo(() => {
    let sum = steleVal.buy + standVal.buy + flowerBedVal.buy + plateVal.buy;
    if (hasPlot && hasTiles) sum += tileCalculation.totalBuy;
    if (portraitType !== 'none') sum += portraitCost;
    if (fioEngravingType !== 'none') sum += fioEngravingCost;
    if (formCutEnabled) sum += formCutCost;
    if (hasCrossFlowers) sum += crossFlowersCost;
    if (epitaphChars > 0) sum += epitaphChars * epitaphCostPerChar;
    if (hasInstallation) sum += installationCost;
    return sum;
  }, [
    steleVal, standVal, flowerBedVal, plateVal, hasPlot, hasTiles, tileCalculation,
    portraitType, portraitCost, fioEngravingType, fioEngravingCost,
    formCutEnabled, formCutCost, hasCrossFlowers, crossFlowersCost,
    epitaphChars, epitaphCostPerChar, hasInstallation, installationCost,
  ]);

  const profit = totalSellPrice - totalBuyCost;
  const marginPercent = totalSellPrice > 0 ? Math.round((profit / totalSellPrice) * 100) : 0;
  const remainingPayment = Math.max(0, totalSellPrice - prepayment);

  // List of active services
  const servicesList = useMemo(() => {
    const list: string[] = [];
    if (portraitType === 'machine') list.push('Портрет компьютерный (станок)');
    if (portraitType === 'manual') list.push('Портрет ручной (художник)');
    if (fioEngravingType === 'sandblast') list.push('Гравировка ФИО + даты (пескоструй)');
    if (fioEngravingType === 'machine') list.push('Гравировка ФИО + даты (станок)');
    if (fioEngravingType === 'manual') list.push('Гравировка ФИО + даты (ручная)');
    if (formCutEnabled && formCutName) list.push(`Вырез формы: ${formCutName}`);
    if (hasCrossFlowers) list.push('Гравировка крестика и цветов');
    if (epitaphChars > 0) list.push(`Эпитафия (${epitaphChars} зн.)`);
    if (hasInstallation) list.push('Установка памятника');
    return list;
  }, [portraitType, fioEngravingType, formCutEnabled, formCutName, hasCrossFlowers, epitaphChars, hasInstallation]);

  const prepareOrderData = (): Partial<Order> => ({
    clientName: clientName.trim(),
    clientPhone: clientPhone.trim(),
    deceasedName: deceasedName.trim() || undefined,
    cemetery: cemetery.trim() || undefined,
    materialName: currentMaterial.name,
    steleName: steleVal.name,
    steleSize: steleVal.size,
    standName: standVal.name,
    standSize: standVal.size,
    flowerBedName: flowerBedVal.name,
    flowerBedSize: flowerBedVal.size,
    plateName: plateVal.name,
    plateSize: plateVal.size,
    plotLength: hasPlot ? plotLength : undefined,
    plotWidth: hasPlot ? plotWidth : undefined,
    plotArea: hasPlot ? plotArea : undefined,
    tileName: hasPlot && hasTiles ? tileName : undefined,
    tilesCount: hasPlot && hasTiles ? tileCalculation.tilesCount : undefined,
    tileTotalSell: tileCalculation.totalSell,
    tileTotalBuy: tileCalculation.totalBuy,
    portraitType:
      portraitType === 'machine'
        ? 'Компьютерный портрет'
        : portraitType === 'manual'
        ? 'Ручной портрет'
        : 'Без портрета',
    engravingType:
      fioEngravingType === 'sandblast'
        ? 'Пескоструй'
        : fioEngravingType === 'machine'
        ? 'Станок'
        : 'Без гравировки ФИО',
    formCutName: formCutEnabled ? formCutName : undefined,
    formCutPrice: formCutEnabled ? formCutPrice : 0,
    servicesList,
    totalSellPrice,
    totalBuyCost,
    profit,
    prepayment,
    remainingPayment,
    notes: notes.trim() || undefined,
  });

  const handleSaveOrder = async () => {
    if (!clientName.trim()) {
      setErrorMessage('Пожалуйста, укажите ФИО заказчика');
      return;
    }
    if (!clientPhone.trim()) {
      setErrorMessage('Пожалуйста, укажите контактный телефон');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const orderPayload = prepareOrderData();
      const res = await api.createOrder(orderPayload);
      setSuccessMessage(`Заказ ${res.order.orderNumber} сохранен в базу «Кристалл»!`);
      onOrderCreated(res.order);
      setClientName('');
      setClientPhone('');
      setDeceasedName('');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ошибка сохранения заказа');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenContractPrint = () => {
    const orderData = prepareOrderData();
    const tempOrder: Order = {
      ...(orderData as Order),
      id: 'temp_contract',
      orderNumber: `№ 2026-ПРОЕКТ`,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'new',
      createdBy: 'admin',
    };
    setContractOrderForPrint(tempOrder);
  };

  const handleQuickAddMaterial = async () => {
    if (!newMaterialInput.trim()) return;
    try {
      await api.saveCatalogItem('materials', {
        name: newMaterialInput.trim(),
        origin: 'Индивидуальный заказ',
        buyMultiplier: 1.1,
        description: 'Добавленный камень',
      });
      setNewMaterialInput('');
      setShowAddMaterialInput(false);
      window.location.reload();
    } catch (err) {
      alert('Ошибка добавления породы камня');
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Options & Free Custom Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Stone Material */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Выбор камня</h3>
                  <p className="text-xs text-slate-400">Габбро, серый гранит, мрамор или свой камень</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddMaterialInput(!showAddMaterialInput)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Добавить камень в базу</span>
              </button>
            </div>

            {/* Quick add stone input */}
            {showAddMaterialInput && (
              <div className="p-3 bg-slate-950 rounded-2xl border border-blue-500/40 flex gap-2">
                <input
                  type="text"
                  value={newMaterialInput}
                  onChange={(e) => setNewMaterialInput(e.target.value)}
                  placeholder="Название камня (например: Балтийский гранит)"
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleQuickAddMaterial}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Сохранить
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {catalog.materials.map((mat) => {
                const isSelected = !isCustomMaterial && mat.id === selectedMaterialId;
                return (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => {
                      setIsCustomMaterial(false);
                      setSelectedMaterialId(mat.id);
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-sm flex items-center justify-between">
                      <span>{mat.name}</span>
                      {isSelected && <CheckCircle2 size={16} className="text-blue-400" />}
                    </div>
                  </button>
                );
              })}

              {/* Custom Stone Button */}
              <button
                type="button"
                onClick={() => setIsCustomMaterial(true)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  isCustomMaterial
                    ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-semibold text-sm flex items-center justify-between">
                  <span>Ввести камень вручную</span>
                  {isCustomMaterial && <CheckCircle2 size={16} className="text-blue-400" />}
                </div>
              </button>
            </div>

            {isCustomMaterial && (
              <div className="pt-2">
                <input
                  type="text"
                  value={customMaterialName}
                  onChange={(e) => setCustomMaterialName(e.target.value)}
                  placeholder="Введите породу камня (например: Змеевик Уральский)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-blue-500/50 text-white text-sm"
                />
              </div>
            )}
          </div>

          {/* 2. Stele, Stand & Flowerbeds & Plate with FREE SIZING */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                2
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Комплект памятника</h3>
                <p className="text-xs text-slate-400">Стела, тумба, цветники и надгробная плита со свободным вводом любых размеров</p>
              </div>
            </div>

            {/* --- СТЕЛА --- */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Стела (Обелиск)
                </label>
                <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSteleMode('catalog')}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      steleMode === 'catalog' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Из каталога
                  </button>
                  <button
                    type="button"
                    onClick={() => setSteleMode('custom')}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      steleMode === 'custom' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Свой размер
                  </button>
                </div>
              </div>

              {steleMode === 'catalog' ? (
                <select
                  value={selectedSteleId}
                  onChange={(e) => setSelectedSteleId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                >
                  {catalog.steles.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.height}×{s.width}×{s.thickness} см) — {s.sellPrice.toLocaleString()} ₽ (Закупка: {s.buyPrice.toLocaleString()} ₽)
                    </option>
                  ))}
                </select>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customSteleName}
                    onChange={(e) => setCustomSteleName(e.target.value)}
                    placeholder="Наименование стелы"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Высота (см)</span>
                      <input
                        type="number"
                        value={customSteleH}
                        onChange={(e) => setCustomSteleH(parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Ширина (см)</span>
                      <input
                        type="number"
                        value={customSteleW}
                        onChange={(e) => setCustomSteleW(parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Толщина (см)</span>
                      <input
                        type="number"
                        value={customSteleT}
                        onChange={(e) => setCustomSteleT(parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Продажа (₽)</span>
                      <input
                        type="number"
                        value={customSteleSell}
                        onChange={(e) => setCustomSteleSell(parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono font-bold text-amber-400"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Закупка (₽)</span>
                      <input
                        type="number"
                        value={customSteleBuy}
                        onChange={(e) => setCustomSteleBuy(parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* --- ТУМБА --- */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Тумба (Подставка)
                </label>
                <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setStandMode('catalog')}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      standMode === 'catalog' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Каталог
                  </button>
                  <button
                    type="button"
                    onClick={() => setStandMode('custom')}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      standMode === 'custom' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Свой размер
                  </button>
                  <button
                    type="button"
                    onClick={() => setStandMode('none')}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      standMode === 'none' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Без тумбы
                  </button>
                </div>
              </div>

              {standMode === 'catalog' && (
                <select
                  value={selectedStandId}
                  onChange={(e) => setSelectedStandId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                >
                  {catalog.stands.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} — {st.sellPrice.toLocaleString()} ₽ (Закупка: {st.buyPrice.toLocaleString()} ₽)
                    </option>
                  ))}
                </select>
              )}

              {standMode === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <input
                    type="text"
                    value={customStandName}
                    onChange={(e) => setCustomStandName(e.target.value)}
                    placeholder="Название тумбы / размеры"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                  <div>
                    <input
                      type="number"
                      value={customStandSell}
                      onChange={(e) => setCustomStandSell(parseInt(e.target.value) || 0)}
                      placeholder="Цена продажи (₽)"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={customStandBuy}
                      onChange={(e) => setCustomStandBuy(parseInt(e.target.value) || 0)}
                      placeholder="Цена закупки (₽)"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-slate-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* --- ЦВЕТНИКИ --- */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Цветники
                </label>
                <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setFlowerBedMode('catalog')}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      flowerBedMode === 'catalog' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Каталог
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlowerBedMode('custom')}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      flowerBedMode === 'custom' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Свой размер
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlowerBedMode('none')}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      flowerBedMode === 'none' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Без цветников
                  </button>
                </div>
              </div>

              {flowerBedMode === 'catalog' && (
                <select
                  value={selectedFlowerBedId}
                  onChange={(e) => setSelectedFlowerBedId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                >
                  {catalog.flowerBeds.map((fb) => (
                    <option key={fb.id} value={fb.id}>
                      {fb.name} — {fb.sellPrice.toLocaleString()} ₽ (Закупка: {fb.buyPrice.toLocaleString()} ₽)
                    </option>
                  ))}
                </select>
              )}

              {flowerBedMode === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <input
                    type="text"
                    value={customFlowerBedName}
                    onChange={(e) => setCustomFlowerBedName(e.target.value)}
                    placeholder="Название / размер (например 120х60)"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                  <input
                    type="number"
                    value={customFlowerBedSell}
                    onChange={(e) => setCustomFlowerBedSell(parseInt(e.target.value) || 0)}
                    placeholder="Цена продажи (₽)"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                  />
                  <input
                    type="number"
                    value={customFlowerBedBuy}
                    onChange={(e) => setCustomFlowerBedBuy(parseInt(e.target.value) || 0)}
                    placeholder="Цена закупки (₽)"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-slate-400"
                  />
                </div>
              )}
            </div>

            {/* --- НАДГРОБНАЯ ПЛИТА --- */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Надгробная плита
                </label>
                <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPlateMode('none')}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      plateMode === 'none' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Без плиты
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlateMode('catalog')}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      plateMode === 'catalog' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Каталог
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlateMode('custom')}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      plateMode === 'custom' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Свой размер
                  </button>
                </div>
              </div>

              {plateMode === 'catalog' && (
                <select
                  value={selectedPlateId}
                  onChange={(e) => setSelectedPlateId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                >
                  {catalog.plates.map((pl) => (
                    <option key={pl.id} value={pl.id}>
                      {pl.name} — {pl.sellPrice.toLocaleString()} ₽ (Закупка: {pl.buyPrice.toLocaleString()} ₽)
                    </option>
                  ))}
                </select>
              )}

              {plateMode === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <input
                    type="text"
                    value={customPlateName}
                    onChange={(e) => setCustomPlateName(e.target.value)}
                    placeholder="Название / размер плиты"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                  <input
                    type="number"
                    value={customPlateSell}
                    onChange={(e) => setCustomPlateSell(parseInt(e.target.value) || 0)}
                    placeholder="Цена продажи (₽)"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                  />
                  <input
                    type="number"
                    value={customPlateBuy}
                    onChange={(e) => setCustomPlateBuy(parseInt(e.target.value) || 0)}
                    placeholder="Цена закупки (₽)"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-slate-400"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 3. Площадка и плитка со свободным вводом */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Калькулятор площадки и плитки</h3>
                  <p className="text-xs text-slate-400">Длина, ширина, площадь и свободный расчет плитки</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                <input
                  type="checkbox"
                  checked={hasPlot}
                  onChange={(e) => setHasPlot(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                Площадка
              </label>
            </div>

            {hasPlot && (
              <div className="space-y-4 pt-2">
                {/* Dimensions */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Длина площадки (м)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={plotLength}
                      onChange={(e) => setPlotLength(Math.max(0.1, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Ширина площадки (м)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={plotWidth}
                      onChange={(e) => setPlotWidth(Math.max(0.1, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Площадь:</span>
                    <span className="text-base font-bold text-blue-400 font-mono">{plotArea} м²</span>
                  </div>
                </div>

                {/* Free Tile Input */}
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-slate-300">
                      <input
                        type="checkbox"
                        checked={hasTiles}
                        onChange={(e) => setHasTiles(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      Облицовка плиткой
                    </label>
                    {hasTiles && (
                      <span className="text-xs font-mono font-bold text-blue-400">
                        {tileCalculation.tilesCount} шт. (~{tileCalculation.totalSell.toLocaleString()} ₽)
                      </span>
                    )}
                  </div>

                  {hasTiles && (
                    <div className="space-y-3 pt-1">
                      <input
                        type="text"
                        value={tileName}
                        onChange={(e) => setTileName(e.target.value)}
                        placeholder="Название плитки (например: Гранитная 30х30 или Тротуарная)"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">Длина (см)</span>
                          <input
                            type="number"
                            value={tileLengthCm}
                            onChange={(e) => setTileLengthCm(Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">Ширина (см)</span>
                          <input
                            type="number"
                            value={tileWidthCm}
                            onChange={(e) => setTileWidthCm(Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">Продажа (₽ / м²)</span>
                          <input
                            type="number"
                            value={tileSellPerM2}
                            onChange={(e) => setTileSellPerM2(parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono font-bold text-amber-400"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">Закупка (₽ / м²)</span>
                          <input
                            type="number"
                            value={tileBuyPerM2}
                            onChange={(e) => setTileBuyPerM2(parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs flex justify-between">
                        <span className="text-slate-300">
                          Авторасчет: на площадь <b>{plotArea} м²</b> нужно <b>{tileCalculation.tilesCount} шт.</b> (с учетом +10% запаса)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. Art & Cutting (Портрет, ФИО пескоструй/станок, СВОБОДНЫЙ ВЫРЕЗ ФОРМЫ) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                4
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Художественное оформление и резка</h3>
                <p className="text-xs text-slate-400">Портрет, гравировка текста, свободный ввод формы и монтаж</p>
              </div>
            </div>

            {/* Портрет */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Портрет
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPortraitType('none')}
                  className={`p-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    portraitType === 'none'
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Без портрета
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPortraitType('machine');
                    setPortraitPrice(4500);
                    setPortraitCost(1200);
                  }}
                  className={`p-3 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                    portraitType === 'machine'
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold">Компьютерный</div>
                  <div className="text-[11px] text-slate-400">Станок (4 500 ₽)</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPortraitType('manual');
                    setPortraitPrice(9000);
                    setPortraitCost(3500);
                  }}
                  className={`p-3 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                    portraitType === 'manual'
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold">Ручной</div>
                  <div className="text-[11px] text-slate-400">Художник (9 000 ₽)</div>
                </button>
              </div>
            </div>

            {/* Гравировка ФИО: пескоструй или станок */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Гравировка ФИО и дат
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setFioEngravingType('none')}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    fioEngravingType === 'none'
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Без ФИО
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFioEngravingType('sandblast');
                    setFioEngravingPrice(2000);
                    setFioEngravingCost(500);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    fioEngravingType === 'sandblast'
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  Пескоструй (2 000 ₽)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFioEngravingType('machine');
                    setFioEngravingPrice(1800);
                    setFioEngravingCost(400);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    fioEngravingType === 'machine'
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  Станок (1 800 ₽)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFioEngravingType('manual');
                    setFioEngravingPrice(2500);
                    setFioEngravingCost(800);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    fioEngravingType === 'manual'
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  Ручная (2 500 ₽)
                </button>
              </div>
            </div>

            {/* Вырез формы: СВОБОДНЫЙ ВВОД */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-slate-300">
                  <input
                    type="checkbox"
                    checked={formCutEnabled}
                    onChange={(e) => setFormCutEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  Вырез формы (Резка по камню)
                </label>
                {formCutEnabled && (
                  <span className="text-xs font-mono font-bold text-amber-400">
                    +{formCutPrice.toLocaleString()} ₽
                  </span>
                )}
              </div>

              {formCutEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <input
                    type="text"
                    value={formCutName}
                    onChange={(e) => setFormCutName(e.target.value)}
                    placeholder="Название формы (например: Волна, Плечики, Крест)"
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                  <div>
                    <input
                      type="number"
                      value={formCutPrice}
                      onChange={(e) => setFormCutPrice(parseInt(e.target.value) || 0)}
                      placeholder="Цена для клиента (₽)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold text-amber-400"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={formCutCost}
                      onChange={(e) => setFormCutCost(parseInt(e.target.value) || 0)}
                      placeholder="Оплата резчику (₽)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-slate-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Additional: Крест/Розы, Эпитафия, Установка */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCrossFlowers}
                  onChange={(e) => setHasCrossFlowers(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Гравировка крестика и цветов (+1 500 ₽)</span>
              </label>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>Эпитафия (65 ₽/знак):</span>
                <input
                  type="number"
                  min="0"
                  value={epitaphChars}
                  onChange={(e) => setEpitaphChars(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0 зн."
                  className="w-20 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs text-right"
                />
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 cursor-pointer col-span-1 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={hasInstallation}
                  onChange={(e) => setHasInstallation(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Установка памятника (+{installationPrice.toLocaleString()} ₽)</span>
              </label>
            </div>
          </div>

          {/* 5. Client Info (NO dueDate!) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                5
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Данные заказчика</h3>
                <p className="text-xs text-slate-400">ФИО, контакты, покойный, кладбище и аванс</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  ФИО Заказчика *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Иванов Петр Сергеевич"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm"
                  />
                  <User size={16} className="absolute left-3 top-3 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Телефон заказчика *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm"
                  />
                  <Phone size={16} className="absolute left-3 top-3 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  ФИО покойного (на памятнике)
                </label>
                <input
                  type="text"
                  value={deceasedName}
                  onChange={(e) => setDeceasedName(e.target.value)}
                  placeholder="Иванова Ольга Николаевна"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Кладбище и участок
                </label>
                <input
                  type="text"
                  value={cemetery}
                  onChange={(e) => setCemetery(e.target.value)}
                  placeholder="Северное, уч. 12"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Сумма внесенной предоплаты (₽)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={prepayment}
                  onChange={(e) => setPrepayment(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Примечания и особые отметки
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Пожелания, утверждение эскиза..."
                className="w-full px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column (Sticky): Real-Time Estimate & Print Contract */}
        <div className="space-y-6">
          <div className="sticky top-20 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Calculator size={22} className="text-blue-400" />
                <h3 className="font-bold text-white text-lg">Смета «Кристалл»</h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-500/30">
                Калькулятор
              </span>
            </div>

            {/* Itemized list */}
            <div className="space-y-2 text-xs divide-y divide-slate-800/60 max-h-72 overflow-y-auto pr-1">
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-300 font-medium">Камень: {currentMaterial.name}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-300">{steleVal.name}</span>
                <span className="font-mono text-white font-semibold">{steleVal.sell.toLocaleString()} ₽</span>
              </div>
              {standVal.sell > 0 && (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-300">{standVal.name}</span>
                  <span className="font-mono text-white font-semibold">{standVal.sell.toLocaleString()} ₽</span>
                </div>
              )}
              {flowerBedVal.sell > 0 && (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-300">{flowerBedVal.name}</span>
                  <span className="font-mono text-white font-semibold">{flowerBedVal.sell.toLocaleString()} ₽</span>
                </div>
              )}
              {plateVal.sell > 0 && (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-300">{plateVal.name}</span>
                  <span className="font-mono text-white font-semibold">{plateVal.sell.toLocaleString()} ₽</span>
                </div>
              )}
              {hasPlot && hasTiles && tileCalculation.totalSell > 0 && (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-300">
                    Плитка ({plotArea} м², ~{tileCalculation.tilesCount} шт.)
                  </span>
                  <span className="font-mono text-white font-semibold">{tileCalculation.totalSell.toLocaleString()} ₽</span>
                </div>
              )}
              {servicesList.map((srv, idx) => (
                <div key={idx} className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">{srv}</span>
                  <span className="font-mono text-slate-200">Включено</span>
                </div>
              ))}
            </div>

            {/* Total box */}
            <div className="pt-4 border-t border-slate-800 bg-slate-950/80 -mx-6 -mb-6 p-6 rounded-b-3xl space-y-4">
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold">Итого к оплате заказчиком:</div>
                <div className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                  {totalSellPrice.toLocaleString()} ₽
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-500 block">Предоплата:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {prepayment.toLocaleString()} ₽
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Остаток при сдаче:</span>
                  <span className="font-mono text-slate-300 font-bold">
                    {remainingPayment.toLocaleString()} ₽
                  </span>
                </div>
              </div>

              {/* Profitability for owner */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <TrendingUp size={12} className="text-emerald-400" />
                  <span>Рентабельность изделия:</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Себестоимость:</span>
                  <span className="font-mono text-slate-300">{totalBuyCost.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-emerald-400">Прибыль:</span>
                  <span className="font-mono text-emerald-400">
                    +{profit.toLocaleString()} ₽ ({marginPercent}%)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveOrder}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>Сохранить заказ в базу</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenContractPrint}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer size={16} />
                  <span>Сформировать и напечатать договор-заказ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
