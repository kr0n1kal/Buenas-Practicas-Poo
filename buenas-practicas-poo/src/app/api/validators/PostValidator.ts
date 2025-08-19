export class PostValidator {
  static requiredFields(body: any) {
    const required = ['title', 'description', 'author'];
    const missing = required.filter(f => body[f] === undefined);
    if (missing.length) return { error: 'Missing required fields', missingFields: missing };
    return null;
  }

  static fieldTypes(body: any) {
    const expected: Record<string, string> = { title: 'string', description: 'string', author: 'string' };
    for (const key of Object.keys(expected)) {
      if (typeof body[key] !== expected[key]) {
        return { error: 'Invalid data type', field: key, expected: expected[key], received: typeof body[key] };
      }
    }
    return null;
  }

  static title(title: string) {
    const t = title.trim();
    if (t.length < 5 || t.length > 120) return { error: 'Title must be between 5 and 120 characters', value: title, currentLength: t.length };
    return null;
  }

  static description(desc: string) {
    const d = desc.trim();
    const min = 10, max = 800;
    if (!d) return { error: 'Description cannot be empty' };
    if (d.length < min) return { error: `Description too short (minimum ${min})`, currentLength: d.length };
    if (d.length > max) return { error: `Description too long (maximum ${max})`, currentLength: d.length };
    return null;
  }

  static author(author: string) {
    const issues: string[] = [];
    if (!/^[A-Z]/.test(author)) issues.push('Name must start with a capital letter');
    if (/[^a-zA-Z\s\'\-]/.test(author)) issues.push('Only letters, spaces, hyphens and apostrophes allowed');
    if (author.length < 2) issues.push('Author name too short');
    if (issues.length) return { error: 'Author validation failed', issues, value: author };
    return null;
  }

  static runAll(data: any) {
    const checks = [
      this.requiredFields,
      this.fieldTypes,
      (d: any) => this.title(d.title),
      (d: any) => this.description(d.description),
      (d: any) => this.author(d.author)
    ];
    for (const check of checks) {
      const result = check(data);
      if (result) return result;
    }
    return null;
  }
}