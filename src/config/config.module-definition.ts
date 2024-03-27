import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ConfigModuleOptions } from 'src/config/interface/config-module-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>().build();
