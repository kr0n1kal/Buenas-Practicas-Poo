export class Author {
  private constructor(public readonly value: string) {}

  static create(value: string) {
    const trimmed = value.trim();
    if (!/^[A-Z]/.test(trimmed)) throw new Error('Name must start with a capital letter');
    if (/[^a-zA-Z\s\'\-]/.test(trimmed)) throw new Error('Only letters, spaces, hyphens and apostrophes allowed');
    if (trimmed.replace(/\s/g, '').length < 2) throw new Error('Author name too short');

    return new Author(trimmed);
  }
}