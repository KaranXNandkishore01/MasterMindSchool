import { Scale, FileCheck, AlertCircle, Info } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-blue-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight uppercase">Terms & Conditions</h1>
        <p className="text-blue-200 max-w-3xl mx-auto text-lg md:text-xl font-light">
          Agreement and guidelines for using the services of Master Mind Public School.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-10">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Scale className="text-blue-600" /> Terms of Use
            </h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using the Master Mind Public School website, you agree to comply with and be bound by the following terms and conditions. If you do not agree with any part of these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <FileCheck className="text-blue-600" /> Academic & Admission Rules
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>Users and students agree to adhere to the following academic guidelines:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Admission is subject to the school's criteria and availability of seats.</li>
                <li>Falsification of documents during admission will lead to immediate cancellation of enrollment.</li>
                <li>All students must follow the school's code of conduct and discipline policies.</li>
                <li>Fees once paid are non-refundable, except as per the school's specific refund policy.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <AlertCircle className="text-blue-600" /> Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, is the property of Master Mind Public School and is protected by intellectual property laws. Unauthorized reproduction or distribution is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Info className="text-blue-600" /> Limitation of Liability
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Master Mind Public School strives to provide accurate and up-to-date information on this website. However, we do not guarantee the completeness or accuracy of all content.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We shall not be liable for any direct or indirect damages arising out of your use of this website or inability to access our services.
            </p>
          </section>

          <section className="bg-yellow-50 p-6 rounded-2xl border-l-4 border-yellow-500">
            <h3 className="text-lg font-bold text-yellow-900 mb-2">Governing Law</h3>
            <p className="text-yellow-800 text-sm italic">
              These terms and conditions are governed by the laws of India. Any disputes arising from these terms will be subject to the jurisdiction of the courts in Pipariya, Madhya Pradesh.
            </p>
          </section>

          <div className="pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">Last Updated: March 2026</p>
            <p className="text-gray-500 text-sm mt-2">© Master Mind Public School, Pipariya</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
