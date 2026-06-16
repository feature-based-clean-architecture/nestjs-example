/**
 * Public barrel for the users module. Neighbours import from here and ONLY
 * from here. The domain `User` type is re-exported so callers can name the
 * contract without reaching into `users/domain` directly.
 */
export { UsersExternalModule } from './users-external.module';
export { UsersExternalService } from './users-external.service';
export type { User, CreateUserData } from '../domain/user';
