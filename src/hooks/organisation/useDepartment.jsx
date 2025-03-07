import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@mantine/core';
import { 
  selectDepartments, 
  selectLoading 
} from '../../store/slices/organisation/deptSlice';
import { fetchDepartments, deleteDepartments } from '../../store/actions/organisation/dept';

export const useDepartment = () => {
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');
  const departments = useSelector(selectDepartments || []);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    if (organizationId) {
      dispatch(fetchDepartments(organizationId));
    }
  }, [dispatch, organizationId]);

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
    // {
    //   header: 'Leave Details',
    //   accessor: 'leaves',
    //   render: renderLeaveDetails
    // },
    {
      header: 'Notice Period',
      accessor: 'noticePeriod',
      render: (item) => <Text>{item.noticePeriod ? `${item.noticePeriod} days` : 'N/A'}</Text>,
    },
  ], [renderLeaveDetails]);

  const handleDelete = useCallback((deptId) => {
    dispatch(deleteDepartments(deptId));
  }, [dispatch]);

  return {
    departments,
    loading,
    columns,
    handleDelete
  };
}; 