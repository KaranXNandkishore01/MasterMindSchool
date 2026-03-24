import { CheckCircle2, Calendar, FileText, Download } from 'lucide-react';

const Admissions = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-blue-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Admissions 2026-27</h1>
        <p className="text-blue-200 max-w-2xl mx-auto text-lg">Join the MMPS family. A step-by-step guide to our admission process.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FileText className="text-yellow-500 w-8 h-8" /> 
                Admission Procedure
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 mt-1">1</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Online Registration</h4>
                    <p className="text-gray-600">Fill out the online inquiry form or visit the school office to register your child. Registration fee applies.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 mt-1">2</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Interaction / Entrance Test</h4>
                    <p className="text-gray-600">Depending on the grade applied for, parents and students will be called for a general interaction or a written assessment.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 mt-1">3</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Document Verification</h4>
                    <p className="text-gray-600">Submit all necessary documents including birth certificate, past academic records, and photographs.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 mt-1">4</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Fee Payment</h4>
                    <p className="text-gray-600">Upon admission confirmation, complete the initial fee payment to secure the seat.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-yellow-50 rounded-3xl p-8 border border-yellow-200">
              <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6" /> Key Dates
              </h3>
              <ul className="space-y-4">
                <li className="flex justify-between border-b border-yellow-200 pb-2">
                  <span className="text-gray-700">Form Availability</span>
                  <span className="font-bold text-gray-900">Mar 15, 2026</span>
                </li>
                <li className="flex justify-between border-b border-yellow-200 pb-2">
                  <span className="text-gray-700">Last Date to Apply</span>
                  <span className="font-bold text-gray-900">Apr 20, 2026</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-700">Session Begins</span>
                  <span className="font-bold text-gray-900">Jul 01, 2026</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Downloads</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center gap-3 text-blue-600 hover:text-blue-800 font-medium p-3 rounded-xl hover:bg-blue-50 transition-colors">
                    <Download className="w-5 h-5" /> Admission Brochure
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-blue-600 hover:text-blue-800 font-medium p-3 rounded-xl hover:bg-blue-50 transition-colors">
                    <Download className="w-5 h-5" /> Fee Structure 2026-27
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Admissions;
