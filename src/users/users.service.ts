import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { comparePassword, hashPassword } from '../utilities/passwordManager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signup(userSignupDto: UserSignUpDto): Promise<UserEntity> {
    try {
      const userExists = await this.findUserByEmail(userSignupDto.email);
      if (userExists) {
        throw new BadRequestException('Email is already exist.');
      }
      userSignupDto.password = await hashPassword(userSignupDto.password);
      let user = this.userRepository.create(userSignupDto);
      user = await this.userRepository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async signin(userSigninDto: UserSignInDto): Promise<UserEntity> {
    try {
      const userExists = await this.userRepository
        .createQueryBuilder('users')
        .addSelect('users.password')
        .where('users.email=:email', { email: userSigninDto.email })
        .getOne();
      if (!userExists) {
        throw new BadRequestException('Email or Password does not exists!');
      }
      const MatchedPassword = await comparePassword(
        userSigninDto.password,
        userExists.password,
      );
      if (!MatchedPassword) {
        throw new BadRequestException('Email or Password does not exists!');
      }
      delete userExists.password;
      return userExists;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User Not found');
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
