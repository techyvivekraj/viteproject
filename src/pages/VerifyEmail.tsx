import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  Button,
  Alert,
  Box,
  Loader
} from '@mantine/core';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setError('No verification token found');
        setVerifying(false);
        return;
      }

      try {
        await verifyEmail(token);
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification failed');
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [searchParams, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8f9fa' }}>
      <Container size="sm" style={{ width: '100%', maxWidth: '450px' }}>
        <Paper radius="md" p="xl" withBorder>
          <Box mb="xl" ta="center">
            <Text size="xl" fw={700} c="blue">Your App</Text>
          </Box>
          
          <Stack align="center" gap="lg">
            <Title order={2} ta="center" fw={600}>
              Email Verification
            </Title>

            {verifying ? (
              <Stack align="center" gap="md">
                <Loader size="xl" color="blue" />
                <Text size="lg" ta="center">Verifying your email...</Text>
                <Text size="sm" c="dimmed" ta="center">
                  This may take a moment. Please don't close this window.
                </Text>
              </Stack>
            ) : error ? (
              <Stack align="center" gap="md">
                <Alert 
                  icon={<AlertTriangle size={16} />} 
                  title="Verification Error" 
                  color="red" 
                  variant="light"
                  radius="md"
                  w="100%"
                >
                  {error}
                </Alert>
                <Button
                  onClick={() => navigate('/login')}
                  fullWidth
                  size="md"
                  radius="md"
                  color="blue"
                >
                  Return to Login
                </Button>
              </Stack>
            ) : (
              <Stack align="center" gap="md">
                <CheckCircle size={50} color="#4C6EF5" />
                <Alert 
                  icon={<CheckCircle size={16} />} 
                  title="Success" 
                  color="green" 
                  variant="light"
                  radius="md"
                  w="100%"
                >
                  Your email has been verified successfully!
                </Alert>
                <Text ta="center" c="dimmed" size="md">
                  You can now log in to your account and access all features.
                </Text>
                <Button
                  onClick={() => navigate('/login')}
                  fullWidth
                  size="md"
                  radius="md"
                  color="blue"
                >
                  Continue to Login
                </Button>
              </Stack>
            )}
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}