// FIX: Replaced placeholder content with a full component implementation.
import React, { useState, useEffect } from 'react';
import { type Product } from '../types';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/demoDatabase';
import { TrashIcon, EditIcon } from './IconComponents';

const AdminManageProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const refreshProducts = () => setProducts(getProducts());

    useEffect(() => {
        refreshProducts();
    }, []);

    const handleDelete = (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(productId);
            refreshProducts();
        }
    };

    const openModal = (product: Product | null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSave = (productData: Omit<Product, 'id'> | Product) => {
        if ('id' in productData) {
            updateProduct(productData.id, productData);
        } else {
            addProduct(productData);
        }
        refreshProducts();
        closeModal();
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-charcoal">Manage Products</h1>
                <button
                    onClick={() => openModal(null)}
                    className="px-5 py-2.5 bg-brand-teal text-white rounded-xl font-semibold hover:opacity-90 transition-colors shadow-lg"
                >
                    Add New Product
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-16 w-16">
                                            <img className="h-16 w-16 rounded-md object-cover" src={product.imageUrl} alt={product.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500 w-96 truncate">{product.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">Rs. {product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button onClick={() => openModal(product)} className="text-brand-teal hover:text-teal-700"><EditIcon className="h-5 w-5"/></button>
                                    <button onClick={() => handleDelete(product.id)} className="text-brand-error hover:text-red-700"><TrashIcon className="h-5 w-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <ProductModal product={editingProduct} onSave={handleSave} onClose={closeModal} />}
        </div>
    );
};

// MODAL COMPONENT (kept in the same file for simplicity)
interface ProductModalProps {
    product: Product | null;
    onSave: (productData: Omit<Product, 'id'> | Product) => void;
    onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || 0,
        imageUrl: product?.imageUrl || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(product ? { ...product, ...formData } : formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg animate-fade-in-down">
                <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-semibold text-brand-charcoal">Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-brand-light-gray rounded-xl" required />
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-brand-charcoal">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full shadow-sm sm:text-sm border-brand-light-gray rounded-xl" required />
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-brand-charcoal">Price (Rs.)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-brand-light-gray rounded-xl" required />
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-brand-charcoal">Image URL</label>
                        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-brand-light-gray rounded-xl" required />
                    </div>
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-200 text-brand-charcoal rounded-xl font-semibold hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-5 py-2.5 bg-brand-teal text-white rounded-xl font-semibold hover:opacity-90">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminManageProducts;
