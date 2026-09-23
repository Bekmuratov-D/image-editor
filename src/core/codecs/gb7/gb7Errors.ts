export class Gb7Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Gb7Error';
  }
}
