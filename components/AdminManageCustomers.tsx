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
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Console Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-4xl font-serif text-slate-900 uppercase tracking-tight">Customer Database</h2>
          <p className="text-sm font-light text-slate-600 mt-2">
            View and manage all registered customer accounts and access privileges.
          </p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider font-extrabold bg-slate-100 text-slate-700 px-4.5 py-2.5 rounded-lg border border-slate-200">
            Total: {customers.length} Customers
          </span>
        </div>
      </div>

      {/* CRM FILTER CONSOLE */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex gap-4 items-center">
        <div className="w-full md:flex-1 relative">
          <input
            type="text"
            placeholder="Search by customer name or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-slate-400 focus:ring-0 px-5 py-3 text-sm font-medium rounded-xl placeholder-slate-400 font-sans"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm font-bold text-slate-400 animate-pulse py-12 text-center uppercase tracking-widest">Loading database records...</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white font-sans">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Customer Name</th>
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Email Address</th>
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500">Access Role</th>
                <th className="py-4.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500 text-right">Join Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      {customer.profilePhotoUrl ? (
                        <img src={customer.profilePhotoUrl} alt="" className="h-9 w-9 object-cover rounded-full border border-slate-200 grayscale" />
                      ) : (
                        <div className="h-9 w-9 bg-slate-800 rounded-full flex items-center justify-center text-white text-xs font-bold border border-slate-700">
                          {customer.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm font-bold text-slate-900">{customer.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-slate-700 font-mono">
                    {customer.email}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border ${
                      customer.role === 'Admin' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {customer.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-right text-slate-500 font-mono">
                    {new Date(customer.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-16 text-xs uppercase tracking-widest text-center text-slate-400 font-extrabold bg-slate-50/10">
                    No matching customer accounts found.
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
