import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsNumber } from 'class-validator';
import { BaseEntityWithIdAndTime } from '../../baseEntity/entities/BaseEntityWithIdAndTime.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Offer extends BaseEntityWithIdAndTime {
  @ApiProperty({
    description: 'Сумма заявки',
    example: 100,
  })
  @Column()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  amount: number;

  @ApiProperty({
    description: 'Флаг скрыть информацию о спонсоре',
    example: false,
  })
  @Column({ default: false })
  hidden: boolean;

  @ApiProperty({
    description: 'Подарок',
    type: () => Wish,
  })
  @ManyToOne(() => Wish, (item) => item.id)
  item: Wish;

  @ApiProperty({
    description: 'Пользователь',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.offers)
  user: User;
}
