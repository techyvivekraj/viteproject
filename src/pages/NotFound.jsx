import { Button, Group, Text, Title, Stack, Paper, rem, Box, Container } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconHome, IconArrowLeft } from '@tabler/icons-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    
    <Paper p="xl" radius="md">
        <Stack align="center" spacing="xl">
          <Box style={{ position: 'relative', width: '100%', maxWidth: 500 }}>
            <Title 
              order={1} 
              size={rem(120)} 
              weight={900} 
              color="blue"
              style={{ 
                lineHeight: 1,
                textAlign: 'center',
              }}
            >
              404
            </Title>
          </Box>
          <Stack align="center" spacing="xs">
            <Title order={2} size={rem(32)} align="center">
              Oops! Page Not Found
            </Title>
            <Text 
              align="center" 
              color="dimmed" 
              size="lg" 
              maw={500}
              style={{ lineHeight: 1.6 }}
            >
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </Text>
          </Stack>
          <Group mt="md" gap="md">
            <Button
              size="md"
              variant="light"
              leftSection={<IconArrowLeft size={20} />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              size="md"
              leftSection={<IconHome size={20} />}
              onClick={() => navigate('/')}
            >
              Homepage
            </Button>
          </Group>
        </Stack>
      </Paper>
    
  );
} 