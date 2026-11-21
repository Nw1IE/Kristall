export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'admin';
}

export interface Material {
  id: string;
  name: string;
  origin: string;
  buyMultiplier: number;
  description: string;
}

export interface Stele {
  id: string;
  materialId?: string;
  name: string;
  height: number;
  width: number;
  thickness: number;
  buyPrice: number;
  sellPrice: number;
  form: string;
}

export interface Stand {
  id: string;
  materialId?: string;
  name: string;
  length: number;
  width: number;
  height: number;
  buyPrice: number;
  sellPrice: number;
}

export interface FlowerBed {
  id: string;
  materialId?: string;
  name: string;
  length: number;
  width: number;
  thickness: number;
  buyPrice: number;
  sellPrice: number;
}

export interface Plate {
  id: string;
  materialId?: string;
  name: string;
  length: number;
  width: number;
  thickness: number;
  buyPrice: number;
  sellPrice: number;
}

export interface Tile {
  id: string;
  name: string;
  lengthCm: number;
  widthCm: number;
  thicknessCm: number;
  buyPricePerM2: number;
  sellPricePerM2: number;
  unit: string;
  type: 'granite' | 'concrete';
}

export interface Service {
  id: string;
  category: 'portrait' | 'engraving' | 'form_cut' | 'installation';
  name: string;
  description: string;
  buyPrice: number;
  sellPrice: number;
  unit?: string;
}

export interface CatalogData {
  materials: Material[];
  steles: Stele[];
  stands: Stand[];
  flowerBeds: FlowerBed[];
  plates: Plate[];
  tiles: Tile[];
  services: Service[];
  settings: {
    companyName: string;
    tagline: string;
    phone: string;
    workingHours: string;
    tileReservePercent: number;
  };
}

export interface OrderItemSpec {
  name: string;
  size?: string;
  count?: string | number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  deceasedName?: string;
  cemetery?: string;
  orderDate: string;
  status: 'new' | 'in_progress' | 'engraving' | 'ready' | 'installed' | 'completed';
  materialName: string;
  steleName: string;
  steleSize?: string;
  standName: string;
  standSize?: string;
  flowerBedName: string;
  flowerBedSize?: string;
  plateName: string;
  plateSize?: string;
  plotLength?: number;
  plotWidth?: number;
  plotArea?: number;
  tileName?: string;
  tilesCount?: number;
  tileTotalSell?: number;
  tileTotalBuy?: number;
  portraitType?: string;
  engravingType?: string;
  formCutName?: string;
  formCutPrice?: number;
  servicesList: string[];
  itemsBreakdown?: OrderItemSpec[];
  totalSellPrice: number;
  totalBuyCost: number;
  profit: number;
  prepayment: number;
  remainingPayment: number;
  notes?: string;
  createdBy: string;
}

export interface Stats {
  totalTurnover: number;
  totalCost: number;
  totalProfit: number;
  totalPrepaid: number;
  totalPendingPayment: number;
  activeOrdersCount: number;
  completedOrdersCount: number;
  totalOrders: number;
}
