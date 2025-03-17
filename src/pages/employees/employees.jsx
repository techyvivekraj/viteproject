import { memo, useMemo } from 'react';
import { Paper } from '@mantine/core';
import DataTable from '../../components/DataTable/datatable';
import { useEmployee } from '../../hooks/useEmployee';

const Employees = () => {
  const { employees, loading, error, columns, handleAddClick, handleViewClick, handleDeleteClick } = useEmployee();

  const processedData = useMemo(() => {
    if (!employees?.data || !Array.isArray(employees.data)) {
      return [];
    }
    
    return employees.data.map(emp => {
      // Log the employee data to see what's available
      console.log('Employee data:', emp);
      
      return {
        ...emp,
        id: emp.id,
        name: `${emp.first_name || ''} ${emp.last_name || ''}`.trim(),
        // Make sure we're accessing the department and designation data correctly
        department_name: emp?.department_name || 'N/A',
        designation_name: emp?.designation_name || 'N/A'
      };
    });
  }, [employees]);

  // if (loading) return <Center style={{ height: '400px' }}><Loader size="lg" /></Center>;
  // if (error) return <Paper p="md"><Text color="red">Error: {error.message || 'Failed to load employees'}</Text></Paper>;

  return (
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
  );
};

export default memo(Employees);
