import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from 'src/config/config.module-definition';
import { ConfigService } from 'src/config/config.service';

/**
 * Sync 작업
 */
// @Module({})
// export class ConfigModule {
//   /**
//    * 모듈에 임의의 parameter를 넘겨 module을 customize 할 수 있음
//    */
//   static register(options: Record<string, any>): DynamicModule {
//     return {
//       module: ConfigModule,
//       providers: [
//         { provide: CONFIG_OPTIONS, useValue: options },
//         ConfigService,
//       ],
//       exports: [ConfigService],
//     };
//   }
// }

/**
 * Async, Sync 작업
 */
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule extends ConfigurableModuleClass {}
