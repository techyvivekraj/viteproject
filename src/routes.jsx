import { Route, Routes } from 'react-router-dom';
import Login from '../features/login/login';
import Dashboard from '../features/dashboard/dashboard';
import Layout from '../layout/layout';
import Employee from '../features/employee/employee';
import ProtectedRoute from './PrivateRoute';
import Organisation from '../features/organisation/organisation';
import Expense from '../features/expense/expense';
import Payroll from '../features/payroll/payroll';
import Ticket from '../features/ticket/ticket';
import AddEmployee from '../features/employee/add_employee';
import Attendance from '../features/attendance/attendance';
import Overtime from '../features/overtime/overtime';
import Advance from '../features/advance/advance';
import Fines from '../features/fines/fines';
import Remark from '../features/remark/remark';
import ViewEmployee from '../features/employee/view_employee';
import EmployeeOvertime from '../features/overtime/employeeOvertime';

const Navigator = () => {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employee />} />
          <Route path="employee/add" element={<AddEmployee />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="overtime" element={<Overtime />} />
          <Route path="advance" element={<Advance />} />
          <Route path="fines" element={<Fines />} />
          <Route path="remark" element={<Remark />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="expense" element={<Expense />} />
         
          <Route path="ticket" element={<Ticket />} />
          <Route path="organisation" element={<Organisation />} />
          <Route path="employees/view/:id" element={<ViewEmployee />} />
          <Route path="/overtime/employee/:employeeId" element={<EmployeeOvertime />} />
        </Route>
      </Routes>
  );
};

export default Navigator;