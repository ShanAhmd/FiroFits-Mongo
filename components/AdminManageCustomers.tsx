import React, { useState, useEffect } from 'react';
import { type User } from '../types';
import { getAllCustomers } from '../services/supabaseClient';
import { UserCircleIcon } from './IconComponents';

const AdminManageCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      const data = await getAllCustomers();
      setCustomers(data);
      setIsLoading(false);
    };
    fetchCustomers();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Console Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Customers</h2>
          <p className="text-xs font-normal text-slate-500 mt-1 font-sans">
            View and manage all registered customer accounts.
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200/50 font-sans">
            Total: {customers.length} Customers
          </span>
        </div>
      </div>

      {/* CRM FILTER CONSOLE */}
      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex gap-4 items-center">
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search by customer name or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 px-4 py-2 text-xs font-medium rounded-lg placeholder-slate-300 font-sans"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-xs font-medium text-slate-400 animate-pulse py-8 font-sans">Loading customers...</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm bg-white font-sans">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="py-4 px-5 text-xs font-semibold text-slate-400">Customer Name</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400">Email Address</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400">Role</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400 text-right">Join Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-4">
                      {customer.profilePhotoUrl ? (
                        <img src={customer.profilePhotoUrl} alt="" className="h-7 w-7 object-cover rounded-full border border-slate-100 grayscale" />
                      ) : (
                        <div className="h-7 w-7 bg-slate-800 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                          {customer.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-bold text-slate-900">{customer.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-xs font-medium text-slate-700 font-mono">
                    {customer.email}
                  </td>
                  <td className="py-3 px-5">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${
                      customer.role === 'Admin' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {customer.role}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-xs font-medium text-right text-slate-400">
                    {new Date(customer.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-xs text-center text-slate-400 font-medium bg-slate-50/20">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminManageCustomers;
