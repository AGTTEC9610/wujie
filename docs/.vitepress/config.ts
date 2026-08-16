import { defineConfig } from "vitepress";
import { version } from "../../packages/wujie-core/package.json";
const ogDescription = "极致的微前端框架";
const ogImage = "https://wujie-micro.github.io/doc/wujie.png";
const ogTitle = "无界";
const ogUrl = "https://wujie-micro.github.io/doc/";
const base = "/doc/";

/** Opciones de tema comunes a todos los idiomas */
const sharedThemeConfig = {
  logo: "/wujie.svg",
  socialLinks: [{ icon: "github", link: "https://github.com/Tencent/wujie" }],
  algolia: {
    appId: "QMIAJMDLL1",
    apiKey: "4eaef57a0122ce0454d3aed08f822178",
    indexName: "wujie-microio",
  },
};

const zhThemeConfig = {
  ...sharedThemeConfig,
  editLink: {
    pattern: "https://github.com/Tencent/wujie/tree/master/docs/:path",
    text: "编辑本页",
  },
  lastUpdatedText: "最近更新时间",

  nav: [
    { text: "指南", link: "/guide/", activeMatch: "/guide/" },
    {
      text: "API",
      link: "/api/bus",
      activeMatch: "/api/",
    },
    { text: "常见问题", link: "/question/", activeMatch: "/question/" },
    { text: "框架封装", link: "/pack/", activeMatch: "/pack/" },
    {
      text: `v${version}`,
      items: [
        {
          text: "更新日志",
          link: "https://github.com/Tencent/wujie/blob/master/CHANGELOG.md",
        },
      ],
    },
    {
      text: "示例",
      items: [
        {
          text: "Vue主应用",
          link: "https://wujie-micro.github.io/demo-main-vue/home",
        },
        {
          text: "React主应用",
          link: "https://wujie-micro.github.io/demo-main-react/",
        },
      ],
    },
    { text: "在线体验无界", link: "/wujie/", activeMatch: "/wujie/" },
    { text: "fluth", link: "https://fluthjs.github.io/fluth-doc/cn/index.html" },
  ],

  sidebar: {
    "/guide/": [
      {
        text: "入门",
        collapsed: true,
        items: [
          {
            text: "介绍",
            link: "/guide/",
          },
          {
            text: "快速上手",
            link: "/guide/start",
          },
          {
            text: "创建项目",
            link: "/guide/install",
          },
        ],
      },
      {
        text: "指南",
        collapsed: false,
        items: [
          {
            text: "预加载",
            link: "/guide/preload",
          },
          {
            text: "运行模式",
            link: "/guide/mode",
          },
          {
            text: "路由同步",
            link: "/guide/sync",
          },
          {
            text: "路由跳转",
            link: "/guide/jump",
          },
          {
            text: "生命周期",
            link: "/guide/lifecycle",
          },
          {
            text: "通信系统",
            link: "/guide/communication",
          },
          {
            text: "插件系统",
            link: "/guide/plugin",
          },
          {
            text: "降级处理",
            link: "/guide/degrade",
          },
          {
            text: "应用嵌套",
            link: "/guide/nest",
          },
          {
            text: "应用共享",
            link: "/guide/share",
          },
          {
            text: "全局变量",
            link: "/guide/variable",
          },
        ],
      },
      {
        text: "项目实战",
        collapsed: true,
        items: [
          {
            text: "vue主应用",
            link: "https://github.com/Tencent/wujie/tree/master/examples/main-vue",
          },
          {
            text: "react主应用",
            link: "https://github.com/Tencent/wujie/tree/master/examples/main-react",
          },
        ],
      },
      {
        text: "插件推荐",
        collapsed: true,
        items: [
          {
            text: "wujie-polyfill",
            link: "https://github.com/jardenliu/wujie-polyfill",
          },
        ],
      },
    ],
    "/api/": [
      {
        text: "主应用",
        collapsed: true,
        items: [
          {
            text: "bus",
            link: "/api/bus",
          },
          {
            text: "setupApp",
            link: "/api/setupApp",
          },
          {
            text: "startApp",
            link: "/api/startApp",
          },
          {
            text: "preloadApp",
            link: "/api/preloadApp",
          },
          {
            text: "destroyApp",
            link: "/api/destroyApp",
          },
          {
            text: "refreshApp",
            link: "/api/refreshApp",
          },
          {
            text: "clearAssetsCache",
            link: "/api/clearAssetsCache",
          },
        ],
      },
      {
        text: "子应用",
        collapsed: true,
        items: [
          {
            text: "wujie",
            link: "/api/wujie",
          },
        ],
      },
    ],
    "/question": [],
    "/pack/": [
      {
        text: "框架封装",
        collapsed: true,
        items: [
          {
            text: "Vue组件封装",
            link: "/pack/",
          },
          {
            text: "React组件封装",
            link: "/pack/react",
          },
        ],
      },
    ],
  },
};

