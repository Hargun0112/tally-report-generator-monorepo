import { BadRequestError } from '@trg_package/errors';
import {
  UserInsert
} from '@trg_package/schemas-auth/types';
import { Request } from 'express';
import UserService from './user.service';

class AuthService {
  public static async signIn(
    data: Pick<UserInsert, 'email' | 'password'>
  ): Promise<Request['user']> {
    const { email, password } = data;
    const user = await UserService.findOneWithTenant({
      email
    });

    const doesPasswordMatch = await UserService.comparePassword(password, user.password);
    if (!doesPasswordMatch) {
      throw new BadRequestError('Wrong Password!');
    }

    return user;
  }
}

export default AuthService;
