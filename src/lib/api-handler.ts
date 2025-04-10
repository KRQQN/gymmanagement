import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "./api-response";
import { requireAuth, requireAdmin } from "@/middleware/auth";
import { z } from "zod";

type HandlerFunction = (
  req: NextRequest,
  session: any
) => Promise<NextResponse>;

interface ApiHandlerOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  validate?: z.ZodType<any>;
}

export function apiHandler(
  handler: HandlerFunction,
  options: ApiHandlerOptions = {}
) {
  return async (req: NextRequest) => {
    try {
      // Authentication
      let session = null;
      if (options.requireAuth) {
        const authResult = options.requireAdmin
          ? await requireAdmin(req)
          : await requireAuth(req);
        if (authResult instanceof NextResponse) return authResult;
        session = authResult;
      }

      // Request validation
      if (options.validate) {
        try {
          const body = await req.json();
          const result = options.validate.safeParse(body);
          if (!result.success) {
            return ApiResponse.badRequest(
              result.error.errors.map((err) => err.message).join(", ")
            );
          }
        } catch (error) {
          return ApiResponse.badRequest("Invalid request body");
        }
      }

      // Execute handler
      return await handler(req, session);
    } catch (error) {
      console.error("API Error:", error);
      return ApiResponse.error(
        error instanceof Error ? error.message : "Internal server error"
      );
    }
  };
} 