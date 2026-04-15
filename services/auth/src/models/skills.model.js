import sql from "../config/postgresql.js";

const createSkillsTable = async () => {
    try {
        await sql.query(`
        CREATE TABLE IF NOT EXISTS skills(
            _id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        )
        `);
    } catch (error) {
        console.log("Skills table creation failed", error);
    }
};

export default createSkillsTable