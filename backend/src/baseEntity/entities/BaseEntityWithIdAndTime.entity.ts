import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntityWithIdAndTime extends BaseEntity {
  @ApiProperty({
    description: 'Уникальный идентификатор',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Дата создания',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Дата обновления',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
