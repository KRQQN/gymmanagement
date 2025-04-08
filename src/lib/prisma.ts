import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

console.log("Initializing Prisma client with database URL:", process.env.DATABASE_URL);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn", "info"],
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Test the connection
/* prisma.$connect()
  .then(async () => {
    console.log("Successfully connected to the database");
    try {
      // Test a simple query
      const result = await prisma.$queryRaw`SELECT 1`;
      console.log("Database query test successful:", result);
    } catch (error) {
      console.error("Database query test failed:", error);
    }
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
  });  */