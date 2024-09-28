export class NoValuesToSetException extends Error {
  constructor() {
    super('No values to set');
  }
}
