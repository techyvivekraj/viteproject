import { Grid, Paper, Text, Group, Stack, Divider, Button, Progress, Badge } from '@mantine/core';
import { IconDownload, IconReceipt, IconWallet, IconCreditCard, IconGift } from '@tabler/icons-react';

const PayrollOverview = () => {
  // Mock data - replace with actual data from your backend
  const payrollData = {
    currentMonth: 'March 2024',
    salary: {
      gross: 85000,
      net: 65000,
      deductions: {
        tax: 15000,
        insurance: 3000,
        retirement: 5000,
        other: 2000
      }
    },
    benefits: {
      healthInsurance: 5000,
      dentalInsurance: 2000,
      lifeInsurance: 3000,
      bonus: 5000,
      allowances: 3000
    },
    recentPayslips: [
      { month: 'February 2024', status: 'Paid', date: '2024-02-28' },
      { month: 'January 2024', status: 'Paid', date: '2024-01-31' },
      { month: 'December 2023', status: 'Paid', date: '2023-12-29' }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Grid gutter="md">
      {/* Salary Overview */}
      <Grid.Col span={12} md={8}>
        <Paper p="md" radius="sm" withBorder>
          <Stack spacing="md">
            <Group position="apart">
              <Text size="lg" fw={600}>Salary Overview</Text>
              <Badge color="blue">{payrollData.currentMonth}</Badge>
            </Group>
            <Divider />
            
            {/* Gross and Net Salary */}
            <Stack spacing="xs">
              <Group position="apart">
                <Text size="sm" c="dimmed">Gross Salary</Text>
                <Text fw={600}>{formatCurrency(payrollData.salary.gross)}</Text>
              </Group>
              <Group position="apart">
                <Text size="sm" c="dimmed">Net Salary</Text>
                <Text fw={600} color="green">{formatCurrency(payrollData.salary.net)}</Text>
              </Group>
            </Stack>

            {/* Deductions Breakdown */}
            <Stack spacing="md">
              <Text size="sm" fw={500}>Deductions</Text>
              <Stack spacing="xs">
                <Group position="apart">
                  <Text size="sm">Tax</Text>
                  <Text size="sm" c="red">{formatCurrency(payrollData.salary.deductions.tax)}</Text>
                </Group>
                <Progress value={(payrollData.salary.deductions.tax / payrollData.salary.gross) * 100} color="red" />
                
                <Group position="apart">
                  <Text size="sm">Insurance</Text>
                  <Text size="sm" c="red">{formatCurrency(payrollData.salary.deductions.insurance)}</Text>
                </Group>
                <Progress value={(payrollData.salary.deductions.insurance / payrollData.salary.gross) * 100} color="red" />
                
                <Group position="apart">
                  <Text size="sm">Retirement</Text>
                  <Text size="sm" c="red">{formatCurrency(payrollData.salary.deductions.retirement)}</Text>
                </Group>
                <Progress value={(payrollData.salary.deductions.retirement / payrollData.salary.gross) * 100} color="red" />
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Benefits and Recent Payslips */}
      <Grid.Col span={12} md={4}>
        <Stack spacing="md">
          {/* Benefits */}
          <Paper p="md" radius="sm" withBorder>
            <Stack spacing="md">
              <Group position="apart">
                <Text size="lg" fw={600}>Benefits</Text>
                <IconGift size={20} color="var(--mantine-color-green-6)" />
              </Group>
              <Divider />
              <Stack spacing="xs">
                <Group position="apart">
                  <Text size="sm">Health Insurance</Text>
                  <Text size="sm" color="green">{formatCurrency(payrollData.benefits.healthInsurance)}</Text>
                </Group>
                <Group position="apart">
                  <Text size="sm">Dental Insurance</Text>
                  <Text size="sm" color="green">{formatCurrency(payrollData.benefits.dentalInsurance)}</Text>
                </Group>
                <Group position="apart">
                  <Text size="sm">Life Insurance</Text>
                  <Text size="sm" color="green">{formatCurrency(payrollData.benefits.lifeInsurance)}</Text>
                </Group>
                <Group position="apart">
                  <Text size="sm">Bonus</Text>
                  <Text size="sm" color="green">{formatCurrency(payrollData.benefits.bonus)}</Text>
                </Group>
                <Group position="apart">
                  <Text size="sm">Allowances</Text>
                  <Text size="sm" color="green">{formatCurrency(payrollData.benefits.allowances)}</Text>
                </Group>
              </Stack>
            </Stack>
          </Paper>

          {/* Recent Payslips */}
          <Paper p="md" radius="sm" withBorder>
            <Stack spacing="md">
              <Group position="apart">
                <Text size="lg" fw={600}>Recent Payslips</Text>
                <IconReceipt size={20} color="var(--mantine-color-blue-6)" />
              </Group>
              <Divider />
              <Stack spacing="md">
                {payrollData.recentPayslips.map((payslip, index) => (
                  <Group key={index} position="apart">
                    <Stack spacing={0}>
                      <Text size="sm" fw={500}>{payslip.month}</Text>
                      <Text size="xs" c="dimmed">{payslip.date}</Text>
                    </Stack>
                    <Button 
                      variant="light" 
                      size="xs" 
                      leftIcon={<IconDownload size={14} />}
                    >
                      Download
                    </Button>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default PayrollOverview; 