import React, { useCallback } from 'react';
import { ActionIcon, AppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import { IconMenu2, IconLogout, IconMoonFilled } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/actions/auth';
import { modals } from '@mantine/modals';
import ErrorBoundary from '../components/ErrorBoundary';
// import { selectTheme, setColorScheme } from '../redux/slices/themeSlice';

const Layout = () => {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    // const colorScheme = useSelector(selectTheme);
    // const dark = colorScheme === 'dark';
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleToggleColorScheme = useCallback(() => {
        // dispatch(setColorScheme(dark ? 'light' : 'dark'));
    }, []);
    
    const handleLogout = () => {
        modals.openConfirmModal({
            title: 'Confirm Logout',
            centered: true,
            children: (
                <p>Are you sure you want to logout?</p>
            ),
            labels: { confirm: 'Logout', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => {
                dispatch(logoutUser()).then(() => {
                    navigate('/login');
                });
            },
        });
    };

    const handleMobileToggle = useCallback(() => {
        toggleMobile();
    }, [toggleMobile]);

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 250,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            padding="md"
            className='full-background'
        >
            <AppShell.Header className={'inner'}>
                <Group h="100%" px="md">
                    <ActionIcon
                        variant="outline"
                        onClick={toggleDesktop}
                        title="Toggle bottom"
                        visibleFrom="sm" size="sm"
                    >
                        <IconMenu2 style={{ width: 18, height: 18 }} />
                    </ActionIcon>
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                    {/* <MantineLogo size={30} /> */}
                    <Text fw={700} fz={24} c={'#000'}>MicroPlesk</Text>
                </Group>

                <Group h="100%" px="md">
                    <ActionIcon
                        variant="outline"
                        // color={dark ? 'yellow' : 'blue'}
                        onClick={handleToggleColorScheme}
                        title="Toggle color scheme"
                    >
                        {/* {dark ? (
                            <IconSun style={{ width: 18, height: 18 }} />
                        ) : ( */}
                            <IconMoonFilled style={{ width: 18, height: 18 }} />
                        {/* )} */}
                    </ActionIcon>
                    <ActionIcon
                        variant="outline"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <IconLogout style={{ width: 18, height: 18 }} />
                    </ActionIcon>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar pt={'sm'} w={'250px'} style={{ borderColor: '#f4f5ff' }}>
                <Sidebar onMobileClick={handleMobileToggle} />
            </AppShell.Navbar>
            <AppShell.Main>
            <ErrorBoundary>
                <Outlet />
                </ErrorBoundary>
            </AppShell.Main>
        </AppShell>
    );
};

export default React.memo(Layout);