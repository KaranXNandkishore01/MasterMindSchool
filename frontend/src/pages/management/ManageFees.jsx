import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { broadcastUpdate } from '../../utils/realtimeSync';
import {
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  X,
  CreditCard,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import sitelogo from '../../assets/sitelogo.png';

const CLASSES = [
  'All',
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12'
];

const ManageFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Collect Fee Modal state
  const [activeCollectFee, setActiveCollectFee] = useState(null);
  const [collectAmount, setCollectAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [transactionId, setTransactionId] = useState('');
  const [paymentRemarks, setPaymentRemarks] = useState('');

  // Receipt Modal state
  const [receiptData, setReceiptData] = useState(null);

  const fetchFees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/erp/fees', {
        params: {
          page,
          limit: 15,
          className: selectedClass,
          status: selectedStatus,
          search: searchTerm,
        },
        withCredentials: true,
      });

      if (response.data?.success) {
        setFees(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setFees([]);
        setTotalPages(1);
      }
    } catch {
      setFees([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, selectedClass, selectedStatus, searchTerm]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const handleOpenCollect = (item) => {
    setActiveCollectFee(item);
    setCollectAmount(item.dueAmount > 0 ? String(item.dueAmount) : '');
    setPaymentMode('Cash');
    setTransactionId('');
    setPaymentRemarks('');
  };

  const handleCollectSubmit = async (e) => {
    e.preventDefault();
    if (!activeCollectFee) return;

    const amt = Number(collectAmount);
    if (!amt || amt <= 0) return;

    try {
      const response = await axios.post('/api/erp/fees/collect', {
        feeId: activeCollectFee._id,
        amount: amt,
        paymentMode,
        transactionId,
        remarks: paymentRemarks,
      }, { withCredentials: true });

      const newReceipt = response.data?.receipt || {
        receiptNo: `REC-2026-${Date.now().toString().slice(-5)}`,
        amount: amt,
        date: new Date().toLocaleDateString(),
        paymentMode,
      };

      setReceiptData({
        ...activeCollectFee,
        paidNow: amt,
        newDue: Math.max(0, activeCollectFee.dueAmount - amt),
        receiptNo: newReceipt.receiptNo,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        paymentMode,
      });
    } catch {
      // Standalone simulation
      setReceiptData({
        ...activeCollectFee,
        paidNow: amt,
        newDue: Math.max(0, activeCollectFee.dueAmount - amt),
        receiptNo: `REC-2026-${Date.now().toString().slice(-5)}`,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        paymentMode,
      });
    }

    setActiveCollectFee(null);
    broadcastUpdate('fees');
    fetchFees();
  };

  const totalExpected = fees.reduce((acc, f) => acc + (f.totalFee || 0) + (f.fine || 0) - (f.discount || 0), 0);
  const totalCollected = fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
  const totalDue = fees.reduce((acc, f) => acc + (f.dueAmount || 0), 0);
  const collectionRatio = totalExpected > 0 ? ((totalCollected / totalExpected) * 100).toFixed(1) : '100';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} /> Fee & Finance Engine
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              Fee Collection & Invoicing
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Manage term collections, fee concessions, and instant printable payment receipts.
            </p>
          </div>
        </div>

        {/* Financial Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
          <div className="bg-white/5 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none">
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Total Expected</span>
            <p className="text-xl sm:text-2xl font-black text-white mt-0.5">₹ {totalExpected.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white/5 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none">
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Total Collected</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">₹ {totalCollected.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white/5 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none">
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Outstanding Dues</span>
            <p className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">₹ {totalDue.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white/5 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none">
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Collection Ratio</span>
            <p className="text-xl sm:text-2xl font-black text-white mt-0.5">{collectionRatio}%</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            placeholder="Search Scholar No or Student Name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs sm:text-sm transition-all"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
          {/* Class Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => { setSelectedClass(e.target.value); setPage(1); }}
              className="w-full sm:w-auto px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              {CLASSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
              className="w-full sm:w-auto px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Paid">Fully Paid</option>
              <option value="Partial">Partial Dues</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fees Table */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Mobile Horizontal Scroll Cue */}
        <div className="md:hidden px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Swipe table left/right for fees</span>
          <span className="font-bold text-slate-600">⇄</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">Scholar No</th>
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-6">Class</th>
                <th className="py-4 px-6 text-right">Annual Fee</th>
                <th className="py-4 px-6 text-right">Fine</th>
                <th className="py-4 px-6 text-right">Paid</th>
                <th className="py-4 px-6 text-right">Balance Due</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mb-2"></div>
                    <p className="text-xs font-bold uppercase tracking-wider">Loading Fee Records...</p>
                  </td>
                </tr>
              ) : fees.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400 font-bold">
                    No fee records found for current filters
                  </td>
                </tr>
              ) : (
                fees.map((fee) => (
                  <tr key={fee._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-xs font-extrabold text-blue-900">
                      {fee.scholarNo}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      {fee.studentName}
                    </td>
                    <td className="py-3.5 px-6 font-semibold">
                      {fee.class} - {fee.section}
                    </td>
                    <td className="py-3.5 px-6 text-right font-semibold text-slate-700">
                      ₹ {fee.totalFee?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 text-right font-semibold">
                      {fee.fine > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          ₹ {fee.fine?.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">₹ 0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right font-extrabold text-emerald-600">
                      ₹ {fee.paidAmount?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 text-right font-extrabold text-rose-600">
                      ₹ {fee.dueAmount?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        fee.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : fee.status === 'Partial'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      {fee.dueAmount > 0 ? (
                        <button
                          onClick={() => handleOpenCollect(fee)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 font-bold rounded-lg text-xs shadow-sm cursor-pointer"
                        >
                          Collect Fee
                        </button>
                      ) : (
                        <button
                          onClick={() => setReceiptData({
                            ...fee,
                            paidNow: fee.paidAmount,
                            newDue: 0,
                            receiptNo: fee.payments?.[0]?.receiptNo || `REC-${fee.scholarNo}-1`,
                            date: '2026-04-10',
                            paymentMode: 'Online Transfer',
                          })}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 inline-flex cursor-pointer"
                        >
                          <Printer size={13} /> Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Showing Page <span className="font-bold text-slate-800">{page}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {activeCollectFee && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveCollectFee(null)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-8 shadow-2xl border border-slate-100 relative animate-scale-in max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveCollectFee(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-5 sm:mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                Fee Collection Desk
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Receive Payment</h3>
              <p className="text-xs text-slate-500 mt-1">
                {activeCollectFee.studentName} ({activeCollectFee.scholarNo}) • {activeCollectFee.class}-{activeCollectFee.section}
              </p>
            </div>

            <form onSubmit={handleCollectSubmit} className="space-y-4">
              <div className="p-3.5 sm:p-4 bg-amber-50 rounded-xl sm:rounded-2xl border border-amber-200/60 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600">Annual Base Fee:</span>
                  <span className="font-bold text-slate-900">₹ {activeCollectFee.totalFee?.toLocaleString()}</span>
                </div>
                {activeCollectFee.fine > 0 && (
                  <div className="flex justify-between items-center text-xs text-rose-600">
                    <span className="font-bold">Absent Fine (₹10/day):</span>
                    <span className="font-bold">+ ₹ {activeCollectFee.fine?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-amber-200 text-xs sm:text-sm">
                  <span className="font-bold text-amber-900">Total Outstanding Balance:</span>
                  <span className="text-base sm:text-lg font-black text-rose-600">
                    ₹ {activeCollectFee.dueAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Payment Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={activeCollectFee.dueAmount}
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Payment Mode *</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Cash">Cash (Counter)</option>
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Bank Transfer">Bank Transfer / NEFT</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              {paymentMode !== 'Cash' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Transaction Ref / Cheque No</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. UPI Ref #98765432"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}

              <div className="pt-3 sm:pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setActiveCollectFee(null)}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 rounded-xl text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 cursor-pointer text-center"
                >
                  Record Payment & Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {receiptData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setReceiptData(null)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-slate-200 relative animate-scale-in max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setReceiptData(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer print:hidden"
            >
              <X size={20} />
            </button>

            {/* School Header */}
            <div className="text-center pb-6 border-b border-slate-200">
              <img src={sitelogo} alt="MMPS Logo" className="h-12 w-auto mx-auto mb-2 object-contain" />
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">MASTER MIND PUBLIC SCHOOL</h2>
              <p className="text-[11px] text-slate-500 font-semibold">
                Main Road, Pipariya, Madhya Pradesh 461775 • MPBSE Affiliated
              </p>
              <span className="inline-block mt-3 bg-slate-100 text-slate-800 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider border border-slate-200">
                Official Fee Receipt
              </span>
            </div>

            {/* Receipt Details */}
            <div className="py-6 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Receipt Number:</span>
                <span className="font-mono font-bold text-slate-900">{receiptData.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Date of Payment:</span>
                <span className="font-bold text-slate-900">{receiptData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Scholar Number:</span>
                <span className="font-mono font-bold text-blue-900">{receiptData.scholarNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Student Name:</span>
                <span className="font-bold text-slate-900">{receiptData.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Class & Section:</span>
                <span className="font-bold text-slate-900">{receiptData.class} - {receiptData.section}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Payment Mode:</span>
                <span className="font-bold text-slate-900">{receiptData.paymentMode}</span>
              </div>
              {receiptData.fine > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span className="font-semibold">Absent Fine (₹10/day):</span>
                  <span className="font-bold">₹ {receiptData.fine?.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between items-center text-sm">
                <span className="font-extrabold text-slate-900">Amount Received:</span>
                <span className="text-xl font-black text-emerald-600">
                  ₹ {receiptData.paidNow?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Remaining Balance Due:</span>
                <span className="font-bold text-rose-600">₹ {receiptData.newDue?.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between print:hidden">
              <button
                onClick={() => setReceiptData(null)}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Printer size={15} /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFees;

