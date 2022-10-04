import {connect, ConnectionStates, ConnectOptions} from 'mongoose'

// Get the MongoDB URI from the environment variables
const MONGODB_URI = process.env.MONGODB_URI

// Save the current connection state
let connectionState: ConnectionStates = ConnectionStates.uninitialized

export default async function mongodbConnect() {
    // Check if we have connection to our MongoDB database
    if (connectionState === ConnectionStates.connected) return

    // If not, connect to our MongoDB database
    if (!MONGODB_URI) {
        throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
    } else {
        const db = await connect(MONGODB_URI, {useNewUrlParser: true} as ConnectOptions)
        connectionState = db.connections[0].readyState
        console.log(`MongoDB connection status: ${ConnectionStates[connectionState]}`)
    }
}