import { Paper, Title, RingProgress, Group, Text, Stack, List } from '@mantine/core';
import { IconCertificate, IconAlertTriangle } from '@tabler/icons-react';
import classes from './ComplianceTracker.module.css';

const complianceData = {
  overall: 85,
  urgent: [
    { title: 'Safety Training', dueDate: '2024-01-30', department: 'Operations' },
    { title: 'Data Privacy Certification', dueDate: '2024-02-05', department: 'IT' },
  ],
  upcoming: [
    { title: 'Annual Compliance Review', dueDate: '2024-03-15', department: 'All' },
    { title: 'Sexual Harassment Training', dueDate: '2024-02-28', department: 'All' },
  ]
};

export default function ComplianceTracker() {
  return (
    <Paper withBorder radius="md" p="md">
      <Title order={2} size="h3" mb="md">Compliance & Training</Title>
      
      <Group align="flex-start">
        <RingProgress
          size={140}
          roundCaps
          thickness={8}
          sections={[{ value: complianceData.overall, color: 'blue' }]}
          label={
            <Text ta="center" fz="lg" fw={700}>
              {complianceData.overall}%
            </Text>
          }
        />
        
        <Stack style={{ flex: 1 }}>
          <div>
            <Text fw={700} mb="xs" c="red">Urgent Actions</Text>
            <List spacing="xs" size="sm" center icon={<IconAlertTriangle size="1rem" color="red" />}>
              {complianceData.urgent.map((item, index) => (
                <List.Item key={index}>
                  <Text size="sm">{item.title}</Text>
                  <Text size="xs" c="dimmed">Due: {item.dueDate} • {item.department}</Text>
                </List.Item>
              ))}
            </List>
          </div>
          
          <div>
            <Text fw={700} mb="xs">Upcoming</Text>
            <List spacing="xs" size="sm" center icon={<IconCertificate size="1rem" />}>
              {complianceData.upcoming.map((item, index) => (
                <List.Item key={index}>
                  <Text size="sm">{item.title}</Text>
                  <Text size="xs" c="dimmed">Due: {item.dueDate} • {item.department}</Text>
                </List.Item>
              ))}
            </List>
          </div>
        </Stack>
      </Group>
    </Paper>
  );
} 