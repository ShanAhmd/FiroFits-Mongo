import React, { useState, useEffect } from 'react';
import { type Package, type PackageItem, type Product, PackageType } from '../types';
import { getPackages, createPackage, updatePackage, deletePackage, getProducts, uploadProductImage } from '../services/supabaseClient';

const PKG_TYPES = Object.values(PackageType);

const daysUntil = (dateStr: string) => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const getStatusBadge = (pkg: Package) => {
  const today = new Date().toISOString().split('T')[0];
  if (!pkg.isActive) return { label: 'Inactive', cls: 'bg-slate-100 text-slate-500' };
  if (pkg.validTo < today) return { label: 'Expired', cls: 'bg-red-100 text-red-600' };
  if (pkg.validFrom > today) return { label: 'Upcoming', cls: 'bg-blue-100 text-blue-700' };
  const days = daysUntil(pkg.validTo);
  return { label: `Active · ${days}d left`, cls: 'bg-emerald-100 text-emerald-700' };
};

const EMPTY_PKG = (): Omit<Package, 'id' | 'createdAt'> => ({
  name: '', slug: '', type: PackageType.OFFER, tag: '', description: '',
  bannerImageUrl: '', badgeLabel: '', items: [],
  discountPercent: 10, discountFlat: undefined,
  validFrom: new Date().toISOString().split('T')[0],
  validTo: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  isActive: true,
});

