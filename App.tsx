import React, { useState, useEffect } from 'react';
import {
  type View,
  type User,
  type OrderData,
  UserRole,
  Unit,
  GarmentType,
  type Product,
  type CartItem,
  type Measurements,
  type CustomTailoringItem,
} from './types';
import {
  authenticateUser,
  createUser,
  updateUser as updateDbUser,
} from './services/supabaseClient';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ServiceSelection from './components/ServiceSelection';
import DesignUpload from './components/DesignUpload';
import MeasurementsForm from './components/MeasurementsForm';
import Extras from './components/Extras';
import DeliveryDetails from './components/DeliveryDetails';
import Submission from './components/Submission';
import OrderConfirmation from './components/OrderConfirmation';
import StepIndicator from './components/StepIndicator';
import AgreementStep from './components/AgreementStep';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AboutPage from './components/AboutPage';
import CustomProductsPage from './components/CustomProductsPage';
import CartPage from './components/CartPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginPage from './components/AdminLoginPage';
import NotificationPanel from './components/NotificationPanel';
import Footer from './components/Footer';
import OrderTracking from './components/OrderTracking';

const INITIAL_ORDER_DATA: OrderData = {
  service: null,
  designFiles: [],
  specialInstructions: '',
  measurements: {
    shoulder: '',
    chest: '',
    waist: '',
    hip: '',
    fullLength: '',
    vestLength: '',
    sleeveLength: '',
    armhole: '',
    collarSize: '',
  },
  unit: Unit.INCHES,
  hasPearlWork: false,
  deliveryDetails: {
    fullName: '',
    address: '',
    cityPostal: '',
    district: '',
    mobile: '',
    altMobile: '',
    email: '',
    paymentMethod: 'COD',
    deliveryDate: '',
  },
  customGarmentName: '',
  customItems: [],
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [modalAlert, setModalAlert] = useState<{ message: string; title?: string } | null>(null);
  
  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Order form state
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>(INITIAL_ORDER_DATA);
  const [agreementAgreed, setAgreementAgreed] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    const draftStr = localStorage.getItem('firofits_draft_order');
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        if (draft.step && draft.orderData) {
          setHasDraft(true);
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (currentStep > 1) {
      // Exclude File objects which cannot be JSON serialized
      const safeData = { ...orderData, designFiles: [] };
      localStorage.setItem('firofits_draft_order', JSON.stringify({
        step: currentStep,
        orderData: safeData,
        agreementAgreed
      }));
    }
  }, [currentStep, orderData, agreementAgreed]);

  const resumeDraft = () => {
    const draftStr = localStorage.getItem('firofits_draft_order');
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        setOrderData({ ...draft.orderData, designFiles: [] });
        setCurrentStep(draft.step);
        setAgreementAgreed(draft.agreementAgreed || false);
        setCurrentView('order');
        setHasDraft(false);
      } catch (e) {}
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('firofits_draft_order');
    setHasDraft(false);
  };

  const totalSteps = 7;

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const navigateTo = (view: View) => {
    window.scrollTo(0, 0);
    if (view === 'order') {
      if (!hasDraft) {
        setOrderData(INITIAL_ORDER_DATA);
        setCurrentStep(1);
        setAgreementAgreed(false);
      }
    }
    setCurrentView(view);
  };
  
  // CART HANDLERS
  const handleAddToCart = (product: Product, size: string, customMeasurements?: Measurements) => {
    const itemId = `${product.id}-${size}-${customMeasurements ? 'bespoke' : 'standard'}`;
    setCartItems(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        setNotification(`Updated quantity of "${product.name}" in your cart!`);
        return prev.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      setNotification(`Added "${product.name}" (${size}) to your cart!`);
      return [...prev, { id: itemId, product, quantity: 1, selectedSize: size, customMeasurements }];
    });
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    setNotification('Removed piece from shopping cart.');
  };

  const handleUpdateCartQuantity = (cartItemId: string, qDelta: number) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.id === cartItemId ? { ...item, quantity: Math.max(1, item.quantity + qDelta) } : item
        )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleLogin = async (email: string, passwordHash: string, role: UserRole): Promise<User | null> => {
    const user = await authenticateUser(email, passwordHash, role);
    if (user) {
      setCurrentUser(user);
      setNotification(`Welcome back, ${user.name}!`);
      navigateTo(user.role === UserRole.ADMIN ? 'admin-dashboard' : 'dashboard');
    } else {
      setNotification('Invalid email or password credentials.');
    }
    return user;
  };

  const handleSignup = async (name: string, email: string, passwordHash: string, role: UserRole) => {
    const result = await createUser(name, email, passwordHash, role);
    if (result.success) {
      setNotification('Account created successfully! Please log in.');
      navigateTo('login');
    } else {
      setNotification(result.error || 'Registration failed.');
    }
    return result;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setNotification('Logged out successfully.');
    navigateTo('home');
  };
  
  const handleUpdateUser = async (updatedData: Partial<User>) => {
    if (currentUser) {
      const updatedUser = await updateDbUser(currentUser.id, updatedData);
      if (updatedUser) {
        setCurrentUser(updatedUser);
        setNotification('Profile updated successfully!');
      }
    }
  };
  
  const handleOrderProduct = (product: Product) => {
    setOrderData({
      ...INITIAL_ORDER_DATA,
      service: GarmentType.OTHER,
      specialInstructions: `Ordering bespoke stitching inspired by: "${product.name}".\n\nStyle Description: ${product.description}`,
    });
    setCurrentStep(2); // Skip service selection
    navigateTo('order');
  };

  const updateOrderData = (data: Partial<OrderData>) => {
    setOrderData(prev => ({ ...prev, ...data }));
  };

  const editGarment = (itemId: string) => {
    const targetItem = orderData.customItems.find(i => i.id === itemId);
    if (!targetItem) return;

    let updatedCustomItems = orderData.customItems.filter(i => i.id !== itemId);

    // If there is currently a garment in the form, save it as a draft so they do not lose it
    if (orderData.service) {
      const currentAsDraft: CustomTailoringItem = {
        id: Math.random().toString(36).substring(2, 9),
        service: orderData.service,
        customGarmentName: orderData.customGarmentName,
        designFiles: orderData.designFiles,
        specialInstructions: orderData.specialInstructions,
        measurements: { ...orderData.measurements },
        unit: orderData.unit,
        hasPearlWork: orderData.hasPearlWork,
      };
      updatedCustomItems.push(currentAsDraft);
    }

    setOrderData(prev => ({
      ...prev,
      service: targetItem.service,
      customGarmentName: targetItem.customGarmentName || '',
      designFiles: targetItem.designFiles || [],
      specialInstructions: targetItem.specialInstructions || '',
      measurements: { ...targetItem.measurements },
      unit: targetItem.unit,
      hasPearlWork: targetItem.hasPearlWork,
      customItems: updatedCustomItems,
    }));

    setCurrentStep(1); // Go back to Step 1 to edit
    setNotification(`Loaded ${targetItem.service === GarmentType.OTHER ? targetItem.customGarmentName || 'Other Design' : targetItem.service} for editing.`);
  };

  const addAnotherGarment = () => {
    if (!orderData.service) {
      setModalAlert({ message: "Please select a garment type before adding." });
      return;
    }
    const newItem: CustomTailoringItem = {
      id: Math.random().toString(36).substring(2, 9),
      service: orderData.service,
      customGarmentName: orderData.customGarmentName,
      designFiles: orderData.designFiles,
      specialInstructions: orderData.specialInstructions,
      measurements: { ...orderData.measurements },
      unit: orderData.unit,
      hasPearlWork: orderData.hasPearlWork,
    };
    setOrderData(prev => ({
      ...prev,
      service: null,
      customGarmentName: '',
      designFiles: [],
      specialInstructions: '',
      measurements: {
        shoulder: '',
        chest: '',
        waist: '',
        hip: '',
        fullLength: '',
        vestLength: '',
        sleeveLength: '',
        armhole: '',
        collarSize: '',
      },
      hasPearlWork: false,
      customItems: [...prev.customItems, newItem],
    }));
    setCurrentStep(1); // Reset to service selection
    setNotification(`Dress #${orderData.customItems.length + 1} added! Choose the style for your next dress.`);
  };

  const nextStep = () => {
    if (currentStep === 4) {
      if (orderData.service) {
        // Automatically save the current garment configuration
        const newItem: CustomTailoringItem = {
          id: Math.random().toString(36).substring(2, 9),
          service: orderData.service,
          customGarmentName: orderData.customGarmentName,
          designFiles: orderData.designFiles,
          specialInstructions: orderData.specialInstructions,
          measurements: { ...orderData.measurements },
          unit: orderData.unit,
          hasPearlWork: orderData.hasPearlWork,
        };
        setOrderData(prev => ({
          ...prev,
          service: null,
          customGarmentName: '',
          designFiles: [],
          specialInstructions: '',
          measurements: {
            shoulder: '',
            chest: '',
            waist: '',
            hip: '',
            fullLength: '',
            vestLength: '',
            sleeveLength: '',
            armhole: '',
            collarSize: '',
          },
          hasPearlWork: false,
          customItems: [...prev.customItems, newItem],
        }));
      } else if (orderData.customItems.length === 0) {
        setModalAlert({ message: "Please select a style and specify details for at least one garment." });
        return;
      }
    }

    if (currentStep === 6) {
      if (!agreementAgreed) {
        setModalAlert({ message: "Please read and agree to the Rules & Agreement to proceed." });
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderOrderStep = () => {
    switch (currentStep) {
      case 1:
        return <ServiceSelection orderData={orderData} updateOrderData={updateOrderData} />;
      case 2:
        return (
          <DesignUpload 
            orderData={orderData} 
            updateOrderData={updateOrderData} 
            showModalAlert={(msg) => setModalAlert({ message: msg })} 
          />
        );
      case 3:
        return (
          <MeasurementsForm 
            orderData={orderData} 
            updateOrderData={updateOrderData} 
            updateMeasurements={(m) => updateOrderData({ measurements: { ...orderData.measurements, ...m }})}
          />
        );
      case 4:
        return <Extras orderData={orderData} updateOrderData={updateOrderData} />;
      case 5:
        return <DeliveryDetails orderData={orderData} updateOrderData={updateOrderData} />;
      case 6:
        return <AgreementStep agreed={agreementAgreed} onAgreeChange={setAgreementAgreed} />;
      case 7:
        return <Submission orderData={orderData} user={currentUser} navigateTo={navigateTo} prevStep={prevStep} />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    // --- Public Accessible Views (No login guard) ---
    if (currentView === 'home') {
      return <HomePage navigateTo={navigateTo} isLoggedIn={!!currentUser} />;
    }
    if (currentView === 'about') {
      return <AboutPage />;
    }
    if (currentView === 'products') {
      return <CustomProductsPage onAddToCart={handleAddToCart} onOrderBespoke={handleOrderProduct} />;
    }
    if (currentView === 'order-tracking') {
      return <OrderTracking />;
    }
    if (currentView === 'signup') {
      return !currentUser ? (
        <SignupPage onSignup={handleSignup} navigateTo={navigateTo} />
      ) : (
        null
      );
    }
    if (currentView === 'login') {
      return !currentUser ? (
        <LoginPage onLogin={handleLogin} navigateTo={navigateTo} notification={notification ?? undefined} />
      ) : (
        null
      );
    }
    if (currentView === 'admin-login') {
      if (currentUser) {
        return currentUser.role === UserRole.ADMIN ? (
          <AdminDashboard user={currentUser} />
        ) : (
          <Dashboard
            user={currentUser}
            navigateTo={navigateTo}
            onUpdateUser={handleUpdateUser}
            notification={notification}
            setNotification={setNotification}
            hasDraft={hasDraft}
            resumeDraft={resumeDraft}
            clearDraft={clearDraft}
          />
        );
      }
      return <AdminLoginPage onLogin={handleLogin} navigateTo={navigateTo} />;
    }

    // --- Private Guards (Auth required) ---
    if (!currentUser) {
      // Redirect to login for guarded pages
      return (
        <LoginPage
          onLogin={handleLogin}
          navigateTo={navigateTo}
          notification="Please log in to access this premium feature."
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            user={currentUser}
            navigateTo={navigateTo}
            onUpdateUser={handleUpdateUser}
            notification={notification}
            setNotification={setNotification}
            hasDraft={hasDraft}
            resumeDraft={resumeDraft}
            clearDraft={clearDraft}
          />
        );
      case 'admin-dashboard':
        return currentUser.role === UserRole.ADMIN ? (
          <AdminDashboard user={currentUser} />
        ) : (
          <Dashboard
            user={currentUser}
            navigateTo={navigateTo}
            onUpdateUser={handleUpdateUser}
            notification={notification}
            setNotification={setNotification}
          />
        );
      case 'cart':
        return (
          <CartPage
            cartItems={cartItems}
            onRemoveItem={handleRemoveCartItem}
            onUpdateQuantity={handleUpdateCartQuantity}
            userId={currentUser.id}
            customerName={currentUser.name}
            navigateTo={navigateTo}
            onClearCart={handleClearCart}
          />
        );
      case 'order-confirmation':
        return <OrderConfirmation navigateTo={navigateTo} />;
      case 'order':
      default:
        // Admin Guard: Admins cannot place bespoke tailoring requests.
        if (currentUser.role === UserRole.ADMIN) {
          navigateTo('admin-dashboard');
          return null;
        }
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="mb-12">
              <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
            </div>

            {/* Custom Tailoring Cart Items indicator */}
            {orderData.customItems && orderData.customItems.length > 0 && currentStep < 5 && (
              <div className="bg-gray-50 border border-black/10 p-6 space-y-4">
                <h4 className="text-[10px] font-sans text-brand-dark-gray font-bold uppercase tracking-[0.3em] border-b border-black/15 pb-2">
                  Dresses in this custom order ({orderData.customItems.length})
                </h4>
                <div className="flex flex-wrap gap-3">
                  {orderData.customItems.map((item, idx) => (
                    <div key={item.id} className="bg-white border border-black/20 flex items-center transition-all hover:border-black">
                      <button
                        type="button"
                        onClick={() => editGarment(item.id)}
                        className="text-[10px] font-bold text-black uppercase tracking-wider font-sans px-3 py-2 border-r border-black/10 hover:bg-black/5 transition-colors flex items-center gap-1.5"
                        title="Click to edit this dress"
                      >
                        <span className="text-[8px] bg-black text-white px-1 py-0.2 rounded font-mono">#{idx + 1}</span>
                        <span>
                          {item.service === GarmentType.OTHER 
                            ? (item.customGarmentName || 'Other Design') 
                            : (item.service || 'Custom Dress')}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-2.5 h-2.5 text-brand-dark-gray ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOrderData(prev => ({
                            ...prev,
                            customItems: prev.customItems.filter(i => i.id !== item.id)
                          }));
                          setNotification("Garment removed from order.");
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold text-xs px-2.5 py-2 h-full transition-colors"
                        title="Remove dress"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {renderOrderStep()}
            {currentView === 'order' && currentStep < totalSteps && (
              <div className="mt-12 flex justify-between items-center border-t border-black/10 pt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-8 py-4 bg-transparent border border-black text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:border-gray-300"
                >
                  Back
                </button>
                <div className="flex gap-4">
                  {currentStep === 4 && (
                    <button
                      type="button"
                      onClick={addAnotherGarment}
                      className="px-8 py-4 bg-transparent border border-black text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-100 transition-colors"
                    >
                      + Stitch Another Dress
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors"
                  >
                    {currentStep === 4 
                      ? 'Continue to Delivery' 
                      : currentStep === 6 
                        ? 'Agree & Continue' 
                        : 'Next Step'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isAdminDashboard = (currentView === 'admin-dashboard' || (currentView === 'admin-login' && currentUser?.role === UserRole.ADMIN));

  if (isAdminDashboard) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans text-black selection:bg-black selection:text-white">
        {notification && <NotificationPanel message={notification} onClose={() => setNotification(null)} />}
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans text-black flex flex-col justify-between selection:bg-black selection:text-white">
      {notification && <NotificationPanel message={notification} onClose={() => setNotification(null)} />}
      {modalAlert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
          <div className="bg-white border border-black max-w-sm w-full p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-black"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
              <h3 className="text-lg font-serif text-black uppercase tracking-tight">{modalAlert.title || 'Attention Required'}</h3>
            </div>
            <p className="text-xs text-brand-dark-gray leading-relaxed font-light uppercase tracking-wider">
              {modalAlert.message}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setModalAlert(null)}
                className="w-full py-4 bg-black hover:bg-gray-900 text-white text-[10px] uppercase tracking-[0.3em] font-bold transition-all"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
      <Header user={currentUser} navigateTo={navigateTo} onLogout={handleLogout} cartItemsCount={totalCartCount} />
      <main className={`w-full flex-grow ${
        currentView === 'home' ? 'px-0 pt-[88px] pb-24' : 'px-6 md:px-12 py-24'
      }`}>
        <div className="w-full">
          {renderContent()}
        </div>
      </main>
      <Footer user={currentUser} navigateTo={navigateTo} />
    </div>
  );
};

export default App;