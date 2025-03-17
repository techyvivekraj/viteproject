import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees, deleteEmployee } from '../store/actions/employees';
import { Badge, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { showToast, showError } from '../components/api';
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
  
  const employees = useSelector(selectEmployees);
  const loading = useSelector(selectEmployeesLoading);
  const error = useSelector(selectEmployeesError);
  const lastFetch = useSelector(selectLastFetch);

  useEffect(() => {
    if (!lastFetch || Date.now() - lastFetch > 300000) {
      dispatch(fetchEmployees(organizationId));
    }
  }, [dispatch, lastFetch, organizationId]);

  const columns = useMemo(() => [
    { 
      header: 'Employee Code', 
      accessor: 'employee_code',
      render: (item) => (
        <Text>{item.employee_code || 'N/A'}</Text>
      )
    },
    { 
      header: 'Employee Name', 
      accessor: 'name',
      render: (item) => (
        <Text fw={500}>{item.first_name || ''} {item.last_name || ''}</Text>
      )
    },
    { 
      header: 'Department', 
      accessor: 'department_name',
      render: (item) => (
        <Text>{item.department?.name || 'N/A'}</Text>
      )
    },
    { 
      header: 'Designation', 
      accessor: 'designation_name',
      render: (item) => (
        <Text>{item.designation?.name || 'N/A'}</Text>
      )
    },
    { 
      header: 'Email', 
      accessor: 'email',
      render: (item) => (
        <Text>{item.email || 'N/A'}</Text>
      )
    },
    { 
      header: 'Phone', 
      accessor: 'phone',
      render: (item) => (
        <Text>{item.phone || 'N/A'}</Text>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (item) => (
        <Badge color={item.status === 'active' ? 'green' : 'red'}>
          {item.status || 'N/A'}
        </Badge>
      ) 
    }
  ], []);

  const handleAddClick = useCallback(() => navigate('/employee/add'), [navigate]);
  
  const handleViewClick = useCallback((employee) => 
    navigate(`/employees/view/${employee.id}`), [navigate]);
  
  const handleDeleteClick = useCallback((employee) => {
    modals.openConfirmModal({
      title: 'Confirm Deletion',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this employee? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await dispatch(deleteEmployee(employee.id)).unwrap();
          showToast('Employee deleted successfully');
        } catch (error) {
          showError('Failed to delete employee');
        }
      }
    });
  }, [dispatch]);

  return { 
    employees, 
    loading, 
    error, 
    columns, 
    handleAddClick, 
    handleViewClick, 
    handleDeleteClick 
  };
};
