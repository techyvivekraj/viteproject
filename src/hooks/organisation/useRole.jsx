import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@mantine/core';
import { 
  selectRoles, 
  selectLoading 
} from '../../store/slices/organisation/rolesSlice';
import { fetchRoles, deleteRole } from '../../store/actions/organisation/roles';

export const useRole = () => {
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');
  const roles = useSelector(selectRoles);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    if (organizationId) {
      dispatch(fetchRoles(organizationId));
    }
  }, [dispatch, organizationId]);

  const columns = useMemo(() => [
    {
      header: 'Role Name',
      accessor: 'roleName',
      render: (item) => <Text>{item.roleName || 'N/A'}</Text>,
    },
    {
      header: 'Department Name',
      accessor: 'departmentName',
      render: (item) => <Text>{item.departmentName || 'N/A'}</Text>,
    },
  ], []);

  const handleDelete = useCallback((roleId) => {
    dispatch(deleteRole(roleId));
  }, [dispatch]);

  return {
    roles,
    loading,
    columns,
    handleDelete
  };
}; 