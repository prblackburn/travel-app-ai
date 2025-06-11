import { redirect } from '@remix-run/node';

import { deleteActivity, getActivityById } from '~/features/activities/utils/activityService.js';

import type { ActionFunctionArgs } from '@remix-run/node';

export async function action({ params }: ActionFunctionArgs): Promise<Response> {
  const { activityId } = params;

  if (!activityId) {
    throw new Response('Activity ID is required', { status: 400 });
  }

  try {
    // Get activity first to find the trip ID for redirect
    const activity = await getActivityById(activityId);
    if (!activity) {
      throw new Response('Activity not found', { status: 404 });
    }

    const tripId = activity.tripId;
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