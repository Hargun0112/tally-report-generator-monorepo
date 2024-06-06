import bcrypt from 'bcrypt';
import { BadRequestError, CustomError, NotFoundError } from '../errors';
import { UserInsert, UserSelect } from '../models/schema';
import UserService from './UserService';

class AuthService {
  public static async signUp(data: UserInsert): Promise<UserSelect> {
    const doesUserAlreadyExists = await UserService.findOne({
      email: data.email
    });

    if (doesUserAlreadyExists != null) {
      throw new CustomError('User Already Exists', 409);
    }
    const user = await UserService.createOne({
      ...data,
      password: await this.hashPassword(data.password)
    });

    return user;
  }

  public static async signIn(
    data: Pick<UserInsert, 'email' | 'password'>
  ): Promise<UserSelect> {
    const { email, password } = data;
    const user = await UserService.findOne({ email });

    if (user === undefined) {
      throw new NotFoundError('User does not exist');
    }

    const passwordMatch = await this.comparePassword(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestError('Wrong Password');
    }

    return user;
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }

  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    const doesPasswordMatch = await bcrypt.compare(password, hash);
    return doesPasswordMatch;
  }
}

export default AuthService;
