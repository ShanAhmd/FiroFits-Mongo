import React, { useState } from 'react';
import { type CartItem, type View, type Coupon, GarmentType, Unit } from '../types';
import { createOrder, validateCoupon } from '../services/supabaseClient';

interface CartPageProps {
  cartItems: CartItem[];
  onRemoveItem: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, qDelta: number) => void;
  userId: string;
  customerName: string;
  navigateTo: (view: View) => void;
  onClearCart: () => void;
}

const getAllImages = (imageUrlString: string): string[] => {
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

const getPrimaryImage = (imageUrlString: string): string => {
  const images = getAllImages(imageUrlString);
  return images[0] || '';
};

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
    fullName: customerName || '',
    address: '',
    cityPostal: '',
    district: '',
    mobile: '',
    altMobile: '',
    email: '',
    paymentMethod: 'COD' as 'COD' | 'Online Transfer',
    deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 20000 || subtotal === 0 ? 0 : 550;
  const couponDiscount = appliedCoupon
    ? appliedCoupon.discountPercent
      ? Math.round(subtotal * appliedCoupon.discountPercent / 100)
      : (appliedCoupon.discountFlat || 0)
    : 0;
  const total = Math.max(0, subtotal + shippingFee - couponDiscount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    const coupon = await validateCoupon(couponCode, subtotal);
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponError('');
    } else {
      setAppliedCoupon(null);
      setCouponError('Invalid, expired, or minimum order not met.');
    }
    setCouponLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (
      !deliveryDetails.fullName ||
      !deliveryDetails.address ||
      !deliveryDetails.cityPostal ||
      !deliveryDetails.district ||
      !deliveryDetails.mobile ||
      !deliveryDetails.email
    ) {
      alert('Please fill out all required logistics fields.');
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
        customerName: deliveryDetails.fullName,
        garmentType: GarmentType.READY_TO_WEAR,
        price: total,
        items: orderItems,
        orderData: {
          service: GarmentType.READY_TO_WEAR,
          designFiles: [],
          specialInstructions: `Boutique Ready-to-Wear online purchase. Total objects: ${cartItems.reduce((a, c) => a + c.quantity, 0)}${appliedCoupon ? `. Coupon: ${appliedCoupon.code} (-Rs.${couponDiscount})` : ''}`,
          measurements: { shoulder: '', chest: '', waist: '', hip: '', fullLength: '', vestLength: '', sleeveLength: '', armhole: '', collarSize: '' },
          unit: Unit.INCHES,
          hasPearlWork: false,
          deliveryDetails: deliveryDetails as any,
          customItems: [],
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
                      src={getPrimaryImage(item.product.imageUrl)}
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
                {/* 1. Delivery Information */}
                <div className="space-y-4">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-black border-b border-black/10 pb-1">
                    1. Delivery Information
                  </h4>
                  <div>
                    <label className="block text-[8px] uppercase tracking-[0.2em] font-bold text-brand-dark-gray mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={deliveryDetails.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-2 text-xs font-bold uppercase tracking-wider rounded-none font-sans"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-[0.2em] font-bold text-brand-dark-gray mb-1">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={deliveryDetails.address}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-2 text-xs font-bold uppercase tracking-wider rounded-none font-sans resize-none"
                      placeholder="HOUSE NO, STREET, AREA"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8px] uppercase tracking-[0.2em] font-bold text-brand-dark-gray mb-1">
                        City & Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cityPostal"
                        value={deliveryDetails.cityPostal}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-2 text-xs font-bold uppercase tracking-wider rounded-none font-sans"
                        placeholder="e.g. Jaffna 40000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase tracking-[0.2em] font-bold text-brand-dark-gray mb-1">
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="district"
                        value={deliveryDetails.district}
                        onChange={handleInputChange}
                        className="w-full bg-white border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-2 text-xs font-bold uppercase tracking-wider rounded-none font-sans"
                        required
                      >
                        <option value="" disabled>Select District</option>
                        <option value="Ampara">Ampara</option>
                        <option value="Anuradhapura">Anuradhapura</option>
                        <option value="Badulla">Badulla</option>
                        <option value="Batticaloa">Batticaloa</option>
                        <option value="Colombo">Colombo</option>
                        <option value="Galle">Galle</option>
                        <option value="Gampaha">Gampaha</option>
                        <option value="Hambantota">Hambantota</option>
                        <option value="Jaffna">Jaffna</option>
                        <option value="Kalutara">Kalutara</option>
                        <option value="Kandy">Kandy</option>
                        <option value="Kegalle">Kegalle</option>
                        <option value="Kilinochchi">Kilinochchi</option>
                        <option value="Kurunegala">Kurunegala</option>
                        <option value="Mannar">Mannar</option>
                        <option value="Matale">Matale</option>
                        <option value="Matara">Matara</option>
                        <option value="Moneragala">Moneragala</option>
                        <option value="Mullaitivu">Mullaitivu</option>
                        <option value="Nuwara Eliya">Nuwara Eliya</option>
                        <option value="Polonnaruwa">Polonnaruwa</option>
                        <option value="Puttalam">Puttalam</option>
                        <option value="Ratnapura">Ratnapura</option>
                        <option value="Trincomalee">Trincomalee</option>
                        <option value="Vavuniya">Vavuniya</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Contact Details */}
                <div className="space-y-4 pt-4 border-t border-black/10">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-black border-b border-black/10 pb-1">
                    2. Contact Details
                  </h4>
                  <div>
                    <label className="block text-[8px] uppercase tracking-[0.2em] font-bold text-brand-dark-gray mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={deliveryDetails.mobile}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-2 text-xs font-bold uppercase tracking-wider rounded-none font-sans"
                      placeholder="e.g. 0771234567"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-[0.2em] font-bold text-brand-dark-gray mb-1">
                      Alternative Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="altMobile"
                      value={deliveryDetails.altMobile}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-2 text-xs font-bold uppercase tracking-wider rounded-none font-sans"
                      placeholder="e.g. 0717654321"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-[0.2em] font-bold text-brand-dark-gray mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={deliveryDetails.email}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-2 text-xs font-bold uppercase tracking-wider rounded-none font-sans"
                      placeholder="e.g. customer@example.com"
                      required
                    />
                  </div>
                </div>

                {/* 3. Order & Payment Details */}
                <div className="space-y-4 pt-4 border-t border-black/10">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-black border-b border-black/10 pb-1">
                    3. Payment Method
                  </h4>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-sans text-[10px] uppercase tracking-wider text-black font-bold">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={deliveryDetails.paymentMethod === 'COD'}
                        onChange={handleInputChange}
                        className="h-3.5 w-3.5 border-black text-black focus:ring-black"
                      />
                      COD
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-sans text-[10px] uppercase tracking-wider text-black font-bold">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online Transfer"
                        checked={deliveryDetails.paymentMethod === 'Online Transfer'}
                        onChange={handleInputChange}
                        className="h-3.5 w-3.5 border-black text-black focus:ring-black"
                      />
                      Online Transfer
                    </label>
                  </div>
                  {deliveryDetails.paymentMethod === 'COD' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium">
                      💵 <strong>Cash on Delivery:</strong> Please keep the exact amount ready. A COD receipt will be generated with your order for the courier.
                    </div>
                  )}
                </div>

                {/* 4. Coupon Code */}
                <div className="space-y-3 pt-4 border-t border-black/10">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-black border-b border-black/10 pb-1">4. Coupon Code (Optional)</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE"
                      className="flex-1 border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-widest rounded-xl"
                    />
                    <button type="button" onClick={handleApplyCoupon} disabled={couponLoading}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50">
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-600 font-bold">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                      <div>
                        <p className="text-xs font-black text-emerald-700 font-mono">{appliedCoupon.code}</p>
                        <p className="text-[10px] text-emerald-600">{appliedCoupon.description || 'Discount applied!'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-emerald-700">-Rs. {couponDiscount.toLocaleString()}</p>
                        <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-[10px] text-emerald-500 hover:text-red-600 transition-colors">Remove</button>
                      </div>
                    </div>
                  )}
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
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>- Rs. {couponDiscount.toLocaleString()}</span>
                  </div>
                )}
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
