import React, { useCallback } from 'react';
import { ActionIcon, AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import { IconMenu2, IconLogout, IconMoonFilled, IconSun } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector, } from 'react-redux';
import { logoutUser } from '../redux/actions/auth';
import { selectTheme, setColorScheme } from '../redux/slices/themeSlice';

const Layout = () => {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const colorScheme = useSelector(selectTheme);
    const dark = colorScheme === 'dark';
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleToggleColorScheme = useCallback(() => {
        dispatch(setColorScheme(dark ? 'light' : 'dark'));
    }, [dispatch, dark]);
    
    const handleLogout = () => {
        dispatch(logoutUser(navigate));
        navigate('/login');
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
                    <MantineLogo size={30} />
                </Group>

                <Group h="100%" px="md">
                    <ActionIcon
                        variant="outline"
                        color={dark ? 'yellow' : 'blue'}
                        onClick={handleToggleColorScheme}
                        title="Toggle color scheme"
                    >
                        {dark ? (
                            <IconSun style={{ width: 18, height: 18 }} />
                        ) : (
                            <IconMoonFilled style={{ width: 18, height: 18 }} />
                        )}
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
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
};

export default React.memo(Layout);