import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';

import styles from '~/features/trips/components/TripDetail.module.css';
import { getTripById } from '~/features/trips/utils/tripService.js';
import { Button } from '~/shared/components/Button.js';
import { Layout } from '~/shared/components/Layout.js';
import { formatDateRange } from '~/shared/utils/formatters.js';

import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ params }: LoaderFunctionArgs): Promise<Response> {
  const { tripId } = params;

  if (!tripId) {
    throw new Response('Trip ID is required', { status: 400 });
  }

  try {
    const trip = await getTripById(tripId);

    if (!trip) {
      throw new Response('Trip not found', { status: 404 });
    }

    return json({ trip });
  } catch (error) {
    console.error('Failed to load trip:', error);
    throw new Response('Failed to load trip', { status: 500 });
  }
}

export default function TripDetailPage(): JSX.Element {
  const { trip } = useLoaderData<typeof loader>();

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
          <h2 className={styles.sectionTitle}>Itinerary</h2>
          <div className={styles.placeholder}>
            <p>Activities coming soon...</p>
            <p className={styles.placeholderText}>
              This is where you&apos;ll be able to add and manage activities for your trip.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

