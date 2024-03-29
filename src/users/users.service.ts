import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Users } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService implements OnModuleInit {
  // Lifecycle event
  onModuleInit() {
    console.log('User module has been initialized.');
  }

  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
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

  findOne(id: number): Promise<Users | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findAll(): Promise<Users[]> {
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