const esThemeConfig = {
  ...sharedThemeConfig,
  editLink: {
    pattern: "https://github.com/AGTTEC9610/wujie/tree/master/docs/:path",
    text: "Editar esta página",
  },
  lastUpdatedText: "Última actualización",
  darkModeSwitchLabel: "Apariencia",
  returnToTopLabel: "Volver arriba",
  outlineTitle: "En esta página",
  docFooter: {
    prev: "Anterior",
    next: "Siguiente",
  },

  nav: [
    { text: "Guía", link: "/es/guide/", activeMatch: "/es/guide/" },
    {
      text: "API",
      link: "/es/api/bus",
      activeMatch: "/es/api/",
    },
    { text: "Preguntas frecuentes", link: "/es/question/", activeMatch: "/es/question/" },
    { text: "Envoltorios", link: "/es/pack/", activeMatch: "/es/pack/" },
    {
      text: `v${version}`,
      items: [
        {
          text: "Registro de cambios",
          link: "https://github.com/AGTTEC9610/wujie/blob/master/CHANGELOG.md",
        },
      ],
    },
    {
      text: "Ejemplos",
      items: [
        {
          text: "App principal en Vue",
          link: "https://wujie-micro.github.io/demo-main-vue/home",
        },
        {
          text: "App principal en React",
          link: "https://wujie-micro.github.io/demo-main-react/",
        },
      ],
    },
    { text: "Probar en línea", link: "/wujie/", activeMatch: "/wujie/" },
  ],

  sidebar: {
    "/es/guide/": [
      {
        text: "Introducción",
        collapsed: true,
        items: [
          {
            text: "¿Qué es un micro frontend?",
            link: "/es/guide/",
          },
          {
            text: "Empezar",
            link: "/es/guide/start",
          },
          {
            text: "Crear un proyecto",
            link: "/es/guide/install",
          },
        ],
      },
      {
        text: "Guía",
        collapsed: false,
        items: [
          {
            text: "Precarga",
            link: "/es/guide/preload",
          },
          {
            text: "Modos de ejecución",
            link: "/es/guide/mode",
          },
          {
            text: "Sincronización de rutas",
            link: "/es/guide/sync",
          },
          {
            text: "Navegación entre rutas",
            link: "/es/guide/jump",
          },
          {
            text: "Ciclo de vida",
            link: "/es/guide/lifecycle",
          },
          {
            text: "Sistema de comunicación",
            link: "/es/guide/communication",
          },
          {
            text: "Sistema de plugins",
            link: "/es/guide/plugin",
          },
          {
            text: "Modo degradado",
            link: "/es/guide/degrade",
          },
          {
            text: "Anidamiento de aplicaciones",
            link: "/es/guide/nest",
          },
          {
            text: "Compartir dependencias",
            link: "/es/guide/share",
          },
          {
            text: "Variables globales",
            link: "/es/guide/variable",
          },
        ],
      },
      {
        text: "Profundizar",
        collapsed: true,
        items: [
          {
            text: "Principios internos",
            link: "/es/guide/information",
          },
          {
            text: "Personalizar WujieDemo",
            link: "/es/guide/demo",
          },
        ],
      },
      {
        text: "Proyectos de ejemplo",
        collapsed: true,
        items: [
          {
            text: "App principal en vue",
            link: "https://github.com/Tencent/wujie/tree/master/examples/main-vue",
          },
          {
            text: "App principal en react",
            link: "https://github.com/Tencent/wujie/tree/master/examples/main-react",
          },
        ],
      },
      {
        text: "Plugins recomendados",
        collapsed: true,
        items: [
          {
            text: "wujie-polyfill",
            link: "https://github.com/jardenliu/wujie-polyfill",
          },
        ],
      },
    ],
    "/es/api/": [
      {
        text: "Aplicación principal",
        collapsed: true,
        items: [
          {
            text: "bus",
            link: "/es/api/bus",
          },
          {
            text: "setupApp",
            link: "/es/api/setupApp",
          },
          {
            text: "startApp",
            link: "/es/api/startApp",
          },
          {
            text: "preloadApp",
            link: "/es/api/preloadApp",
          },
          {
            text: "destroyApp",
            link: "/es/api/destroyApp",
          },
          {
            text: "refreshApp",
            link: "/es/api/refreshApp",
          },
          {
            text: "clearAssetsCache",
            link: "/es/api/clearAssetsCache",
          },
        ],
      },
      {
        text: "Subaplicación",
        collapsed: true,
        items: [
          {
            text: "$wujie",
            link: "/es/api/wujie",
          },
        ],
      },
    ],
    "/es/question": [],
    "/es/pack/": [
      {
        text: "Envoltorios por framework",
        collapsed: true,
        items: [
          {
            text: "Componente Vue",
            link: "/es/pack/",
          },
          {
            text: "Componente React",
            link: "/es/pack/react",
          },
        ],
      },
    ],
  },
};

export default defineConfig({
  title: ogTitle,
  description: ogDescription,
  base,
  head: [
    ["link", { rel: "icon", href: `${base}/favicon.ico` }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: ogTitle }],
    ["meta", { property: "og:image", content: ogImage }],
    ["meta", { property: "og:url", content: ogUrl }],
    ["script", { async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-22P9VKHL8B" }],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-22P9VKHL8B');`,
    ],
  ],

  vue: {
    reactivityTransform: true,
  },
  lastUpdated: true,

  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      themeConfig: zhThemeConfig,
    },
    es: {
      label: "Español",
      lang: "es-ES",
      link: "/es/",
      title: "Wujie",
      description: "El framework de micro frontends definitivo",
      themeConfig: esThemeConfig,
    },
  },

  themeConfig: zhThemeConfig,
});
