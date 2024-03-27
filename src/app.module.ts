import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { CatsModule } from 'src/cats/cats.module';
import { LoggerMiddleware } from 'src/common/middleware/logger.middlware';
// import { ConfigService } from 'src/config/config.service';
// import { DevelopmentConfigService } from 'src/config/development-config.service';
// import { ProductionConfigService } from 'src/config/production-config.service';
import { UsersModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { AuthModule } from 'src/auth/auth.module';
// import { ConfigModule } from 'src/config/config.module';
import { AppService } from 'src/app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
// import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entity/user.entity';

// const configServiceProvider = {
//   provide: ConfigService, // 실제 실행은 useClass에서 실행되고 provide의 class는 토큰 기능만 함
//   useClass:
//     process.env.NODE_ENV === 'development'
//       ? DevelopmentConfigService
//       : ProductionConfigService,
// };

@Module({
  imports: [
    DevtoolsModule.register({ http: process.env.NODE_ENV !== 'production' }), // 유료 라이센스만 사용 가능
    CatsModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './src/config/production.env'
          : './src/config/development.env',
      load: [configuration],
      isGlobal: true,
      cache: true,
      // validationSchema: Joi.object({
      //   NODE_ENV: Joi.string()
      //     .valid('development', 'production', 'test', 'provision')
      //     .default('development'),
      //   PORT: Joi.number().port().default(3000),
      //   DATABASE_HOST: Joi.string(),
      //   DATABASE_PORT: Joi.number().port(),
      // }),
      // validationOptions: {
      //   allowUnknown: false,
      //   abortEarly: true,
      // },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [User],
      synchronize: true, //WARN production에서는 사용해서는 안됨.
    }),
    //INFO 아래는 Custom config module
    // ConfigModule.register({ folder: './config' }),
    // ConfigModule.registerAsync({
    //   useFactory: () => {
    //     return {
    //       folder: './config',
    //     }
    //   },
    //   inject: [...]
    // })
  ],
  controllers: [AppController],
  // providers: [configServiceProvider],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'c*ts', method: RequestMethod.GET });
  }

  constructor(private dataSource: DataSource) {
    console.log('datasource', dataSource);
  }
}
