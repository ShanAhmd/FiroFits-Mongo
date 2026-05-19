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
    name: '',
    contact: '',
    address: '',
    deliveryDate: '',
  },
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Order form state
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>(INITIAL_ORDER_DATA);

  const totalSteps = 6;

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const navigateTo = (view: View) => {
    window.scrollTo(0, 0);
    if (view === 'order') {
      // Reset order form when navigating back to it
      setOrderData(INITIAL_ORDER_DATA);
      setCurrentStep(1);
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

  const nextStep = () => {
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
        return <DesignUpload orderData={orderData} updateOrderData={updateOrderData} />;
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
        if (!currentUser) return null;
        return <Submission orderData={orderData} user={currentUser} navigateTo={navigateTo} />;
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
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-12">
              <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
            </div>
            {renderOrderStep()}
            {currentView === 'order' && currentStep < totalSteps && (
              <div className="mt-12 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-8 py-4 bg-transparent border border-black text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:border-gray-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors"
                >
                  Next Step
                </button>
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