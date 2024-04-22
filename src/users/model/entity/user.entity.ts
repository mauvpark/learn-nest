import { UserImageEntity } from 'src/users/model/entity/user-image.entity';
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

  // INFO user 1명 당 여러개의 이미지를 할당할 경우
  // INFO 자신의 table에서 정의하고자 하는 column명, 타겟 entity 그리고 image table에서 역으로 user table에 접근할 수 있는 inverse relation
  @OneToMany(() => UserImageEntity, (image) => image.user)
  images: UserImageEntity[];
}
