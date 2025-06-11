import { Link } from '@remix-run/react';

import { Button } from '~/shared/components/Button.js';

import { TripCard } from './TripCard.js';
import styles from './TripList.module.css';

import type { Trip } from '~/shared/types/index.js';

export interface TripListProps {
  trips: Trip[];
  onDeleteTrip?: (tripId: string) => void;
}

export function TripList({ trips, onDeleteTrip }: TripListProps): JSX.Element {
  if (trips.length === 0) {
    return (
      <div className={styles.empty}>
        <h3 className={styles.emptyTitle}>No trips yet</h3>
        <p className={styles.emptyDescription}>
          Start planning your next adventure by creating your first trip.
        </p>
        <Button as={Link} to="/trips/new">
          Create Your First Trip
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Your Trips</h2>
        <Button as={Link} to="/trips/new">
          New Trip
        </Button>
      </div>

      <div className={styles.grid}>
        {trips.map(trip => (
          <TripCard key={trip.id} trip={trip} onDelete={onDeleteTrip} />
        ))}
      </div>
    </div>
  );
}
