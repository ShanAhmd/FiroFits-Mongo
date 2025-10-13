import React, { useState, useEffect } from 'react';
import { type Product } from '../types';
import { getProducts } from '../services/demoDatabase';
import { SearchIcon } from './IconComponents';

interface CustomProductsPageProps {
  onOrderProduct: (product: Product) => void;
}

const CustomProductsPage: React.FC<CustomProductsPageProps> = ({ onOrderProduct }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setProducts(getProducts());
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-brand-charcoal">Our Products</h1>
                <p className="text-lg text-brand-dark-gray mt-2">Explore some of our popular custom-made designs for inspiration.</p>
            </div>

            <div className="mb-8 max-w-lg mx-auto">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-brand-dark-gray" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for designs (e.g., 'Saree Blouse', 'Linen Dress')..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-brand-light-gray rounded-full shadow-sm focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-colors"
                    />
                </div>
            </div>
            
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="overflow-hidden">
                                 <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-xl font-bold text-brand-charcoal">{product.name}</h2>
                                <p className="text-brand-dark-gray mt-2 flex-grow text-sm">{product.description}</p>
                                <p className="mt-4 text-2xl font-bold text-brand-teal">Rs. {product.price.toFixed(2)}</p>
                                <button
                                    onClick={() => onOrderProduct(product)}
                                    className="mt-4 w-full bg-brand-charcoal text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-80 transition-colors"
                                >
                                    Order This Style
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16">
                    <h3 className="text-xl font-bold text-brand-charcoal">No Products Found</h3>
                    <p className="text-brand-dark-gray mt-2">Your search for "{searchTerm}" did not match any products.</p>
                </div>
            )}
        </div>
    );
};

export default CustomProductsPage;