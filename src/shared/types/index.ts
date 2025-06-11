// Core Entity Types
// Exactly matching database schema from src/db/schema.ts and seed data

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string; // YYYY-MM-DD format matching database
  endDate: string; // YYYY-MM-DD format matching database
  description?: string;
  createdAt: string; // ISO datetime string from CURRENT_TIMESTAMP
  updatedAt: string; // ISO datetime string from CURRENT_TIMESTAMP
}

export interface Activity {
  id: string;
  tripId: string;
  name: string;
  date: string; // YYYY-MM-DD format matching database
  time?: string; // HH:MM format optional
  location?: string;
  notes?: string;
  createdAt: string; // ISO datetime string from CURRENT_TIMESTAMP
  updatedAt: string; // ISO datetime string from CURRENT_TIMESTAMP
}

export interface PackingList {
  id: string;
  tripId: string;
  name: string;
  createdAt: string; // ISO datetime string from CURRENT_TIMESTAMP
  updatedAt: string; // ISO datetime string from CURRENT_TIMESTAMP
}

export interface PackingItem {
  id: string;
  listId: string;
  name: string;
  category?: string;
  quantity: number; // integer, default 1 in database
  isPacked: boolean; // boolean mode in SQLite, default false
  createdAt: string; // ISO datetime string from CURRENT_TIMESTAMP
  updatedAt: string; // ISO datetime string from CURRENT_TIMESTAMP
}

// Form Data Types (for create/update operations)

export interface CreateTripData {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface UpdateTripData {
  name?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
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

export interface CreatePackingListData {
  tripId: string;
  name: string;
}

export interface UpdatePackingListData {
  name?: string;
}

export interface CreatePackingItemData {
  listId: string;
  name: string;
  category?: string;
  quantity?: number;
}

export interface UpdatePackingItemData {
  name?: string;
  category?: string;
  quantity?: number;
  isPacked?: boolean;
}

// API Response Types

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

// Utility Types

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

// Extended Entity Types (with relationships)

export interface TripWithRelations extends Trip {
  activities?: Activity[];
  packingLists?: PackingListWithItems[];
}

export interface PackingListWithItems extends PackingList {
  items?: PackingItem[];
}

export interface PackingProgress {
  totalItems: number;
  packedItems: number;
  percentage: number;
}

// Search and Filter Types

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

export interface PackingItemFilters {
  listId: string;
  category?: string;
  isPacked?: boolean;
  sortBy?: 'name' | 'category' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Common Packing Categories (based on seed data and functional requirements)

export const PACKING_CATEGORIES = [
  'Clothing',
  'Documents', 
  'Electronics',
  'Toiletries',
  'Beach', // from seed data
  'Medications',
  'Entertainment',
  'Outdoor Gear',
  'Food & Snacks',
  'Emergency',
  'Other',
] as const;

export type PackingCategory = (typeof PACKING_CATEGORIES)[number];

// Time and Date Utilities Types

export interface DateRange {
  start: string;
  end: string;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  conflictingActivity?: Activity;
}

// Hook Return Types (for custom hooks)

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

export interface UsePackingReturn {
  packingLists: PackingListWithItems[];
  isLoading: boolean;
  error: AppError | null;
  createPackingList: (data: CreatePackingListData) => Promise<void>;
  updatePackingList: (id: string, data: UpdatePackingListData) => Promise<void>;
  deletePackingList: (id: string) => Promise<void>;
  createPackingItem: (data: CreatePackingItemData) => Promise<void>;
  updatePackingItem: (id: string, data: UpdatePackingItemData) => Promise<void>;
  deletePackingItem: (id: string) => Promise<void>;
  togglePackingItem: (id: string) => Promise<void>;
  getPackingProgress: (listId: string) => PackingProgress;
  refreshPackingLists: () => Promise<void>;
}

// Component Props Types

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

export interface PackingItemProps {
  item: PackingItem;
  onToggle: (itemId: string) => void;
  onEdit: (item: PackingItem) => void;
  onDelete: (itemId: string) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Form Component Props

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

export interface PackingItemFormProps {
  item?: PackingItem;
  listId: string;
  onSubmit: (data: CreatePackingItemData | UpdatePackingItemData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  errors?: ValidationError[];
}