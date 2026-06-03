// import mongoose from "mongoose";

// const connectDB = async () => {
//     try {
//         mongoose.connection.on('connected', ()=> 
//         console.log("Database Connected"));
//         await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`)
//     } catch (error){
//         console.log(error.message);
//     }
    
// }
import mongoose from "mongoose";

const buildMongoURI = (uri, dbName = 'car-rental') => {
    if (!uri) throw new Error('MONGODB_URI is not defined')
    const [baseUri] = uri.split('?')
    const hasDatabase = baseUri.split('/').length > 3
    if (hasDatabase) return uri

    const qIdx = uri.indexOf('?')
    if (qIdx === -1) return `${uri}/${dbName}`
    // insert db name before query string
    return `${uri.substring(0, qIdx)}/${dbName}${uri.substring(qIdx)}`
}

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', ()=> console.log("Database Connected"));
        const mongoUri = buildMongoURI(process.env.MONGODB_URI, process.env.DB_NAME || 'car-rental')
        try {
            await mongoose.connect(mongoUri)
            return
        } catch (err) {
            // If SRV DNS lookup fails (common on restricted networks), attempt a local fallback
            const isSrv = process.env.MONGODB_URI && process.env.MONGODB_URI.startsWith('mongodb+srv:')
            const srvDnsError = err && (err.code === 'ECONNREFUSED' || (err.message && err.message.includes('querySrv')))
            if (isSrv && srvDnsError) {
                console.log('SRV DNS lookup failed for Atlas URI. Attempting local MongoDB fallback...')
                const localFallback = process.env.LOCAL_MONGODB_URI || 'mongodb://localhost:27017/' + (process.env.DB_NAME || 'car-rental')
                try {
                    await mongoose.connect(localFallback)
                    console.log('Connected to local MongoDB fallback:', localFallback)
                    return
                } catch (localErr) {
                    console.log('Local fallback failed:', localErr.message)
                    throw localErr
                }
            }
            throw err
        }

    } catch (error) {
        console.log('Mongo connection error:', error.message);
        throw error
    }
};

export default connectDB;
