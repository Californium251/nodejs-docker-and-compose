import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Wish } from '../../wish/entities/wish.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.offers)
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Wish, (wish) => wish)
  @JoinColumn()
  item: Wish;

  @Column()
  amount: number;

  @Column()
  hidden: boolean;
}
