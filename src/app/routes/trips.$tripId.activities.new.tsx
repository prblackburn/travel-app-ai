import { json, redirect } from '@remix-run/node';
import { useLoaderData, useActionData, useNavigation } from '@remix-run/react';

import { ActivityForm } from '~/features/activities/components/ActivityForm.js';
import { createActivity } from '~/features/activities/utils/activityService.js';
import { validateActivityData } from '~/features/activities/utils/activityValidation.js';
import { getTripById } from '~/features/trips/utils/tripService.js';
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

  const activityData = {
    tripId,
    name: (formData.get('name') as string) || '',
    date: (formData.get('date') as string) || '',
    time: (formData.get('time') as string) || '',
    location: (formData.get('location') as string) || '',
    notes: (formData.get('notes') as string) || '',
  };

  try {
    // Get trip to validate date range
    const trip = await getTripById(tripId);
    if (!trip) {
      throw new Response('Trip not found', { status: 404 });
    }

    const validatedData = validateActivityData(activityData, {
      start: trip.startDate,
      end: trip.endDate,
    });

    await createActivity(validatedData);
    return redirect(`/trips/${tripId}`);
  } catch (error) {
    console.error('Failed to create activity:', error);
    return json(
      {
        errors: { general: error instanceof Error ? error.message : 'Failed to create activity' },
        values: activityData,
      },
      { status: 400 }
    );
  }
}

export default function NewActivityPage(): JSX.Element {
  const { trip } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as { errors?: Record<string, string> } | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Layout title={`Add Activity - ${trip.name}`}>
      <ActivityForm
        tripId={trip.id}
        tripDateRange={{ start: trip.startDate, end: trip.endDate }}
        errors={actionData?.errors}
        isSubmitting={isSubmitting}
      />
    </Layout>
  );
}
