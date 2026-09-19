import React from 'react';
import { NavigationRail } from './NavigationRail';
import {
  Home,
  Calendar,
  ClipboardList,
  Users,
  AlertCircle,
  Settings,
} from 'lucide-react';

/**
 * NavigationRail Component Examples
 * 
 * This file demonstrates various usage patterns for the NavigationRail component.
 */

// Example 1: Basic Navigation Rail
export const BasicNavigationRail = () => {
  const items = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home size={20} />,
    },
    {
      label: 'Schedule',
      href: '/schedule',
      icon: <Calendar size={20} />,
    },
    {
      label: 'Tasks',
      href: '/tasks',
      icon: <ClipboardList size={20} />,
    },
    {
      label: 'Staff',
      href: '/staff',
      icon: <Users size={20} />,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="h-screen bg-background">
      <NavigationRail
        items={items}
        currentPath="/dashboard"
        userName="Jane Smith"
      />
      <main className="lg:ml-[280px] p-8">
        <h1 className="text-3xl font-bold">Dashboard Content</h1>
        <p className="mt-4 text-muted-foreground">
          The NavigationRail is fixed on the left side (≥1024px viewport).
        </p>
      </main>
    </div>
  );
};

// Example 2: Navigation Rail with Badges
export const NavigationRailWithBadges = () => {
  const items = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home size={20} />,
    },
    {
      label: 'Incidents',
      href: '/incidents',
      icon: <AlertCircle size={20} />,
      badge: 5, // 5 new incidents
    },
    {
      label: 'Schedule',
      href: '/schedule',
      icon: <Calendar size={20} />,
      badge: 2, // 2 pending approvals
    },
    {
      label: 'Tasks',
      href: '/tasks',
      icon: <ClipboardList size={20} />,
      badge: 12, // 12 tasks due today
    },
    {
      label: 'Notifications',
      href: '/notifications',
      icon: <AlertCircle size={20} />,
      badge: 150, // Will display as "99+"
    },
  ];

  return (
    <div className="h-screen bg-background">
      <NavigationRail
        items={items}
        currentPath="/incidents"
        userName="John Doe"
      />
      <main className="lg:ml-[280px] p-8">
        <h1 className="text-3xl font-bold">Incidents</h1>
        <p className="mt-4 text-muted-foreground">
          Notice the notification badges on navigation items.
        </p>
      </main>
    </div>
  );
};

// Example 3: Navigation Rail with Active Nested Route
export const NavigationRailNestedRoute = () => {
  const items = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home size={20} />,
    },
    {
      label: 'Schedule',
      href: '/schedule',
      icon: <Calendar size={20} />,
    },
    {
      label: 'Staff',
      href: '/staff',
      icon: <Users size={20} />,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings size={20} />,
    },
  ];

  // Current path is a nested route under /settings
  return (
    <div className="h-screen bg-background">
      <NavigationRail
        items={items}
        currentPath="/settings/profile"
        userName="Alice Johnson"
      />
      <main className="lg:ml-[280px] p-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="mt-4 text-muted-foreground">
          The Settings nav item is highlighted even on nested routes like /settings/profile.
        </p>
      </main>
    </div>
  );
};

// Example 4: Navigation Rail in Dark Mode
export const NavigationRailDarkMode = () => {
  const items = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home size={20} />,
    },
    {
      label: 'Schedule',
      href: '/schedule',
      icon: <Calendar size={20} />,
      badge: 3,
    },
    {
      label: 'Tasks',
      href: '/tasks',
      icon: <ClipboardList size={20} />,
    },
  ];

  return (
    <div className="dark h-screen bg-background">
      <NavigationRail
        items={items}
        currentPath="/schedule"
        userName="Bob Wilson"
      />
      <main className="lg:ml-[280px] p-8">
        <h1 className="text-3xl font-bold text-foreground">Schedule</h1>
        <p className="mt-4 text-muted-foreground">
          The NavigationRail adapts to dark mode with appropriate colors and glass effect.
        </p>
      </main>
    </div>
  );
};

// Example 5: Responsive Layout (Desktop Only)
export const NavigationRailResponsive = () => {
  const items = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home size={20} />,
    },
    {
      label: 'Schedule',
      href: '/schedule',
      icon: <Calendar size={20} />,
    },
    {
      label: 'Tasks',
      href: '/tasks',
      icon: <ClipboardList size={20} />,
    },
  ];

  return (
    <div className="h-screen bg-background">
      <NavigationRail
        items={items}
        currentPath="/dashboard"
        userName="Sarah Martinez"
      />
      <main className="lg:ml-[280px] p-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="mt-4 p-4 bg-info/10 border border-info/20 rounded-md">
          <p className="text-sm text-foreground">
            <strong>Note:</strong> NavigationRail is only visible on desktop (≥1024px).
            Resize your browser to see it appear/disappear.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            On mobile/tablet, use BottomNavigation instead.
          </p>
        </div>
      </main>
    </div>
  );
};
