import React, { useState, useEffect } from 'react';
import { type Order, type Product, type User } from '../types';
import { getAllOrders, getProducts, getAllCustomers } from '../services/supabaseClient';

const AdminReports: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'customers'>('orders');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [fetchedOrders, fetchedProducts, fetchedCustomers] = await Promise.all([
        getAllOrders(),
        getProducts(),
        getAllCustomers(),
      ]);
      setOrders(fetchedOrders);
      setProducts(fetchedProducts);
      setCustomers(fetchedCustomers);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert("No data available to export.");
      return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        let val = row[header];
        if (typeof val === 'object') {
          val = JSON.stringify(val).replace(/"/g, '""');
        } else if (typeof val === 'string') {
          val = val.replace(/"/g, '""');
        }
        return `"${val}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportOrders = () => {
    const mappedOrders = orders.map(o => ({
      ID: o.id,
      Date: o.date,
      Customer: o.customerName,
      GarmentType: o.garmentType,
      Status: o.status,
      PaymentStatus: o.paymentStatus || 'Unpaid',
      Price: o.price || 0,
      InternalNotes: o.internalNotes || ''
    }));
    downloadCSV(mappedOrders, 'firofits_orders_report');
  };

  const handleExportProducts = () => {
    const mappedProducts = products.map(p => ({
      ID: p.id,
      Name: p.name,
      Category: p.category,
      Price: p.price,
      Stock: p.stock
    }));
    downloadCSV(mappedProducts, 'firofits_products_report');
  };

  if (isLoading) {
    return <div className="text-sm font-bold text-slate-400 animate-pulse py-12 text-center uppercase tracking-widest">Compiling Database Reports...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-4xl font-serif text-slate-900 uppercase tracking-tight">System Reports</h2>
          <p className="text-sm font-light text-slate-600 mt-2">
            Generate and export detailed administrative data views for accounting and auditing.
          </p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'orders' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Orders Ledger
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`pb-4 px-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'products' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Inventory Ledger
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">All Orders</h3>
            <button
              onClick={handleExportOrders}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg transition-all flex items-center gap-2"
            >
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">ID</th>
                  <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Date</th>
                  <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Customer</th>
                  <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Garment</th>
                  <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                  <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-900 font-medium">{o.id.slice(0, 8)}</td>
                    <td className="py-3 px-4 text-slate-600">{new Date(o.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{o.customerName}</td>
                    <td className="py-3 px-4 text-slate-600">{o.garmentType}</td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{o.status}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">Rs. {o.price?.toLocaleString() || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Inventory Ledger</h3>
            <button
              onClick={handleExportProducts}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg transition-all flex items-center gap-2"
            >
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Product ID</th>
                  <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Name</th>
                  <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Category</th>
                  <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Stock</th>
                  <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-900 font-medium">{p.id.slice(0, 8)}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{p.name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.category}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{p.stock}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">Rs. {p.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminReports;
