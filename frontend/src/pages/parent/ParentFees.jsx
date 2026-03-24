import { CreditCard, Download, Clock } from 'lucide-react';

const ParentFees = () => {
  const feeRecords = [
    { id: 1, type: 'Tuition Fee', month: 'April', amount: 3000, status: 'Paid', date: 'Mar 25, 2026' },
    { id: 2, type: 'Transport Fee', month: 'April', amount: 1200, status: 'Pending', date: '-' },
    { id: 3, type: 'Tuition Fee', month: 'May', amount: 3000, status: 'Upcoming', date: '-' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Fees & Payments</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
               <h2 className="text-xl font-bold text-gray-800">Fee Ledger (Rohan Sharma)</h2>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                      <th className="py-4 px-6 font-medium">Fee Type</th>
                      <th className="py-4 px-6 font-medium">Month</th>
                      <th className="py-4 px-6 font-medium">Amount</th>
                      <th className="py-4 px-6 font-medium text-center">Status</th>
                      <th className="py-4 px-6 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {feeRecords.map((fee) => (
                      <tr key={fee.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-800">{fee.type}</td>
                        <td className="py-4 px-6 text-gray-600">{fee.month}</td>
                        <td className="py-4 px-6 font-bold text-gray-800">₹{fee.amount}</td>
                        <td className="py-4 px-6 text-center">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                             fee.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                             fee.status === 'Pending' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                           }`}>
                             {fee.status}
                           </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                           {fee.status === 'Paid' ? (
                              <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1 justify-end w-full font-medium" title="Download Receipt">
                                 <Download size={16} /> Receipt
                              </button>
                           ) : (
                              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors w-full">
                                 Pay Now
                              </button>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-8 rounded-2xl text-white shadow-lg">
               <p className="text-blue-200 mb-2 font-medium">Total Amount Due</p>
               <h2 className="text-4xl font-extrabold mb-6">₹1,200</h2>
               <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md">
                  <CreditCard size={20} /> Pay Outstanding
               </button>
               <p className="text-xs text-blue-300 mt-4 text-center">Secure payment processed via Razorpay.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Clock size={18} className="text-orange-500" /> Pending Reminders
               </h3>
               <p className="text-gray-600 text-sm leading-relaxed">
                  Transport Fee for Rohan Sharma (April) is due tomorrow. Please pay to avoid late fees.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};
export default ParentFees;
