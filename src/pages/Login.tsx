import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Paper, 
  Title, 
  Text, 
  Stack, 
  Container,
  Group,
  Checkbox,
  Box,
  useMantineTheme,
} from '@mantine/core';
import { Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export default function Login() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+$/.test(value)) return 'Invalid email address';
        return null;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      },
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    
    try {
      await signIn(values.email, values.password);
      notifications.show({
        title: 'Success',
        message: 'Welcome back!',
        color: 'green',
      });
      navigate('/');
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.message || 'Failed to sign in. Please check your credentials.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.colors.gray[0]} 0%, ${theme.colors.gray[1]} 100%)`,
      }}
    >
      <Container size="md">
        <Paper 
          radius="md" 
          p="xl" 
          withBorder
        >
          <Stack gap="lg">

            <Title 
              order={2} 
              ta="center" 
              mb="md"
              style={{
                color: theme.colors.gray[8],
                fontWeight: 600,
              }}
            >
              Welcome back
            </Title>

            <Text ta="center" c="dimmed" size="sm" mb="lg">
              Sign in to continue to your account
            </Text>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Email"
                  placeholder="hello@example.com"
                  {...form.getInputProps('email')}
                  leftSection={<Mail size={16} style={{ color: theme.colors.gray[5] }} />}
                  styles={{
                    input: {
                      '&:focus': {
                        borderColor: theme.colors.blue[6],
                      }
                    }
                  }}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  {...form.getInputProps('password')}
                  leftSection={<Lock size={16} style={{ color: theme.colors.gray[5] }} />}
                  styles={{
                    input: {
                      '&:focus': {
                        borderColor: theme.colors.blue[6],
                      }
                    }
                  }}
                />

                <Group justify="space-between" mt="xs">
                  <Checkbox 
                    label="Remember me" 
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.currentTarget.checked)}
                  />
                  <Text 
                    component={Link} 
                    to="/forgot-password" 
                    size="sm" 
                    c="blue"
                    style={{
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: theme.colors.blue[7],
                      }
                    }}
                  >
                    Forgot password?
                  </Text>
                </Group>

                <Button 
                  type="submit" 
                  loading={loading}
                  fullWidth 
                  mt="md"
                  size="md"
                  style={{
                    background: theme.colors.blue[6],
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                      background: theme.colors.blue[7],
                    }
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>

                <Text ta="center" size="sm" mt="md">
                  Don&apos;t have an account?{' '}
                  <Text 
                    component={Link} 
                    to="/register" 
                    c="blue"
                    style={{
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: theme.colors.blue[7],
                      }
                    }}
                  >
                    Register
                  </Text>
                </Text>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}