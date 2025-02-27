import HttpStatusCodes from '@/common/HttpStatusCodes';
import UsersAccess from '@/apiDataAccess/users';
import { User } from '@prisma/client';
import { APIError } from '@/common/apiUtils';

// **** Variables **** //

export const USER_NOT_FOUND_ERR_MESSAGE = 'User not found';

// **** Functions **** //

// TODO: Shouldn't these all be async?

/**
 * Get all users.
 */
function getAll(): Promise<User[]> {
  return UsersAccess.getAll();
}

function getOne(id: string): Promise<User | null> {
  console.log('getOne id', id);
  return UsersAccess.getOne(id);
}

//TODO: I should have a partial user type

function getOneBasic(id: string): Promise<Partial<User> | null> {
  return UsersAccess.getOneBasic(id);
}

/**
 * Add one user.
 */
function addOne(user: User): Promise<User> {
  return UsersAccess.addNewUser(user);
}

/**
 * Update one user.
 */
async function updateOne(id: string, user: Partial<User>): Promise<User> {
  const persists = await UsersAccess.persists(id);
  if (!persists) {
    throw new APIError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR_MESSAGE);
  }
  // Return user
  return UsersAccess.updateUser(id, user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: string): Promise<void> {
  const persists = await UsersAccess.persists(id);
  if (!persists) {
    throw new APIError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR_MESSAGE);
  }
  // Delete user
  return UsersAccess.delete(id);
}

// **** Export default **** //

export default {
  getAll,
  getOne,
  getOneBasic,
  addOne,
  updateOne,
  delete: _delete,
} as const;
