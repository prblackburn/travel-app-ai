import { randomUUID } from 'crypto';
import { writeFileSync } from 'fs';

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


function seedDatabase(): void {
  try {
    console.log('Generating seed data SQL...');

    let sql = '-- Travel App Seed Data\n\n';

    // Sample trips
    const trips: TripData[] = [
      {
        id: randomUUID(),
        name: 'European Adventure',
        destination: 'Paris, France',
        startDate: '2024-06-15',
        endDate: '2024-06-22',
        description:
          'A week-long exploration of Paris and surrounding areas, including museums, landmarks, and local cuisine',
      },
      {
        id: randomUUID(),
        name: 'Beach Vacation',
        destination: 'Maui, Hawaii',
        startDate: '2024-08-10',
        endDate: '2024-08-17',
        description:
          'Relaxing beach vacation with family - snorkeling, sunset dinners, and spa treatments',
      },
      {
        id: randomUUID(),
        name: 'Business Trip',
        destination: 'Tokyo, Japan',
        startDate: '2024-09-05',
        endDate: '2024-09-08',
        description: 'Corporate meetings and conference attendance with some cultural exploration',
      },
    ];

    // Generate trip insert statements
    sql += '-- Insert trips\n';
    for (const trip of trips) {
      sql += `INSERT INTO trips (id, name, destination, start_date, end_date, description) VALUES ('${trip.id}', '${trip.name.replace(/'/g, "''")}', '${trip.destination.replace(/'/g, "''")}', '${trip.startDate}', '${trip.endDate}', '${trip.description.replace(/'/g, "''")}');\n`;
    }
    sql += '\n';

    // Sample activities
    const activities: ActivityData[] = [
      // Paris trip activities
      {
        id: randomUUID(),
        tripId: trips[0].id,
        name: 'Visit Eiffel Tower',
        date: '2024-06-16',
        time: '10:00',
        location: 'Champ de Mars, Paris',
        notes: 'Book tickets in advance, go early to avoid crowds',
      },
      {
        id: randomUUID(),
        tripId: trips[0].id,
        name: 'Louvre Museum',
        date: '2024-06-17',
        time: '14:00',
        location: 'Rue de Rivoli, Paris',
        notes: 'Focus on Mona Lisa and Venus de Milo, allow 3-4 hours',
      },
      {
        id: randomUUID(),
        tripId: trips[0].id,
        name: 'Seine River Cruise',
        date: '2024-06-18',
        time: '19:30',
        location: 'Port de la Bourdonnais',
        notes: 'Evening cruise with dinner, romantic setting',
      },
      {
        id: randomUUID(),
        tripId: trips[0].id,
        name: 'Montmartre & Sacré-Cœur',
        date: '2024-06-19',
        time: '11:00',
        location: 'Montmartre District',
        notes: 'Explore artist quarter, street performers, great views',
      },
      // Hawaii trip activities
      {
        id: randomUUID(),
        tripId: trips[1].id,
        name: 'Snorkeling at Molokini Crater',
        date: '2024-08-12',
        time: '08:00',
        location: 'Molokini Crater',
        notes: 'Bring underwater camera, early morning tour',
      },
      {
        id: randomUUID(),
        tripId: trips[1].id,
        name: 'Road to Hana Drive',
        date: '2024-08-13',
        time: '07:00',
        location: 'Hana Highway',
        notes: 'Full day adventure, pack lunch and water',
      },
      {
        id: randomUUID(),
        tripId: trips[1].id,
        name: 'Sunset at Haleakala',
        date: '2024-08-14',
        time: '17:00',
        location: 'Haleakala National Park',
        notes: 'Dress warmly, arrive early for parking',
      },
      {
        id: randomUUID(),
        tripId: trips[1].id,
        name: 'Spa Day at Resort',
        date: '2024-08-15',
        time: '10:00',
        location: 'Resort Spa',
        notes: 'Couples massage booked, very relaxing',
      },
      // Tokyo trip activities
      {
        id: randomUUID(),
        tripId: trips[2].id,
        name: 'Conference Registration',
        date: '2024-09-05',
        time: '09:00',
        location: 'Tokyo International Forum',
        notes: 'Pick up badge and materials, network with colleagues',
      },
      {
        id: randomUUID(),
        tripId: trips[2].id,
        name: 'Keynote Presentation',
        date: '2024-09-06',
        time: '10:00',
        location: 'Tokyo International Forum',
        notes: 'Take notes for team back home',
      },
      {
        id: randomUUID(),
        tripId: trips[2].id,
        name: 'Sushi Dinner at Tsukiji',
        date: '2024-09-06',
        time: '19:00',
        location: 'Tsukiji Outer Market',
        notes: 'Authentic sushi experience, try omakase',
      },
      {
        id: randomUUID(),
        tripId: trips[2].id,
        name: 'Visit Senso-ji Temple',
        date: '2024-09-07',
        time: '08:00',
        location: 'Asakusa District',
        notes: 'Early morning visit, traditional shopping street',
      },
    ];

    // Generate activity insert statements
    sql += '-- Insert activities\n';
    for (const activity of activities) {
      const time = activity.time ? `'${activity.time}'` : 'NULL';
      const location = activity.location ? `'${activity.location.replace(/'/g, "''")}'` : 'NULL';
      const notes = activity.notes ? `'${activity.notes.replace(/'/g, "''")}'` : 'NULL';
      sql += `INSERT INTO activities (id, trip_id, name, date, time, location, notes) VALUES ('${activity.id}', '${activity.tripId}', '${activity.name.replace(/'/g, "''")}', '${activity.date}', ${time}, ${location}, ${notes});\n`;
    }
    sql += '\n';


    // Write SQL file
    const sqlFilePath = 'src/db/seed.sql';
    writeFileSync(sqlFilePath, sql);

    console.log(`✅ Seed SQL generated at ${sqlFilePath}`);
    console.log(`   - ${trips.length} trips (Paris, Hawaii, Tokyo)`);
    console.log(`   - ${activities.length} activities (museums, beaches, business)`);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
