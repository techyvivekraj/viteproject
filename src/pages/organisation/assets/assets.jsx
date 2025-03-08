import { useCallback, useMemo } from 'react';
import { Text, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { useAsset } from '../../../hooks/organisation/useAsset';
import DataTable from '../../../components/DataTable/datatable';
import AddAsset from './add_assets';

export default function Assets() {
  const [opened, { open, close }] = useDisclosure(false);
  const { assets, loading, columns, handleDelete } = useAsset();
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const processedData = useMemo(() => 
    Array.isArray(assets) 
      ? assets.map(asset => ({
          id: asset.id,
          asset_name: asset.asset_name,
          purchase_date: formatDate(asset.purchase_date),
          conditionn: asset.conditionn,
          status: asset.status,
          assigned_to: asset.assigned_to,
          first_name: asset.first_name,
          last_name: asset.last_name
        }))
      : [], 
    [assets]);

  const openDeleteModal = useCallback((assetId) => {
    modals.openConfirmModal({
      title: 'Delete Asset',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this asset? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete Asset', cancel: 'Cancel' },
      withOverlay: true,
      draggable: true,
      radius: 'md',
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => handleDelete(assetId),
    });
  }, [handleDelete]);

  const handleEditClick = useCallback((item) => {
    console.log('Edit clicked', item);
    // Implement edit functionality
  }, []);


  return (
    <Paper shadow="xs" p="md">
      <DataTable
        title="Asset List"
        data={processedData}
        columns={columns}
        searchPlaceholder="Search assets..."
        pagination={true}
        onAddClick={open}
        onDeleteClick={(item) => openDeleteModal(item.id)}
        onEditClick={handleEditClick}
        isLoading={loading}
        hideMonthPicker={true}
      />
      <AddAsset opened={opened} closeModal={close} />
    </Paper>
  );
}
