'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

/**
 * Incidents Header Component (Client Component)
 * 
 * Displays the page header with title, description, and create button.
 * Needs to be a client component to handle navigation with locale.
 * 
 * @param role - User role (MANAGER or STAFF)
 * @param title - Page title from translations
 * @param reportIncidentText - Button text from translations
 */

interface IncidentsHeaderProps {
  role: string;
  title: string;
  reportIncidentText: string;
}

export function IncidentsHeader({ role, title, reportIncidentText }: IncidentsHeaderProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const handleCreateClick = () => {
    router.push(`/${locale}/incidents/new`);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          {role === 'MANAGER' 
            ? 'Review and manage incident reports' 
            : 'View and report incidents'}
        </p>
      </div>

      {/* Create Incident Button */}
      <Button size="lg" className="w-full sm:w-auto" onClick={handleCreateClick}>
        <Plus className="mr-2 h-4 w-4" />
        {reportIncidentText}
      </Button>
    </div>
  );
}
