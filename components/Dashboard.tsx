import React, { useState } from 'react';
import { type User, type View } from '../types';
import MyOrders from './MyOrders';
import MyProfile from './MyProfile';

type DashboardView = 'my-orders' | 'my-profile';

interface DashboardProps {
    user: User;
    navigateTo: (view: View) => void;
    onUpdateUser: (updatedData: Partial<User>) => void;
    notification: string | null;
    setNotification: (message: string | null) => void;
    defaultView?: DashboardView;
}

const Dashboard: React.FC<DashboardProps> = ({ user, navigateTo, onUpdateUser, notification, setNotification, defaultView = 'my-orders' }) => {
    const [activeView, setActiveView] = useState<DashboardView>(defaultView);

    const renderContent = () => {
        switch(activeView) {
            case 'my-orders':
                return <MyOrders />;
            case 'my-profile':
                return <MyProfile user={user} onUpdateUser={onUpdateUser} notification={notification} setNotification={setNotification} />;
            default:
                return <MyOrders />;
        }
    }

    return (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-md p-4 space-y-2">
                    <button
                        onClick={() => setActiveView('my-orders')}
                        className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors text-sm ${activeView === 'my-orders' ? 'bg-brand-teal text-white' : 'text-brand-charcoal hover:bg-gray-100'}`}
                    >
                        My Orders
                    </button>
                    <button
                        onClick={() => setActiveView('my-profile')}
                        className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors text-sm ${activeView === 'my-profile' ? 'bg-brand-teal text-white' : 'text-brand-charcoal hover:bg-gray-100'}`}
                    >
                        My Profile
                    </button>
                </div>
            </aside>
            <main className="flex-1">
                 <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;