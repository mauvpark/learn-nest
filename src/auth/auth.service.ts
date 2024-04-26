import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import 'dotenv/config';
import { UserType } from 'src/users/model/interface/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/model/entity/user.entity';
import { Repository } from 'typeorm';

const iv = randomBytes(Number(process.env.PASSWORD_IV_BYTES as string)); // 서버 저장

const encryptPassword = async (plainPassword: string) => {
  const key = (await promisify(scrypt)(
    process.env.PASSWORD_SCRYPT_KEY as string,
    process.env.PASSWORD_CIPHER_KEY as string,
    Number(process.env.PASSWORD_KEYLEN as string),
  )) as Buffer;
  const cipher = createCipheriv('aes-256-gcm', key, iv);

  // e.g. <Buffer a9 e8 6a 75 d9 86 a8 1b cd 4c>
  const encryptedPassword = Buffer.concat([
    cipher.update(plainPassword),
    // cipher.final(), // fires error when re-update it.
  ]);

  return encryptedPassword.toString('base64');

  // INFO case.hash
  // const hash = await bcrypt.hash(
  //   plainText,
  //   process.env.PASSWORD_HASH_SALT_OR_ROUNDS as unknown as number,
  // );

  // return hash;
};

const decryptPassword = async (base64Password: string, base64Iv: string) => {
  const decodedIv = Buffer.from(base64Iv, 'base64');
  const encryptedPassword = Buffer.from(base64Password, 'base64');

  const key = (await promisify(scrypt)(
    process.env.PASSWORD_SCRYPT_KEY as string,
    process.env.PASSWORD_CIPHER_KEY as string,
    Number(process.env.PASSWORD_KEYLEN as string),
  )) as Buffer;
  const decipher = createDecipheriv('aes-256-gcm', key, decodedIv);
  const decryptedPassword = Buffer.concat([
    decipher.update(encryptedPassword),
    // decipher.final(), // fires error when re-update it.
  ]);

  return decryptedPassword;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signUp(@Req() req: Request) {
    const body = req.body as unknown as UserType;
    const encryptedPassword = await encryptPassword(body.password);
    try {
      if (!body) throw new BadRequestException('user info is not provided.');
      const checkExists = await this.usersRepository.exists();
      if (!checkExists) {
        this.usersRepository.create();
      }
      const result = await this.usersRepository.save({
        ...body,
        password: encryptedPassword,
        iv: iv.toString('base64'),
      });

      if (result.id) {
        return {
          message: `${result.firstName + ' ' + result.lastName} signed up successfully!`,
        };
      }

      throw new InternalServerErrorException();
    } catch (error) {
      return error;
    }
  }

  async signIn(@Req() req) {
    const body = req.body as unknown as { email?: string; password?: string };
    try {
      if (body?.email && body?.password) {
        const { email, password } = body;
        const targetUser = await this.usersRepository.findOneBy({ email });
        if (targetUser) {
          const decryptedPassword = await decryptPassword(
            targetUser.password,
            targetUser.iv,
          );
          if (password === decryptedPassword.toString()) {
            // TODO JWT 토큰 발급
            return { message: 'Login Success!', status: 200, token: '' };
          }
          throw new UnauthorizedException();
        }
      }
    } catch (error) {
      return error;
    }
  }
}
