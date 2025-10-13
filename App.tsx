import React, { useState, useEffect } from 'react';
import {
  type View,
  type User,
  type OrderData,
  UserRole,
  Unit,
  GarmentType,
  type Product,
} from './types';
import {
  authenticateUser,
  createUser,
  updateUser as updateDbUser,
} from './services/demoDatabase';
import Header from './components/Header';
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
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
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
  const [currentView, setCurrentView] = useState<View>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
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
  
  const handleLogin = (email: string, password: string, role: UserRole): User | null => {
    const user = authenticateUser(email, password, role);
    if (user) {
      setCurrentUser(user);
      navigateTo(user.role === UserRole.ADMIN ? 'admin-dashboard' : 'dashboard');
    }
    return user;
  };

  const handleSignup = (name: string, email: string, password: string, role: UserRole) => {
    const result = createUser(name, email, password, role);
    if (result.success) {
      setNotification('Account created successfully! Please log in.');
      navigateTo('login');
    }
    return result;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigateTo('login');
  };
  
  const handleUpdateUser = (updatedData: Partial<User>) => {
      if (currentUser) {
          const updatedUser = updateDbUser(currentUser.id, updatedData);
          if (updatedUser) {
              setCurrentUser(updatedUser);
              setNotification("Profile updated successfully!");
          }
      }
  };
  
  const handleOrderProduct = (product: Product) => {
      setOrderData({
          ...INITIAL_ORDER_DATA,
          service: GarmentType.OTHER,
          specialInstructions: `Ordering based on product: "${product.name}".\n\nDescription: ${product.description}`
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
        return <MeasurementsForm 
            orderData={orderData} 
            updateOrderData={updateOrderData} 
            updateMeasurements={(m) => updateOrderData({ measurements: { ...orderData.measurements, ...m }})}
        />;
      case 4:
        return <Extras orderData={orderData} updateOrderData={updateOrderData} />;
      case 5:
        return <DeliveryDetails orderData={orderData} updateOrderData={updateOrderData} />;
      case 6:
        if (!currentUser) {
          return null;
        }
        return <Submission orderData={orderData} user={currentUser} navigateTo={navigateTo} />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    // If user is not logged in, only allow access to login and signup pages.
    if (!currentUser) {
        if (currentView === 'signup') {
            return <SignupPage onSignup={handleSignup} navigateTo={navigateTo} />;
        }
        // For any other view, default to the login page.
        return <LoginPage onLogin={handleLogin} navigateTo={navigateTo} notification={notification ?? undefined}/>;
    }

    // --- Authenticated Routes ---
    switch (currentView) {
      case 'login':
      case 'signup':
        // If a logged-in user somehow gets to login/signup, redirect them.
        navigateTo(currentUser.role === UserRole.ADMIN ? 'admin-dashboard' : 'dashboard');
        return null; // Render nothing while redirecting.
      case 'about':
        return <AboutPage />;
      case 'products':
        return <CustomProductsPage onOrderProduct={handleOrderProduct}/>;
      case 'dashboard':
        return <Dashboard user={currentUser} navigateTo={navigateTo} onUpdateUser={handleUpdateUser} notification={notification} setNotification={setNotification} />;
      case 'admin-dashboard':
         return currentUser.role === UserRole.ADMIN ? <AdminDashboard user={currentUser} /> : <Dashboard user={currentUser} navigateTo={navigateTo} onUpdateUser={handleUpdateUser} notification={notification} setNotification={setNotification} />;
      case 'order-confirmation':
        return <OrderConfirmation navigateTo={navigateTo} />;
      case 'order':
      default:
        // Admin Guard: Admins cannot place new orders.
        if (currentUser.role === UserRole.ADMIN) {
          navigateTo('admin-dashboard');
          return null;
        }
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
            </div>
            {renderOrderStep()}
            {currentView === 'order' && currentStep < totalSteps && (
              <div className="mt-12 flex justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 bg-gray-200 text-brand-charcoal rounded-xl font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-brand-teal text-white rounded-xl font-semibold hover:bg-opacity-90 transition-colors shadow-lg"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-brand-cream min-h-screen font-sans text-brand-charcoal flex flex-col">
       {notification && <NotificationPanel message={notification} onClose={() => setNotification(null)} />}
       <Header user={currentUser} navigateTo={navigateTo} onLogout={handleLogout} />
      <main className="p-4 md:p-8 flex-grow">
        {renderContent()}
      </main>
      <Footer user={currentUser} navigateTo={navigateTo} />
    </div>
  );
};

export default App;