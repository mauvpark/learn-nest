import { UserEntity } from 'src/users/model/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export const USER_IMAGE_ENTITY = 'user_image_entity';

@Entity()
export class UserImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  // INFO 여러개의 이미지를 user 1명에 할당할 경우, Foreign Key 형성
  @ManyToOne(() => UserEntity, (user) => user.images)
  user: UserEntity;
}
