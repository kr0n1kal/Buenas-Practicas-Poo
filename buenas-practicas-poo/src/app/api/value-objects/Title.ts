export class Title {
  private constructor(public readonly value: string) {}

  static create(value: string) {
    const trimmed = value.trim();
    if (trimmed.length < 5 || trimmed.length > 120) {
      throw new Error(`Title must be between 5 and 120 characters. Got length: ${trimmed.length}`);
    }
    return new Title(trimmed);
  }
}