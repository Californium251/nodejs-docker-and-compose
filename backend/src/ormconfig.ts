import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Wish } from './wish/entities/wish.entity';
import { Wishlist } from './wishlist/entities/wishlist.entiry';
import { Offer } from './offer/entities/offer.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'student',
  password: 'student',
  database: 'kupi-podari-daj',
  entities: [User, Wish, Wishlist, Offer],
  synchronize: true,
});
