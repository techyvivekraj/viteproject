import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Title,
  Paper,
  Group,
  Stack,
  Text,
  Badge,
  Button,
  Avatar,
  Grid,
  Card,
  Table,
  Alert,
  Divider,
} from '@mantine/core';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Receipt,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { usePayrollStore } from '../store/payroll';

// Mock company data (in a real app, this would come from your configuration)
const companyData = {
  name: 'Acme Corporation',
  logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=acme',
  address: '123 Business Street, Tech City, 12345',
  email: 'payroll@acme.com',
  phone: '+1 234 567 890',
  website: 'www.acme.com',
};

export default function PayslipPreview() {
  const { employeeId, month, year } = useParams();
  const navigate = useNavigate();
  const { 
    payslips,
    loading,
    approvePayslip,
    markPayslipAsPaid,
  } = usePayrollStore();

  if (!employeeId || !month || !year) {
    navigate('/payroll');
    return null;
  }

  const payslip = payslips.find(p => 
    p.employeeId === employeeId && 
    p.month === month && 
    p.year === year
  );

  if (!payslip) {
    navigate('/payroll');
    return null;
  }

  const handleApprove = async () => {
    await approvePayslip(payslip.id);
  };

  const handleMarkAsPaid = async () => {
    await markPayslipAsPaid(payslip.id);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    console.log('Downloading payslip...');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'yellow',
      approved: 'blue',
      paid: 'green',
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 size={16} />;
      case 'approved':
        return <Clock size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  return (
    <Stack gap="lg">
      <Group>
        <Button
          variant="light"
          leftSection={<ArrowLeft size={16} />}
          onClick={() => navigate('/payroll')}
        >
          Back to Payroll
        </Button>
      </Group>

      <Paper withBorder p="xl" radius="md" className="payslip-container">
        {/* Header */}
        <Group justify="space-between" mb="xl">
          <Group>
            <Avatar
              size={80}
              radius={80}
              src={companyData.logo}
            />
            <div>
              <Title order={2}>{companyData.name}</Title>
              <Stack gap="xs" mt="xs">
                <Group gap="xs">
                  <MapPin size={14} />
                  <Text size="sm">{companyData.address}</Text>
                </Group>
                <Group gap="xs">
                  <Mail size={14} />
                  <Text size="sm">{companyData.email}</Text>
                </Group>
                <Group gap="xs">
                  <Phone size={14} />
                  <Text size="sm">{companyData.phone}</Text>
                </Group>
              </Stack>
            </div>
          </Group>
          <Stack align="flex-end">
            <Title order={3}>Payslip</Title>
            <Text>{`${month}/${year}`}</Text>
            <Badge
              color={getStatusColor(payslip.status)}
              size="lg"
              leftSection={getStatusIcon(payslip.status)}
            >
              {payslip.status.toUpperCase()}
            </Badge>
          </Stack>
        </Group>

        <Divider my="lg" />

        {/* Employee Details */}
        <Grid mb="xl">
          <Grid.Col span={6}>
            <Card withBorder>
              <Title order={4} mb="md">Employee Details</Title>
              <Stack gap="xs">
                <Group>
                  <Text fw={500}>Name:</Text>
                  <Text>{payslip.employeeName}</Text>
                </Group>
                <Group>
                  <Text fw={500}>Department:</Text>
                  <Text>{payslip.department}</Text>
                </Group>
                <Group>
                  <Text fw={500}>Employee ID:</Text>
                  <Text>{payslip.employeeId}</Text>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col span={6}>
            <Card withBorder>
              <Title order={4} mb="md">Payment Details</Title>
              <Stack gap="xs">
                <Group>
                  <Text fw={500}>Payment Date:</Text>
                  <Text>{payslip.paidOn ? new Date(payslip.paidOn).toLocaleDateString() : 'Pending'}</Text>
                </Group>
                <Group>
                  <Text fw={500}>Payment Mode:</Text>
                  <Text>Bank Transfer</Text>
                </Group>
                <Group>
                  <Text fw={500}>Payment Period:</Text>
                  <Text>{`${month}/${year}`}</Text>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Earnings & Deductions */}
        <Grid mb="xl">
          <Grid.Col span={6}>
            <Card withBorder>
              <Title order={4} mb="md">Earnings</Title>
              <Table>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>Basic Salary</Table.Td>
                    <Table.Td align="right">${payslip.earnings.basic.toLocaleString()}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>HRA</Table.Td>
                    <Table.Td align="right">${payslip.earnings.hra.toLocaleString()}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Medical Allowance</Table.Td>
                    <Table.Td align="right">${payslip.earnings.medical.toLocaleString()}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Transport Allowance</Table.Td>
                    <Table.Td align="right">${payslip.earnings.transport.toLocaleString()}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Special Allowance</Table.Td>
                    <Table.Td align="right">${payslip.earnings.special.toLocaleString()}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Overtime</Table.Td>
                    <Table.Td align="right">${payslip.earnings.overtime.toLocaleString()}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Bonus</Table.Td>
                    <Table.Td align="right">${payslip.earnings.bonus.toLocaleString()}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Other Earnings</Table.Td>
                    <Table.Td align="right">${payslip.earnings.other.toLocaleString()}</Table.Td>
                  </Table.Tr>
                  <Table.Tr style={{ borderTop: '2px solid var(--mantine-color-gray-3)' }}>
                    <Table.Td fw={700}>Total Earnings</Table.Td>
                    <Table.Td align="right" fw={700}>${payslip.totalEarnings.toLocaleString()}</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Card>
          </Grid.Col>
          <Grid.Col span={6}>
            <Card withBorder>
              <Title order={4} mb="md">Deductions</Title>
              <Table>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>Provident Fund</Table.Td>
                    <Table.Td align="right">${payslip.deductions.pf.toLocaleString()}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Tax</Table.Td>
                    <Table.Td align="right">${payslip.deductions.tax.toLocaleString()}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Insurance</Table.Td>
                    <Table.Td align="right">${payslip.deductions.insurance.toLocaleString()}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Advance</Table.Td>
                    <Table.Td align="right">${payslip.deductions.advance.toLocaleString()}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Fines</Table.Td>
                    <Table.Td align="right">${payslip.deductions.fines.toLocaleString()}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Other Deductions</Table.Td>
                    <Table.Td align="right">${payslip.deductions.other.toLocaleString()}</Table.Td>
                  </Table.Tr>
                  <Table.Tr style={{ borderTop: '2px solid var(--mantine-color-gray-3)' }}>
                    <Table.Td fw={700}>Total Deductions</Table.Td>
                    <Table.Td align="right" fw={700}>${payslip.totalDeductions.toLocaleString()}</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Net Payable */}
        <Card withBorder mb="xl">
          <Group justify="space-between">
            <Title order={3}>Net Payable</Title>
            <Text size="xl" fw={700}>${payslip.netPayable.toLocaleString()}</Text>
          </Group>
        </Card>

        {/* Actions */}
        <Group justify="space-between">
          <Group>
            <Button
              variant="light"
              leftSection={<Download size={16} />}
              onClick={handleDownload}
            >
              Download PDF
            </Button>
            <Button
              variant="light"
              leftSection={<Printer size={16} />}
              onClick={handlePrint}
            >
              Print
            </Button>
          </Group>
          {payslip.status === 'draft' && (
            <Button
              color="blue"
              leftSection={<Receipt size={16} />}
              onClick={handleApprove}
              loading={loading}
            >
              Approve Payslip
            </Button>
          )}
          {payslip.status === 'approved' && (
            <Button
              color="green"
              leftSection={<CheckCircle2 size={16} />}
              onClick={handleMarkAsPaid}
              loading={loading}
            >
              Mark as Paid
            </Button>
          )}
        </Group>
      </Paper>

      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .payslip-container, .payslip-container * {
              visibility: visible;
            }
            .payslip-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style>
    </Stack>
  );
}