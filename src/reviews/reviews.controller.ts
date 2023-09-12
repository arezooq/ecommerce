import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthenticationGuard } from 'src/utilities/guards/authentication.guard';
import { CurrentUser } from 'src/utilities/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ReviewEntity } from './entities/review.entity';
import { AuthorizeGuard } from 'src/utilities/guards/authorization.guard';
import { Roles } from 'src/utilities/user-roles.enum';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ReviewEntity> {
    return await this.reviewsService.create(createReviewDto, currentUser);
  }

  @Get('/all')
  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAll();
  }

  @Get()
  async findAllByProduct(
    @Body('productId') productId: number,
  ): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAllByProduct(+productId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReviewEntity> {
    return await this.reviewsService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
