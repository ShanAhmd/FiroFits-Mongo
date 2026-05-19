import React, { useState, useEffect } from 'react';
import { type Coupon } from '../types';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../services/supabaseClient';

const EMPTY_COUPON = (): Omit<Coupon, 'id' | 'usedCount'> => ({
  code: '', discountPercent: 10, discountFlat: undefined,
  minOrderValue: 0, maxUses: undefined,
  expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  isActive: true, description: '',
});

const AdminManageCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Coupon, 'id' | 'usedCount'>>(EMPTY_COUPON());
  const [isSaving, setIsSaving] = useState(false);

  const fetchAll = async () => {
    setIsLoading(true);
    setCoupons(await getCoupons());
    setIsLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setForm(EMPTY_COUPON());
    setIsEditing(false);
    setEditId(null);
    setIsModalOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setForm({
      code: c.code, discountPercent: c.discountPercent, discountFlat: c.discountFlat,
      minOrderValue: c.minOrderValue, maxUses: c.maxUses, expiresAt: c.expiresAt,
      isActive: c.isActive, description: c.description || '',
    });
    setIsEditing(true);
    setEditId(c.id);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.code) { alert('Coupon code is required.'); return; }
    if (!form.discountPercent && !form.discountFlat) { alert('Set a discount % or flat amount.'); return; }
    setIsSaving(true);
    try {
      if (isEditing && editId) {
        await updateCoupon(editId, form);
      } else {
        await createCoupon(form);
      }
      setIsModalOpen(false);
      fetchAll();
    } catch { alert('Failed to save coupon.'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    await deleteCoupon(id);
    fetchAll();
  };

  const handleToggle = async (c: Coupon) => {
    await updateCoupon(c.id, { isActive: !c.isActive });
    fetchAll();
  };

  const isExpired = (c: Coupon) => new Date(c.expiresAt) < new Date();

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-4xl font-serif text-slate-900 uppercase tracking-tight">Coupon Codes</h2>
          <p className="text-sm font-light text-slate-600 mt-2">Manage discount codes for customers to apply at checkout.</p>
        </div>
        <button onClick={openCreate} className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-2 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          New Coupon
        </button>
      </div>

      {isLoading ? (
        <div className="text-sm font-bold text-slate-400 animate-pulse py-12 text-center uppercase tracking-widest">Loading coupons...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Code</th>
                <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Discount</th>
                <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Min Order</th>
                <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Uses</th>
                <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Expires</th>
                <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Status</th>
                <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.length === 0 && (
                <tr><td colSpan={7} className="py-16 text-center text-xs text-slate-400 uppercase tracking-widest">No coupons yet</td></tr>
              )}
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-mono font-black text-slate-900 text-sm tracking-widest">{c.code}</td>
                  <td className="py-4 px-6 text-sm font-bold">
                    {c.discountPercent && <span className="text-emerald-700">{c.discountPercent}% off</span>}
                    {c.discountFlat && <span className="text-amber-700">Rs.{c.discountFlat} off</span>}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{c.minOrderValue ? `Rs.${c.minOrderValue.toLocaleString()}` : '—'}</td>
                  <td className="py-4 px-6 text-sm text-slate-600 font-mono">{c.usedCount || 0}{c.maxUses ? ` / ${c.maxUses}` : ''}</td>
                  <td className="py-4 px-6 text-sm font-mono text-slate-600">{c.expiresAt}</td>
                  <td className="py-4 px-6">
                    <button onClick={() => handleToggle(c)} className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full transition-all ${
                      isExpired(c) ? 'bg-slate-100 text-slate-400' :
                      c.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>{isExpired(c) ? 'Expired' : c.isActive ? 'Active' : 'Inactive'}</button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
              <h3 className="text-xl font-serif font-bold text-slate-900 uppercase">{isEditing ? 'Edit Coupon' : 'New Coupon'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Coupon Code *</label>
                <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. SUMMER25" className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm font-mono font-bold rounded-xl tracking-widest"/>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Description</label>
                <input value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Summer sale - 25% off all orders" className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm rounded-xl"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Discount %</label>
                  <input type="number" min="0" max="100" value={form.discountPercent || ''} onChange={e => setForm(f => ({ ...f, discountPercent: Number(e.target.value) || undefined }))} placeholder="e.g. 15" className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm rounded-xl"/>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Flat Discount Rs.</label>
                  <input type="number" min="0" value={form.discountFlat || ''} onChange={e => setForm(f => ({ ...f, discountFlat: Number(e.target.value) || undefined }))} placeholder="e.g. 500" className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm rounded-xl"/>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Min Order Rs.</label>
                  <input type="number" min="0" value={form.minOrderValue || ''} onChange={e => setForm(f => ({ ...f, minOrderValue: Number(e.target.value) || 0 }))} placeholder="0" className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm rounded-xl"/>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Max Uses (optional)</label>
                  <input type="number" min="1" value={form.maxUses || ''} onChange={e => setForm(f => ({ ...f, maxUses: Number(e.target.value) || undefined }))} placeholder="Unlimited" className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm rounded-xl"/>
                </div>
              </div>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Expires On *</label>
                  <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm rounded-xl"/>
                </div>
                <label className="flex items-center gap-3 cursor-pointer pb-3">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-5 h-5 accent-emerald-600"/>
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-700">Active</span>
                </label>
              </div>
            </div>
            <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide rounded-xl hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={isSaving} className="px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wide rounded-xl disabled:opacity-50">
                {isSaving ? 'Saving...' : isEditing ? 'Update' : 'Create Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageCoupons;
