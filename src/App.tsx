import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import AttendanceManagement from './pages/AttendanceManagement';
import ShiftManagement from './pages/ShiftManagement';
import Overtime from './pages/Overtime';
import Advance from './pages/Advance';
import AdvanceHistory from './pages/AdvanceHistory';
import Fines from './pages/Fines';
import FineHistory from './pages/FineHistory';
import Remark from './pages/Remark';
import RemarkHistory from './pages/RemarkHistory';
import Payroll from './pages/Payroll';
import PayslipPreview from './pages/PayslipPreview';
import Expenses from './pages/Expenses';
import Leave from './pages/Leave';
import LeaveHistory from './pages/LeaveHistory';
import Organisation from './pages/Organisation';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Ticket from './pages/Ticket';
import EmployeeDocuments from './pages/EmployeeDocuments';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import Offboarding from './pages/Offboarding';
import Recruitment from './pages/Recruitment';
import AddCandidate from './pages/AddCandidate';
import Training from './pages/Training';
import Performance from './pages/Performance';
import Settings from './pages/Settings';
import Help from './pages/Help';
import TaskManagement from './pages/TaskManagement';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/employees/add" element={<AddEmployee />} />
          <Route path="/employees/edit/:employeeId" element={<EditEmployee />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/attendance" element={<AttendanceManagement />} />
          <Route path="/shifts" element={<ShiftManagement />} />
          <Route path="/leaves" element={<Leave />} />
          <Route path="/leave/history/:employeeId" element={<LeaveHistory />} />
          <Route path="/overtime" element={<Overtime />} />
          <Route path="/advance" element={<Advance />} />
          <Route path="/advance/history/:employeeId" element={<AdvanceHistory />} />
          <Route path="/fines" element={<Fines />} />
          <Route path="/fines/history/:employeeId" element={<FineHistory />} />
          <Route path="/remarks" element={<Remark />} />
          <Route path="/remarks/history/:employeeId" element={<RemarkHistory />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/payroll/payslip/:employeeId/:month/:year" element={<PayslipPreview />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/organisation" element={<Organisation />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/empdocs" element={<EmployeeDocuments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/usermanagement" element={<UserManagement />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/recruitment/candidates/add" element={<AddCandidate />} />
          <Route path="/training" element={<Training />} />
          <Route path="/offboarding" element={<Offboarding />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/tasks" element={<TaskManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;