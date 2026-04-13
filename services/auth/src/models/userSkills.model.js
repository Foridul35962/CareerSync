import sql from "../config/postgresql.js";

const createUserSkillsTable = async () => {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS user_skills(
            user_id INTEGER NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
            skill_id INTEGER NOT NULL REFERENCES skills(_id) ON DELETE CASCADE,
            PRIMARY KEY (user_id, skill_id)
        )
        `;
    } catch (error) {
        console.log("user Skills table creation failed", error);
    }
};

export default createUserSkillsTable