import React, { useState } from 'react';
import { 
  FileText, 
  CreditCard, 
  AlertOctagon, 
  CheckCircle2, 
  Download,
  Search,
  Bell,
  Plus,
  Eye,
  Printer,
  Share2,
  X
} from 'lucide-react';
import { MOCK_INVOICES, MOCK_CLIENTS } from '../constants';
import { useToast } from './Toast';
import { Invoice } from '../types';

export const InvoicingPage: React.FC = () => {
  const { addToast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  // New Invoice State
  const [newClientId, setNewClientId] = useState(MOCK_CLIENTS[0].id);
  const [newAmount, setNewAmount] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const handleSendReminder = (clientName: string) => {
    addToast(`Payment reminder sent to ${clientName}`, 'success');
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const client = MOCK_CLIENTS.find(c => c.id === newClientId);
    
    const newInvoice: Invoice = {
        id: `INV-2023-${100 + invoices.length + 1}`,
        clientId: newClientId,
        clientName: client?.name || 'Unknown',
        amount: parseFloat(newAmount),
        status: 'Unpaid',
        dueDate: newDueDate || new Date().toISOString().split('T')[0],
        items: [newDesc]
    };

    setInvoices(prev => [newInvoice, ...prev]);
    setShowCreateModal(false);
    addToast('Invoice created and sent to client', 'success');

    // Reset Form
    setNewAmount('');
    setNewDesc('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Client Billing & Invoices</h1>
           <p className="text-slate-500">Manage outstanding balances and collections.</p>
        </div>
        <div className="flex gap-4 items-center">
            <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-4 shadow-sm hidden md:flex">
                <div className="text-sm">
                    <span className="text-slate-500">Total Outstanding:</span>
                    <span className="block font-bold text-red-600">R 129,500.50</span>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="text-sm">
                    <span className="text-slate-500">Collected (Oct):</span>
                    <span className="block font-bold text-emerald-600">R 84,200.00</span>
                </div>
            </div>
            <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm"
            >
                <Plus className="w-4 h-4" /> New Invoice
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Outstanding Balances Summary */}
         <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-orange-500" />
                    Accounts in Arrears
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Client</th>
                            <th className="px-6 py-3 font-medium">Phone</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Outstanding Balance</th>
                            <th className="px-6 py-3 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_CLIENTS.filter(c => c.outstandingBalance > 0).map(client => (
                            <tr key={client.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{client.name}</td>
                                <td className="px-6 py-4 text-slate-500 font-mono">{client.phoneNumber}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Payment Required
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-red-600">
                                    R {client.outstandingBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleSendReminder(client.name)}
                                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 font-medium text-xs ml-auto"
                                    >
                                        <Bell className="w-3 h-3" /> Send Reminder
                                    </button>
                                </td>
                            </tr>
                        ))}
                         {MOCK_CLIENTS.filter(c => c.outstandingBalance > 0).length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                                    All accounts are up to date!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
         </div>

         {/* Recent Invoices List */}
         <div className="lg:col-span-3">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="font-semibold text-slate-800">Recent Invoices</h3>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search invoice #" className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                 </div>
             </div>
             
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Invoice #</th>
                            <th className="px-6 py-3 font-medium">Client</th>
                            <th className="px-6 py-3 font-medium">Date Due</th>
                            <th className="px-6 py-3 font-medium">Amount</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {invoices.map(inv => (
                            <tr key={inv.id} className="hover:bg-slate-50 group">
                                <td className="px-6 py-4 font-mono text-slate-600 group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => setPreviewInvoice(inv)}>{inv.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{inv.clientName}</td>
                                <td className="px-6 py-4 text-slate-500">{inv.dueDate}</td>
                                <td className="px-6 py-4 font-medium">R {inv.amount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                                        inv.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                                        'bg-amber-100 text-amber-800'
                                    }`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                    <button onClick={() => setPreviewInvoice(inv)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
         </div>
      </div>

      {/* Invoice Preview Slide-over */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-2xl bg-white h-full shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Invoice</h2>
                        <div className="text-slate-500 font-mono">{previewInvoice.id}</div>
                    </div>
                    <button onClick={() => setPreviewInvoice(null)} className="p-2 hover:bg-slate-100 rounded-full">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="border-b border-slate-200 pb-8 mb-8">
                         <div className="flex justify-between mb-8">
                             <div>
                                 <div className="text-xs font-bold text-slate-400 uppercase mb-2">Bill To</div>
                                 <div className="font-bold text-lg text-slate-900">{previewInvoice.clientName}</div>
                                 <div className="text-slate-500 text-sm">Client ID: {previewInvoice.clientId}</div>
                             </div>
                             <div className="text-right">
                                 <div className="text-xs font-bold text-slate-400 uppercase mb-2">Status</div>
                                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                                        previewInvoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                                        previewInvoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                                        'bg-amber-100 text-amber-800'
                                 }`}>
                                     {previewInvoice.status}
                                 </span>
                             </div>
                         </div>
                         
                         <div className="bg-slate-50 rounded-lg p-6">
                             <table className="w-full text-sm">
                                 <thead className="text-slate-500 border-b border-slate-200">
                                     <tr>
                                         <th className="text-left pb-3 pl-2">Description</th>
                                         <th className="text-right pb-3 pr-2">Amount</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-200">
                                     {previewInvoice.items.map((item, i) => (
                                         <tr key={i}>
                                             <td className="py-4 pl-2 font-medium text-slate-800">{item}</td>
                                             <td className="py-4 pr-2 text-right text-slate-600">R {previewInvoice.amount.toLocaleString()}</td>
                                         </tr>
                                     ))}
                                 </tbody>
                                 <tfoot className="border-t border-slate-200">
                                     <tr>
                                         <td className="pt-4 pl-2 font-bold text-slate-900">Total</td>
                                         <td className="pt-4 pr-2 text-right font-bold text-slate-900 text-lg">R {previewInvoice.amount.toLocaleString()}</td>
                                     </tr>
                                 </tfoot>
                             </table>
                         </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-6 flex gap-4">
                    <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                        <Share2 className="w-4 h-4" /> Send to Client
                    </button>
                    <button className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-bold flex items-center gap-2 transition-colors">
                        <Printer className="w-4 h-4" /> Print
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-in zoom-in-95">
                <form onSubmit={handleCreateInvoice}>
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Create New Invoice</h3>
                        <p className="text-sm text-slate-500">Bill a client for ad-hoc services or retainers.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                            <select 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                value={newClientId} 
                                onChange={e => setNewClientId(e.target.value)}
                            >
                                {MOCK_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (ZAR)</label>
                                <input 
                                    required 
                                    type="number" 
                                    placeholder="0.00"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                    value={newAmount} 
                                    onChange={e => setNewAmount(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                                <input 
                                    required 
                                    type="date" 
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                    value={newDueDate} 
                                    onChange={e => setNewDueDate(e.target.value)} 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description / Line Item</label>
                            <textarea 
                                required 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                rows={2} 
                                placeholder="e.g. Emergency Fiber Splicing - 2 Hours"
                                value={newDesc} 
                                onChange={e => setNewDesc(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-xl flex justify-end gap-3">
                        <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">Generate Invoice</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};