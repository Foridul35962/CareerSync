import sql from "../config/postgresql.js"
import createUserTable from "../models/user.model.js"

export const connectDB = async () => {
    try {
        await createUserTable()
    } catch (error) {
        console.log('error')
    }
}