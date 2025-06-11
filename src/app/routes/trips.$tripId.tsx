import { json } from '@remix-run/node';
import { useLoaderData, Link, useNavigate } from '@remix-run/react';

import { ItineraryView } from '~/features/activities/components/ItineraryView.js';
import { getActivitiesByTripId } from '~/features/activities/utils/activityService.js';
import styles from '~/features/trips/components/TripDetail.module.css';
import { getTripById } from '~/features/trips/utils/tripService.js';
import { Button } from '~/shared/components/Button.js';
import { Layout } from '~/shared/components/Layout.js';
import { formatDateRange } from '~/shared/utils/formatters.js';

import type { LoaderFunctionArgs } from '@remix-run/node';
import type { Activity } from '~/shared/types/index.js';

export async function loader({ params }: LoaderFunctionArgs): Promise<Response> {
  const { tripId } = params;

  if (!tripId) {
    throw new Response('Trip ID is required', { status: 400 });
  }

  try {
    const [trip, activities] = await Promise.all([
      getTripById(tripId),
      getActivitiesByTripId(tripId),
    ]);

    if (!trip) {
      throw new Response('Trip not found', { status: 404 });
    }

    return json({ trip, activities });
  } catch (error) {
    console.error('Failed to load trip:', error);
    throw new Response('Failed to load trip', { status: 500 });
  }
}

export default function TripDetailPage(): JSX.Element {
  const { trip, activities } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleEditActivity = (activity: Activity): void => {
    navigate(`/trips/${trip.id}/activities/${activity.id}/edit`);
  };

  const handleAddActivity = (): void => {
    navigate(`/trips/${trip.id}/activities/new`);
  };

  return (
    <Layout title={trip.name}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{trip.name}</h1>
            <p className={styles.destination}>{trip.destination}</p>
            <p className={styles.dates}>{formatDateRange(trip.startDate, trip.endDate)}</p>
          </div>
          <div className={styles.actions}>
            <Button as={Link} to={`/trips/${trip.id}/edit`} variant="secondary">
              Edit Trip
            </Button>
            <Button as={Link} to="/trips">
              Back to Trips
            </Button>
          </div>
        </div>

        {trip.description && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p className={styles.description}>{trip.description}</p>
          </div>
        )}

        <div className={styles.section}>
          <ItineraryView
            activities={activities}
            tripId={trip.id}
            tripDateRange={{ start: trip.startDate, end: trip.endDate }}
            onEditActivity={handleEditActivity}
            onAddActivity={handleAddActivity}
          />
        </div>
      </div>
    </Layout>
  );
}
