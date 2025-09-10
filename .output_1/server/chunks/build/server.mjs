import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { hasInjectionContext, getCurrentInstance, inject, defineComponent, createElementBlock, shallowRef, provide, cloneVNode, h, createApp, toRef, onErrorCaptured, onServerPrefetch, unref, createVNode, resolveDynamicComponent, shallowReactive, reactive, effectScope, computed, isReadonly, isRef, isShallow, isReactive, toRaw, defineAsyncComponent, mergeProps, ref, getCurrentScope, watch, useSSRContext } from 'vue';
import { k as hasProtocol, m as isScriptProtocol, l as joinURL, w as withQuery, n as sanitizeStatusCode, o as getContext, $ as $fetch, p as createHooks, h as createError$1, q as isEqual, v as stringifyParsedURL, x as stringifyQuery, y as parseQuery, z as toRouteMatcher, A as createRouter, B as defu } from '../_/nitro.mjs';
import { u as useHead$1, h as headSymbol, b as baseURL, p as publicAssetsURL } from '../routes/renderer.mjs';
import { defineStore, createPinia, setActivePinia, storeToRefs, shouldHydrate } from 'pinia';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.1.1";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
const definePayloadPlugin = defineNuxtPlugin;
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const PageRouteSymbol = Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || useNuxtApp();
  return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      const head = inject(headSymbol);
      if (!head) {
        throw new Error("[nuxt] [unhead] Missing Unhead instance.");
      }
      return head;
    }
  });
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  return useHead$1(input, { head, ...options });
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    "skipHydrate",
    // We need to return something truthy to be treated as a match
    (data) => !shouldHydrate(data) && 1
  );
});
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  manifest_45route_45rule
];
function getRouteFromPath(fullPath) {
  const route = fullPath && typeof fullPath === "object" ? fullPath : {};
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = new URL(fullPath.toString(), "http://localhost");
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    // stub properties for compat with vue-router
    params: route.params || {},
    name: void 0,
    matched: route.matched || [],
    redirectedFrom: void 0,
    meta: route.meta || {},
    href: fullPath
  };
}
const router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  setup(nuxtApp) {
    const initialURL = nuxtApp.ssrContext.url;
    const routes = [];
    const hooks = {
      "navigate:before": [],
      "resolve:before": [],
      "navigate:after": [],
      "error": []
    };
    const registerHook = (hook, guard) => {
      hooks[hook].push(guard);
      return () => hooks[hook].splice(hooks[hook].indexOf(guard), 1);
    };
    (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const route = reactive(getRouteFromPath(initialURL));
    async function handleNavigation(url, replace) {
      try {
        const to = getRouteFromPath(url);
        for (const middleware of hooks["navigate:before"]) {
          const result = await middleware(to, route);
          if (result === false || result instanceof Error) {
            return;
          }
          if (typeof result === "string" && result.length) {
            return handleNavigation(result, true);
          }
        }
        for (const handler of hooks["resolve:before"]) {
          await handler(to, route);
        }
        Object.assign(route, to);
        if (false) ;
        for (const middleware of hooks["navigate:after"]) {
          await middleware(to, route);
        }
      } catch (err) {
        for (const handler of hooks.error) {
          await handler(err);
        }
      }
    }
    const currentRoute = computed(() => route);
    const router = {
      currentRoute,
      isReady: () => Promise.resolve(),
      // These options provide a similar API to vue-router but have no effect
      options: {},
      install: () => Promise.resolve(),
      // Navigation
      push: (url) => handleNavigation(url),
      replace: (url) => handleNavigation(url),
      back: () => (void 0).history.go(-1),
      go: (delta) => (void 0).history.go(delta),
      forward: () => (void 0).history.go(1),
      // Guards
      beforeResolve: (guard) => registerHook("resolve:before", guard),
      beforeEach: (guard) => registerHook("navigate:before", guard),
      afterEach: (guard) => registerHook("navigate:after", guard),
      onError: (handler) => registerHook("error", handler),
      // Routes
      resolve: getRouteFromPath,
      addRoute: (parentName, route2) => {
        routes.push(route2);
      },
      getRoutes: () => routes,
      hasRoute: (name) => routes.some((route2) => route2.name === name),
      removeRoute: (name) => {
        const index = routes.findIndex((route2) => route2.name === name);
        if (index !== -1) {
          routes.splice(index, 1);
        }
      }
    };
    nuxtApp.vueApp.component("RouterLink", defineComponent({
      functional: true,
      props: {
        to: {
          type: String,
          required: true
        },
        custom: Boolean,
        replace: Boolean,
        // Not implemented
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: String
      },
      setup: (props, { slots }) => {
        const navigate = () => handleNavigation(props.to, props.replace);
        return () => {
          const route2 = router.resolve(props.to);
          return props.custom ? slots.default?.({ href: props.to, navigate, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
            e.preventDefault();
            return navigate();
          } }, slots);
        };
      }
    }));
    nuxtApp._route = route;
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const initialLayout = nuxtApp.payload.state._layout;
    nuxtApp.hooks.hookOnce("app:created", async () => {
      router.beforeEach(async (to, from) => {
        to.meta = reactive(to.meta || {});
        if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
          to.meta.layout = initialLayout;
        }
        nuxtApp._processingMiddleware = true;
        if (!nuxtApp.ssrContext?.islandContext) {
          const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
          {
            const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
            if (routeRules.appMiddleware) {
              for (const key in routeRules.appMiddleware) {
                const guard = nuxtApp._middleware.named[key];
                if (!guard) {
                  return;
                }
                if (routeRules.appMiddleware[key]) {
                  middlewareEntries.add(guard);
                } else {
                  middlewareEntries.delete(guard);
                }
              }
            }
          }
          for (const middleware of middlewareEntries) {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            {
              if (result === false || result instanceof Error) {
                const error = result || createError$1({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`,
                  data: {
                    path: initialURL
                  }
                });
                delete nuxtApp._processingMiddleware;
                return nuxtApp.runWithContext(() => showError(error));
              }
            }
            if (result === true) {
              continue;
            }
            if (result || result === false) {
              return result;
            }
          }
        }
      });
      router.afterEach(() => {
        delete nuxtApp._processingMiddleware;
      });
      await router.replace(initialURL);
      if (!isEqual(route.fullPath, initialURL)) {
        await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
      }
    });
    return {
      provide: {
        route,
        router
      }
    };
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
const __nuxt_component_0 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    {
      nuxtApp.payload.pinia = toRaw(pinia.state.value);
    }
    return {
      provide: {
        pinia
      }
    };
  }
});
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  payloadPlugin,
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8
];
const useWindows = defineStore("Windows", {
  state: () => ({
    apps: [
      {
        icon: "/image/computer.png",
        name: "My Computer"
      },
      {
        icon: "/image/network.png",
        name: "Network Nwighborhood"
      },
      {
        icon: "/image/inbox.png",
        name: "Inbox"
      },
      {
        icon: "/image/Recycling.png",
        name: "Recycle Bin"
      },
      {
        icon: "/image/internet.png",
        name: "The internet"
      },
      {
        icon: "/image/Folder.png",
        name: "Online Services"
      },
      {
        icon: "/image/msn.png",
        name: "Set Up The Micrisoft Network"
      }
    ]
  }),
  actions: {},
  getters: {}
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$d = {
  __name: "backGround",
  __ssrInlineRender: true,
  setup(__props) {
    const WindowsStore = useWindows();
    const { apps } = WindowsStore;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "computerAllIcon" }, _attrs))} data-v-399da730><!--[-->`);
      ssrRenderList(unref(apps), (app, index) => {
        _push(`<div class="icon" data-v-399da730><div class="iconImage" data-v-399da730><img${ssrRenderAttr("src", app.icon)} data-v-399da730></div><div class="iconName" data-v-399da730>${ssrInterpolate(app.name)}</div></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/backGround.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const backGround = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-399da730"]]);
const _imports_1$2 = publicAssetsURL("/image/huh-cat.gif");
const _imports_1$1 = publicAssetsURL("/image/就是貓.jpg");
const useDraggable = (topValue, leftValue, windowRef) => {
  const position = ref({ top: topValue, left: leftValue });
  const dragging = ref(false);
  const offset = ref({ x: 0, y: 0 });
  const startDrag = (event) => {
    if (!event.target.closest(".control")) return;
    dragging.value = true;
    offset.value = {
      x: event.clientX - position.value.left,
      y: event.clientY - position.value.top
    };
    (void 0).addEventListener("mousemove", onDrag);
    (void 0).addEventListener("mouseup", stopDrag);
  };
  const onDrag = (event) => {
    if (!dragging.value || !windowRef.value) return;
    const parentRect = windowRef.value.parentNode.getBoundingClientRect();
    const WindowRect = windowRef.value.getBoundingClientRect();
    const minX = parentRect.left;
    const maxX = parentRect.right - WindowRect.width;
    const minY = parentRect.top;
    const maxY = parentRect.bottom - WindowRect.height - 36;
    const newLeft = Math.min(Math.max(event.clientX - offset.value.x, minX), maxX);
    const newTop = Math.min(Math.max(event.clientY - offset.value.y, minY), maxY);
    position.value = {
      left: newLeft,
      top: newTop
    };
  };
  const stopDrag = () => {
    dragging.value = false;
    (void 0).removeEventListener("mousemove", onDrag);
    (void 0).removeEventListener("mouseup", stopDrag);
  };
  return {
    position,
    startDrag
  };
};
const draggableTool = (height, width) => {
  const externalWinRef = ref(null);
  const getWinRef = (el) => {
    externalWinRef.value = el;
  };
  const { position, startDrag } = useDraggable(
    height,
    width,
    externalWinRef
  );
  return {
    externalWinRef,
    getWinRef,
    position,
    startDrag
  };
};
const UseControlWindowsShow = (propsValue) => {
  const WindowShow = ref(true);
  watch(() => propsValue.value, () => {
    WindowShow.value = !WindowShow.value;
  });
  return WindowShow;
};
const useCatState = defineStore("CatState", {
  state: () => ({
    appName: "Cat Game",
    options: [
      { name: "File" },
      { name: "Options" },
      { name: "Windows" },
      { name: "Help" }
    ],
    baseValue: {
      foodValue: 50,
      feelValue: 50,
      sleepValue: 50,
      cleanValue: 7
    },
    stateValue: {
      stated: "正常",
      energy: "健康",
      cleanState: "乾淨",
      respond: "這是隻普通的貓"
    },
    maximum: {
      MAXfood: 150,
      MAXfeel: 150,
      MAXsleep: 150
    },
    probability: {
      proFail: 5,
      proSuccess: 95
    },
    condition: {
      recoverHealth: 0,
      demon: 0,
      noSleep: 0
    }
  }),
  actions: {
    CLEANSTATE() {
      const mapping = [
        { limit: 0, state: "黑色毛炭" },
        { limit: 2, state: "骯髒" },
        { limit: 4, state: "普通" },
        { limit: 5, state: "乾淨" }
      ];
      const found = mapping.find((m) => this.baseValue.cleanValue <= m.limit);
      this.stateValue.cleanState = found ? found.state : "乾淨";
    },
    SET_STATE_CHANGE(path, value) {
      const keys = path.split(".");
      let target = this;
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = value;
    },
    SET_STATE_PLUS(path, value) {
      const keys = path.split(".");
      let target = this;
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] += value;
    },
    getRandomNumbers(Probability) {
      return Math.floor(Math.random() * Probability);
    },
    RandomReaction(Probability, ...reactions) {
      const rand = this.getRandomNumbers(Probability);
      return reactions[rand] || "你的貓故障了，沒有反應";
    }
  },
  getters: {}
});
const useCatStateTools = () => {
  const catState = useCatState();
  const { baseValue, stateValue, maximum, probability, condition, appName, options } = storeToRefs(catState);
  const foodValue = computed(() => catState.baseValue.foodValue);
  const feelValue = computed(() => catState.baseValue.feelValue);
  const sleepValue = computed(() => catState.baseValue.sleepValue);
  const cleanValue = computed(() => baseValue.value.cleanValue);
  const stated = computed(() => stateValue.value.stated);
  const energy = computed(() => stateValue.value.energy);
  const cleanState = computed(() => stateValue.value.cleanState);
  const respond = computed(() => stateValue.value.respond);
  const MAXfood = computed(() => maximum.value.MAXfood);
  const MAXfeel = computed(() => maximum.value.MAXfeel);
  const MAXsleep = computed(() => maximum.value.MAXsleep);
  const proFail = computed(() => probability.value.proFail);
  const proSuccess = computed(() => probability.value.proSuccess);
  const recoverHealth = computed(() => condition.value.recoverHealth);
  const demon = computed(() => condition.value.demon);
  const noSleep = computed(() => condition.value.noSleep);
  const stateChange = (state, value) => catState.SET_STATE_CHANGE(state, value);
  const statePlus = (state, value) => catState.SET_STATE_PLUS(state, value);
  const randReaction = (Probability, ...reactions) => catState.RandomReaction(Probability, ...reactions);
  const getrandNumber = (number) => catState.getRandomNumbers(number);
  const MaxValue = () => {
    if (foodValue.value >= MAXfood.value) {
      stateChange("baseValue.foodValue", MAXfood.value);
      stateChange("stateValue.respond", "牠已經比橘貓還大隻了 你是在養豬嗎?");
    }
    if (feelValue.value >= MAXfeel.value) {
      stateChange("baseValue.feelValue", MAXfeel.value);
    }
    if (sleepValue.value >= MAXsleep.value) {
      stateChange("baseValue.sleepValue", MAXsleep.value);
    }
  };
  const howClean = () => catState.CLEANSTATE();
  const Howstate = () => {
    if (foodValue.value >= 100) {
      stateChange("stateValue.stated", "牠吃得像隻豬");
    }
  };
  return {
    foodValue,
    feelValue,
    sleepValue,
    cleanValue,
    stated,
    energy,
    cleanState,
    respond,
    MAXfood,
    MAXfeel,
    MAXsleep,
    proFail,
    proSuccess,
    recoverHealth,
    demon,
    noSleep,
    stateChange,
    statePlus,
    randReaction,
    getrandNumber,
    MaxValue,
    howClean,
    Howstate,
    appName,
    options
  };
};
const useWhatTimeStore = defineStore("WhatTime", {
  state: () => ({
    day: 1,
    time: {
      breakfast: "早餐時間",
      morning: "早上",
      lunch: "午餐時間",
      afternoon: "下午",
      bath: "洗澡時間",
      dinner: "晚餐時間",
      night: "晚上",
      sleep: "睡覺時間",
      calculateThisDay: "睡覺時間"
    },
    currentTime: "breakfast"
    // 新增屬性來儲存當前時間段
  }),
  actions: {
    plusDay(amount) {
      this.day += amount;
    },
    SET_TIME(timeKey) {
      this.currentTime = timeKey;
    },
    SET_DAY(thisday) {
      this.day = thisday;
    },
    storyContinue() {
      const timeKeys = Object.keys(this.time);
      const currentIndex = timeKeys.indexOf(this.currentTime);
      if (currentIndex === timeKeys.length - 1) {
        this.day += 1;
        this.currentTime = timeKeys[0];
      } else {
        this.currentTime = timeKeys[currentIndex + 1];
      }
    },
    whatTimeNow() {
      return this.time[this.currentTime];
    }
  },
  getters: {}
});
const useTimeStateTools = () => {
  const timeStore = useWhatTimeStore();
  const { day, currentTime } = storeToRefs(timeStore);
  const storyContinue = () => timeStore.storyContinue();
  const setDay = (value) => timeStore.SET_DAY(value);
  const setTime = (value) => timeStore.SET_TIME(value);
  const WhatTimeNow = computed(() => timeStore.whatTimeNow());
  return {
    day,
    currentTime,
    storyContinue,
    setDay,
    setTime,
    WhatTimeNow
  };
};
const _sfc_main$c = {
  __name: "CatGameToolFeed",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      energy
    } = useCatStateTools();
    const {
      currentTime
    } = useTimeStateTools();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(currentTime) === "breakfast" || unref(currentTime) === "lunch" || unref(currentTime) === "dinner") {
        _push(`<div${ssrRenderAttrs(_attrs)}><button>貓糧</button><button>貓罐頭</button><button>水</button>`);
        if (unref(energy) === "生病") {
          _push(`<button>藥</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/CatGame/CatGameToolFeed.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = {
  __name: "CatGameToolPlay",
  __ssrInlineRender: true,
  setup(__props) {
    useCatStateTools();
    const {
      currentTime
    } = useTimeStateTools();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(currentTime) === "morning" || unref(currentTime) === "afternoon" || unref(currentTime) === "night") {
        _push(`<div${ssrRenderAttrs(_attrs)} data-v-36f9bfea>`);
        if (unref(currentTime) === "afternoon") {
          _push(`<button data-v-36f9bfea> 睡午覺 </button>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(currentTime) === "morning" || unref(currentTime) === "afternoon") {
          _push(`<button data-v-36f9bfea> 帶去散步 </button>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(currentTime) === "morning" || unref(currentTime) === "night") {
          _push(`<button data-v-36f9bfea> 陪牠玩 </button>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(currentTime) === "morning" || unref(currentTime) === "afternoon") {
          _push(`<button data-v-36f9bfea> 幫牠理毛 </button>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(currentTime) === "night") {
          _push(`<button data-v-36f9bfea> 看電視 </button>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(currentTime) === "night") {
          _push(`<button data-v-36f9bfea> 念故事 </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button data-v-36f9bfea>欺負牠</button></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/CatGame/CatGameToolPlay.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const CatGameToolPlay = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-36f9bfea"]]);
const _sfc_main$a = {
  __name: "CatGameToolBath",
  __ssrInlineRender: true,
  setup(__props) {
    useCatStateTools();
    const {
      currentTime
    } = useTimeStateTools();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(currentTime) === "bath") {
        _push(`<div${ssrRenderAttrs(_attrs)}><button>洗澡</button><button>不洗澡</button></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/CatGame/CatGameToolBath.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = {
  __name: "CatGameToolSleep",
  __ssrInlineRender: true,
  setup(__props) {
    useCatStateTools();
    const {
      currentTime
    } = useTimeStateTools();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(currentTime) === "sleep") {
        _push(`<div${ssrRenderAttrs(_attrs)}><button>叫牠睡覺</button><button>讓牠自由活動</button></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/CatGame/CatGameToolSleep.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = {
  __name: "CatGameToolNextDay",
  __ssrInlineRender: true,
  setup(__props) {
    useCatStateTools();
    const {
      currentTime
    } = useTimeStateTools();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(currentTime) === "calculateThisDay") {
        _push(`<div${ssrRenderAttrs(_attrs)}><button>結束這一天</button></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/CatGame/CatGameToolNextDay.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = {
  __name: "CatGameToolRestart",
  __ssrInlineRender: true,
  setup(__props) {
    useCatStateTools();
    useTimeStateTools();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><button>重新開始</button></div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/CatGame/CatGameToolRestart.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = {
  __name: "GamePage",
  __ssrInlineRender: true,
  props: {
    catGameShow: {
      type: Boolean,
      default: true
    }
  },
  emits: ["minimize"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const {
      appName,
      options,
      foodValue,
      feelValue,
      sleepValue,
      cleanValue,
      stated,
      energy,
      cleanState,
      respond,
      demon,
      noSleep
    } = useCatStateTools();
    const { day, WhatTimeNow } = useTimeStateTools();
    const whatCatYouHave = () => {
      if (demon.value >= 12) {
        return "殺手貓";
      } else if (cleanValue.value >= 10) {
        return "潔癖貓";
      } else if (noSleep.value >= 6) {
        return "熬夜貓";
      } else if (sleepValue.value >= 150 && feelValue.value >= 150) {
        return "死靈貓";
      } else if (foodValue.value >= 100) {
        return "大胖貓";
      } else if (foodValue.value <= 10) {
        return "骷髏弓箭貓";
      } else if (feelValue.value >= 130) {
        return "活力貓";
      } else if (sleepValue.value >= 150) {
        return "嗜睡貓";
      } else if (energy.value === "健康" && feelValue.value >= 80 && sleepValue.value >= 60) {
        return "健康貓";
      } else {
        return "快樂貓";
      }
    };
    const whatCatImgURL = () => {
      if (whatCatYouHave() === "殺手貓") {
        return "/image/殺手貓.jpg";
      } else if (whatCatYouHave() === "潔癖貓") {
        return "/image/潔癖貓.gif";
      } else if (whatCatYouHave() === "熬夜貓") {
        return "/image/熬夜貓.jpg";
      } else if (whatCatYouHave() === "死靈貓") {
        return "/image/死靈貓.jpg";
      } else if (whatCatYouHave() === "大胖貓") {
        return "/image/大胖貓.jpg";
      } else if (whatCatYouHave() === "骷髏弓箭貓") {
        return "/image/骷髏弓箭貓.jpg";
      } else if (whatCatYouHave() === "活力貓") {
        return "/image/活力貓.jpg";
      } else if (whatCatYouHave() === "嗜睡貓") {
        return "/image/嗜睡貓.jpg";
      } else if (whatCatYouHave() === "健康貓") {
        return "/image/健康貓.jpg";
      } else if (whatCatYouHave() === "快樂貓") {
        return "/image/快樂貓.jpg";
      }
    };
    const catGameRef = ref(null);
    ref(null);
    const {
      position
    } = draggableTool(100, 350);
    const isSmallScreen = ref(false);
    const gameWindowShow = UseControlWindowsShow(toRef(props, "catGameShow"));
    const styleVars = computed(() => {
      if (isSmallScreen.value) {
        return {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100vw",
          display: gameWindowShow.value ? "block" : "none"
        };
      }
      return {
        top: `${position.value.top}px`,
        left: `${position.value.left}px`,
        width: isSmallScreen.value ? "100vw" : "640px",
        display: gameWindowShow.value ? "block" : "none"
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "catGameRef",
        ref: catGameRef,
        class: "gameWindow",
        style: styleVars.value
      }, _attrs))} data-v-491fd4cb><div class="control" data-v-491fd4cb><div class="left" data-v-491fd4cb><div class="logo" data-v-491fd4cb><img${ssrRenderAttr("src", _imports_1$2)} data-v-491fd4cb></div><div class="gameName" data-v-491fd4cb>${ssrInterpolate(unref(appName))}</div></div><div class="right" data-v-491fd4cb><div class="controlButton" data-v-491fd4cb><button class="minimize" type="button" data-v-491fd4cb><svg xmlns="http://www.w3.org/2000/svg" height="10" width="10" viewBox="0 0 512 512" data-v-491fd4cb><path d="M24 432c-13.3 0-24 10.7-24 24s10.7 24 24 24l464 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L24 432z" data-v-491fd4cb></path></svg></button></div><div class="controlButton close" data-v-491fd4cb><button type="button" data-v-491fd4cb><svg xmlns="http://www.w3.org/2000/svg" height="10" width="7.5" viewBox="0 0 384 512" data-v-491fd4cb><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" data-v-491fd4cb></path></svg></button></div></div></div><div class="Options" data-v-491fd4cb><!--[-->`);
      ssrRenderList(unref(options), (option, index) => {
        _push(`<div data-v-491fd4cb>${ssrInterpolate(option.name)}</div>`);
      });
      _push(`<!--]--></div><div class="AllGameValue" data-v-491fd4cb><div class="toolValue" data-v-491fd4cb><div class="nameBox whiteBox" data-v-491fd4cb>名稱:貓咪</div><div class="buttonBox" data-v-491fd4cb>`);
      if (unref(day) !== 8) {
        _push(ssrRenderComponent(_sfc_main$c, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(day) !== 8) {
        _push(ssrRenderComponent(CatGameToolPlay, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(day) !== 8) {
        _push(ssrRenderComponent(_sfc_main$a, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(day) !== 8) {
        _push(ssrRenderComponent(_sfc_main$9, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(day) !== 8) {
        _push(ssrRenderComponent(_sfc_main$8, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(day) == 8) {
        _push(ssrRenderComponent(_sfc_main$7, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="gameValue" data-v-491fd4cb><div class="AllState" data-v-491fd4cb><h1 class="greyBox" data-v-491fd4cb>狀態</h1><div class="whiteBox" data-v-491fd4cb><span data-v-491fd4cb>日期:第${ssrInterpolate(unref(day))}天</span><span data-v-491fd4cb>時間:${ssrInterpolate(unref(WhatTimeNow))}</span><span data-v-491fd4cb>外觀:看起來很${ssrInterpolate(unref(stated))}</span><span data-v-491fd4cb>身體:${ssrInterpolate(unref(cleanState))}</span></div></div><div class="catValue" data-v-491fd4cb><h1 class="greyBox" data-v-491fd4cb></h1><div data-v-491fd4cb></div><div class="whiteBox" data-v-491fd4cb><div data-v-491fd4cb>`);
      if (unref(day) !== 8) {
        _push(`<div data-v-491fd4cb>${ssrInterpolate(unref(respond))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(day) === 8) {
        _push(`<div data-v-491fd4cb> 一周過去，你的貓成為了${ssrInterpolate(whatCatYouHave())}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="imageBox" data-v-491fd4cb>`);
      if (unref(day) !== 8) {
        _push(`<img${ssrRenderAttr("src", _imports_1$1)} data-v-491fd4cb>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(day) === 8) {
        _push(`<img${ssrRenderAttr("src", whatCatImgURL())} data-v-491fd4cb>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div><div class="Info" data-v-491fd4cb><div data-v-491fd4cb><span data-v-491fd4cb>飽足感:${ssrInterpolate(unref(foodValue))}</span><span data-v-491fd4cb>心情:${ssrInterpolate(unref(feelValue))}</span><span data-v-491fd4cb>疲勞感:${ssrInterpolate(unref(sleepValue))}</span></div></div></div></div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/CatGame/GamePage.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const GamePage = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-491fd4cb"]]);
const _imports_0$1 = publicAssetsURL("/image/win95Icon.png");
const _imports_0 = publicAssetsURL("/image/solitaireIcon.png");
const _sfc_main$5 = {
  __name: "windowBar",
  __ssrInlineRender: true,
  props: {
    catGameShow: {
      type: Boolean,
      default: true
    },
    SolitairGameShow: {
      type: Boolean,
      default: true
    },
    activeWindow: {
      default: "gameWindow"
    }
  },
  emits: [
    "minimize",
    "minimizeSolit"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const isHidden = ref(false);
    watch(() => props.catGameShow, () => {
      isHidden.value = !isHidden.value;
    });
    const isSolitHidden = ref(false);
    watch(() => props.SolitairGameShow, () => {
      isSolitHidden.value = !isSolitHidden.value;
    });
    const now = ref(/* @__PURE__ */ new Date());
    const formattedTime = computed(() => {
      let hours = now.value.getHours();
      const minutes = now.value.getMinutes();
      const amPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, "0");
      return `${hours}:${formattedMinutes} ${amPm}`;
    });
    const solitaireDisplay = ref("true");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "windowsBar" }, _attrs))} data-v-917c7e0a><div data-v-917c7e0a><div class="StartDiv" data-v-917c7e0a><button data-v-917c7e0a><div class="imageDiv" data-v-917c7e0a><img${ssrRenderAttr("src", _imports_0$1)} data-v-917c7e0a></div> Start </button></div><div class="buttonDiv" data-v-917c7e0a><button class="${ssrRenderClass([[
        isHidden.value ? "buttonUseHidden" : "buttonUse",
        __props.activeWindow === "gameWindow" ? "buttonUse" : "buttonUseHidden"
      ], "AppDiv"])}" data-v-917c7e0a><div class="logo" data-v-917c7e0a><img${ssrRenderAttr("src", _imports_1$2)} data-v-917c7e0a></div><div data-v-917c7e0a>Cat Game</div></button>`);
      if (solitaireDisplay.value) {
        _push(`<button class="${ssrRenderClass([[
          isSolitHidden.value ? "buttonUseHidden" : "buttonUse",
          __props.activeWindow === "Solitaire" ? "buttonUse" : "buttonUseHidden"
        ], "AppDiv solitaire"])}" data-v-917c7e0a><div class="logo" data-v-917c7e0a><img${ssrRenderAttr("src", _imports_0)} data-v-917c7e0a></div><div data-v-917c7e0a>接龍</div></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div data-v-917c7e0a><div class="timeShow greyBox" data-v-917c7e0a>${ssrInterpolate(formattedTime.value)}</div></div></div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/windowBar.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const WindowBar = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-917c7e0a"]]);
const _imports_1 = publicAssetsURL("/image/接龍畫面.jpg");
const useSolitaire = defineStore("Solitaire", {
  state: () => ({
    appName: "接龍",
    options: [
      {
        name: "Game"
      },
      {
        name: "Help"
      }
    ]
  }),
  actions: {},
  getters: {}
});
const _sfc_main$4 = {
  __name: "SolitaireWindows",
  __ssrInlineRender: true,
  props: {
    SolitairGameShow: {
      type: Boolean,
      default: true
    }
  },
  emits: ["minimize"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const solitaireRef = ref(null);
    const { appName, options } = useSolitaire();
    const {
      position
    } = draggableTool(
      50,
      200
    );
    const SolitGameWindowShow = UseControlWindowsShow(toRef(props, "SolitairGameShow"));
    const styleVars = computed(() => ({
      top: `${position.value.top}px`,
      left: `${position.value.left}px`,
      display: SolitGameWindowShow.value ? "block" : "none"
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "solitaireRef",
        ref: solitaireRef,
        class: "SolitGameWindow",
        style: styleVars.value
      }, _attrs))} data-v-ede7c37d><div class="control" data-v-ede7c37d><div class="left" data-v-ede7c37d><div class="logo" data-v-ede7c37d><img${ssrRenderAttr("src", _imports_0)} data-v-ede7c37d></div><div class="gameName" data-v-ede7c37d>${ssrInterpolate(unref(appName))}</div></div><div class="right" data-v-ede7c37d><div class="controlButton" data-v-ede7c37d><button class="minimize" type="button" data-v-ede7c37d><svg xmlns="http://www.w3.org/2000/svg" height="10" width="10" viewBox="0 0 512 512" data-v-ede7c37d><path d="M24 432c-13.3 0-24 10.7-24 24s10.7 24 24 24l464 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L24 432z" data-v-ede7c37d></path></svg></button></div><div class="controlButton close" data-v-ede7c37d><button type="button" data-v-ede7c37d><svg xmlns="http://www.w3.org/2000/svg" height="10" width="7.5" viewBox="0 0 384 512" data-v-ede7c37d><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" data-v-ede7c37d></path></svg></button></div></div></div><div class="Options" data-v-ede7c37d><!--[-->`);
      ssrRenderList(unref(options), (option, index) => {
        _push(`<div data-v-ede7c37d>${ssrInterpolate(option.name)}</div>`);
      });
      _push(`<!--]--></div><div class="AllGameValue" data-v-ede7c37d><div class="gameDisplay" data-v-ede7c37d><img${ssrRenderAttr("src", _imports_1)} data-v-ede7c37d></div></div></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/Solitaire/SolitaireWindows.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const SolitaireWindows = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-ede7c37d"]]);
const _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "laoding" }, _attrs))} data-v-0609341e><h1 data-v-0609341e>Loading_</h1></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/Loading/LoadingPage.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const LoadingPage = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-0609341e"]]);
const _sfc_main$2 = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Cat Game",
      link: [
        {
          rel: "icon",
          type: "/image/png",
          href: "/icon.png"
        }
      ]
    });
    const isLoading = ref(true);
    const activeWindow = ref("gameWindow");
    const catGameShow = ref(true);
    const SolitairGameShow = ref(true);
    const setActiveWindow = (winName) => {
      if (warnWindowDisplay.value) return;
      activeWindow.value = winName;
    };
    const receiveMinimize = () => {
      if (warnWindowDisplay.value) return;
      catGameShow.value = !catGameShow.value;
      activeWindow.value = "gameWindow";
    };
    const receiveminimizeSolit = () => {
      if (warnWindowDisplay.value) return;
      SolitairGameShow.value = !SolitairGameShow.value;
      activeWindow.value = "Solitaire";
    };
    const warnWindowDisplay = ref(true);
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_0;
      _push(`<!--[-->`);
      if (isLoading.value) {
        _push(ssrRenderComponent(LoadingPage, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="backgronddIV">`);
      _push(ssrRenderComponent(GamePage, {
        class: "gameWindow",
        style: { zIndex: activeWindow.value === "gameWindow" ? 90 : 1 },
        onClick: ($event) => setActiveWindow("gameWindow"),
        onMinimize: receiveMinimize,
        catGameShow: catGameShow.value
      }, null, _parent));
      _push(ssrRenderComponent(SolitaireWindows, {
        class: "Solitaire",
        style: { zIndex: activeWindow.value === "Solitaire" ? 90 : 1 },
        onClick: ($event) => setActiveWindow("Solitaire"),
        onMinimize: receiveminimizeSolit,
        SolitairGameShow: SolitairGameShow.value
      }, null, _parent));
      _push(ssrRenderComponent(_component_client_only, { placeholder: "false" }, {}, _parent));
      if (warnWindowDisplay.value) {
        _push(`<div class="globalOverlay"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(WindowBar, {
        class: "WindowBar",
        onMinimize: receiveMinimize,
        onMinimizeSolit: receiveminimizeSolit,
        catGameShow: catGameShow.value,
        SolitairGameShow: SolitairGameShow.value,
        activeWindow: activeWindow.value
      }, null, _parent));
      _push(ssrRenderComponent(backGround, null, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-DXXyRg6b.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-Bf46rsHy.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { _export_sfc as _, useNuxtApp as a, useRuntimeConfig as b, nuxtLinkDefaults as c, useHead as d, entry$1 as default, navigateTo as n, resolveRouteObject as r, useRouter as u };
//# sourceMappingURL=server.mjs.map
