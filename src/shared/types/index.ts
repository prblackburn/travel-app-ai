export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  tripId: string;
  name: string;
  date: string;
  time?: string | null;
  location?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripData {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string | null;
}

export interface UpdateTripData {
  name?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  description?: string | null;
}

export interface CreateActivityData {
  tripId: string;
  name: string;
  date: string;
  time?: string;
  location?: string;
  notes?: string;
}

export interface UpdateActivityData {
  name?: string;
  date?: string;
  time?: string;
  location?: string;
  notes?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: AppError;
  success: boolean;
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  total?: number;
  page?: number;
  limit?: number;
}

export interface AppError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isValid: boolean;
}

export interface TripWithRelations extends Trip {
  activities?: Activity[];
}

export interface TripFilters {
  destination?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'name' | 'startDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ActivityFilters {
  tripId: string;
  date?: string;
  location?: string;
  sortBy?: 'date' | 'time' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface DateRange {
  start: string;
  end: string;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  conflictingActivity?: Activity;
}

export interface UseTripsReturn {
  trips: Trip[];
  isLoading: boolean;
  error: AppError | null;
  createTrip: (data: CreateTripData) => Promise<void>;
  updateTrip: (id: string, data: UpdateTripData) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  refreshTrips: () => Promise<void>;
}

export interface UseActivitiesReturn {
  activities: Activity[];
  isLoading: boolean;
  error: AppError | null;
  createActivity: (data: CreateActivityData) => Promise<void>;
  updateActivity: (id: string, data: UpdateActivityData) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  refreshActivities: () => Promise<void>;
}

export interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (tripId: string) => void;
  onView: (tripId: string) => void;
}

export interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
  showConflicts?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface TripFormProps {
  trip?: Trip;
  onSubmit: (data: CreateTripData | UpdateTripData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  errors?: ValidationError[];
}

export interface ActivityFormProps {
  activity?: Activity;
  tripId: string;
  tripDateRange: DateRange;
  onSubmit: (data: CreateActivityData | UpdateActivityData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  errors?: ValidationError[];
}

