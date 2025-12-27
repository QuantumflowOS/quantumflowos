import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Plus, 
  ShoppingCart, 
  CreditCard, 
  X, 
  CheckCircle2,
  Package,
  Truck
} from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_CLIENTS } from '../constants';
import { Product } from '../types';
import { useToast } from './Toast';

export const HardwareStore: React.FC = () => {
  const { addToast } = useToast();
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [filter, setFilter] = useState('All');
  const [cart, setCart] = useState<Product[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(MOCK_CLIENTS[0].id);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const filteredProducts = products.filter(p => filter === 'All' || p.category === filter);

  const addToCart = (product: Product) => {
      setCart(prev => [...prev, product]);
      addToast(`${product.name} added to procurement list`, 'success');
  };

  const removeFromCart = (index: number) => {
      setCart(prev => prev.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
      setIsCheckingOut(true);
      setTimeout(() => {
          setIsCheckingOut(false);
          setShowCartModal(false);
          setCart([]);
          addToast(`Order placed! Invoice generated for ${MOCK_CLIENTS.find(c => c.id === selectedClientId)?.name}`, 'success');
      }, 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
             <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-8 h-8 text-indigo-600" /> Hardware Procurement
             </h1>
             <p className="text-slate-500">Order network equipment for client upgrades and repairs.</p>
          </div>
          <div className="flex items-center gap-4">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                  />
              </div>
              <button 
                onClick={() => setShowCartModal(true)}
                className="relative p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                  <ShoppingCart className="w-5 h-5 text-slate-700" />
                  {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {cart.length}
                      </span>
                  )}
              </button>
          </div>
       </div>

       {/* Categories */}
       <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
           {['All', 'Router', 'Switch', 'Access Point', 'Cabling', 'License'].map(cat => (
               <button 
                 key={cat} 
                 onClick={() => setFilter(cat)}
                 className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                     filter === cat ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                 }`}
               >
                   {cat}
               </button>
           ))}
       </div>

       {/* Product Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-6">
           {filteredProducts.map(product => (
               <div key={product.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                   <div className="h-48 bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
                        {/* Placeholder for Product Image - Using an Icon if URL fails visually, but using CSS to display image */}
                        <div className="w-full h-full bg-contain bg-center bg-no-repeat transition-transform group-hover:scale-105 duration-300" style={{ backgroundImage: `url(${product.image})` }}>
                            {/* Fallback visual if image breaks/is mock */}
                            {!product.image.includes('http') && <Package className="w-16 h-16 text-slate-300 mx-auto mt-10" />}
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-600 shadow-sm">
                            {product.brand}
                        </div>
                   </div>
                   <div className="p-4 flex-1 flex flex-col">
                       <div className="flex justify-between items-start mb-2">
                           <h3 className="font-bold text-slate-900 leading-tight">{product.name}</h3>
                       </div>
                       <p className="text-sm text-slate-500 mb-4 line-clamp-2">{product.description}</p>
                       <div className="mt-auto flex items-center justify-between">
                           <div className="text-lg font-bold text-indigo-600">R {product.price.toLocaleString()}</div>
                           <button 
                             onClick={() => addToCart(product)}
                             className="p-2 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors text-slate-600"
                           >
                               <Plus className="w-5 h-5" />
                           </button>
                       </div>
                       <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
                           <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                           {product.stock} in stock
                       </div>
                   </div>
               </div>
           ))}
       </div>

       {/* Cart Modal */}
       {showCartModal && (
           <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end">
               <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                   <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                       <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                           <ShoppingCart className="w-5 h-5 text-indigo-600" /> Procurement Cart
                       </h2>
                       <button onClick={() => setShowCartModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                           <X className="w-5 h-5 text-slate-500" />
                       </button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-6 space-y-4">
                       {cart.length === 0 ? (
                           <div className="text-center text-slate-400 py-12">
                               <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                               <p>Your procurement list is empty.</p>
                           </div>
                       ) : (
                           cart.map((item, idx) => (
                               <div key={idx} className="flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                   <div className="w-12 h-12 bg-white rounded border border-slate-200 flex items-center justify-center shrink-0">
                                       <Package className="w-6 h-6 text-slate-400" />
                                   </div>
                                   <div className="flex-1">
                                       <div className="font-bold text-sm text-slate-800">{item.name}</div>
                                       <div className="text-xs text-slate-500">R {item.price.toLocaleString()}</div>
                                   </div>
                                   <button onClick={() => removeFromCart(idx)} className="text-slate-400 hover:text-red-500 p-1">
                                       <X className="w-4 h-4" />
                                   </button>
                               </div>
                           ))
                       )}
                   </div>

                   <div className="p-6 border-t border-slate-200 bg-slate-50">
                       <div className="mb-4">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bill to Client</label>
                           <select 
                             className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white"
                             value={selectedClientId}
                             onChange={(e) => setSelectedClientId(e.target.value)}
                           >
                               {MOCK_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                           </select>
                       </div>
                       
                       <div className="flex justify-between items-center mb-6 text-lg font-bold text-slate-900">
                           <span>Total</span>
                           <span>R {cartTotal.toLocaleString()}</span>
                       </div>

                       <button 
                         onClick={handleCheckout}
                         disabled={cart.length === 0 || isCheckingOut}
                         className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                       >
                           {isCheckingOut ? (
                               <>Processing...</>
                           ) : (
                               <>
                                   <CreditCard className="w-4 h-4" /> Add to Invoice
                               </>
                           )}
                       </button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};