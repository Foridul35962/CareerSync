import sql from "../config/postgresql.js";

const createUserTable = async () => {
  try {
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('jobseeker', 'recruiter');
        END IF;
      END$$;
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        _id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone_number VARCHAR(15) NOT NULL,
        role user_role NOT NULL,
        bio TEXT,
        resume VARCHAR(255),
        resume_public_id VARCHAR(255),
        profile_pic VARCHAR(255),
        profile_pic_public_id VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        subscription TIMESTAMPTZ
      );
    `;

  } catch (error) {
    console.log("User model create failed", error);
  }
};

export default createUserTable;