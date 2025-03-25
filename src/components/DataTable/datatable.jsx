import PropTypes from 'prop-types';
import {
    ActionIcon,
    Box,
    Button,
    Divider,
    Group,
    Loader,
    Pagination,
    rem,
    Table,
    Text,
    TextInput,
    Stack,
    Center,
} from "@mantine/core";
import { IconPencil, IconPlus, IconTrash, IconArrowUp, IconArrowDown, IconEye, IconDatabaseOff } from "@tabler/icons-react";
import { MonthPickerInput } from "@mantine/dates"; // Import MonthPickerInput
import { useMemo, useState } from "react";

// Add NoData component
const NoData = () => (
    <Center p={50}>
        <Stack align="center" spacing="md">
            <IconDatabaseOff size={50} color="gray" opacity={0.5} />
            <Text size="lg" color="dimmed" align="center">
                No data available
            </Text>
            <Text size="sm" color="dimmed" align="center">
                There are no records to display at the moment
            </Text>
        </Stack>
    </Center>
);

const DataTable = ({
    title,
    data = [],
    columns,
    onAddClick,
    onEditClick,
    onViewClick,
    onDeleteClick,
    searchPlaceholder,
    isLoading,
    onMonthChange,
    onMonthClear,
    monthPickerPlaceholder,
    hideMonthPicker,
    hideHeader = false,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Sorting state
    const [selectedMonth, setSelectedMonth] = useState(null);
    const itemsPerPage = 10;

    // Search filter logic
    const filteredData = useMemo(() => {
        return data.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm]);

    // Sorting logic
    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                // Handle custom render column logic
                if (columns.find(col => col.accessor === sortConfig.key && col.render)) {
                    const column = columns.find(col => col.accessor === sortConfig.key);
                    const getValue = column?.sortBy ? column.sortBy(a) : a[sortConfig.key]; // Use sortBy function if available
                    const getBValue = column?.sortBy ? column.sortBy(b) : b[sortConfig.key];
                    return sortConfig.direction === 'asc' ? (getValue < getBValue ? -1 : 1) : (getValue > getBValue ? -1 : 1);
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig, columns]);

    // Paginated data
    const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const rows = paginatedData.map((item, index) => (
        <Table.Tr key={index}>
            {columns.map((column) => (
                <Table.Td key={column.accessor}>
                    {column.render ? column.render(item) : item[column.accessor]}
                </Table.Td>
            ))}
            <Table.Td>
                {/* Center the action buttons */}
                <Group gap={0} position="center">
                    {/* Conditional rendering for "View" action */}
                    {onViewClick && (
                        <ActionIcon variant="subtle" color="gray" onClick={() => onViewClick(item)}>
                            <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        </ActionIcon>
                    )}

                    {/* Conditional rendering for "Edit" action */}
                    {onEditClick && (
                        <ActionIcon variant="subtle" color="gray" onClick={() => onEditClick(item)}>
                            <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        </ActionIcon>
                    )}

                    {/* Conditional rendering for "Delete" action */}
                    {onDeleteClick && (
                        <ActionIcon variant="subtle" color="red" onClick={() => onDeleteClick(item)}>
                            <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        </ActionIcon>
                    )}
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
        if (onMonthChange) {
            onMonthChange(month);
        }
    };

    const handleMonthClear = () => {
        setSelectedMonth(null);
        if (onMonthClear) {
            onMonthClear();
        }
    };

    return (
        <Box>
            {/* Always show title, but conditionally show other header elements */}
            <Group position="apart" mb="md">
                <Text size="lg" weight={500} style={{ marginRight: 'auto' }}>
                    {title}
                </Text>
                {!hideHeader && (
                    <>
                        <Group>
                            <Button variant="light" onClick={onAddClick} leftSection={<IconPlus size={14} />}>
                                Add
                            </Button>
                            {!hideMonthPicker && (
                                <MonthPickerInput
                                    placeholder={monthPickerPlaceholder ?? "Pick a month"}
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                    style={{ minWidth: '150px' }}
                                    clearButtonProps={{
                                        'aria-label': 'Clear month selection',
                                        onClick: handleMonthClear,
                                    }}
                                    clearable
                                />
                            )}
                        </Group>
                        <TextInput
                            placeholder={searchPlaceholder || 'Search...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.currentTarget.value)}
                        />
                    </>
                )}
            </Group>
            {!hideHeader && <Divider variant="dashed" my="md" />}
            
            <Table.ScrollContainer minWidth={800}>
                {isLoading ? (
                    <Box style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '20px' }}>
                        <Loader />
                    </Box>
                ) : sortedData.length === 0 ? (
                    <NoData />
                ) : (
                    <Table verticalSpacing="sm" highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                {columns.map((column) => (
                                    <Table.Th key={column.accessor} onClick={() => handleSort(column.accessor)}>
                                        <Group spacing={4} position="apart">
                                            <Text>{column.header}</Text>
                                            {sortConfig.key === column.accessor && (
                                                sortConfig.direction === 'asc' ? (
                                                    <IconArrowUp size={16} />
                                                ) : (
                                                    <IconArrowDown size={16} />
                                                )
                                            )}
                                        </Group>
                                    </Table.Th>
                                ))}
                                <Table.Th>Action</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                )}
            </Table.ScrollContainer>
            {sortedData.length > 0 && (
                <Group position="apart" mt="md">
                    <Pagination
                        page={page}
                        onChange={setPage}
                        total={Math.ceil(sortedData.length / itemsPerPage)}
                    />
                </Group>
            )}
        </Box>
    );
};

// Add PropTypes validation after the component
DataTable.propTypes = {
    title: PropTypes.string,
    data: PropTypes.array,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            header: PropTypes.string.isRequired,
            accessor: PropTypes.string.isRequired,
            render: PropTypes.func,
            sortBy: PropTypes.func
        })
    ).isRequired,
    onAddClick: PropTypes.func,
    onEditClick: PropTypes.func,
    onViewClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    searchPlaceholder: PropTypes.string,
    isLoading: PropTypes.bool,
    onMonthChange: PropTypes.func,
    onMonthClear: PropTypes.func,
    monthPickerPlaceholder: PropTypes.string,
    hideMonthPicker: PropTypes.bool,
    hideHeader: PropTypes.bool,
    pagination: PropTypes.shape({
        total: PropTypes.number,
        page: PropTypes.number,
        onChange: PropTypes.func,
        limit: PropTypes.number
    })
};

// Add default props
DataTable.defaultProps = {
    data: [],
    hideHeader: false,
    hideMonthPicker: false,
    isLoading: false,
    title: ''
};

export default DataTable;