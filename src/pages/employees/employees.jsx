import { memo, useMemo } from 'react';
import { Paper, Text, Loader, Center } from '@mantine/core';
import DataTable from '../../components/DataTable/datatable';
import { useEmployee } from '../../hooks/useEmployee';
import ErrorBoundary from '../../components/ErrorBoundary';

const Employees = () => {
  const { employees, loading, error, columns, handleAddClick, handleViewClick, handleDeleteClick } = useEmployee();

  const processedData = useMemo(() => 
    Array.isArray(employees) 
      ? employees.map(emp => ({ ...emp, name: `${emp.first_name} ${emp.last_name}` }))
      : [], 
    [employees]);

  // if (loading) return <Center style={{ height: '400px' }}><Loader size="lg" /></Center>;
  // if (error) return <Paper p="md"><Text color="red">Error: {error.message || 'Failed to load employees'}</Text></Paper>;

  return (
    <ErrorBoundary>
      <Paper radius="md" p="lg">
        <DataTable 
          title={'Employees'} 
          data={processedData} 
          columns={columns} 
          onAddClick={handleAddClick} 
          onViewClick={handleViewClick} 
          onDeleteClick={handleDeleteClick}
          searchPlaceholder="Search employees..."
          isLoading={loading}
          error={error}
          hideMonthPicker={true}
        />
      </Paper>
    </ErrorBoundary>
  );
};

export default memo(Employees);
