import { NextResponse } from "next/server";

interface ApiResponseOptions {
  headers?: Record<string, string>;
}

export class ApiResponse {
  static success(data: any, status = 200, options: ApiResponseOptions = {}) {
    return NextResponse.json(data, {
      status,
      headers: options.headers,
    });
  }

  static error(message: string, status = 500) {
    return NextResponse.json({ error: message }, { status });
  }

  static notFound(message = "Resource not found") {
    return this.error(message, 404);
  }

  static badRequest(message = "Bad request") {
    return this.error(message, 400);
  }

  static unauthorized(message = "Unauthorized") {
    return this.error(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return this.error(message, 403);
  }
} 