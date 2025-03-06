"use server";

import { deleteUser, updateUser } from "@/lib/zitadel";

export async function deleteUserAccount(userId: string) {
  try {
    await deleteUser({ id: userId });
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

export async function updateUserAccount(userId: string, updates: {
  firstName?: string;
  lastName?: string;
  email?: string;
}) {
  try {
    await updateUser({
      userId,
      ...updates,
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}