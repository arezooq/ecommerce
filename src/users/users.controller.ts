import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from 'src/utilities/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utilities/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utilities/guards/authorization.guard';
import { AuthorizaRoles } from 'src/utilities/decorators/authorize-roles.decorator';
import { Roles } from 'src/utilities/user-roles.enum';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() userSignupDto: UserSignUpDto): Promise<UserEntity> {
    return await this.usersService.signup(userSignupDto);
  }

  @Post('signin')
  async signin(@Body() userSigninDto: UserSignInDto): Promise<{
    accessToken: string;
    user: UserEntity;
  }> {
    const user = await this.usersService.signin(userSigninDto);
    const accessToken = await this.authService.accessToken(user);
    return { accessToken, user };
  }

  // @AuthorizaRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('allUsers')
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('OneUserById/:id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return await this.usersService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  getProfile(@CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
