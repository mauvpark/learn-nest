import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService implements OnModuleInit {
  // Lifecycle event
  onModuleInit() {
    console.log('User module has been initialized.');
  }

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
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

  create(info: User) {
    return this.usersRepository.save(info);
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
