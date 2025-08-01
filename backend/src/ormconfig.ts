import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Wish } from './wish/entities/wish.entity';
import { Wishlist } from './wishlist/entities/wishlist.entity';
import { Offer } from './offer/entities/offer.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER || 'student',
  password: process.env.POSTGRES_PASSWORD || 'student',
  database: process.env.POSTGRES_DB || 'kupi-podari-daj',
  entities: [User, Wish, Wishlist, Offer],
  synchronize: false,
});
