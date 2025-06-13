import { json, redirect } from '@remix-run/node';
import { useLoaderData, useActionData, useNavigation } from '@remix-run/react';

import { ActivityForm } from '~/features/activities/components/ActivityForm.js';
import { getActivityById, updateActivity } from '~/features/activities/utils/activityService.js';
import { validateUpdateActivityData } from '~/features/activities/utils/activityValidation.js';
import { getTripById } from '~/features/trips/utils/tripService.js';
import { Layout } from '~/shared/components/Layout.js';

import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';

export async function loader({ params }: LoaderFunctionArgs): Promise<Response> {
  const { activityId } = params;

  if (!activityId) {
    throw new Response('Activity ID is required', { status: 400 });
  }

  try {
    const activity = await getActivityById(activityId);

    if (!activity) {
      throw new Response('Activity not found', { status: 404 });
    }

    const trip = await getTripById(activity.tripId);
    if (!trip) {
      throw new Response('Trip not found', { status: 404 });
    }

    return json({ trip, activity });
  } catch (error) {
    console.error('Failed to load activity:', error);
    throw new Response('Failed to load activity', { status: 500 });
  }
}

export async function action({ request, params }: ActionFunctionArgs): Promise<Response> {
  const { activityId } = params;

  if (!activityId) {
    throw new Response('Activity ID is required', { status: 400 });
  }

  const formData = await request.formData();

  const updateData = {
    name: (formData.get('name') as string) || '',
    date: (formData.get('date') as string) || '',
    time: (formData.get('time') as string) || '',
    location: (formData.get('location') as string) || '',
    notes: (formData.get('notes') as string) || '',
  };

  try {
    // Get activity first to find the trip
    const activity = await getActivityById(activityId);
    if (!activity) {
      throw new Response('Activity not found', { status: 404 });
    }

    // Get trip to validate date range
    const trip = await getTripById(activity.tripId);
    if (!trip) {
      throw new Response('Trip not found', { status: 404 });
    }

    const validatedData = validateUpdateActivityData(updateData, {
      start: trip.startDate,
      end: trip.endDate,
    });

    await updateActivity(activityId, validatedData);
    return redirect(`/trips/${trip.id}`);
  } catch (error) {
    console.error('Failed to update activity:', error);
    return json(
      {
        errors: { general: error instanceof Error ? error.message : 'Failed to update activity' },
        values: updateData,
      },
      { status: 400 }
    );
  }
}

export default function EditActivityPage(): JSX.Element {
  const { trip, activity } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as
    | { errors?: Record<string, string> }
    | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Layout title={`Edit ${activity.name} - ${trip.name}`}>
      <ActivityForm
        activity={activity}
        tripId={trip.id}
        tripDateRange={{ start: trip.startDate, end: trip.endDate }}
        errors={actionData?.errors}
        isSubmitting={isSubmitting}
      />
    </Layout>
  );
}
