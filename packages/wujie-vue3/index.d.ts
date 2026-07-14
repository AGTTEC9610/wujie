import { bus, preloadApp, destroyApp, setupApp, refreshApp } from "@agttec9610/wujie";
import type { DefineComponent, Plugin } from 'vue';

declare const WujieVue: DefineComponent & Plugin & {
  bus: typeof bus;
  setupApp: typeof setupApp;
  preloadApp: typeof preloadApp;
  destroyApp: typeof destroyApp;
  refreshApp: typeof refreshApp;
};

export default WujieVue;
