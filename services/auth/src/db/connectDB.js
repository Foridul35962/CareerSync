import sql from "../config/postgresql.js";
import createSkillsTable from "../models/skills.model.js"
import createUserTable from "../models/user.model.js"
import createUserSkillsTable from "../models/userSkills.model.js"

export const connectDB = async () => {
    try {
        await sql.query("SELECT 1");

        await createUserTable();
        await createSkillsTable();
        await createUserSkillsTable();

        console.log("database connected successfully");
    } catch (error) {
        console.error("DB connection failed:", error);
        process.exit(1);
    }
}