import { pgTable, text, integer, boolean, timestamp, decimal, serial, varchar, json } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  phone: varchar('phone', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cars = pgTable('cars', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  category: varchar('category', { length: 100 }).notNull(), // SUV, Sport, Luxury, Electric
  price: integer('price').notNull(),
  description: text('description').notNull(),
  shortDesc: text('short_desc').notNull(),
  engine: varchar('engine', { length: 255 }),
  horsepower: integer('horsepower'),
  torque: integer('torque'),
  acceleration: decimal('acceleration', { precision: 4, scale: 1 }),
  topSpeed: integer('top_speed'),
  range: integer('range'), // for electric
  fuelType: varchar('fuel_type', { length: 100 }),
  transmission: varchar('transmission', { length: 100 }),
  seating: integer('seating'),
  colors: json('colors').$type<string[]>().default([]),
  images: json('images').$type<string[]>().default([]),
  features: json('features').$type<string[]>().default([]),
  available: boolean('available').default(true).notNull(),
  featured: boolean('featured').default(false).notNull(),
  year: integer('year').default(2024).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  carId: integer('car_id').references(() => cars.id),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  preferredDate: varchar('preferred_date', { length: 50 }).notNull(),
  preferredTime: varchar('preferred_time', { length: 50 }).notNull(),
  message: text('message'),
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, confirmed, cancelled, completed
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const news = pgTable('news', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  image: text('image'),
  published: boolean('published').default(true).notNull(),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  subject: varchar('subject', { length: 500 }),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const configurations = pgTable('configurations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  carId: integer('car_id').references(() => cars.id),
  color: varchar('color', { length: 100 }),
  trim: varchar('trim', { length: 100 }),
  accessories: json('accessories').$type<string[]>().default([]),
  totalPrice: integer('total_price').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Car = typeof cars.$inferSelect;
export type NewCar = typeof cars.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type News = typeof news.$inferSelect;
export type NewNews = typeof news.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
