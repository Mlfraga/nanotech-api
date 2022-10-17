import { container } from 'tsyringe';

import WppMessagesProvider from './implementations/WppMessagesProvider';
import IWppMessagesProvider from './models/IWppMessagesProvider';

const providers = {
  wpp: WppMessagesProvider,
};

container.registerSingleton<IWppMessagesProvider>(
  'WppMessagesProvider',
  providers.wpp,
);
