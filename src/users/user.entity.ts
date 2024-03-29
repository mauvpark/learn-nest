import { Photo } from 'src/photos/photo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  // @OneToMany(() => Photo, (photo) => photo.masterId)
  // photos: Photo[];
}
