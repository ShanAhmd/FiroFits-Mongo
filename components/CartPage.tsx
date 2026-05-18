import React, { useState } from 'react';
import { type CartItem, type View, GarmentType, Unit } from '../types';
import { createOrder } from '../services/supabaseClient';

interface CartPageProps {
  cartItems: CartItem[];
  onRemoveItem: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, qDelta: number) => void;
  userId: string;
  customerName: string;
  navigateTo: (view: View) => void;
  onClearCart: () => void;
}

const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  userId,
  customerName,
  navigateTo,
  onClearCart,
}) => {
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: customerName || '',
    contact: '',
    address: '',
    deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 20000 || subtotal === 0 ? 0 : 550;
  const total = subtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!deliveryDetails.name || !deliveryDetails.contact || !deliveryDetails.address) {
      alert('Missing logistics data.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        size: item.selectedSize,
        customMeasurements: item.customMeasurements,
      }));

      await createOrder({
        userId,
        customerName: deliveryDetails.name,
        garmentType: GarmentType.READY_TO_WEAR,
        price: total,
        items: orderItems,
        orderData: {
          service: GarmentType.READY_TO_WEAR,
          designFiles: [],
          specialInstructions: `Boutique Ready-to-Wear online purchase. Total objects: ${cartItems.reduce((a, c) => a + c.quantity, 0)}`,
          measurements: { shoulder: '', chest: '', waist: '', hip: '', fullLength: '', vestLength: '', sleeveLength: '', armhole: '', collarSize: '' },
          unit: Unit.INCHES,
          hasPearlWork: false,
          deliveryDetails: deliveryDetails,
        },
      });

      onClearCart();
      navigateTo('order-confirmation');
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout failed. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-16 pb-32 pt-20 max-w-[1400px] mx-auto px-4 md:px-8">
      {/* 2026 BRUTALIST HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-black pb-8 gap-8">
        <div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter uppercase leading-none">Your Cart.</h1>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-dark-gray mt-4 max-w-sm">
            Review your selected dresses and clothing items before placing your order.
          </p>
        </div>
        <div className="text-right hidden md:block">
           <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-black border border-black px-4 py-2">
             {cartItems.length} Items Selected
           </span>
        </div>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* CART ITEMS COLUMN */}
          <div className="lg:col-span-7 space-y-0 border-t border-black">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 py-8 border-b border-black/20 group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-24 h-32 overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-sans font-medium text-black tracking-wide uppercase">
                      {item.product.name}
                    </h3>
                    <p className="text-[9px] text-brand-dark-gray font-bold mt-2 uppercase tracking-[0.2em]">
                      Size: {item.selectedSize}
                    </p>
                    {item.customMeasurements && (
                      <span className="inline-block mt-2 px-2 py-1 bg-black text-white text-[8px] uppercase tracking-widest font-bold">
                        Custom Measurements Added
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-8 sm:gap-12">
                  {/* Brutalist Quantity Control */}
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="text-black hover:text-brand-dark-gray text-lg font-light transition-colors"
                    >
                      —
                    </button>
                    <span className="text-xs font-bold text-black w-4 text-center font-sans">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="text-black hover:text-brand-dark-gray text-lg font-light transition-colors"
                    >
                      ＋
                    </button>
                  </div>

                  <div className="text-right flex items-center gap-6">
                    <div className="font-serif font-bold text-black text-sm">
                      Rs. {(item.product.price * item.quantity).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-brand-dark-gray hover:text-red-600 transition-colors"
                      title="Remove Item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CHECKOUT COLUMN */}
          <div className="lg:col-span-5 bg-gray-50 p-8 border border-black/10">
            <form onSubmit={handleCheckout} className="space-y-8">
              <div>
                <h3 className="text-[10px] font-sans text-black font-bold uppercase tracking-[0.3em] border-b border-black/20 pb-4">
                  Delivery Details
                </h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[8px] uppercase tracking-[0.2em] font-bold text-brand-dark-gray mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={deliveryDetails.name}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-2 text-xs font-bold uppercase tracking-wider rounded-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-[0.2em] font-bold text-brand-dark-gray mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={deliveryDetails.contact}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-2 text-xs font-bold uppercase tracking-wider rounded-none"
                    placeholder="e.g. 0771234567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-[0.2em] font-bold text-brand-dark-gray mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    value={deliveryDetails.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-2 text-xs font-bold uppercase tracking-wider rounded-none"
                    placeholder="HOUSE, STREET, CITY"
                    required
                  />
                </div>
              </div>

              {/* Order total list */}
              <div className="pt-8 border-t border-black/20 space-y-4">
                <div className="flex justify-between text-[10px] text-brand-dark-gray font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-black">Rs. {subtotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[10px] text-brand-dark-gray font-bold uppercase tracking-widest">
                  <span>Delivery Fee</span>
                  <span className="text-black">{shippingFee === 0 ? 'COMPLIMENTARY' : `Rs. ${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="h-[1px] bg-black my-4"></div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-black">Total Amount</span>
                  <span className="text-2xl font-serif font-bold text-black">
                    Rs. {total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 mt-4 bg-black hover:bg-gray-900 text-white disabled:bg-gray-300 font-bold uppercase text-[10px] tracking-[0.3em] transition-all"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="py-32 text-center border border-black/10">
          <h2 className="text-3xl font-serif text-black uppercase tracking-tighter">Your Cart is Empty</h2>
          <p className="text-brand-dark-gray text-[10px] font-bold uppercase tracking-[0.2em] mt-4 mb-8">
            You have no items in your cart yet.
          </p>
          <button
            onClick={() => navigateTo('products')}
            className="px-8 py-4 bg-black text-white hover:bg-gray-900 font-bold text-[10px] uppercase tracking-[0.3em] transition-all"
          >
            Explore Shop
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
