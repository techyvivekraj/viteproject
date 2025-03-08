import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@mantine/core';
import {
  selectDesignations,
  selectLastFetch,
  selectLoading,
} from '../../store/slices/organisation/designationSlice';
import { fetchDesignations, deleteDesignation } from '../../store/actions/organisation/designation';
import { showError, showToast } from '../../components/api';

export const useDesignation = () => {
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');
  const designations = useSelector(selectDesignations);
  const loading = useSelector(selectLoading);
    const lastFetch = useSelector(selectLastFetch);

  useEffect(() => {
    if (!lastFetch || Date.now() - lastFetch > 300000) {
      dispatch(fetchDesignations(organizationId));
    }
  }, [dispatch, lastFetch, organizationId]);

  const handleDelete = useCallback(async (id) => {
    try {
      await dispatch(deleteDesignation({ id, organizationId })).unwrap();
      showToast('Role deleted successfully');
    } catch (error) {
      showError(error.message || 'Failed to delete role');
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