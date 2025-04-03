import React, { useState, useMemo } from 'react';
import { Container, Stack, Button, Group, Paper, Text, Grid, Card, RingProgress, Select,} from '@mantine/core';
import { IconDownload, IconCash, IconFileSpreadsheet, IconPrinter, IconChartBar, IconReceipt, IconFilter } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import DataTable from '../../components/DataTable/datatable';
import * as XLSX from 'xlsx';
import { MonthPickerInput } from '@mantine/dates';

const Payroll = () => {
    // Mock data for demonstration
    const payrollData = [
        { 
            id: 1, 
            employee: 'John Doe',
            employeeId: 'EMP001',
            department: 'Engineering',
            designation: 'Senior Developer',
            basicSalary: 5000, 
            allowances: 1000,
            bonus: 500,
            commission: 200,
            grossSalary: 6700,
            deductions: {
                tax: 500,
                insurance: 200,
                providentFund: 300,
                other: 100
            },
            totalDeductions: 1100,
            netSalary: 5600, 
            status: 'Paid',
            paymentMethod: 'Direct Deposit',
            leaveDays: 2,
            date: new Date('2024-03-15')
        },
        { 
            id: 2, 
            employee: 'Jane Smith',
            employeeId: 'EMP002',
            department: 'Marketing',
            designation: 'Marketing Manager',
            basicSalary: 4500, 
            allowances: 800,
            bonus: 300,
            commission: 400,
            grossSalary: 6000,
            deductions: {
                tax: 450,
                insurance: 180,
                providentFund: 270,
                other: 90
            },
            totalDeductions: 990,
            netSalary: 5010, 
            status: 'Pending',
            paymentMethod: 'Direct Deposit',
            leaveDays: 0,
            date: new Date('2024-03-20')
        },
        { 
            id: 3, 
            employee: 'Mike Johnson',
            employeeId: 'EMP003',
            department: 'Sales',
            designation: 'Sales Executive',
            basicSalary: 6000, 
            allowances: 1200,
            bonus: 600,
            commission: 800,
            grossSalary: 8600,
            deductions: {
                tax: 600,
                insurance: 240,
                providentFund: 360,
                other: 120
            },
            totalDeductions: 1320,
            netSalary: 7280, 
            status: 'Paid',
            paymentMethod: 'Direct Deposit',
            leaveDays: 1,
            date: new Date('2024-03-25')
        },
        {
            id: 4,
            employee: 'Sarah Wilson',
            employeeId: 'EMP004',
            department: 'HR',
            designation: 'HR Manager',
            basicSalary: 5500,
            allowances: 900,
            bonus: 400,
            commission: 0,
            grossSalary: 6800,
            deductions: {
                tax: 550,
                insurance: 220,
                providentFund: 330,
                other: 110
            },
            totalDeductions: 1210,
            netSalary: 5590,
            status: 'Paid',
            paymentMethod: 'Direct Deposit',
            leaveDays: 0,
            date: new Date('2024-03-28')
        },
        {
            id: 5,
            employee: 'David Brown',
            employeeId: 'EMP005',
            department: 'Finance',
            designation: 'Financial Analyst',
            basicSalary: 4800,
            allowances: 750,
            bonus: 350,
            commission: 0,
            grossSalary: 5900,
            deductions: {
                tax: 480,
                insurance: 192,
                providentFund: 288,
                other: 96
            },
            totalDeductions: 1056,
            netSalary: 4844,
            status: 'Pending',
            paymentMethod: 'Direct Deposit',
            leaveDays: 1,
            date: new Date('2024-03-30')
        }
    ];

    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [statusFilter, setStatusFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');

    // Get unique departments for filter
    const departments = useMemo(() => {
        const uniqueDepts = [...new Set(payrollData.map(item => item.department))];
        return ['all', ...uniqueDepts];
    }, [payrollData]);

    const columns = [
        { 
            header: 'Employee', 
            accessor: 'employee',
            render: (item) => (
                <Stack spacing={0}>
                    <Text fw={500}>{item.employee}</Text>
                    <Text size="sm" c="dimmed">{item.employeeId}</Text>
                </Stack>
            )
        },
        { 
            header: 'Department', 
            accessor: 'department',
            render: (item) => (
                <Stack spacing={0}>
                    <Text>{item.department}</Text>
                    <Text size="sm" c="dimmed">{item.designation}</Text>
                </Stack>
            )
        },
        { 
            header: 'Gross Salary', 
            accessor: 'grossSalary',
            render: (item) => (
                <Stack spacing={0}>
                    <Text>${item.grossSalary.toLocaleString()}</Text>
                    <Text size="sm" c="dimmed">
                        Basic: ${item.basicSalary.toLocaleString()}
                    </Text>
                </Stack>
            )
        },
        { 
            header: 'Deductions', 
            accessor: 'totalDeductions',
            render: (item) => (
                <Stack spacing={0}>
                    <Text>${item.totalDeductions.toLocaleString()}</Text>
                    <Text size="sm" c="dimmed">
                        Tax: ${item.deductions.tax.toLocaleString()}
                    </Text>
                </Stack>
            )
        },
        { 
            header: 'Net Salary', 
            accessor: 'netSalary',
            render: (item) => `$${item.netSalary.toLocaleString()}`
        },
        { 
            header: 'Status', 
            accessor: 'status',
            render: (item) => (
                <span style={{ 
                    color: item.status === 'Paid' ? '#2ecc71' : '#f1c40f',
                    fontWeight: 500 
                }}>
                    {item.status}
                </span>
            )
        }
    ];

    // Filter data based on selected month and filters
    const filteredData = useMemo(() => {
        let filtered = [...payrollData];

        // Month filter
        if (selectedMonth) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.getMonth() === selectedMonth.getMonth() && 
                       itemDate.getFullYear() === selectedMonth.getFullYear();
            });
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        // Department filter
        if (departmentFilter !== 'all') {
            filtered = filtered.filter(item => item.department === departmentFilter);
        }

        return filtered;
    }, [payrollData, selectedMonth, statusFilter, departmentFilter]);

    // Calculate summary statistics
    const summaryStats = useMemo(() => {
        const totalGross = filteredData.reduce((sum, item) => sum + item.grossSalary, 0);
        const totalDeductions = filteredData.reduce((sum, item) => sum + item.totalDeductions, 0);
        const totalNet = filteredData.reduce((sum, item) => sum + item.netSalary, 0);
        const paidCount = filteredData.filter(item => item.status === 'Paid').length;
        const pendingCount = filteredData.filter(item => item.status === 'Pending').length;
        const totalEmployees = filteredData.length;

        return {
            totalGross,
            totalDeductions,
            totalNet,
            paidCount,
            pendingCount,
            totalEmployees,
            paidPercentage: (paidCount / totalEmployees) * 100
        };
    }, [filteredData]);

    const handleGeneratePayroll = () => {
        modals.openConfirmModal({
            title: 'Generate Payroll',
            children: (
                <Text size="sm">
                    This will generate payroll for all employees for the selected month. 
                    The process will calculate:
                    • Basic salary
                    • Allowances and bonuses
                    • Deductions (tax, insurance, etc.)
                    • Net salary
                    
                    Do you want to proceed?
                </Text>
            ),
            labels: { confirm: 'Generate', cancel: 'Cancel' },
            onConfirm: () => {
                // Simulate payroll generation
                setTimeout(() => {
                    notifications.show({
                        title: 'Payroll Generated',
                        message: 'Payroll has been generated successfully for all employees',
                        color: 'green'
                    });
                }, 1000);
            }
        });
    };

    const handleProcessPayments = () => {
        const pendingPayments = filteredData.filter(item => item.status === 'Pending').length;
        
        modals.openConfirmModal({
            title: 'Process Payments',
            children: (
                <Stack>
                    <Text size="sm">
                        This will process payments for {pendingPayments} pending payroll records.
                        The following actions will be taken:
                        • Initiate bank transfers
                        • Update payment status
                        • Record payment date
                        
                        Total amount to be processed: ${summaryStats.totalNet.toLocaleString()}
                    </Text>
                </Stack>
            ),
            labels: { confirm: 'Process Payments', cancel: 'Cancel' },
            confirmProps: { color: 'green' },
            onConfirm: () => {
                // Simulate payment processing
                setTimeout(() => {
                    notifications.show({
                        title: 'Payments Processed',
                        message: `Successfully processed payments for ${pendingPayments} employees`,
                        color: 'green'
                    });
                }, 1500);
            }
        });
    };

    const handleExportExcel = () => {
        // Prepare data for export
        const exportData = filteredData.map(item => ({
            'Employee ID': item.employeeId,
            'Employee Name': item.employee,
            'Department': item.department,
            'Designation': item.designation,
            'Basic Salary': item.basicSalary,
            'Allowances': item.allowances,
            'Bonus': item.bonus,
            'Commission': item.commission,
            'Gross Salary': item.grossSalary,
            'Tax': item.deductions.tax,
            'Insurance': item.deductions.insurance,
            'Provident Fund': item.deductions.providentFund,
            'Other Deductions': item.deductions.other,
            'Total Deductions': item.totalDeductions,
            'Net Salary': item.netSalary,
            'Status': item.status,
            'Payment Method': item.paymentMethod,
            'Leave Days': item.leaveDays,
            'Date': new Date(item.date).toLocaleDateString()
        }));

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Payroll');

        // Generate Excel file
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Create download link
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `payroll_${selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handlePrintPayslips = () => {
        const generatePayslipPDF = (employee) => {
            const doc = new jsPDF();
            
            // Add company header
            doc.setFontSize(20);
            doc.text('Company Name', 105, 20, { align: 'center' });
            doc.setFontSize(16);
            doc.text('Payslip', 105, 30, { align: 'center' });
            
            // Employee details
            doc.setFontSize(12);
            doc.text(`Employee: ${employee.employee}`, 20, 50);
            doc.text(`Employee ID: ${employee.employeeId}`, 20, 60);
            doc.text(`Department: ${employee.department}`, 20, 70);
            doc.text(`Designation: ${employee.designation}`, 20, 80);
            doc.text(`Period: ${new Date(employee.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`, 20, 90);
            
            // Earnings table
            const earningsData = [
                ['Earnings', 'Amount'],
                ['Basic Salary', `$${employee.basicSalary}`],
                ['Allowances', `$${employee.allowances}`],
                ['Bonus', `$${employee.bonus}`],
                ['Commission', `$${employee.commission}`],
                ['Gross Salary', `$${employee.grossSalary}`]
            ];
            
            doc.autoTable({
                startY: 100,
                head: [['Earnings', 'Amount']],
                body: earningsData.slice(1),
                theme: 'grid',
                headStyles: { fillColor: [71, 71, 71] }
            });
            
            // Deductions table
            const deductionsData = [
                ['Deductions', 'Amount'],
                ['Tax', `$${employee.deductions.tax}`],
                ['Insurance', `$${employee.deductions.insurance}`],
                ['Provident Fund', `$${employee.deductions.providentFund}`],
                ['Other', `$${employee.deductions.other}`],
                ['Total Deductions', `$${employee.totalDeductions}`]
            ];
            
            doc.autoTable({
                startY: doc.lastAutoTable.finalY + 10,
                head: [['Deductions', 'Amount']],
                body: deductionsData.slice(1),
                theme: 'grid',
                headStyles: { fillColor: [71, 71, 71] }
            });
            
            // Net Salary
            doc.setFontSize(14);
            doc.text(`Net Salary: $${employee.netSalary}`, 20, doc.lastAutoTable.finalY + 20);
            
            return doc;
        };

        modals.openConfirmModal({
            title: 'Print Payslips',
            children: (
                <Text size="sm">
                    This will generate payslips for all employees in the current view.
                    The payslips will include:
                    • Employee details
                    • Salary breakdown
                    • Deductions
                    • Net salary
                    
                    Do you want to proceed?
                </Text>
            ),
            labels: { confirm: 'Print', cancel: 'Cancel' },
            onConfirm: () => {
                // Generate and download payslips
                filteredData.forEach((employee, index) => {
                    const doc = generatePayslipPDF(employee);
                    if (filteredData.length === 1) {
                        doc.save(`payslip-${employee.employeeId}.pdf`);
                    } else {
                        doc.save(`payslip-${employee.employeeId}.pdf`);
                    }
                });

                notifications.show({
                    title: 'Payslips Generated',
                    message: `Successfully generated payslips for ${filteredData.length} employees`,
                    color: 'green'
                });
            }
        });
    };

    const handleView = (item) => {
        // Handle view payroll details
        console.log('View payroll:', item);
    };

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
    };

    const handleMonthClear = () => {
        setSelectedMonth(null);
    };

    return (
        <Paper radius="md" p={{ base: 'md', sm: 'xl' }} bg="var(--mantine-color-body)">
            <Stack spacing="xl">
                {/* Header Section with All Buttons */}
                <Group position="apart" align="center">
                    <Stack spacing={0}>
                        <Text size="xl" fw={700}>Payroll Management</Text>
                        <Text size="sm" c="dimmed">Manage and process employee payroll</Text>
                    </Stack>
                    <Group>
                        <Button 
                            leftIcon={<IconCash size={16} />} 
                            onClick={handleGeneratePayroll}
                            color="blue"
                            size="sm"
                        >
                            Generate Payroll
                        </Button>
                        <Button 
                            leftIcon={<IconCash size={16} />} 
                            onClick={handleProcessPayments}
                            color="green"
                            variant="light"
                            size="sm"
                        >
                            Process Payments
                        </Button>
                        <Button 
                            leftIcon={<IconFileSpreadsheet size={16} />} 
                            onClick={handleExportExcel}
                            variant="light"
                            size="sm"
                        >
                            Export Excel
                        </Button>
                        <Button 
                            leftIcon={<IconPrinter size={16} />} 
                            onClick={handlePrintPayslips}
                            variant="light"
                            size="sm"
                        >
                            Print Payslips
                        </Button>
                    </Group>
                </Group>

                {/* Filters Section */}
                <Paper withBorder p="md" radius="md">
                    <Group grow align="flex-start" spacing="md">
                        <MonthPickerInput
                            label="Month"
                            placeholder="Select month"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            clearButtonProps={{
                                'aria-label': 'Clear month selection',
                                onClick: handleMonthClear,
                            }}
                            clearable
                        />
                        <Select
                            label="Department"
                            placeholder="Select department"
                            data={departments}
                            value={departmentFilter}
                            onChange={setDepartmentFilter}
                        />
                        <Select
                            label="Status"
                            placeholder="Select status"
                            data={[
                                { value: 'all', label: 'All' },
                                { value: 'Paid', label: 'Paid' },
                                { value: 'Pending', label: 'Pending' }
                            ]}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        />
                    </Group>
                </Paper>

                {/* Summary Statistics */}
                <Grid gutter="md">
                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <Card withBorder p="md" radius="md" shadow="sm" h="100%">
                            <Stack align="center" spacing="xs">
                                <Text size="sm" c="dimmed">Total Gross Salary</Text>
                                <Text fw={700} size="xl">${summaryStats.totalGross.toLocaleString()}</Text>
                            </Stack>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <Card withBorder p="md" radius="md" shadow="sm" h="100%">
                            <Stack align="center" spacing="xs">
                                <Text size="sm" c="dimmed">Total Deductions</Text>
                                <Text fw={700} size="xl">${summaryStats.totalDeductions.toLocaleString()}</Text>
                            </Stack>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <Card withBorder p="md" radius="md" shadow="sm" h="100%">
                            <Stack align="center" spacing="xs">
                                <Text size="sm" c="dimmed">Total Net Salary</Text>
                                <Text fw={700} size="xl">${summaryStats.totalNet.toLocaleString()}</Text>
                            </Stack>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <Card withBorder p="md" radius="md" shadow="sm" h="100%">
                            <Stack align="center" spacing="xs">
                                <Text size="sm" c="dimmed">Payment Status</Text>
                                <Group position="center" spacing="xs">
                                    <RingProgress
                                        size={50}
                                        thickness={6}
                                        sections={[
                                            { value: summaryStats.paidPercentage, color: 'green' },
                                            { value: 100 - summaryStats.paidPercentage, color: 'yellow' }
                                        ]}
                                    />
                                    <Stack spacing={0}>
                                        <Text fw={700} size="lg">{summaryStats.paidCount}/{summaryStats.totalEmployees}</Text>
                                        <Text size="sm" c="dimmed">Paid</Text>
                                    </Stack>
                                </Group>
                            </Stack>
                        </Card>
                    </Grid.Col>
                </Grid>

                {/* Table Section */}
                <Paper withBorder p="md" radius="md">
                    <DataTable
                        title="Payroll Details"
                        data={filteredData}
                        columns={columns}
                        onViewClick={handleView}
                        onMonthChange={handleMonthChange}
                        onMonthClear={handleMonthClear}
                        monthPickerPlaceholder="Select Month"
                        searchPlaceholder="Search payroll..."
                        selectedMonth={selectedMonth}
                        hideActions={false}
                        hideHeader={true}
                    />
                </Paper>
            </Stack>
        </Paper>
    );
};

export default Payroll; 