import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees } from '../store/actions/employees';
import { Badge } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
// import { showNotification } from '@mantine/notifications';
import {
  selectEmployees,
  selectEmployeesLoading,
  selectEmployeesError,
  selectLastFetch
} from '../store/slices/employeesSlice';

export const useEmployee = () => {
  
  const organizationId = localStorage.getItem('orgId');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [employeeToDelete, setEmployeeToDelete] = useState(null);
  // const [opened, { open, close }] = useDisclosure(false);

  const employees = useSelector(selectEmployees);
  const loading = useSelector(selectEmployeesLoading);
  const error = useSelector(selectEmployeesError);
  const lastFetch = useSelector(selectLastFetch);

  useEffect(() => {
    if (!lastFetch || Date.now() - lastFetch > 300000) {
      dispatch(fetchEmployees(organizationId));
    }
  }, [dispatch, lastFetch,organizationId]);

  const columns = useMemo(() => [
    { header: 'Employee Code', accessor: 'employee_code' },
    { header: 'Employee Name', accessor: 'first_name' },
    { header: 'Department', accessor: 'department_name' },
    { header: 'Designation', accessor: 'designation_name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Status', accessor: 'status', render: (item) => <Badge>{item.status}</Badge> }
  ], []);

  const handleAddClick = useCallback(() => navigate('/employee/add'), [navigate]);
  const handleViewClick = useCallback((employee) => navigate(`/employees/view/${employee.id}`), [navigate]);
  const handleDeleteClick = useCallback((employee) => {
    // setEmployeeToDelete(employee);
    console.log(employee)
    open();
  }, []);

  // const handleConfirmDelete = useCallback(async () => {
  //   if (!employeeToDelete) return;
  //   try {
  //     await dispatch(deleteEmployee(employeeToDelete.id)).unwrap();
  //     showNotification({ title: 'Success', message: 'Employee deleted', color: 'green' });
  //     close();
  //     setEmployeeToDelete(null);
  //   } catch (error) {
  //     showNotification({ title: 'Error', message: 'Failed to delete employee', color: 'red' });
  //   }
  // }, [dispatch, employeeToDelete, close]);

  return { employees, loading, error, columns, handleAddClick, handleViewClick, handleDeleteClick };
};
