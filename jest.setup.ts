import { eraseDatabase } from "@/lib/eraseDatabase";

// Global setup
beforeAll(async () => {
  await eraseDatabase();
});

// Global teardown
afterAll(async () => {
  await eraseDatabase();
});
