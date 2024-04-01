import { UserImageEntity } from 'src/users/model/entity/user-image.entity';
import { UserImageType } from 'src/users/model/interface/user-image.interface';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => UserImageEntity, (img) => img.userId)
  images: UserImageType[];
}
