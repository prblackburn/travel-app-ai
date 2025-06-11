import { randomUUID } from 'crypto';
import Database from 'better-sqlite3';

interface TripData {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ActivityData {
  id: string;
  tripId: string;
  name: string;
  date: string;
  time?: string;
  location?: string;
  notes?: string;
}

interface PackingListData {
  id: string;
  tripId: string;
  name: string;
}

interface PackingItemData {
  id: string;
  listId: string;
  name: string;
  category?: string;
  quantity: number;
  isPacked: boolean;
}

async function seedDatabase(): Promise<void> {
  try {
    console.log('Seeding database with sample data...');
    
    const db = new Database('travel-app.db');
    
    // Sample trips
    const trips: TripData[] = [
      {
        id: randomUUID(),
        name: 'European Adventure',
        destination: 'Paris, France',
        startDate: '2024-06-15',
        endDate: '2024-06-22',
        description: 'A week-long exploration of Paris and surrounding areas',
      },
      {
        id: randomUUID(),
        name: 'Beach Vacation',
        destination: 'Maui, Hawaii',
        startDate: '2024-08-10',
        endDate: '2024-08-17',
        description: 'Relaxing beach vacation with family',
      },
    ];

    // Insert trips
    const insertTrip = db.prepare(
      'INSERT INTO trips (id, name, destination, start_date, end_date, description) VALUES (?, ?, ?, ?, ?, ?)'
    );
    
    for (const trip of trips) {
      insertTrip.run(trip.id, trip.name, trip.destination, trip.startDate, trip.endDate, trip.description);
    }

    // Sample activities
    const activities: ActivityData[] = [
      {
        id: randomUUID(),
        tripId: trips[0].id,
        name: 'Visit Eiffel Tower',
        date: '2024-06-16',
        time: '10:00',
        location: 'Champ de Mars, Paris',
        notes: 'Book tickets in advance',
      },
      {
        id: randomUUID(),
        tripId: trips[0].id,
        name: 'Louvre Museum',
        date: '2024-06-17',
        time: '14:00',
        location: 'Rue de Rivoli, Paris',
        notes: 'Focus on Mona Lisa and Venus de Milo',
      },
      {
        id: randomUUID(),
        tripId: trips[1].id,
        name: 'Snorkeling at Molokini Crater',
        date: '2024-08-12',
        time: '08:00',
        location: 'Molokini Crater',
        notes: 'Bring underwater camera',
      },
    ];

    // Insert activities
    const insertActivity = db.prepare(
      'INSERT INTO activities (id, trip_id, name, date, time, location, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    
    for (const activity of activities) {
      insertActivity.run(
        activity.id,
        activity.tripId,
        activity.name,
        activity.date,
        activity.time,
        activity.location,
        activity.notes
      );
    }

    // Sample packing lists
    const packingLists: PackingListData[] = [
      {
        id: randomUUID(),
        tripId: trips[0].id,
        name: 'Main Luggage',
      },
      {
        id: randomUUID(),
        tripId: trips[1].id,
        name: 'Beach Essentials',
      },
    ];

    // Insert packing lists
    const insertPackingList = db.prepare(
      'INSERT INTO packing_lists (id, trip_id, name) VALUES (?, ?, ?)'
    );
    
    for (const list of packingLists) {
      insertPackingList.run(list.id, list.tripId, list.name);
    }

    // Sample packing items
    const packingItems: PackingItemData[] = [
      {
        id: randomUUID(),
        listId: packingLists[0].id,
        name: 'Passport',
        category: 'Documents',
        quantity: 1,
        isPacked: true,
      },
      {
        id: randomUUID(),
        listId: packingLists[0].id,
        name: 'T-shirts',
        category: 'Clothing',
        quantity: 5,
        isPacked: false,
      },
      {
        id: randomUUID(),
        listId: packingLists[1].id,
        name: 'Sunscreen',
        category: 'Beach',
        quantity: 1,
        isPacked: false,
      },
      {
        id: randomUUID(),
        listId: packingLists[1].id,
        name: 'Swimsuit',
        category: 'Clothing',
        quantity: 2,
        isPacked: true,
      },
    ];

    // Insert packing items
    const insertPackingItem = db.prepare(
      'INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES (?, ?, ?, ?, ?, ?)'
    );
    
    for (const item of packingItems) {
      insertPackingItem.run(
        item.id,
        item.listId,
        item.name,
        item.category,
        item.quantity,
        item.isPacked ? 1 : 0
      );
    }

    db.close();
    
    console.log('✅ Database seeded successfully with sample data:');
    console.log(`   - ${trips.length} trips`);
    console.log(`   - ${activities.length} activities`);
    console.log(`   - ${packingLists.length} packing lists`);
    console.log(`   - ${packingItems.length} packing items`);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();