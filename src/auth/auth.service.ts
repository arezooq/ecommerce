import { Injectable } from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  async accessToken(user: UserEntity): Promise<string> {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME },
    );
  }
}
