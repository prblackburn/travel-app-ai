import { json, redirect } from '@remix-run/node';
import { useLoaderData, useActionData, useNavigation } from '@remix-run/react';

import { TripForm } from '~/features/trips/components/TripForm.js';
import { getTripById, updateTrip } from '~/features/trips/utils/tripService.js';
import { Layout } from '~/shared/components/Layout.js';

import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';

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

export async function action({ request, params }: ActionFunctionArgs): Promise<Response> {
  const { tripId } = params;

  if (!tripId) {
    throw new Response('Trip ID is required', { status: 400 });
  }

  const formData = await request.formData();

  const tripData = {
    name: formData.get('name') as string,
    destination: formData.get('destination') as string,
    startDate: formData.get('startDate') as string,
    endDate: formData.get('endDate') as string,
    description: formData.get('description') as string,
  };

  try {
    await updateTrip(tripId, tripData);
    return redirect(`/trips/${tripId}`);
  } catch (error) {
    console.error('Failed to update trip:', error);
    return json(
      {
        errors: { general: error instanceof Error ? error.message : 'Failed to update trip' },
        values: tripData,
      },
      { status: 400 }
    );
  }
}

export default function EditTripPage(): JSX.Element {
  const { trip } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Layout title={`Edit ${trip.name}`}>
      <TripForm trip={trip} errors={actionData?.errors} isSubmitting={isSubmitting} />
    </Layout>
  );
}

