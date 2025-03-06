import { Paper, Title, Stack, Alert, Text, Group, Avatar, Box, Tabs } from '@mantine/core';
import { 
  IconCake, 
  IconFileDescription, 
  IconUserExclamation,
  IconGift,
  IconConfetti 
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import classes from './Notifications.module.css';

const birthdays = {
  today: [
    {
      name: 'Sarah Wilson',
      department: 'IT Department',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      name: 'Mike Ross',
      department: 'Finance',
      avatar: 'https://i.pravatar.cc/150?img=4'
    }
  ],
  upcoming: [
    {
      name: 'John Doe',
      department: 'HR Department',
      date: 'Jan 25',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      name: 'Mike Johnson',
      department: 'Finance',
      date: 'Jan 26',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    // ... other birthdays
  ]
};

const anniversaries = {
  today: [
    {
      name: 'Rachel Green',
      department: 'Sales',
      years: 5,
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
  ],
  upcoming: [
    {
      name: 'Ross Geller',
      department: 'IT Department',
      date: 'Jan 28',
      years: 3,
      avatar: 'https://i.pravatar.cc/150?img=6'
    },
    {
      name: 'Chandler Bing',
      department: 'Finance',
      date: 'Jan 30',
      years: 2,
      avatar: 'https://i.pravatar.cc/150?img=7'
    }
  ]
};

const notifications = [
  {
    title: 'Contract Expiring',
    message: '3 employee contracts are expiring this month',
    icon: IconFileDescription,
    color: 'red'
  },
  {
    title: 'Pending Reviews',
    message: '5 performance reviews pending for IT department',
    icon: IconUserExclamation,
    color: 'yellow'
  },
];

export default function Notifications() {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState('birthdays');

  useEffect(() => {
    if (isHovered) return;

    const scrollContainer = scrollRef.current;
    let animationId;
    let startTime;

    const scroll = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (scrollContainer) {
        scrollContainer.scrollTop = (progress / 50) % scrollContainer.scrollHeight;
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isHovered]);

  const renderCelebrations = (data, type) => (
    <Box 
      className={classes.scrollBox} 
      ref={scrollRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {data.today.length > 0 && (
        <>
          <Text fw={500} size="sm" c="dimmed" mb="xs">Today</Text>
          {data.today.map((item, index) => (
            <Group key={`today-${index}`} wrap="nowrap" mb="xs" className={classes.celebrationItem}>
              <Avatar src={item.avatar} size={40} radius="xl" />
              <div>
                <Text size="sm" fw={500}>{item.name}</Text>
                <Text size="xs" c="dimmed">
                  {item.department} {type === 'anniversary' && `• ${item.years} years`}
                </Text>
              </div>
              {type === 'birthday' ? 
                <IconCake size="1.2rem" className={classes.icon} style={{ color: 'var(--mantine-color-pink-6)' }} /> :
                <IconConfetti size="1.2rem" className={classes.icon} style={{ color: 'var(--mantine-color-yellow-6)' }} />
              }
            </Group>
          ))}
          <Text fw={500} size="sm" c="dimmed" mt="md" mb="xs">Upcoming</Text>
        </>
      )}
      {data.upcoming.map((item, index) => (
        <Group key={`upcoming-${index}`} wrap="nowrap" mb="xs" className={classes.celebrationItem}>
          <Avatar src={item.avatar} size={40} radius="xl" />
          <div>
            <Text size="sm" fw={500}>{item.name}</Text>
            <Text size="xs" c="dimmed">
              {item.department} • {item.date}
              {type === 'anniversary' && ` • ${item.years} years`}
            </Text>
          </div>
        </Group>
      ))}
    </Box>
  );

  return (
    <Paper withBorder p="md" radius="md">
      <Title order={2} size="h3" mb="md">Notifications & Alerts</Title>

      <Stack>
        {notifications.map((notification, index) => {
          const Icon = notification.icon;
          return (
            <Alert
              key={index}
              variant="light"
              color={notification.color}
              title={notification.title}
              icon={<Icon size="1.1rem" />}
            >
              <Text size="sm">{notification.message}</Text>
            </Alert>
          );
        })}

        <Paper withBorder p="xs" radius="md">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Group justify="space-between" mb="xs">
              <Tabs.List grow>
                <Tabs.Tab value="birthdays" leftSection={<IconCake size="1rem" />}>
                  Birthdays
                </Tabs.Tab>
                <Tabs.Tab value="anniversaries" leftSection={<IconGift size="1rem" />}>
                  Anniversaries
                </Tabs.Tab>
              </Tabs.List>
            </Group>

            <Tabs.Panel value="birthdays">
              {renderCelebrations(birthdays, 'birthday')}
            </Tabs.Panel>

            <Tabs.Panel value="anniversaries">
              {renderCelebrations(anniversaries, 'anniversary')}
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Stack>
    </Paper>
  );
} 