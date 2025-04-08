import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Paper, 
  Title, 
  Text, 
  Stack, 
  Alert,
  Container,
  Group,
  Divider,
  Card,
  Box,
  Grid,
  Progress,
} from '@mantine/core';
import { AlertTriangle, CheckCircle, Mail, Lock, User, Building, Phone } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const signUp = useAuthStore((state) => state.signUp);

  const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
    { re: /.{8,}/, label: 'At least 8 characters' },
  ];

  const strengthColors = [
    { value: 20, color: 'red' },
    { value: 40, color: 'orange' },
    { value: 60, color: 'yellow' },
    { value: 80, color: 'lime' },
    { value: 100, color: 'green' },
  ];

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const strength = requirements.filter(req => req.re.test(value)).length * 20;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const name = formData.get('name') as string;
    const organizationName = formData.get('organizationName') as string;
    const mobile = formData.get('mobile') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordStrength < 60) {
      setError('Password is not strong enough. Please meet the requirements.');
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password);
      setSuccess(true);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8f9fa' }}>
        <Container size="sm" style={{ width: '100%', maxWidth: '450px' }}>
          <Card radius="md" p="xl" withBorder>
            <Stack align="center" gap="lg">
              <Box mb="md">
                <Text size="xl" fw={700} c="blue">Your App</Text>
              </Box>
              <CheckCircle size={50} color="#4C6EF5" />
              <Title order={2} ta="center" fw={600}>Registration Successful!</Title>
              <Text ta="center" c="dimmed" size="md">
                Please check your email to verify your account. Once verified, you can log in to access your dashboard.
              </Text>
              <Button
                component={Link}
                to="/login"
                fullWidth
                size="md"
                radius="md"
                color="blue"
              >
                Go to Login
              </Button>
            </Stack>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8f9fa' }}>
      <Container size="md" style={{ width: '100%', maxWidth: '800px' }}>
        <Paper radius="md" p="xl" withBorder className="w-full">
          <Box mb="xl" ta="center">
            <Text size="xl" fw={700} c="blue">Your App</Text>
          </Box>
          
          <Title order={2} ta="center" mt="md" mb={30} fw={600}>
            Create your account
          </Title>

          <form onSubmit={handleSubmit}>
            <Stack>
              {error && (
                <Alert 
                  icon={<AlertTriangle size={16} />} 
                  title="Registration Error" 
                  color="red" 
                  variant="light"
                  radius="md"
                >
                  {error}
                </Alert>
              )}

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Full Name"
                    name="name"
                    placeholder="John Doe"
                    required
                    size="md"
                    radius="md"
                    leftSection={<User size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />}
                  />
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Organization Name"
                    name="organizationName"
                    placeholder="Acme Inc."
                    required
                    size="md"
                    radius="md"
                    leftSection={<Building size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Mobile Number"
                    name="mobile"
                    placeholder="+1234567890"
                    required
                    size="md"
                    radius="md"
                    leftSection={<Phone size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />}
                  />
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Email"
                    name="email"
                    placeholder="hello@example.com"
                    required
                    size="md"
                    radius="md"
                    leftSection={<Mail size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />}
                  />
                </Grid.Col>
              </Grid>

              <PasswordInput
                label="Password"
                name="password"
                placeholder="Your password"
                required
                size="md"
                radius="md"
                value={password}
                onChange={(event) => handlePasswordChange(event.currentTarget.value)}
                leftSection={<Lock size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />}
              />

              {password && (
                <Box mt="xs">
                  <Text size="sm" fw={500} mb={5}>Password strength:</Text>
                  <Progress 
                    value={passwordStrength} 
                    color={strengthColors.find(c => passwordStrength <= c.value)?.color || 'green'} 
                    size={5} 
                    radius="xl" 
                  />
                  <Stack gap="xs" mt="md">
                    {requirements.map((requirement, index) => (
                      <Group key={index} gap="xs">
                        {requirement.re.test(password) ? (
                          <Text size="sm" c="green">✓</Text>
                        ) : (
                          <Text size="sm" c="red">✗</Text>
                        )}
                        <Text size="sm">{requirement.label}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Box>
              )}

              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm your password"
                required
                size="md"
                radius="md"
                leftSection={<Lock size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />}
              />

              <Button 
                type="submit" 
                loading={loading} 
                fullWidth 
                mt="xl"
                size="md"
                radius="md"
                color="blue"
              >
                Create account
              </Button>

              <Divider label="or" labelPosition="center" my="md" />

              <Text ta="center" size="sm">
                Already have an account?{' '}
                <Link to="/login" style={{ 
                  color: 'var(--mantine-color-blue-6)', 
                  fontWeight: 500,
                  textDecoration: 'none'
                }}>
                  Sign in
                </Link>
              </Text>
            </Stack>
          </form>
        </Paper>
      </Container>
    </div>
  );
}