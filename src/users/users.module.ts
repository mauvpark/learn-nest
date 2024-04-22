import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserImageEntity } from 'src/users/model/entity/user-image.entity';
import { UserEntity } from 'src/users/model/entity/user.entity';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserImageEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
