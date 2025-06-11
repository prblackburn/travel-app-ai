# Travel Planning App - Architectural Specification

## Technology Stack

### Frontend & Backend

- **Framework**: Remix (TypeScript)
- **Runtime**: Node.js
- **Package Manager**: pnpm

### Database & ORM

- **Database**: SQLite
- **ORM**: Drizzle ORM
- **Migrations**: Drizzle migrations

### Styling & UI

- **Styling**: CSS Modules
- **Icons**: Lucide React (or similar)
- **Forms**: Remix built-in form handling

### Development Tools

- **Linting**: ESLint (strict mode)
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode

## Project Structure

```
src/
├── features/
│   ├── trips/
│   │   ├── components/
│   │   │   ├── TripCard.tsx
│   │   │   ├── TripForm.tsx
│   │   │   └── TripList.tsx
│   │   ├── hooks/
│   │   │   ├── useTrips.ts
│   │   │   └── useTripActions.ts
│   │   ├── utils/
│   │   │   ├── tripValidation.ts
│   │   │   └── tripFormatters.ts
│   │   ├── types.ts
│   │   └── styles/
│   │       └── trips.module.css
│   └── itinerary/
│       ├── components/
│       │   ├── ActivityCard.tsx
│       │   ├── ActivityForm.tsx
│       │   └── ItineraryView.tsx
│       ├── hooks/
│       │   └── useActivities.ts
│       ├── utils/
│       │   ├── activityValidation.ts
│       │   └── timeUtils.ts
│       ├── types.ts
│       └── styles/
│           └── itinerary.module.css
├── shared/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Button.tsx
│   │   └── Modal.tsx
│   ├── hooks/
│   │   ├── useErrorHandler.ts
│   │   └── useLocalStorage.ts
│   ├── utils/
│   │   ├── dateUtils.ts
│   │   ├── errorUtils.ts
│   │   └── formatters.ts
│   └── types/
│       ├── index.ts
│       ├── api.ts
│       └── common.ts
├── db/
│   ├── schema.ts
│   ├── migrations/
│   └── seed.ts
└── app/
    ├── routes/
    │   ├── _index.tsx
    │   ├── trips/
    │   │   ├── _index.tsx
    │   │   ├── $tripId.tsx
    │   │   └── new.tsx
    │   └── api/
    │       └── trips.ts
    ├── root.tsx
    └── styles/
        └── global.css
```

## Database Schema

### Tables

```sql
-- Trips table
CREATE TABLE trips (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

```

## API Design

### RESTful Endpoints

**Trips**

- `GET /api/trips` - List all trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

**Activities**

- `GET /api/trips/:tripId/activities` - List trip activities
- `POST /api/trips/:tripId/activities` - Create activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity


## Data Flow Architecture

### Remix Loader/Action Pattern

```typescript
// Example: Trip detail page
export async function loader({ params }: LoaderFunctionArgs) {
  const trip = await getTripById(params.tripId);
  const activities = await getActivitiesByTripId(params.tripId);

  return json({ trip, activities });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  switch (intent) {
    case 'update-trip':
      return await updateTrip(params.tripId, formData);
    case 'delete-trip':
      return await deleteTrip(params.tripId);
    default:
      throw new Response('Invalid intent', { status: 400 });
  }
}
```

### Custom Hook Pattern

```typescript
// Example: useTrips hook
export function useTrips() {
  const fetcher = useFetcher<TripsData>();

  const createTrip = useCallback(
    (tripData: CreateTripData) => {
      fetcher.submit(tripData, { method: 'POST', action: '/api/trips' });
    },
    [fetcher]
  );

  const updateTrip = useCallback(
    (id: string, tripData: UpdateTripData) => {
      fetcher.submit(tripData, { method: 'PUT', action: `/api/trips/${id}` });
    },
    [fetcher]
  );

  return {
    trips: fetcher.data?.trips ?? [],
    isLoading: fetcher.state !== 'idle',
    error: fetcher.data?.error,
    createTrip,
    updateTrip,
  };
}
```

## Component Architecture

### Functional Components with Hooks

```typescript
// Example component structure
interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (tripId: string) => void;
}

export function TripCard({ trip, onEdit, onDelete }: TripCardProps): JSX.Element {
  const handleEdit = useCallback(() => onEdit(trip), [trip, onEdit]);
  const handleDelete = useCallback(() => onDelete(trip.id), [trip.id, onDelete]);

  return (
    <div className={styles.tripCard}>
      {/* Component JSX */}
    </div>
  );
}
```

## Error Handling Strategy

### Centralized Error Utilities

```typescript
// errorUtils.ts
export interface AppError {
  message: string;
  code?: string;
  details?: unknown;
}

export function createAppError(message: string, code?: string, details?: unknown): AppError {
  return { message, code, details };
}

export function handleDatabaseError(error: unknown): AppError {
  if (error instanceof Error) {
    return createAppError(error.message, 'DATABASE_ERROR', error);
  }
  return createAppError('An unknown database error occurred', 'UNKNOWN_ERROR');
}
```

### Try-Catch Pattern

```typescript
// Example service function
export async function createTrip(tripData: CreateTripData): Promise<Trip> {
  try {
    const trip = await db.insert(trips).values(tripData).returning();
    return trip[0];
  } catch (error) {
    const appError = handleDatabaseError(error);
    throw appError;
  }
}
```

## Performance Considerations

### Optimization Strategies

- **Database Indexing**: Index frequently queried fields (trip_id, dates)
- **Lazy Loading**: Load activities and packing lists only when needed
- **Memoization**: Use React.memo for expensive components
- **Bundle Splitting**: Remix automatic code splitting by route

### Caching Strategy

- **Server-side**: Remix loader caching
- **Client-side**: SWR-like patterns with useFetcher
- **Database**: SQLite query optimization

## Security Considerations

### Data Validation

- Server-side validation for all inputs
- TypeScript types for compile-time safety
- Sanitization of user inputs

### SQL Injection Prevention

- Drizzle ORM parameterized queries
- No raw SQL string concatenation

## Deployment Architecture

### Development Environment

- SQLite database file
- Local Remix dev server
- Hot module replacement

### Production Considerations

- SQLite with WAL mode for better concurrency
- Process management (PM2 or similar)
- Static asset optimization
- Environment variable configuration

## Future Scalability

### Potential Enhancements

- **Database**: Migration to PostgreSQL for multi-user support
- **Caching**: Redis for session management
- **File Storage**: S3 for photo attachments
- **Search**: Full-text search capabilities
- **Real-time**: WebSocket for collaborative features
