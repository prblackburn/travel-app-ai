-- Travel App Seed Data

-- Insert trips
INSERT INTO trips (id, name, destination, start_date, end_date, description) VALUES ('159aa274-c957-4830-b2c4-e51e1ddfcda9', 'European Adventure', 'Paris, France', '2024-06-15', '2024-06-22', 'A week-long exploration of Paris and surrounding areas, including museums, landmarks, and local cuisine');
INSERT INTO trips (id, name, destination, start_date, end_date, description) VALUES ('acbd4b55-bd75-44dd-a5cc-30cc25db6e34', 'Beach Vacation', 'Maui, Hawaii', '2024-08-10', '2024-08-17', 'Relaxing beach vacation with family - snorkeling, sunset dinners, and spa treatments');
INSERT INTO trips (id, name, destination, start_date, end_date, description) VALUES ('18e7ff81-df49-4b54-9ea4-054ec4d96732', 'Business Trip', 'Tokyo, Japan', '2024-09-05', '2024-09-08', 'Corporate meetings and conference attendance with some cultural exploration');

-- Insert activities
INSERT INTO activities (id, trip_id, name, date, time, location, notes) VALUES ('e7eac9c3-11dd-446a-a0d3-020551e4a1ae', '159aa274-c957-4830-b2c4-e51e1ddfcda9', 'Visit Eiffel Tower', '2024-06-16', '10:00', 'Champ de Mars, Paris', 'Book tickets in advance, go early to avoid crowds');
INSERT INTO activities (id, trip_id, name, date, time, location, notes) VALUES ('9ddf310b-9f2a-491c-8934-3161f8aee69a', '159aa274-c957-4830-b2c4-e51e1ddfcda9', 'Louvre Museum', '2024-06-17', '14:00', 'Rue de Rivoli, Paris', 'Focus on Mona Lisa and Venus de Milo, allow 3-4 hours');
INSERT INTO activities (id, trip_id, name, date, time, location, notes) VALUES ('d58ae497-0012-4339-9149-d604e933a797', '159aa274-c957-4830-b2c4-e51e1ddfcda9', 'Seine River Cruise', '2024-06-18', '19:30', 'Port de la Bourdonnais', 'Evening cruise with dinner, romantic setting');
INSERT INTO activities (id, trip_id, name, date, time, location, notes) VALUES ('c49e8621-1ed4-4864-9bce-dfb358ec1e18', '159aa274-c957-4830-b2c4-e51e1ddfcda9', 'Montmartre & Sacré-Cœur', '2024-06-19', '11:00', 'Montmartre District', 'Explore artist quarter, street performers, great views');
INSERT INTO activities (id, trip_id, name, date, time, location, notes) VALUES ('556b327e-7325-4ba7-a38c-f7f526563dd0', 'acbd4b55-bd75-44dd-a5cc-30cc25db6e34', 'Snorkeling at Molokini Crater', '2024-08-12', '08:00', 'Molokini Crater', 'Bring underwater camera, early morning tour');
INSERT INTO activities (id, trip_id, name, date, time, location, notes) VALUES ('fece5bf8-468d-4022-9a9f-9f4335056c70', 'acbd4b55-bd75-44dd-a5cc-30cc25db6e34', 'Road to Hana Drive', '2024-08-13', '07:00', 'Hana Highway', 'Full day adventure, pack lunch and water');
INSERT INTO activities (id, trip_id, name, date, time, location, notes) VALUES ('4a8d3491-49ef-4e7a-bb91-4c012b6bf0df', 'acbd4b55-bd75-44dd-a5cc-30cc25db6e34', 'Sunset at Haleakala', '2024-08-14', '17:00', 'Haleakala National Park', 'Dress warmly, arrive early for parking');
INSERT INTO activities (id, trip_id, name, date, time, location, notes) VALUES ('af1e5074-91d7-4a0c-af55-267961c4e187', 'acbd4b55-bd75-44dd-a5cc-30cc25db6e34', 'Spa Day at Resort', '2024-08-15', '10:00', 'Resort Spa', 'Couples massage booked, very relaxing');
INSERT INTO activities (id, trip_id, name, date, time, location, notes) VALUES ('51a58647-c986-4ce5-a27c-20c133469686', '18e7ff81-df49-4b54-9ea4-054ec4d96732', 'Conference Registration', '2024-09-05', '09:00', 'Tokyo International Forum', 'Pick up badge and materials, network with colleagues');
INSERT INTO activities (id, trip_id, name, date, time, location, notes) VALUES ('dcdbf60d-cdd6-4a37-a16e-7e1e42b4f0bd', '18e7ff81-df49-4b54-9ea4-054ec4d96732', 'Keynote Presentation', '2024-09-06', '10:00', 'Tokyo International Forum', 'Take notes for team back home');
INSERT INTO activities (id, trip_id, name, date, time, location, notes) VALUES ('da4132fe-a602-4b84-acb3-6add7fef45cc', '18e7ff81-df49-4b54-9ea4-054ec4d96732', 'Sushi Dinner at Tsukiji', '2024-09-06', '19:00', 'Tsukiji Outer Market', 'Authentic sushi experience, try omakase');
INSERT INTO activities (id, trip_id, name, date, time, location, notes) VALUES ('bf85f8ca-613c-4ae1-be0b-7225bd823ddc', '18e7ff81-df49-4b54-9ea4-054ec4d96732', 'Visit Senso-ji Temple', '2024-09-07', '08:00', 'Asakusa District', 'Early morning visit, traditional shopping street');

