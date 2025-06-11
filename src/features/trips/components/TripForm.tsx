import { Form } from '@remix-run/react';

import { Button } from '~/shared/components/Button.js';
import { Input } from '~/shared/components/Input.js';
import { Textarea } from '~/shared/components/Textarea.js';

import styles from './TripForm.module.css';

import type { Trip } from '~/shared/types/index.js';

export interface TripFormProps {
  trip?: Trip;
  action?: string;
  errors?: Record<string, string>;
  isSubmitting?: boolean;
}

export function TripForm({
  trip,
  action,
  errors = {},
  isSubmitting = false,
}: TripFormProps): JSX.Element {
  return (
    <Form method="post" action={action} className={styles.form}>
      <div className={styles.grid}>
        <Input
          label="Trip Name"
          name="name"
          defaultValue={trip?.name ?? ''}
          error={errors.name}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Destination"
          name="destination"
          defaultValue={trip?.destination ?? ''}
          error={errors.destination}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Start Date"
          name="startDate"
          type="date"
          defaultValue={trip?.startDate ?? ''}
          error={errors.startDate}
          required
          disabled={isSubmitting}
        />

        <Input
          label="End Date"
          name="endDate"
          type="date"
          defaultValue={trip?.endDate ?? ''}
          error={errors.endDate}
          required
          disabled={isSubmitting}
        />
      </div>

      <Textarea
        label="Description (Optional)"
        name="description"
        defaultValue={trip?.description ?? ''}
        error={errors.description}
        rows={4}
        disabled={isSubmitting}
        placeholder="Tell us about your trip..."
      />

      <div className={styles.actions}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : trip ? 'Update Trip' : 'Create Trip'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
}

