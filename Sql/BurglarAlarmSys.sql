-- 1. Users table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,  -- Added email field
    failed_logins INT DEFAULT 0,
    is_thief BOOLEAN DEFAULT FALSE
);


-- 2. Houses table
CREATE TABLE Houses (
    house_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    longitude DECIMAL NOT NULL,  -- Match with Sequelize model
    latitude DECIMAL NOT NULL,   -- Match with Sequelize model
    address VARCHAR(255) NOT NULL, -- Match with Sequelize model
    UNIQUE (user_id)  -- One house per user
);


-- 5. Sensors table
CREATE TABLE Sensors (
    sensor_id SERIAL PRIMARY KEY,
    sensor_type VARCHAR(50) NOT NULL CHECK (sensor_type IN ('Movement Detector', 'Door Sensor'))
);

-- 3. Rooms table
CREATE TABLE Rooms (
    room_id SERIAL PRIMARY KEY,
    house_id INT REFERENCES Houses(house_id) ON DELETE CASCADE,
    room_name VARCHAR(50) NOT NULL,
    sensor_id INT REFERENCES Sensors(sensor_id) ON DELETE CASCADE
);

-- 4. Furniture table
CREATE TABLE Furniture (
    furniture_id SERIAL PRIMARY KEY,
    room_id INT REFERENCES Rooms(room_id) ON DELETE CASCADE,
    furniture_name VARCHAR(50) NOT NULL,
    sensor_id INT REFERENCES Sensors(sensor_id)
);



-- 6. Police_Tracking table (for monitoring by police)
CREATE TABLE Police_Tracking (
    track_id SERIAL PRIMARY KEY,
    theft_log_id INT REFERENCES Theft_Logs(log_id),  -- Reference to the Theft Log
    resolved BOOLEAN DEFAULT FALSE,  -- Default to false, indicating it's not resolved
    resolved_timestamp TIMESTAMPTZ  -- The timestamp when it's marked resolved (optional)
);


-- 7. Theft_Logs table (to log unauthorized access events)
CREATE TABLE Theft_Logs (
    log_id SERIAL PRIMARY KEY,
    house_id INT REFERENCES Houses(house_id),  -- Add the house_id field and reference it
    user_id INT REFERENCES Users(user_id),
    room_id INT REFERENCES Rooms(room_id),
    action_taken VARCHAR(255),
    log_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------------------------------------

-- 1. Users table with hashed passwords
INSERT INTO Users (username, password_hash, failed_logins, is_thief)
VALUES
    ('user1', 'hash1', 0, FALSE),
    ('user2', 'hash2', 1, TRUE),
    ('user3', 'hash3', 0, FALSE);



-- 2. Houses table
INSERT INTO Houses (user_id, address)
VALUES
    (1, '123 Elm Street'),
    (2, '456 Oak Avenue'),
    (3, '789 Pine Road');
    
    
-- 3. Sensors Table
INSERT INTO Sensors (sensor_type)
VALUES
    ('Movement Detector'),
    ('Door Sensor');

-- 4. Rooms Table
INSERT INTO Rooms (house_id, room_name, sensor_id)
VALUES
    (1, 'Living Room', 1),
    (1, 'Kitchen', NULL),
    (2, 'Bedroom', 2),
    (3, 'Garage', 1);

-- 5. Furniture Table
INSERT INTO Furniture (room_id, furniture_name)
VALUES
    (1, 'Sofa'),
    (1, 'Coffee Table'),
    (2, 'Dining Table'),
    (3, 'Bed'),
    (4, 'Workbench');

-- 6. Police_Tracking table
INSERT INTO Police_Tracking (user_id, is_thief, current_room_id, theft_status)
VALUES
    (2, TRUE, 1, 'Active'),
    (1, FALSE, NULL, 'Resolved');

-- 7. Theft_Logs table
INSERT INTO Theft_Logs (user_id, room_id, action_taken)
VALUES
    (2, 1, 'Alert Police Department'),
    (1, NULL, 'Unauthorized Attempt - System Reset');


-------------------------------------------------------------------------------------

TRUNCATE TABLE Theft_Logs RESTART IDENTITY CASCADE;
TRUNCATE TABLE Police_Tracking RESTART IDENTITY CASCADE;
TRUNCATE TABLE Furniture RESTART IDENTITY CASCADE;
TRUNCATE TABLE Rooms RESTART IDENTITY CASCADE;
TRUNCATE TABLE Sensors RESTART IDENTITY CASCADE;
TRUNCATE TABLE Houses RESTART IDENTITY CASCADE;
TRUNCATE TABLE Users RESTART IDENTITY CASCADE;



-------------------------------------------------------------------------------------

SELECT * FROM rooms WHERE house_id = 3

SELECT * FROM houses
SELECT * from sensors
SELECT * from furniture
SELECT * from users
SELECT * from theft_logs
DELETE FROM furniture WHERE furniture_id IN (5);

DROP TABLE furniture CASCADE;
SELECT "furniture_id", "room_id", "furniture_name" FROM "furniture" AS "furniture";
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    character_maximum_length 
FROM 
    information_schema.columns 
WHERE 
    table_name = 'sensors';

 SELECT "furniture_id", "room_id", "furniture_name", "sensor_id" FROM "furniture" AS "furniture" WHERE "furniture"."room_id" = 10 AND "furniture"."furniture_name" = 'laptop' LIMIT 1

ALTER TABLE Rooms DROP CONSTRAINT rooms_sensor_id_fkey;
ALTER TABLE Rooms ADD CONSTRAINT rooms_sensor_id_fkey FOREIGN KEY (sensor_id) REFERENCES Sensors(sensor_id) ON DELETE CASCADE;
