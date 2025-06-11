import { json, redirect } from '@remix-run/node';
import { useActionData, useNavigation } from '@remix-run/react';

import { TripForm } from '~/features/trips/components/TripForm.js';
import { createTrip } from '~/features/trips/utils/tripService.js';
import { Layout } from '~/shared/components/Layout.js';

import type { ActionFunctionArgs } from '@remix-run/node';

export async function action({ request }: ActionFunctionArgs): Promise<Response> {
  const formData = await request.formData();

  const tripData = {
    name: formData.get('name') as string,
    destination: formData.get('destination') as string,
    startDate: formData.get('startDate') as string,
    endDate: formData.get('endDate') as string,
    description: formData.get('description') as string,
  };

  try {
    const trip = await createTrip(tripData);
    return redirect(`/trips/${trip.id}`);
  } catch (error) {
    console.error('Failed to create trip:', error);
    return json(
      {
        errors: { general: error instanceof Error ? error.message : 'Failed to create trip' },
        values: tripData,
      },
      { status: 400 }
    );
  }
}

export default function NewTripPage(): JSX.Element {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Layout title="Create New Trip">
      <TripForm errors={actionData?.errors} isSubmitting={isSubmitting} />
    </Layout>
  );
}
