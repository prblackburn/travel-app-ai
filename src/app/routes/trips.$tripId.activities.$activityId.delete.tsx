import { redirect } from '@remix-run/node';

import { deleteActivity, getActivityById } from '~/features/activities/utils/activityService.js';

import type { ActionFunctionArgs } from '@remix-run/node';

export async function action({ params }: ActionFunctionArgs): Promise<Response> {
  const { tripId, activityId } = params;

  if (!tripId || !activityId) {
    throw new Response('Trip ID and Activity ID are required', { status: 400 });
  }

  try {
    // Verify activity exists and belongs to the trip
    const activity = await getActivityById(activityId);
    if (!activity) {
      throw new Response('Activity not found', { status: 404 });
    }

    if (activity.tripId !== tripId) {
      throw new Response('Activity does not belong to this trip', { status: 400 });
    }

    await deleteActivity(activityId);
    return redirect(`/trips/${tripId}`);
  } catch (error) {
    console.error('Failed to delete activity:', error);
    throw new Response('Failed to delete activity', { status: 500 });
  }
}

// This route only handles POST requests for deletion
export function loader(): Response {
  throw new Response('Method not allowed', { status: 405 });
}
