import { useCallback, useMemo } from 'react';
import { Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { useAsset } from '../../../hooks/organisation/useAsset';
import DataTable from '../../../components/DataTable/datatable';
import AddAsset from './add_assets';

export default function Assets() {
  const [opened, { open, close }] = useDisclosure(false);
  const { assets, loading, columns, handleDelete } = useAsset();

  const processedData = useMemo(() => 
    Array.isArray(assets) 
      ? assets.map(asset => ({ ...asset }))
      : [], 
    [assets]);

  const openDeleteModal = useCallback((assetId) => {
    modals.openConfirmModal({
      title: 'Confirm Deletion',
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
    <div>
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
    </div>
  );
}
