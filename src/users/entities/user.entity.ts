import { CategoryEntity } from 'src/categories/entities/category.entity';
import { Roles } from '../../utilities/user-roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Roles, array: true, default: [Roles.USER] })
  roles: Roles[];

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => CategoryEntity, (category) => category.addedBy)
  categories: CategoryEntity[];

  @OneToMany(() => ProductEntity, (prod) => prod.addedBy)
  products: ProductEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user)
  reviews: ReviewEntity[];

  @OneToMany(() => OrderEntity, (ord) => ord.updateBy)
  ordersUpdateBy: OrderEntity[];

  @OneToMany(() => OrderEntity, (ord) => ord.user)
  orders: OrderEntity[];
}
