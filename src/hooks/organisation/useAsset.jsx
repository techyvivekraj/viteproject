import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAssets } from '../../store/actions/organisation/assets';
import { Text } from '@mantine/core';
import {
  selectAssets,
  selectLoading,
  selectError,
  selectLastFetch
} from '../../store/slices/organisation/assetsSlice';

export const useAsset = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const organizationId = localStorage.getItem('orgId');
  const assets = useSelector(selectAssets) || [];
  const loading = useSelector(selectLoading) || false;
  const error = useSelector(selectError);
  const lastFetch = useSelector(selectLastFetch);

  useEffect(() => {
    if ((!lastFetch || Date.now() - lastFetch > 300000) && organizationId) {
      dispatch(fetchAssets(organizationId));
    }
  }, [dispatch, lastFetch, organizationId]);

  const columns = useMemo(() => [
    {
      header: 'Asset Name',
      accessor: 'assetName',
      render: (item) => <Text>{item.assetName || 'N/A'}</Text>,
    },
    {
      header: 'Asset Type',
      accessor: 'assetType',
      render: (item) => <Text>{item.assetType || 'N/A'}</Text>,
    },
    {
      header: 'Purchase Date',
      accessor: 'purchaseDate',
      render: (item) => <Text>{item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}</Text>,
    },
    {
      header: 'Condition',
      accessor: 'conditionn',
      render: (item) => <Text>{item.conditionn || 'N/A'}</Text>,
    },
    {
      header: 'Assigned To',
      accessor: 'assignedTo',
      render: (item) => <Text style={{ color: !item.assignedTo ? 'green' : 'initial' }}>{item.assignedTo || 'Available'}</Text>,
    },
    {
      header: 'Department',
      accessor: 'departmentName',
      render: (item) => <Text>{item.departmentName || 'N/A'}</Text>,
    },
  ], []);

  const handleAddClick = useCallback(() => navigate('/asset/add'), [navigate]);
  const handleViewClick = useCallback((asset) => navigate(`/assets/view/${asset.id}`), [navigate]);
  const handleEditClick = useCallback((asset) => navigate(`/assets/edit/${asset.id}`), [navigate]);

  return {
    assets,
    loading,
    error,
    columns,
    handleAddClick,
    handleViewClick,
    handleEditClick
  };
}; 