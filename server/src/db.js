import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../data/database.json');

// Ensure data folder exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Default initial state matching the workshop specs
const getInitialData = () => {
  const salt = bcrypt.genSaltSync(10);
  const defaultAdminPassword = bcrypt.hashSync('admin123', salt);

  return {
    users: [
      {
        id: 'u_owner',
        username: 'admin',
        fullName: 'Администратор (Кристалл)',
        role: 'admin',
        passwordHash: defaultAdminPassword,
        createdAt: new Date().toISOString(),
      },
    ],
    systemSettings: {
      companyName: '«Кристалл»',
      tagline: 'Изготовление памятников, надгробий, комплексов и оград',
      phone: '+7 909 02 03 283',
      workingHours: 'Ежедневно с 10:00 до 18:00',
      tileReservePercent: 10,
    },
    materials: [
      {
        id: 'gabbro',
        name: 'Габбро-диабаз (Карелия, черный)',
        origin: 'Карелия',
        buyMultiplier: 1.0,
        description: 'Классический глубокий черный камень, идеален для портретов',
      },
      {
        id: 'gray_dymov',
        name: 'Дымовский (серый / буро-коричневый)',
        origin: 'Ленинградская обл.',
        buyMultiplier: 1.15,
        description: 'Благородный среднезернистый серый гранит',
      },
      {
        id: 'gray_mansur',
        name: 'Мансуровский (светло-серый)',
        origin: 'Урал',
        buyMultiplier: 1.1,
        description: 'Самый светлый гранит в РФ',
      },
      {
        id: 'marble_koelga',
        name: 'Мрамор Коелга (белый)',
        origin: 'Челябинская обл.',
        buyMultiplier: 0.95,
        description: 'Белый уральский мрамор с серыми прожилками',
      },
      {
        id: 'red_granite',
        name: 'Сюскюянсаари (красный гранит)',
        origin: 'Карелия',
        buyMultiplier: 1.4,
        description: 'Элитный насыщенный карельский гранит',
      },
    ],
    steles: [
      {
        id: 'st_1',
        materialId: 'gabbro',
        name: 'Стела 80х40х5',
        height: 80,
        width: 40,
        thickness: 5,
        buyPrice: 8500,
        sellPrice: 17000,
        form: 'Прямоугольная',
      },
      {
        id: 'st_2',
        materialId: 'gabbro',
        name: 'Стела 100х50х8',
        height: 100,
        width: 50,
        thickness: 8,
        buyPrice: 14500,
        sellPrice: 28500,
        form: 'Прямоугольная',
      },
      {
        id: 'st_3',
        materialId: 'gabbro',
        name: 'Стела 120х60х8',
        height: 120,
        width: 60,
        thickness: 8,
        buyPrice: 21000,
        sellPrice: 42000,
        form: 'Прямоугольная',
      },
    ],
    stands: [
      {
        id: 'stand_1',
        materialId: 'gabbro',
        name: 'Тумба 50х20х15',
        length: 50,
        width: 20,
        height: 15,
        buyPrice: 3200,
        sellPrice: 6500,
      },
      {
        id: 'stand_2',
        materialId: 'gabbro',
        name: 'Тумба 60х20х15',
        length: 60,
        width: 20,
        height: 15,
        buyPrice: 3800,
        sellPrice: 7800,
      },
      {
        id: 'stand_3',
        materialId: 'gabbro',
        name: 'Тумба 70х20х20',
        length: 70,
        width: 20,
        height: 20,
        buyPrice: 4800,
        sellPrice: 9900,
      },
    ],
    flowerBeds: [
      {
        id: 'fb_1',
        materialId: 'gabbro',
        name: 'Цветники 100х50 (комплект)',
        length: 100,
        width: 50,
        thickness: 8,
        buyPrice: 4500,
        sellPrice: 9500,
      },
      {
        id: 'fb_2',
        materialId: 'gabbro',
        name: 'Цветники 120х60 (комплект)',
        length: 120,
        width: 60,
        thickness: 8,
        buyPrice: 5800,
        sellPrice: 12000,
      },
    ],
    plates: [
      {
        id: 'pl_1',
        materialId: 'gabbro',
        name: 'Надгробная плита 100х50х5',
        length: 100,
        width: 50,
        thickness: 5,
        buyPrice: 7500,
        sellPrice: 15500,
      },
      {
        id: 'pl_2',
        materialId: 'gabbro',
        name: 'Надгробная плита 60х50х5',
        length: 60,
        width: 50,
        thickness: 5,
        buyPrice: 4500,
        sellPrice: 9500,
      },
    ],
    tiles: [
      {
        id: 'tile_granite_30',
        name: 'Гранитная плитка 30х30х2',
        lengthCm: 30,
        widthCm: 30,
        thicknessCm: 2,
        buyPricePerM2: 2400,
        sellPricePerM2: 5200,
        unit: 'м²',
        type: 'granite',
      },
      {
        id: 'tile_trotuar',
        name: 'Тротуарная брусчатка',
        lengthCm: 20,
        widthCm: 10,
        thicknessCm: 4,
        buyPricePerM2: 700,
        sellPricePerM2: 1700,
        unit: 'м²',
        type: 'concrete',
      },
    ],
    services: [
      {
        id: 'srv_portrait_machine',
        category: 'portrait',
        name: 'Портрет компьютерный (станок)',
        description: 'Четкий станочный портрет с фото заказчика',
        buyPrice: 1200,
        sellPrice: 4500,
      },
      {
        id: 'srv_portrait_manual',
        category: 'portrait',
        name: 'Портрет ручной (художник)',
        description: 'Глубокая ручная пробивка скарпелью',
        buyPrice: 3500,
        sellPrice: 9000,
      },
      {
        id: 'srv_text_sandblast',
        category: 'engraving',
        name: 'Гравировка ФИО + даты (пескоструй)',
        description: 'Пескоструйная глубокая гравировка текста',
        buyPrice: 500,
        sellPrice: 2000,
      },
      {
        id: 'srv_text_machine',
        category: 'engraving',
        name: 'Гравировка ФИО + даты (станок)',
        description: 'Станочная гравировка текста',
        buyPrice: 400,
        sellPrice: 1800,
      },
      {
        id: 'srv_cross_flowers',
        category: 'engraving',
        name: 'Гравировка крестика и цветов',
        description: 'Стандартное художественное оформление',
        buyPrice: 300,
        sellPrice: 1500,
      },
      {
        id: 'srv_epitaph',
        category: 'engraving',
        name: 'Эпитафия',
        description: 'Памятная надпись за знак',
        buyPrice: 15,
        sellPrice: 65,
        unit: 'за знак',
      },
      {
        id: 'srv_install_base',
        category: 'installation',
        name: 'Установка памятника',
        description: 'Монтаж стелы и тумбы на кладбище',
        buyPrice: 3000,
        sellPrice: 8000,
      },
    ],
    orders: [
      {
        id: 'ord_1',
        orderNumber: '№ 2026-081',
        clientName: 'Михайлов Сергей Петрович',
        clientPhone: '+7 (916) 432-11-22',
        deceasedName: 'Михайлова Анна Васильевна (1948 - 2023)',
        cemetery: 'Северное кладбище, участок 14Б',
        orderDate: '2026-11-18',
        status: 'in_progress',
        materialName: 'Габбро-диабаз (Карелия, черный)',
        steleName: 'Стела 100х50х8 (Волна)',
        standName: 'Тумба 60х20х15',
        flowerBedName: 'Цветники 100х50',
        plateName: 'Надгробная плита 60х50х5',
        plotLength: 2.0,
        plotWidth: 1.8,
        plotArea: 3.6,
        tileName: 'Гранитная плитка 30х30х2',
        tilesCount: 44,
        tileTotalSell: 18720,
        tileTotalBuy: 8640,
        portraitType: 'Портрет ручной (художник)',
        formCutName: 'Волна',
        formCutPrice: 3500,
        servicesList: [
          'Портрет ручной (художник)',
          'Гравировка ФИО + даты (станок)',
          'Гравировка крестика и цветов',
          'Вырез формы: Волна',
          'Установка памятника',
        ],
        totalSellPrice: 83520,
        totalBuyCost: 38740,
        profit: 44780,
        prepayment: 45000,
        remainingPayment: 38520,
        notes: 'Эскиз согласован по WhatsApp.',
        createdBy: 'admin',
      },
    ],
  };
};

export const getDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, re-initializing', err);
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
};

export const saveDb = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};
