import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  selectDesignations,
  selectLoading,
} from '../../store/slices/organisation/designationSlice';
import { fetchDesignations, deleteDesignation } from '../../store/actions/organisation/designation';

export const useDesignation = () => {
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');
  const designations = useSelector(selectDesignations);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    if (organizationId) {
      dispatch(fetchDesignations(organizationId));
    }
  }, [dispatch, organizationId]);

  const handleDelete = useCallback(async (id) => {
    try {
      await dispatch(deleteDesignation({ id, organizationId })).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Role deleted successfully',
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete role',
        color: 'red'
      });
    }
  }, [dispatch, organizationId]);

  const columns = useMemo(() => [
    {
      header: 'Role Name',
      accessor: 'name',
      render: (item) => <Text>{item.name || 'N/A'}</Text>,
    },
    {
      header: 'Department',
      accessor: 'department_name',
      render: (item) => <Text>{item.department_name || 'N/A'}</Text>,
    }
  ], []);

  return {
    designations: designations?.data || [],
    loading,
    columns,
    handleDelete
  };
}; 