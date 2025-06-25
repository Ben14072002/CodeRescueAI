import { storage } from "../storage";
import type { User } from "@shared/schema";

/**
 * Finds a user by Firebase UID or numeric database ID
 * @param userId - Firebase UID (string) or database ID (number/string)
 * @returns User object or undefined if not found
 */
export async function findUser(userId: string | number): Promise<User | undefined> {
  // Convert to string for consistent handling
  const userIdStr = userId.toString();
  
  // First try Firebase UID lookup
  let user = await storage.getUserByFirebaseUid(userIdStr);
  
  // If not found and it's a valid number, try database ID lookup
  if (!user && !isNaN(parseInt(userIdStr))) {
    user = await storage.getUser(parseInt(userIdStr));
  }
  
  return user;
}

/**
 * Finds a user and throws error if not found
 * @param userId - Firebase UID (string) or database ID (number/string)
 * @returns User object (guaranteed to exist)
 * @throws Error if user not found
 */
export async function findUserOrThrow(userId: string | number): Promise<User> {
  const user = await findUser(userId);
  
  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }
  
  return user;
}