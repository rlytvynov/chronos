CREATE DATABASE IF not exists CHRONOSDATAdedsdev;
CREATE USER IF not exists 'CHRONOSserver'@'localhost' IDENTIFIED BY 'serverpass';
GRANT ALL PRIVILEGES ON CHRONOSDATAdedsdev.* TO 'CHRONOSserver'@'localhost';

-- USE CHRONOSDATAdedsdev;

-- CREATE TABLE calendars(
--     id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
--     title VARCHAR(50) NOT NULL,
--     description TEXT
-- );

-- CREATE TABLE users(
--     id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
--     login VARCHAR(40) NOT NULL UNIQUE,
--     password VARCHAR(128) NOT NULL,
--     fullName VARCHAR(100) NOT NULL,
--     email VARCHAR(60) NOT NULL UNIQUE,
--     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     profilePic VARCHAR(256) DEFAULT 'none.png',
--     location VARCHAR(56),
--     defaultCalendarId INTEGER,
    
-- 	FOREIGN KEY (defaultCalendarId)
-- 		REFERENCES calendars(id)
--         ON DELETE CASCADE
-- );

-- CREATE TABLE events(
--     id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
--     adminId INTEGER,
--     title VARCHAR(50) NOT NULL,
--     description TEXT,
--     type ENUM('arrangement', 'reminder', 'task') NOT NULL,
--     color VARCHAR(7) NOT NULL,
--     start DATETIME NOT NULL,
--     end DATETIME NOT NULL,
    
--     FOREIGN KEY (adminId)
-- 		REFERENCES users(id)
--         ON DELETE SET NULL
-- );

-- CREATE TABLE users_calendars(
-- 	userId INTEGER NOT NULL,
--     calendarId INTEGER NOT NULL,
--     role ENUM('user', 'moder', 'master') NOT NULL,
    
--     FOREIGN KEY (userId)
-- 		REFERENCES users(id)
--         ON DELETE CASCADE,
-- 	FOREIGN KEY (calendarId)
-- 		REFERENCES calendars(id)
--         ON DELETE CASCADE
-- );

-- CREATE TABLE events_calendars(
-- 	eventId INTEGER NOT NULL,
--     calendarId INTEGER NOT NULL,
    
--     FOREIGN KEY (eventId)
-- 		REFERENCES events(id)
--         ON DELETE CASCADE,
-- 	FOREIGN KEY (calendarId)
-- 		REFERENCES calendars(id)
--         ON DELETE CASCADE
-- );