import { Injectable, OnModuleInit, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isObject } from 'class-validator';
import 'dotenv/config';
import { Request } from 'express';
import { readFileSync } from 'fs';
import { Map } from 'immutable';
import jwt from 'jsonwebtoken';
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

  async patchProfile(@Req() req: Request) {
    try {
      const body = req.body as unknown as UserType;
      const accessToken = req.header('Authorization')?.split(' ')?.at(1) ?? '';
      const privateKey = readFileSync('private.key').toString();
      const verifiedToken = jwt.verify(accessToken, privateKey);
      if (!isObject(verifiedToken)) {
        throw new Error();
      }
      const originalData = Map(verifiedToken.data);
      const decodedId = Number(
        Buffer.from(originalData.get('id') as string, 'base64')
          .toString()
          .split(process.env.ID_SALT as string)
          ?.at(0),
      );
      const user = await this.usersRepository.findOneBy({ id: decodedId });
      if (!user || !body) throw new Error();
      // INFO 저장 순서에 따른 방법 및 Relation
      // 참고 자료: https://orkhan.gitbook.io/typeorm/docs/many-to-one-one-to-many-relations
      // const imageResult = await this.imageRepository.save(body.images);
      // const userResult = await this.usersRepository.save(body);

      // if (userResult.firstName && !!imageResult.length) {
      //   return { message: 'success!' };
      // }
      const imageResult = await this.imageRepository.save(body.images);
      const userResult = await this.usersRepository.save({
        ...user,
        images: body.images,
      });

      if (!!userResult?.id && !!imageResult.length) {
        return { message: 'User profile images were updated!', status: 200 };
      }

      throw new Error();
    } catch (e) {
      console.error('Something is wrong...😢', e);
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

  async findOne(email: string) {
    const user = await this.usersRepository.find({
      where: { email },
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
