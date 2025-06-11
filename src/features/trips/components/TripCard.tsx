import { Link } from '@remix-run/react';

import { Button } from '~/shared/components/Button.js';
import { formatDateRange } from '~/shared/utils/formatters.js';

import styles from './TripCard.module.css';

import type { Trip } from '~/shared/types/index.js';

export interface TripCardProps {
  trip: Trip;
  onDelete?: (tripId: string) => void;
}

export function TripCard({ trip, onDelete }: TripCardProps): JSX.Element {
  const handleDelete = (): void => {
    if (onDelete && window.confirm(`Are you sure you want to delete "${trip.name}"?`)) {
      onDelete(trip.id);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>
          <Link to={`/trips/${trip.id}`} className={styles.titleLink}>
            {trip.name}
          </Link>
        </h3>
        <p className={styles.destination}>{trip.destination}</p>
        <p className={styles.dates}>{formatDateRange(trip.startDate, trip.endDate)}</p>
        {trip.description && <p className={styles.description}>{trip.description}</p>}
      </div>
      <div className={styles.actions}>
        <Button as={Link} to={`/trips/${trip.id}/edit`} variant="secondary" size="small">
          Edit
        </Button>
        {onDelete && (
          <Button variant="danger" size="small" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}

