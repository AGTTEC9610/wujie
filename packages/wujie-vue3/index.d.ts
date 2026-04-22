import { bus, preloadApp, destroyApp, setupApp } from "@agttec9610/wujie";
import type { DefineComponent, Plugin } from 'vue';

declare const WujieVue: DefineComponent & Plugin & {
  bus: typeof bus;
  setupApp: typeof setupApp;
  preloadApp: typeof preloadApp;
  destroyApp: typeof destroyApp;
};

export default WujieVue;
