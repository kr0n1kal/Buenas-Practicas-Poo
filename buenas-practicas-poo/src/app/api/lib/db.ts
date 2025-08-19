import postgres from 'postgres';

const DATABASE_URL =
  "postgresql://postgres.jhqgjcjvfnnmmnxbmncd:P3Y7W8WPATOmico2!@aws-1-us-east-2.pooler.supabase.com:6543/postgres";

export const sql = postgres(DATABASE_URL, { max: 1 });