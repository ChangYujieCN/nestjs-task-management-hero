import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
// @ts-ignore
import { genSaltSync, genSalt, hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { from } from 'rxjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = new User();
    user.username = username;
    user.salt = await genSalt();
    user.password = await UserRepository.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  private static async hashPassword(password: string, salt: string) {
    return hash(password, salt);
  }
}