const AdminManagePackages: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Package, 'id' | 'createdAt'>>(EMPTY_PKG());
  const [isSaving, setIsSaving] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  const fetchAll = async () => {
    setIsLoading(true);
    const [pkgs, prods] = await Promise.all([getPackages(), getProducts()]);
    setPackages(pkgs);
    setProducts(prods);
    setIsLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setForm(EMPTY_PKG());
    setIsEditing(false);
    setEditId(null);
    setIsModalOpen(true);
  };

  const openEdit = (pkg: Package) => {
    setForm({
      name: pkg.name, slug: pkg.slug, type: pkg.type, tag: pkg.tag,
      description: pkg.description, bannerImageUrl: pkg.bannerImageUrl,
      badgeLabel: pkg.badgeLabel || '', items: pkg.items,
      discountPercent: pkg.discountPercent, discountFlat: pkg.discountFlat,
      validFrom: pkg.validFrom, validTo: pkg.validTo, isActive: pkg.isActive,
    });
    setIsEditing(true);
    setEditId(pkg.id);
    setIsModalOpen(true);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (ev) => {
        const b64 = ev.target?.result as string;
        const url = await uploadProductImage(b64, `pkg-banner-${Date.now()}.jpg`);
        setForm(f => ({ ...f, bannerImageUrl: url }));
        setBannerUploading(false);
      };
    } catch { setBannerUploading(false); }
  };

  const toggleProduct = (prod: Product) => {
    const existing = form.items.find(i => i.productId === prod.id);
    if (existing) {
      setForm(f => ({ ...f, items: f.items.filter(i => i.productId !== prod.id) }));
    } else {
      const item: PackageItem = { productId: prod.id, productName: prod.name, qty: 1 };
      setForm(f => ({ ...f, items: [...f.items, item] }));
    }
  };

  const setItemQty = (productId: string, qty: number) => {
    setForm(f => ({ ...f, items: f.items.map(i => i.productId === productId ? { ...i, qty } : i) }));
  };

  const handleSave = async () => {
    if (!form.name || !form.tag || !form.validFrom || !form.validTo) {
      alert('Please fill in Name, Tag, and Date Range.'); return;
    }
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setIsSaving(true);
    try {
      if (isEditing && editId) {
        await updatePackage(editId, { ...form, slug });
      } else {
        await createPackage({ ...form, slug });
      }
      setIsModalOpen(false);
      fetchAll();
    } catch { alert('Failed to save package.'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this package permanently?')) return;
    await deletePackage(id);
    fetchAll();
  };

  const filteredProds = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-4xl font-serif text-slate-900 uppercase tracking-tight">Package Manager</h2>
          <p className="text-sm font-light text-slate-600 mt-2">Create seasonal, festival, and offer bundles. Active packages appear on the home page and shop.</p>
        </div>
        <button onClick={openCreate} className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-2 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          New Package
        </button>
      </div>

      {isLoading ? (
        <div className="text-sm font-bold text-slate-400 animate-pulse py-12 text-center uppercase tracking-widest">Loading packages...</div>
      ) : packages.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
          <div className="text-5xl mb-4">🎁</div>
          <p className="text-slate-500 font-semibold">No packages yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first seasonal or festival deal</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {packages.map(pkg => {
            const badge = getStatusBadge(pkg);
            return (
              <div key={pkg.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="relative h-36 bg-gradient-to-br from-slate-900 to-slate-700 overflow-hidden">
                  {pkg.bannerImageUrl ? (
                    <img src={pkg.bannerImageUrl} alt={pkg.name} className="w-full h-full object-cover opacity-70" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">🎁</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-white font-black text-lg uppercase tracking-tight leading-tight">{pkg.name}</p>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{pkg.tag}</p>
                  </div>
                  {pkg.badgeLabel && (
                    <div className="absolute top-3 right-3 bg-rose-500 text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">{pkg.badgeLabel}</div>
                  )}
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${badge.cls}`}>{badge.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{pkg.type}</span>
                  </div>
                  <div className="flex gap-2 text-xs text-slate-600">
                    {pkg.discountPercent && <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-bold">{pkg.discountPercent}% OFF</span>}
                    {pkg.discountFlat && <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-bold">Rs.{pkg.discountFlat} OFF</span>}
                    <span className="text-slate-400">{pkg.items.length} products</span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">{pkg.validFrom} → {pkg.validTo}</p>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => openEdit(pkg)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wide rounded-lg transition-all">Edit</button>
                    <button onClick={() => handleDelete(pkg.id)} className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wide rounded-lg transition-all">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Package Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col">
            <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
              <h3 className="text-xl font-serif font-bold text-slate-900 uppercase">{isEditing ? 'Edit Package' : 'New Package'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-8 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Package Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Summer Splash Collection" className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm rounded-xl"/>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Tag / Campaign Label *</label>
                  <input value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder="e.g. SUMMER 2026, EID SPECIAL" className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm rounded-xl"/>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Package Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as PackageType }))} className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm rounded-xl">
                    {PKG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Badge Label (optional)</label>
                  <input value={form.badgeLabel || ''} onChange={e => setForm(f => ({ ...f, badgeLabel: e.target.value }))} placeholder="e.g. HOT DEAL, LIMITED TIME" className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm rounded-xl"/>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Describe this package deal..." className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm rounded-xl resize-none"/>
              </div>

              {/* Discount */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Discount % (e.g. 15 for 15%)</label>
                  <input type="number" min="0" max="100" value={form.discountPercent || ''} onChange={e => setForm(f => ({ ...f, discountPercent: Number(e.target.value) || undefined }))} placeholder="0" className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm rounded-xl"/>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Flat Discount Rs. (optional)</label>
                  <input type="number" min="0" value={form.discountFlat || ''} onChange={e => setForm(f => ({ ...f, discountFlat: Number(e.target.value) || undefined }))} placeholder="0" className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm rounded-xl"/>
                </div>
              </div>

              {/* Dates + Active */}
              <div className="grid grid-cols-3 gap-5">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Valid From *</label>
                  <input type="date" value={form.validFrom} onChange={e => setForm(f => ({ ...f, validFrom: e.target.value }))} className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm rounded-xl"/>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Valid Until *</label>
                  <input type="date" value={form.validTo} onChange={e => setForm(f => ({ ...f, validTo: e.target.value }))} className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm rounded-xl"/>
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-5 h-5 accent-emerald-600"/>
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-700">Active</span>
                  </label>
                </div>
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Banner Image</label>
                <div className="flex gap-4 items-start">
                  {form.bannerImageUrl && <img src={form.bannerImageUrl} alt="banner" className="h-20 w-36 object-cover rounded-xl border border-slate-200"/>}
                  <div className="flex-1 border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl p-4 text-center cursor-pointer relative transition-colors">
                    <input type="file" accept="image/*" onChange={handleBannerUpload} className="absolute inset-0 opacity-0 cursor-pointer"/>
                    <p className="text-xs text-slate-500 font-medium">{bannerUploading ? '⏳ Uploading...' : 'Click to upload banner image'}</p>
                  </div>
                </div>
              </div>

              {/* Product Picker */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Add Products to Package ({form.items.length} selected)</label>
                <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search products..." className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-2.5 text-sm rounded-xl mb-3"/>
                <div className="max-h-52 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50">
                  {filteredProds.map(prod => {
                    const inPkg = form.items.find(i => i.productId === prod.id);
                    return (
                      <div key={prod.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                        <input type="checkbox" checked={!!inPkg} onChange={() => toggleProduct(prod)} className="w-4 h-4 accent-emerald-600"/>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{prod.name}</p>
                          <p className="text-xs text-slate-400">Rs. {prod.price.toLocaleString()} · Stock: {prod.stock ?? '∞'}</p>
                        </div>
                        {inPkg && (
                          <input type="number" min="1" value={inPkg.qty} onChange={e => setItemQty(prod.id, Number(e.target.value))}
                            className="w-16 border border-slate-200 rounded-lg px-2 py-1 text-xs text-center" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide rounded-xl hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleSave} disabled={isSaving} className="px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wide rounded-xl transition-all disabled:opacity-50">
                {isSaving ? 'Saving...' : isEditing ? 'Update Package' : 'Create Package'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagePackages;
