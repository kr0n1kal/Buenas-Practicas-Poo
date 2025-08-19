export class Description {
  private constructor(public readonly value: string) {}

  static create(value: string) {
    const trimmed = value.trim();
    const min = 10;
    const max = 800;

    if (!trimmed) throw new Error('Description cannot be empty');
    if (trimmed.length < min) throw new Error(`Description too short (minimum ${min} chars)`);
    if (trimmed.length > max) throw new Error(`Description too long (maximum ${max} chars)`);

    return new Description(trimmed);
  }
}