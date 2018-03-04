export class RequestError extends Error {
  constructor(json: any) {
    super(json);
  }
}
