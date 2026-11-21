import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { OrderCalculator } from './components/OrderCalculator';
import { OrdersList } from './components/OrdersList';
import { CatalogEditor } from './components/CatalogEditor';
import { AnalyticsView } from './components/AnalyticsView';
import { api } from './api';
import type { CatalogData, Order, Stats } from './types';
import { RefreshCw } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'calc' | 'orders' | 'catalog' | 'analytics'>('calc');

  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      const [catData, ordData, stData] = await Promise.all([
        api.getCatalog(),
        api.getOrders(),
        api.getStats(),
      ]);
      setCatalog(catData);
      setOrders(ordData);
      setStats(stData);
    } catch (err) {
      console.error('Failed to load CRM data', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <RefreshCw size={24} className="animate-spin text-amber-500" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ordersCount={orders.length}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {isLoading || !catalog ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
            <RefreshCw size={28} className="animate-spin text-amber-400" />
            <span className="text-sm">Загрузка данных мастерской...</span>
          </div>
        ) : (
          <>
            {activeTab === 'calc' && (
              <OrderCalculator
                catalog={catalog}
                onOrderCreated={(newOrd) => {
                  setOrders((prev) => [newOrd, ...prev]);
                  loadData();
                }}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersList orders={orders} onOrdersUpdated={loadData} />
            )}

            {activeTab === 'catalog' && (
              <CatalogEditor catalog={catalog} onCatalogUpdated={loadData} />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView stats={stats} orders={orders} />
            )}
          </>
        )}
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        «Кристалл» &copy; 2026 • Изготовление памятников, надгробий, комплексов и оград • +7 909 02 03 283
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
