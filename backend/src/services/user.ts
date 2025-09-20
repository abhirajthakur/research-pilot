import { db } from "../db";
import { users } from "../db/schema";

export async function createUser(
  name: string,
  email: string,
  passwordHash: string,
) {
  try {
    const [user] = await db
      .insert(users)
      .values({ name, email, passwordHash })
      .returning();
    return user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating user:", error.message);
    } else {
      console.error("An unknown error occurred while creating the user.");
    }
    throw new Error("Failed to create user. Please try again later.");
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      throw new Error(`User with email ${email} not found.`);
    }

    return user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching user:", error.message);
    } else {
      console.error("An unknown error occurred while fetching the user.");
    }
    throw new Error("Failed to retrieve user. Please try again later.");
  }
}
