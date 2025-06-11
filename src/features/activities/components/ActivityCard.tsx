import { Form } from '@remix-run/react';

import { Button } from '~/shared/components/Button.js';
import { formatDate, formatTime } from '~/shared/utils/dateUtils.js';

import styles from './ActivityCard.module.css';

import type { Activity } from '~/shared/types/index.js';

export interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete?: (activityId: string) => void;
  showConflicts?: boolean;
}

export function ActivityCard({
  activity,
  onEdit,
  onDelete,
  showConflicts = false,
}: ActivityCardProps): JSX.Element {
  const handleEdit = (): void => {
    onEdit(activity);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{activity.name}</h3>
        <div className={styles.actions}>
          <Button size="small" onClick={handleEdit}>
            Edit
          </Button>
          <Form
            method="post"
            action={`/trips/${activity.tripId}/activities/${activity.id}/delete`}
            style={{ display: 'inline' }}
          >
            <Button
              size="small"
              variant="danger"
              type="submit"
              onClick={e => {
                if (!window.confirm(`Are you sure you want to delete "${activity.name}"?`)) {
                  e.preventDefault();
                }
              }}
            >
              Delete
            </Button>
          </Form>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.dateTime}>
          <span className={styles.date}>{formatDate(activity.date)}</span>
          {activity.time && <span className={styles.time}>{formatTime(activity.time)}</span>}
        </div>

        {activity.location && (
          <div className={styles.location}>
            <span className={styles.locationIcon}>📍</span>
            <span>{activity.location}</span>
          </div>
        )}

        {activity.notes && (
          <div className={styles.notes}>
            <p>{activity.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
