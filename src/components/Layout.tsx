import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  IconMenu2, 
  IconMoonFilled, 
  IconLogout,
  IconHome2,
  IconUsersGroup,
  IconCalendar,
  IconClockDollar,
  IconMoneybag,
  IconGavel,
  IconFlagDiscount,
  IconReceiptRupee,
  IconBuildingBank,
  IconTicket,
  IconBrandGoogleDrive,
  IconFileAnalytics,
  IconBuilding,
  IconTimelineEvent,
  IconUserSearch,
  IconAward,
  IconSettings,
  IconPhone,
  IconFileSpreadsheet,
  IconChecklist,
} from '@tabler/icons-react';
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Text,
  ActionIcon,
  ScrollArea,
  Stack,
  Badge,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuthStore } from '../store/auth';

const navigationGroups = [
  {
    title: 'Employee Services',
    links: [
      { icon: IconHome2, label: 'Dashboard', link: '/' },
      { icon: IconUsersGroup, label: 'Employee', link: '/employees' },
      { icon: IconCalendar, label: 'Attendance', link: '/attendance' },
      { icon: IconCalendar, label: 'Leave', link: '/leaves' },
      { icon: IconClockDollar, label: 'Overtime', link: '/overtime' },
      { icon: IconMoneybag, label: 'Advance', link: '/advance' },
      { icon: IconGavel, label: 'Fines', link: '/fines' },
      { icon: IconFlagDiscount, label: 'Remark', link: '/remarks' },
    ],
  },
  {
    title: 'Payroll & Requests',
    links: [
      { icon: IconReceiptRupee, label: 'Payroll', link: '/payroll' },
      { icon: IconBuildingBank, label: 'Expenses', link: '/expenses' },
      { icon: IconTicket, label: 'Ticket', link: '/ticket', badge: 5 },
    ],
  },
  {
    title: 'Task Management',
    links: [
      { icon: IconChecklist, label: 'Tasks', link: '/tasks' },
    ],
  },
  {
    title: 'Reports & Documents',
    links: [
      { icon: IconBrandGoogleDrive, label: 'Employee Documents', link: '/empdocs' },
      { icon: IconFileSpreadsheet, label: 'Reports', link: '/reports' },
    ],
  },
  {
    title: 'User & Organization Management',
    links: [
      { icon: IconFileAnalytics, label: 'User Management', link: '/usermanagement' },
      { icon: IconBuilding, label: 'Organisation', link: '/organisation' },
    ],
  },
  {
    title: 'Learning & Development',
    links: [
      { icon: IconTimelineEvent, label: 'Training', link: '/training' },
      { icon: IconUserSearch, label: 'Recruitment', link: '/recruitment' },
      { icon: IconAward, label: 'Performance', link: '/performance' },
    ],
  },
  {
    title: 'Settings & Support',
    links: [
      { icon: IconSettings, label: 'Settings', link: '/settings' },
      { icon: IconPhone, label: 'Help', link: '/help' },
    ],
  },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const signOut = useAuthStore((state) => state.signOut);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleToggleColorScheme = () => {
    // Add color scheme toggle functionality here
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
      className="full-background"
    >
      <AppShell.Header className="inner">
        <Group h="100%" px="md" justify="space-between" style={{ width: '100%' }}>
          <Group>
            <ActionIcon
              variant="outline"
              onClick={toggleDesktop}
              title="Toggle navigation"
              visibleFrom="sm"
              size="sm"
            >
              <IconMenu2 style={{ width: 18, height: 18 }} />
            </ActionIcon>
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Text fw={700} fz={24} c="#000">
              MicroPlesk
            </Text>
          </Group>

          <Group gap="xs">
            <ActionIcon
              variant="outline"
              onClick={handleToggleColorScheme}
              title="Toggle color scheme"
              size="sm"
            >
              <IconMoonFilled style={{ width: 18, height: 18 }} />
            </ActionIcon>
            <ActionIcon
              variant="outline"
              onClick={handleLogout}
              title="Logout"
              size="sm"
            >
              <IconLogout style={{ width: 18, height: 18 }} />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <ScrollArea h="calc(100vh - 60px)" scrollbarSize={6}>
          <Stack gap={0} p="xs">
            {navigationGroups.map((group, index) => (
              <div key={index} className="nav-group">
                <Text size="sm" fw={500} c="dimmed" p="xs" pb={8}>
                  {group.title}
                </Text>
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.link;
                  return (
                    <NavLink
                      key={link.label}
                      component={Link}
                      to={link.link}
                      label={link.label}
                      leftSection={<Icon size={20} stroke={1.5} />}
                      rightSection={
                        link.badge ? (
                          <Badge size="sm" circle variant="filled" color="red">
                            {link.badge}
                          </Badge>
                        ) : null
                      }
                      active={isActive}
                    />
                  );
                })}
              </div>
            ))}
          </Stack>
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}