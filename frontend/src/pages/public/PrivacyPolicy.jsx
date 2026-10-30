import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-20 sm:py-24 px-4 text-center overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
            Legal & Compliance
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-300 max-w-3xl mx-auto text-base sm:text-lg font-normal leading-relaxed">
            Your privacy is important to us. Learn how we handle and safeguard your information at Master Mind Public School.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-10">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <ShieldCheck className="text-blue-600" /> Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Master Mind Public School ("we," "us," or "our") is committed to protecting the privacy and security of the personal information of our students, parents, staff, and website visitors. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Lock className="text-blue-600" /> Information We Collect
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>We may collect personal information that you voluntarily provide to us, including but not limited to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact information (name, email address, phone number, mailing address).</li>
                <li>Student records and academic information for admission purposes.</li>
                <li>Information provided through contact forms, recruitment forms, or enrollment applications.</li>
                <li>Payment information for fee processing (handled securely via third-party providers).</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Eye className="text-blue-600" /> How We Use Your Information
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>We use the collected information for various school-related purposes, such as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Processing admissions and maintaining student records.</li>
                <li>Communicating school updates, newsletters, and academic progress.</li>
                <li>Managing school administration and recruitment.</li>
                <li>Improving our website functionality and user experience.</li>
                <li>Complying with legal and regulatory requirements.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <FileText className="text-blue-600" /> Data Security & Sharing
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, loss, or misuse. We do not sell or rent your personal data to third parties.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Information may be shared with educational authorities or law enforcement only when required by law or as necessary for the safety and well-being of our school community.
            </p>
          </section>

          <section className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-900">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Changes to This Policy</h3>
            <p className="text-blue-800 text-sm italic">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
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

export default PrivacyPolicy;
