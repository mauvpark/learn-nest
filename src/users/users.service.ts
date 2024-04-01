import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/model/dto/user.dto';
import { UserEntity } from 'src/users/model/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService implements OnModuleInit {
  // Lifecycle event
  onModuleInit() {
    console.log('User module has been initialized.');
  }

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
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

  create(info: CreateUserDto) {
    return this.usersRepository.save(info);
  }

  findOne(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id });
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
