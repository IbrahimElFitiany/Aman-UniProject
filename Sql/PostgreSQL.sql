----------create table-----------
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    director VARCHAR(255) NOT NULL,
    release_year INT CHECK (release_year > 1888),  -- The first movie was released in 1888
    genre VARCHAR(100)
);

-------See All tables-------------
SELECT table_name 
FROM information_schema.tables
WHERE table_schema = 'public';



----------insert into table----------------
INSERT INTO movies (title, director, release_year, genre) VALUES
('The Shawshank Redemption', 'Frank Darabont', 1994, 'Drama'),
('The Godfather', 'Francis Ford Coppola', 1972, 'Crime'),
('The Dark Knight', 'Christopher Nolan', 2008, 'Action'),
('Pulp Fiction', 'Quentin Tarantino', 1994, 'Crime'),
('Forrest Gump', 'Robert Zemeckis', 1994, 'Drama'),
('Inception', 'Christopher Nolan', 2010, 'Sci-Fi'),
('The Matrix', 'The Wachowskis', 1999, 'Sci-Fi'),
('Fight Club', 'David Fincher', 1999, 'Drama'),
('The Lord of the Rings: The Return of the King', 'Peter Jackson', 2003, 'Fantasy'),
('Gladiator', 'Ridley Scott', 2000, 'Action');





-- Replace 'your_username' with the actual user
SELECT has_table_privilege('postgres', 'users', 'SELECT');

SELECT "user_id", "username", "password_hash", "failed_logins", "is_thief" FROM "users" AS "user";

SELECT * FROM movies


--------------get DB Format---------------------
SELECT column_name, data_type, is_nullable, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'houses';