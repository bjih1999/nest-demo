export class ErrorResponse {
  constructor(
    public readonly message: string,
    public readonly errorCode: string,
    public readonly timestamp: Date,
  ) {}
}
