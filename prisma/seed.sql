-- Create the Demo Gym
INSERT INTO "Gym" (id, name, address, phone, email, "apiKey", "isActive", "createdAt", "updatedAt")
VALUES (
  'gym001',
  'Demo Gym',
  '123 Main St, City, Country',
  '+1234567890',
  'contact@demogym.com',
  '8a35fca367daf2a2b99ecae494d999864eaab6f9fbfa7c47e25cc49fa9f0d5c4',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Create Admin and Staff Users
-- Admin password is: admin123
INSERT INTO "User" (id, name, email, password, role, "gymId", "createdAt", "updatedAt")
VALUES
  ('admin001', 'Gym Admin', 'admin@demogym.com', '$2b$10$sOl/.yjsyfqBTPmKa2EVe.04AqmYNoPiUlqKnFAk33wvWCCtb89eG', 'ADMIN', 'gym001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('staff001', 'John Smith', 'john.smith@example.com', '$2b$10$sOl/.yjsyfqBTPmKa2EVe.04AqmYNoPiUlqKnFAk33wvWCCtb89eG', 'STAFF', 'gym001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('staff002', 'Sarah Johnson', 'sarah.johnson@example.com', '$2b$10$sOl/.yjsyfqBTPmKa2EVe.04AqmYNoPiUlqKnFAk33wvWCCtb89eG', 'STAFF', 'gym001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('staff003', 'Mike Wilson', 'mike.wilson@example.com', '$2b$10$sOl/.yjsyfqBTPmKa2EVe.04AqmYNoPiUlqKnFAk33wvWCCtb89eG', 'STAFF', 'gym001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Create Regular Members
INSERT INTO "User" (id, name, email, password, role, "gymId", "createdAt", "updatedAt")
VALUES
  ('member001', 'Alice Cooper', 'alice.cooper@example.com', '$2b$10$sOl/.yjsyfqBTPmKa2EVe.04AqmYNoPiUlqKnFAk33wvWCCtb89eG', 'MEMBER', 'gym001', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP),
  ('member002', 'Bob Dylan', 'bob.dylan@example.com', '$2b$10$sOl/.yjsyfqBTPmKa2EVe.04AqmYNoPiUlqKnFAk33wvWCCtb89eG', 'MEMBER', 'gym001', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP),
  ('member003', 'Charlie Brown', 'charlie.brown@example.com', '$2b$10$sOl/.yjsyfqBTPmKa2EVe.04AqmYNoPiUlqKnFAk33wvWCCtb89eG', 'MEMBER', 'gym001', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP),
  ('member004', 'Diana Ross', 'diana.ross@example.com', '$2b$10$sOl/.yjsyfqBTPmKa2EVe.04AqmYNoPiUlqKnFAk33wvWCCtb89eG', 'MEMBER', 'gym001', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP),
  ('member005', 'Elvis Presley', 'elvis.presley@example.com', '$2b$10$sOl/.yjsyfqBTPmKa2EVe.04AqmYNoPiUlqKnFAk33wvWCCtb89eG', 'MEMBER', 'gym001', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP),
  ('member006', 'Robin', 'krobin.it@gmail.com', '$2b$10$sOl/.yjsyfqBTPmKa2EVe.04AqmYNoPiUlqKnFAk33wvWCCtb89eG', 'MEMBER', 'gym001', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP);

-- Create Membership Plans
INSERT INTO "MembershipPlan" (id, name, description, price, features, "isActive", "gymId", "createdAt", "updatedAt")
VALUES
  ('plan001', 'Day Pass', 'Full access for 24 hours', 15.99, ARRAY['Full gym access', 'Locker room access', 'Valid for 24 hours', 'No commitment'], true, 'gym001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan002', 'Weekly Pass', 'Perfect for visitors and trials', 39.99, ARRAY['Full gym access', 'Locker room access', 'Valid for 7 days', 'Group classes included'], true, 'gym001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan003', 'Monthly Plan', 'Most popular option', 79.99, ARRAY['Full gym access', 'Locker room access', 'Group classes included', 'Fitness assessment', 'One personal training session'], true, 'gym001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan004', '6-Month Plan', 'Great value for committed members', 399.99, ARRAY['Full gym access', 'Locker room access', 'Group classes included', 'Quarterly fitness assessment', 'Three personal training sessions', 'Nutrition consultation'], true, 'gym001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan005', 'Annual Plan', 'Best value for dedicated members', 699.99, ARRAY['Full gym access', 'Locker room access', 'Group classes included', 'Quarterly fitness assessment', 'Monthly personal training session', 'Nutrition consultation', 'Guest passes (2 per month)', 'Priority booking for classes'], true, 'gym001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Create Memberships
INSERT INTO "Membership" (id, "userId", "planId", "startDate", "endDate", price, status, type, "createdAt", "updatedAt")
VALUES
  ('mem001', 'member001', 'plan004', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP + INTERVAL '120 days', 399.99, 'ACTIVE', 'SIX_MONTHS', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP),
  ('mem002', 'member002', 'plan003', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP - INTERVAL '15 days', 79.99, 'EXPIRED', 'ONE_MONTH', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP),
  ('mem003', 'member003', 'plan003', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP, 79.99, 'ACTIVE', 'ONE_MONTH', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP),
  ('mem004', 'member004', 'plan005', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP + INTERVAL '350 days', 699.99, 'ACTIVE', 'ANNUAL', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP),
  ('mem005', 'member005', 'plan002', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP, 39.99, 'ACTIVE', 'ONE_WEEK', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP),
  ('mem006', 'member006', 'plan003', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '27 days', 79.99, 'ACTIVE', 'ONE_MONTH', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP);

-- Create Payments
INSERT INTO "Payment" (id, "userId", "gymId", amount, status, "paymentMethod", "createdAt", "updatedAt")
VALUES
  -- Current active memberships
  ('pay001', 'member001', 'gym001', 399.99, 'COMPLETED', 'CREDIT_CARD', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP - INTERVAL '60 days'),
  ('pay002', 'member002', 'gym001', 79.99, 'COMPLETED', 'DEBIT_CARD', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP - INTERVAL '45 days'),
  ('pay003', 'member003', 'gym001', 79.99, 'COMPLETED', 'BANK_TRANSFER', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '30 days'),
  ('pay004', 'member004', 'gym001', 699.99, 'COMPLETED', 'CREDIT_CARD', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '15 days'),
  ('pay005', 'member005', 'gym001', 39.99, 'COMPLETED', 'ONLINE', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '7 days'),
  ('pay014', 'member006', 'gym001', 79.99, 'COMPLETED', 'CREDIT_CARD', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
  
  -- Past payments for Bob (member002)
  ('pay006', 'member002', 'gym001', 79.99, 'COMPLETED', 'DEBIT_CARD', CURRENT_TIMESTAMP - INTERVAL '75 days', CURRENT_TIMESTAMP - INTERVAL '75 days'),
  ('pay007', 'member002', 'gym001', 79.99, 'COMPLETED', 'DEBIT_CARD', CURRENT_TIMESTAMP - INTERVAL '105 days', CURRENT_TIMESTAMP - INTERVAL '105 days'),
  
  -- Past payments for Alice (member001)
  ('pay008', 'member001', 'gym001', 399.99, 'COMPLETED', 'CREDIT_CARD', CURRENT_TIMESTAMP - INTERVAL '180 days', CURRENT_TIMESTAMP - INTERVAL '180 days'),
  ('pay009', 'member001', 'gym001', 399.99, 'COMPLETED', 'CREDIT_CARD', CURRENT_TIMESTAMP - INTERVAL '240 days', CURRENT_TIMESTAMP - INTERVAL '240 days'),
  
  -- Failed payments
  ('pay010', 'member002', 'gym001', 79.99, 'FAILED', 'CREDIT_CARD', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '20 days'),
  ('pay011', 'member003', 'gym001', 79.99, 'FAILED', 'BANK_TRANSFER', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '25 days'),
  
  -- Refunded payments
  ('pay012', 'member004', 'gym001', 699.99, 'REFUNDED', 'CREDIT_CARD', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP - INTERVAL '45 days'),
  
  -- Pending payments
  ('pay013', 'member005', 'gym001', 39.99, 'PENDING', 'ONLINE', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days');

-- Create Check-ins
INSERT INTO "CheckIn" (id, "userId", "gymId", "checkInTime", "checkOutTime", "createdAt", "updatedAt")
VALUES
  ('checkin001', 'member001', 'gym001', CURRENT_TIMESTAMP - INTERVAL '50 days', CURRENT_TIMESTAMP - INTERVAL '49 days 22 hours', CURRENT_TIMESTAMP - INTERVAL '50 days', CURRENT_TIMESTAMP - INTERVAL '49 days 22 hours'),
  ('checkin002', 'member001', 'gym001', CURRENT_TIMESTAMP - INTERVAL '40 days', CURRENT_TIMESTAMP - INTERVAL '39 days 23 hours', CURRENT_TIMESTAMP - INTERVAL '40 days', CURRENT_TIMESTAMP - INTERVAL '39 days 23 hours'),
  ('checkin003', 'member002', 'gym001', CURRENT_TIMESTAMP - INTERVAL '35 days', CURRENT_TIMESTAMP - INTERVAL '34 days 23 hours', CURRENT_TIMESTAMP - INTERVAL '35 days', CURRENT_TIMESTAMP - INTERVAL '34 days 23 hours'),
  ('checkin004', 'member003', 'gym001', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '24 days 23 hours', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '24 days 23 hours'),
  ('checkin005', 'member004', 'gym001', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '9 days 23 hours', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '9 days 23 hours'),
  ('checkin006', 'member005', 'gym001', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '4 days 23 hours', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '4 days 23 hours'),
  ('checkin007', 'member001', 'gym001', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 day 23 hours', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 day 23 hours'),
  ('checkin008', 'member003', 'gym001', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '23 hours', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '23 hours');

-- Create Gym Classes
INSERT INTO "GymClass" (id, name, description, schedule, duration, capacity, "bookedSpots", category, difficulty, equipment, requirements, instructor, "gymId", "createdAt", "updatedAt")
VALUES
  (
    'class001',
    'Morning Yoga',
    'Start your day with a rejuvenating yoga session',
    '[{"day": "Monday", "time": "07:00"}, {"day": "Wednesday", "time": "07:00"}, {"day": "Friday", "time": "07:00"}]',
    60,
    20,
    0,
    'Yoga',
    'Beginner',
    ARRAY['Yoga mat', 'Blocks', 'Strap'],
    ARRAY['No prior experience needed', 'Comfortable clothing'],
    'Sarah Johnson',
    'gym001',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'class002',
    'HIIT Training',
    'High-intensity interval training for maximum calorie burn',
    '[{"day": "Monday", "time": "18:00"}, {"day": "Wednesday", "time": "18:00"}, {"day": "Friday", "time": "18:00"}]',
    45,
    15,
    0,
    'Cardio',
    'Advanced',
    ARRAY['None'],
    ARRAY['Good fitness level', 'Water bottle'],
    'Mike Wilson',
    'gym001',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'class003',
    'Strength Training',
    'Build muscle and increase strength with proper form',
    '[{"day": "Tuesday", "time": "09:00"}, {"day": "Thursday", "time": "09:00"}, {"day": "Saturday", "time": "10:00"}]',
    60,
    12,
    0,
    'Strength',
    'Intermediate',
    ARRAY['Dumbbells', 'Barbells', 'Resistance bands'],
    ARRAY['Basic gym experience', 'Proper form knowledge'],
    'John Smith',
    'gym001',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'class004',
    'Zumba Dance',
    'Fun and energetic dance workout for all levels',
    '[{"day": "Tuesday", "time": "19:00"}, {"day": "Thursday", "time": "19:00"}, {"day": "Saturday", "time": "11:00"}]',
    45,
    25,
    0,
    'Dance',
    'Beginner',
    ARRAY['None'],
    ARRAY['Comfortable shoes', 'Water bottle'],
    'Sarah Johnson',
    'gym001',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'class005',
    'Pilates',
    'Core strengthening and flexibility training',
    '[{"day": "Monday", "time": "10:00"}, {"day": "Wednesday", "time": "10:00"}, {"day": "Friday", "time": "10:00"}]',
    45,
    15,
    0,
    'Flexibility',
    'Intermediate',
    ARRAY['Pilates mat', 'Resistance bands'],
    ARRAY['No prior experience needed', 'Comfortable clothing'],
    'Mike Wilson',
    'gym001',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

-- Create Class Attendees (Many-to-Many relationship)
INSERT INTO "_GymClassToUser" ("A", "B")
VALUES
  ('class001', 'member001'),  -- Alice attends Morning Yoga
  ('class001', 'member003'),  -- Charlie attends Morning Yoga
  ('class002', 'member004'),  -- Diana attends HIIT Training
  ('class002', 'member001'),  -- Alice attends HIIT Training
  ('class003', 'member002'),  -- Bob attends Strength Training
  ('class004', 'member005'),  -- Elvis attends Zumba Dance
  ('class004', 'member003'),  -- Charlie attends Zumba Dance
  ('class005', 'member004');  -- Diana attends Pilates 