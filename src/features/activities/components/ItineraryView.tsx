import { Button } from '~/shared/components/Button.js';
import { formatDate } from '~/shared/utils/dateUtils.js';

import { ActivityCard } from './ActivityCard.js';
import styles from './ItineraryView.module.css';

import type { Activity, DateRange } from '~/shared/types/index.js';

export interface ItineraryViewProps {
  activities: Activity[];
  tripId: string;
  tripDateRange: DateRange;
  onEditActivity: (activity: Activity) => void;
  onAddActivity: () => void;
}

export function ItineraryView({
  activities,
  tripId,
  tripDateRange,
  onEditActivity,
  onAddActivity,
}: ItineraryViewProps): JSX.Element {
  // Group activities by date
  const activitiesByDate = activities.reduce(
    (acc, activity) => {
      const date = activity.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(activity);
      return acc;
    },
    {} as Record<string, Activity[]>
  );

  // Sort dates chronologically
  const sortedDates = Object.keys(activitiesByDate).sort();

  if (activities.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyContent}>
          <h3>No activities planned yet</h3>
          <p>Start building your itinerary by adding your first activity.</p>
          <Button onClick={onAddActivity}>Add First Activity</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.itinerary}>
      <div className={styles.header}>
        <h2>Itinerary</h2>
        <Button onClick={onAddActivity}>Add Activity</Button>
      </div>

      <div className={styles.timeline}>
        {sortedDates.map(date => {
          const dayActivities = activitiesByDate[date];
          // Sort activities by time within each day
          const sortedActivities = dayActivities.sort((a, b) => {
            if (!a.time && !b.time) return 0;
            if (!a.time) return 1;
            if (!b.time) return -1;
            return a.time.localeCompare(b.time);
          });

          return (
            <div key={date} className={styles.day}>
              <div className={styles.dayHeader}>
                <h3 className={styles.dayDate}>{formatDate(date)}</h3>
                <span className={styles.activityCount}>
                  {dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'}
                </span>
              </div>

              <div className={styles.dayActivities}>
                {sortedActivities.map(activity => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onEdit={onEditActivity}
                    showConflicts={false}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
