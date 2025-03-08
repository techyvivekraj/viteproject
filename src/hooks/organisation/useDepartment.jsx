import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@mantine/core';
import { 
  selectDepartments, 
  selectLastFetch, 
  selectLoading 
} from '../../store/slices/organisation/deptSlice';
import { fetchDepartments, deleteDepartments } from '../../store/actions/organisation/dept';
import { showError } from '../../components/api';

export const useDepartment = () => {
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');
  const departments = useSelector(selectDepartments);
  const loading = useSelector(selectLoading);
  const lastFetch = useSelector(selectLastFetch);
  
  useEffect(() => {
    if (!lastFetch || Date.now() - lastFetch > 300000) {
      dispatch(fetchDepartments(organizationId));
    }
  }, [dispatch, lastFetch,organizationId]);

  // Process departments data to match the table structure
  const processedDepartments = useMemo(() => {
    if (!Array.isArray(departments?.data)) return [];
    
    return departments.data.map(dept => ({
      id: dept.id,
      departmentName: dept.name,
      noticePeriod: dept.noticePeriod || 0,
      leaves: {
        casualLeave: dept.casualLeave || 0,
        sickLeave: dept.sickLeave || 0,
        earnedLeave: dept.earnedLeave || 0,
        maternityLeave: dept.maternityLeave || 0,
        paternityLeave: dept.paternityLeave || 0
      }
    }));
  }, [departments]);

  const renderLeaveDetails = useCallback((item) => {
    const leaveTypes = [
      { key: 'casualLeave', label: 'CL', fullName: 'Casual Leave' },
      { key: 'sickLeave', label: 'SL', fullName: 'Sick Leave' },
      { key: 'earnedLeave', label: 'EL', fullName: 'Earned Leave' },
      { key: 'maternityLeave', label: 'ML', fullName: 'Maternity Leave' },
      { key: 'paternityLeave', label: 'PL', fullName: 'Paternity Leave' }
    ];

    const availableLeaves = leaveTypes
      .filter(leave => item.leaves?.[leave.key] > 0)
      .map(leave => `${leave.label}: ${item.leaves[leave.key]}`)
      .join(', ');

    return (
      <Text size="sm" title={leaveTypes
        .filter(leave => item.leaves?.[leave.key] > 0)
        .map(leave => `${leave.fullName}: ${item.leaves[leave.key]} days`)
        .join('\n')}
      >
        {availableLeaves || <span style={{ color: 'dimmed' }}>No leaves assigned</span>}
      </Text>
    );
  }, []);

  const columns = useMemo(() => [
    {
      header: 'Department Name',
      accessor: 'departmentName',
      render: (item) => <Text>{item.departmentName || 'N/A'}</Text>,
    },
    {
      header: 'Leave Details',
      accessor: 'leaves',
      render: renderLeaveDetails
    },
    {
      header: 'Notice Period',
      accessor: 'noticePeriod',
      render: (item) => <Text>{item.noticePeriod ? `${item.noticePeriod} days` : 'N/A'}</Text>,
    },
  ], [renderLeaveDetails]);

  const handleDelete = useCallback(async (deptId) => {
    try {
      await dispatch(deleteDepartments({ id: deptId, organizationId })).unwrap();
    } catch (error) {
            showError(error.message || 'Failed to delete department');
    }
  }, [dispatch, organizationId]);

  return {
    departments: processedDepartments,
    loading,
    columns,
    handleDelete
  };
}; 