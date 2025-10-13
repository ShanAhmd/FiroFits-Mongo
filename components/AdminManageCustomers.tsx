// FIX: Replaced placeholder content with a full component implementation.
import React, { useState, useEffect } from 'react';
import { type User } from '../types';
import { getAllCustomers } from '../services/demoDatabase';
import { UserCircleIcon } from './IconComponents';

const AdminManageCustomers: React.FC = () => {
    const [customers, setCustomers] = useState<User[]>([]);

    useEffect(() => {
        setCustomers(getAllCustomers());
    }, []);

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md">
            <h1 className="text-3xl font-bold text-brand-charcoal mb-6">Manage Customers</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {customers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {customer.profilePhotoUrl ? (
                                                <img className="h-10 w-10 rounded-full object-cover" src={customer.profilePhotoUrl} alt={customer.name} />
                                            ) : (
                                                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                            <div className="text-sm text-gray-500">{customer.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{customer.phone || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.address || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminManageCustomers;
