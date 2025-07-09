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


-- 3. Sensors table
CREATE TABLE Sensors (
    sensor_id SERIAL PRIMARY KEY,
    sensor_type VARCHAR(50) NOT NULL CHECK (sensor_type IN ('Movement Detector', 'Door Sensor'))
);

-- 4. Rooms table
CREATE TABLE Rooms (
    room_id SERIAL PRIMARY KEY,
    house_id INT REFERENCES Houses(house_id) ON DELETE CASCADE,
    room_name VARCHAR(50) NOT NULL,
    sensor_id INT REFERENCES Sensors(sensor_id) ON DELETE CASCADE
);

-- 5. Furniture table
CREATE TABLE Furniture (
    furniture_id SERIAL PRIMARY KEY,
    room_id INT REFERENCES Rooms(room_id) ON DELETE CASCADE,
    furniture_name VARCHAR(50) NOT NULL,
    sensor_id INT REFERENCES Sensors(sensor_id)
);


-- 6. Theft_Logs table (to log unauthorized access events)
CREATE TABLE Theft_Logs (
    log_id SERIAL PRIMARY KEY,
    house_id INT REFERENCES Houses(house_id),  -- Add the house_id field and reference it
    user_id INT REFERENCES Users(user_id),
    room_id INT REFERENCES Rooms(room_id),
    action_taken VARCHAR(255),
    log_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Police_Tracking table (for monitoring by police)
CREATE TABLE Police_Tracking (
    track_id SERIAL PRIMARY KEY,
    theft_log_id INT REFERENCES Theft_Logs(log_id),  -- Reference to the Theft Log
    resolved BOOLEAN DEFAULT FALSE,  -- Default to false, indicating it's not resolved
    resolved_timestamp TIMESTAMPTZ  -- The timestamp when it's marked resolved (optional)
);







