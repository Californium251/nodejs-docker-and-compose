import {
  Column,
  CreateDateColumn,
  Entity, JoinTable, ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { IsEmail, Length } from 'class-validator';
import { Wish } from '../../wish/entities/wish.entity';
import { Offer } from '../../offer/entities/offer.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entiry';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  @Length(2, 30, { message: 'Длина username — от 2 до 30 символов' })
  username: string;

  @Column()
  password: string;

  @Column({
    default: 'Пока ничего не рассказал о себе',
    nullable: true,
  })
  @Length(2, 200)
  about: string;

  @Column({
    default: 'https://i.pravatar.cc/300',
    nullable: true,
  })
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
