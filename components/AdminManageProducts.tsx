import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { type Product } from '../types';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/supabaseClient';
import { UploadIcon } from './IconComponents';

const AdminManageProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '', description: '', price: 0, imageUrl: '', category: ''
  });
  const [isEditing, setIsEditing] = useState(false);

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
    setCurrentProduct({ name: '', description: '', price: 0, imageUrl: '', category: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.name || !currentProduct.price || !currentProduct.imageUrl) {
      alert("Please fill out all required fields.");
      return;
    }
    
    if (isEditing && currentProduct.id) {
      await updateProduct(currentProduct.id, currentProduct);
    } else {
      await addProduct(currentProduct as Omit<Product, 'id'>);
    }
    setIsModalOpen(false);
    fetchProducts();
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
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Console Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Products</h2>
          <p className="text-xs font-normal text-slate-500 mt-1 font-sans">
            Manage shop items, view stock levels, and update product prices.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold tracking-normal transition-all rounded-lg shadow-sm font-sans"
        >
          Add New Product
        </button>
      </div>

      {/* INVENTORY FILTERS & UTILITY CONSOLE */}
      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center font-sans">
        
        {/* Search Bar */}
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search products by name or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 px-4 py-2 text-xs font-medium rounded-lg placeholder-slate-300 font-sans"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-64 flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400 font-sans">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3 text-xs font-semibold rounded-lg cursor-pointer text-slate-700 font-sans"
          >
            <option value="ALL">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

      </div>

      {isLoading ? (
        <div className="text-xs font-medium text-slate-400 animate-pulse py-8">Loading products...</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm bg-white font-sans">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="py-4 px-5 text-xs font-semibold text-slate-400">Image</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400">Product Details</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400">Price</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400">Category</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400">Stock</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-3 px-5">
                    <img src={product.imageUrl} alt="" className="h-10 w-10 object-cover rounded-lg border border-slate-100 grayscale-[10%]" />
                  </td>
                  <td className="py-3 px-5">
                    <span className="block text-xs font-bold text-slate-900">{product.name}</span>
                    <span className="block text-[10px] text-slate-400 truncate max-w-xs mt-0.5">{product.description}</span>
                  </td>
                  <td className="py-3 px-5 text-xs font-bold text-slate-900">
                    Rs. {product.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-5 text-xs text-slate-500 font-medium">
                    {product.category || 'Unassigned'}
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${
                        product.stock > 5 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                      }`}>
                        {product.stock} units
                      </span>
                      {product.stock <= 5 && (
                        <span className="text-[10px] font-semibold text-red-600">Low Stock!</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEditModal(product)}
                        className="py-1.5 px-3 border border-slate-200 text-xs font-semibold hover:bg-slate-900 hover:text-white transition-all bg-white rounded-lg text-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="py-1.5 px-3 text-red-600 bg-red-50 hover:bg-red-100 text-xs font-semibold rounded-lg transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-xs text-center text-slate-400 font-medium bg-slate-50/20">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl p-8 w-full max-w-lg font-sans animate-fade-in">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-6 border-b border-slate-100 pb-3">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={currentProduct.name}
                    onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                    className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 px-3 py-2 text-xs font-medium rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Price (Rs)</label>
                  <input
                    type="number"
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                    className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 px-3 py-2 text-xs font-medium rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                <input
                  type="text"
                  value={currentProduct.category}
                  onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                  className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 px-3 py-2 text-xs font-medium rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Image URL</label>
                <input
                  type="url"
                  value={currentProduct.imageUrl}
                  onChange={(e) => setCurrentProduct({...currentProduct, imageUrl: e.target.value})}
                  className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 px-3 py-2 text-xs font-medium rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                <textarea
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                  rows={3}
                  className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 px-3 py-2 text-xs font-medium rounded-lg resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-all"
                >
                  {isEditing ? 'Save Changes' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-transparent border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-all"
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