-- Insert packing lists
INSERT INTO packing_lists (id, trip_id, name) VALUES ('0d5bd412-f077-446b-82a4-2c65a7c5ab67', '159aa274-c957-4830-b2c4-e51e1ddfcda9', 'Main Luggage');
INSERT INTO packing_lists (id, trip_id, name) VALUES ('c7c8b2ee-fd52-4f41-aaa0-d963bb550f75', '159aa274-c957-4830-b2c4-e51e1ddfcda9', 'Carry-on Essentials');
INSERT INTO packing_lists (id, trip_id, name) VALUES ('50e5386e-1b96-44fd-ae40-2483b522ffea', 'acbd4b55-bd75-44dd-a5cc-30cc25db6e34', 'Beach Essentials');
INSERT INTO packing_lists (id, trip_id, name) VALUES ('2a457080-89e6-426c-8f80-edd0cff477e7', 'acbd4b55-bd75-44dd-a5cc-30cc25db6e34', 'Family Activities');
INSERT INTO packing_lists (id, trip_id, name) VALUES ('bba6e5d3-887e-43a5-9eca-0e381cb1e64c', '18e7ff81-df49-4b54-9ea4-054ec4d96732', 'Business Travel');

-- Insert packing items
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('5c4fbc2b-ad3e-485c-9dca-b253a27bdef4', '0d5bd412-f077-446b-82a4-2c65a7c5ab67', 'Passport', 'Documents', 1, 1);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('6c59b388-52bf-4edd-855b-35c9a66cd845', '0d5bd412-f077-446b-82a4-2c65a7c5ab67', 'T-shirts', 'Clothing', 5, 0);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('073c4040-4628-46b0-b61b-e4054bff3550', '0d5bd412-f077-446b-82a4-2c65a7c5ab67', 'Jeans', 'Clothing', 2, 0);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('0e962bfa-7b87-4d59-bf08-e1b49840f284', '0d5bd412-f077-446b-82a4-2c65a7c5ab67', 'Walking Shoes', 'Clothing', 1, 1);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('56b05f05-aa6a-4e02-bf81-67b3209202cf', '0d5bd412-f077-446b-82a4-2c65a7c5ab67', 'Camera', 'Electronics', 1, 0);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('628d2464-d486-46b1-8065-aaa8014f9a7b', 'c7c8b2ee-fd52-4f41-aaa0-d963bb550f75', 'Phone Charger', 'Electronics', 1, 1);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('a44e09fb-ec7b-478b-a9e6-c66434574ae6', 'c7c8b2ee-fd52-4f41-aaa0-d963bb550f75', 'Travel Adapter', 'Electronics', 1, 0);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('5ad9e9ef-873d-4070-9b77-391d496a655c', 'c7c8b2ee-fd52-4f41-aaa0-d963bb550f75', 'Medications', 'Health', 1, 1);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('df07df9a-37e3-4710-893d-d7563cee7085', '50e5386e-1b96-44fd-ae40-2483b522ffea', 'Sunscreen', 'Beach', 1, 0);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('990e80c5-0bfd-4e78-b7a0-e50145386164', '50e5386e-1b96-44fd-ae40-2483b522ffea', 'Swimsuit', 'Clothing', 2, 1);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('a8339b02-5576-4899-a9ca-97113ca5c800', '50e5386e-1b96-44fd-ae40-2483b522ffea', 'Beach Towels', 'Beach', 2, 0);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('e4f4931d-8249-4552-a5b4-cf1c4a8625a4', '50e5386e-1b96-44fd-ae40-2483b522ffea', 'Snorkel Gear', 'Beach', 1, 0);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('5b63fc2c-9d85-496f-a3af-5cb756151ea4', '50e5386e-1b96-44fd-ae40-2483b522ffea', 'Flip Flops', 'Clothing', 1, 1);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('068fe8ba-4a37-4e2a-a13b-6fc8722393b0', '2a457080-89e6-426c-8f80-edd0cff477e7', 'Kids Snacks', 'Food', 5, 0);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('1bc316cf-d005-4606-8a33-3655be0cabef', '2a457080-89e6-426c-8f80-edd0cff477e7', 'Waterproof Camera', 'Electronics', 1, 0);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('22a7dd1f-0055-4292-b89a-ad11cd601616', '2a457080-89e6-426c-8f80-edd0cff477e7', 'Sun Hats', 'Clothing', 3, 1);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('a4518660-a67a-44d1-bc9c-bbeb5d0839cd', '2a457080-89e6-426c-8f80-edd0cff477e7', 'First Aid Kit', 'Health', 1, 1);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('cfa3552d-aef7-4934-9de1-65efe17bab8c', 'bba6e5d3-887e-43a5-9eca-0e381cb1e64c', 'Business Cards', 'Documents', 50, 1);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('6a1b43cb-8ab9-4157-aeb5-d3355b4961c9', 'bba6e5d3-887e-43a5-9eca-0e381cb1e64c', 'Dress Shirts', 'Clothing', 3, 0);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('91c301c6-fb21-474b-9747-c48b664daf7b', 'bba6e5d3-887e-43a5-9eca-0e381cb1e64c', 'Laptop', 'Electronics', 1, 1);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('f097448b-1659-4c8c-8e3f-2abef8ee2fcc', 'bba6e5d3-887e-43a5-9eca-0e381cb1e64c', 'Presentation Materials', 'Documents', 1, 0);
INSERT INTO packing_items (id, list_id, name, category, quantity, is_packed) VALUES ('0ea3ed2a-84c3-47d2-b195-41b529a12df3', 'bba6e5d3-887e-43a5-9eca-0e381cb1e64c', 'Formal Shoes', 'Clothing', 1, 0);
