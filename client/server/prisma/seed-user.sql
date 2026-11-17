-- Create the primary login user (password: 12345678, bcrypt-hashed)
INSERT OR IGNORE INTO "User" ("name","email","passwordHash","role","isActive","createdAt","updatedAt")
VALUES ('LexQuora Admin','lexquora@gmail.com','$2a$12$dzAlyONWUKA3QcxXZGV.HeHKmnfXddFpzlwFPl40zw8uLC72/6r9O','SUPER_ADMIN',1,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);