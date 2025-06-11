import { Form } from '@remix-run/react';

import { Button } from '~/shared/components/Button.js';
import { Input } from '~/shared/components/Input.js';
import { Textarea } from '~/shared/components/Textarea.js';

import styles from './ActivityForm.module.css';

import type { Activity, DateRange } from '~/shared/types/index.js';

export interface ActivityFormProps {
  activity?: Activity;
  tripId: string;
  tripDateRange: DateRange;
  action?: string;
  errors?: Record<string, string>;
  isSubmitting?: boolean;
}

export function ActivityForm({
  activity,
  tripId,
  tripDateRange,
  action,
  errors = {},
  isSubmitting = false,
}: ActivityFormProps): JSX.Element {
  return (
    <Form method="post" action={action} className={styles.form}>
      <input type="hidden" name="tripId" value={tripId} />

      <div className={styles.grid}>
        <Input
          label="Activity Name"
          name="name"
          defaultValue={activity?.name ?? ''}
          error={errors.name}
          required
          disabled={isSubmitting}
          placeholder="e.g., Visit Eiffel Tower"
        />

        <Input
          label="Date"
          name="date"
          type="date"
          defaultValue={activity?.date ?? ''}
          error={errors.date}
          required
          disabled={isSubmitting}
          min={tripDateRange.start}
          max={tripDateRange.end}
        />

        <Input
          label="Time (Optional)"
          name="time"
          type="time"
          defaultValue={activity?.time ?? ''}
          error={errors.time}
          disabled={isSubmitting}
          placeholder="HH:MM"
        />

        <Input
          label="Location (Optional)"
          name="location"
          defaultValue={activity?.location ?? ''}
          error={errors.location}
          disabled={isSubmitting}
          placeholder="e.g., Paris, France"
        />
      </div>

      <Textarea
        label="Notes (Optional)"
        name="notes"
        defaultValue={activity?.notes ?? ''}
        error={errors.notes}
        rows={3}
        disabled={isSubmitting}
        placeholder="Any additional details about this activity..."
      />

      <div className={styles.actions}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : activity ? 'Update Activity' : 'Create Activity'}
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
