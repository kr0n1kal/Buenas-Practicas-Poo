import { NextResponse, NextRequest } from 'next/server';
import postgres from 'postgres';

// ---------------- Database connection ----------------
const DATABASE_URL =
  "postgresql://postgres.jhqgjcjvfnnmmnxbmncd:P3Y7W8WPATOmico2!@aws-1-us-east-2.pooler.supabase.com:6543/postgres";

const sql = postgres(DATABASE_URL, { max: 1 });

// ---------------- Validation Module ----------------
const validators = {
  requiredFields: (body: any) => {
    const required = ['title', 'description', 'author'];
    const missing = required.filter(f => body[f] === undefined);
    if (missing.length) {
      return { error: 'Missing required fields', missingFields: missing };
    }
    return null;
  },
  fieldTypes: (body: any) => {
    const expected: Record<string, string> = { title: 'string', description: 'string', author: 'string' };
    for (const key of Object.keys(expected)) {
      if (typeof body[key] !== expected[key]) {
        return { error: 'Invalid data type', field: key, expected: expected[key], received: typeof body[key] };
      }
    }
    return null;
  },
  title: (title: string) => {
    const t = title.trim();
    if (t.length < 5 || t.length > 120) return { error: 'Title must be between 5 and 120 characters', value: title, currentLength: t.length };
    return null;
  },
  description: (desc: string) => {
    const d = desc.trim();
    const min = 10, max = 800;
    if (!d) return { error: 'Description cannot be empty' };
    if (d.length < min) return { error: `Description too short (minimum ${min})`, currentLength: d.length };
    if (d.length > max) return { error: `Description too long (maximum ${max})`, currentLength: d.length };
    return null;
  },
  author: (author: string) => {
    const issues: string[] = [];
    if (!/^[A-Z]/.test(author)) issues.push('Name must start with a capital letter');
    if (/[^a-zA-Z\s\'\-]/.test(author)) issues.push('Only letters, spaces, hyphens and apostrophes allowed');
    if (author.length < 2) issues.push('Author name too short');
    if (issues.length) return { error: 'Author validation failed', issues, value: author };
    return null;
  }
};

// ---------------- Database Module ----------------
const db = {
  insertPost: async (title: string, description: string, author: string) => {
    const result = await sql`
      INSERT INTO "dbBuenasPracticasPoo" (title, description, author)
      VALUES (${title}, ${description}, ${author})
      RETURNING id, title, description, author
    `;
    return result[0];
  }
};

// ---------------- Main POST Handler ----------------
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Run validations
    const checks = [
      validators.requiredFields,
      validators.fieldTypes,
      (d: any) => validators.title(d.title),
      (d: any) => validators.description(d.description),
      (d: any) => validators.author(d.author)
    ];

    for (const check of checks) {
      const error = check(data);
      if (error) return NextResponse.json(error, { status: 400 });
    }

    // Insert into DB
    const inserted = await db.insertPost(data.title, data.description, data.author);

    return NextResponse.json({ success: true, inserted });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request', details: String(err) }, { status: 400 });
  }
}