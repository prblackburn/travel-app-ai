import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db/index.js';
import { trips, activities, packingLists, packingItems } from '~/db/schema.js';

import type { Trip } from '~/shared/types/index.js';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Test database queries
    const allTrips = await db.select().from(trips);
    const allActivities = await db.select().from(activities);
    const allPackingLists = await db.select().from(packingLists);
    const allPackingItems = await db.select().from(packingItems);

    return json({
      success: true,
      counts: {
        trips: allTrips.length,
        activities: allActivities.length,
        packingLists: allPackingLists.length,
        packingItems: allPackingItems.length,
      },
      sampleTrip: allTrips[0] || null,
    });
  } catch (error) {
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      counts: { trips: 0, activities: 0, packingLists: 0, packingItems: 0 },
      sampleTrip: null,
    });
  }
}

export default function Debug(): JSX.Element {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>Stack Validation Debug</h1>
      <p style={{ color: '#666', fontStyle: 'italic' }}>
        Development tool - remove before production
      </p>

      <h2>Database Connection</h2>
      <p>Status: {data.success ? '✅ Connected' : '❌ Failed'}</p>
      {!data.success && <p>Error: {data.error}</p>}

      <h2>Data Counts</h2>
      <ul>
        <li>Trips: {data.counts.trips}</li>
        <li>Activities: {data.counts.activities}</li>
        <li>Packing Lists: {data.counts.packingLists}</li>
        <li>Packing Items: {data.counts.packingItems}</li>
      </ul>

      <h2>Sample Data</h2>
      {data.sampleTrip ? (
        <pre>{JSON.stringify(data.sampleTrip, null, 2)}</pre>
      ) : (
        <p>No sample trip data</p>
      )}
    </div>
  );
}
