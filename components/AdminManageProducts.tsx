import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { type Product } from '../types';
import { getProducts, addProduct, updateProduct, deleteProduct, uploadProductImage, generateBarcode } from '../services/supabaseClient';
import { UploadIcon } from './IconComponents';
import { printBarcodeLabel } from './BarcodeLabel';

// Helper to parse multiple images
export const getAllImages = (imageUrlString: string): string[] => {
  if (!imageUrlString) return [];
  if (imageUrlString.startsWith('[') && imageUrlString.endsWith(']')) {
    try {
      const arr = JSON.parse(imageUrlString);
      if (Array.isArray(arr)) {
        return arr;
      }
    } catch (e) {
      // fallback
    }
  }
  return [imageUrlString];
};

export const getPrimaryImage = (imageUrlString: string): string => {
  const images = getAllImages(imageUrlString);
  return images[0] || '';
};

// Canvas-based image compression
const compressImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const AdminManageProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '', description: '', price: 0, imageUrl: '', category: '', stock: 10
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [stockAddition, setStockAddition] = useState<number>(0);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length <= 1) return;
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const newProducts = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const product: any = {};
          headers.forEach((header, index) => {
            if (header === 'price' || header === 'stock') {
              product[header] = Number(values[index]) || 0;
            } else if (header === 'imageurl') {
              product['imageUrl'] = values[index];
            } else {
              product[header] = values[index];
            }
          });
          newProducts.push(product);
        }
        
        let successCount = 0;
        for (const prod of newProducts) {
          if (prod.name && prod.price) {
            await addProduct(prod as Omit<Product, 'id'>);
            successCount++;
          }
        }
        alert(`Successfully imported ${successCount} products from CSV!`);
        fetchProducts();
      } catch (err) {
        alert('Failed to parse CSV file. Please check the format.');
        console.error(err);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    const data = await getProducts();
    setProducts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setCurrentProduct({ name: '', description: '', price: 0, imageUrl: '', category: '', stock: 10 });
    setUploadedImages([]);
    setUrlInput('');
    setIsEditing(false);
    setUploadError('');
    setStockAddition(0);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setUploadedImages(getAllImages(product.imageUrl));
    setUrlInput('');
    setIsEditing(true);
    setUploadError('');
    setStockAddition(0);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      
      if (uploadedImages.length + files.length > 5) {
        setUploadError('You can upload a maximum of 5 product photos.');
        return;
      }

      setIsCompressing(true);
      try {
        const compressedUrls: string[] = [];
        for (const file of files) {
          const dataUrl = await compressImage(file);
          compressedUrls.push(dataUrl);
        }
        setUploadedImages(prev => [...prev, ...compressedUrls]);
      } catch (err) {
        setUploadError('Failed to compress and load image files.');
        console.error(err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleAddUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    if (uploadedImages.length >= 5) {
      setUploadError('You can upload a maximum of 5 product photos.');
      return;
    }
    setUploadedImages(prev => [...prev, urlInput]);
    setUrlInput('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.name || !currentProduct.price || uploadedImages.length === 0) {
      alert("Please fill out all required fields and add at least one product photo.");
      return;
    }

    setIsSaving(true);
    try {
      // Upload all base64 images to Supabase storage products_uploads bucket
      const uploadedUrls = await Promise.all(
        uploadedImages.map((img, index) =>
          uploadProductImage(img, `product-${currentProduct.name}-${index}.jpg`)
        )
      );

      const finalStock = (currentProduct.stock || 0) + stockAddition;
      const finalProduct = {
        ...currentProduct,
        stock: finalStock,
        imageUrl: JSON.stringify(uploadedUrls)
      };

      if (isEditing && finalProduct.id) {
        await updateProduct(finalProduct.id, finalProduct);
      } else {
        await addProduct(finalProduct as Omit<Product, 'id'>);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert("Failed to upload photos and save product details.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = 
      selectedCategory === 'ALL' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Console Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-4xl font-serif text-slate-900 uppercase tracking-tight">Products & Inventory</h2>
          <p className="text-sm font-light text-slate-600 mt-2">
            Manage shop items, monitor real-time stock levels, and update product catalogue details.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleCSVUpload} 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-extrabold uppercase tracking-wider transition-all rounded-lg shadow-sm font-sans flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            Import CSV
          </button>
          <button
            onClick={openAddModal}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase tracking-wider transition-all rounded-lg shadow-md font-sans flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add New Product
          </button>
        </div>
      </div>

      {/* INVENTORY FILTERS & UTILITY CONSOLE */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col md:flex-row gap-6 justify-between items-center font-sans">
        
        {/* Search Bar */}
        <div className="w-full md:flex-1 relative">
          <input
            type="text"
            placeholder="Search products by name or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-slate-400 focus:ring-0 px-5 py-3 text-sm font-medium rounded-xl placeholder-slate-400 font-sans"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-80 flex items-center gap-4">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-sans">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 bg-white border border-slate-200 focus:border-slate-400 focus:ring-0 py-3 px-4 text-sm font-bold rounded-xl cursor-pointer text-slate-700 font-sans"
          >
            <option value="ALL">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

      </div>

      {isLoading ? (
        <div className="text-sm font-bold text-slate-400 animate-pulse py-12 text-center uppercase tracking-widest">Loading catalogue...</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white font-sans">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Image</th>
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Product Details</th>
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Price</th>
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Category</th>
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Stock</th>
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <img src={getPrimaryImage(product.imageUrl)} alt="" className="h-12 w-12 object-cover rounded-lg border border-slate-200" />
                  </td>
                  <td className="py-4 px-6">
                    <span className="block text-sm font-bold text-slate-900">{product.name}</span>
                    <span className="block text-xs text-slate-500 truncate max-w-xs mt-1 font-light">{product.description}</span>
                    {product.barcode && <span className="text-[9px] text-slate-300 font-mono mt-1 block tracking-wider">{product.barcode}</span>}
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-slate-950 font-mono">
                    Rs. {product.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 font-semibold">
                    {product.category || 'Unassigned'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border ${
                        product.stock > 5 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                      }`}>
                        {product.stock} units
                      </span>
                      {product.stock <= 5 && (
                        <span className="text-xs font-bold uppercase text-red-600 tracking-wider">Low Stock!</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex gap-2.5 justify-end">
                      <button
                        onClick={() => printBarcodeLabel(product)}
                        title="Print barcode label"
                        className="py-2 px-3 border border-slate-200 text-xs font-extrabold uppercase tracking-wider hover:bg-slate-100 transition-all bg-white rounded-lg text-slate-600 flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                        Label
                      </button>
                      <button
                        onClick={() => openEditModal(product)}
                        className="py-2 px-4 border border-slate-200 text-xs font-extrabold uppercase tracking-wider hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all bg-white rounded-lg text-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="py-2 px-4 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all border border-red-150"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-xs uppercase tracking-widest text-center text-slate-400 font-extrabold bg-slate-50/10">
                    No products found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-8 w-full max-w-xl font-sans animate-fade-in space-y-6">
            <h3 className="text-2xl font-serif text-slate-950 uppercase tracking-tight border-b border-slate-200 pb-4">
              {isEditing ? 'Edit Catalogue Item' : 'Add New Catalogue Item'}
            </h3>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Product Name</label>
                  <input
                    type="text"
                    value={currentProduct.name}
                    onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                    className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm font-medium rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Price (Rs)</label>
                  <input
                    type="number"
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                    className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm font-medium rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Category</label>
                  <input
                    type="text"
                    value={currentProduct.category || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                    className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm font-medium rounded-xl"
                    placeholder="e.g. Couture Modeste"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Stock Level</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={currentProduct.stock || 0}
                      onChange={(e) => setCurrentProduct({...currentProduct, stock: parseInt(e.target.value) || 0})}
                      className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm font-medium rounded-xl"
                      min="0"
                      required
                    />
                    {isEditing && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-xs text-slate-450 font-extrabold font-sans">+</span>
                        <input
                          type="number"
                          placeholder="New stocks"
                          value={stockAddition || ''}
                          onChange={(e) => setStockAddition(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-24 border border-slate-200 focus:border-slate-400 focus:ring-0 px-3 py-3 text-sm font-medium rounded-xl placeholder-slate-350"
                          min="0"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Product Photos (Max 5, Auto-Compressed)
                  </label>
                  <span className="text-[10px] font-bold text-slate-500 font-mono">
                    {uploadedImages.length}/5 Selected
                  </span>
                </div>
                
                <div className="grid grid-cols-5 gap-3 mb-4">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center group shadow-sm">
                      <img src={img} alt={`Product ${idx+1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                        title="Delete photo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {Array.from({ length: 5 - uploadedImages.length }).map((_, i) => (
                    <div key={i} className="border border-dashed border-slate-200 rounded-xl aspect-square flex items-center justify-center text-slate-300 bg-slate-50/50">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.007 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 items-center">
                  {uploadedImages.length < 5 ? (
                    <div className="flex-1 relative border border-dashed border-slate-300 hover:border-slate-400 transition-colors rounded-xl p-3 text-center cursor-pointer bg-white">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isCompressing}
                      />
                      <div className="flex items-center justify-center gap-2 text-slate-600">
                        <UploadIcon className="h-5 w-5 text-slate-400" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {isCompressing ? 'Compressing...' : 'Upload Photos'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 border border-slate-100 rounded-xl p-3 text-center bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      Max Photos Added
                    </div>
                  )}

                  <span className="text-xs text-slate-400 uppercase tracking-wider">Or</span>

                  <div className="flex-[2] flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste Image URL..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-2.5 text-xs font-medium rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wide rounded-xl transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {uploadError && (
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wide mt-2">{uploadError}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
                <textarea
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                  rows={3}
                  className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-3 text-sm font-medium rounded-xl resize-none font-sans"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-slate-950 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSaving}
                >
                  {isSaving ? 'Uploading & Saving...' : isEditing ? 'Save Changes' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 bg-transparent border border-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminManageProducts;
