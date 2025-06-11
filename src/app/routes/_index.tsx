import { redirect } from '@remix-run/node';

import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Travel Planner - Plan Your Perfect Trip' },
    {
      name: 'description',
      content: 'Create and manage your travel plans with our easy-to-use trip planner.',
    },
  ];
};

export async function loader(): Promise<Response> {
  return redirect('/trips');
}

export default function Index(): JSX.Element | null {
  return null;
}
