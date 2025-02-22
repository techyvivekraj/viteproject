import { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  IconHome2,
  IconSettings,
  IconPhone,
  IconUsersGroup,
  IconCalendar,
  IconReceiptRupee,
  IconUserSearch,
  IconAward,
  IconFileAnalytics,
  IconTimelineEvent,
  IconBuildings,
  IconBuildingBank,
  IconTicket,
  IconGavel,
  IconBrandGoogleDrive,
  IconClockDollar,
  IconMoneybag,
  IconFlagDiscount,
} from '@tabler/icons-react';

import classes from './Sidebar.module.css';
import { Badge, ScrollArea, rem, } from '@mantine/core';
import { NavLink } from 'react-router-dom';
const navigationGroups = [
  {
    title: 'Employee Services',
    links: [
      { icon: IconHome2, label: 'Dashboard', link: '/' },
      { icon: IconUsersGroup, label: 'Employee', link: '/employees' },
      { icon: IconCalendar, label: 'Attendance', link: '/attendance' },
      { icon: IconClockDollar, label: 'Overtime', link: '/overtime' },
      { icon: IconMoneybag, label: 'Advance', link: '/advance' },
      { icon: IconGavel, label: 'Fines', link: '/fines' },
      { icon: IconFlagDiscount, label: 'Remark', link: '/remark' },
    ],
  },
  {
    title: 'Payroll & Requests',
    links: [
      { icon: IconReceiptRupee, label: 'Payroll', link: '/payroll' },
      { icon: IconBuildingBank, label: 'Expenses', link: '/expense' },
      { icon: IconTicket, label: 'Ticket', link: '/ticket', badge: 5 },
    ],
  },
  {
    title: 'Reports & Documents',
    links: [
      { icon: IconBrandGoogleDrive, label: 'Employee Documents', link: '/empdocs' },
      { icon: IconFileAnalytics, label: 'Reports', link: '/reports' },
    ],
  },
  {
    title: 'User & Organization Management',
    links: [
      { icon: IconFileAnalytics, label: 'User Management', link: '/usermanagement' },
      { icon: IconBuildings, label: 'Organisation', link: '/organisation' },
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


export default function Sidebar({ onMobileClick }) {
  const [activeLink, setActiveLink] = useState('Dashboard');
  const location = useLocation();
  
  const handleLinkClick = useCallback((label) => {
    setActiveLink(label);
    // Make sure onMobileClick exists before calling it
    if (window.innerWidth < 768 && typeof onMobileClick === 'function') {
      onMobileClick();
    }
  }, [onMobileClick]); // Add onMobileClick to dependencies

  useEffect(() => {
    const currentLink = navigationGroups.flatMap(group => group.links)
      .find(link => link.link === location.pathname);
    if (currentLink) {
      setActiveLink(currentLink.label);
    }
  }, [location.pathname]);

  const groupedLinks = useMemo(() =>
    navigationGroups.map((group, index) => (
      <div key={index} className={classes.group}>
        <p size='xs' className={classes.groupTitle}>{group.title}</p>
        {group.links.map((link) => (
          <NavLink
            className={classes.link}
            data-active={activeLink === link.label || undefined}
            to={link.link}
            onClick={() => handleLinkClick(link.label)}
            key={link.label}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <link.icon style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
              <span style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center' }}>
                {link.label}
                {link.badge && (
                  <Badge size="md" circle ml={'md'} color='red'>
                    {link.badge}
                  </Badge>
                )}
              </span>
            </span>
          </NavLink>
        ))}
      </div>
    )), [activeLink, handleLinkClick] // Add handleLinkClick to dependencies
  );

  return (
    <ScrollArea h="calc(100vh - 60px)" scrollbarSize={6} className={classes.main}>
      {groupedLinks}
    </ScrollArea>
  );
}