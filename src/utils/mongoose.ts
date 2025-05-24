import mongoose from 'mongoose'
import { ServerLogger } from './logging'

const MONGO_URI = process.env.MONGO_URI as string

if (!MONGO_URI) {
	throw new Error('Please define the MONGO_URI environment variable')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose

if (!cached) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
	if (cached.conn) {
		return cached.conn
	}

	if (!cached.promise) {
		ServerLogger.info('No database connection found, creating new one...')
		cached.promise = mongoose.connect(MONGO_URI, {
			bufferCommands: false,
		})
	} else {
		ServerLogger.info('No database connection found, but promise already exists, waiting for it to complete...')
	}

	cached.conn = await cached.promise
	ServerLogger.info('Database connection successful')
	return cached.conn
}
