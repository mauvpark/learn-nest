import { Inject, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { MODULE_OPTIONS_TOKEN } from 'src/config/config.module-definition';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

@Injectable()
export class ConfigService {
  private readonly envConfig;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: Record<string, any>,
  ) {
    const filePath = `${process.env.NODE_ENV || 'development'}.env`;
    const envFile = path.resolve(
      __dirname,
      '../../src',
      options.folder,
      filePath,
    );
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
