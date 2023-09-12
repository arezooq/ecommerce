import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UsersModule } from './users/users.module';
import { CurrentUserMiddleware } from './utilities/middleware/current-user.middleware';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UsersModule, AuthModule, CategoriesModule, ProductsModule, ReviewsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
