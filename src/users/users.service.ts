import { Injectable, OnModuleInit, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserImageEntity } from 'src/users/model/entity/user-image.entity';
import { UserEntity } from 'src/users/model/entity/user.entity';
import { UserType } from 'src/users/model/interface/user.interface';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService implements OnModuleInit {
  // Lifecycle event
  onModuleInit() {
    console.log('User module has been initialized.');
  }

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(UserImageEntity)
    private imageRepository: Repository<UserImageEntity>,
    private dataSource: DataSource,
  ) {}

  // private _user: User | null = null;
  // quit = false;

  // set user(info: User) {
  //   this._user = info;
  // }

  // get user(): User | null {
  //   return this._user;
  // }

  // getUserAttr(attr: string): string | number | null {
  //   return this._user !== null ? this._user[attr] : null;
  // }

  async create(@Req() req: Request) {
    const body = req.body as unknown as UserType;
    try {
      if (!body) throw new Error();
      // INFO 저장 순서에 따른 방법 및 Relation
      // 참고 자료: https://orkhan.gitbook.io/typeorm/docs/many-to-one-one-to-many-relations
      const imageResult = await this.imageRepository.save(body.images);
      const userResult = await this.usersRepository.save(body);

      if (userResult.firstName && !!imageResult.length) {
        return { message: 'success!' };
      }

      return { message: 'failed!' };
    } catch (e) {
      console.error('User creation is failed.', e);
    }
  }

  async createMany(req: Request) {
    const body = req.body as unknown as UserType[];
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const user of body) {
        await queryRunner.manager.save(UserImageEntity, user.images);
        await queryRunner.manager.save(UserEntity, user);
      }
      await queryRunner.commitTransaction();
      return { message: 'transaction committed!😊' };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return { message: 'transaction failed.😢' };
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number) {
    // : Promise<(UserEntity & { images: UserImageEntity[] }) | null>
    const user = await this.usersRepository.find({
      where: { id },
      relations: { images: true }, // INFO relations를 통해 table을 join하면 타겟 entity를 참고하여 자신의 entity에서 정의한 column에 데이터를 붙인 뒤 반환
    });
    return user;
  }

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async remove(id: number): Promise<{ code: number; message: string }> {
    try {
      await this.usersRepository.delete(id);
      return { code: 200, message: 'deleted!' };
    } catch (error) {
      return { code: 400, message: 'failed!' };
    }
  }
}
