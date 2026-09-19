import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { AlertCircle } from 'lucide-react';
import { IncidentCard } from './IncidentCard';
import { IncidentsHeader } from './IncidentsHeader';
import { WaterBackground } from '@/components/design-system/WaterBackground';
import { FloatingCard } from '@/components/design-system/FloatingCard';
import { Container } from '@/components/design-system/Container';

/**
 * Incidents List Page (Server Component)
 * 
 * Displays all incidents for the user's organization with:
 * - Title, description, severity, status, and image (if present)
 * - Lock button for Manager role
 * - Server-side data fetching
 * 
 * Features:
 * - Server-side data fetching using Prisma
 * - Manager-only lock button
 * - Bilingual support (Danish/English)
 * - Mobile-first responsive design
 * - Color-coded severity badges
 * 
 * Requirements:
 * - 7.1: Display incidents with title, description, severity, status
 * - 7.2: Display image if present
 * - 7.4: Manager can lock incidents
 * - 7.6: Query and display incidents
 * - 11.1: Mobile-first responsive layout
 * - 12.3: Bilingual labels
 * - 14.4: Display image with incident
 * - 14.5: Show image in incident list
 * 
 * @returns Incidents list page
 */
export default async function IncidentsPage() {
  // Get current user session
  const session = await getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  // Get translations
  const t = await getTranslations('incidents');

  // Fetch incidents for the user's organization (filtered by organization)
  const incidents = await prisma.incident.findMany({
    where: {
      organizationId: session.organizationId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <WaterBackground intensity="subtle" className="min-h-screen">
      <Container maxWidth="wide" className="py-6 space-y-6">
        {/* Page Header */}
        <IncidentsHeader 
          role={session.role}
          title={t('title')}
          reportIncidentText={t('reportIncident')}
        />

        {/* Incidents List */}
        {incidents.length === 0 ? (
          <FloatingCard className="text-center">
            <div className="py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('noIncidents')}</p>
            </div>
          </FloatingCard>
        ) : (
          <div className="grid gap-4">
            {incidents.map((incident) => (
              <IncidentCard 
                key={incident.id}
                incident={incident}
                isManager={session.role === 'MANAGER'}
              />
            ))}
          </div>
        )}
      </Container>
    </WaterBackground>
  );
}
