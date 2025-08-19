import { NextResponse, NextRequest } from 'next/server';
import postgres from 'postgres';

// ---------------- Database connection ----------------
const DATABASE_URL =
  "postgresql://postgres.jhqgjcjvfnnmmnxbmncd:P3Y7W8WPATOmico2!@aws-1-us-east-2.pooler.supabase.com:6543/postgres";

// Create a singleton connection (recommended for Next.js)
const sql = postgres(DATABASE_URL, { max: 1 });

// ---------------- Validation Functions ----------------

const checkRequiredFields = (body: any) => {
  const requiredFields = ['title', 'description', 'author'];
  const missing = requiredFields.filter((field) => body[field] === undefined);

  if (missing.length > 0) {
    return NextResponse.json(
      { error: 'Missing required fields', missingFields: missing },
      { status: 400 }
    );
  }
  return null;
};

const checkFieldTypes = (body: any) => {
  const expectedTypes: Record<string, string> = {
    title: 'string',
    description: 'string',
    author: 'string',
  };

  for (const field of Object.keys(expectedTypes)) {
    if (typeof body[field] !== expectedTypes[field]) {
      return NextResponse.json(
        {
          error: 'Invalid data type',
          field,
          expected: expectedTypes[field],
          received: typeof body[field],
        },
        { status: 400 }
      );
    }
  }
  return null;
};

const validateTitle = (title: string) => {
  const trimmed = title.trim();
  if (trimmed.length < 5 || trimmed.length > 120) {
    return NextResponse.json(
      { error: 'Title must be between 5 and 120 characters', currentLength: trimmed.length, value: title },
      { status: 400 }
    );
  }
  return null;
};

const validateDescription = (description: string) => {
  const trimmed = description.trim();
  const minLen = 10;
  const maxLen = 800;

  if (!trimmed) {
    return NextResponse.json({ error: 'Description cannot be empty' }, { status: 400 });
  }
  if (trimmed.length < minLen) {
    return NextResponse.json(
      { error: `Description too short (minimum ${minLen} chars required)`, currentLength: trimmed.length },
      { status: 400 }
    );
  }
  if (trimmed.length > maxLen) {
    return NextResponse.json(
      { error: `Description too long (maximum ${maxLen} chars allowed)`, currentLength: trimmed.length },
      { status: 400 }
    );
  }
  return null;
};

const validateAuthor = (author: string) => {
  const problems: string[] = [];

  if (!/^[A-Z]/.test(author)) problems.push('Name must start with a capital letter');
  if (/[^a-zA-Z\s\'\-]/.test(author)) problems.push('Only letters, spaces, hyphens and apostrophes are allowed');
  if (author.length < 2) problems.push('Author name is too short');

  if (problems.length > 0) {
    return NextResponse.json({ error: 'Author validation failed', issues: problems, value: author }, { status: 400 });
  }
  return null;
};

// ---------------- Main POST Handler ----------------

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Run validations
    const validators = [
      checkRequiredFields,
      checkFieldTypes,
      (d: any) => validateTitle(d.title),
      (d: any) => validateDescription(d.description),
      (d: any) => validateAuthor(d.author),
    ];

    for (const validate of validators) {
      const result = validate(data);
      if (result) return result;
    }

    // No database insertion yet
    return NextResponse.json({ success: true, message: 'All validations passed', validatedData: data });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request', details: String(err) }, { status: 400 });
  }
}