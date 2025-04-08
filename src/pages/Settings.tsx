import React, { useState } from 'react';
import {
  Title,
  Paper,
  Stack,
  Tabs,
  TextInput,
  Button,
  Switch,
  Select,
  Group,
  Text,
  Alert,
  LoadingOverlay,
  PasswordInput,
  ColorInput,
  FileInput,
  Image,
  Badge,
  Container,
  Divider,
  rem,
} from '@mantine/core';
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  Mail,
  Globe,
  Palette,
  Shield,
  Users,
  Building,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useOrganizationStore } from '../store/organization';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<string | null>('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const userRole = useOrganizationStore((state) => state.userRole);
  const isAdmin = userRole === 'owner' || userRole === 'admin';

  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Acme Corporation',
    email: 'admin@acme.com',
    phone: '+1 234 567 890',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    language: 'English',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
    systemAlerts: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    ipWhitelist: '',
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: '#228BE6',
    logo: null as File | null,
  });

  const handleSaveSettings = async (settingsType: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(`${settingsType} settings updated successfully`);
    } catch (error) {
      setError(`Failed to update ${settingsType} settings`);
    } finally {
      setLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <Stack gap="md">
      {error && (
        <Alert
          icon={<AlertTriangle size={16} />}
          title="Error"
          color="red"
          variant="light"
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          icon={<AlertTriangle size={16} />}
          title="Success"
          color="green"
          variant="light"
        >
          {success}
        </Alert>
      )}

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Text fw={500} size="lg">Company Information</Text>
          <TextInput
            label="Company Name"
            value={generalSettings.companyName}
            onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.currentTarget.value })}
            required
          />
          <TextInput
            label="Email"
            value={generalSettings.email}
            onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.currentTarget.value })}
            required
          />
          <TextInput
            label="Phone"
            value={generalSettings.phone}
            onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.currentTarget.value })}
            required
          />
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Text fw={500} size="lg">Regional Settings</Text>
          <Select
            label="Timezone"
            value={generalSettings.timezone}
            onChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value || '' })}
            data={['UTC-8', 'UTC-5', 'UTC+0', 'UTC+5:30']}
            required
          />
          <Select
            label="Date Format"
            value={generalSettings.dateFormat}
            onChange={(value) => setGeneralSettings({ ...generalSettings, dateFormat: value || '' })}
            data={['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']}
            required
          />
          <Select
            label="Language"
            value={generalSettings.language}
            onChange={(value) => setGeneralSettings({ ...generalSettings, language: value || '' })}
            data={['English', 'Spanish', 'French', 'German']}
            required
          />
        </Stack>
      </Paper>

      <Group justify="flex-end" mt="md">
        <Button onClick={() => handleSaveSettings('General')} loading={loading}>
          Save Changes
        </Button>
      </Group>
    </Stack>
  );

  const renderNotificationSettings = () => (
    <Stack gap="md">
      {error && (
        <Alert
          icon={<AlertTriangle size={16} />}
          title="Error"
          color="red"
          variant="light"
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          icon={<AlertTriangle size={16} />}
          title="Success"
          color="green"
          variant="light"
        >
          {success}
        </Alert>
      )}

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Text fw={500} size="lg">Notification Preferences</Text>
          <Switch
            label="Email Notifications"
            checked={notificationSettings.emailNotifications}
            onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.currentTarget.checked })}
          />
          <Switch
            label="Push Notifications"
            checked={notificationSettings.pushNotifications}
            onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.currentTarget.checked })}
          />
          <Switch
            label="Weekly Reports"
            checked={notificationSettings.weeklyReports}
            onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReports: e.currentTarget.checked })}
          />
          <Switch
            label="Monthly Reports"
            checked={notificationSettings.monthlyReports}
            onChange={(e) => setNotificationSettings({ ...notificationSettings, monthlyReports: e.currentTarget.checked })}
          />
          <Switch
            label="System Alerts"
            checked={notificationSettings.systemAlerts}
            onChange={(e) => setNotificationSettings({ ...notificationSettings, systemAlerts: e.currentTarget.checked })}
          />
        </Stack>
      </Paper>

      <Group justify="flex-end" mt="md">
        <Button onClick={() => handleSaveSettings('Notification')} loading={loading}>
          Save Changes
        </Button>
      </Group>
    </Stack>
  );

  const renderSecuritySettings = () => (
    <Stack gap="md">
      {error && (
        <Alert
          icon={<AlertTriangle size={16} />}
          title="Error"
          color="red"
          variant="light"
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          icon={<AlertTriangle size={16} />}
          title="Success"
          color="green"
          variant="light"
        >
          {success}
        </Alert>
      )}

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Text fw={500} size="lg">Authentication</Text>
          <Switch
            label="Two-Factor Authentication"
            checked={securitySettings.twoFactorAuth}
            onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.currentTarget.checked })}
          />
          <Select
            label="Session Timeout (minutes)"
            value={securitySettings.sessionTimeout}
            onChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value || '' })}
            data={['15', '30', '60', '120']}
            required
          />
          <Select
            label="Password Expiry (days)"
            value={securitySettings.passwordExpiry}
            onChange={(value) => setSecuritySettings({ ...securitySettings, passwordExpiry: value || '' })}
            data={['30', '60', '90', '180']}
            required
          />
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Text fw={500} size="lg">Access Control</Text>
          <TextInput
            label="IP Whitelist"
            value={securitySettings.ipWhitelist}
            onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelist: e.currentTarget.value })}
            placeholder="Enter IP addresses separated by commas"
          />
        </Stack>
      </Paper>

      <Group justify="flex-end" mt="md">
        <Button onClick={() => handleSaveSettings('Security')} loading={loading}>
          Save Changes
        </Button>
      </Group>
    </Stack>
  );

  const renderAppearanceSettings = () => (
    <Stack gap="md">
      {error && (
        <Alert
          icon={<AlertTriangle size={16} />}
          title="Error"
          color="red"
          variant="light"
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          icon={<AlertTriangle size={16} />}
          title="Success"
          color="green"
          variant="light"
        >
          {success}
        </Alert>
      )}

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Text fw={500} size="lg">Theme Settings</Text>
          <Select
            label="Theme"
            value={appearanceSettings.theme}
            onChange={(value) => setAppearanceSettings({ ...appearanceSettings, theme: value || '' })}
            data={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'System' },
            ]}
            required
          />
          <ColorInput
            label="Primary Color"
            value={appearanceSettings.primaryColor}
            onChange={(value) => setAppearanceSettings({ ...appearanceSettings, primaryColor: value })}
            required
          />
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Text fw={500} size="lg">Branding</Text>
          <FileInput
            label="Company Logo"
            placeholder="Upload logo"
            accept="image/*"
            onChange={(file) => setAppearanceSettings({ ...appearanceSettings, logo: file })}
          />
          {appearanceSettings.logo && (
            <Image
              src={URL.createObjectURL(appearanceSettings.logo)}
              alt="Company logo preview"
              w={200}
              h={100}
              fit="contain"
            />
          )}
        </Stack>
      </Paper>

      <Group justify="flex-end" mt="md">
        <Button onClick={() => handleSaveSettings('Appearance')} loading={loading}>
          Save Changes
        </Button>
      </Group>
    </Stack>
  );

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <Title order={2}>Settings</Title>
          <Badge size="lg" variant="light">Administrator Access</Badge>
        </Group>

        <Paper withBorder radius="md" p="md">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List grow>
              <Tabs.Tab
                value="general"
                leftSection={<SettingsIcon style={{ width: rem(16), height: rem(16) }} />}
              >
                General
              </Tabs.Tab>
              <Tabs.Tab
                value="notifications"
                leftSection={<Bell style={{ width: rem(16), height: rem(16) }} />}
              >
                Notifications
              </Tabs.Tab>
              <Tabs.Tab
                value="security"
                leftSection={<Lock style={{ width: rem(16), height: rem(16) }} />}
              >
                Security
              </Tabs.Tab>
              <Tabs.Tab
                value="appearance"
                leftSection={<Palette style={{ width: rem(16), height: rem(16) }} />}
              >
                Appearance
              </Tabs.Tab>
            </Tabs.List>

            <Divider my="md" />

            <LoadingOverlay visible={loading} />

            <Tabs.Panel value="general" pt="xl">
              {renderGeneralSettings()}
            </Tabs.Panel>

            <Tabs.Panel value="notifications" pt="xl">
              {renderNotificationSettings()}
            </Tabs.Panel>

            <Tabs.Panel value="security" pt="xl">
              {renderSecuritySettings()}
            </Tabs.Panel>

            <Tabs.Panel value="appearance" pt="xl">
              {renderAppearanceSettings()}
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Stack>
    </Container>
  );
} 