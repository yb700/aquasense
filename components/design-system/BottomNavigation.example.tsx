import React from 'react';
import { Home, Calendar, ClipboardList, Users, Settings } from 'lucide-react';
import { BottomNavigation } from './BottomNavigation';

/**
 * BottomNavigation Examples
 * 
 * Demonstrates various use cases for the BottomNavigation component.
 */

// Example 1: Basic usage with 4 items
export const BasicBottomNavigation = () => {
  const items = [
    { label: 'Home', href: '/dashboard', icon: <Home size={24} /> },
    { label: 'Schedule', href: '/dashboard/shifts', icon: <Calendar size={24} /> },
    { label: 'Tasks', href: '/dashboard/cleaning', icon: <ClipboardList size={24} /> },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-background">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Basic Bottom Navigation</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Resize your browser to mobile width (&lt;1024px) to see the bottom navigation.
        </p>
      </div>
      
      <BottomNavigation items={items} currentPath="/dashboard" />
    </div>
  );
};

// Example 2: With 5 items (maximum recommended)
export const MaxItemsBottomNavigation = () => {
  const items = [
    { label: 'Home', href: '/dashboard', icon: <Home size={24} /> },
    { label: 'Schedule', href: '/dashboard/shifts', icon: <Calendar size={24} /> },
    { label: 'Tasks', href: '/dashboard/cleaning', icon: <ClipboardList size={24} /> },
    { label: 'Team', href: '/dashboard/team', icon: <Users size={24} /> },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-background pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">5 Navigation Items</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Maximum 5 items for optimal mobile UX.
        </p>
        <div className="space-y-2">
          <div className="bg-white dark:bg-card p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Content Area</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Main content goes here. The bottom navigation stays fixed at the bottom.
            </p>
          </div>
        </div>
      </div>
      
      <BottomNavigation items={items} currentPath="/dashboard/shifts" />
    </div>
  );
};

// Example 3: With notification badges
export const WithBadgesBottomNavigation = () => {
  const items = [
    { label: 'Home', href: '/dashboard', icon: <Home size={24} /> },
    { label: 'Schedule', href: '/dashboard/shifts', icon: <Calendar size={24} />, badge: 3 },
    { label: 'Tasks', href: '/dashboard/cleaning', icon: <ClipboardList size={24} />, badge: 12 },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-background pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">With Notification Badges</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Display notification counts on navigation items.
        </p>
        <div className="bg-white dark:bg-card p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Notification Examples</h2>
          <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
            <li>• Schedule has 3 new updates</li>
            <li>• Tasks has 12 pending items</li>
          </ul>
        </div>
      </div>
      
      <BottomNavigation items={items} currentPath="/dashboard/tasks" />
    </div>
  );
};

// Example 4: Dark mode
export const DarkModeBottomNavigation = () => {
  const items = [
    { label: 'Home', href: '/dashboard', icon: <Home size={24} /> },
    { label: 'Schedule', href: '/dashboard/shifts', icon: <Calendar size={24} /> },
    { label: 'Tasks', href: '/dashboard/cleaning', icon: <ClipboardList size={24} />, badge: 5 },
    { label: 'Team', href: '/dashboard/team', icon: <Users size={24} /> },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 dark">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Dark Mode Navigation</h1>
        <p className="text-neutral-400 mb-4">
          The bottom navigation adapts to dark mode with appropriate contrast.
        </p>
        <div className="bg-card p-4 rounded-lg shadow-dark-md">
          <h2 className="font-semibold mb-2 text-card-foreground">Dark Theme Support</h2>
          <p className="text-sm text-neutral-400">
            Glass effect and shadows automatically adjust for dark mode.
          </p>
        </div>
      </div>
      
      <BottomNavigation items={items} currentPath="/dashboard" />
    </div>
  );
};

// Example 5: Real-world dashboard integration
export const DashboardIntegration = () => {
  const items = [
    { label: 'Home', href: '/dashboard', icon: <Home size={24} /> },
    { label: 'Schedule', href: '/dashboard/shifts', icon: <Calendar size={24} />, badge: 2 },
    { label: 'Tasks', href: '/dashboard/cleaning', icon: <ClipboardList size={24} />, badge: 8 },
    { label: 'Team', href: '/dashboard/team', icon: <Users size={24} /> },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-background pb-20">
      {/* Page Header */}
      <header className="bg-white dark:bg-card shadow-sm border-b border-neutral-200 dark:border-neutral-700">
        <div className="p-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-4">
        <div className="bg-white dark:bg-card p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Welcome to AquaSense</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage your pool operations efficiently.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-card p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-accent-300">8</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Tasks Due</div>
          </div>
          <div className="bg-white dark:bg-card p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-accent-300">2</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Shifts Today</div>
          </div>
        </div>

        <div className="bg-white dark:bg-card p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center">
                <ClipboardList size={16} className="text-accent-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Pool cleaning completed</p>
                <p className="text-xs text-neutral-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center">
                <Calendar size={16} className="text-secondary-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New shift assigned</p>
                <p className="text-xs text-neutral-500">4 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation items={items} currentPath="/dashboard" />
    </div>
  );
};

export default {
  BasicBottomNavigation,
  MaxItemsBottomNavigation,
  WithBadgesBottomNavigation,
  DarkModeBottomNavigation,
  DashboardIntegration,
};
