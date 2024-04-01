import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  userId: number;
}
