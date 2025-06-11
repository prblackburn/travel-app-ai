import { json } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';

import { TripList } from '~/features/trips/components/TripList.js';
import { getAllTrips, deleteTrip } from '~/features/trips/utils/tripService.js';
import { Layout } from '~/shared/components/Layout.js';

import type { LoaderFunctionArgs } from '@remix-run/node';
import type { Trip } from '~/shared/types/index.js';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const trips = await getAllTrips();
    return json({ trips });
  } catch (error) {
    console.error('Failed to load trips:', error);
    return json({ trips: [], error: 'Failed to load trips' });
  }
}

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  const tripId = formData.get('tripId');

  if (intent === 'delete' && typeof tripId === 'string') {
    try {
      await deleteTrip(tripId);
      return json({ success: true });
    } catch (error) {
      console.error('Failed to delete trip:', error);
      return json({ error: 'Failed to delete trip' }, { status: 400 });
    }
  }

  return json({ error: 'Invalid action' }, { status: 400 });
}

export default function TripsPage(): JSX.Element {
  const { trips } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const handleDeleteTrip = (tripId: string): void => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      fetcher.submit({ intent: 'delete', tripId }, { method: 'post' });
    }
  };

  return (
    <Layout title="Your Trips">
      <TripList trips={trips} onDeleteTrip={handleDeleteTrip} />
    </Layout>
  );
}
