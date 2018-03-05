export class RequestError extends Error {
  constructor(json: any) {
    const message = (
      json.error_code
    );

    super(message);
  }
}
