import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/routing/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Facilities from './pages/public/Facilities';
import Admissions from './pages/public/Admissions';
import Contact from './pages/public/Contact';
import Careers from './pages/public/Careers';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsAndConditions from './pages/public/TermsAndConditions';
import Login from './pages/auth/Login';


import ManagementDashboard from './pages/management/ManagementDashboard';
import ManageStudents from './pages/management/ManageStudents';
import ManageAttendance from './pages/management/ManageAttendance';
import ManageFees from './pages/management/ManageFees';
import ManageImages from './pages/management/ManageImages';
import ManageAnnouncements from './pages/management/ManageAnnouncements';
import ManageJobs from './pages/management/ManageJobs';
import ParentMessages from './pages/management/ParentMessages';
import TeacherDashboard from './pages/teacher/TeacherDashboard';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="contact" element={<Contact />} />
          <Route path="careers" element={<Careers />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsAndConditions />} />
        </Route>

        {/* Protected Teacher Workspace Route */}
        <Route element={<ProtectedRoute allowedRoles={['Teacher', 'Management', 'Admin']} />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        </Route>

        {/* Protected ERP & Management Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Management', 'Admin', 'Teacher', 'Accountant']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/management/dashboard" element={<ManagementDashboard />} />
            <Route path="/management/students" element={<ManageStudents />} />
            <Route path="/management/attendance" element={<ManageAttendance />} />
            <Route path="/management/fees" element={<ManageFees />} />
            <Route path="/management/images" element={<ManageImages />} />
            <Route path="/management/announcements" element={<ManageAnnouncements />} />
            <Route path="/management/jobs" element={<ManageJobs />} />
            <Route path="/management/messages" element={<ParentMessages />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
