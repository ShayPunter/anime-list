import { defineComponent, computed, mergeProps, useSSRContext, ref, resolveComponent, withCtx, createTextVNode, unref, watch, onUnmounted, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, onMounted, withDirectives, vModelText, resolveDynamicComponent, Fragment, renderList, reactive, onScopeDispose, createSSRApp, h as h$1 } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderSlot, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderVNode, ssrRenderStyle, ssrLooseContain, ssrLooseEqual, renderToString } from "vue/server-renderer";
import { usePage, router, useForm, Link, createInertiaApp, Head } from "@inertiajs/vue3";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useQueryClient, useMutation, useQuery, VueQueryPlugin } from "@tanstack/vue-query";
import axios from "axios";
import Dialog from "primevue/dialog";
import Select from "primevue/select";
import Slider from "primevue/slider";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import ProgressBar from "primevue/progressbar";
import Bt from "node:http";
import zs from "node:https";
import st from "node:zlib";
import me, { PassThrough, pipeline } from "node:stream";
import { Buffer as Buffer$1 } from "node:buffer";
import { promisify, deprecate, types } from "node:util";
import { format } from "node:url";
import { isIP } from "node:net";
import { promises, statSync, createReadStream } from "node:fs";
import { basename } from "node:path";
import ToggleSwitch from "primevue/toggleswitch";
import Password from "primevue/password";
import createServer from "@inertiajs/vue3/server";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Aura from "@primevue/themes/aura";
const _sfc_main$T = /* @__PURE__ */ defineComponent({
  __name: "UserAvatar",
  __ssrInlineRender: true,
  props: {
    name: {},
    avatarUrl: { default: null },
    size: { default: "md" }
  },
  setup(__props) {
    const props = __props;
    const sizeClasses = computed(() => {
      switch (props.size) {
        case "sm":
          return "w-8 h-8 text-xs";
        case "lg":
          return "w-20 h-20 text-2xl";
        default:
          return "w-10 h-10 text-sm";
      }
    });
    const initials = computed(() => {
      return props.name.split(/\s+/).slice(0, 2).map((w2) => w2[0]?.toUpperCase() ?? "").join("");
    });
    const bgColor = computed(() => {
      let hash = 0;
      for (const char of props.name) {
        hash = char.charCodeAt(0) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash) % 360;
      return `hsl(${hue}, 50%, 40%)`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.avatarUrl) {
        _push(`<img${ssrRenderAttrs(mergeProps({
          src: __props.avatarUrl,
          alt: __props.name,
          class: ["rounded-full object-cover", sizeClasses.value]
        }, _attrs))}>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: ["rounded-full flex items-center justify-center font-semibold text-white", sizeClasses.value],
          style: { backgroundColor: bgColor.value }
        }, _attrs))}>${ssrInterpolate(initials.value)}</div>`);
      }
    };
  }
});
const _sfc_setup$T = _sfc_main$T.setup;
_sfc_main$T.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/UserAvatar.vue");
  return _sfc_setup$T ? _sfc_setup$T(props, ctx) : void 0;
};
function useFeature(name) {
  const page = usePage();
  return computed(() => page.props.features?.[name] ?? false);
}
const _sfc_main$S = /* @__PURE__ */ defineComponent({
  __name: "AppNavbar",
  __ssrInlineRender: true,
  props: {
    user: {},
    isAuthenticated: { type: Boolean }
  },
  setup(__props) {
    const showPlaylists = useFeature("playlists");
    const showDropdown = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50" }, _attrs))}><div class="container mx-auto px-4 flex items-center justify-between h-16"><div class="flex items-center gap-6">`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("home"),
        class: "text-xl font-bold text-primary-400"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`AniTrack`);
          } else {
            return [
              createTextVNode("AniTrack")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="hidden md:flex items-center gap-4">`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("seasonal"),
        class: "text-gray-400 hover:text-gray-100 transition"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Seasonal`);
          } else {
            return [
              createTextVNode("Seasonal")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("schedule"),
        class: "text-gray-400 hover:text-gray-100 transition"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Schedule`);
          } else {
            return [
              createTextVNode("Schedule")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("top.rated"),
        class: "text-gray-400 hover:text-gray-100 transition"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Top`);
          } else {
            return [
              createTextVNode("Top")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("anime.index"),
        class: "text-gray-400 hover:text-gray-100 transition"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Browse`);
          } else {
            return [
              createTextVNode("Browse")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="flex items-center gap-4">`);
      if (__props.isAuthenticated && __props.user) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_Link, {
          href: _ctx.route("list"),
          class: "text-gray-400 hover:text-gray-100 transition"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`My List`);
            } else {
              return [
                createTextVNode("My List")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(showPlaylists)) {
          _push(ssrRenderComponent(_component_Link, {
            href: _ctx.route("playlists.index"),
            class: "text-gray-400 hover:text-gray-100 transition"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Playlists`);
              } else {
                return [
                  createTextVNode("Playlists")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="relative"><button class="flex items-center gap-2 text-gray-400 hover:text-gray-100 transition">`);
        _push(ssrRenderComponent(_sfc_main$T, {
          name: __props.user.name,
          "avatar-url": __props.user.avatar_url,
          size: "sm"
        }, null, _parent));
        _push(`<span class="hidden sm:inline">${ssrInterpolate(__props.user.name)}</span></button>`);
        if (showDropdown.value) {
          _push(`<div class="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-1">`);
          _push(ssrRenderComponent(_component_Link, {
            href: _ctx.route("profile.show", { user: __props.user.username }),
            class: "block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Profile `);
              } else {
                return [
                  createTextVNode(" Profile ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_Link, {
            href: _ctx.route("settings"),
            class: "block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Settings `);
              } else {
                return [
                  createTextVNode(" Settings ")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (__props.user.is_admin) {
            _push(ssrRenderComponent(_component_Link, {
              href: _ctx.route("admin.dashboard"),
              class: "block px-4 py-2 text-sm text-primary-400 hover:bg-gray-800 hover:text-primary-300"
            }, {
              default: withCtx((_2, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Admin `);
                } else {
                  return [
                    createTextVNode(" Admin ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<hr class="border-gray-700 my-1"><button class="block w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-100"> Logout </button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><!--]-->`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_Link, {
          href: _ctx.route("login"),
          class: "text-gray-400 hover:text-gray-100 transition"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Login`);
            } else {
              return [
                createTextVNode("Login")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_Link, {
          href: _ctx.route("register"),
          class: "bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition text-sm"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Sign Up`);
            } else {
              return [
                createTextVNode("Sign Up")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</div></div></nav>`);
    };
  }
});
const _sfc_setup$S = _sfc_main$S.setup;
_sfc_main$S.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AppNavbar.vue");
  return _sfc_setup$S ? _sfc_setup$S(props, ctx) : void 0;
};
const _sfc_main$R = /* @__PURE__ */ defineComponent({
  __name: "AppFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const publicApiEnabled = useFeature("public-api");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "mt-16 border-t border-gray-800 bg-gray-950" }, _attrs))}><div class="container mx-auto px-4 py-10"><div class="grid grid-cols-1 gap-8 sm:grid-cols-3"><div><h3 class="mb-3 text-sm font-semibold text-gray-300">Navigate</h3><ul class="space-y-2 text-sm"><li>`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("home"),
        class: "text-gray-500 transition hover:text-gray-200"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Home`);
          } else {
            return [
              createTextVNode("Home")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("anime.index"),
        class: "text-gray-500 transition hover:text-gray-200"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Browse Anime`);
          } else {
            return [
              createTextVNode("Browse Anime")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("seasonal"),
        class: "text-gray-500 transition hover:text-gray-200"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Seasonal`);
          } else {
            return [
              createTextVNode("Seasonal")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("schedule"),
        class: "text-gray-500 transition hover:text-gray-200"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Schedule`);
          } else {
            return [
              createTextVNode("Schedule")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("top.rated"),
        class: "text-gray-500 transition hover:text-gray-200"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Top Anime`);
          } else {
            return [
              createTextVNode("Top Anime")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li>`);
      if (unref(publicApiEnabled)) {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_Link, {
          href: _ctx.route("developers"),
          class: "text-gray-500 transition hover:text-gray-200"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Developers`);
            } else {
              return [
                createTextVNode("Developers")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></div><div><h3 class="mb-3 text-sm font-semibold text-gray-300">Legal</h3><ul class="space-y-2 text-sm"><li>`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("terms"),
        class: "text-gray-500 transition hover:text-gray-200"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Terms of Service`);
          } else {
            return [
              createTextVNode("Terms of Service")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("privacy"),
        class: "text-gray-500 transition hover:text-gray-200"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Privacy Policy`);
          } else {
            return [
              createTextVNode("Privacy Policy")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li><a href="/sitemap.xml" class="text-gray-500 transition hover:text-gray-200">Sitemap</a></li></ul></div><div><h3 class="mb-3 text-sm font-semibold text-gray-300">AniTrack</h3><p class="text-sm text-gray-500"> Track your anime, discover new shows, and share your list with friends. </p><p class="mt-2 text-xs text-gray-600"> Anime data provided by <a href="https://anilist.co" target="_blank" rel="noopener noreferrer" class="text-gray-500 transition hover:text-gray-200">AniList</a>. </p></div></div><div class="mt-8 border-t border-gray-800/50 pt-6 text-center text-xs text-gray-600"> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} AniTrack </div></div></footer>`);
    };
  }
});
const _sfc_setup$R = _sfc_main$R.setup;
_sfc_main$R.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AppFooter.vue");
  return _sfc_setup$R ? _sfc_setup$R(props, ctx) : void 0;
};
function useFlashToast() {
  const page = usePage();
  const toast = useToast();
  const stop = watch(
    () => page.props.flash?.message,
    (message) => {
      if (!message) return;
      const status = page.props.flash?.status ?? "info";
      const severityMap = {
        success: "success",
        error: "error",
        warning: "warn",
        info: "info"
      };
      toast.add({
        severity: severityMap[status] ?? "info",
        summary: status.charAt(0).toUpperCase() + status.slice(1),
        detail: message,
        life: 3e3
      });
    }
  );
  onUnmounted(stop);
}
const _sfc_main$Q = /* @__PURE__ */ defineComponent({
  __name: "AppLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const user = computed(() => page.props.auth.user);
    const isAuthenticated = computed(() => !!user.value);
    useFlashToast();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-950 text-gray-100 dark" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$S, {
        user: user.value,
        "is-authenticated": isAuthenticated.value
      }, null, _parent));
      _push(`<main class="container mx-auto px-4 py-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(_sfc_main$R, null, null, _parent));
      _push(ssrRenderComponent(unref(Toast), { position: "top-right" }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$Q = _sfc_main$Q.setup;
_sfc_main$Q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/AppLayout.vue");
  return _sfc_setup$Q ? _sfc_setup$Q(props, ctx) : void 0;
};
const _sfc_main$P = /* @__PURE__ */ defineComponent({
  __name: "AdminNav",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const currentUrl = computed(() => page.url);
    const links = [
      { label: "Dashboard", route: "admin.dashboard" },
      { label: "Users", route: "admin.users" },
      { label: "Feature Flags", route: "admin.features" }
    ];
    function isActive(routeName) {
      return currentUrl.value.startsWith(route(routeName));
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-1 mb-6 border-b border-gray-800 pb-3" }, _attrs))}><!--[-->`);
      ssrRenderList(links, (link) => {
        _push(ssrRenderComponent(_component_Link, {
          key: link.route,
          href: _ctx.route(link.route),
          class: ["rounded-lg px-3 py-1.5 text-sm transition", isActive(link.route) ? "bg-gray-800 text-gray-100 font-medium" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"]
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav>`);
    };
  }
});
const _sfc_setup$P = _sfc_main$P.setup;
_sfc_main$P.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AdminNav.vue");
  return _sfc_setup$P ? _sfc_setup$P(props, ctx) : void 0;
};
const _sfc_main$O = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "DashboardPage",
  __ssrInlineRender: true,
  props: {
    stats: {},
    recentUsers: {},
    syncStatuses: {}
  },
  setup(__props) {
    function formatDate(iso) {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
    function syncStatusColor(status) {
      if (status === "completed") return "text-green-400";
      if (status === "running") return "text-yellow-400";
      if (status === "failed") return "text-red-400";
      return "text-gray-500";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Admin Dashboard" }, null, _parent));
      _push(`<div class="mx-auto max-w-6xl space-y-8">`);
      _push(ssrRenderComponent(_sfc_main$P, null, null, _parent));
      _push(`<h1 class="text-2xl font-bold">Dashboard</h1><div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"><div class="rounded-xl border border-gray-800 bg-gray-900 p-4"><div class="text-2xl font-bold text-primary-400">${ssrInterpolate(__props.stats.total_users.toLocaleString())}</div><div class="mt-1 text-xs text-gray-400">Total Users</div></div><div class="rounded-xl border border-gray-800 bg-gray-900 p-4"><div class="text-2xl font-bold text-primary-400">${ssrInterpolate(__props.stats.new_users_this_month)}</div><div class="mt-1 text-xs text-gray-400">New This Month</div></div><div class="rounded-xl border border-gray-800 bg-gray-900 p-4"><div class="text-2xl font-bold text-primary-400">${ssrInterpolate(__props.stats.total_anime.toLocaleString())}</div><div class="mt-1 text-xs text-gray-400">Anime in DB</div></div><div class="rounded-xl border border-gray-800 bg-gray-900 p-4"><div class="text-2xl font-bold text-primary-400">${ssrInterpolate(__props.stats.total_list_entries.toLocaleString())}</div><div class="mt-1 text-xs text-gray-400">List Entries</div></div><div class="rounded-xl border border-gray-800 bg-gray-900 p-4"><div class="text-2xl font-bold text-primary-400">${ssrInterpolate(__props.stats.total_episodes_watched.toLocaleString())}</div><div class="mt-1 text-xs text-gray-400">Episodes Watched</div></div><div class="rounded-xl border border-gray-800 bg-gray-900 p-4"><div class="text-2xl font-bold text-primary-400">${ssrInterpolate(__props.stats.active_users_today)}</div><div class="mt-1 text-xs text-gray-400">Active Today</div></div></div><div class="grid gap-6 lg:grid-cols-2"><div class="rounded-xl border border-gray-800 bg-gray-900 p-6"><h2 class="mb-4 text-lg font-semibold">Sync Status</h2><div class="space-y-3"><div class="flex items-center justify-between"><span class="text-sm text-gray-400">Releasing Anime</span><span class="${ssrRenderClass([syncStatusColor(__props.syncStatuses.releasing), "text-sm font-medium capitalize"])}">${ssrInterpolate(__props.syncStatuses.releasing)}</span></div><div class="flex items-center justify-between"><span class="text-sm text-gray-400">Incremental Sync</span><span class="${ssrRenderClass([syncStatusColor(__props.syncStatuses.incremental), "text-sm font-medium capitalize"])}">${ssrInterpolate(__props.syncStatuses.incremental)}</span></div><div class="flex items-center justify-between"><span class="text-sm text-gray-400">Airing Schedule</span><span class="${ssrRenderClass([syncStatusColor(__props.syncStatuses.schedule), "text-sm font-medium capitalize"])}">${ssrInterpolate(__props.syncStatuses.schedule)}</span></div></div></div><div class="rounded-xl border border-gray-800 bg-gray-900 p-6"><h2 class="mb-4 text-lg font-semibold">Recent Users</h2><div class="space-y-3"><!--[-->`);
      ssrRenderList(__props.recentUsers, (user) => {
        _push(`<div class="flex items-center justify-between"><div class="flex items-center gap-3"><div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-xs font-medium text-gray-300">${ssrInterpolate(user.name.charAt(0).toUpperCase())}</div><div><div class="text-sm font-medium text-gray-200">${ssrInterpolate(user.name)} `);
        if (user.is_admin) {
          _push(`<span class="ml-1 rounded bg-primary-600/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary-400"> ADMIN </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="text-xs text-gray-500">${ssrInterpolate(user.email)}</div></div></div><div class="text-xs text-gray-500">${ssrInterpolate(formatDate(user.created_at))}</div></div>`);
      });
      _push(`<!--]--></div></div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$O = _sfc_main$O.setup;
_sfc_main$O.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/DashboardPage.vue");
  return _sfc_setup$O ? _sfc_setup$O(props, ctx) : void 0;
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$O
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$N = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "FeatureFlagsPage",
  __ssrInlineRender: true,
  props: {
    features: {}
  },
  setup(__props) {
    const addingUserFor = ref(null);
    const usernameInput = ref("");
    const addingError = ref("");
    const statusLabels = {
      everyone: "Everyone",
      nobody: "Nobody",
      default: "Default (Off)",
      specific: "Specific Users"
    };
    const statusColors = {
      everyone: "text-green-400",
      nobody: "text-red-400",
      default: "text-gray-500",
      specific: "text-yellow-400"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Feature Flags" }, null, _parent));
      _push(`<div class="mx-auto max-w-6xl">`);
      _push(ssrRenderComponent(_sfc_main$P, null, null, _parent));
      _push(`<h1 class="text-2xl font-bold mb-6">Feature Flags</h1>`);
      if (__props.features.length === 0) {
        _push(`<div class="text-center py-12 text-gray-500"> No feature flags defined. </div>`);
      } else {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(__props.features, (feature) => {
          _push(`<div class="bg-gray-900 border border-gray-800 rounded-xl p-5"><div class="flex items-center justify-between mb-3"><div><h2 class="font-semibold text-gray-100 font-mono">${ssrInterpolate(feature.name)}</h2><span class="${ssrRenderClass([statusColors[feature.status], "text-xs"])}">${ssrInterpolate(statusLabels[feature.status])}</span></div><div class="flex gap-1"><button class="${ssrRenderClass([feature.status === "everyone" ? "border-green-500 bg-green-600/20 text-green-400" : "border-gray-700 text-gray-400 hover:text-gray-200", "rounded px-3 py-1.5 text-xs transition border"])}"> Everyone </button><button class="${ssrRenderClass([feature.status === "nobody" ? "border-red-500 bg-red-600/20 text-red-400" : "border-gray-700 text-gray-400 hover:text-gray-200", "rounded px-3 py-1.5 text-xs transition border"])}"> Nobody </button><button class="${ssrRenderClass([feature.status === "default" ? "border-gray-500 bg-gray-600/20 text-gray-300" : "border-gray-700 text-gray-400 hover:text-gray-200", "rounded px-3 py-1.5 text-xs transition border"])}"> Default </button></div></div><div class="border-t border-gray-800 pt-3"><div class="flex items-center gap-2 mb-2"><span class="text-xs text-gray-500">User overrides</span><button class="text-xs text-primary-400 hover:text-primary-300 transition"> + Add user </button></div>`);
          if (addingUserFor.value === feature.name) {
            _push(`<div class="flex items-center gap-2 mb-2"><input${ssrRenderAttr("value", usernameInput.value)} type="text" placeholder="Username" class="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-gray-300 flex-1"><button class="rounded bg-primary-600 px-3 py-1 text-sm text-white hover:bg-primary-700 transition"> Add </button>`);
            if (addingError.value) {
              _push(`<span class="text-xs text-red-400">${ssrInterpolate(addingError.value)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (feature.users.length > 0) {
            _push(`<div class="flex flex-wrap gap-2"><!--[-->`);
            ssrRenderList(feature.users, (user) => {
              _push(`<div class="flex items-center gap-1.5 rounded-full bg-gray-800 pl-3 pr-1.5 py-1 text-xs"><span class="text-gray-300">${ssrInterpolate(user.username)}</span><button class="text-gray-500 hover:text-red-400 transition rounded-full p-0.5"> × </button></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<p class="text-xs text-gray-600">No user-specific overrides</p>`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$N = _sfc_main$N.setup;
_sfc_main$N.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/FeatureFlagsPage.vue");
  return _sfc_setup$N ? _sfc_setup$N(props, ctx) : void 0;
};
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$N
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$M = /* @__PURE__ */ defineComponent({
  __name: "PaginationBar",
  __ssrInlineRender: true,
  props: {
    currentPage: {},
    lastPage: {},
    total: {}
  },
  setup(__props) {
    const props = __props;
    function visiblePages() {
      const pages = [];
      const start = Math.max(1, props.currentPage - 2);
      const end = Math.min(props.lastPage, props.currentPage + 2);
      for (let i2 = start; i2 <= end; i2++) {
        pages.push(i2);
      }
      return pages;
    }
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.lastPage > 1) {
        _push(`<nav${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center gap-1" }, _attrs))}><button class="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(__props.currentPage === 1) ? " disabled" : ""}> Prev </button>`);
        if (visiblePages()[0] > 1) {
          _push(`<button class="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800"> 1 </button>`);
        } else {
          _push(`<!---->`);
        }
        if (visiblePages()[0] > 2) {
          _push(`<span class="px-1 text-gray-600">…</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(visiblePages(), (page) => {
          _push(`<button class="${ssrRenderClass([page === __props.currentPage ? "bg-primary-600 text-white" : "text-gray-400 hover:bg-gray-800", "rounded-lg px-3 py-2 text-sm transition"])}">${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]-->`);
        if (visiblePages()[visiblePages().length - 1] < __props.lastPage - 1) {
          _push(`<span class="px-1 text-gray-600">…</span>`);
        } else {
          _push(`<!---->`);
        }
        if (visiblePages()[visiblePages().length - 1] < __props.lastPage) {
          _push(`<button class="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800">${ssrInterpolate(__props.lastPage)}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(__props.currentPage === __props.lastPage) ? " disabled" : ""}> Next </button></nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$M = _sfc_main$M.setup;
_sfc_main$M.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/PaginationBar.vue");
  return _sfc_setup$M ? _sfc_setup$M(props, ctx) : void 0;
};
const _sfc_main$L = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "UsersPage",
  __ssrInlineRender: true,
  props: {
    users: {},
    filters: {}
  },
  setup(__props) {
    const props = __props;
    const search = ref(props.filters.search ?? "");
    let debounceTimer = null;
    watch(search, (value) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        router.get(route("admin.users"), { search: value || void 0 }, {
          preserveState: true,
          preserveScroll: true
        });
      }, 300);
    });
    const confirmingDelete = ref(null);
    function formatDate(iso) {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "User Management" }, null, _parent));
      _push(`<div class="mx-auto max-w-6xl space-y-6">`);
      _push(ssrRenderComponent(_sfc_main$P, null, null, _parent));
      _push(`<div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold">Users</h1><p class="mt-1 text-sm text-gray-400">${ssrInterpolate(__props.users.meta.total)} total users</p></div>`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("admin.dashboard"),
        class: "text-sm text-gray-400 transition hover:text-gray-200"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ← Dashboard `);
          } else {
            return [
              createTextVNode(" ← Dashboard ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><input${ssrRenderAttr("value", search.value)} type="text" placeholder="Search by name, email, or username..." class="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-gray-200 placeholder-gray-500 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"><div class="overflow-x-auto rounded-xl border border-gray-800"><table class="w-full"><thead class="border-b border-gray-800 bg-gray-900"><tr><th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">User</th><th class="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 md:table-cell">Email</th><th class="hidden px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-400 sm:table-cell">Anime</th><th class="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 lg:table-cell">Joined</th><th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Actions</th></tr></thead><tbody class="divide-y divide-gray-800"><!--[-->`);
      ssrRenderList(__props.users.data, (user) => {
        _push(`<tr class="bg-gray-950 transition hover:bg-gray-900"><td class="px-4 py-3"><div class="flex items-center gap-3">`);
        _push(ssrRenderComponent(_sfc_main$T, {
          name: user.name,
          "avatar-url": user.avatar_url,
          size: "sm"
        }, null, _parent));
        _push(`<div><div class="font-medium text-gray-200">${ssrInterpolate(user.name)} `);
        if (user.is_admin) {
          _push(`<span class="ml-1 rounded bg-primary-600/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary-400"> ADMIN </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="text-xs text-gray-500">@${ssrInterpolate(user.username)}</div></div></div></td><td class="hidden px-4 py-3 text-sm text-gray-400 md:table-cell">${ssrInterpolate(user.email)}</td><td class="hidden px-4 py-3 text-center text-sm text-gray-400 sm:table-cell">${ssrInterpolate(user.anime_count)}</td><td class="hidden px-4 py-3 text-sm text-gray-500 lg:table-cell">${ssrInterpolate(formatDate(user.created_at))}</td><td class="px-4 py-3 text-right"><div class="flex items-center justify-end gap-2"><button class="${ssrRenderClass([user.is_admin ? "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30" : "bg-gray-700 text-gray-300 hover:bg-gray-600", "rounded px-2.5 py-1 text-xs transition"])}">${ssrInterpolate(user.is_admin ? "Revoke Admin" : "Make Admin")}</button>`);
        if (confirmingDelete.value === user.id) {
          _push(`<!--[--><button class="rounded bg-red-600 px-2.5 py-1 text-xs text-white transition hover:bg-red-700"> Confirm </button><button class="rounded px-2.5 py-1 text-xs text-gray-400 transition hover:text-gray-200"> Cancel </button><!--]-->`);
        } else {
          _push(`<button class="rounded bg-red-600/20 px-2.5 py-1 text-xs text-red-400 transition hover:bg-red-600/30"> Delete </button>`);
        }
        _push(`</div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
      _push(ssrRenderComponent(_sfc_main$M, {
        "current-page": __props.users.meta.current_page,
        "last-page": __props.users.meta.last_page,
        total: __props.users.meta.total
      }, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$L = _sfc_main$L.setup;
_sfc_main$L.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/UsersPage.vue");
  return _sfc_setup$L ? _sfc_setup$L(props, ctx) : void 0;
};
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$L
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$K = /* @__PURE__ */ defineComponent({
  __name: "ScoreBadge",
  __ssrInlineRender: true,
  props: {
    score: {},
    size: {}
  },
  setup(__props) {
    const props = __props;
    const sizeClass = {
      sm: "text-xs px-1.5 py-0.5",
      md: "text-sm px-2 py-1",
      lg: "text-base px-3 py-1.5"
    }[props.size ?? "md"];
    function scoreColor(score) {
      if (score >= 8) return "bg-green-600/20 text-green-400 border-green-600/30";
      if (score >= 7) return "bg-lime-600/20 text-lime-400 border-lime-600/30";
      if (score >= 6) return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30";
      if (score >= 5) return "bg-orange-600/20 text-orange-400 border-orange-600/30";
      return "bg-red-600/20 text-red-400 border-red-600/30";
    }
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.score != null) {
        _push(`<span${ssrRenderAttrs(mergeProps({
          class: [[scoreColor(__props.score), unref(sizeClass)], "inline-flex items-center rounded-md border font-semibold"]
        }, _attrs))}>${ssrInterpolate(__props.score.toFixed(1))}</span>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$K = _sfc_main$K.setup;
_sfc_main$K.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ScoreBadge.vue");
  return _sfc_setup$K ? _sfc_setup$K(props, ctx) : void 0;
};
const _sfc_main$J = /* @__PURE__ */ defineComponent({
  __name: "GenreBadge",
  __ssrInlineRender: true,
  props: {
    name: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(ssrRenderComponent(_component_Link, mergeProps({
        href: _ctx.route("anime.index", { "filter[genre]": __props.name }),
        class: "inline-block rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300 transition hover:bg-primary-600/20 hover:text-primary-400"
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.name)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.name), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$J = _sfc_main$J.setup;
_sfc_main$J.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/GenreBadge.vue");
  return _sfc_setup$J ? _sfc_setup$J(props, ctx) : void 0;
};
const _sfc_main$I = /* @__PURE__ */ defineComponent({
  __name: "SeasonsSection",
  __ssrInlineRender: true,
  props: {
    seasons: {}
  },
  setup(__props) {
    function displayTitle(entry) {
      return entry.title_english || entry.title_romaji;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      if (__props.seasons.length > 1) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3" }, _attrs))}><h3 class="text-lg font-semibold text-gray-100"> Seasons <span class="text-sm font-normal text-gray-500">(${ssrInterpolate(__props.seasons.length)})</span></h3><div class="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700"><!--[-->`);
        ssrRenderList(__props.seasons, (season, index) => {
          _push(ssrRenderComponent(_component_Link, {
            key: season.id,
            href: season.slug ? _ctx.route("anime.show", { anime: season.slug }) : "#",
            class: ["group w-36 flex-shrink-0", { "pointer-events-none": season.is_current }]
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="${ssrRenderClass([season.is_current ? "ring-2 ring-primary-500" : "group-hover:ring-1 group-hover:ring-gray-600", "relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-800"])}"${_scopeId}>`);
                if (season.cover_image_large || season.cover_image_medium) {
                  _push2(`<img${ssrRenderAttr("src", (season.cover_image_large || season.cover_image_medium) ?? void 0)}${ssrRenderAttr("alt", displayTitle(season))} class="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><span class="rounded bg-gray-900/80 px-1.5 py-0.5 text-[10px] font-semibold text-gray-200"${_scopeId}> S${ssrInterpolate(index + 1)}</span>`);
                _push2(ssrRenderComponent(_sfc_main$K, {
                  score: season.average_score,
                  size: "sm"
                }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
                if (season.episodes) {
                  _push2(`<div class="absolute top-1.5 right-1.5"${_scopeId}><span class="rounded bg-gray-900/80 px-1.5 py-0.5 text-[10px] font-medium text-gray-300"${_scopeId}>${ssrInterpolate(season.episodes)} ep </span></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (season.is_current) {
                  _push2(`<div class="absolute top-1.5 left-1.5"${_scopeId}><span class="rounded bg-primary-600 px-1.5 py-0.5 text-[10px] font-semibold text-white"${_scopeId}> Current </span></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><p class="${ssrRenderClass([season.is_current ? "text-primary-400" : "text-gray-300 group-hover:text-primary-400", "mt-1.5 line-clamp-2 text-xs font-medium transition"])}"${_scopeId}>${ssrInterpolate(displayTitle(season))}</p>`);
              } else {
                return [
                  createVNode("div", {
                    class: ["relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-800", season.is_current ? "ring-2 ring-primary-500" : "group-hover:ring-1 group-hover:ring-gray-600"]
                  }, [
                    season.cover_image_large || season.cover_image_medium ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: (season.cover_image_large || season.cover_image_medium) ?? void 0,
                      alt: displayTitle(season),
                      class: "h-full w-full object-cover transition-transform group-hover:scale-105",
                      loading: "lazy"
                    }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                    createVNode("div", { class: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2" }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("span", { class: "rounded bg-gray-900/80 px-1.5 py-0.5 text-[10px] font-semibold text-gray-200" }, " S" + toDisplayString(index + 1), 1),
                        createVNode(_sfc_main$K, {
                          score: season.average_score,
                          size: "sm"
                        }, null, 8, ["score"])
                      ])
                    ]),
                    season.episodes ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "absolute top-1.5 right-1.5"
                    }, [
                      createVNode("span", { class: "rounded bg-gray-900/80 px-1.5 py-0.5 text-[10px] font-medium text-gray-300" }, toDisplayString(season.episodes) + " ep ", 1)
                    ])) : createCommentVNode("", true),
                    season.is_current ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "absolute top-1.5 left-1.5"
                    }, [
                      createVNode("span", { class: "rounded bg-primary-600 px-1.5 py-0.5 text-[10px] font-semibold text-white" }, " Current ")
                    ])) : createCommentVNode("", true)
                  ], 2),
                  createVNode("p", {
                    class: ["mt-1.5 line-clamp-2 text-xs font-medium transition", season.is_current ? "text-primary-400" : "text-gray-300 group-hover:text-primary-400"]
                  }, toDisplayString(displayTitle(season)), 3)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$I = _sfc_main$I.setup;
_sfc_main$I.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SeasonsSection.vue");
  return _sfc_setup$I ? _sfc_setup$I(props, ctx) : void 0;
};
const _sfc_main$H = /* @__PURE__ */ defineComponent({
  __name: "RelatedAnimeRow",
  __ssrInlineRender: true,
  props: {
    relations: {}
  },
  setup(__props) {
    function relationLabel(type) {
      return type.replace(/_/g, " ").replace(/\b\w/g, (c2) => c2.toUpperCase());
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      if (__props.relations.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3" }, _attrs))}><h3 class="text-lg font-semibold text-gray-100">Relations</h3><div class="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700"><!--[-->`);
        ssrRenderList(__props.relations, (rel) => {
          _push(ssrRenderComponent(_component_Link, {
            key: rel.id,
            href: rel.related_anime?.slug ? _ctx.route("anime.show", { anime: rel.related_anime.slug }) : "#",
            class: "group flex-shrink-0 w-36"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="aspect-[3/4] overflow-hidden rounded-lg bg-gray-800"${_scopeId}>`);
                if (rel.related_anime?.cover_image_medium) {
                  _push2(`<img${ssrRenderAttr("src", rel.related_anime.cover_image_medium)}${ssrRenderAttr("alt", rel.related_anime?.title_english || rel.related_anime?.title_romaji)} class="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><p class="mt-1.5 line-clamp-2 text-xs font-medium text-gray-300 group-hover:text-primary-400 transition"${_scopeId}>${ssrInterpolate(rel.related_anime?.title_english || rel.related_anime?.title_romaji || "Unknown")}</p><p class="text-[10px] text-gray-500"${_scopeId}>${ssrInterpolate(relationLabel(rel.relation_type))}</p>`);
              } else {
                return [
                  createVNode("div", { class: "aspect-[3/4] overflow-hidden rounded-lg bg-gray-800" }, [
                    rel.related_anime?.cover_image_medium ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: rel.related_anime.cover_image_medium,
                      alt: rel.related_anime?.title_english || rel.related_anime?.title_romaji,
                      class: "h-full w-full object-cover transition-transform group-hover:scale-105",
                      loading: "lazy"
                    }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                  ]),
                  createVNode("p", { class: "mt-1.5 line-clamp-2 text-xs font-medium text-gray-300 group-hover:text-primary-400 transition" }, toDisplayString(rel.related_anime?.title_english || rel.related_anime?.title_romaji || "Unknown"), 1),
                  createVNode("p", { class: "text-[10px] text-gray-500" }, toDisplayString(relationLabel(rel.relation_type)), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$H = _sfc_main$H.setup;
_sfc_main$H.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/RelatedAnimeRow.vue");
  return _sfc_setup$H ? _sfc_setup$H(props, ctx) : void 0;
};
let refCount = 0;
let intervalId = null;
const now = ref(Date.now());
function useCountdown() {
  onMounted(() => {
    refCount++;
    if (refCount === 1) {
      now.value = Date.now();
      intervalId = setInterval(() => {
        now.value = Date.now();
      }, 6e4);
    }
  });
  onUnmounted(() => {
    refCount--;
    if (refCount === 0 && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });
  function formatCountdown(airsAt) {
    const target = new Date(airsAt).getTime();
    if (Number.isNaN(target)) return "--";
    const seconds = Math.floor((target - now.value) / 1e3);
    if (seconds <= 0) return "Aired";
    const d2 = Math.floor(seconds / 86400);
    const h2 = Math.floor(seconds % 86400 / 3600);
    const m2 = Math.floor(seconds % 3600 / 60);
    if (d2 > 0) return `${d2}d ${h2}h`;
    if (h2 > 0) return `${h2}h ${m2}m`;
    return `${m2}m`;
  }
  function formatLocalTime(iso, timezone) {
    try {
      return new Date(iso).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timezone,
        hour12: true
      });
    } catch {
      return new Date(iso).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    }
  }
  function formatLocalDate(iso, timezone) {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: timezone
      });
    } catch {
      return new Date(iso).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
      });
    }
  }
  return { now, formatCountdown, formatLocalTime, formatLocalDate };
}
const _sfc_main$G = /* @__PURE__ */ defineComponent({
  __name: "AiringScheduleTable",
  __ssrInlineRender: true,
  props: {
    schedules: {}
  },
  setup(__props) {
    const { formatCountdown, formatLocalDate } = useCountdown();
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.schedules.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3" }, _attrs))}><h3 class="text-lg font-semibold text-gray-100">Upcoming Episodes</h3><div class="overflow-hidden rounded-lg border border-gray-800"><table class="w-full text-sm"><thead><tr class="border-b border-gray-800 bg-gray-900/50"><th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Episode</th><th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Date</th><th class="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Countdown</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(__props.schedules, (schedule) => {
          _push(`<tr class="border-b border-gray-800/50 last:border-0"><td class="px-4 py-2.5 text-gray-200">EP ${ssrInterpolate(schedule.episode)}</td><td class="px-4 py-2.5 text-gray-400">${ssrInterpolate(unref(formatLocalDate)(schedule.airs_at))}</td><td class="px-4 py-2.5 text-right text-primary-400 font-medium">${ssrInterpolate(unref(formatCountdown)(schedule.airs_at))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AiringScheduleTable.vue");
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const LIST_STATUS_LABELS = {
  watching: "Watching",
  completed: "Completed",
  on_hold: "On Hold",
  dropped: "Dropped",
  plan_to_watch: "Plan to Watch"
};
function useListMutations() {
  const queryClient = useQueryClient();
  const storeMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post("/api/list", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myList"] });
    }
  });
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...patch }) => {
      const { data } = await axios.patch(`/api/list/${id}`, patch);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myList"] });
    }
  });
  const destroyMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/list/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myList"] });
    }
  });
  return {
    storeMutation,
    updateMutation,
    destroyMutation
  };
}
const _sfc_main$F = /* @__PURE__ */ defineComponent({
  __name: "ListEntryModal",
  __ssrInlineRender: true,
  props: {
    anime: {},
    entry: {}
  },
  emits: ["close", "saved", "deleted"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const visible = ref(true);
    const statusOptions = Object.entries(LIST_STATUS_LABELS).map(([value, label]) => ({ value, label }));
    const status = ref(props.entry?.status ?? "plan_to_watch");
    const displayScore = ref(props.entry?.display_score ?? 0);
    const progress = ref(props.entry?.progress ?? 0);
    const startedAt = ref(props.entry?.started_at ?? "");
    const completedAt = ref(props.entry?.completed_at ?? "");
    const notes = ref(props.entry?.notes ?? "");
    const showNotes = ref(!!props.entry?.notes);
    const toast = useToast();
    const { storeMutation, updateMutation, destroyMutation } = useListMutations();
    const saving = computed(() => storeMutation.isPending.value || updateMutation.isPending.value);
    function save() {
      const score = displayScore.value > 0 ? Math.round(displayScore.value * 10) : null;
      const payload = {
        status: status.value,
        score,
        progress: progress.value,
        started_at: startedAt.value || null,
        completed_at: completedAt.value || null,
        notes: notes.value || null
      };
      const onError = () => {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to save. Please try again.",
          life: 4e3
        });
      };
      if (props.entry) {
        updateMutation.mutate(
          { id: props.entry.id, ...payload },
          { onSuccess: (data) => emit("saved", data), onError }
        );
      } else {
        storeMutation.mutate(
          { anime_id: props.anime.id, ...payload },
          { onSuccess: (data) => emit("saved", data), onError }
        );
      }
    }
    function remove() {
      if (!props.entry) return;
      destroyMutation.mutate(props.entry.id, {
        onSuccess: () => emit("deleted"),
        onError: () => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to remove. Please try again.",
            life: 4e3
          });
        }
      });
    }
    function close() {
      visible.value = false;
      emit("close");
    }
    const displayTitle = computed(() => props.anime.title_english || props.anime.title_romaji);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Dialog), mergeProps({
        visible: visible.value,
        modal: "",
        header: __props.entry ? "Edit Entry" : "Add to List",
        class: "w-full max-w-lg",
        "onUpdate:visible": (v2) => {
          if (!v2) close();
        }
      }, _attrs), {
        footer: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between w-full"${_scopeId}>`);
            if (__props.entry) {
              _push2(ssrRenderComponent(unref(Button), {
                label: "Remove",
                severity: "danger",
                text: "",
                size: "small",
                onClick: remove
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<span${_scopeId}></span>`);
            }
            _push2(`<div class="flex gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Button), {
              label: "Cancel",
              severity: "secondary",
              text: "",
              onClick: close
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Button), {
              label: "Save",
              loading: saving.value,
              onClick: save
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between w-full" }, [
                __props.entry ? (openBlock(), createBlock(unref(Button), {
                  key: 0,
                  label: "Remove",
                  severity: "danger",
                  text: "",
                  size: "small",
                  onClick: remove
                })) : (openBlock(), createBlock("span", { key: 1 })),
                createVNode("div", { class: "flex gap-2" }, [
                  createVNode(unref(Button), {
                    label: "Cancel",
                    severity: "secondary",
                    text: "",
                    onClick: close
                  }),
                  createVNode(unref(Button), {
                    label: "Save",
                    loading: saving.value,
                    onClick: save
                  }, null, 8, ["loading"])
                ])
              ])
            ];
          }
        }),
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><p class="text-sm text-gray-400"${_scopeId}>${ssrInterpolate(displayTitle.value)}</p><div${_scopeId}><label class="block text-sm text-gray-400 mb-1"${_scopeId}>Status</label>`);
            _push2(ssrRenderComponent(unref(Select), {
              modelValue: status.value,
              "onUpdate:modelValue": ($event) => status.value = $event,
              options: unref(statusOptions),
              "option-label": "label",
              "option-value": "value",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label class="block text-sm text-gray-400 mb-1"${_scopeId}> Score: ${ssrInterpolate(displayScore.value > 0 ? displayScore.value.toFixed(1) : "-")}</label>`);
            _push2(ssrRenderComponent(unref(Slider), {
              "model-value": displayScore.value,
              min: 0,
              max: 10,
              step: 0.5,
              class: "w-full",
              "onUpdate:modelValue": (v2) => displayScore.value = Array.isArray(v2) ? v2[0] : v2
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label class="block text-sm text-gray-400 mb-1"${_scopeId}> Progress </label><div class="flex items-center gap-2"${_scopeId}><input${ssrRenderAttr("value", progress.value)} type="number" min="0" class="w-20 rounded border border-gray-700 bg-gray-800 px-2 py-1.5 text-gray-200 text-sm"${_scopeId}><span class="text-gray-500"${_scopeId}>/ ${ssrInterpolate(__props.anime.episodes ?? "?")}</span></div></div><div class="grid grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm text-gray-400 mb-1"${_scopeId}>Start Date</label>`);
            _push2(ssrRenderComponent(unref(InputText), {
              modelValue: startedAt.value,
              "onUpdate:modelValue": ($event) => startedAt.value = $event,
              type: "date",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label class="block text-sm text-gray-400 mb-1"${_scopeId}>Finish Date</label>`);
            _push2(ssrRenderComponent(unref(InputText), {
              modelValue: completedAt.value,
              "onUpdate:modelValue": ($event) => completedAt.value = $event,
              type: "date",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div${_scopeId}>`);
            if (!showNotes.value) {
              _push2(`<button class="text-sm text-gray-500 hover:text-gray-300 transition"${_scopeId}> + Add Notes </button>`);
            } else {
              _push2(`<div${_scopeId}><label class="block text-sm text-gray-400 mb-1"${_scopeId}>Notes</label>`);
              _push2(ssrRenderComponent(unref(Textarea), {
                modelValue: notes.value,
                "onUpdate:modelValue": ($event) => notes.value = $event,
                rows: "2",
                class: "w-full"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("p", { class: "text-sm text-gray-400" }, toDisplayString(displayTitle.value), 1),
                createVNode("div", null, [
                  createVNode("label", { class: "block text-sm text-gray-400 mb-1" }, "Status"),
                  createVNode(unref(Select), {
                    modelValue: status.value,
                    "onUpdate:modelValue": ($event) => status.value = $event,
                    options: unref(statusOptions),
                    "option-label": "label",
                    "option-value": "value",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "block text-sm text-gray-400 mb-1" }, " Score: " + toDisplayString(displayScore.value > 0 ? displayScore.value.toFixed(1) : "-"), 1),
                  createVNode(unref(Slider), {
                    "model-value": displayScore.value,
                    min: 0,
                    max: 10,
                    step: 0.5,
                    class: "w-full",
                    "onUpdate:modelValue": (v2) => displayScore.value = Array.isArray(v2) ? v2[0] : v2
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "block text-sm text-gray-400 mb-1" }, " Progress "),
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => progress.value = $event,
                      type: "number",
                      min: "0",
                      class: "w-20 rounded border border-gray-700 bg-gray-800 px-2 py-1.5 text-gray-200 text-sm"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [
                        vModelText,
                        progress.value,
                        void 0,
                        { number: true }
                      ]
                    ]),
                    createVNode("span", { class: "text-gray-500" }, "/ " + toDisplayString(__props.anime.episodes ?? "?"), 1)
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm text-gray-400 mb-1" }, "Start Date"),
                    createVNode(unref(InputText), {
                      modelValue: startedAt.value,
                      "onUpdate:modelValue": ($event) => startedAt.value = $event,
                      type: "date",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm text-gray-400 mb-1" }, "Finish Date"),
                    createVNode(unref(InputText), {
                      modelValue: completedAt.value,
                      "onUpdate:modelValue": ($event) => completedAt.value = $event,
                      type: "date",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                createVNode("div", null, [
                  !showNotes.value ? (openBlock(), createBlock("button", {
                    key: 0,
                    class: "text-sm text-gray-500 hover:text-gray-300 transition",
                    onClick: ($event) => showNotes.value = true
                  }, " + Add Notes ", 8, ["onClick"])) : (openBlock(), createBlock("div", { key: 1 }, [
                    createVNode("label", { class: "block text-sm text-gray-400 mb-1" }, "Notes"),
                    createVNode(unref(Textarea), {
                      modelValue: notes.value,
                      "onUpdate:modelValue": ($event) => notes.value = $event,
                      rows: "2",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ListEntryModal.vue");
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const _sfc_main$E = /* @__PURE__ */ defineComponent({
  __name: "AddToListButton",
  __ssrInlineRender: true,
  props: {
    anime: {},
    initialEntry: {}
  },
  setup(__props) {
    const props = __props;
    const toast = useToast();
    const showModal = ref(false);
    const currentEntry = ref(props.initialEntry);
    function onSaved(entry) {
      showModal.value = false;
      const isNew = !currentEntry.value;
      currentEntry.value = entry;
      toast.add({
        severity: "success",
        summary: isNew ? "Added to List" : "List Updated",
        detail: `${props.anime.title_english || props.anime.title_romaji} — ${LIST_STATUS_LABELS[entry.status]}`,
        life: 3e3
      });
    }
    function onDeleted() {
      showModal.value = false;
      currentEntry.value = null;
      toast.add({
        severity: "info",
        summary: "Removed from List",
        detail: props.anime.title_english || props.anime.title_romaji,
        life: 3e3
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (!currentEntry.value) {
        _push(ssrRenderComponent(unref(Button), {
          label: "Add to List",
          class: "w-full",
          onClick: ($event) => showModal.value = true
        }, null, _parent));
      } else {
        _push(`<button class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition flex items-center justify-between"><span>${ssrInterpolate(unref(LIST_STATUS_LABELS)[currentEntry.value.status])}</span><svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>`);
      }
      if (showModal.value) {
        _push(ssrRenderComponent(_sfc_main$F, {
          anime: __props.anime,
          entry: currentEntry.value,
          onClose: ($event) => showModal.value = false,
          onSaved,
          onDeleted
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AddToListButton.vue");
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const _sfc_main$D = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "AnimeDetailPage",
  __ssrInlineRender: true,
  props: {
    anime: {},
    list_entry: {},
    seasons: {},
    og: {}
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const isAuthenticated = computed(() => !!page.props.auth.user);
    const studioPagesEnabled = useFeature("studio-pages");
    const voiceActorPagesEnabled = useFeature("voice-actor-pages");
    function displayTitle(anime) {
      return anime.title_english || anime.title_romaji;
    }
    function formatLabel(format2) {
      if (!format2) return "Unknown";
      return format2.replace(/_/g, " ");
    }
    function statusLabel(status) {
      if (!status) return "Unknown";
      const map = {
        FINISHED: "Finished",
        RELEASING: "Airing",
        NOT_YET_RELEASED: "Not Yet Aired",
        CANCELLED: "Cancelled",
        HIATUS: "Hiatus"
      };
      return map[status] || status;
    }
    function sourceLabel(source) {
      if (!source) return "Unknown";
      return source.replace(/_/g, " ").replace(/\b\w/g, (c2) => c2.toUpperCase());
    }
    function seasonLabel(season, year) {
      if (!season || !year) return "Unknown";
      return `${season.charAt(0) + season.slice(1).toLowerCase()} ${year}`;
    }
    function formatDate(dateStr) {
      if (!dateStr) return "?";
      return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    const mainStudios = props.anime.studios?.filter((s2) => s2.is_main) ?? [];
    const otherStudios = props.anime.studios?.filter((s2) => !s2.is_main) ?? [];
    function studioRoute(studio) {
      if (!studio.slug) return null;
      const routeName = studio.is_animation_studio ? "studios.show" : "producers.show";
      return route(routeName, { studio: studio.slug });
    }
    function voiceActorRoute(va) {
      if (!va.slug) return null;
      return route("people.show", { person: va.slug });
    }
    function languageLabel(language) {
      const map = {
        JAPANESE: "JP",
        ENGLISH: "EN"
      };
      return map[language] ?? language.slice(0, 2).toUpperCase();
    }
    function sortedVoiceActors(vas) {
      const order = { JAPANESE: 0, ENGLISH: 1 };
      return [...vas].sort((a2, b2) => (order[a2.language] ?? 99) - (order[b2.language] ?? 99));
    }
    const characters = computed(() => props.anime.characters ?? []);
    const mainCharacters = computed(() => characters.value.filter((c2) => c2.role === "MAIN"));
    const supportingCharacters = computed(() => characters.value.filter((c2) => c2.role !== "MAIN"));
    function embedUrl(url) {
      try {
        const parsed = new URL(url);
        if (parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtu.be")) {
          const videoId = parsed.searchParams.get("v") || parsed.pathname.slice(1);
          return `https://www.youtube.com/embed/${videoId}`;
        }
        if (parsed.hostname.includes("dailymotion.com")) {
          const videoId = parsed.pathname.split("/").pop();
          return `https://www.dailymotion.com/embed/video/${videoId}`;
        }
        return null;
      } catch {
        return null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, {
        title: displayTitle(__props.anime)
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description"${ssrRenderAttr("content", __props.og.description)}${_scopeId}><link rel="canonical"${ssrRenderAttr("href", __props.og.url)}${_scopeId}><meta property="og:title"${ssrRenderAttr("content", __props.og.title)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", __props.og.description)}${_scopeId}>`);
            if (__props.og.image) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", __props.og.image)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:url"${ssrRenderAttr("content", __props.og.url)}${_scopeId}><meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", __props.og.title)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", __props.og.description)}${_scopeId}>`);
            if (__props.og.image) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", __props.og.image)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: __props.og.description
              }, null, 8, ["content"]),
              createVNode("link", {
                rel: "canonical",
                href: __props.og.url
              }, null, 8, ["href"]),
              createVNode("meta", {
                property: "og:title",
                content: __props.og.title
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: __props.og.description
              }, null, 8, ["content"]),
              __props.og.image ? (openBlock(), createBlock("meta", {
                key: 0,
                property: "og:image",
                content: __props.og.image
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:url",
                content: __props.og.url
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: __props.og.title
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: __props.og.description
              }, null, 8, ["content"]),
              __props.og.image ? (openBlock(), createBlock("meta", {
                key: 1,
                name: "twitter:image",
                content: __props.og.image
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div>`);
      if (__props.anime.banner_image) {
        _push(`<div class="-mx-4 -mt-6 mb-6 h-48 overflow-hidden md:h-64"><img${ssrRenderAttr("src", __props.anime.banner_image)}${ssrRenderAttr("alt", displayTitle(__props.anime))} class="h-full w-full object-cover"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col gap-6 md:flex-row"><div class="w-full shrink-0 md:w-56"><div class="${ssrRenderClass([{ "-mt-20 relative z-10": __props.anime.banner_image }, "overflow-hidden rounded-lg bg-gray-800"])}">`);
      if (__props.anime.cover_image_large || __props.anime.cover_image_medium) {
        _push(`<img${ssrRenderAttr("src", __props.anime.cover_image_large || __props.anime.cover_image_medium)}${ssrRenderAttr("alt", displayTitle(__props.anime))} class="w-full" loading="lazy">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (isAuthenticated.value) {
        _push(`<div class="mt-4">`);
        _push(ssrRenderComponent(_sfc_main$E, {
          anime: __props.anime,
          "initial-entry": __props.list_entry
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-4 space-y-3 text-sm"><div class="rounded-lg border border-gray-800 p-3 space-y-2"><div class="flex items-start justify-between gap-3"><span class="text-gray-500 shrink-0">Format</span><span class="text-gray-200 text-right">${ssrInterpolate(formatLabel(__props.anime.format))}</span></div><div class="flex items-start justify-between gap-3"><span class="text-gray-500 shrink-0">Episodes</span><span class="text-gray-200 text-right">${ssrInterpolate(__props.anime.episodes ?? "?")}</span></div>`);
      if (__props.anime.duration) {
        _push(`<div class="flex items-start justify-between gap-3"><span class="text-gray-500 shrink-0">Duration</span><span class="text-gray-200 text-right">${ssrInterpolate(__props.anime.duration)} min</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-start justify-between gap-3"><span class="text-gray-500 shrink-0">Status</span><span class="text-gray-200 text-right">${ssrInterpolate(statusLabel(__props.anime.status))}</span></div><div class="flex items-start justify-between gap-3"><span class="text-gray-500 shrink-0">Season</span><span class="text-gray-200 text-right">${ssrInterpolate(seasonLabel(__props.anime.season, __props.anime.season_year))}</span></div>`);
      if (__props.anime.aired_from) {
        _push(`<div class="flex items-start justify-between gap-3"><span class="text-gray-500 shrink-0">Aired</span><span class="text-gray-200 text-right">${ssrInterpolate(formatDate(__props.anime.aired_from))} – ${ssrInterpolate(formatDate(__props.anime.aired_to))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.anime.source) {
        _push(`<div class="flex items-start justify-between gap-3"><span class="text-gray-500 shrink-0">Source</span><span class="text-gray-200 text-right">${ssrInterpolate(sourceLabel(__props.anime.source))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="rounded-lg border border-gray-800 p-3 space-y-2"><div class="flex items-center justify-between gap-3"><span class="text-gray-500 shrink-0">Score</span>`);
      _push(ssrRenderComponent(_sfc_main$K, {
        score: __props.anime.average_score
      }, null, _parent));
      _push(`</div>`);
      if (__props.anime.mean_score) {
        _push(`<div class="flex items-start justify-between gap-3"><span class="text-gray-500 shrink-0">Mean</span><span class="text-gray-200 text-right">${ssrInterpolate(__props.anime.mean_score.toFixed(1))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-start justify-between gap-3"><span class="text-gray-500 shrink-0">Popularity</span><span class="text-gray-200 text-right">#${ssrInterpolate(__props.anime.popularity?.toLocaleString() ?? "?")}</span></div>`);
      if (__props.anime.favourites) {
        _push(`<div class="flex items-start justify-between gap-3"><span class="text-gray-500 shrink-0">Favourites</span><span class="text-gray-200 text-right">${ssrInterpolate(__props.anime.favourites.toLocaleString())}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(mainStudios).length || unref(otherStudios).length) {
        _push(`<div class="rounded-lg border border-gray-800 p-3 space-y-2"><!--[-->`);
        ssrRenderList(unref(mainStudios), (studio) => {
          _push(`<div class="flex items-start justify-between gap-3"><span class="text-gray-500 shrink-0">Studio</span>`);
          if (unref(studioPagesEnabled) && studioRoute(studio)) {
            _push(ssrRenderComponent(_component_Link, {
              href: studioRoute(studio),
              class: "font-medium text-primary-400 hover:text-primary-300 text-right transition"
            }, {
              default: withCtx((_2, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(studio.name)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(studio.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<span class="font-medium text-gray-200 text-right">${ssrInterpolate(studio.name)}</span>`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--><!--[-->`);
        ssrRenderList(unref(otherStudios), (studio) => {
          _push(`<div class="flex items-start justify-between gap-3"><span class="text-gray-500 shrink-0">Producer</span>`);
          if (unref(studioPagesEnabled) && studioRoute(studio)) {
            _push(ssrRenderComponent(_component_Link, {
              href: studioRoute(studio),
              class: "text-primary-400 hover:text-primary-300 text-right transition"
            }, {
              default: withCtx((_2, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(studio.name)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(studio.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<span class="text-gray-300 text-right">${ssrInterpolate(studio.name)}</span>`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.anime.external_ids?.length) {
        _push(`<div class="rounded-lg border border-gray-800 p-3 space-y-1.5"><h4 class="text-xs font-medium uppercase tracking-wider text-gray-400">External Links</h4><!--[-->`);
        ssrRenderList(__props.anime.external_ids, (link) => {
          _push(`<a${ssrRenderAttr("href", link.url ?? "#")} target="_blank" rel="noopener noreferrer" class="block text-xs text-primary-400 hover:text-primary-300 transition">${ssrInterpolate(link.platform)}</a>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="min-w-0 flex-1 space-y-6"><div><h1 class="text-2xl font-bold text-gray-100 md:text-3xl">${ssrInterpolate(displayTitle(__props.anime))}</h1>`);
      if (__props.anime.title_english && __props.anime.title_romaji !== __props.anime.title_english) {
        _push(`<p class="mt-1 text-gray-400">${ssrInterpolate(__props.anime.title_romaji)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.anime.title_native) {
        _push(`<p class="text-sm text-gray-500">${ssrInterpolate(__props.anime.title_native)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.anime.genres?.length) {
        _push(`<div class="flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(__props.anime.genres, (genre) => {
          _push(ssrRenderComponent(_sfc_main$J, {
            key: genre.id,
            name: genre.name
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$I, { seasons: __props.seasons }, null, _parent));
      if (__props.anime.synopsis) {
        _push(`<div class="prose prose-invert max-w-none"><div>${__props.anime.synopsis ?? ""}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.anime.trailer_url && embedUrl(__props.anime.trailer_url)) {
        _push(`<div><h3 class="mb-3 text-lg font-semibold text-gray-100">Trailer</h3><div class="aspect-video overflow-hidden rounded-lg"><iframe${ssrRenderAttr("src", embedUrl(__props.anime.trailer_url))} class="h-full w-full" allowfullscreen loading="lazy"></iframe></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (characters.value.length) {
        _push(`<div><h3 class="mb-3 text-lg font-semibold text-gray-100">Characters &amp; Voice Actors</h3><div class="grid grid-cols-1 gap-2 sm:grid-cols-2"><!--[-->`);
        ssrRenderList([...mainCharacters.value, ...supportingCharacters.value].slice(0, 20), (char) => {
          _push(`<div class="rounded-lg border border-gray-800 bg-gray-900/40 overflow-hidden"><div class="flex items-stretch justify-between gap-2"><div class="flex min-w-0 flex-1 items-center gap-2 p-2"><div class="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-800">`);
          if (char.image_medium) {
            _push(`<img${ssrRenderAttr("src", char.image_medium)}${ssrRenderAttr("alt", char.name_full)} class="h-full w-full object-cover" loading="lazy">`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="min-w-0"><p class="truncate text-sm font-medium text-gray-200">${ssrInterpolate(char.name_full)}</p>`);
          if (char.role) {
            _push(`<p class="text-xs text-gray-500">${ssrInterpolate(char.role === "MAIN" ? "Main" : char.role === "SUPPORTING" ? "Supporting" : "Background")}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
          if (char.voice_actors?.length) {
            _push(`<div class="flex min-w-0 flex-1 flex-col justify-center gap-1 p-2"><!--[-->`);
            ssrRenderList(sortedVoiceActors(char.voice_actors), (va) => {
              _push(`<div class="flex items-center justify-end gap-2"><span class="shrink-0 rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gray-400">${ssrInterpolate(languageLabel(va.language))}</span><div class="min-w-0 text-right">`);
              ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(voiceActorPagesEnabled) && voiceActorRoute(va) ? "Link" : "span"), mergeProps({ ref_for: true }, unref(voiceActorPagesEnabled) && voiceActorRoute(va) ? { href: voiceActorRoute(va) } : {}, {
                class: ["block truncate text-sm", unref(voiceActorPagesEnabled) && voiceActorRoute(va) ? "text-primary-400 hover:text-primary-300 transition" : "text-gray-300"]
              }), {
                default: withCtx((_2, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(va.name_full)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(va.name_full), 1)
                    ];
                  }
                }),
                _: 2
              }), _parent);
              _push(`</div><div class="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-800">`);
              if (va.image_medium) {
                _push(`<img${ssrRenderAttr("src", va.image_medium)}${ssrRenderAttr("alt", va.name_full)} class="h-full w-full object-cover" loading="lazy">`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$H, {
        relations: __props.anime.relations ?? []
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$G, {
        schedules: __props.anime.airing_schedules ?? []
      }, null, _parent));
      _push(`</div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/AnimeDetailPage.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$D
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$C = /* @__PURE__ */ defineComponent({
  __name: "AnimeCard",
  __ssrInlineRender: true,
  props: {
    anime: {},
    viewMode: {}
  },
  setup(__props) {
    const props = __props;
    const mode = computed(() => props.viewMode ?? "grid");
    function formatLabel(format2) {
      if (!format2) return "";
      return format2.replace(/_/g, " ");
    }
    function episodeText(anime) {
      if (!anime.episodes) return "";
      return `${anime.episodes} ep`;
    }
    function displayTitle(anime) {
      return anime.title_english || anime.title_romaji;
    }
    function animeUrl(anime) {
      if (anime.slug) {
        return route("anime.show", { anime: anime.slug });
      }
      if (anime.anilist_id) {
        return route("anime.show.anilist", { anilistId: anime.anilist_id });
      }
      return "#";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(ssrRenderComponent(_component_Link, mergeProps({
        href: animeUrl(__props.anime),
        class: ["group block", mode.value === "list" ? "flex gap-4" : ""]
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (mode.value === "grid") {
              _push2(`<div class="space-y-2"${_scopeId}><div class="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-800"${_scopeId}>`);
              if (__props.anime.cover_image_large || __props.anime.cover_image_medium) {
                _push2(`<img${ssrRenderAttr("src", (__props.anime.cover_image_large || __props.anime.cover_image_medium) ?? void 0)}${ssrRenderAttr("alt", displayTitle(__props.anime))} class="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy"${_scopeId}>`);
              } else {
                _push2(`<div class="flex h-full items-center justify-center text-gray-600"${_scopeId}><span class="text-4xl"${_scopeId}>?</span></div>`);
              }
              _push2(`<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$K, {
                score: __props.anime.average_score,
                size: "sm"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
              if (__props.anime.next_airing_episode) {
                _push2(`<div class="absolute top-2 right-2"${_scopeId}><span class="rounded bg-primary-600 px-1.5 py-0.5 text-[10px] font-semibold text-white"${_scopeId}> EP ${ssrInterpolate(__props.anime.next_airing_episode.episode)}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div${_scopeId}><h3 class="line-clamp-2 text-sm font-medium text-gray-200 group-hover:text-primary-400 transition"${_scopeId}>${ssrInterpolate(displayTitle(__props.anime))}</h3><div class="mt-1 flex items-center gap-2 text-xs text-gray-500"${_scopeId}>`);
              if (__props.anime.format) {
                _push2(`<span${_scopeId}>${ssrInterpolate(formatLabel(__props.anime.format))}</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.anime.format && __props.anime.episodes) {
                _push2(`<span class="text-gray-700"${_scopeId}>·</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.anime.episodes) {
                _push2(`<span${_scopeId}>${ssrInterpolate(episodeText(__props.anime))}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div></div>`);
            } else {
              _push2(`<!--[--><div class="h-24 w-16 shrink-0 overflow-hidden rounded-md bg-gray-800"${_scopeId}>`);
              if (__props.anime.cover_image_medium) {
                _push2(`<img${ssrRenderAttr("src", __props.anime.cover_image_medium)}${ssrRenderAttr("alt", displayTitle(__props.anime))} class="h-full w-full object-cover" loading="lazy"${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="flex min-w-0 flex-1 flex-col justify-center gap-1"${_scopeId}><h3 class="truncate text-sm font-medium text-gray-200 group-hover:text-primary-400 transition"${_scopeId}>${ssrInterpolate(displayTitle(__props.anime))}</h3><div class="flex items-center gap-2 text-xs text-gray-500"${_scopeId}>`);
              if (__props.anime.format) {
                _push2(`<span${_scopeId}>${ssrInterpolate(formatLabel(__props.anime.format))}</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.anime.episodes) {
                _push2(`<span${_scopeId}>${ssrInterpolate(episodeText(__props.anime))}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(_sfc_main$K, {
                score: __props.anime.average_score,
                size: "sm"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="flex flex-wrap gap-1"${_scopeId}><!--[-->`);
              ssrRenderList(__props.anime.genres.slice(0, 3), (genre) => {
                _push2(ssrRenderComponent(_sfc_main$J, {
                  key: genre.id,
                  name: genre.name
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div><!--]-->`);
            }
          } else {
            return [
              mode.value === "grid" ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-2"
              }, [
                createVNode("div", { class: "relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-800" }, [
                  __props.anime.cover_image_large || __props.anime.cover_image_medium ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: (__props.anime.cover_image_large || __props.anime.cover_image_medium) ?? void 0,
                    alt: displayTitle(__props.anime),
                    class: "h-full w-full object-cover transition-transform group-hover:scale-105",
                    loading: "lazy"
                  }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "flex h-full items-center justify-center text-gray-600"
                  }, [
                    createVNode("span", { class: "text-4xl" }, "?")
                  ])),
                  createVNode("div", { class: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2" }, [
                    createVNode(_sfc_main$K, {
                      score: __props.anime.average_score,
                      size: "sm"
                    }, null, 8, ["score"])
                  ]),
                  __props.anime.next_airing_episode ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "absolute top-2 right-2"
                  }, [
                    createVNode("span", { class: "rounded bg-primary-600 px-1.5 py-0.5 text-[10px] font-semibold text-white" }, " EP " + toDisplayString(__props.anime.next_airing_episode.episode), 1)
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", null, [
                  createVNode("h3", { class: "line-clamp-2 text-sm font-medium text-gray-200 group-hover:text-primary-400 transition" }, toDisplayString(displayTitle(__props.anime)), 1),
                  createVNode("div", { class: "mt-1 flex items-center gap-2 text-xs text-gray-500" }, [
                    __props.anime.format ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(formatLabel(__props.anime.format)), 1)) : createCommentVNode("", true),
                    __props.anime.format && __props.anime.episodes ? (openBlock(), createBlock("span", {
                      key: 1,
                      class: "text-gray-700"
                    }, "·")) : createCommentVNode("", true),
                    __props.anime.episodes ? (openBlock(), createBlock("span", { key: 2 }, toDisplayString(episodeText(__props.anime)), 1)) : createCommentVNode("", true)
                  ])
                ])
              ])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                createVNode("div", { class: "h-24 w-16 shrink-0 overflow-hidden rounded-md bg-gray-800" }, [
                  __props.anime.cover_image_medium ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: __props.anime.cover_image_medium,
                    alt: displayTitle(__props.anime),
                    class: "h-full w-full object-cover",
                    loading: "lazy"
                  }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "flex min-w-0 flex-1 flex-col justify-center gap-1" }, [
                  createVNode("h3", { class: "truncate text-sm font-medium text-gray-200 group-hover:text-primary-400 transition" }, toDisplayString(displayTitle(__props.anime)), 1),
                  createVNode("div", { class: "flex items-center gap-2 text-xs text-gray-500" }, [
                    __props.anime.format ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(formatLabel(__props.anime.format)), 1)) : createCommentVNode("", true),
                    __props.anime.episodes ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(episodeText(__props.anime)), 1)) : createCommentVNode("", true),
                    createVNode(_sfc_main$K, {
                      score: __props.anime.average_score,
                      size: "sm"
                    }, null, 8, ["score"])
                  ]),
                  createVNode("div", { class: "flex flex-wrap gap-1" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.anime.genres.slice(0, 3), (genre) => {
                      return openBlock(), createBlock(_sfc_main$J, {
                        key: genre.id,
                        name: genre.name
                      }, null, 8, ["name"]);
                    }), 128))
                  ])
                ])
              ], 64))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AnimeCard.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const _sfc_main$B = /* @__PURE__ */ defineComponent({
  __name: "FilterSidebar",
  __ssrInlineRender: true,
  props: {
    filters: {},
    genres: {},
    studios: {}
  },
  emits: ["update:filters", "apply", "clear"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formatOptions = [
      { id: "TV", name: "TV" },
      { id: "TV_SHORT", name: "TV Short" },
      { id: "MOVIE", name: "Movie" },
      { id: "OVA", name: "OVA" },
      { id: "ONA", name: "ONA" },
      { id: "SPECIAL", name: "Special" },
      { id: "MUSIC", name: "Music" }
    ];
    const statusOptions = [
      { id: "RELEASING", name: "Airing" },
      { id: "FINISHED", name: "Finished" },
      { id: "NOT_YET_RELEASED", name: "Not Yet Aired" },
      { id: "CANCELLED", name: "Cancelled" },
      { id: "HIATUS", name: "Hiatus" }
    ];
    const seasonOptions = [
      { id: "WINTER", name: "Winter" },
      { id: "SPRING", name: "Spring" },
      { id: "SUMMER", name: "Summer" },
      { id: "FALL", name: "Fall" }
    ];
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const yearOptions = Array.from({ length: currentYear - 1939 }, (_2, i2) => ({
      id: currentYear + 1 - i2,
      name: String(currentYear + 1 - i2)
    }));
    function updateFilter(key, value) {
      emit("update:filters", { ...props.filters, [key]: value || void 0 });
      emit("apply");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div><label class="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400">Format</label>`);
      _push(ssrRenderComponent(unref(Select), {
        "model-value": __props.filters.format,
        options: formatOptions,
        "option-label": "name",
        "option-value": "id",
        placeholder: "Any",
        "show-clear": "",
        class: "w-full",
        "onUpdate:modelValue": ($event) => updateFilter("format", $event)
      }, null, _parent));
      _push(`</div><div><label class="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400">Status</label>`);
      _push(ssrRenderComponent(unref(Select), {
        "model-value": __props.filters.status,
        options: statusOptions,
        "option-label": "name",
        "option-value": "id",
        placeholder: "Any",
        "show-clear": "",
        class: "w-full",
        "onUpdate:modelValue": ($event) => updateFilter("status", $event)
      }, null, _parent));
      _push(`</div><div><label class="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400">Season</label>`);
      _push(ssrRenderComponent(unref(Select), {
        "model-value": __props.filters.season,
        options: seasonOptions,
        "option-label": "name",
        "option-value": "id",
        placeholder: "Any",
        "show-clear": "",
        class: "w-full",
        "onUpdate:modelValue": ($event) => updateFilter("season", $event)
      }, null, _parent));
      _push(`</div><div><label class="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400">Year</label>`);
      _push(ssrRenderComponent(unref(Select), {
        "model-value": __props.filters.season_year,
        options: unref(yearOptions),
        "option-label": "name",
        "option-value": "id",
        placeholder: "Any",
        "show-clear": "",
        class: "w-full",
        "onUpdate:modelValue": ($event) => updateFilter("season_year", $event)
      }, null, _parent));
      _push(`</div><div><label class="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400">Genre</label>`);
      _push(ssrRenderComponent(unref(Select), {
        "model-value": __props.filters.genre,
        options: __props.genres,
        "option-label": "name",
        "option-value": "name",
        placeholder: "Any",
        "show-clear": "",
        filter: "",
        class: "w-full",
        "onUpdate:modelValue": ($event) => updateFilter("genre", $event)
      }, null, _parent));
      _push(`</div><div><label class="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400">Studio</label>`);
      _push(ssrRenderComponent(unref(Select), {
        "model-value": __props.filters.studio,
        options: __props.studios,
        "option-label": "name",
        "option-value": "id",
        placeholder: "Any",
        "show-clear": "",
        filter: "",
        class: "w-full",
        "onUpdate:modelValue": ($event) => updateFilter("studio", $event)
      }, null, _parent));
      _push(`</div><button class="w-full rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-gray-200"> Clear Filters </button></div>`);
    };
  }
});
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/FilterSidebar.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const _sfc_main$A = /* @__PURE__ */ defineComponent({
  __name: "SortBar",
  __ssrInlineRender: true,
  props: {
    sort: {},
    total: {},
    viewMode: {}
  },
  emits: ["update:sort", "update:viewMode"],
  setup(__props, { emit: __emit }) {
    const sortOptions = [
      { id: "-popularity", name: "Popularity" },
      { id: "-average_score", name: "Score" },
      { id: "-trending", name: "Trending" },
      { id: "-favourites", name: "Favourites" },
      { id: "title_romaji", name: "Title (A-Z)" },
      { id: "-title_romaji", name: "Title (Z-A)" },
      { id: "-aired_from", name: "Newest" },
      { id: "aired_from", name: "Oldest" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-wrap items-center justify-between gap-3" }, _attrs))}><p class="text-sm text-gray-400">${ssrInterpolate(__props.total.toLocaleString())} results </p><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(unref(Select), {
        "model-value": __props.sort || "-popularity",
        options: sortOptions,
        "option-label": "name",
        "option-value": "id",
        class: "w-44",
        "onUpdate:modelValue": ($event) => _ctx.$emit("update:sort", $event)
      }, null, _parent));
      _push(`<div class="flex rounded-lg border border-gray-700"><button class="${ssrRenderClass([__props.viewMode === "grid" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300", "px-2.5 py-1.5 text-sm transition"])}" title="Grid view"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"></path></svg></button><button class="${ssrRenderClass([__props.viewMode === "list" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300", "px-2.5 py-1.5 text-sm transition"])}" title="List view"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path></svg></button></div></div></div>`);
    };
  }
});
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SortBar.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
function useBrowseFilters() {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const filters = reactive({
    search: params.get("filter[search]") || void 0,
    format: params.get("filter[format]") || void 0,
    status: params.get("filter[status]") || void 0,
    season: params.get("filter[season]") || void 0,
    season_year: params.get("filter[season_year]") ? Number(params.get("filter[season_year]")) : void 0,
    genre: params.get("filter[genre]") || void 0,
    studio: params.get("filter[studio]") ? Number(params.get("filter[studio]")) : void 0,
    sort: params.get("sort") || void 0
  });
  function applyFilters() {
    const query = {};
    if (filters.search && filters.search.trim()) query["filter[search]"] = filters.search.trim();
    if (filters.format) query["filter[format]"] = filters.format;
    if (filters.status) query["filter[status]"] = filters.status;
    if (filters.season) query["filter[season]"] = filters.season;
    if (filters.season_year) query["filter[season_year]"] = String(filters.season_year);
    if (filters.genre) query["filter[genre]"] = filters.genre;
    if (filters.studio) query["filter[studio]"] = String(filters.studio);
    if (filters.sort) query["sort"] = filters.sort;
    router.get(route("anime.index"), query, {
      preserveState: true,
      preserveScroll: false
    });
  }
  function clearFilters() {
    filters.search = void 0;
    filters.format = void 0;
    filters.status = void 0;
    filters.season = void 0;
    filters.season_year = void 0;
    filters.genre = void 0;
    filters.studio = void 0;
    filters.sort = void 0;
    applyFilters();
  }
  const hasActiveFilters = computed(() => {
    return !!(filters.search || filters.format || filters.status || filters.season || filters.season_year || filters.genre || filters.studio);
  });
  return {
    filters,
    applyFilters,
    clearFilters,
    hasActiveFilters
  };
}
const _sfc_main$z = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "AnimeIndexPage",
  __ssrInlineRender: true,
  props: {
    anime: {},
    genres: {},
    studios: {}
  },
  setup(__props) {
    const { filters, applyFilters, clearFilters } = useBrowseFilters();
    const viewMode = ref(
      typeof window !== "undefined" && localStorage.getItem("browse_view") || "grid"
    );
    function setViewMode(mode) {
      viewMode.value = mode;
      if (typeof window !== "undefined") {
        localStorage.setItem("browse_view", mode);
      }
    }
    function updateSort(sort) {
      filters.sort = sort;
      applyFilters();
    }
    function updateFilters(newFilters) {
      Object.assign(filters, newFilters);
    }
    const showMobileFilters = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Browse & Search Anime" }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description" content="Browse, search and discover anime by title, genre, format, season, and more on AniTrack."${_scopeId}><link rel="canonical"${ssrRenderAttr("href", _ctx.route("anime.index"))}${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: "Browse, search and discover anime by title, genre, format, season, and more on AniTrack."
              }),
              createVNode("link", {
                rel: "canonical",
                href: _ctx.route("anime.index")
              }, null, 8, ["href"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mb-6"><form><div class="relative"><input${ssrRenderAttr("value", unref(filters).search)} type="search" placeholder="Search by title..." class="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"></div></form></div><div class="flex gap-6"><aside class="hidden w-56 shrink-0 lg:block"><div class="sticky top-20"><h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Filters</h2>`);
      _push(ssrRenderComponent(_sfc_main$B, {
        filters: unref(filters),
        genres: __props.genres,
        studios: __props.studios,
        "onUpdate:filters": updateFilters,
        onApply: unref(applyFilters),
        onClear: unref(clearFilters)
      }, null, _parent));
      _push(`</div></aside><div class="min-w-0 flex-1"><button class="mb-4 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 lg:hidden"> Filters </button>`);
      if (showMobileFilters.value) {
        _push(`<div class="mb-4 rounded-lg border border-gray-800 p-4 lg:hidden">`);
        _push(ssrRenderComponent(_sfc_main$B, {
          filters: unref(filters),
          genres: __props.genres,
          studios: __props.studios,
          "onUpdate:filters": updateFilters,
          onApply: unref(applyFilters),
          onClear: unref(clearFilters)
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$A, {
        sort: unref(filters).sort,
        total: __props.anime.meta.total,
        "view-mode": viewMode.value,
        "onUpdate:sort": updateSort,
        "onUpdate:viewMode": setViewMode
      }, null, _parent));
      _push(`<div class="mt-4">`);
      if (__props.anime.data.length) {
        _push(`<div class="${ssrRenderClass(viewMode.value === "grid" ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" : "space-y-3")}"><!--[-->`);
        ssrRenderList(__props.anime.data, (item) => {
          _push(ssrRenderComponent(_sfc_main$C, {
            key: item.id ?? item.anilist_id,
            anime: item,
            "view-mode": viewMode.value
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="py-16 text-center"><p class="text-gray-500">No anime found matching your filters.</p><button class="mt-2 text-sm text-primary-400 hover:text-primary-300"> Clear all filters </button></div>`);
      }
      _push(`</div><div class="mt-8">`);
      _push(ssrRenderComponent(_sfc_main$M, {
        "current-page": __props.anime.meta.current_page,
        "last-page": __props.anime.meta.last_page,
        total: __props.anime.meta.total
      }, null, _parent));
      _push(`</div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/AnimeIndexPage.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$z
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$y = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "DevelopersPage",
  __ssrInlineRender: true,
  props: {
    apiBaseUrl: {}
  },
  setup(__props) {
    const props = __props;
    const sections = [
      {
        id: "auth",
        title: "Authentication",
        endpoints: [
          {
            id: "issue-token",
            method: "POST",
            path: "/auth/token",
            title: "Issue a token",
            auth: "credentials",
            description: "Exchange an AniTrack email and password for a bearer token. Returns the plain-text token once — store it securely. Subject to the strict auth rate limit (5 requests / minute / IP + email).",
            params: [
              { name: "email", in: "body", type: "string", required: true },
              { name: "password", in: "body", type: "string", required: true },
              { name: "device_name", in: "body", type: "string", required: true, notes: "Shown on your settings page so you can identify the client. Max 120 chars." }
            ],
            example: `curl -X POST {BASE}/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@example.com","password":"…","device_name":"My Integration"}'`
          },
          {
            id: "list-tokens",
            method: "GET",
            path: "/auth/tokens",
            title: "List tokens",
            auth: "bearer",
            description: "List your active API tokens (same data shown in the settings page).",
            example: `curl {BASE}/auth/tokens \\
  -H "Authorization: Bearer YOUR_TOKEN"`
          },
          {
            id: "revoke-current",
            method: "DELETE",
            path: "/auth/token",
            title: "Revoke the current token",
            auth: "bearer",
            description: 'Revoke the token used on this request. Useful for client "sign out" flows.',
            example: `curl -X DELETE {BASE}/auth/token \\
  -H "Authorization: Bearer YOUR_TOKEN"`
          },
          {
            id: "revoke-specific",
            method: "DELETE",
            path: "/auth/tokens/{id}",
            title: "Revoke a specific token",
            auth: "bearer",
            description: "Revoke another token belonging to your account.",
            params: [
              { name: "id", in: "path", type: "integer", required: true }
            ],
            example: `curl -X DELETE {BASE}/auth/tokens/42 \\
  -H "Authorization: Bearer YOUR_TOKEN"`
          }
        ]
      },
      {
        id: "user",
        title: "Current User",
        endpoints: [
          {
            id: "get-me",
            method: "GET",
            path: "/user",
            title: "Fetch the authenticated user",
            auth: "bearer",
            description: "Returns the profile of the user who owns the bearer token.",
            example: `curl {BASE}/user \\
  -H "Authorization: Bearer YOUR_TOKEN"`
          }
        ]
      },
      {
        id: "anime",
        title: "Anime",
        endpoints: [
          {
            id: "search",
            method: "GET",
            path: "/anime/search",
            title: "Search the catalogue",
            auth: "bearer",
            description: "Full-text search across English, Romaji and native titles. Adult titles are excluded.",
            params: [
              { name: "q", in: "query", type: "string", required: true, notes: "2–200 characters" },
              { name: "limit", in: "query", type: "integer", notes: "1–50, default 20" }
            ],
            example: `curl "{BASE}/anime/search?q=naruto&limit=5" \\
  -H "Authorization: Bearer YOUR_TOKEN"`
          },
          {
            id: "anime-by-anilist",
            method: "GET",
            path: "/anime/anilist/{anilistId}",
            title: "Get anime by AniList ID",
            auth: "bearer",
            description: "Primary lookup path when you only have an AniList ID (for example, from an anilist.co page). Returns 404 if AniTrack has not yet synced that anime.",
            params: [
              { name: "anilistId", in: "path", type: "integer", required: true }
            ],
            example: `curl {BASE}/anime/anilist/101922 \\
  -H "Authorization: Bearer YOUR_TOKEN"`
          },
          {
            id: "anime-by-slug",
            method: "GET",
            path: "/anime/{slug}",
            title: "Get anime by slug",
            auth: "bearer",
            description: "Full anime detail with genres, studios and external IDs.",
            params: [
              { name: "slug", in: "path", type: "string", required: true }
            ],
            example: `curl {BASE}/anime/demon-slayer-kimetsu-no-yaiba \\
  -H "Authorization: Bearer YOUR_TOKEN"`
          }
        ]
      },
      {
        id: "list",
        title: "User List",
        endpoints: [
          {
            id: "list-index",
            method: "GET",
            path: "/list",
            title: "Get your list",
            auth: "bearer",
            description: "Returns all list entries belonging to the token owner, most-recently-updated first.",
            params: [
              {
                name: "status",
                in: "query",
                type: "string",
                notes: "One of watching, completed, on_hold, dropped, plan_to_watch"
              }
            ],
            example: `curl "{BASE}/list?status=watching" \\
  -H "Authorization: Bearer YOUR_TOKEN"`
          },
          {
            id: "list-show-anime",
            method: "GET",
            path: "/list/anime/{animeId}",
            title: "Check if an anime is on your list",
            auth: "bearer",
            description: "Returns the list entry for the given anime, or 404 if the user has not added it.",
            params: [
              { name: "animeId", in: "path", type: "integer", required: true }
            ],
            example: `curl {BASE}/list/anime/1234 \\
  -H "Authorization: Bearer YOUR_TOKEN"`
          },
          {
            id: "list-store",
            method: "POST",
            path: "/list",
            title: "Add an anime to your list",
            auth: "bearer",
            description: "Scores are stored on a 0–100 scale. Progress is auto-completed when it reaches the anime's episode count.",
            params: [
              { name: "anime_id", in: "body", type: "integer", required: true },
              { name: "status", in: "body", type: "string", required: true, notes: "watching | completed | on_hold | dropped | plan_to_watch" },
              { name: "score", in: "body", type: "integer", notes: "0–100" },
              { name: "progress", in: "body", type: "integer" },
              { name: "started_at", in: "body", type: "date" },
              { name: "completed_at", in: "body", type: "date" },
              { name: "notes", in: "body", type: "string", notes: "Max 2000 chars" },
              { name: "is_private", in: "body", type: "boolean" }
            ],
            example: `curl -X POST {BASE}/list \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"anime_id":1234,"status":"watching","progress":3}'`
          },
          {
            id: "list-update",
            method: "PATCH",
            path: "/list/{entryId}",
            title: "Update a list entry",
            auth: "bearer",
            description: "Partial update — send only the fields you want to change.",
            params: [
              { name: "entryId", in: "path", type: "integer", required: true },
              { name: "status", in: "body", type: "string" },
              { name: "score", in: "body", type: "integer", notes: "0–100" },
              { name: "progress", in: "body", type: "integer" },
              { name: "is_rewatching", in: "body", type: "boolean" },
              { name: "rewatch_count", in: "body", type: "integer" },
              { name: "tags", in: "body", type: "string[]" }
            ],
            example: `curl -X PATCH {BASE}/list/987 \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"progress":12,"score":85}'`
          },
          {
            id: "list-destroy",
            method: "DELETE",
            path: "/list/{entryId}",
            title: "Remove a list entry",
            auth: "bearer",
            description: "Soft-deletes the entry.",
            params: [
              { name: "entryId", in: "path", type: "integer", required: true }
            ],
            example: `curl -X DELETE {BASE}/list/987 \\
  -H "Authorization: Bearer YOUR_TOKEN"`
          }
        ]
      }
    ];
    const tocSections = computed(() => [
      { id: "overview", title: "Overview" },
      { id: "authentication", title: "Getting a Token" },
      { id: "making-requests", title: "Making Requests" },
      { id: "rate-limits", title: "Rate Limits" },
      { id: "errors", title: "Errors" },
      { id: "versioning", title: "Versioning" },
      ...sections.map((s2) => ({ id: s2.id, title: s2.title }))
    ]);
    function renderExample(ex) {
      return ex.replace(/\{BASE\}/g, props.apiBaseUrl);
    }
    const copiedId = ref(null);
    async function copy(text, id) {
      try {
        await navigator.clipboard.writeText(text);
        copiedId.value = id;
        setTimeout(() => {
          if (copiedId.value === id) copiedId.value = null;
        }, 1500);
      } catch {
      }
    }
    const methodBadge = {
      GET: "bg-emerald-900/50 text-emerald-300 border-emerald-700",
      POST: "bg-sky-900/50 text-sky-300 border-sky-700",
      PATCH: "bg-amber-900/50 text-amber-300 border-amber-700",
      DELETE: "bg-rose-900/50 text-rose-300 border-rose-700"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Developers" }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description" content="AniTrack public API documentation for third-party integrations."${_scopeId}><link rel="canonical"${ssrRenderAttr("href", _ctx.route("developers"))}${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: "AniTrack public API documentation for third-party integrations."
              }),
              createVNode("link", {
                rel: "canonical",
                href: _ctx.route("developers")
              }, null, 8, ["href"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid grid-cols-1 gap-8 lg:grid-cols-[16rem_1fr]"><aside class="hidden lg:block"><nav class="sticky top-6 space-y-1 text-sm"><p class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500"> On this page </p><!--[-->`);
      ssrRenderList(tocSections.value, (item) => {
        _push(`<a${ssrRenderAttr("href", `#${item.id}`)} class="block rounded px-2 py-1 text-gray-400 transition hover:bg-gray-900 hover:text-gray-100">${ssrInterpolate(item.title)}</a>`);
      });
      _push(`<!--]--></nav></aside><div class="min-w-0 space-y-12"><header><p class="text-sm font-medium text-emerald-400">AniTrack API</p><h1 class="mt-1 text-3xl font-bold">Developers</h1><p class="mt-3 max-w-2xl text-gray-400"> The AniTrack public API lets third-party integrations read and manage your list on your behalf. All endpoints are versioned and served from <code class="rounded bg-gray-900 px-1.5 py-0.5 text-emerald-300">${ssrInterpolate(__props.apiBaseUrl)}</code>. </p></header><section id="overview" class="space-y-3 scroll-mt-6"><h2 class="text-xl font-semibold">Overview</h2><p class="text-gray-400 leading-relaxed"> The API uses JSON request/response bodies, bearer-token authentication, and conventional HTTP status codes. Every authenticated endpoint acts as the token&#39;s owner — there are no &quot;admin&quot; or &quot;impersonation&quot; flows. </p></section><section id="authentication" class="space-y-3 scroll-mt-6"><h2 class="text-xl font-semibold">Getting a Token</h2><p class="text-gray-400 leading-relaxed"> You can mint a token in two ways: </p><ol class="ml-6 list-decimal space-y-2 text-gray-400"><li> From the `);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("settings"),
        class: "text-emerald-400 hover:underline"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Settings page`);
          } else {
            return [
              createTextVNode("Settings page")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` → <strong>API Tokens</strong> — recommended for personal integrations. The plain-text token is shown once; copy it immediately. </li><li> By calling <code class="rounded bg-gray-900 px-1.5 py-0.5 text-emerald-300">POST /auth/token</code> with a user&#39;s email + password — suitable for clients that need a sign-in flow. </li></ol><div class="rounded-lg border border-amber-800/50 bg-amber-950/30 p-3 text-sm text-amber-200"> Treat tokens like passwords. Anyone with a token can read and modify that user&#39;s list. Revoke unused tokens from the settings page. </div></section><section id="making-requests" class="space-y-3 scroll-mt-6"><h2 class="text-xl font-semibold">Making Requests</h2><p class="text-gray-400 leading-relaxed"> Pass the token on every request in the <code class="rounded bg-gray-900 px-1.5 py-0.5 text-emerald-300">Authorization</code> header: </p><pre class="overflow-x-auto rounded-lg border border-gray-800 bg-gray-950 p-4 text-sm text-gray-300"><code>Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
Accept: application/json</code></pre><p class="text-gray-400 leading-relaxed"> All dates are ISO-8601 (UTC). Scores are stored on a 0–100 scale; the UI divides by ten for display. </p></section><section id="rate-limits" class="space-y-3 scroll-mt-6"><h2 class="text-xl font-semibold">Rate Limits</h2><p class="text-gray-400 leading-relaxed"> Authenticated endpoints are capped at <strong>60 requests / minute</strong> per token. The token-issuance endpoint is capped at <strong>5 requests / minute</strong> per email and per IP to deter credential stuffing. Exceeding these limits returns <code class="rounded bg-gray-900 px-1.5 py-0.5">429 Too Many Requests</code>. </p></section><section id="errors" class="space-y-3 scroll-mt-6"><h2 class="text-xl font-semibold">Errors</h2><p class="text-gray-400 leading-relaxed"> Errors are returned as JSON with a <code class="rounded bg-gray-900 px-1.5 py-0.5 text-emerald-300">message</code> field and, for validation failures, an <code class="rounded bg-gray-900 px-1.5 py-0.5 text-emerald-300">errors</code> object keyed by field name. </p><pre class="overflow-x-auto rounded-lg border border-gray-800 bg-gray-950 p-4 text-sm text-gray-300"><code>{
  &quot;message&quot;: &quot;The given data was invalid.&quot;,
  &quot;errors&quot;: {
    &quot;status&quot;: [&quot;The status field is required.&quot;]
  }
}</code></pre><p class="text-sm text-gray-500"> Common codes: <code>401</code> missing / invalid token, <code>403</code> feature not enabled for this account, <code>404</code> resource not found, <code>422</code> validation failed, <code>429</code> rate-limited. </p></section><section id="versioning" class="space-y-3 scroll-mt-6"><h2 class="text-xl font-semibold">Versioning</h2><p class="text-gray-400 leading-relaxed"> Endpoints live under <code class="rounded bg-gray-900 px-1.5 py-0.5 text-emerald-300">/api/v1</code>. Breaking changes will ship under a new major version; within <code>v1</code> we will only add fields, never remove or rename them. </p></section><!--[-->`);
      ssrRenderList(sections, (group) => {
        _push(`<section${ssrRenderAttr("id", group.id)} class="space-y-4 scroll-mt-6"><h2 class="text-xl font-semibold">${ssrInterpolate(group.title)}</h2><!--[-->`);
        ssrRenderList(group.endpoints, (endpoint) => {
          _push(`<article${ssrRenderAttr("id", endpoint.id)} class="space-y-3 rounded-xl border border-gray-800 bg-gray-900/40 p-5 scroll-mt-6"><header class="space-y-2"><h3 class="text-base font-semibold text-gray-100">${ssrInterpolate(endpoint.title)}</h3><div class="flex flex-wrap items-center gap-2"><span class="${ssrRenderClass([methodBadge[endpoint.method], "inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-semibold"])}">${ssrInterpolate(endpoint.method)}</span><code class="font-mono text-sm text-gray-300">${ssrInterpolate(endpoint.path)}</code>`);
          if (endpoint.auth === "bearer") {
            _push(`<span class="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-400"> Requires bearer token </span>`);
          } else if (endpoint.auth === "credentials") {
            _push(`<span class="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-400"> Requires email + password </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></header><p class="text-sm text-gray-400 leading-relaxed">${ssrInterpolate(endpoint.description)}</p>`);
          if (endpoint.params && endpoint.params.length > 0) {
            _push(`<div><p class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500"> Parameters </p><table class="w-full text-left text-sm"><thead class="text-xs uppercase text-gray-500"><tr><th class="pb-2 pr-3 font-medium">Name</th><th class="pb-2 pr-3 font-medium">In</th><th class="pb-2 pr-3 font-medium">Type</th><th class="pb-2 font-medium">Notes</th></tr></thead><tbody class="divide-y divide-gray-800"><!--[-->`);
            ssrRenderList(endpoint.params, (p2) => {
              _push(`<tr><td class="py-2 pr-3"><code class="font-mono text-emerald-300">${ssrInterpolate(p2.name)}</code>`);
              if (p2.required) {
                _push(`<span class="ml-1 text-rose-400">*</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</td><td class="py-2 pr-3 text-gray-500">${ssrInterpolate(p2.in)}</td><td class="py-2 pr-3 text-gray-400">${ssrInterpolate(p2.type)}</td><td class="py-2 text-gray-500">${ssrInterpolate(p2.notes ?? "")}</td></tr>`);
            });
            _push(`<!--]--></tbody></table></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="relative">`);
          _push(ssrRenderComponent(unref(Button), {
            type: "button",
            size: "small",
            severity: "secondary",
            text: "",
            class: "!absolute !right-2 !top-2 !text-xs",
            label: copiedId.value === endpoint.id ? "Copied" : "Copy",
            onClick: ($event) => copy(renderExample(endpoint.example), endpoint.id)
          }, null, _parent));
          _push(`<pre class="overflow-x-auto rounded-lg border border-gray-800 bg-gray-950 p-4 pr-16 text-sm text-gray-300"><code>${ssrInterpolate(renderExample(endpoint.example))}</code></pre></div></article>`);
        });
        _push(`<!--]--></section>`);
      });
      _push(`<!--]--></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/DevelopersPage.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$y
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$x = /* @__PURE__ */ defineComponent({
  ...{ layout: false },
  __name: "ErrorPage",
  __ssrInlineRender: true,
  props: {
    status: {}
  },
  setup(__props) {
    const titles = {
      403: "Forbidden",
      404: "Not Found",
      419: "Session Expired",
      500: "Server Error",
      503: "Service Unavailable"
    };
    const descriptions = {
      403: "You don't have permission to access this page.",
      404: "The page you're looking for doesn't exist.",
      419: "Your session has expired. Please refresh the page and try again.",
      500: "Something went wrong on our end. Please try again later.",
      503: "We're currently undergoing maintenance. Please check back soon."
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, {
        title: `${__props.status} - ${titles[__props.status] ?? "Error"}`
      }, null, _parent));
      _push(`<div class="flex min-h-screen items-center justify-center bg-gray-950 text-center dark"><div><h1 class="text-6xl font-bold text-gray-700">${ssrInterpolate(__props.status)}</h1><p class="text-xl font-medium text-gray-400 mt-2">${ssrInterpolate(titles[__props.status] ?? "Error")}</p><p class="text-gray-500 mt-4">${ssrInterpolate(descriptions[__props.status] ?? "An unexpected error occurred.")}</p><a href="/" class="text-primary-400 hover:text-primary-300 mt-6 inline-block transition"> Go Home </a></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/ErrorPage.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$x
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$w = /* @__PURE__ */ defineComponent({
  __name: "AnimeHeroSection",
  __ssrInlineRender: true,
  props: {
    anime: {},
    title: {},
    seeAllRoute: {}
  },
  setup(__props) {
    function displayTitle(anime) {
      return anime.title_english || anime.title_romaji;
    }
    function animeUrl(anime) {
      if (anime.slug) {
        return route("anime.show", { anime: anime.slug });
      }
      if (anime.anilist_id) {
        return route("anime.show.anilist", { anilistId: anime.anilist_id });
      }
      return "#";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      if (__props.anime.length) {
        _push(`<section${ssrRenderAttrs(_attrs)}><div class="mb-4 flex items-center justify-between"><h2 class="text-xl font-bold text-gray-100">${ssrInterpolate(__props.title)}</h2>`);
        if (__props.seeAllRoute) {
          _push(ssrRenderComponent(_component_Link, {
            href: __props.seeAllRoute,
            class: "text-sm text-primary-400 transition hover:text-primary-300"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` See All → `);
              } else {
                return [
                  createTextVNode(" See All → ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"><!--[-->`);
        ssrRenderList(__props.anime, (item) => {
          _push(ssrRenderComponent(_component_Link, {
            key: item.id ?? item.anilist_id,
            href: animeUrl(item),
            class: "group"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-800"${_scopeId}>`);
                if (item.cover_image_large || item.cover_image_medium) {
                  _push2(`<img${ssrRenderAttr("src", (item.cover_image_large || item.cover_image_medium) ?? void 0)}${ssrRenderAttr("alt", displayTitle(item))} class="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$K, {
                  score: item.average_score,
                  size: "sm"
                }, null, _parent2, _scopeId));
                _push2(`</div></div><h3 class="mt-1.5 line-clamp-2 text-sm font-medium text-gray-200 group-hover:text-primary-400 transition"${_scopeId}>${ssrInterpolate(displayTitle(item))}</h3>`);
              } else {
                return [
                  createVNode("div", { class: "relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-800" }, [
                    item.cover_image_large || item.cover_image_medium ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: (item.cover_image_large || item.cover_image_medium) ?? void 0,
                      alt: displayTitle(item),
                      class: "h-full w-full object-cover transition-transform group-hover:scale-105",
                      loading: "lazy"
                    }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                    createVNode("div", { class: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2" }, [
                      createVNode(_sfc_main$K, {
                        score: item.average_score,
                        size: "sm"
                      }, null, 8, ["score"])
                    ])
                  ]),
                  createVNode("h3", { class: "mt-1.5 line-clamp-2 text-sm font-medium text-gray-200 group-hover:text-primary-400 transition" }, toDisplayString(displayTitle(item)), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AnimeHeroSection.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
function useDebounce(source, delay = 300) {
  const debounced = ref(source.value);
  let timeout;
  watch(source, (val) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debounced.value = val;
    }, delay);
  });
  onScopeDispose(() => clearTimeout(timeout));
  return debounced;
}
function useAnimeSearch() {
  const query = ref("");
  const debouncedQuery = useDebounce(query, 300);
  const enabled = computed(() => debouncedQuery.value.length >= 2);
  const { data, isFetching, isError } = useQuery({
    queryKey: ["anime-search", debouncedQuery],
    queryFn: async ({ signal }) => {
      const { data: data2 } = await axios.get("/api/search", {
        params: { q: debouncedQuery.value },
        signal
      });
      return data2;
    },
    enabled,
    staleTime: 5 * 60 * 1e3
  });
  const results = computed(() => data.value?.data ?? []);
  const total = computed(() => data.value?.total ?? 0);
  return {
    query,
    debouncedQuery,
    results,
    total,
    isLoading: isFetching,
    isError
  };
}
const _sfc_main$v = /* @__PURE__ */ defineComponent({
  __name: "SearchBar",
  __ssrInlineRender: true,
  setup(__props) {
    const { query, results, total, isLoading } = useAnimeSearch();
    const isOpen = ref(false);
    function displayTitle(anime) {
      return anime.title_english || anime.title_romaji;
    }
    function animeUrl(anime) {
      if (anime.slug) {
        return route("anime.show", { anime: anime.slug });
      }
      if (anime.anilist_id) {
        return route("anime.show.anilist", { anilistId: anime.anilist_id });
      }
      return "#";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))}><input${ssrRenderAttr("value", unref(query))} type="text" placeholder="Search anime..." class="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500">`);
      if (isOpen.value && unref(query).length >= 2) {
        _push(`<div class="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border border-gray-700 bg-gray-900 shadow-xl">`);
        if (unref(isLoading)) {
          _push(`<div class="p-4 text-center text-sm text-gray-500"> Searching... </div>`);
        } else if (unref(results).length === 0) {
          _push(`<div class="p-4 text-center text-sm text-gray-500"> No results found </div>`);
        } else {
          _push(`<!--[--><!--[-->`);
          ssrRenderList(unref(results), (anime) => {
            _push(ssrRenderComponent(_component_Link, {
              key: anime.id ?? anime.anilist_id,
              href: animeUrl(anime),
              class: "flex items-center gap-3 px-4 py-2.5 transition hover:bg-gray-800"
            }, {
              default: withCtx((_2, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  if (anime.cover_image_medium) {
                    _push2(`<img${ssrRenderAttr("src", anime.cover_image_medium)}${ssrRenderAttr("alt", displayTitle(anime))} class="h-12 w-8 rounded object-cover"${_scopeId}>`);
                  } else {
                    _push2(`<div class="h-12 w-8 rounded bg-gray-800"${_scopeId}></div>`);
                  }
                  _push2(`<div class="min-w-0 flex-1"${_scopeId}><p class="truncate text-sm text-gray-200"${_scopeId}>${ssrInterpolate(displayTitle(anime))}</p><p class="text-xs text-gray-500"${_scopeId}>`);
                  if (anime.format) {
                    _push2(`<span${_scopeId}>${ssrInterpolate(anime.format.replace(/_/g, " "))}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (anime.season_year) {
                    _push2(`<span${_scopeId}> · ${ssrInterpolate(anime.season_year)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</p></div>`);
                  if (anime.average_score) {
                    _push2(`<span class="text-xs text-gray-400"${_scopeId}>${ssrInterpolate(anime.average_score.toFixed(1))}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                } else {
                  return [
                    anime.cover_image_medium ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: anime.cover_image_medium,
                      alt: displayTitle(anime),
                      class: "h-12 w-8 rounded object-cover"
                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "h-12 w-8 rounded bg-gray-800"
                    })),
                    createVNode("div", { class: "min-w-0 flex-1" }, [
                      createVNode("p", { class: "truncate text-sm text-gray-200" }, toDisplayString(displayTitle(anime)), 1),
                      createVNode("p", { class: "text-xs text-gray-500" }, [
                        anime.format ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(anime.format.replace(/_/g, " ")), 1)) : createCommentVNode("", true),
                        anime.season_year ? (openBlock(), createBlock("span", { key: 1 }, " · " + toDisplayString(anime.season_year), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    anime.average_score ? (openBlock(), createBlock("span", {
                      key: 2,
                      class: "text-xs text-gray-400"
                    }, toDisplayString(anime.average_score.toFixed(1)), 1)) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]-->`);
          if (unref(total) > 5) {
            _push(ssrRenderComponent(_component_Link, {
              href: _ctx.route("anime.index") + "?filter%5Bsearch%5D=" + encodeURIComponent(unref(query)),
              class: "block border-t border-gray-800 px-4 py-2.5 text-center text-sm text-primary-400 transition hover:bg-gray-800"
            }, {
              default: withCtx((_2, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` View all ${ssrInterpolate(unref(total))} results `);
                } else {
                  return [
                    createTextVNode(" View all " + toDisplayString(unref(total)) + " results ", 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SearchBar.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const _sfc_main$u = /* @__PURE__ */ defineComponent({
  __name: "DashboardStatsBar",
  __ssrInlineRender: true,
  props: {
    totalAnime: {},
    episodesWatched: {},
    avgScore: {},
    watchingCount: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-2 gap-3 sm:grid-cols-4" }, _attrs))}><div class="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-center"><p class="text-2xl font-bold text-gray-100">${ssrInterpolate(__props.totalAnime)}</p><p class="mt-1 text-xs text-gray-500">Total Anime</p></div><div class="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-center"><p class="text-2xl font-bold text-gray-100">${ssrInterpolate(__props.episodesWatched)}</p><p class="mt-1 text-xs text-gray-500">Episodes Watched</p></div><div class="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-center"><p class="text-2xl font-bold text-gray-100">${ssrInterpolate(__props.avgScore !== null ? __props.avgScore.toFixed(1) : "-")}</p><p class="mt-1 text-xs text-gray-500">Avg Score</p></div><div class="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-center"><p class="text-2xl font-bold text-primary-400">${ssrInterpolate(__props.watchingCount)}</p><p class="mt-1 text-xs text-gray-500">Watching</p></div></div>`);
    };
  }
});
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/DashboardStatsBar.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const _sfc_main$t = /* @__PURE__ */ defineComponent({
  __name: "ContinueWatchingRow",
  __ssrInlineRender: true,
  props: {
    entries: {}
  },
  setup(__props) {
    function displayTitle(entry) {
      return entry.anime?.title_english || entry.anime?.title_romaji || "Unknown";
    }
    function progressPercent(entry) {
      const total = entry.anime?.episodes;
      if (!total || total === 0) return 0;
      return Math.min(100, Math.round(entry.progress / total * 100));
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      if (__props.entries.length) {
        _push(`<section${ssrRenderAttrs(_attrs)}><div class="mb-3 flex items-center justify-between"><h2 class="text-xl font-bold text-gray-100">Continue Watching</h2>`);
        _push(ssrRenderComponent(_component_Link, {
          href: _ctx.route("list"),
          class: "text-sm text-primary-400 hover:text-primary-300 transition"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` My List → `);
            } else {
              return [
                createTextVNode(" My List → ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="flex gap-3 overflow-x-auto pb-2"><!--[-->`);
        ssrRenderList(__props.entries, (entry) => {
          _push(ssrRenderComponent(_component_Link, {
            key: entry.id,
            href: entry.anime?.slug ? _ctx.route("anime.show", { anime: entry.anime.slug }) : "#",
            class: "group w-32 shrink-0"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-800"${_scopeId}>`);
                if (entry.anime?.cover_image_large || entry.anime?.cover_image_medium) {
                  _push2(`<img${ssrRenderAttr("src", (entry.anime.cover_image_large || entry.anime.cover_image_medium) ?? void 0)}${ssrRenderAttr("alt", displayTitle(entry))} class="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="absolute bottom-0 left-0 right-0"${_scopeId}><div class="h-1 bg-gray-700"${_scopeId}><div class="h-1 bg-primary-500 transition-all" style="${ssrRenderStyle({ width: `${progressPercent(entry)}%` })}"${_scopeId}></div></div></div><div class="absolute top-1.5 right-1.5"${_scopeId}><span class="rounded bg-gray-900/80 px-1 py-0.5 text-[9px] font-medium text-gray-300"${_scopeId}>${ssrInterpolate(entry.progress)}/${ssrInterpolate(entry.anime?.episodes ?? "?")}</span></div></div><p class="mt-1.5 line-clamp-2 text-xs font-medium text-gray-300 group-hover:text-primary-400 transition"${_scopeId}>${ssrInterpolate(displayTitle(entry))}</p>`);
              } else {
                return [
                  createVNode("div", { class: "relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-800" }, [
                    entry.anime?.cover_image_large || entry.anime?.cover_image_medium ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: (entry.anime.cover_image_large || entry.anime.cover_image_medium) ?? void 0,
                      alt: displayTitle(entry),
                      class: "h-full w-full object-cover transition-transform group-hover:scale-105",
                      loading: "lazy"
                    }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                    createVNode("div", { class: "absolute bottom-0 left-0 right-0" }, [
                      createVNode("div", { class: "h-1 bg-gray-700" }, [
                        createVNode("div", {
                          class: "h-1 bg-primary-500 transition-all",
                          style: { width: `${progressPercent(entry)}%` }
                        }, null, 4)
                      ])
                    ]),
                    createVNode("div", { class: "absolute top-1.5 right-1.5" }, [
                      createVNode("span", { class: "rounded bg-gray-900/80 px-1 py-0.5 text-[9px] font-medium text-gray-300" }, toDisplayString(entry.progress) + "/" + toDisplayString(entry.anime?.episodes ?? "?"), 1)
                    ])
                  ]),
                  createVNode("p", { class: "mt-1.5 line-clamp-2 text-xs font-medium text-gray-300 group-hover:text-primary-400 transition" }, toDisplayString(displayTitle(entry)), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ContinueWatchingRow.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "AiringTodaySection",
  __ssrInlineRender: true,
  props: {
    slots: {}
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const timezone = computed(() => page.props.auth?.user?.timezone);
    const { formatCountdown, formatLocalTime } = useCountdown();
    const validSlots = computed(() => props.slots.filter((s2) => s2.anime !== null));
    function displayTitle(slot) {
      return slot.anime.title_english || slot.anime.title_romaji || "Unknown";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      if (validSlots.value.length) {
        _push(`<section${ssrRenderAttrs(_attrs)}><div class="mb-3 flex items-center justify-between"><h2 class="text-xl font-bold text-gray-100">Airing Today from Your List</h2>`);
        _push(ssrRenderComponent(_component_Link, {
          href: _ctx.route("schedule"),
          class: "text-sm text-primary-400 hover:text-primary-300 transition"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Full Schedule → `);
            } else {
              return [
                createTextVNode(" Full Schedule → ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(validSlots.value, (slot) => {
          _push(ssrRenderComponent(_component_Link, {
            key: slot.id,
            href: slot.anime.slug ? _ctx.route("anime.show", { anime: slot.anime.slug }) : "#",
            class: "group flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3 transition hover:border-gray-700"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="h-16 w-11 shrink-0 overflow-hidden rounded-md bg-gray-800"${_scopeId}>`);
                if (slot.anime.cover_image_medium) {
                  _push2(`<img${ssrRenderAttr("src", slot.anime.cover_image_medium)}${ssrRenderAttr("alt", displayTitle(slot))} class="h-full w-full object-cover" loading="lazy"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><p class="line-clamp-1 text-sm font-medium text-gray-200 group-hover:text-primary-400 transition"${_scopeId}>${ssrInterpolate(displayTitle(slot))}</p><p class="mt-0.5 text-xs text-gray-500"${_scopeId}> Episode ${ssrInterpolate(slot.episode)} · ${ssrInterpolate(unref(formatLocalTime)(slot.airs_at, timezone.value))}</p><p class="text-xs font-semibold text-primary-400"${_scopeId}>${ssrInterpolate(unref(formatCountdown)(slot.airs_at))}</p></div>`);
                _push2(ssrRenderComponent(_sfc_main$K, {
                  score: slot.anime.average_score,
                  size: "sm"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode("div", { class: "h-16 w-11 shrink-0 overflow-hidden rounded-md bg-gray-800" }, [
                    slot.anime.cover_image_medium ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: slot.anime.cover_image_medium,
                      alt: displayTitle(slot),
                      class: "h-full w-full object-cover",
                      loading: "lazy"
                    }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "min-w-0 flex-1" }, [
                    createVNode("p", { class: "line-clamp-1 text-sm font-medium text-gray-200 group-hover:text-primary-400 transition" }, toDisplayString(displayTitle(slot)), 1),
                    createVNode("p", { class: "mt-0.5 text-xs text-gray-500" }, " Episode " + toDisplayString(slot.episode) + " · " + toDisplayString(unref(formatLocalTime)(slot.airs_at, timezone.value)), 1),
                    createVNode("p", { class: "text-xs font-semibold text-primary-400" }, toDisplayString(unref(formatCountdown)(slot.airs_at)), 1)
                  ]),
                  createVNode(_sfc_main$K, {
                    score: slot.anime.average_score,
                    size: "sm"
                  }, null, 8, ["score"])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AiringTodaySection.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "HomePage",
  __ssrInlineRender: true,
  props: {
    seasonalShowcase: {},
    airingNow: {},
    topRated: {},
    currentSeason: {},
    currentYear: {},
    isAuthenticated: { type: Boolean },
    stats: {},
    airingToday: {},
    continueWatching: {}
  },
  setup(__props) {
    function seasonLabel(season) {
      return season.charAt(0) + season.slice(1).toLowerCase();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, {
        title: __props.isAuthenticated ? "Dashboard" : "Home"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description" content="Track your anime with AniTrack. Browse seasonal anime, discover top rated shows, and manage your watchlist."${_scopeId}><link rel="canonical"${ssrRenderAttr("href", _ctx.route("home"))}${_scopeId}><meta property="og:title" content="AniTrack — Discover and track your favorite anime"${_scopeId}><meta property="og:description" content="Track your anime watching progress, discover new shows, and share your list with friends."${_scopeId}><meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary"${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: "Track your anime with AniTrack. Browse seasonal anime, discover top rated shows, and manage your watchlist."
              }),
              createVNode("link", {
                rel: "canonical",
                href: _ctx.route("home")
              }, null, 8, ["href"]),
              createVNode("meta", {
                property: "og:title",
                content: "AniTrack — Discover and track your favorite anime"
              }),
              createVNode("meta", {
                property: "og:description",
                content: "Track your anime watching progress, discover new shows, and share your list with friends."
              }),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="space-y-10">`);
      if (!__props.isAuthenticated) {
        _push(`<section class="py-8 text-center"><h1 class="mb-2 text-4xl font-bold text-gray-100">Welcome to AniTrack</h1><p class="mb-6 text-gray-400">Discover and track your favorite anime.</p></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mx-auto max-w-lg">`);
      _push(ssrRenderComponent(_sfc_main$v, null, null, _parent));
      _push(`</div>`);
      if (__props.isAuthenticated && __props.stats) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_sfc_main$u, {
          "total-anime": __props.stats.totalAnime,
          "episodes-watched": __props.stats.episodesWatched,
          "avg-score": __props.stats.avgScore,
          "watching-count": __props.stats.watchingCount
        }, null, _parent));
        if (__props.airingToday && __props.airingToday.length) {
          _push(ssrRenderComponent(_sfc_main$s, { slots: __props.airingToday }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (__props.continueWatching && __props.continueWatching.length) {
          _push(ssrRenderComponent(_sfc_main$t, { entries: __props.continueWatching }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$w, {
        anime: __props.seasonalShowcase,
        title: `${seasonLabel(__props.currentSeason)} ${__props.currentYear} Anime`,
        "see-all-route": _ctx.route("seasonal", { year: __props.currentYear, season: __props.currentSeason.toLowerCase() })
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$w, {
        anime: __props.airingNow,
        title: "Currently Airing",
        "see-all-route": _ctx.route("anime.index", { "filter[status]": "RELEASING", sort: "-popularity" })
      }, null, _parent));
      if (__props.topRated.length) {
        _push(ssrRenderComponent(_sfc_main$w, {
          anime: __props.topRated,
          title: "Top Rated",
          "see-all-route": _ctx.route("top.rated")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/HomePage.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$r
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$q = /* @__PURE__ */ defineComponent({
  __name: "ImportWizard",
  __ssrInlineRender: true,
  setup(__props) {
    const step = ref("upload");
    const preview = ref([]);
    const token = ref("");
    const total = ref(0);
    const progress = ref(0);
    const fetching = ref(false);
    const result = ref(null);
    const overwrite = ref(false);
    const uploading = ref(false);
    const confirming = ref(false);
    const error = ref("");
    const showNotFound = ref(false);
    let pollTimer = null;
    async function confirmImport() {
      confirming.value = true;
      error.value = "";
      try {
        const { data } = await axios.post(
          route("import.confirm"),
          { token: token.value, overwrite_existing: overwrite.value }
        );
        if (data.status === "done") {
          result.value = data.result ?? null;
          step.value = "done";
        } else {
          step.value = "processing";
          startPolling();
        }
      } catch (e2) {
        if (axios.isAxiosError(e2)) {
          error.value = e2.response?.data?.error ?? "Import failed";
        } else {
          error.value = "Import failed";
        }
      } finally {
        confirming.value = false;
      }
    }
    function startPolling() {
      pollTimer = setInterval(async () => {
        try {
          const { data } = await axios.get(route("import.status"), {
            params: { token: token.value }
          });
          progress.value = data.processed;
          fetching.value = data.status === "fetching";
          if (data.status === "done") {
            result.value = data.result ?? null;
            step.value = "done";
            stopPolling();
          } else if (data.status === "failed") {
            error.value = "Import failed during processing";
            step.value = "upload";
            stopPolling();
          }
        } catch {
          error.value = "Failed to check import status";
          stopPolling();
        }
      }, 2e3);
    }
    function stopPolling() {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    }
    onUnmounted(stopPolling);
    function reset() {
      step.value = "upload";
      preview.value = [];
      token.value = "";
      total.value = 0;
      progress.value = 0;
      fetching.value = false;
      result.value = null;
      error.value = "";
      showNotFound.value = false;
      overwrite.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-2xl mx-auto" }, _attrs))}>`);
      if (error.value) {
        _push(`<div class="mb-4 rounded-lg border border-red-800 bg-red-900/30 px-4 py-3 text-red-300 text-sm">${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (step.value === "upload") {
        _push(`<div class="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center"><h2 class="text-lg font-semibold mb-2">Import from MyAnimeList</h2><p class="text-gray-400 text-sm mb-6"> Upload your MAL XML export file. You can export your list from MyAnimeList under Settings → Import/Export. </p><label class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-600 px-8 py-6 hover:border-gray-500 transition"><input type="file" accept=".xml,.gz,.xml.gz" class="hidden"><span class="text-gray-300">${ssrInterpolate(uploading.value ? "Parsing..." : "Choose XML file")}</span></label></div>`);
      } else if (step.value === "preview") {
        _push(`<div class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4"><h2 class="text-lg font-semibold">Preview — ${ssrInterpolate(total.value)} entries found</h2><div class="max-h-64 overflow-y-auto"><table class="w-full text-sm"><thead><tr class="text-left text-gray-400 border-b border-gray-800"><th class="py-2 pr-4">Title</th><th class="py-2 pr-4">Status</th><th class="py-2 pr-4">Score</th><th class="py-2">Progress</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(preview.value, (entry, i2) => {
          _push(`<tr class="border-b border-gray-800/50"><td class="py-1.5 pr-4 text-gray-300">${ssrInterpolate(entry.title)}</td><td class="py-1.5 pr-4 text-gray-400">${ssrInterpolate(entry.status)}</td><td class="py-1.5 pr-4 text-gray-400">${ssrInterpolate(entry.score > 0 ? entry.score / 10 : "-")}</td><td class="py-1.5 text-gray-400">${ssrInterpolate(entry.progress)}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
        if (total.value > 20) {
          _push(`<p class="text-xs text-gray-500"> Showing first 20 of ${ssrInterpolate(total.value)} entries. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<label class="flex items-center gap-2 text-sm text-gray-300"><input${ssrIncludeBooleanAttr(Array.isArray(overwrite.value) ? ssrLooseContain(overwrite.value, null) : overwrite.value) ? " checked" : ""} type="checkbox" class="rounded border-gray-600"> Overwrite existing entries </label><div class="flex gap-2">`);
        _push(ssrRenderComponent(unref(Button), {
          label: "Cancel",
          severity: "secondary",
          text: "",
          onClick: reset
        }, null, _parent));
        _push(ssrRenderComponent(unref(Button), {
          label: `Import ${total.value} entries`,
          loading: confirming.value,
          onClick: confirmImport
        }, null, _parent));
        _push(`</div></div>`);
      } else if (step.value === "processing") {
        _push(`<div class="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center space-y-4"><h2 class="text-lg font-semibold">${ssrInterpolate(fetching.value ? "Fetching missing anime..." : "Importing...")}</h2>`);
        if (!fetching.value) {
          _push(ssrRenderComponent(unref(ProgressBar), {
            value: total.value > 0 ? Math.round(progress.value / total.value * 100) : 0
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(ProgressBar), { mode: "indeterminate" }, null, _parent));
        }
        _push(`<p class="text-sm text-gray-400">${ssrInterpolate(fetching.value ? "Looking up anime not yet in our database" : `${progress.value} / ${total.value} entries processed`)}</p></div>`);
      } else if (step.value === "done" && result.value) {
        _push(`<div class="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-4"><h2 class="text-lg font-semibold text-green-400">Import Complete</h2><div class="grid grid-cols-2 gap-4 sm:grid-cols-4"><div class="rounded-lg bg-gray-800 p-4 text-center"><div class="text-2xl font-bold text-primary-400">${ssrInterpolate(result.value.imported)}</div><div class="text-xs text-gray-400">Imported</div></div><div class="rounded-lg bg-gray-800 p-4 text-center"><div class="text-2xl font-bold text-gray-300">${ssrInterpolate(result.value.skipped)}</div><div class="text-xs text-gray-400">Skipped</div></div><div class="rounded-lg bg-gray-800 p-4 text-center"><div class="text-2xl font-bold text-red-400">${ssrInterpolate(result.value.errors)}</div><div class="text-xs text-gray-400">Not Found</div></div><div class="rounded-lg bg-gray-800 p-4 text-center"><div class="text-2xl font-bold text-gray-300">${ssrInterpolate(result.value.total)}</div><div class="text-xs text-gray-400">Total</div></div></div>`);
        if (result.value.not_found && result.value.not_found.length > 0) {
          _push(`<div><button class="text-sm text-gray-400 hover:text-gray-200 transition flex items-center gap-1"><span>${ssrInterpolate(showNotFound.value ? "▾" : "▸")}</span> ${ssrInterpolate(result.value.not_found.length)} anime could not be found </button>`);
          if (showNotFound.value) {
            _push(`<div class="mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-800 bg-gray-800/50"><table class="w-full text-sm"><thead><tr class="text-left text-gray-500 border-b border-gray-700"><th class="px-3 py-1.5">Title</th><th class="px-3 py-1.5 w-24">MAL ID</th></tr></thead><tbody><!--[-->`);
            ssrRenderList(result.value.not_found, (entry) => {
              _push(`<tr class="border-b border-gray-800/50"><td class="px-3 py-1.5 text-gray-300">${ssrInterpolate(entry.title)}</td><td class="px-3 py-1.5"><a${ssrRenderAttr("href", `https://myanimelist.net/anime/${entry.mal_id}`)} target="_blank" rel="noopener" class="text-primary-400 hover:text-primary-300 transition">${ssrInterpolate(entry.mal_id)}</a></td></tr>`);
            });
            _push(`<!--]--></tbody></table></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex gap-2">`);
        _push(ssrRenderComponent(_component_Link, {
          href: _ctx.route("list")
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Button), { label: "Go to My List" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Button), { label: "Go to My List" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(Button), {
          label: "Import Another",
          severity: "secondary",
          text: "",
          onClick: reset
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ImportWizard.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "ImportPage",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Import from MAL" }, null, _parent));
      _push(`<div><h1 class="text-2xl font-bold mb-6">Import from MAL</h1>`);
      _push(ssrRenderComponent(_sfc_main$q, null, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/ImportPage.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$p
}, Symbol.toStringTag, { value: "Module" }));
function bufferToBase64URLString(buffer) {
  const bytes = new Uint8Array(buffer);
  let str = "";
  for (const charCode of bytes) {
    str += String.fromCharCode(charCode);
  }
  const base64String = btoa(str);
  return base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function base64URLStringToBuffer(base64URLString) {
  const base64 = base64URLString.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - base64.length % 4) % 4;
  const padded = base64.padEnd(base64.length + padLength, "=");
  const binary = atob(padded);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i2 = 0; i2 < binary.length; i2++) {
    bytes[i2] = binary.charCodeAt(i2);
  }
  return buffer;
}
function browserSupportsWebAuthn() {
  return _browserSupportsWebAuthnInternals.stubThis(globalThis?.PublicKeyCredential !== void 0 && typeof globalThis.PublicKeyCredential === "function");
}
const _browserSupportsWebAuthnInternals = {
  stubThis: (value) => value
};
function toPublicKeyCredentialDescriptor(descriptor) {
  const { id } = descriptor;
  return {
    ...descriptor,
    id: base64URLStringToBuffer(id),
    /**
     * `descriptor.transports` is an array of our `AuthenticatorTransportFuture` that includes newer
     * transports that TypeScript's DOM lib is ignorant of. Convince TS that our list of transports
     * are fine to pass to WebAuthn since browsers will recognize the new value.
     */
    transports: descriptor.transports
  };
}
function isValidDomain(hostname) {
  return (
    // Consider localhost valid as well since it's okay wrt Secure Contexts
    hostname === "localhost" || // Support punycode (ACE) or ascii labels and domains
    /^((xn--[a-z0-9-]+|[a-z0-9]+(-[a-z0-9]+)*)\.)+([a-z]{2,}|xn--[a-z0-9-]+)$/i.test(hostname)
  );
}
class WebAuthnError extends Error {
  constructor({ message, code, cause, name }) {
    super(message, { cause });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.name = name ?? cause.name;
    this.code = code;
  }
}
function identifyRegistrationError({ error, options }) {
  const { publicKey } = options;
  if (!publicKey) {
    throw Error("options was missing required publicKey property");
  }
  if (error.name === "AbortError") {
    if (options.signal instanceof AbortSignal) {
      return new WebAuthnError({
        message: "Registration ceremony was sent an abort signal",
        code: "ERROR_CEREMONY_ABORTED",
        cause: error
      });
    }
  } else if (error.name === "ConstraintError") {
    if (publicKey.authenticatorSelection?.requireResidentKey === true) {
      return new WebAuthnError({
        message: "Discoverable credentials were required but no available authenticator supported it",
        code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",
        cause: error
      });
    } else if (
      // @ts-ignore: `mediation` doesn't yet exist on CredentialCreationOptions but it's possible as of Sept 2024
      options.mediation === "conditional" && publicKey.authenticatorSelection?.userVerification === "required"
    ) {
      return new WebAuthnError({
        message: "User verification was required during automatic registration but it could not be performed",
        code: "ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",
        cause: error
      });
    } else if (publicKey.authenticatorSelection?.userVerification === "required") {
      return new WebAuthnError({
        message: "User verification was required but no available authenticator supported it",
        code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",
        cause: error
      });
    }
  } else if (error.name === "InvalidStateError") {
    return new WebAuthnError({
      message: "The authenticator was previously registered",
      code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",
      cause: error
    });
  } else if (error.name === "NotAllowedError") {
    return new WebAuthnError({
      message: error.message,
      code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
      cause: error
    });
  } else if (error.name === "NotSupportedError") {
    const validPubKeyCredParams = publicKey.pubKeyCredParams.filter((param) => param.type === "public-key");
    if (validPubKeyCredParams.length === 0) {
      return new WebAuthnError({
        message: 'No entry in pubKeyCredParams was of type "public-key"',
        code: "ERROR_MALFORMED_PUBKEYCREDPARAMS",
        cause: error
      });
    }
    return new WebAuthnError({
      message: "No available authenticator supported any of the specified pubKeyCredParams algorithms",
      code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",
      cause: error
    });
  } else if (error.name === "SecurityError") {
    const effectiveDomain = globalThis.location.hostname;
    if (!isValidDomain(effectiveDomain)) {
      return new WebAuthnError({
        message: `${globalThis.location.hostname} is an invalid domain`,
        code: "ERROR_INVALID_DOMAIN",
        cause: error
      });
    } else if (publicKey.rp.id !== effectiveDomain) {
      return new WebAuthnError({
        message: `The RP ID "${publicKey.rp.id}" is invalid for this domain`,
        code: "ERROR_INVALID_RP_ID",
        cause: error
      });
    }
  } else if (error.name === "TypeError") {
    if (publicKey.user.id.byteLength < 1 || publicKey.user.id.byteLength > 64) {
      return new WebAuthnError({
        message: "User ID was not between 1 and 64 characters",
        code: "ERROR_INVALID_USER_ID_LENGTH",
        cause: error
      });
    }
  } else if (error.name === "UnknownError") {
    return new WebAuthnError({
      message: "The authenticator was unable to process the specified options, or could not create a new credential",
      code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
      cause: error
    });
  }
  return error;
}
class BaseWebAuthnAbortService {
  constructor() {
    Object.defineProperty(this, "controller", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  createNewAbortSignal() {
    if (this.controller) {
      const abortError = new Error("Cancelling existing WebAuthn API call for new one");
      abortError.name = "AbortError";
      this.controller.abort(abortError);
    }
    const newController = new AbortController();
    this.controller = newController;
    return newController.signal;
  }
  cancelCeremony() {
    if (this.controller) {
      const abortError = new Error("Manually cancelling existing WebAuthn API call");
      abortError.name = "AbortError";
      this.controller.abort(abortError);
      this.controller = void 0;
    }
  }
}
const WebAuthnAbortService = new BaseWebAuthnAbortService();
const attachments = ["cross-platform", "platform"];
function toAuthenticatorAttachment(attachment) {
  if (!attachment) {
    return;
  }
  if (attachments.indexOf(attachment) < 0) {
    return;
  }
  return attachment;
}
async function startRegistration(options) {
  if (!options.optionsJSON && options.challenge) {
    console.warn("startRegistration() was not called correctly. It will try to continue with the provided options, but this call should be refactored to use the expected call structure instead. See https://simplewebauthn.dev/docs/packages/browser#typeerror-cannot-read-properties-of-undefined-reading-challenge for more information.");
    options = { optionsJSON: options };
  }
  const { optionsJSON, useAutoRegister = false } = options;
  if (!browserSupportsWebAuthn()) {
    throw new Error("WebAuthn is not supported in this browser");
  }
  const publicKey = {
    ...optionsJSON,
    challenge: base64URLStringToBuffer(optionsJSON.challenge),
    user: {
      ...optionsJSON.user,
      id: base64URLStringToBuffer(optionsJSON.user.id)
    },
    excludeCredentials: optionsJSON.excludeCredentials?.map(toPublicKeyCredentialDescriptor)
  };
  const createOptions = {};
  if (useAutoRegister) {
    createOptions.mediation = "conditional";
  }
  createOptions.publicKey = publicKey;
  createOptions.signal = WebAuthnAbortService.createNewAbortSignal();
  let credential;
  try {
    credential = await navigator.credentials.create(createOptions);
  } catch (err) {
    throw identifyRegistrationError({ error: err, options: createOptions });
  }
  if (!credential) {
    throw new Error("Registration was not completed");
  }
  const { id, rawId, response, type } = credential;
  let transports = void 0;
  if (typeof response.getTransports === "function") {
    transports = response.getTransports();
  }
  let responsePublicKeyAlgorithm = void 0;
  if (typeof response.getPublicKeyAlgorithm === "function") {
    try {
      responsePublicKeyAlgorithm = response.getPublicKeyAlgorithm();
    } catch (error) {
      warnOnBrokenImplementation("getPublicKeyAlgorithm()", error);
    }
  }
  let responsePublicKey = void 0;
  if (typeof response.getPublicKey === "function") {
    try {
      const _publicKey = response.getPublicKey();
      if (_publicKey !== null) {
        responsePublicKey = bufferToBase64URLString(_publicKey);
      }
    } catch (error) {
      warnOnBrokenImplementation("getPublicKey()", error);
    }
  }
  let responseAuthenticatorData;
  if (typeof response.getAuthenticatorData === "function") {
    try {
      responseAuthenticatorData = bufferToBase64URLString(response.getAuthenticatorData());
    } catch (error) {
      warnOnBrokenImplementation("getAuthenticatorData()", error);
    }
  }
  return {
    id,
    rawId: bufferToBase64URLString(rawId),
    response: {
      attestationObject: bufferToBase64URLString(response.attestationObject),
      clientDataJSON: bufferToBase64URLString(response.clientDataJSON),
      transports,
      publicKeyAlgorithm: responsePublicKeyAlgorithm,
      publicKey: responsePublicKey,
      authenticatorData: responseAuthenticatorData
    },
    type,
    clientExtensionResults: credential.getClientExtensionResults(),
    authenticatorAttachment: toAuthenticatorAttachment(credential.authenticatorAttachment)
  };
}
function warnOnBrokenImplementation(methodName, cause) {
  console.warn(`The browser extension that intercepted this WebAuthn API call incorrectly implemented ${methodName}. You should report this error to them.
`, cause);
}
function browserSupportsWebAuthnAutofill() {
  if (!browserSupportsWebAuthn()) {
    return _browserSupportsWebAuthnAutofillInternals.stubThis(new Promise((resolve) => resolve(false)));
  }
  const globalPublicKeyCredential = globalThis.PublicKeyCredential;
  if (globalPublicKeyCredential?.isConditionalMediationAvailable === void 0) {
    return _browserSupportsWebAuthnAutofillInternals.stubThis(new Promise((resolve) => resolve(false)));
  }
  return _browserSupportsWebAuthnAutofillInternals.stubThis(globalPublicKeyCredential.isConditionalMediationAvailable());
}
const _browserSupportsWebAuthnAutofillInternals = {
  stubThis: (value) => value
};
function identifyAuthenticationError({ error, options }) {
  const { publicKey } = options;
  if (!publicKey) {
    throw Error("options was missing required publicKey property");
  }
  if (error.name === "AbortError") {
    if (options.signal instanceof AbortSignal) {
      return new WebAuthnError({
        message: "Authentication ceremony was sent an abort signal",
        code: "ERROR_CEREMONY_ABORTED",
        cause: error
      });
    }
  } else if (error.name === "NotAllowedError") {
    return new WebAuthnError({
      message: error.message,
      code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
      cause: error
    });
  } else if (error.name === "SecurityError") {
    const effectiveDomain = globalThis.location.hostname;
    if (!isValidDomain(effectiveDomain)) {
      return new WebAuthnError({
        message: `${globalThis.location.hostname} is an invalid domain`,
        code: "ERROR_INVALID_DOMAIN",
        cause: error
      });
    } else if (publicKey.rpId !== effectiveDomain) {
      return new WebAuthnError({
        message: `The RP ID "${publicKey.rpId}" is invalid for this domain`,
        code: "ERROR_INVALID_RP_ID",
        cause: error
      });
    }
  } else if (error.name === "UnknownError") {
    return new WebAuthnError({
      message: "The authenticator was unable to process the specified options, or could not create a new assertion signature",
      code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
      cause: error
    });
  }
  return error;
}
async function startAuthentication(options) {
  if (!options.optionsJSON && options.challenge) {
    console.warn("startAuthentication() was not called correctly. It will try to continue with the provided options, but this call should be refactored to use the expected call structure instead. See https://simplewebauthn.dev/docs/packages/browser#typeerror-cannot-read-properties-of-undefined-reading-challenge for more information.");
    options = { optionsJSON: options };
  }
  const { optionsJSON, useBrowserAutofill = false, verifyBrowserAutofillInput = true } = options;
  if (!browserSupportsWebAuthn()) {
    throw new Error("WebAuthn is not supported in this browser");
  }
  let allowCredentials;
  if (optionsJSON.allowCredentials?.length !== 0) {
    allowCredentials = optionsJSON.allowCredentials?.map(toPublicKeyCredentialDescriptor);
  }
  const publicKey = {
    ...optionsJSON,
    challenge: base64URLStringToBuffer(optionsJSON.challenge),
    allowCredentials
  };
  const getOptions = {};
  if (useBrowserAutofill) {
    if (!await browserSupportsWebAuthnAutofill()) {
      throw Error("Browser does not support WebAuthn autofill");
    }
    const eligibleInputs = document.querySelectorAll("input[autocomplete$='webauthn']");
    if (eligibleInputs.length < 1 && verifyBrowserAutofillInput) {
      throw Error('No <input> with "webauthn" as the only or last value in its `autocomplete` attribute was detected');
    }
    getOptions.mediation = "conditional";
    publicKey.allowCredentials = [];
  }
  getOptions.publicKey = publicKey;
  getOptions.signal = WebAuthnAbortService.createNewAbortSignal();
  let credential;
  try {
    credential = await navigator.credentials.get(getOptions);
  } catch (err) {
    throw identifyAuthenticationError({ error: err, options: getOptions });
  }
  if (!credential) {
    throw new Error("Authentication was not completed");
  }
  const { id, rawId, response, type } = credential;
  let userHandle = void 0;
  if (response.userHandle) {
    userHandle = bufferToBase64URLString(response.userHandle);
  }
  return {
    id,
    rawId: bufferToBase64URLString(rawId),
    response: {
      authenticatorData: bufferToBase64URLString(response.authenticatorData),
      clientDataJSON: bufferToBase64URLString(response.clientDataJSON),
      signature: bufferToBase64URLString(response.signature),
      userHandle
    },
    type,
    clientExtensionResults: credential.getClientExtensionResults(),
    authenticatorAttachment: toAuthenticatorAttachment(credential.authenticatorAttachment)
  };
}
function platformAuthenticatorIsAvailable() {
  if (!browserSupportsWebAuthn()) {
    return new Promise((resolve) => resolve(false));
  }
  return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
}
function isSupported() {
  return browserSupportsWebAuthn();
}
function isNotSupported() {
  return !isSupported();
}
function isUnsupported() {
  return !isSupported();
}
async function isAutofillable() {
  return isSupported() && await browserSupportsWebAuthnAutofill();
}
async function isNotAutofillable() {
  return !await isAutofillable();
}
async function isPlatformAuthenticator() {
  return isSupported() && await platformAuthenticatorIsAvailable();
}
async function isNotPlatformAuthenticator() {
  return !await isPlatformAuthenticator();
}
function pull(object, key) {
  const extracted = object[key];
  delete object[key];
  return extracted;
}
function isObjectEmpty(value) {
  return typeof value === "object" && !Object.keys(value).length;
}
function mergeDeep(target, source) {
  if (!isObject(target)) {
    return mergeDeep({}, source);
  }
  const output = Object.assign({}, target);
  if (isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}
function isObject(obj) {
  return obj !== null && !Array.isArray(obj) && typeof obj === "object" && typeof obj !== "function";
}
function normalizeOptions(options, config, defaultPathKey) {
  if (!options) {
    options = config.routes[defaultPathKey];
  }
  if (typeof options === "string") {
    options = { path: options };
  }
  options.path = options.path || config.routes[defaultPathKey];
  options.baseURL = options.baseURL || config.baseURL || window.location.origin;
  options.body = options.body || {};
  options.method = options.method || config.method;
  options.headers = options.headers || config.headers;
  options.redirect = options.redirect || config.redirect;
  options.credentials = options.credentials || config.credentials;
  return options;
}
const defaultConfig = {
  method: "post",
  redirect: "error",
  baseURL: void 0,
  findCsrfToken: false,
  findXsrfToken: false,
  useAutofill: void 0,
  routes: {
    attestOptions: "/auth/attest-options",
    attest: "/auth/attest",
    assertOptions: "/auth/assert-options",
    assert: "/auth/assert"
  },
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  credentials: "same-origin"
};
var t$1 = Object.defineProperty;
var o$2 = (e2, l2) => t$1(e2, "name", { value: l2, configurable: true });
var n$3 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function f$1(e2) {
  return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
}
o$2(f$1, "getDefaultExportFromCjs");
var Os = Object.defineProperty;
var fi = (i2) => {
  throw TypeError(i2);
};
var n$2 = (i2, o2) => Os(i2, "name", { value: o2, configurable: true });
var ci = (i2, o2, a2) => o2.has(i2) || fi("Cannot " + a2);
var O$1 = (i2, o2, a2) => (ci(i2, o2, "read from private field"), a2 ? a2.call(i2) : o2.get(i2)), be = (i2, o2, a2) => o2.has(i2) ? fi("Cannot add the same private member more than once") : o2 instanceof WeakSet ? o2.add(i2) : o2.set(i2, a2), X = (i2, o2, a2, f2) => (ci(i2, o2, "write to private field"), o2.set(i2, a2), a2);
var ve, zt, bt, Cr, ze, It, Ft, mt, ee, yt, He, Ve, gt;
function Us(i2) {
  if (!/^data:/i.test(i2)) throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  i2 = i2.replace(/\r?\n/g, "");
  const o2 = i2.indexOf(",");
  if (o2 === -1 || o2 <= 4) throw new TypeError("malformed data: URI");
  const a2 = i2.substring(5, o2).split(";");
  let f2 = "", l2 = false;
  const p2 = a2[0] || "text/plain";
  let h2 = p2;
  for (let A2 = 1; A2 < a2.length; A2++) a2[A2] === "base64" ? l2 = true : a2[A2] && (h2 += `;${a2[A2]}`, a2[A2].indexOf("charset=") === 0 && (f2 = a2[A2].substring(8)));
  !a2[0] && !f2.length && (h2 += ";charset=US-ASCII", f2 = "US-ASCII");
  const S2 = l2 ? "base64" : "ascii", v2 = unescape(i2.substring(o2 + 1)), w2 = Buffer.from(v2, S2);
  return w2.type = p2, w2.typeFull = h2, w2.charset = f2, w2;
}
n$2(Us, "dataUriToBuffer");
var pi = {}, kt = { exports: {} };
var xs = kt.exports, bi;
function Ns() {
  return bi || (bi = 1, (function(i2, o2) {
    (function(a2, f2) {
      f2(o2);
    })(xs, function(a2) {
      function f2() {
      }
      n$2(f2, "noop");
      function l2(e2) {
        return typeof e2 == "object" && e2 !== null || typeof e2 == "function";
      }
      n$2(l2, "typeIsObject");
      const p2 = f2;
      function h2(e2, t3) {
        try {
          Object.defineProperty(e2, "name", { value: t3, configurable: true });
        } catch {
        }
      }
      n$2(h2, "setFunctionName");
      const S2 = Promise, v2 = Promise.prototype.then, w2 = Promise.reject.bind(S2);
      function A2(e2) {
        return new S2(e2);
      }
      n$2(A2, "newPromise");
      function T2(e2) {
        return A2((t3) => t3(e2));
      }
      n$2(T2, "promiseResolvedWith");
      function b2(e2) {
        return w2(e2);
      }
      n$2(b2, "promiseRejectedWith");
      function q(e2, t3, r2) {
        return v2.call(e2, t3, r2);
      }
      n$2(q, "PerformPromiseThen");
      function g2(e2, t3, r2) {
        q(q(e2, t3, r2), void 0, p2);
      }
      n$2(g2, "uponPromise");
      function V(e2, t3) {
        g2(e2, t3);
      }
      n$2(V, "uponFulfillment");
      function I2(e2, t3) {
        g2(e2, void 0, t3);
      }
      n$2(I2, "uponRejection");
      function F(e2, t3, r2) {
        return q(e2, t3, r2);
      }
      n$2(F, "transformPromiseWith");
      function Q(e2) {
        q(e2, void 0, p2);
      }
      n$2(Q, "setPromiseIsHandledToTrue");
      let ge = n$2((e2) => {
        if (typeof queueMicrotask == "function") ge = queueMicrotask;
        else {
          const t3 = T2(void 0);
          ge = n$2((r2) => q(t3, r2), "_queueMicrotask");
        }
        return ge(e2);
      }, "_queueMicrotask");
      function z(e2, t3, r2) {
        if (typeof e2 != "function") throw new TypeError("Argument is not a function");
        return Function.prototype.apply.call(e2, t3, r2);
      }
      n$2(z, "reflectCall");
      function j2(e2, t3, r2) {
        try {
          return T2(z(e2, t3, r2));
        } catch (s2) {
          return b2(s2);
        }
      }
      n$2(j2, "promiseCall");
      const U2 = 16384, bn = class bn {
        constructor() {
          this._cursor = 0, this._size = 0, this._front = { _elements: [], _next: void 0 }, this._back = this._front, this._cursor = 0, this._size = 0;
        }
        get length() {
          return this._size;
        }
        push(t3) {
          const r2 = this._back;
          let s2 = r2;
          r2._elements.length === U2 - 1 && (s2 = { _elements: [], _next: void 0 }), r2._elements.push(t3), s2 !== r2 && (this._back = s2, r2._next = s2), ++this._size;
        }
        shift() {
          const t3 = this._front;
          let r2 = t3;
          const s2 = this._cursor;
          let u2 = s2 + 1;
          const c2 = t3._elements, d2 = c2[s2];
          return u2 === U2 && (r2 = t3._next, u2 = 0), --this._size, this._cursor = u2, t3 !== r2 && (this._front = r2), c2[s2] = void 0, d2;
        }
        forEach(t3) {
          let r2 = this._cursor, s2 = this._front, u2 = s2._elements;
          for (; (r2 !== u2.length || s2._next !== void 0) && !(r2 === u2.length && (s2 = s2._next, u2 = s2._elements, r2 = 0, u2.length === 0)); ) t3(u2[r2]), ++r2;
        }
        peek() {
          const t3 = this._front, r2 = this._cursor;
          return t3._elements[r2];
        }
      };
      n$2(bn, "SimpleQueue");
      let D2 = bn;
      const jt = /* @__PURE__ */ Symbol("[[AbortSteps]]"), Qn = /* @__PURE__ */ Symbol("[[ErrorSteps]]"), Ar = /* @__PURE__ */ Symbol("[[CancelSteps]]"), Br = /* @__PURE__ */ Symbol("[[PullSteps]]"), kr = /* @__PURE__ */ Symbol("[[ReleaseSteps]]");
      function Yn(e2, t3) {
        e2._ownerReadableStream = t3, t3._reader = e2, t3._state === "readable" ? qr(e2) : t3._state === "closed" ? xi(e2) : Gn(e2, t3._storedError);
      }
      n$2(Yn, "ReadableStreamReaderGenericInitialize");
      function Wr(e2, t3) {
        const r2 = e2._ownerReadableStream;
        return ie(r2, t3);
      }
      n$2(Wr, "ReadableStreamReaderGenericCancel");
      function _e(e2) {
        const t3 = e2._ownerReadableStream;
        t3._state === "readable" ? Or(e2, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")) : Ni(e2, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")), t3._readableStreamController[kr](), t3._reader = void 0, e2._ownerReadableStream = void 0;
      }
      n$2(_e, "ReadableStreamReaderGenericRelease");
      function Lt(e2) {
        return new TypeError("Cannot " + e2 + " a stream using a released reader");
      }
      n$2(Lt, "readerLockException");
      function qr(e2) {
        e2._closedPromise = A2((t3, r2) => {
          e2._closedPromise_resolve = t3, e2._closedPromise_reject = r2;
        });
      }
      n$2(qr, "defaultReaderClosedPromiseInitialize");
      function Gn(e2, t3) {
        qr(e2), Or(e2, t3);
      }
      n$2(Gn, "defaultReaderClosedPromiseInitializeAsRejected");
      function xi(e2) {
        qr(e2), Zn(e2);
      }
      n$2(xi, "defaultReaderClosedPromiseInitializeAsResolved");
      function Or(e2, t3) {
        e2._closedPromise_reject !== void 0 && (Q(e2._closedPromise), e2._closedPromise_reject(t3), e2._closedPromise_resolve = void 0, e2._closedPromise_reject = void 0);
      }
      n$2(Or, "defaultReaderClosedPromiseReject");
      function Ni(e2, t3) {
        Gn(e2, t3);
      }
      n$2(Ni, "defaultReaderClosedPromiseResetToRejected");
      function Zn(e2) {
        e2._closedPromise_resolve !== void 0 && (e2._closedPromise_resolve(void 0), e2._closedPromise_resolve = void 0, e2._closedPromise_reject = void 0);
      }
      n$2(Zn, "defaultReaderClosedPromiseResolve");
      const Kn = Number.isFinite || function(e2) {
        return typeof e2 == "number" && isFinite(e2);
      }, Hi = Math.trunc || function(e2) {
        return e2 < 0 ? Math.ceil(e2) : Math.floor(e2);
      };
      function Vi(e2) {
        return typeof e2 == "object" || typeof e2 == "function";
      }
      n$2(Vi, "isDictionary");
      function ue(e2, t3) {
        if (e2 !== void 0 && !Vi(e2)) throw new TypeError(`${t3} is not an object.`);
      }
      n$2(ue, "assertDictionary");
      function Z(e2, t3) {
        if (typeof e2 != "function") throw new TypeError(`${t3} is not a function.`);
      }
      n$2(Z, "assertFunction");
      function Qi(e2) {
        return typeof e2 == "object" && e2 !== null || typeof e2 == "function";
      }
      n$2(Qi, "isObject");
      function Jn(e2, t3) {
        if (!Qi(e2)) throw new TypeError(`${t3} is not an object.`);
      }
      n$2(Jn, "assertObject");
      function Se(e2, t3, r2) {
        if (e2 === void 0) throw new TypeError(`Parameter ${t3} is required in '${r2}'.`);
      }
      n$2(Se, "assertRequiredArgument");
      function zr(e2, t3, r2) {
        if (e2 === void 0) throw new TypeError(`${t3} is required in '${r2}'.`);
      }
      n$2(zr, "assertRequiredField");
      function Ir(e2) {
        return Number(e2);
      }
      n$2(Ir, "convertUnrestrictedDouble");
      function Xn(e2) {
        return e2 === 0 ? 0 : e2;
      }
      n$2(Xn, "censorNegativeZero");
      function Yi(e2) {
        return Xn(Hi(e2));
      }
      n$2(Yi, "integerPart");
      function Fr(e2, t3) {
        const s2 = Number.MAX_SAFE_INTEGER;
        let u2 = Number(e2);
        if (u2 = Xn(u2), !Kn(u2)) throw new TypeError(`${t3} is not a finite number`);
        if (u2 = Yi(u2), u2 < 0 || u2 > s2) throw new TypeError(`${t3} is outside the accepted range of 0 to ${s2}, inclusive`);
        return !Kn(u2) || u2 === 0 ? 0 : u2;
      }
      n$2(Fr, "convertUnsignedLongLongWithEnforceRange");
      function jr(e2, t3) {
        if (!We(e2)) throw new TypeError(`${t3} is not a ReadableStream.`);
      }
      n$2(jr, "assertReadableStream");
      function Qe(e2) {
        return new fe(e2);
      }
      n$2(Qe, "AcquireReadableStreamDefaultReader");
      function eo(e2, t3) {
        e2._reader._readRequests.push(t3);
      }
      n$2(eo, "ReadableStreamAddReadRequest");
      function Lr(e2, t3, r2) {
        const u2 = e2._reader._readRequests.shift();
        r2 ? u2._closeSteps() : u2._chunkSteps(t3);
      }
      n$2(Lr, "ReadableStreamFulfillReadRequest");
      function $t(e2) {
        return e2._reader._readRequests.length;
      }
      n$2($t, "ReadableStreamGetNumReadRequests");
      function to(e2) {
        const t3 = e2._reader;
        return !(t3 === void 0 || !Ee(t3));
      }
      n$2(to, "ReadableStreamHasDefaultReader");
      const mn = class mn {
        constructor(t3) {
          if (Se(t3, 1, "ReadableStreamDefaultReader"), jr(t3, "First parameter"), qe(t3)) throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          Yn(this, t3), this._readRequests = new D2();
        }
        get closed() {
          return Ee(this) ? this._closedPromise : b2(Dt("closed"));
        }
        cancel(t3 = void 0) {
          return Ee(this) ? this._ownerReadableStream === void 0 ? b2(Lt("cancel")) : Wr(this, t3) : b2(Dt("cancel"));
        }
        read() {
          if (!Ee(this)) return b2(Dt("read"));
          if (this._ownerReadableStream === void 0) return b2(Lt("read from"));
          let t3, r2;
          const s2 = A2((c2, d2) => {
            t3 = c2, r2 = d2;
          });
          return _t(this, { _chunkSteps: n$2((c2) => t3({ value: c2, done: false }), "_chunkSteps"), _closeSteps: n$2(() => t3({ value: void 0, done: true }), "_closeSteps"), _errorSteps: n$2((c2) => r2(c2), "_errorSteps") }), s2;
        }
        releaseLock() {
          if (!Ee(this)) throw Dt("releaseLock");
          this._ownerReadableStream !== void 0 && Gi(this);
        }
      };
      n$2(mn, "ReadableStreamDefaultReader");
      let fe = mn;
      Object.defineProperties(fe.prototype, { cancel: { enumerable: true }, read: { enumerable: true }, releaseLock: { enumerable: true }, closed: { enumerable: true } }), h2(fe.prototype.cancel, "cancel"), h2(fe.prototype.read, "read"), h2(fe.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(fe.prototype, Symbol.toStringTag, { value: "ReadableStreamDefaultReader", configurable: true });
      function Ee(e2) {
        return !l2(e2) || !Object.prototype.hasOwnProperty.call(e2, "_readRequests") ? false : e2 instanceof fe;
      }
      n$2(Ee, "IsReadableStreamDefaultReader");
      function _t(e2, t3) {
        const r2 = e2._ownerReadableStream;
        r2._disturbed = true, r2._state === "closed" ? t3._closeSteps() : r2._state === "errored" ? t3._errorSteps(r2._storedError) : r2._readableStreamController[Br](t3);
      }
      n$2(_t, "ReadableStreamDefaultReaderRead");
      function Gi(e2) {
        _e(e2);
        const t3 = new TypeError("Reader was released");
        ro(e2, t3);
      }
      n$2(Gi, "ReadableStreamDefaultReaderRelease");
      function ro(e2, t3) {
        const r2 = e2._readRequests;
        e2._readRequests = new D2(), r2.forEach((s2) => {
          s2._errorSteps(t3);
        });
      }
      n$2(ro, "ReadableStreamDefaultReaderErrorReadRequests");
      function Dt(e2) {
        return new TypeError(`ReadableStreamDefaultReader.prototype.${e2} can only be used on a ReadableStreamDefaultReader`);
      }
      n$2(Dt, "defaultReaderBrandCheckException");
      const Zi = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
      }).prototype), yn = class yn {
        constructor(t3, r2) {
          this._ongoingPromise = void 0, this._isFinished = false, this._reader = t3, this._preventCancel = r2;
        }
        next() {
          const t3 = n$2(() => this._nextSteps(), "nextSteps");
          return this._ongoingPromise = this._ongoingPromise ? F(this._ongoingPromise, t3, t3) : t3(), this._ongoingPromise;
        }
        return(t3) {
          const r2 = n$2(() => this._returnSteps(t3), "returnSteps");
          return this._ongoingPromise ? F(this._ongoingPromise, r2, r2) : r2();
        }
        _nextSteps() {
          if (this._isFinished) return Promise.resolve({ value: void 0, done: true });
          const t3 = this._reader;
          let r2, s2;
          const u2 = A2((d2, m2) => {
            r2 = d2, s2 = m2;
          });
          return _t(t3, { _chunkSteps: n$2((d2) => {
            this._ongoingPromise = void 0, ge(() => r2({ value: d2, done: false }));
          }, "_chunkSteps"), _closeSteps: n$2(() => {
            this._ongoingPromise = void 0, this._isFinished = true, _e(t3), r2({ value: void 0, done: true });
          }, "_closeSteps"), _errorSteps: n$2((d2) => {
            this._ongoingPromise = void 0, this._isFinished = true, _e(t3), s2(d2);
          }, "_errorSteps") }), u2;
        }
        _returnSteps(t3) {
          if (this._isFinished) return Promise.resolve({ value: t3, done: true });
          this._isFinished = true;
          const r2 = this._reader;
          if (!this._preventCancel) {
            const s2 = Wr(r2, t3);
            return _e(r2), F(s2, () => ({ value: t3, done: true }));
          }
          return _e(r2), T2({ value: t3, done: true });
        }
      };
      n$2(yn, "ReadableStreamAsyncIteratorImpl");
      let Mt = yn;
      const no = { next() {
        return oo(this) ? this._asyncIteratorImpl.next() : b2(io("next"));
      }, return(e2) {
        return oo(this) ? this._asyncIteratorImpl.return(e2) : b2(io("return"));
      } };
      Object.setPrototypeOf(no, Zi);
      function Ki(e2, t3) {
        const r2 = Qe(e2), s2 = new Mt(r2, t3), u2 = Object.create(no);
        return u2._asyncIteratorImpl = s2, u2;
      }
      n$2(Ki, "AcquireReadableStreamAsyncIterator");
      function oo(e2) {
        if (!l2(e2) || !Object.prototype.hasOwnProperty.call(e2, "_asyncIteratorImpl")) return false;
        try {
          return e2._asyncIteratorImpl instanceof Mt;
        } catch {
          return false;
        }
      }
      n$2(oo, "IsReadableStreamAsyncIterator");
      function io(e2) {
        return new TypeError(`ReadableStreamAsyncIterator.${e2} can only be used on a ReadableSteamAsyncIterator`);
      }
      n$2(io, "streamAsyncIteratorBrandCheckException");
      const ao = Number.isNaN || function(e2) {
        return e2 !== e2;
      };
      var $r, Dr, Mr;
      function St(e2) {
        return e2.slice();
      }
      n$2(St, "CreateArrayFromList");
      function so(e2, t3, r2, s2, u2) {
        new Uint8Array(e2).set(new Uint8Array(r2, s2, u2), t3);
      }
      n$2(so, "CopyDataBlockBytes");
      let we = n$2((e2) => (typeof e2.transfer == "function" ? we = n$2((t3) => t3.transfer(), "TransferArrayBuffer") : typeof structuredClone == "function" ? we = n$2((t3) => structuredClone(t3, { transfer: [t3] }), "TransferArrayBuffer") : we = n$2((t3) => t3, "TransferArrayBuffer"), we(e2)), "TransferArrayBuffer"), Ae = n$2((e2) => (typeof e2.detached == "boolean" ? Ae = n$2((t3) => t3.detached, "IsDetachedBuffer") : Ae = n$2((t3) => t3.byteLength === 0, "IsDetachedBuffer"), Ae(e2)), "IsDetachedBuffer");
      function lo(e2, t3, r2) {
        if (e2.slice) return e2.slice(t3, r2);
        const s2 = r2 - t3, u2 = new ArrayBuffer(s2);
        return so(u2, 0, e2, t3, s2), u2;
      }
      n$2(lo, "ArrayBufferSlice");
      function Ut(e2, t3) {
        const r2 = e2[t3];
        if (r2 != null) {
          if (typeof r2 != "function") throw new TypeError(`${String(t3)} is not a function`);
          return r2;
        }
      }
      n$2(Ut, "GetMethod");
      function Ji(e2) {
        const t3 = { [Symbol.iterator]: () => e2.iterator }, r2 = (async function* () {
          return yield* t3;
        })(), s2 = r2.next;
        return { iterator: r2, nextMethod: s2, done: false };
      }
      n$2(Ji, "CreateAsyncFromSyncIterator");
      const Ur = (Mr = ($r = Symbol.asyncIterator) !== null && $r !== void 0 ? $r : (Dr = Symbol.for) === null || Dr === void 0 ? void 0 : Dr.call(Symbol, "Symbol.asyncIterator")) !== null && Mr !== void 0 ? Mr : "@@asyncIterator";
      function uo(e2, t3 = "sync", r2) {
        if (r2 === void 0) if (t3 === "async") {
          if (r2 = Ut(e2, Ur), r2 === void 0) {
            const c2 = Ut(e2, Symbol.iterator), d2 = uo(e2, "sync", c2);
            return Ji(d2);
          }
        } else r2 = Ut(e2, Symbol.iterator);
        if (r2 === void 0) throw new TypeError("The object is not iterable");
        const s2 = z(r2, e2, []);
        if (!l2(s2)) throw new TypeError("The iterator method must return an object");
        const u2 = s2.next;
        return { iterator: s2, nextMethod: u2, done: false };
      }
      n$2(uo, "GetIterator");
      function Xi(e2) {
        const t3 = z(e2.nextMethod, e2.iterator, []);
        if (!l2(t3)) throw new TypeError("The iterator.next() method must return an object");
        return t3;
      }
      n$2(Xi, "IteratorNext");
      function ea(e2) {
        return !!e2.done;
      }
      n$2(ea, "IteratorComplete");
      function ta(e2) {
        return e2.value;
      }
      n$2(ta, "IteratorValue");
      function ra(e2) {
        return !(typeof e2 != "number" || ao(e2) || e2 < 0);
      }
      n$2(ra, "IsNonNegativeNumber");
      function fo(e2) {
        const t3 = lo(e2.buffer, e2.byteOffset, e2.byteOffset + e2.byteLength);
        return new Uint8Array(t3);
      }
      n$2(fo, "CloneAsUint8Array");
      function xr(e2) {
        const t3 = e2._queue.shift();
        return e2._queueTotalSize -= t3.size, e2._queueTotalSize < 0 && (e2._queueTotalSize = 0), t3.value;
      }
      n$2(xr, "DequeueValue");
      function Nr(e2, t3, r2) {
        if (!ra(r2) || r2 === 1 / 0) throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
        e2._queue.push({ value: t3, size: r2 }), e2._queueTotalSize += r2;
      }
      n$2(Nr, "EnqueueValueWithSize");
      function na(e2) {
        return e2._queue.peek().value;
      }
      n$2(na, "PeekQueueValue");
      function Be(e2) {
        e2._queue = new D2(), e2._queueTotalSize = 0;
      }
      n$2(Be, "ResetQueue");
      function co(e2) {
        return e2 === DataView;
      }
      n$2(co, "isDataViewConstructor");
      function oa(e2) {
        return co(e2.constructor);
      }
      n$2(oa, "isDataView");
      function ia(e2) {
        return co(e2) ? 1 : e2.BYTES_PER_ELEMENT;
      }
      n$2(ia, "arrayBufferViewElementSize");
      const gn = class gn {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get view() {
          if (!Hr(this)) throw Zr("view");
          return this._view;
        }
        respond(t3) {
          if (!Hr(this)) throw Zr("respond");
          if (Se(t3, 1, "respond"), t3 = Fr(t3, "First parameter"), this._associatedReadableByteStreamController === void 0) throw new TypeError("This BYOB request has been invalidated");
          if (Ae(this._view.buffer)) throw new TypeError("The BYOB request's buffer has been detached and so cannot be used as a response");
          Vt(this._associatedReadableByteStreamController, t3);
        }
        respondWithNewView(t3) {
          if (!Hr(this)) throw Zr("respondWithNewView");
          if (Se(t3, 1, "respondWithNewView"), !ArrayBuffer.isView(t3)) throw new TypeError("You can only respond with array buffer views");
          if (this._associatedReadableByteStreamController === void 0) throw new TypeError("This BYOB request has been invalidated");
          if (Ae(t3.buffer)) throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");
          Qt(this._associatedReadableByteStreamController, t3);
        }
      };
      n$2(gn, "ReadableStreamBYOBRequest");
      let Re = gn;
      Object.defineProperties(Re.prototype, { respond: { enumerable: true }, respondWithNewView: { enumerable: true }, view: { enumerable: true } }), h2(Re.prototype.respond, "respond"), h2(Re.prototype.respondWithNewView, "respondWithNewView"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Re.prototype, Symbol.toStringTag, { value: "ReadableStreamBYOBRequest", configurable: true });
      const _n = class _n {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get byobRequest() {
          if (!Ie(this)) throw Rt("byobRequest");
          return Gr(this);
        }
        get desiredSize() {
          if (!Ie(this)) throw Rt("desiredSize");
          return Ro(this);
        }
        close() {
          if (!Ie(this)) throw Rt("close");
          if (this._closeRequested) throw new TypeError("The stream has already been closed; do not close it again!");
          const t3 = this._controlledReadableByteStream._state;
          if (t3 !== "readable") throw new TypeError(`The stream (in ${t3} state) is not in the readable state and cannot be closed`);
          wt(this);
        }
        enqueue(t3) {
          if (!Ie(this)) throw Rt("enqueue");
          if (Se(t3, 1, "enqueue"), !ArrayBuffer.isView(t3)) throw new TypeError("chunk must be an array buffer view");
          if (t3.byteLength === 0) throw new TypeError("chunk must have non-zero byteLength");
          if (t3.buffer.byteLength === 0) throw new TypeError("chunk's buffer must have non-zero byteLength");
          if (this._closeRequested) throw new TypeError("stream is closed or draining");
          const r2 = this._controlledReadableByteStream._state;
          if (r2 !== "readable") throw new TypeError(`The stream (in ${r2} state) is not in the readable state and cannot be enqueued to`);
          Ht(this, t3);
        }
        error(t3 = void 0) {
          if (!Ie(this)) throw Rt("error");
          K(this, t3);
        }
        [Ar](t3) {
          ho(this), Be(this);
          const r2 = this._cancelAlgorithm(t3);
          return Nt(this), r2;
        }
        [Br](t3) {
          const r2 = this._controlledReadableByteStream;
          if (this._queueTotalSize > 0) {
            wo(this, t3);
            return;
          }
          const s2 = this._autoAllocateChunkSize;
          if (s2 !== void 0) {
            let u2;
            try {
              u2 = new ArrayBuffer(s2);
            } catch (d2) {
              t3._errorSteps(d2);
              return;
            }
            const c2 = { buffer: u2, bufferByteLength: s2, byteOffset: 0, byteLength: s2, bytesFilled: 0, minimumFill: 1, elementSize: 1, viewConstructor: Uint8Array, readerType: "default" };
            this._pendingPullIntos.push(c2);
          }
          eo(r2, t3), Fe(this);
        }
        [kr]() {
          if (this._pendingPullIntos.length > 0) {
            const t3 = this._pendingPullIntos.peek();
            t3.readerType = "none", this._pendingPullIntos = new D2(), this._pendingPullIntos.push(t3);
          }
        }
      };
      n$2(_n, "ReadableByteStreamController");
      let te = _n;
      Object.defineProperties(te.prototype, { close: { enumerable: true }, enqueue: { enumerable: true }, error: { enumerable: true }, byobRequest: { enumerable: true }, desiredSize: { enumerable: true } }), h2(te.prototype.close, "close"), h2(te.prototype.enqueue, "enqueue"), h2(te.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(te.prototype, Symbol.toStringTag, { value: "ReadableByteStreamController", configurable: true });
      function Ie(e2) {
        return !l2(e2) || !Object.prototype.hasOwnProperty.call(e2, "_controlledReadableByteStream") ? false : e2 instanceof te;
      }
      n$2(Ie, "IsReadableByteStreamController");
      function Hr(e2) {
        return !l2(e2) || !Object.prototype.hasOwnProperty.call(e2, "_associatedReadableByteStreamController") ? false : e2 instanceof Re;
      }
      n$2(Hr, "IsReadableStreamBYOBRequest");
      function Fe(e2) {
        if (!fa(e2)) return;
        if (e2._pulling) {
          e2._pullAgain = true;
          return;
        }
        e2._pulling = true;
        const r2 = e2._pullAlgorithm();
        g2(r2, () => (e2._pulling = false, e2._pullAgain && (e2._pullAgain = false, Fe(e2)), null), (s2) => (K(e2, s2), null));
      }
      n$2(Fe, "ReadableByteStreamControllerCallPullIfNeeded");
      function ho(e2) {
        Qr(e2), e2._pendingPullIntos = new D2();
      }
      n$2(ho, "ReadableByteStreamControllerClearPendingPullIntos");
      function Vr(e2, t3) {
        let r2 = false;
        e2._state === "closed" && (r2 = true);
        const s2 = po(t3);
        t3.readerType === "default" ? Lr(e2, s2, r2) : ma(e2, s2, r2);
      }
      n$2(Vr, "ReadableByteStreamControllerCommitPullIntoDescriptor");
      function po(e2) {
        const t3 = e2.bytesFilled, r2 = e2.elementSize;
        return new e2.viewConstructor(e2.buffer, e2.byteOffset, t3 / r2);
      }
      n$2(po, "ReadableByteStreamControllerConvertPullIntoDescriptor");
      function xt(e2, t3, r2, s2) {
        e2._queue.push({ buffer: t3, byteOffset: r2, byteLength: s2 }), e2._queueTotalSize += s2;
      }
      n$2(xt, "ReadableByteStreamControllerEnqueueChunkToQueue");
      function bo(e2, t3, r2, s2) {
        let u2;
        try {
          u2 = lo(t3, r2, r2 + s2);
        } catch (c2) {
          throw K(e2, c2), c2;
        }
        xt(e2, u2, 0, s2);
      }
      n$2(bo, "ReadableByteStreamControllerEnqueueClonedChunkToQueue");
      function mo(e2, t3) {
        t3.bytesFilled > 0 && bo(e2, t3.buffer, t3.byteOffset, t3.bytesFilled), Ye(e2);
      }
      n$2(mo, "ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue");
      function yo(e2, t3) {
        const r2 = Math.min(e2._queueTotalSize, t3.byteLength - t3.bytesFilled), s2 = t3.bytesFilled + r2;
        let u2 = r2, c2 = false;
        const d2 = s2 % t3.elementSize, m2 = s2 - d2;
        m2 >= t3.minimumFill && (u2 = m2 - t3.bytesFilled, c2 = true);
        const R2 = e2._queue;
        for (; u2 > 0; ) {
          const y2 = R2.peek(), C2 = Math.min(u2, y2.byteLength), P2 = t3.byteOffset + t3.bytesFilled;
          so(t3.buffer, P2, y2.buffer, y2.byteOffset, C2), y2.byteLength === C2 ? R2.shift() : (y2.byteOffset += C2, y2.byteLength -= C2), e2._queueTotalSize -= C2, go(e2, C2, t3), u2 -= C2;
        }
        return c2;
      }
      n$2(yo, "ReadableByteStreamControllerFillPullIntoDescriptorFromQueue");
      function go(e2, t3, r2) {
        r2.bytesFilled += t3;
      }
      n$2(go, "ReadableByteStreamControllerFillHeadPullIntoDescriptor");
      function _o(e2) {
        e2._queueTotalSize === 0 && e2._closeRequested ? (Nt(e2), At(e2._controlledReadableByteStream)) : Fe(e2);
      }
      n$2(_o, "ReadableByteStreamControllerHandleQueueDrain");
      function Qr(e2) {
        e2._byobRequest !== null && (e2._byobRequest._associatedReadableByteStreamController = void 0, e2._byobRequest._view = null, e2._byobRequest = null);
      }
      n$2(Qr, "ReadableByteStreamControllerInvalidateBYOBRequest");
      function Yr(e2) {
        for (; e2._pendingPullIntos.length > 0; ) {
          if (e2._queueTotalSize === 0) return;
          const t3 = e2._pendingPullIntos.peek();
          yo(e2, t3) && (Ye(e2), Vr(e2._controlledReadableByteStream, t3));
        }
      }
      n$2(Yr, "ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue");
      function aa(e2) {
        const t3 = e2._controlledReadableByteStream._reader;
        for (; t3._readRequests.length > 0; ) {
          if (e2._queueTotalSize === 0) return;
          const r2 = t3._readRequests.shift();
          wo(e2, r2);
        }
      }
      n$2(aa, "ReadableByteStreamControllerProcessReadRequestsUsingQueue");
      function sa(e2, t3, r2, s2) {
        const u2 = e2._controlledReadableByteStream, c2 = t3.constructor, d2 = ia(c2), { byteOffset: m2, byteLength: R2 } = t3, y2 = r2 * d2;
        let C2;
        try {
          C2 = we(t3.buffer);
        } catch (B) {
          s2._errorSteps(B);
          return;
        }
        const P2 = { buffer: C2, bufferByteLength: C2.byteLength, byteOffset: m2, byteLength: R2, bytesFilled: 0, minimumFill: y2, elementSize: d2, viewConstructor: c2, readerType: "byob" };
        if (e2._pendingPullIntos.length > 0) {
          e2._pendingPullIntos.push(P2), Po(u2, s2);
          return;
        }
        if (u2._state === "closed") {
          const B = new c2(P2.buffer, P2.byteOffset, 0);
          s2._closeSteps(B);
          return;
        }
        if (e2._queueTotalSize > 0) {
          if (yo(e2, P2)) {
            const B = po(P2);
            _o(e2), s2._chunkSteps(B);
            return;
          }
          if (e2._closeRequested) {
            const B = new TypeError("Insufficient bytes to fill elements in the given buffer");
            K(e2, B), s2._errorSteps(B);
            return;
          }
        }
        e2._pendingPullIntos.push(P2), Po(u2, s2), Fe(e2);
      }
      n$2(sa, "ReadableByteStreamControllerPullInto");
      function la(e2, t3) {
        t3.readerType === "none" && Ye(e2);
        const r2 = e2._controlledReadableByteStream;
        if (Kr(r2)) for (; vo(r2) > 0; ) {
          const s2 = Ye(e2);
          Vr(r2, s2);
        }
      }
      n$2(la, "ReadableByteStreamControllerRespondInClosedState");
      function ua(e2, t3, r2) {
        if (go(e2, t3, r2), r2.readerType === "none") {
          mo(e2, r2), Yr(e2);
          return;
        }
        if (r2.bytesFilled < r2.minimumFill) return;
        Ye(e2);
        const s2 = r2.bytesFilled % r2.elementSize;
        if (s2 > 0) {
          const u2 = r2.byteOffset + r2.bytesFilled;
          bo(e2, r2.buffer, u2 - s2, s2);
        }
        r2.bytesFilled -= s2, Vr(e2._controlledReadableByteStream, r2), Yr(e2);
      }
      n$2(ua, "ReadableByteStreamControllerRespondInReadableState");
      function So(e2, t3) {
        const r2 = e2._pendingPullIntos.peek();
        Qr(e2), e2._controlledReadableByteStream._state === "closed" ? la(e2, r2) : ua(e2, t3, r2), Fe(e2);
      }
      n$2(So, "ReadableByteStreamControllerRespondInternal");
      function Ye(e2) {
        return e2._pendingPullIntos.shift();
      }
      n$2(Ye, "ReadableByteStreamControllerShiftPendingPullInto");
      function fa(e2) {
        const t3 = e2._controlledReadableByteStream;
        return t3._state !== "readable" || e2._closeRequested || !e2._started ? false : !!(to(t3) && $t(t3) > 0 || Kr(t3) && vo(t3) > 0 || Ro(e2) > 0);
      }
      n$2(fa, "ReadableByteStreamControllerShouldCallPull");
      function Nt(e2) {
        e2._pullAlgorithm = void 0, e2._cancelAlgorithm = void 0;
      }
      n$2(Nt, "ReadableByteStreamControllerClearAlgorithms");
      function wt(e2) {
        const t3 = e2._controlledReadableByteStream;
        if (!(e2._closeRequested || t3._state !== "readable")) {
          if (e2._queueTotalSize > 0) {
            e2._closeRequested = true;
            return;
          }
          if (e2._pendingPullIntos.length > 0) {
            const r2 = e2._pendingPullIntos.peek();
            if (r2.bytesFilled % r2.elementSize !== 0) {
              const s2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              throw K(e2, s2), s2;
            }
          }
          Nt(e2), At(t3);
        }
      }
      n$2(wt, "ReadableByteStreamControllerClose");
      function Ht(e2, t3) {
        const r2 = e2._controlledReadableByteStream;
        if (e2._closeRequested || r2._state !== "readable") return;
        const { buffer: s2, byteOffset: u2, byteLength: c2 } = t3;
        if (Ae(s2)) throw new TypeError("chunk's buffer is detached and so cannot be enqueued");
        const d2 = we(s2);
        if (e2._pendingPullIntos.length > 0) {
          const m2 = e2._pendingPullIntos.peek();
          if (Ae(m2.buffer)) throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");
          Qr(e2), m2.buffer = we(m2.buffer), m2.readerType === "none" && mo(e2, m2);
        }
        if (to(r2)) if (aa(e2), $t(r2) === 0) xt(e2, d2, u2, c2);
        else {
          e2._pendingPullIntos.length > 0 && Ye(e2);
          const m2 = new Uint8Array(d2, u2, c2);
          Lr(r2, m2, false);
        }
        else Kr(r2) ? (xt(e2, d2, u2, c2), Yr(e2)) : xt(e2, d2, u2, c2);
        Fe(e2);
      }
      n$2(Ht, "ReadableByteStreamControllerEnqueue");
      function K(e2, t3) {
        const r2 = e2._controlledReadableByteStream;
        r2._state === "readable" && (ho(e2), Be(e2), Nt(e2), Zo(r2, t3));
      }
      n$2(K, "ReadableByteStreamControllerError");
      function wo(e2, t3) {
        const r2 = e2._queue.shift();
        e2._queueTotalSize -= r2.byteLength, _o(e2);
        const s2 = new Uint8Array(r2.buffer, r2.byteOffset, r2.byteLength);
        t3._chunkSteps(s2);
      }
      n$2(wo, "ReadableByteStreamControllerFillReadRequestFromQueue");
      function Gr(e2) {
        if (e2._byobRequest === null && e2._pendingPullIntos.length > 0) {
          const t3 = e2._pendingPullIntos.peek(), r2 = new Uint8Array(t3.buffer, t3.byteOffset + t3.bytesFilled, t3.byteLength - t3.bytesFilled), s2 = Object.create(Re.prototype);
          da(s2, e2, r2), e2._byobRequest = s2;
        }
        return e2._byobRequest;
      }
      n$2(Gr, "ReadableByteStreamControllerGetBYOBRequest");
      function Ro(e2) {
        const t3 = e2._controlledReadableByteStream._state;
        return t3 === "errored" ? null : t3 === "closed" ? 0 : e2._strategyHWM - e2._queueTotalSize;
      }
      n$2(Ro, "ReadableByteStreamControllerGetDesiredSize");
      function Vt(e2, t3) {
        const r2 = e2._pendingPullIntos.peek();
        if (e2._controlledReadableByteStream._state === "closed") {
          if (t3 !== 0) throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
        } else {
          if (t3 === 0) throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
          if (r2.bytesFilled + t3 > r2.byteLength) throw new RangeError("bytesWritten out of range");
        }
        r2.buffer = we(r2.buffer), So(e2, t3);
      }
      n$2(Vt, "ReadableByteStreamControllerRespond");
      function Qt(e2, t3) {
        const r2 = e2._pendingPullIntos.peek();
        if (e2._controlledReadableByteStream._state === "closed") {
          if (t3.byteLength !== 0) throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
        } else if (t3.byteLength === 0) throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
        if (r2.byteOffset + r2.bytesFilled !== t3.byteOffset) throw new RangeError("The region specified by view does not match byobRequest");
        if (r2.bufferByteLength !== t3.buffer.byteLength) throw new RangeError("The buffer of view has different capacity than byobRequest");
        if (r2.bytesFilled + t3.byteLength > r2.byteLength) throw new RangeError("The region specified by view is larger than byobRequest");
        const u2 = t3.byteLength;
        r2.buffer = we(t3.buffer), So(e2, u2);
      }
      n$2(Qt, "ReadableByteStreamControllerRespondWithNewView");
      function To(e2, t3, r2, s2, u2, c2, d2) {
        t3._controlledReadableByteStream = e2, t3._pullAgain = false, t3._pulling = false, t3._byobRequest = null, t3._queue = t3._queueTotalSize = void 0, Be(t3), t3._closeRequested = false, t3._started = false, t3._strategyHWM = c2, t3._pullAlgorithm = s2, t3._cancelAlgorithm = u2, t3._autoAllocateChunkSize = d2, t3._pendingPullIntos = new D2(), e2._readableStreamController = t3;
        const m2 = r2();
        g2(T2(m2), () => (t3._started = true, Fe(t3), null), (R2) => (K(t3, R2), null));
      }
      n$2(To, "SetUpReadableByteStreamController");
      function ca(e2, t3, r2) {
        const s2 = Object.create(te.prototype);
        let u2, c2, d2;
        t3.start !== void 0 ? u2 = n$2(() => t3.start(s2), "startAlgorithm") : u2 = n$2(() => {
        }, "startAlgorithm"), t3.pull !== void 0 ? c2 = n$2(() => t3.pull(s2), "pullAlgorithm") : c2 = n$2(() => T2(void 0), "pullAlgorithm"), t3.cancel !== void 0 ? d2 = n$2((R2) => t3.cancel(R2), "cancelAlgorithm") : d2 = n$2(() => T2(void 0), "cancelAlgorithm");
        const m2 = t3.autoAllocateChunkSize;
        if (m2 === 0) throw new TypeError("autoAllocateChunkSize must be greater than 0");
        To(e2, s2, u2, c2, d2, r2, m2);
      }
      n$2(ca, "SetUpReadableByteStreamControllerFromUnderlyingSource");
      function da(e2, t3, r2) {
        e2._associatedReadableByteStreamController = t3, e2._view = r2;
      }
      n$2(da, "SetUpReadableStreamBYOBRequest");
      function Zr(e2) {
        return new TypeError(`ReadableStreamBYOBRequest.prototype.${e2} can only be used on a ReadableStreamBYOBRequest`);
      }
      n$2(Zr, "byobRequestBrandCheckException");
      function Rt(e2) {
        return new TypeError(`ReadableByteStreamController.prototype.${e2} can only be used on a ReadableByteStreamController`);
      }
      n$2(Rt, "byteStreamControllerBrandCheckException");
      function ha(e2, t3) {
        ue(e2, t3);
        const r2 = e2?.mode;
        return { mode: r2 === void 0 ? void 0 : pa(r2, `${t3} has member 'mode' that`) };
      }
      n$2(ha, "convertReaderOptions");
      function pa(e2, t3) {
        if (e2 = `${e2}`, e2 !== "byob") throw new TypeError(`${t3} '${e2}' is not a valid enumeration value for ReadableStreamReaderMode`);
        return e2;
      }
      n$2(pa, "convertReadableStreamReaderMode");
      function ba(e2, t3) {
        var r2;
        ue(e2, t3);
        const s2 = (r2 = e2?.min) !== null && r2 !== void 0 ? r2 : 1;
        return { min: Fr(s2, `${t3} has member 'min' that`) };
      }
      n$2(ba, "convertByobReadOptions");
      function Co(e2) {
        return new ce(e2);
      }
      n$2(Co, "AcquireReadableStreamBYOBReader");
      function Po(e2, t3) {
        e2._reader._readIntoRequests.push(t3);
      }
      n$2(Po, "ReadableStreamAddReadIntoRequest");
      function ma(e2, t3, r2) {
        const u2 = e2._reader._readIntoRequests.shift();
        r2 ? u2._closeSteps(t3) : u2._chunkSteps(t3);
      }
      n$2(ma, "ReadableStreamFulfillReadIntoRequest");
      function vo(e2) {
        return e2._reader._readIntoRequests.length;
      }
      n$2(vo, "ReadableStreamGetNumReadIntoRequests");
      function Kr(e2) {
        const t3 = e2._reader;
        return !(t3 === void 0 || !je(t3));
      }
      n$2(Kr, "ReadableStreamHasBYOBReader");
      const Sn = class Sn {
        constructor(t3) {
          if (Se(t3, 1, "ReadableStreamBYOBReader"), jr(t3, "First parameter"), qe(t3)) throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          if (!Ie(t3._readableStreamController)) throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
          Yn(this, t3), this._readIntoRequests = new D2();
        }
        get closed() {
          return je(this) ? this._closedPromise : b2(Yt("closed"));
        }
        cancel(t3 = void 0) {
          return je(this) ? this._ownerReadableStream === void 0 ? b2(Lt("cancel")) : Wr(this, t3) : b2(Yt("cancel"));
        }
        read(t3, r2 = {}) {
          if (!je(this)) return b2(Yt("read"));
          if (!ArrayBuffer.isView(t3)) return b2(new TypeError("view must be an array buffer view"));
          if (t3.byteLength === 0) return b2(new TypeError("view must have non-zero byteLength"));
          if (t3.buffer.byteLength === 0) return b2(new TypeError("view's buffer must have non-zero byteLength"));
          if (Ae(t3.buffer)) return b2(new TypeError("view's buffer has been detached"));
          let s2;
          try {
            s2 = ba(r2, "options");
          } catch (y2) {
            return b2(y2);
          }
          const u2 = s2.min;
          if (u2 === 0) return b2(new TypeError("options.min must be greater than 0"));
          if (oa(t3)) {
            if (u2 > t3.byteLength) return b2(new RangeError("options.min must be less than or equal to view's byteLength"));
          } else if (u2 > t3.length) return b2(new RangeError("options.min must be less than or equal to view's length"));
          if (this._ownerReadableStream === void 0) return b2(Lt("read from"));
          let c2, d2;
          const m2 = A2((y2, C2) => {
            c2 = y2, d2 = C2;
          });
          return Eo(this, t3, u2, { _chunkSteps: n$2((y2) => c2({ value: y2, done: false }), "_chunkSteps"), _closeSteps: n$2((y2) => c2({ value: y2, done: true }), "_closeSteps"), _errorSteps: n$2((y2) => d2(y2), "_errorSteps") }), m2;
        }
        releaseLock() {
          if (!je(this)) throw Yt("releaseLock");
          this._ownerReadableStream !== void 0 && ya(this);
        }
      };
      n$2(Sn, "ReadableStreamBYOBReader");
      let ce = Sn;
      Object.defineProperties(ce.prototype, { cancel: { enumerable: true }, read: { enumerable: true }, releaseLock: { enumerable: true }, closed: { enumerable: true } }), h2(ce.prototype.cancel, "cancel"), h2(ce.prototype.read, "read"), h2(ce.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ce.prototype, Symbol.toStringTag, { value: "ReadableStreamBYOBReader", configurable: true });
      function je(e2) {
        return !l2(e2) || !Object.prototype.hasOwnProperty.call(e2, "_readIntoRequests") ? false : e2 instanceof ce;
      }
      n$2(je, "IsReadableStreamBYOBReader");
      function Eo(e2, t3, r2, s2) {
        const u2 = e2._ownerReadableStream;
        u2._disturbed = true, u2._state === "errored" ? s2._errorSteps(u2._storedError) : sa(u2._readableStreamController, t3, r2, s2);
      }
      n$2(Eo, "ReadableStreamBYOBReaderRead");
      function ya(e2) {
        _e(e2);
        const t3 = new TypeError("Reader was released");
        Ao(e2, t3);
      }
      n$2(ya, "ReadableStreamBYOBReaderRelease");
      function Ao(e2, t3) {
        const r2 = e2._readIntoRequests;
        e2._readIntoRequests = new D2(), r2.forEach((s2) => {
          s2._errorSteps(t3);
        });
      }
      n$2(Ao, "ReadableStreamBYOBReaderErrorReadIntoRequests");
      function Yt(e2) {
        return new TypeError(`ReadableStreamBYOBReader.prototype.${e2} can only be used on a ReadableStreamBYOBReader`);
      }
      n$2(Yt, "byobReaderBrandCheckException");
      function Tt(e2, t3) {
        const { highWaterMark: r2 } = e2;
        if (r2 === void 0) return t3;
        if (ao(r2) || r2 < 0) throw new RangeError("Invalid highWaterMark");
        return r2;
      }
      n$2(Tt, "ExtractHighWaterMark");
      function Gt(e2) {
        const { size: t3 } = e2;
        return t3 || (() => 1);
      }
      n$2(Gt, "ExtractSizeAlgorithm");
      function Zt(e2, t3) {
        ue(e2, t3);
        const r2 = e2?.highWaterMark, s2 = e2?.size;
        return { highWaterMark: r2 === void 0 ? void 0 : Ir(r2), size: s2 === void 0 ? void 0 : ga(s2, `${t3} has member 'size' that`) };
      }
      n$2(Zt, "convertQueuingStrategy");
      function ga(e2, t3) {
        return Z(e2, t3), (r2) => Ir(e2(r2));
      }
      n$2(ga, "convertQueuingStrategySize");
      function _a(e2, t3) {
        ue(e2, t3);
        const r2 = e2?.abort, s2 = e2?.close, u2 = e2?.start, c2 = e2?.type, d2 = e2?.write;
        return { abort: r2 === void 0 ? void 0 : Sa(r2, e2, `${t3} has member 'abort' that`), close: s2 === void 0 ? void 0 : wa(s2, e2, `${t3} has member 'close' that`), start: u2 === void 0 ? void 0 : Ra(u2, e2, `${t3} has member 'start' that`), write: d2 === void 0 ? void 0 : Ta(d2, e2, `${t3} has member 'write' that`), type: c2 };
      }
      n$2(_a, "convertUnderlyingSink");
      function Sa(e2, t3, r2) {
        return Z(e2, r2), (s2) => j2(e2, t3, [s2]);
      }
      n$2(Sa, "convertUnderlyingSinkAbortCallback");
      function wa(e2, t3, r2) {
        return Z(e2, r2), () => j2(e2, t3, []);
      }
      n$2(wa, "convertUnderlyingSinkCloseCallback");
      function Ra(e2, t3, r2) {
        return Z(e2, r2), (s2) => z(e2, t3, [s2]);
      }
      n$2(Ra, "convertUnderlyingSinkStartCallback");
      function Ta(e2, t3, r2) {
        return Z(e2, r2), (s2, u2) => j2(e2, t3, [s2, u2]);
      }
      n$2(Ta, "convertUnderlyingSinkWriteCallback");
      function Bo(e2, t3) {
        if (!Ge(e2)) throw new TypeError(`${t3} is not a WritableStream.`);
      }
      n$2(Bo, "assertWritableStream");
      function Ca(e2) {
        if (typeof e2 != "object" || e2 === null) return false;
        try {
          return typeof e2.aborted == "boolean";
        } catch {
          return false;
        }
      }
      n$2(Ca, "isAbortSignal");
      const Pa = typeof AbortController == "function";
      function va() {
        if (Pa) return new AbortController();
      }
      n$2(va, "createAbortController");
      const wn = class wn {
        constructor(t3 = {}, r2 = {}) {
          t3 === void 0 ? t3 = null : Jn(t3, "First parameter");
          const s2 = Zt(r2, "Second parameter"), u2 = _a(t3, "First parameter");
          if (Wo(this), u2.type !== void 0) throw new RangeError("Invalid type is specified");
          const d2 = Gt(s2), m2 = Tt(s2, 1);
          Da(this, u2, m2, d2);
        }
        get locked() {
          if (!Ge(this)) throw tr("locked");
          return Ze(this);
        }
        abort(t3 = void 0) {
          return Ge(this) ? Ze(this) ? b2(new TypeError("Cannot abort a stream that already has a writer")) : Kt(this, t3) : b2(tr("abort"));
        }
        close() {
          return Ge(this) ? Ze(this) ? b2(new TypeError("Cannot close a stream that already has a writer")) : he(this) ? b2(new TypeError("Cannot close an already-closing stream")) : qo(this) : b2(tr("close"));
        }
        getWriter() {
          if (!Ge(this)) throw tr("getWriter");
          return ko(this);
        }
      };
      n$2(wn, "WritableStream");
      let de = wn;
      Object.defineProperties(de.prototype, { abort: { enumerable: true }, close: { enumerable: true }, getWriter: { enumerable: true }, locked: { enumerable: true } }), h2(de.prototype.abort, "abort"), h2(de.prototype.close, "close"), h2(de.prototype.getWriter, "getWriter"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(de.prototype, Symbol.toStringTag, { value: "WritableStream", configurable: true });
      function ko(e2) {
        return new re(e2);
      }
      n$2(ko, "AcquireWritableStreamDefaultWriter");
      function Ea(e2, t3, r2, s2, u2 = 1, c2 = () => 1) {
        const d2 = Object.create(de.prototype);
        Wo(d2);
        const m2 = Object.create(ke.prototype);
        return Lo(d2, m2, e2, t3, r2, s2, u2, c2), d2;
      }
      n$2(Ea, "CreateWritableStream");
      function Wo(e2) {
        e2._state = "writable", e2._storedError = void 0, e2._writer = void 0, e2._writableStreamController = void 0, e2._writeRequests = new D2(), e2._inFlightWriteRequest = void 0, e2._closeRequest = void 0, e2._inFlightCloseRequest = void 0, e2._pendingAbortRequest = void 0, e2._backpressure = false;
      }
      n$2(Wo, "InitializeWritableStream");
      function Ge(e2) {
        return !l2(e2) || !Object.prototype.hasOwnProperty.call(e2, "_writableStreamController") ? false : e2 instanceof de;
      }
      n$2(Ge, "IsWritableStream");
      function Ze(e2) {
        return e2._writer !== void 0;
      }
      n$2(Ze, "IsWritableStreamLocked");
      function Kt(e2, t3) {
        var r2;
        if (e2._state === "closed" || e2._state === "errored") return T2(void 0);
        e2._writableStreamController._abortReason = t3, (r2 = e2._writableStreamController._abortController) === null || r2 === void 0 || r2.abort(t3);
        const s2 = e2._state;
        if (s2 === "closed" || s2 === "errored") return T2(void 0);
        if (e2._pendingAbortRequest !== void 0) return e2._pendingAbortRequest._promise;
        let u2 = false;
        s2 === "erroring" && (u2 = true, t3 = void 0);
        const c2 = A2((d2, m2) => {
          e2._pendingAbortRequest = { _promise: void 0, _resolve: d2, _reject: m2, _reason: t3, _wasAlreadyErroring: u2 };
        });
        return e2._pendingAbortRequest._promise = c2, u2 || Xr(e2, t3), c2;
      }
      n$2(Kt, "WritableStreamAbort");
      function qo(e2) {
        const t3 = e2._state;
        if (t3 === "closed" || t3 === "errored") return b2(new TypeError(`The stream (in ${t3} state) is not in the writable state and cannot be closed`));
        const r2 = A2((u2, c2) => {
          const d2 = { _resolve: u2, _reject: c2 };
          e2._closeRequest = d2;
        }), s2 = e2._writer;
        return s2 !== void 0 && e2._backpressure && t3 === "writable" && ln(s2), Ma(e2._writableStreamController), r2;
      }
      n$2(qo, "WritableStreamClose");
      function Aa(e2) {
        return A2((r2, s2) => {
          const u2 = { _resolve: r2, _reject: s2 };
          e2._writeRequests.push(u2);
        });
      }
      n$2(Aa, "WritableStreamAddWriteRequest");
      function Jr(e2, t3) {
        if (e2._state === "writable") {
          Xr(e2, t3);
          return;
        }
        en(e2);
      }
      n$2(Jr, "WritableStreamDealWithRejection");
      function Xr(e2, t3) {
        const r2 = e2._writableStreamController;
        e2._state = "erroring", e2._storedError = t3;
        const s2 = e2._writer;
        s2 !== void 0 && zo(s2, t3), !Oa(e2) && r2._started && en(e2);
      }
      n$2(Xr, "WritableStreamStartErroring");
      function en(e2) {
        e2._state = "errored", e2._writableStreamController[Qn]();
        const t3 = e2._storedError;
        if (e2._writeRequests.forEach((u2) => {
          u2._reject(t3);
        }), e2._writeRequests = new D2(), e2._pendingAbortRequest === void 0) {
          Jt(e2);
          return;
        }
        const r2 = e2._pendingAbortRequest;
        if (e2._pendingAbortRequest = void 0, r2._wasAlreadyErroring) {
          r2._reject(t3), Jt(e2);
          return;
        }
        const s2 = e2._writableStreamController[jt](r2._reason);
        g2(s2, () => (r2._resolve(), Jt(e2), null), (u2) => (r2._reject(u2), Jt(e2), null));
      }
      n$2(en, "WritableStreamFinishErroring");
      function Ba(e2) {
        e2._inFlightWriteRequest._resolve(void 0), e2._inFlightWriteRequest = void 0;
      }
      n$2(Ba, "WritableStreamFinishInFlightWrite");
      function ka(e2, t3) {
        e2._inFlightWriteRequest._reject(t3), e2._inFlightWriteRequest = void 0, Jr(e2, t3);
      }
      n$2(ka, "WritableStreamFinishInFlightWriteWithError");
      function Wa(e2) {
        e2._inFlightCloseRequest._resolve(void 0), e2._inFlightCloseRequest = void 0, e2._state === "erroring" && (e2._storedError = void 0, e2._pendingAbortRequest !== void 0 && (e2._pendingAbortRequest._resolve(), e2._pendingAbortRequest = void 0)), e2._state = "closed";
        const r2 = e2._writer;
        r2 !== void 0 && Uo(r2);
      }
      n$2(Wa, "WritableStreamFinishInFlightClose");
      function qa(e2, t3) {
        e2._inFlightCloseRequest._reject(t3), e2._inFlightCloseRequest = void 0, e2._pendingAbortRequest !== void 0 && (e2._pendingAbortRequest._reject(t3), e2._pendingAbortRequest = void 0), Jr(e2, t3);
      }
      n$2(qa, "WritableStreamFinishInFlightCloseWithError");
      function he(e2) {
        return !(e2._closeRequest === void 0 && e2._inFlightCloseRequest === void 0);
      }
      n$2(he, "WritableStreamCloseQueuedOrInFlight");
      function Oa(e2) {
        return !(e2._inFlightWriteRequest === void 0 && e2._inFlightCloseRequest === void 0);
      }
      n$2(Oa, "WritableStreamHasOperationMarkedInFlight");
      function za(e2) {
        e2._inFlightCloseRequest = e2._closeRequest, e2._closeRequest = void 0;
      }
      n$2(za, "WritableStreamMarkCloseRequestInFlight");
      function Ia(e2) {
        e2._inFlightWriteRequest = e2._writeRequests.shift();
      }
      n$2(Ia, "WritableStreamMarkFirstWriteRequestInFlight");
      function Jt(e2) {
        e2._closeRequest !== void 0 && (e2._closeRequest._reject(e2._storedError), e2._closeRequest = void 0);
        const t3 = e2._writer;
        t3 !== void 0 && an(t3, e2._storedError);
      }
      n$2(Jt, "WritableStreamRejectCloseAndClosedPromiseIfNeeded");
      function tn(e2, t3) {
        const r2 = e2._writer;
        r2 !== void 0 && t3 !== e2._backpressure && (t3 ? Ya(r2) : ln(r2)), e2._backpressure = t3;
      }
      n$2(tn, "WritableStreamUpdateBackpressure");
      const Rn = class Rn {
        constructor(t3) {
          if (Se(t3, 1, "WritableStreamDefaultWriter"), Bo(t3, "First parameter"), Ze(t3)) throw new TypeError("This stream has already been locked for exclusive writing by another writer");
          this._ownerWritableStream = t3, t3._writer = this;
          const r2 = t3._state;
          if (r2 === "writable") !he(t3) && t3._backpressure ? nr(this) : xo(this), rr(this);
          else if (r2 === "erroring") sn(this, t3._storedError), rr(this);
          else if (r2 === "closed") xo(this), Va(this);
          else {
            const s2 = t3._storedError;
            sn(this, s2), Mo(this, s2);
          }
        }
        get closed() {
          return Le(this) ? this._closedPromise : b2($e("closed"));
        }
        get desiredSize() {
          if (!Le(this)) throw $e("desiredSize");
          if (this._ownerWritableStream === void 0) throw Pt("desiredSize");
          return $a(this);
        }
        get ready() {
          return Le(this) ? this._readyPromise : b2($e("ready"));
        }
        abort(t3 = void 0) {
          return Le(this) ? this._ownerWritableStream === void 0 ? b2(Pt("abort")) : Fa(this, t3) : b2($e("abort"));
        }
        close() {
          if (!Le(this)) return b2($e("close"));
          const t3 = this._ownerWritableStream;
          return t3 === void 0 ? b2(Pt("close")) : he(t3) ? b2(new TypeError("Cannot close an already-closing stream")) : Oo(this);
        }
        releaseLock() {
          if (!Le(this)) throw $e("releaseLock");
          this._ownerWritableStream !== void 0 && Io(this);
        }
        write(t3 = void 0) {
          return Le(this) ? this._ownerWritableStream === void 0 ? b2(Pt("write to")) : Fo(this, t3) : b2($e("write"));
        }
      };
      n$2(Rn, "WritableStreamDefaultWriter");
      let re = Rn;
      Object.defineProperties(re.prototype, { abort: { enumerable: true }, close: { enumerable: true }, releaseLock: { enumerable: true }, write: { enumerable: true }, closed: { enumerable: true }, desiredSize: { enumerable: true }, ready: { enumerable: true } }), h2(re.prototype.abort, "abort"), h2(re.prototype.close, "close"), h2(re.prototype.releaseLock, "releaseLock"), h2(re.prototype.write, "write"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(re.prototype, Symbol.toStringTag, { value: "WritableStreamDefaultWriter", configurable: true });
      function Le(e2) {
        return !l2(e2) || !Object.prototype.hasOwnProperty.call(e2, "_ownerWritableStream") ? false : e2 instanceof re;
      }
      n$2(Le, "IsWritableStreamDefaultWriter");
      function Fa(e2, t3) {
        const r2 = e2._ownerWritableStream;
        return Kt(r2, t3);
      }
      n$2(Fa, "WritableStreamDefaultWriterAbort");
      function Oo(e2) {
        const t3 = e2._ownerWritableStream;
        return qo(t3);
      }
      n$2(Oo, "WritableStreamDefaultWriterClose");
      function ja(e2) {
        const t3 = e2._ownerWritableStream, r2 = t3._state;
        return he(t3) || r2 === "closed" ? T2(void 0) : r2 === "errored" ? b2(t3._storedError) : Oo(e2);
      }
      n$2(ja, "WritableStreamDefaultWriterCloseWithErrorPropagation");
      function La(e2, t3) {
        e2._closedPromiseState === "pending" ? an(e2, t3) : Qa(e2, t3);
      }
      n$2(La, "WritableStreamDefaultWriterEnsureClosedPromiseRejected");
      function zo(e2, t3) {
        e2._readyPromiseState === "pending" ? No(e2, t3) : Ga(e2, t3);
      }
      n$2(zo, "WritableStreamDefaultWriterEnsureReadyPromiseRejected");
      function $a(e2) {
        const t3 = e2._ownerWritableStream, r2 = t3._state;
        return r2 === "errored" || r2 === "erroring" ? null : r2 === "closed" ? 0 : $o(t3._writableStreamController);
      }
      n$2($a, "WritableStreamDefaultWriterGetDesiredSize");
      function Io(e2) {
        const t3 = e2._ownerWritableStream, r2 = new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");
        zo(e2, r2), La(e2, r2), t3._writer = void 0, e2._ownerWritableStream = void 0;
      }
      n$2(Io, "WritableStreamDefaultWriterRelease");
      function Fo(e2, t3) {
        const r2 = e2._ownerWritableStream, s2 = r2._writableStreamController, u2 = Ua(s2, t3);
        if (r2 !== e2._ownerWritableStream) return b2(Pt("write to"));
        const c2 = r2._state;
        if (c2 === "errored") return b2(r2._storedError);
        if (he(r2) || c2 === "closed") return b2(new TypeError("The stream is closing or closed and cannot be written to"));
        if (c2 === "erroring") return b2(r2._storedError);
        const d2 = Aa(r2);
        return xa(s2, t3, u2), d2;
      }
      n$2(Fo, "WritableStreamDefaultWriterWrite");
      const jo = {}, Tn = class Tn {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get abortReason() {
          if (!rn(this)) throw on("abortReason");
          return this._abortReason;
        }
        get signal() {
          if (!rn(this)) throw on("signal");
          if (this._abortController === void 0) throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
          return this._abortController.signal;
        }
        error(t3 = void 0) {
          if (!rn(this)) throw on("error");
          this._controlledWritableStream._state === "writable" && Do(this, t3);
        }
        [jt](t3) {
          const r2 = this._abortAlgorithm(t3);
          return Xt(this), r2;
        }
        [Qn]() {
          Be(this);
        }
      };
      n$2(Tn, "WritableStreamDefaultController");
      let ke = Tn;
      Object.defineProperties(ke.prototype, { abortReason: { enumerable: true }, signal: { enumerable: true }, error: { enumerable: true } }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ke.prototype, Symbol.toStringTag, { value: "WritableStreamDefaultController", configurable: true });
      function rn(e2) {
        return !l2(e2) || !Object.prototype.hasOwnProperty.call(e2, "_controlledWritableStream") ? false : e2 instanceof ke;
      }
      n$2(rn, "IsWritableStreamDefaultController");
      function Lo(e2, t3, r2, s2, u2, c2, d2, m2) {
        t3._controlledWritableStream = e2, e2._writableStreamController = t3, t3._queue = void 0, t3._queueTotalSize = void 0, Be(t3), t3._abortReason = void 0, t3._abortController = va(), t3._started = false, t3._strategySizeAlgorithm = m2, t3._strategyHWM = d2, t3._writeAlgorithm = s2, t3._closeAlgorithm = u2, t3._abortAlgorithm = c2;
        const R2 = nn(t3);
        tn(e2, R2);
        const y2 = r2(), C2 = T2(y2);
        g2(C2, () => (t3._started = true, er(t3), null), (P2) => (t3._started = true, Jr(e2, P2), null));
      }
      n$2(Lo, "SetUpWritableStreamDefaultController");
      function Da(e2, t3, r2, s2) {
        const u2 = Object.create(ke.prototype);
        let c2, d2, m2, R2;
        t3.start !== void 0 ? c2 = n$2(() => t3.start(u2), "startAlgorithm") : c2 = n$2(() => {
        }, "startAlgorithm"), t3.write !== void 0 ? d2 = n$2((y2) => t3.write(y2, u2), "writeAlgorithm") : d2 = n$2(() => T2(void 0), "writeAlgorithm"), t3.close !== void 0 ? m2 = n$2(() => t3.close(), "closeAlgorithm") : m2 = n$2(() => T2(void 0), "closeAlgorithm"), t3.abort !== void 0 ? R2 = n$2((y2) => t3.abort(y2), "abortAlgorithm") : R2 = n$2(() => T2(void 0), "abortAlgorithm"), Lo(e2, u2, c2, d2, m2, R2, r2, s2);
      }
      n$2(Da, "SetUpWritableStreamDefaultControllerFromUnderlyingSink");
      function Xt(e2) {
        e2._writeAlgorithm = void 0, e2._closeAlgorithm = void 0, e2._abortAlgorithm = void 0, e2._strategySizeAlgorithm = void 0;
      }
      n$2(Xt, "WritableStreamDefaultControllerClearAlgorithms");
      function Ma(e2) {
        Nr(e2, jo, 0), er(e2);
      }
      n$2(Ma, "WritableStreamDefaultControllerClose");
      function Ua(e2, t3) {
        try {
          return e2._strategySizeAlgorithm(t3);
        } catch (r2) {
          return Ct(e2, r2), 1;
        }
      }
      n$2(Ua, "WritableStreamDefaultControllerGetChunkSize");
      function $o(e2) {
        return e2._strategyHWM - e2._queueTotalSize;
      }
      n$2($o, "WritableStreamDefaultControllerGetDesiredSize");
      function xa(e2, t3, r2) {
        try {
          Nr(e2, t3, r2);
        } catch (u2) {
          Ct(e2, u2);
          return;
        }
        const s2 = e2._controlledWritableStream;
        if (!he(s2) && s2._state === "writable") {
          const u2 = nn(e2);
          tn(s2, u2);
        }
        er(e2);
      }
      n$2(xa, "WritableStreamDefaultControllerWrite");
      function er(e2) {
        const t3 = e2._controlledWritableStream;
        if (!e2._started || t3._inFlightWriteRequest !== void 0) return;
        if (t3._state === "erroring") {
          en(t3);
          return;
        }
        if (e2._queue.length === 0) return;
        const s2 = na(e2);
        s2 === jo ? Na(e2) : Ha(e2, s2);
      }
      n$2(er, "WritableStreamDefaultControllerAdvanceQueueIfNeeded");
      function Ct(e2, t3) {
        e2._controlledWritableStream._state === "writable" && Do(e2, t3);
      }
      n$2(Ct, "WritableStreamDefaultControllerErrorIfNeeded");
      function Na(e2) {
        const t3 = e2._controlledWritableStream;
        za(t3), xr(e2);
        const r2 = e2._closeAlgorithm();
        Xt(e2), g2(r2, () => (Wa(t3), null), (s2) => (qa(t3, s2), null));
      }
      n$2(Na, "WritableStreamDefaultControllerProcessClose");
      function Ha(e2, t3) {
        const r2 = e2._controlledWritableStream;
        Ia(r2);
        const s2 = e2._writeAlgorithm(t3);
        g2(s2, () => {
          Ba(r2);
          const u2 = r2._state;
          if (xr(e2), !he(r2) && u2 === "writable") {
            const c2 = nn(e2);
            tn(r2, c2);
          }
          return er(e2), null;
        }, (u2) => (r2._state === "writable" && Xt(e2), ka(r2, u2), null));
      }
      n$2(Ha, "WritableStreamDefaultControllerProcessWrite");
      function nn(e2) {
        return $o(e2) <= 0;
      }
      n$2(nn, "WritableStreamDefaultControllerGetBackpressure");
      function Do(e2, t3) {
        const r2 = e2._controlledWritableStream;
        Xt(e2), Xr(r2, t3);
      }
      n$2(Do, "WritableStreamDefaultControllerError");
      function tr(e2) {
        return new TypeError(`WritableStream.prototype.${e2} can only be used on a WritableStream`);
      }
      n$2(tr, "streamBrandCheckException$2");
      function on(e2) {
        return new TypeError(`WritableStreamDefaultController.prototype.${e2} can only be used on a WritableStreamDefaultController`);
      }
      n$2(on, "defaultControllerBrandCheckException$2");
      function $e(e2) {
        return new TypeError(`WritableStreamDefaultWriter.prototype.${e2} can only be used on a WritableStreamDefaultWriter`);
      }
      n$2($e, "defaultWriterBrandCheckException");
      function Pt(e2) {
        return new TypeError("Cannot " + e2 + " a stream using a released writer");
      }
      n$2(Pt, "defaultWriterLockException");
      function rr(e2) {
        e2._closedPromise = A2((t3, r2) => {
          e2._closedPromise_resolve = t3, e2._closedPromise_reject = r2, e2._closedPromiseState = "pending";
        });
      }
      n$2(rr, "defaultWriterClosedPromiseInitialize");
      function Mo(e2, t3) {
        rr(e2), an(e2, t3);
      }
      n$2(Mo, "defaultWriterClosedPromiseInitializeAsRejected");
      function Va(e2) {
        rr(e2), Uo(e2);
      }
      n$2(Va, "defaultWriterClosedPromiseInitializeAsResolved");
      function an(e2, t3) {
        e2._closedPromise_reject !== void 0 && (Q(e2._closedPromise), e2._closedPromise_reject(t3), e2._closedPromise_resolve = void 0, e2._closedPromise_reject = void 0, e2._closedPromiseState = "rejected");
      }
      n$2(an, "defaultWriterClosedPromiseReject");
      function Qa(e2, t3) {
        Mo(e2, t3);
      }
      n$2(Qa, "defaultWriterClosedPromiseResetToRejected");
      function Uo(e2) {
        e2._closedPromise_resolve !== void 0 && (e2._closedPromise_resolve(void 0), e2._closedPromise_resolve = void 0, e2._closedPromise_reject = void 0, e2._closedPromiseState = "resolved");
      }
      n$2(Uo, "defaultWriterClosedPromiseResolve");
      function nr(e2) {
        e2._readyPromise = A2((t3, r2) => {
          e2._readyPromise_resolve = t3, e2._readyPromise_reject = r2;
        }), e2._readyPromiseState = "pending";
      }
      n$2(nr, "defaultWriterReadyPromiseInitialize");
      function sn(e2, t3) {
        nr(e2), No(e2, t3);
      }
      n$2(sn, "defaultWriterReadyPromiseInitializeAsRejected");
      function xo(e2) {
        nr(e2), ln(e2);
      }
      n$2(xo, "defaultWriterReadyPromiseInitializeAsResolved");
      function No(e2, t3) {
        e2._readyPromise_reject !== void 0 && (Q(e2._readyPromise), e2._readyPromise_reject(t3), e2._readyPromise_resolve = void 0, e2._readyPromise_reject = void 0, e2._readyPromiseState = "rejected");
      }
      n$2(No, "defaultWriterReadyPromiseReject");
      function Ya(e2) {
        nr(e2);
      }
      n$2(Ya, "defaultWriterReadyPromiseReset");
      function Ga(e2, t3) {
        sn(e2, t3);
      }
      n$2(Ga, "defaultWriterReadyPromiseResetToRejected");
      function ln(e2) {
        e2._readyPromise_resolve !== void 0 && (e2._readyPromise_resolve(void 0), e2._readyPromise_resolve = void 0, e2._readyPromise_reject = void 0, e2._readyPromiseState = "fulfilled");
      }
      n$2(ln, "defaultWriterReadyPromiseResolve");
      function Za() {
        if (typeof globalThis < "u") return globalThis;
        if (typeof self < "u") return self;
        if (typeof n$3 < "u") return n$3;
      }
      n$2(Za, "getGlobals");
      const un = Za();
      function Ka(e2) {
        if (!(typeof e2 == "function" || typeof e2 == "object") || e2.name !== "DOMException") return false;
        try {
          return new e2(), true;
        } catch {
          return false;
        }
      }
      n$2(Ka, "isDOMExceptionConstructor");
      function Ja() {
        const e2 = un?.DOMException;
        return Ka(e2) ? e2 : void 0;
      }
      n$2(Ja, "getFromGlobal");
      function Xa() {
        const e2 = n$2(function(r2, s2) {
          this.message = r2 || "", this.name = s2 || "Error", Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
        }, "DOMException");
        return h2(e2, "DOMException"), e2.prototype = Object.create(Error.prototype), Object.defineProperty(e2.prototype, "constructor", { value: e2, writable: true, configurable: true }), e2;
      }
      n$2(Xa, "createPolyfill");
      const es = Ja() || Xa();
      function Ho(e2, t3, r2, s2, u2, c2) {
        const d2 = Qe(e2), m2 = ko(t3);
        e2._disturbed = true;
        let R2 = false, y2 = T2(void 0);
        return A2((C2, P2) => {
          let B;
          if (c2 !== void 0) {
            if (B = n$2(() => {
              const _2 = c2.reason !== void 0 ? c2.reason : new es("Aborted", "AbortError"), E2 = [];
              s2 || E2.push(() => t3._state === "writable" ? Kt(t3, _2) : T2(void 0)), u2 || E2.push(() => e2._state === "readable" ? ie(e2, _2) : T2(void 0)), N2(() => Promise.all(E2.map((k2) => k2())), true, _2);
            }, "abortAlgorithm"), c2.aborted) {
              B();
              return;
            }
            c2.addEventListener("abort", B);
          }
          function ae() {
            return A2((_2, E2) => {
              function k2(Y) {
                Y ? _2() : q(nt(), k2, E2);
              }
              n$2(k2, "next"), k2(false);
            });
          }
          n$2(ae, "pipeLoop");
          function nt() {
            return R2 ? T2(true) : q(m2._readyPromise, () => A2((_2, E2) => {
              _t(d2, { _chunkSteps: n$2((k2) => {
                y2 = q(Fo(m2, k2), void 0, f2), _2(false);
              }, "_chunkSteps"), _closeSteps: n$2(() => _2(true), "_closeSteps"), _errorSteps: E2 });
            }));
          }
          if (n$2(nt, "pipeStep"), Te(e2, d2._closedPromise, (_2) => (s2 ? J(true, _2) : N2(() => Kt(t3, _2), true, _2), null)), Te(t3, m2._closedPromise, (_2) => (u2 ? J(true, _2) : N2(() => ie(e2, _2), true, _2), null)), x2(e2, d2._closedPromise, () => (r2 ? J() : N2(() => ja(m2)), null)), he(t3) || t3._state === "closed") {
            const _2 = new TypeError("the destination writable stream closed before all data could be piped to it");
            u2 ? J(true, _2) : N2(() => ie(e2, _2), true, _2);
          }
          Q(ae());
          function Oe() {
            const _2 = y2;
            return q(y2, () => _2 !== y2 ? Oe() : void 0);
          }
          n$2(Oe, "waitForWritesToFinish");
          function Te(_2, E2, k2) {
            _2._state === "errored" ? k2(_2._storedError) : I2(E2, k2);
          }
          n$2(Te, "isOrBecomesErrored");
          function x2(_2, E2, k2) {
            _2._state === "closed" ? k2() : V(E2, k2);
          }
          n$2(x2, "isOrBecomesClosed");
          function N2(_2, E2, k2) {
            if (R2) return;
            R2 = true, t3._state === "writable" && !he(t3) ? V(Oe(), Y) : Y();
            function Y() {
              return g2(_2(), () => Ce(E2, k2), (ot) => Ce(true, ot)), null;
            }
            n$2(Y, "doTheRest");
          }
          n$2(N2, "shutdownWithAction");
          function J(_2, E2) {
            R2 || (R2 = true, t3._state === "writable" && !he(t3) ? V(Oe(), () => Ce(_2, E2)) : Ce(_2, E2));
          }
          n$2(J, "shutdown");
          function Ce(_2, E2) {
            return Io(m2), _e(d2), c2 !== void 0 && c2.removeEventListener("abort", B), _2 ? P2(E2) : C2(void 0), null;
          }
          n$2(Ce, "finalize");
        });
      }
      n$2(Ho, "ReadableStreamPipeTo");
      const Cn = class Cn {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get desiredSize() {
          if (!or(this)) throw ar("desiredSize");
          return fn(this);
        }
        close() {
          if (!or(this)) throw ar("close");
          if (!Je(this)) throw new TypeError("The stream is not in a state that permits close");
          De(this);
        }
        enqueue(t3 = void 0) {
          if (!or(this)) throw ar("enqueue");
          if (!Je(this)) throw new TypeError("The stream is not in a state that permits enqueue");
          return Ke(this, t3);
        }
        error(t3 = void 0) {
          if (!or(this)) throw ar("error");
          oe(this, t3);
        }
        [Ar](t3) {
          Be(this);
          const r2 = this._cancelAlgorithm(t3);
          return ir(this), r2;
        }
        [Br](t3) {
          const r2 = this._controlledReadableStream;
          if (this._queue.length > 0) {
            const s2 = xr(this);
            this._closeRequested && this._queue.length === 0 ? (ir(this), At(r2)) : vt(this), t3._chunkSteps(s2);
          } else eo(r2, t3), vt(this);
        }
        [kr]() {
        }
      };
      n$2(Cn, "ReadableStreamDefaultController");
      let ne = Cn;
      Object.defineProperties(ne.prototype, { close: { enumerable: true }, enqueue: { enumerable: true }, error: { enumerable: true }, desiredSize: { enumerable: true } }), h2(ne.prototype.close, "close"), h2(ne.prototype.enqueue, "enqueue"), h2(ne.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ne.prototype, Symbol.toStringTag, { value: "ReadableStreamDefaultController", configurable: true });
      function or(e2) {
        return !l2(e2) || !Object.prototype.hasOwnProperty.call(e2, "_controlledReadableStream") ? false : e2 instanceof ne;
      }
      n$2(or, "IsReadableStreamDefaultController");
      function vt(e2) {
        if (!Vo(e2)) return;
        if (e2._pulling) {
          e2._pullAgain = true;
          return;
        }
        e2._pulling = true;
        const r2 = e2._pullAlgorithm();
        g2(r2, () => (e2._pulling = false, e2._pullAgain && (e2._pullAgain = false, vt(e2)), null), (s2) => (oe(e2, s2), null));
      }
      n$2(vt, "ReadableStreamDefaultControllerCallPullIfNeeded");
      function Vo(e2) {
        const t3 = e2._controlledReadableStream;
        return !Je(e2) || !e2._started ? false : !!(qe(t3) && $t(t3) > 0 || fn(e2) > 0);
      }
      n$2(Vo, "ReadableStreamDefaultControllerShouldCallPull");
      function ir(e2) {
        e2._pullAlgorithm = void 0, e2._cancelAlgorithm = void 0, e2._strategySizeAlgorithm = void 0;
      }
      n$2(ir, "ReadableStreamDefaultControllerClearAlgorithms");
      function De(e2) {
        if (!Je(e2)) return;
        const t3 = e2._controlledReadableStream;
        e2._closeRequested = true, e2._queue.length === 0 && (ir(e2), At(t3));
      }
      n$2(De, "ReadableStreamDefaultControllerClose");
      function Ke(e2, t3) {
        if (!Je(e2)) return;
        const r2 = e2._controlledReadableStream;
        if (qe(r2) && $t(r2) > 0) Lr(r2, t3, false);
        else {
          let s2;
          try {
            s2 = e2._strategySizeAlgorithm(t3);
          } catch (u2) {
            throw oe(e2, u2), u2;
          }
          try {
            Nr(e2, t3, s2);
          } catch (u2) {
            throw oe(e2, u2), u2;
          }
        }
        vt(e2);
      }
      n$2(Ke, "ReadableStreamDefaultControllerEnqueue");
      function oe(e2, t3) {
        const r2 = e2._controlledReadableStream;
        r2._state === "readable" && (Be(e2), ir(e2), Zo(r2, t3));
      }
      n$2(oe, "ReadableStreamDefaultControllerError");
      function fn(e2) {
        const t3 = e2._controlledReadableStream._state;
        return t3 === "errored" ? null : t3 === "closed" ? 0 : e2._strategyHWM - e2._queueTotalSize;
      }
      n$2(fn, "ReadableStreamDefaultControllerGetDesiredSize");
      function ts(e2) {
        return !Vo(e2);
      }
      n$2(ts, "ReadableStreamDefaultControllerHasBackpressure");
      function Je(e2) {
        const t3 = e2._controlledReadableStream._state;
        return !e2._closeRequested && t3 === "readable";
      }
      n$2(Je, "ReadableStreamDefaultControllerCanCloseOrEnqueue");
      function Qo(e2, t3, r2, s2, u2, c2, d2) {
        t3._controlledReadableStream = e2, t3._queue = void 0, t3._queueTotalSize = void 0, Be(t3), t3._started = false, t3._closeRequested = false, t3._pullAgain = false, t3._pulling = false, t3._strategySizeAlgorithm = d2, t3._strategyHWM = c2, t3._pullAlgorithm = s2, t3._cancelAlgorithm = u2, e2._readableStreamController = t3;
        const m2 = r2();
        g2(T2(m2), () => (t3._started = true, vt(t3), null), (R2) => (oe(t3, R2), null));
      }
      n$2(Qo, "SetUpReadableStreamDefaultController");
      function rs(e2, t3, r2, s2) {
        const u2 = Object.create(ne.prototype);
        let c2, d2, m2;
        t3.start !== void 0 ? c2 = n$2(() => t3.start(u2), "startAlgorithm") : c2 = n$2(() => {
        }, "startAlgorithm"), t3.pull !== void 0 ? d2 = n$2(() => t3.pull(u2), "pullAlgorithm") : d2 = n$2(() => T2(void 0), "pullAlgorithm"), t3.cancel !== void 0 ? m2 = n$2((R2) => t3.cancel(R2), "cancelAlgorithm") : m2 = n$2(() => T2(void 0), "cancelAlgorithm"), Qo(e2, u2, c2, d2, m2, r2, s2);
      }
      n$2(rs, "SetUpReadableStreamDefaultControllerFromUnderlyingSource");
      function ar(e2) {
        return new TypeError(`ReadableStreamDefaultController.prototype.${e2} can only be used on a ReadableStreamDefaultController`);
      }
      n$2(ar, "defaultControllerBrandCheckException$1");
      function ns(e2, t3) {
        return Ie(e2._readableStreamController) ? is(e2) : os(e2);
      }
      n$2(ns, "ReadableStreamTee");
      function os(e2, t3) {
        const r2 = Qe(e2);
        let s2 = false, u2 = false, c2 = false, d2 = false, m2, R2, y2, C2, P2;
        const B = A2((x2) => {
          P2 = x2;
        });
        function ae() {
          return s2 ? (u2 = true, T2(void 0)) : (s2 = true, _t(r2, { _chunkSteps: n$2((N2) => {
            ge(() => {
              u2 = false;
              const J = N2, Ce = N2;
              c2 || Ke(y2._readableStreamController, J), d2 || Ke(C2._readableStreamController, Ce), s2 = false, u2 && ae();
            });
          }, "_chunkSteps"), _closeSteps: n$2(() => {
            s2 = false, c2 || De(y2._readableStreamController), d2 || De(C2._readableStreamController), (!c2 || !d2) && P2(void 0);
          }, "_closeSteps"), _errorSteps: n$2(() => {
            s2 = false;
          }, "_errorSteps") }), T2(void 0));
        }
        n$2(ae, "pullAlgorithm");
        function nt(x2) {
          if (c2 = true, m2 = x2, d2) {
            const N2 = St([m2, R2]), J = ie(e2, N2);
            P2(J);
          }
          return B;
        }
        n$2(nt, "cancel1Algorithm");
        function Oe(x2) {
          if (d2 = true, R2 = x2, c2) {
            const N2 = St([m2, R2]), J = ie(e2, N2);
            P2(J);
          }
          return B;
        }
        n$2(Oe, "cancel2Algorithm");
        function Te() {
        }
        return n$2(Te, "startAlgorithm"), y2 = Et(Te, ae, nt), C2 = Et(Te, ae, Oe), I2(r2._closedPromise, (x2) => (oe(y2._readableStreamController, x2), oe(C2._readableStreamController, x2), (!c2 || !d2) && P2(void 0), null)), [y2, C2];
      }
      n$2(os, "ReadableStreamDefaultTee");
      function is(e2) {
        let t3 = Qe(e2), r2 = false, s2 = false, u2 = false, c2 = false, d2 = false, m2, R2, y2, C2, P2;
        const B = A2((_2) => {
          P2 = _2;
        });
        function ae(_2) {
          I2(_2._closedPromise, (E2) => (_2 !== t3 || (K(y2._readableStreamController, E2), K(C2._readableStreamController, E2), (!c2 || !d2) && P2(void 0)), null));
        }
        n$2(ae, "forwardReaderError");
        function nt() {
          je(t3) && (_e(t3), t3 = Qe(e2), ae(t3)), _t(t3, { _chunkSteps: n$2((E2) => {
            ge(() => {
              s2 = false, u2 = false;
              const k2 = E2;
              let Y = E2;
              if (!c2 && !d2) try {
                Y = fo(E2);
              } catch (ot) {
                K(y2._readableStreamController, ot), K(C2._readableStreamController, ot), P2(ie(e2, ot));
                return;
              }
              c2 || Ht(y2._readableStreamController, k2), d2 || Ht(C2._readableStreamController, Y), r2 = false, s2 ? Te() : u2 && x2();
            });
          }, "_chunkSteps"), _closeSteps: n$2(() => {
            r2 = false, c2 || wt(y2._readableStreamController), d2 || wt(C2._readableStreamController), y2._readableStreamController._pendingPullIntos.length > 0 && Vt(y2._readableStreamController, 0), C2._readableStreamController._pendingPullIntos.length > 0 && Vt(C2._readableStreamController, 0), (!c2 || !d2) && P2(void 0);
          }, "_closeSteps"), _errorSteps: n$2(() => {
            r2 = false;
          }, "_errorSteps") });
        }
        n$2(nt, "pullWithDefaultReader");
        function Oe(_2, E2) {
          Ee(t3) && (_e(t3), t3 = Co(e2), ae(t3));
          const k2 = E2 ? C2 : y2, Y = E2 ? y2 : C2;
          Eo(t3, _2, 1, { _chunkSteps: n$2((it) => {
            ge(() => {
              s2 = false, u2 = false;
              const at = E2 ? d2 : c2;
              if (E2 ? c2 : d2) at || Qt(k2._readableStreamController, it);
              else {
                let ui;
                try {
                  ui = fo(it);
                } catch (kn) {
                  K(k2._readableStreamController, kn), K(Y._readableStreamController, kn), P2(ie(e2, kn));
                  return;
                }
                at || Qt(k2._readableStreamController, it), Ht(Y._readableStreamController, ui);
              }
              r2 = false, s2 ? Te() : u2 && x2();
            });
          }, "_chunkSteps"), _closeSteps: n$2((it) => {
            r2 = false;
            const at = E2 ? d2 : c2, cr = E2 ? c2 : d2;
            at || wt(k2._readableStreamController), cr || wt(Y._readableStreamController), it !== void 0 && (at || Qt(k2._readableStreamController, it), !cr && Y._readableStreamController._pendingPullIntos.length > 0 && Vt(Y._readableStreamController, 0)), (!at || !cr) && P2(void 0);
          }, "_closeSteps"), _errorSteps: n$2(() => {
            r2 = false;
          }, "_errorSteps") });
        }
        n$2(Oe, "pullWithBYOBReader");
        function Te() {
          if (r2) return s2 = true, T2(void 0);
          r2 = true;
          const _2 = Gr(y2._readableStreamController);
          return _2 === null ? nt() : Oe(_2._view, false), T2(void 0);
        }
        n$2(Te, "pull1Algorithm");
        function x2() {
          if (r2) return u2 = true, T2(void 0);
          r2 = true;
          const _2 = Gr(C2._readableStreamController);
          return _2 === null ? nt() : Oe(_2._view, true), T2(void 0);
        }
        n$2(x2, "pull2Algorithm");
        function N2(_2) {
          if (c2 = true, m2 = _2, d2) {
            const E2 = St([m2, R2]), k2 = ie(e2, E2);
            P2(k2);
          }
          return B;
        }
        n$2(N2, "cancel1Algorithm");
        function J(_2) {
          if (d2 = true, R2 = _2, c2) {
            const E2 = St([m2, R2]), k2 = ie(e2, E2);
            P2(k2);
          }
          return B;
        }
        n$2(J, "cancel2Algorithm");
        function Ce() {
        }
        return n$2(Ce, "startAlgorithm"), y2 = Go(Ce, Te, N2), C2 = Go(Ce, x2, J), ae(t3), [y2, C2];
      }
      n$2(is, "ReadableByteStreamTee");
      function as(e2) {
        return l2(e2) && typeof e2.getReader < "u";
      }
      n$2(as, "isReadableStreamLike");
      function ss(e2) {
        return as(e2) ? us(e2.getReader()) : ls(e2);
      }
      n$2(ss, "ReadableStreamFrom");
      function ls(e2) {
        let t3;
        const r2 = uo(e2, "async"), s2 = f2;
        function u2() {
          let d2;
          try {
            d2 = Xi(r2);
          } catch (R2) {
            return b2(R2);
          }
          const m2 = T2(d2);
          return F(m2, (R2) => {
            if (!l2(R2)) throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");
            if (ea(R2)) De(t3._readableStreamController);
            else {
              const C2 = ta(R2);
              Ke(t3._readableStreamController, C2);
            }
          });
        }
        n$2(u2, "pullAlgorithm");
        function c2(d2) {
          const m2 = r2.iterator;
          let R2;
          try {
            R2 = Ut(m2, "return");
          } catch (P2) {
            return b2(P2);
          }
          if (R2 === void 0) return T2(void 0);
          let y2;
          try {
            y2 = z(R2, m2, [d2]);
          } catch (P2) {
            return b2(P2);
          }
          const C2 = T2(y2);
          return F(C2, (P2) => {
            if (!l2(P2)) throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object");
          });
        }
        return n$2(c2, "cancelAlgorithm"), t3 = Et(s2, u2, c2, 0), t3;
      }
      n$2(ls, "ReadableStreamFromIterable");
      function us(e2) {
        let t3;
        const r2 = f2;
        function s2() {
          let c2;
          try {
            c2 = e2.read();
          } catch (d2) {
            return b2(d2);
          }
          return F(c2, (d2) => {
            if (!l2(d2)) throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");
            if (d2.done) De(t3._readableStreamController);
            else {
              const m2 = d2.value;
              Ke(t3._readableStreamController, m2);
            }
          });
        }
        n$2(s2, "pullAlgorithm");
        function u2(c2) {
          try {
            return T2(e2.cancel(c2));
          } catch (d2) {
            return b2(d2);
          }
        }
        return n$2(u2, "cancelAlgorithm"), t3 = Et(r2, s2, u2, 0), t3;
      }
      n$2(us, "ReadableStreamFromDefaultReader");
      function fs(e2, t3) {
        ue(e2, t3);
        const r2 = e2, s2 = r2?.autoAllocateChunkSize, u2 = r2?.cancel, c2 = r2?.pull, d2 = r2?.start, m2 = r2?.type;
        return { autoAllocateChunkSize: s2 === void 0 ? void 0 : Fr(s2, `${t3} has member 'autoAllocateChunkSize' that`), cancel: u2 === void 0 ? void 0 : cs(u2, r2, `${t3} has member 'cancel' that`), pull: c2 === void 0 ? void 0 : ds(c2, r2, `${t3} has member 'pull' that`), start: d2 === void 0 ? void 0 : hs(d2, r2, `${t3} has member 'start' that`), type: m2 === void 0 ? void 0 : ps(m2, `${t3} has member 'type' that`) };
      }
      n$2(fs, "convertUnderlyingDefaultOrByteSource");
      function cs(e2, t3, r2) {
        return Z(e2, r2), (s2) => j2(e2, t3, [s2]);
      }
      n$2(cs, "convertUnderlyingSourceCancelCallback");
      function ds(e2, t3, r2) {
        return Z(e2, r2), (s2) => j2(e2, t3, [s2]);
      }
      n$2(ds, "convertUnderlyingSourcePullCallback");
      function hs(e2, t3, r2) {
        return Z(e2, r2), (s2) => z(e2, t3, [s2]);
      }
      n$2(hs, "convertUnderlyingSourceStartCallback");
      function ps(e2, t3) {
        if (e2 = `${e2}`, e2 !== "bytes") throw new TypeError(`${t3} '${e2}' is not a valid enumeration value for ReadableStreamType`);
        return e2;
      }
      n$2(ps, "convertReadableStreamType");
      function bs(e2, t3) {
        return ue(e2, t3), { preventCancel: !!e2?.preventCancel };
      }
      n$2(bs, "convertIteratorOptions");
      function Yo(e2, t3) {
        ue(e2, t3);
        const r2 = e2?.preventAbort, s2 = e2?.preventCancel, u2 = e2?.preventClose, c2 = e2?.signal;
        return c2 !== void 0 && ms(c2, `${t3} has member 'signal' that`), { preventAbort: !!r2, preventCancel: !!s2, preventClose: !!u2, signal: c2 };
      }
      n$2(Yo, "convertPipeOptions");
      function ms(e2, t3) {
        if (!Ca(e2)) throw new TypeError(`${t3} is not an AbortSignal.`);
      }
      n$2(ms, "assertAbortSignal");
      function ys(e2, t3) {
        ue(e2, t3);
        const r2 = e2?.readable;
        zr(r2, "readable", "ReadableWritablePair"), jr(r2, `${t3} has member 'readable' that`);
        const s2 = e2?.writable;
        return zr(s2, "writable", "ReadableWritablePair"), Bo(s2, `${t3} has member 'writable' that`), { readable: r2, writable: s2 };
      }
      n$2(ys, "convertReadableWritablePair");
      const Pn = class Pn {
        constructor(t3 = {}, r2 = {}) {
          t3 === void 0 ? t3 = null : Jn(t3, "First parameter");
          const s2 = Zt(r2, "Second parameter"), u2 = fs(t3, "First parameter");
          if (cn(this), u2.type === "bytes") {
            if (s2.size !== void 0) throw new RangeError("The strategy for a byte stream cannot have a size function");
            const c2 = Tt(s2, 0);
            ca(this, u2, c2);
          } else {
            const c2 = Gt(s2), d2 = Tt(s2, 1);
            rs(this, u2, d2, c2);
          }
        }
        get locked() {
          if (!We(this)) throw Me("locked");
          return qe(this);
        }
        cancel(t3 = void 0) {
          return We(this) ? qe(this) ? b2(new TypeError("Cannot cancel a stream that already has a reader")) : ie(this, t3) : b2(Me("cancel"));
        }
        getReader(t3 = void 0) {
          if (!We(this)) throw Me("getReader");
          return ha(t3, "First parameter").mode === void 0 ? Qe(this) : Co(this);
        }
        pipeThrough(t3, r2 = {}) {
          if (!We(this)) throw Me("pipeThrough");
          Se(t3, 1, "pipeThrough");
          const s2 = ys(t3, "First parameter"), u2 = Yo(r2, "Second parameter");
          if (qe(this)) throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
          if (Ze(s2.writable)) throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
          const c2 = Ho(this, s2.writable, u2.preventClose, u2.preventAbort, u2.preventCancel, u2.signal);
          return Q(c2), s2.readable;
        }
        pipeTo(t3, r2 = {}) {
          if (!We(this)) return b2(Me("pipeTo"));
          if (t3 === void 0) return b2("Parameter 1 is required in 'pipeTo'.");
          if (!Ge(t3)) return b2(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));
          let s2;
          try {
            s2 = Yo(r2, "Second parameter");
          } catch (u2) {
            return b2(u2);
          }
          return qe(this) ? b2(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")) : Ze(t3) ? b2(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")) : Ho(this, t3, s2.preventClose, s2.preventAbort, s2.preventCancel, s2.signal);
        }
        tee() {
          if (!We(this)) throw Me("tee");
          const t3 = ns(this);
          return St(t3);
        }
        values(t3 = void 0) {
          if (!We(this)) throw Me("values");
          const r2 = bs(t3, "First parameter");
          return Ki(this, r2.preventCancel);
        }
        [Ur](t3) {
          return this.values(t3);
        }
        static from(t3) {
          return ss(t3);
        }
      };
      n$2(Pn, "ReadableStream");
      let L = Pn;
      Object.defineProperties(L, { from: { enumerable: true } }), Object.defineProperties(L.prototype, { cancel: { enumerable: true }, getReader: { enumerable: true }, pipeThrough: { enumerable: true }, pipeTo: { enumerable: true }, tee: { enumerable: true }, values: { enumerable: true }, locked: { enumerable: true } }), h2(L.from, "from"), h2(L.prototype.cancel, "cancel"), h2(L.prototype.getReader, "getReader"), h2(L.prototype.pipeThrough, "pipeThrough"), h2(L.prototype.pipeTo, "pipeTo"), h2(L.prototype.tee, "tee"), h2(L.prototype.values, "values"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(L.prototype, Symbol.toStringTag, { value: "ReadableStream", configurable: true }), Object.defineProperty(L.prototype, Ur, { value: L.prototype.values, writable: true, configurable: true });
      function Et(e2, t3, r2, s2 = 1, u2 = () => 1) {
        const c2 = Object.create(L.prototype);
        cn(c2);
        const d2 = Object.create(ne.prototype);
        return Qo(c2, d2, e2, t3, r2, s2, u2), c2;
      }
      n$2(Et, "CreateReadableStream");
      function Go(e2, t3, r2) {
        const s2 = Object.create(L.prototype);
        cn(s2);
        const u2 = Object.create(te.prototype);
        return To(s2, u2, e2, t3, r2, 0, void 0), s2;
      }
      n$2(Go, "CreateReadableByteStream");
      function cn(e2) {
        e2._state = "readable", e2._reader = void 0, e2._storedError = void 0, e2._disturbed = false;
      }
      n$2(cn, "InitializeReadableStream");
      function We(e2) {
        return !l2(e2) || !Object.prototype.hasOwnProperty.call(e2, "_readableStreamController") ? false : e2 instanceof L;
      }
      n$2(We, "IsReadableStream");
      function qe(e2) {
        return e2._reader !== void 0;
      }
      n$2(qe, "IsReadableStreamLocked");
      function ie(e2, t3) {
        if (e2._disturbed = true, e2._state === "closed") return T2(void 0);
        if (e2._state === "errored") return b2(e2._storedError);
        At(e2);
        const r2 = e2._reader;
        if (r2 !== void 0 && je(r2)) {
          const u2 = r2._readIntoRequests;
          r2._readIntoRequests = new D2(), u2.forEach((c2) => {
            c2._closeSteps(void 0);
          });
        }
        const s2 = e2._readableStreamController[Ar](t3);
        return F(s2, f2);
      }
      n$2(ie, "ReadableStreamCancel");
      function At(e2) {
        e2._state = "closed";
        const t3 = e2._reader;
        if (t3 !== void 0 && (Zn(t3), Ee(t3))) {
          const r2 = t3._readRequests;
          t3._readRequests = new D2(), r2.forEach((s2) => {
            s2._closeSteps();
          });
        }
      }
      n$2(At, "ReadableStreamClose");
      function Zo(e2, t3) {
        e2._state = "errored", e2._storedError = t3;
        const r2 = e2._reader;
        r2 !== void 0 && (Or(r2, t3), Ee(r2) ? ro(r2, t3) : Ao(r2, t3));
      }
      n$2(Zo, "ReadableStreamError");
      function Me(e2) {
        return new TypeError(`ReadableStream.prototype.${e2} can only be used on a ReadableStream`);
      }
      n$2(Me, "streamBrandCheckException$1");
      function Ko(e2, t3) {
        ue(e2, t3);
        const r2 = e2?.highWaterMark;
        return zr(r2, "highWaterMark", "QueuingStrategyInit"), { highWaterMark: Ir(r2) };
      }
      n$2(Ko, "convertQueuingStrategyInit");
      const Jo = n$2((e2) => e2.byteLength, "byteLengthSizeFunction");
      h2(Jo, "size");
      const vn = class vn {
        constructor(t3) {
          Se(t3, 1, "ByteLengthQueuingStrategy"), t3 = Ko(t3, "First parameter"), this._byteLengthQueuingStrategyHighWaterMark = t3.highWaterMark;
        }
        get highWaterMark() {
          if (!ei(this)) throw Xo("highWaterMark");
          return this._byteLengthQueuingStrategyHighWaterMark;
        }
        get size() {
          if (!ei(this)) throw Xo("size");
          return Jo;
        }
      };
      n$2(vn, "ByteLengthQueuingStrategy");
      let Xe = vn;
      Object.defineProperties(Xe.prototype, { highWaterMark: { enumerable: true }, size: { enumerable: true } }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Xe.prototype, Symbol.toStringTag, { value: "ByteLengthQueuingStrategy", configurable: true });
      function Xo(e2) {
        return new TypeError(`ByteLengthQueuingStrategy.prototype.${e2} can only be used on a ByteLengthQueuingStrategy`);
      }
      n$2(Xo, "byteLengthBrandCheckException");
      function ei(e2) {
        return !l2(e2) || !Object.prototype.hasOwnProperty.call(e2, "_byteLengthQueuingStrategyHighWaterMark") ? false : e2 instanceof Xe;
      }
      n$2(ei, "IsByteLengthQueuingStrategy");
      const ti = n$2(() => 1, "countSizeFunction");
      h2(ti, "size");
      const En = class En {
        constructor(t3) {
          Se(t3, 1, "CountQueuingStrategy"), t3 = Ko(t3, "First parameter"), this._countQueuingStrategyHighWaterMark = t3.highWaterMark;
        }
        get highWaterMark() {
          if (!ni(this)) throw ri("highWaterMark");
          return this._countQueuingStrategyHighWaterMark;
        }
        get size() {
          if (!ni(this)) throw ri("size");
          return ti;
        }
      };
      n$2(En, "CountQueuingStrategy");
      let et = En;
      Object.defineProperties(et.prototype, { highWaterMark: { enumerable: true }, size: { enumerable: true } }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(et.prototype, Symbol.toStringTag, { value: "CountQueuingStrategy", configurable: true });
      function ri(e2) {
        return new TypeError(`CountQueuingStrategy.prototype.${e2} can only be used on a CountQueuingStrategy`);
      }
      n$2(ri, "countBrandCheckException");
      function ni(e2) {
        return !l2(e2) || !Object.prototype.hasOwnProperty.call(e2, "_countQueuingStrategyHighWaterMark") ? false : e2 instanceof et;
      }
      n$2(ni, "IsCountQueuingStrategy");
      function gs(e2, t3) {
        ue(e2, t3);
        const r2 = e2?.cancel, s2 = e2?.flush, u2 = e2?.readableType, c2 = e2?.start, d2 = e2?.transform, m2 = e2?.writableType;
        return { cancel: r2 === void 0 ? void 0 : Rs(r2, e2, `${t3} has member 'cancel' that`), flush: s2 === void 0 ? void 0 : _s(s2, e2, `${t3} has member 'flush' that`), readableType: u2, start: c2 === void 0 ? void 0 : Ss(c2, e2, `${t3} has member 'start' that`), transform: d2 === void 0 ? void 0 : ws(d2, e2, `${t3} has member 'transform' that`), writableType: m2 };
      }
      n$2(gs, "convertTransformer");
      function _s(e2, t3, r2) {
        return Z(e2, r2), (s2) => j2(e2, t3, [s2]);
      }
      n$2(_s, "convertTransformerFlushCallback");
      function Ss(e2, t3, r2) {
        return Z(e2, r2), (s2) => z(e2, t3, [s2]);
      }
      n$2(Ss, "convertTransformerStartCallback");
      function ws(e2, t3, r2) {
        return Z(e2, r2), (s2, u2) => j2(e2, t3, [s2, u2]);
      }
      n$2(ws, "convertTransformerTransformCallback");
      function Rs(e2, t3, r2) {
        return Z(e2, r2), (s2) => j2(e2, t3, [s2]);
      }
      n$2(Rs, "convertTransformerCancelCallback");
      const An = class An {
        constructor(t3 = {}, r2 = {}, s2 = {}) {
          t3 === void 0 && (t3 = null);
          const u2 = Zt(r2, "Second parameter"), c2 = Zt(s2, "Third parameter"), d2 = gs(t3, "First parameter");
          if (d2.readableType !== void 0) throw new RangeError("Invalid readableType specified");
          if (d2.writableType !== void 0) throw new RangeError("Invalid writableType specified");
          const m2 = Tt(c2, 0), R2 = Gt(c2), y2 = Tt(u2, 1), C2 = Gt(u2);
          let P2;
          const B = A2((ae) => {
            P2 = ae;
          });
          Ts(this, B, y2, C2, m2, R2), Ps(this, d2), d2.start !== void 0 ? P2(d2.start(this._transformStreamController)) : P2(void 0);
        }
        get readable() {
          if (!oi(this)) throw li("readable");
          return this._readable;
        }
        get writable() {
          if (!oi(this)) throw li("writable");
          return this._writable;
        }
      };
      n$2(An, "TransformStream");
      let tt = An;
      Object.defineProperties(tt.prototype, { readable: { enumerable: true }, writable: { enumerable: true } }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(tt.prototype, Symbol.toStringTag, { value: "TransformStream", configurable: true });
      function Ts(e2, t3, r2, s2, u2, c2) {
        function d2() {
          return t3;
        }
        n$2(d2, "startAlgorithm");
        function m2(B) {
          return As(e2, B);
        }
        n$2(m2, "writeAlgorithm");
        function R2(B) {
          return Bs(e2, B);
        }
        n$2(R2, "abortAlgorithm");
        function y2() {
          return ks(e2);
        }
        n$2(y2, "closeAlgorithm"), e2._writable = Ea(d2, m2, y2, R2, r2, s2);
        function C2() {
          return Ws(e2);
        }
        n$2(C2, "pullAlgorithm");
        function P2(B) {
          return qs(e2, B);
        }
        n$2(P2, "cancelAlgorithm"), e2._readable = Et(d2, C2, P2, u2, c2), e2._backpressure = void 0, e2._backpressureChangePromise = void 0, e2._backpressureChangePromise_resolve = void 0, sr(e2, true), e2._transformStreamController = void 0;
      }
      n$2(Ts, "InitializeTransformStream");
      function oi(e2) {
        return !l2(e2) || !Object.prototype.hasOwnProperty.call(e2, "_transformStreamController") ? false : e2 instanceof tt;
      }
      n$2(oi, "IsTransformStream");
      function ii(e2, t3) {
        oe(e2._readable._readableStreamController, t3), dn(e2, t3);
      }
      n$2(ii, "TransformStreamError");
      function dn(e2, t3) {
        ur(e2._transformStreamController), Ct(e2._writable._writableStreamController, t3), hn(e2);
      }
      n$2(dn, "TransformStreamErrorWritableAndUnblockWrite");
      function hn(e2) {
        e2._backpressure && sr(e2, false);
      }
      n$2(hn, "TransformStreamUnblockWrite");
      function sr(e2, t3) {
        e2._backpressureChangePromise !== void 0 && e2._backpressureChangePromise_resolve(), e2._backpressureChangePromise = A2((r2) => {
          e2._backpressureChangePromise_resolve = r2;
        }), e2._backpressure = t3;
      }
      n$2(sr, "TransformStreamSetBackpressure");
      const Bn = class Bn {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get desiredSize() {
          if (!lr(this)) throw fr("desiredSize");
          const t3 = this._controlledTransformStream._readable._readableStreamController;
          return fn(t3);
        }
        enqueue(t3 = void 0) {
          if (!lr(this)) throw fr("enqueue");
          ai(this, t3);
        }
        error(t3 = void 0) {
          if (!lr(this)) throw fr("error");
          vs(this, t3);
        }
        terminate() {
          if (!lr(this)) throw fr("terminate");
          Es(this);
        }
      };
      n$2(Bn, "TransformStreamDefaultController");
      let pe = Bn;
      Object.defineProperties(pe.prototype, { enqueue: { enumerable: true }, error: { enumerable: true }, terminate: { enumerable: true }, desiredSize: { enumerable: true } }), h2(pe.prototype.enqueue, "enqueue"), h2(pe.prototype.error, "error"), h2(pe.prototype.terminate, "terminate"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(pe.prototype, Symbol.toStringTag, { value: "TransformStreamDefaultController", configurable: true });
      function lr(e2) {
        return !l2(e2) || !Object.prototype.hasOwnProperty.call(e2, "_controlledTransformStream") ? false : e2 instanceof pe;
      }
      n$2(lr, "IsTransformStreamDefaultController");
      function Cs(e2, t3, r2, s2, u2) {
        t3._controlledTransformStream = e2, e2._transformStreamController = t3, t3._transformAlgorithm = r2, t3._flushAlgorithm = s2, t3._cancelAlgorithm = u2, t3._finishPromise = void 0, t3._finishPromise_resolve = void 0, t3._finishPromise_reject = void 0;
      }
      n$2(Cs, "SetUpTransformStreamDefaultController");
      function Ps(e2, t3) {
        const r2 = Object.create(pe.prototype);
        let s2, u2, c2;
        t3.transform !== void 0 ? s2 = n$2((d2) => t3.transform(d2, r2), "transformAlgorithm") : s2 = n$2((d2) => {
          try {
            return ai(r2, d2), T2(void 0);
          } catch (m2) {
            return b2(m2);
          }
        }, "transformAlgorithm"), t3.flush !== void 0 ? u2 = n$2(() => t3.flush(r2), "flushAlgorithm") : u2 = n$2(() => T2(void 0), "flushAlgorithm"), t3.cancel !== void 0 ? c2 = n$2((d2) => t3.cancel(d2), "cancelAlgorithm") : c2 = n$2(() => T2(void 0), "cancelAlgorithm"), Cs(e2, r2, s2, u2, c2);
      }
      n$2(Ps, "SetUpTransformStreamDefaultControllerFromTransformer");
      function ur(e2) {
        e2._transformAlgorithm = void 0, e2._flushAlgorithm = void 0, e2._cancelAlgorithm = void 0;
      }
      n$2(ur, "TransformStreamDefaultControllerClearAlgorithms");
      function ai(e2, t3) {
        const r2 = e2._controlledTransformStream, s2 = r2._readable._readableStreamController;
        if (!Je(s2)) throw new TypeError("Readable side is not in a state that permits enqueue");
        try {
          Ke(s2, t3);
        } catch (c2) {
          throw dn(r2, c2), r2._readable._storedError;
        }
        ts(s2) !== r2._backpressure && sr(r2, true);
      }
      n$2(ai, "TransformStreamDefaultControllerEnqueue");
      function vs(e2, t3) {
        ii(e2._controlledTransformStream, t3);
      }
      n$2(vs, "TransformStreamDefaultControllerError");
      function si(e2, t3) {
        const r2 = e2._transformAlgorithm(t3);
        return F(r2, void 0, (s2) => {
          throw ii(e2._controlledTransformStream, s2), s2;
        });
      }
      n$2(si, "TransformStreamDefaultControllerPerformTransform");
      function Es(e2) {
        const t3 = e2._controlledTransformStream, r2 = t3._readable._readableStreamController;
        De(r2);
        const s2 = new TypeError("TransformStream terminated");
        dn(t3, s2);
      }
      n$2(Es, "TransformStreamDefaultControllerTerminate");
      function As(e2, t3) {
        const r2 = e2._transformStreamController;
        if (e2._backpressure) {
          const s2 = e2._backpressureChangePromise;
          return F(s2, () => {
            const u2 = e2._writable;
            if (u2._state === "erroring") throw u2._storedError;
            return si(r2, t3);
          });
        }
        return si(r2, t3);
      }
      n$2(As, "TransformStreamDefaultSinkWriteAlgorithm");
      function Bs(e2, t3) {
        const r2 = e2._transformStreamController;
        if (r2._finishPromise !== void 0) return r2._finishPromise;
        const s2 = e2._readable;
        r2._finishPromise = A2((c2, d2) => {
          r2._finishPromise_resolve = c2, r2._finishPromise_reject = d2;
        });
        const u2 = r2._cancelAlgorithm(t3);
        return ur(r2), g2(u2, () => (s2._state === "errored" ? rt(r2, s2._storedError) : (oe(s2._readableStreamController, t3), pn(r2)), null), (c2) => (oe(s2._readableStreamController, c2), rt(r2, c2), null)), r2._finishPromise;
      }
      n$2(Bs, "TransformStreamDefaultSinkAbortAlgorithm");
      function ks(e2) {
        const t3 = e2._transformStreamController;
        if (t3._finishPromise !== void 0) return t3._finishPromise;
        const r2 = e2._readable;
        t3._finishPromise = A2((u2, c2) => {
          t3._finishPromise_resolve = u2, t3._finishPromise_reject = c2;
        });
        const s2 = t3._flushAlgorithm();
        return ur(t3), g2(s2, () => (r2._state === "errored" ? rt(t3, r2._storedError) : (De(r2._readableStreamController), pn(t3)), null), (u2) => (oe(r2._readableStreamController, u2), rt(t3, u2), null)), t3._finishPromise;
      }
      n$2(ks, "TransformStreamDefaultSinkCloseAlgorithm");
      function Ws(e2) {
        return sr(e2, false), e2._backpressureChangePromise;
      }
      n$2(Ws, "TransformStreamDefaultSourcePullAlgorithm");
      function qs(e2, t3) {
        const r2 = e2._transformStreamController;
        if (r2._finishPromise !== void 0) return r2._finishPromise;
        const s2 = e2._writable;
        r2._finishPromise = A2((c2, d2) => {
          r2._finishPromise_resolve = c2, r2._finishPromise_reject = d2;
        });
        const u2 = r2._cancelAlgorithm(t3);
        return ur(r2), g2(u2, () => (s2._state === "errored" ? rt(r2, s2._storedError) : (Ct(s2._writableStreamController, t3), hn(e2), pn(r2)), null), (c2) => (Ct(s2._writableStreamController, c2), hn(e2), rt(r2, c2), null)), r2._finishPromise;
      }
      n$2(qs, "TransformStreamDefaultSourceCancelAlgorithm");
      function fr(e2) {
        return new TypeError(`TransformStreamDefaultController.prototype.${e2} can only be used on a TransformStreamDefaultController`);
      }
      n$2(fr, "defaultControllerBrandCheckException");
      function pn(e2) {
        e2._finishPromise_resolve !== void 0 && (e2._finishPromise_resolve(), e2._finishPromise_resolve = void 0, e2._finishPromise_reject = void 0);
      }
      n$2(pn, "defaultControllerFinishPromiseResolve");
      function rt(e2, t3) {
        e2._finishPromise_reject !== void 0 && (Q(e2._finishPromise), e2._finishPromise_reject(t3), e2._finishPromise_resolve = void 0, e2._finishPromise_reject = void 0);
      }
      n$2(rt, "defaultControllerFinishPromiseReject");
      function li(e2) {
        return new TypeError(`TransformStream.prototype.${e2} can only be used on a TransformStream`);
      }
      n$2(li, "streamBrandCheckException"), a2.ByteLengthQueuingStrategy = Xe, a2.CountQueuingStrategy = et, a2.ReadableByteStreamController = te, a2.ReadableStream = L, a2.ReadableStreamBYOBReader = ce, a2.ReadableStreamBYOBRequest = Re, a2.ReadableStreamDefaultController = ne, a2.ReadableStreamDefaultReader = fe, a2.TransformStream = tt, a2.TransformStreamDefaultController = pe, a2.WritableStream = de, a2.WritableStreamDefaultController = ke, a2.WritableStreamDefaultWriter = re;
    });
  })(kt, kt.exports)), kt.exports;
}
n$2(Ns, "requirePonyfill_es2018");
var mi;
function Hs() {
  if (mi) return pi;
  mi = 1;
  const i2 = 65536;
  if (!globalThis.ReadableStream) try {
    const o2 = require("node:process"), { emitWarning: a2 } = o2;
    try {
      o2.emitWarning = () => {
      }, Object.assign(globalThis, require("node:stream/web")), o2.emitWarning = a2;
    } catch (f2) {
      throw o2.emitWarning = a2, f2;
    }
  } catch {
    Object.assign(globalThis, Ns());
  }
  try {
    const { Blob: o2 } = require("buffer");
    o2 && !o2.prototype.stream && (o2.prototype.stream = n$2(function(f2) {
      let l2 = 0;
      const p2 = this;
      return new ReadableStream({ type: "bytes", async pull(h2) {
        const v2 = await p2.slice(l2, Math.min(p2.size, l2 + i2)).arrayBuffer();
        l2 += v2.byteLength, h2.enqueue(new Uint8Array(v2)), l2 === p2.size && h2.close();
      } });
    }, "name"));
  } catch {
  }
  return pi;
}
n$2(Hs, "requireStreams"), Hs();
const yi = 65536;
async function* Wn(i2, o2 = true) {
  for (const a2 of i2) if ("stream" in a2) yield* a2.stream();
  else if (ArrayBuffer.isView(a2)) if (o2) {
    let f2 = a2.byteOffset;
    const l2 = a2.byteOffset + a2.byteLength;
    for (; f2 !== l2; ) {
      const p2 = Math.min(l2 - f2, yi), h2 = a2.buffer.slice(f2, f2 + p2);
      f2 += h2.byteLength, yield new Uint8Array(h2);
    }
  } else yield a2;
  else {
    let f2 = 0, l2 = a2;
    for (; f2 !== l2.size; ) {
      const h2 = await l2.slice(f2, Math.min(l2.size, f2 + yi)).arrayBuffer();
      f2 += h2.byteLength, yield new Uint8Array(h2);
    }
  }
}
n$2(Wn, "toIterator");
const gi = (ze = class {
  constructor(o2 = [], a2 = {}) {
    be(this, ve, []);
    be(this, zt, "");
    be(this, bt, 0);
    be(this, Cr, "transparent");
    if (typeof o2 != "object" || o2 === null) throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
    if (typeof o2[Symbol.iterator] != "function") throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
    if (typeof a2 != "object" && typeof a2 != "function") throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
    a2 === null && (a2 = {});
    const f2 = new TextEncoder();
    for (const p2 of o2) {
      let h2;
      ArrayBuffer.isView(p2) ? h2 = new Uint8Array(p2.buffer.slice(p2.byteOffset, p2.byteOffset + p2.byteLength)) : p2 instanceof ArrayBuffer ? h2 = new Uint8Array(p2.slice(0)) : p2 instanceof ze ? h2 = p2 : h2 = f2.encode(`${p2}`), X(this, bt, O$1(this, bt) + (ArrayBuffer.isView(h2) ? h2.byteLength : h2.size)), O$1(this, ve).push(h2);
    }
    X(this, Cr, `${a2.endings === void 0 ? "transparent" : a2.endings}`);
    const l2 = a2.type === void 0 ? "" : String(a2.type);
    X(this, zt, /^[\x20-\x7E]*$/.test(l2) ? l2 : "");
  }
  get size() {
    return O$1(this, bt);
  }
  get type() {
    return O$1(this, zt);
  }
  async text() {
    const o2 = new TextDecoder();
    let a2 = "";
    for await (const f2 of Wn(O$1(this, ve), false)) a2 += o2.decode(f2, { stream: true });
    return a2 += o2.decode(), a2;
  }
  async arrayBuffer() {
    const o2 = new Uint8Array(this.size);
    let a2 = 0;
    for await (const f2 of Wn(O$1(this, ve), false)) o2.set(f2, a2), a2 += f2.length;
    return o2.buffer;
  }
  stream() {
    const o2 = Wn(O$1(this, ve), true);
    return new globalThis.ReadableStream({ type: "bytes", async pull(a2) {
      const f2 = await o2.next();
      f2.done ? a2.close() : a2.enqueue(f2.value);
    }, async cancel() {
      await o2.return();
    } });
  }
  slice(o2 = 0, a2 = this.size, f2 = "") {
    const { size: l2 } = this;
    let p2 = o2 < 0 ? Math.max(l2 + o2, 0) : Math.min(o2, l2), h2 = a2 < 0 ? Math.max(l2 + a2, 0) : Math.min(a2, l2);
    const S2 = Math.max(h2 - p2, 0), v2 = O$1(this, ve), w2 = [];
    let A2 = 0;
    for (const b2 of v2) {
      if (A2 >= S2) break;
      const q = ArrayBuffer.isView(b2) ? b2.byteLength : b2.size;
      if (p2 && q <= p2) p2 -= q, h2 -= q;
      else {
        let g2;
        ArrayBuffer.isView(b2) ? (g2 = b2.subarray(p2, Math.min(q, h2)), A2 += g2.byteLength) : (g2 = b2.slice(p2, Math.min(q, h2)), A2 += g2.size), h2 -= q, w2.push(g2), p2 = 0;
      }
    }
    const T2 = new ze([], { type: String(f2).toLowerCase() });
    return X(T2, bt, S2), X(T2, ve, w2), T2;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](o2) {
    return o2 && typeof o2 == "object" && typeof o2.constructor == "function" && (typeof o2.stream == "function" || typeof o2.arrayBuffer == "function") && /^(Blob|File)$/.test(o2[Symbol.toStringTag]);
  }
}, ve = /* @__PURE__ */ new WeakMap(), zt = /* @__PURE__ */ new WeakMap(), bt = /* @__PURE__ */ new WeakMap(), Cr = /* @__PURE__ */ new WeakMap(), n$2(ze, "Blob"), ze);
Object.defineProperties(gi.prototype, { size: { enumerable: true }, type: { enumerable: true }, slice: { enumerable: true } });
const ut = gi, Vs = (mt = class extends ut {
  constructor(a2, f2, l2 = {}) {
    if (arguments.length < 2) throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
    super(a2, l2);
    be(this, It, 0);
    be(this, Ft, "");
    l2 === null && (l2 = {});
    const p2 = l2.lastModified === void 0 ? Date.now() : Number(l2.lastModified);
    Number.isNaN(p2) || X(this, It, p2), X(this, Ft, String(f2));
  }
  get name() {
    return O$1(this, Ft);
  }
  get lastModified() {
    return O$1(this, It);
  }
  get [Symbol.toStringTag]() {
    return "File";
  }
  static [Symbol.hasInstance](a2) {
    return !!a2 && a2 instanceof ut && /^(File)$/.test(a2[Symbol.toStringTag]);
  }
}, It = /* @__PURE__ */ new WeakMap(), Ft = /* @__PURE__ */ new WeakMap(), n$2(mt, "File"), mt), qn = Vs;
var { toStringTag: Wt, iterator: Qs, hasInstance: Ys } = Symbol, _i = Math.random, Gs = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(","), Si = n$2((i2, o2, a2) => (i2 += "", /^(Blob|File)$/.test(o2 && o2[Wt]) ? [(a2 = a2 !== void 0 ? a2 + "" : o2[Wt] == "File" ? o2.name : "blob", i2), o2.name !== a2 || o2[Wt] == "blob" ? new qn([o2], a2, o2) : o2] : [i2, o2 + ""]), "f"), On = n$2((i2, o2) => (o2 ? i2 : i2.replace(/\r?\n|\r/g, `\r
`)).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"), "e$1"), Ue = n$2((i2, o2, a2) => {
  if (o2.length < a2) throw new TypeError(`Failed to execute '${i2}' on 'FormData': ${a2} arguments required, but only ${o2.length} present.`);
}, "x");
const br = (yt = class {
  constructor(...o2) {
    be(this, ee, []);
    if (o2.length) throw new TypeError("Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.");
  }
  get [Wt]() {
    return "FormData";
  }
  [Qs]() {
    return this.entries();
  }
  static [Ys](o2) {
    return o2 && typeof o2 == "object" && o2[Wt] === "FormData" && !Gs.some((a2) => typeof o2[a2] != "function");
  }
  append(...o2) {
    Ue("append", arguments, 2), O$1(this, ee).push(Si(...o2));
  }
  delete(o2) {
    Ue("delete", arguments, 1), o2 += "", X(this, ee, O$1(this, ee).filter(([a2]) => a2 !== o2));
  }
  get(o2) {
    Ue("get", arguments, 1), o2 += "";
    for (var a2 = O$1(this, ee), f2 = a2.length, l2 = 0; l2 < f2; l2++) if (a2[l2][0] === o2) return a2[l2][1];
    return null;
  }
  getAll(o2, a2) {
    return Ue("getAll", arguments, 1), a2 = [], o2 += "", O$1(this, ee).forEach((f2) => f2[0] === o2 && a2.push(f2[1])), a2;
  }
  has(o2) {
    return Ue("has", arguments, 1), o2 += "", O$1(this, ee).some((a2) => a2[0] === o2);
  }
  forEach(o2, a2) {
    Ue("forEach", arguments, 1);
    for (var [f2, l2] of this) o2.call(a2, l2, f2, this);
  }
  set(...o2) {
    Ue("set", arguments, 2);
    var a2 = [], f2 = true;
    o2 = Si(...o2), O$1(this, ee).forEach((l2) => {
      l2[0] === o2[0] ? f2 && (f2 = !a2.push(o2)) : a2.push(l2);
    }), f2 && a2.push(o2), X(this, ee, a2);
  }
  *entries() {
    yield* O$1(this, ee);
  }
  *keys() {
    for (var [o2] of this) yield o2;
  }
  *values() {
    for (var [, o2] of this) yield o2;
  }
}, ee = /* @__PURE__ */ new WeakMap(), n$2(yt, "FormData"), yt);
function Zs(i2, o2 = ut) {
  var a2 = `${_i()}${_i()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), f2 = [], l2 = `--${a2}\r
Content-Disposition: form-data; name="`;
  return i2.forEach((p2, h2) => typeof p2 == "string" ? f2.push(l2 + On(h2) + `"\r
\r
${p2.replace(new RegExp("\\r(?!\\n)|(?<!\\r)\\n", "g"), `\r
`)}\r
`) : f2.push(l2 + On(h2) + `"; filename="${On(p2.name, 1)}"\r
Content-Type: ${p2.type || "application/octet-stream"}\r
\r
`, p2, `\r
`)), f2.push(`--${a2}--`), new o2(f2, { type: "multipart/form-data; boundary=" + a2 });
}
n$2(Zs, "formDataToBlob");
const Un = class Un2 extends Error {
  constructor(o2, a2) {
    super(o2), Error.captureStackTrace(this, this.constructor), this.type = a2;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
n$2(Un, "FetchBaseError");
let ft = Un;
const xn = class xn2 extends ft {
  constructor(o2, a2, f2) {
    super(o2, a2), f2 && (this.code = this.errno = f2.code, this.erroredSysCall = f2.syscall);
  }
};
n$2(xn, "FetchError");
let G = xn;
const mr = Symbol.toStringTag, wi = n$2((i2) => typeof i2 == "object" && typeof i2.append == "function" && typeof i2.delete == "function" && typeof i2.get == "function" && typeof i2.getAll == "function" && typeof i2.has == "function" && typeof i2.set == "function" && typeof i2.sort == "function" && i2[mr] === "URLSearchParams", "isURLSearchParameters"), yr = n$2((i2) => i2 && typeof i2 == "object" && typeof i2.arrayBuffer == "function" && typeof i2.type == "string" && typeof i2.stream == "function" && typeof i2.constructor == "function" && /^(Blob|File)$/.test(i2[mr]), "isBlob"), Ks = n$2((i2) => typeof i2 == "object" && (i2[mr] === "AbortSignal" || i2[mr] === "EventTarget"), "isAbortSignal"), Js = n$2((i2, o2) => {
  const a2 = new URL(o2).hostname, f2 = new URL(i2).hostname;
  return a2 === f2 || a2.endsWith(`.${f2}`);
}, "isDomainOrSubdomain"), Xs = n$2((i2, o2) => {
  const a2 = new URL(o2).protocol, f2 = new URL(i2).protocol;
  return a2 === f2;
}, "isSameProtocol"), el = promisify(me.pipeline), H = /* @__PURE__ */ Symbol("Body internals"), Nn = class Nn2 {
  constructor(o2, { size: a2 = 0 } = {}) {
    let f2 = null;
    o2 === null ? o2 = null : wi(o2) ? o2 = Buffer$1.from(o2.toString()) : yr(o2) || Buffer$1.isBuffer(o2) || (types.isAnyArrayBuffer(o2) ? o2 = Buffer$1.from(o2) : ArrayBuffer.isView(o2) ? o2 = Buffer$1.from(o2.buffer, o2.byteOffset, o2.byteLength) : o2 instanceof me || (o2 instanceof br ? (o2 = Zs(o2), f2 = o2.type.split("=")[1]) : o2 = Buffer$1.from(String(o2))));
    let l2 = o2;
    Buffer$1.isBuffer(o2) ? l2 = me.Readable.from(o2) : yr(o2) && (l2 = me.Readable.from(o2.stream())), this[H] = { body: o2, stream: l2, boundary: f2, disturbed: false, error: null }, this.size = a2, o2 instanceof me && o2.on("error", (p2) => {
      const h2 = p2 instanceof ft ? p2 : new G(`Invalid response body while trying to fetch ${this.url}: ${p2.message}`, "system", p2);
      this[H].error = h2;
    });
  }
  get body() {
    return this[H].stream;
  }
  get bodyUsed() {
    return this[H].disturbed;
  }
  async arrayBuffer() {
    const { buffer: o2, byteOffset: a2, byteLength: f2 } = await zn(this);
    return o2.slice(a2, a2 + f2);
  }
  async formData() {
    const o2 = this.headers.get("content-type");
    if (o2.startsWith("application/x-www-form-urlencoded")) {
      const f2 = new br(), l2 = new URLSearchParams(await this.text());
      for (const [p2, h2] of l2) f2.append(p2, h2);
      return f2;
    }
    const { toFormData: a2 } = await import("./assets/multipart-parser-CXwME_t2.js");
    return a2(this.body, o2);
  }
  async blob() {
    const o2 = this.headers && this.headers.get("content-type") || this[H].body && this[H].body.type || "", a2 = await this.arrayBuffer();
    return new ut([a2], { type: o2 });
  }
  async json() {
    const o2 = await this.text();
    return JSON.parse(o2);
  }
  async text() {
    const o2 = await zn(this);
    return new TextDecoder().decode(o2);
  }
  buffer() {
    return zn(this);
  }
};
n$2(Nn, "Body");
let xe = Nn;
xe.prototype.buffer = deprecate(xe.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer"), Object.defineProperties(xe.prototype, { body: { enumerable: true }, bodyUsed: { enumerable: true }, arrayBuffer: { enumerable: true }, blob: { enumerable: true }, json: { enumerable: true }, text: { enumerable: true }, data: { get: deprecate(() => {
}, "data doesn't exist, use json(), text(), arrayBuffer(), or body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (response)") } });
async function zn(i2) {
  if (i2[H].disturbed) throw new TypeError(`body used already for: ${i2.url}`);
  if (i2[H].disturbed = true, i2[H].error) throw i2[H].error;
  const { body: o2 } = i2;
  if (o2 === null) return Buffer$1.alloc(0);
  if (!(o2 instanceof me)) return Buffer$1.alloc(0);
  const a2 = [];
  let f2 = 0;
  try {
    for await (const l2 of o2) {
      if (i2.size > 0 && f2 + l2.length > i2.size) {
        const p2 = new G(`content size at ${i2.url} over limit: ${i2.size}`, "max-size");
        throw o2.destroy(p2), p2;
      }
      f2 += l2.length, a2.push(l2);
    }
  } catch (l2) {
    throw l2 instanceof ft ? l2 : new G(`Invalid response body while trying to fetch ${i2.url}: ${l2.message}`, "system", l2);
  }
  if (o2.readableEnded === true || o2._readableState.ended === true) try {
    return a2.every((l2) => typeof l2 == "string") ? Buffer$1.from(a2.join("")) : Buffer$1.concat(a2, f2);
  } catch (l2) {
    throw new G(`Could not create Buffer from response body for ${i2.url}: ${l2.message}`, "system", l2);
  }
  else throw new G(`Premature close of server response while trying to fetch ${i2.url}`);
}
n$2(zn, "consumeBody");
const In = n$2((i2, o2) => {
  let a2, f2, { body: l2 } = i2[H];
  if (i2.bodyUsed) throw new Error("cannot clone body after it is used");
  return l2 instanceof me && typeof l2.getBoundary != "function" && (a2 = new PassThrough({ highWaterMark: o2 }), f2 = new PassThrough({ highWaterMark: o2 }), l2.pipe(a2), l2.pipe(f2), i2[H].stream = a2, l2 = f2), l2;
}, "clone"), tl = deprecate((i2) => i2.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167"), Ri = n$2((i2, o2) => i2 === null ? null : typeof i2 == "string" ? "text/plain;charset=UTF-8" : wi(i2) ? "application/x-www-form-urlencoded;charset=UTF-8" : yr(i2) ? i2.type || null : Buffer$1.isBuffer(i2) || types.isAnyArrayBuffer(i2) || ArrayBuffer.isView(i2) ? null : i2 instanceof br ? `multipart/form-data; boundary=${o2[H].boundary}` : i2 && typeof i2.getBoundary == "function" ? `multipart/form-data;boundary=${tl(i2)}` : i2 instanceof me ? null : "text/plain;charset=UTF-8", "extractContentType"), rl = n$2((i2) => {
  const { body: o2 } = i2[H];
  return o2 === null ? 0 : yr(o2) ? o2.size : Buffer$1.isBuffer(o2) ? o2.length : o2 && typeof o2.getLengthSync == "function" && o2.hasKnownLength && o2.hasKnownLength() ? o2.getLengthSync() : null;
}, "getTotalBytes"), nl = n$2(async (i2, { body: o2 }) => {
  o2 === null ? i2.end() : await el(o2, i2);
}, "writeToStream"), gr = typeof Bt.validateHeaderName == "function" ? Bt.validateHeaderName : (i2) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(i2)) {
    const o2 = new TypeError(`Header name must be a valid HTTP token [${i2}]`);
    throw Object.defineProperty(o2, "code", { value: "ERR_INVALID_HTTP_TOKEN" }), o2;
  }
}, Fn = typeof Bt.validateHeaderValue == "function" ? Bt.validateHeaderValue : (i2, o2) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(o2)) {
    const a2 = new TypeError(`Invalid character in header content ["${i2}"]`);
    throw Object.defineProperty(a2, "code", { value: "ERR_INVALID_CHAR" }), a2;
  }
}, Pr = class Pr2 extends URLSearchParams {
  constructor(o2) {
    let a2 = [];
    if (o2 instanceof Pr2) {
      const f2 = o2.raw();
      for (const [l2, p2] of Object.entries(f2)) a2.push(...p2.map((h2) => [l2, h2]));
    } else if (o2 != null) if (typeof o2 == "object" && !types.isBoxedPrimitive(o2)) {
      const f2 = o2[Symbol.iterator];
      if (f2 == null) a2.push(...Object.entries(o2));
      else {
        if (typeof f2 != "function") throw new TypeError("Header pairs must be iterable");
        a2 = [...o2].map((l2) => {
          if (typeof l2 != "object" || types.isBoxedPrimitive(l2)) throw new TypeError("Each header pair must be an iterable object");
          return [...l2];
        }).map((l2) => {
          if (l2.length !== 2) throw new TypeError("Each header pair must be a name/value tuple");
          return [...l2];
        });
      }
    } else throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    return a2 = a2.length > 0 ? a2.map(([f2, l2]) => (gr(f2), Fn(f2, String(l2)), [String(f2).toLowerCase(), String(l2)])) : void 0, super(a2), new Proxy(this, { get(f2, l2, p2) {
      switch (l2) {
        case "append":
        case "set":
          return (h2, S2) => (gr(h2), Fn(h2, String(S2)), URLSearchParams.prototype[l2].call(f2, String(h2).toLowerCase(), String(S2)));
        case "delete":
        case "has":
        case "getAll":
          return (h2) => (gr(h2), URLSearchParams.prototype[l2].call(f2, String(h2).toLowerCase()));
        case "keys":
          return () => (f2.sort(), new Set(URLSearchParams.prototype.keys.call(f2)).keys());
        default:
          return Reflect.get(f2, l2, p2);
      }
    } });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(o2) {
    const a2 = this.getAll(o2);
    if (a2.length === 0) return null;
    let f2 = a2.join(", ");
    return /^content-encoding$/i.test(o2) && (f2 = f2.toLowerCase()), f2;
  }
  forEach(o2, a2 = void 0) {
    for (const f2 of this.keys()) Reflect.apply(o2, a2, [this.get(f2), f2, this]);
  }
  *values() {
    for (const o2 of this.keys()) yield this.get(o2);
  }
  *entries() {
    for (const o2 of this.keys()) yield [o2, this.get(o2)];
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((o2, a2) => (o2[a2] = this.getAll(a2), o2), {});
  }
  [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((o2, a2) => {
      const f2 = this.getAll(a2);
      return a2 === "host" ? o2[a2] = f2[0] : o2[a2] = f2.length > 1 ? f2 : f2[0], o2;
    }, {});
  }
};
n$2(Pr, "Headers");
let ye = Pr;
Object.defineProperties(ye.prototype, ["get", "entries", "forEach", "values"].reduce((i2, o2) => (i2[o2] = { enumerable: true }, i2), {}));
function ol(i2 = []) {
  return new ye(i2.reduce((o2, a2, f2, l2) => (f2 % 2 === 0 && o2.push(l2.slice(f2, f2 + 2)), o2), []).filter(([o2, a2]) => {
    try {
      return gr(o2), Fn(o2, String(a2)), true;
    } catch {
      return false;
    }
  }));
}
n$2(ol, "fromRawHeaders");
const il = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]), jn = n$2((i2) => il.has(i2), "isRedirect"), se = /* @__PURE__ */ Symbol("Response internals"), Ne = class Ne2 extends xe {
  constructor(o2 = null, a2 = {}) {
    super(o2, a2);
    const f2 = a2.status != null ? a2.status : 200, l2 = new ye(a2.headers);
    if (o2 !== null && !l2.has("Content-Type")) {
      const p2 = Ri(o2, this);
      p2 && l2.append("Content-Type", p2);
    }
    this[se] = { type: "default", url: a2.url, status: f2, statusText: a2.statusText || "", headers: l2, counter: a2.counter, highWaterMark: a2.highWaterMark };
  }
  get type() {
    return this[se].type;
  }
  get url() {
    return this[se].url || "";
  }
  get status() {
    return this[se].status;
  }
  get ok() {
    return this[se].status >= 200 && this[se].status < 300;
  }
  get redirected() {
    return this[se].counter > 0;
  }
  get statusText() {
    return this[se].statusText;
  }
  get headers() {
    return this[se].headers;
  }
  get highWaterMark() {
    return this[se].highWaterMark;
  }
  clone() {
    return new Ne2(In(this, this.highWaterMark), { type: this.type, url: this.url, status: this.status, statusText: this.statusText, headers: this.headers, ok: this.ok, redirected: this.redirected, size: this.size, highWaterMark: this.highWaterMark });
  }
  static redirect(o2, a2 = 302) {
    if (!jn(a2)) throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    return new Ne2(null, { headers: { location: new URL(o2).toString() }, status: a2 });
  }
  static error() {
    const o2 = new Ne2(null, { status: 0, statusText: "" });
    return o2[se].type = "error", o2;
  }
  static json(o2 = void 0, a2 = {}) {
    const f2 = JSON.stringify(o2);
    if (f2 === void 0) throw new TypeError("data is not JSON serializable");
    const l2 = new ye(a2 && a2.headers);
    return l2.has("content-type") || l2.set("content-type", "application/json"), new Ne2(f2, { ...a2, headers: l2 });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
n$2(Ne, "Response");
let le = Ne;
Object.defineProperties(le.prototype, { type: { enumerable: true }, url: { enumerable: true }, status: { enumerable: true }, ok: { enumerable: true }, redirected: { enumerable: true }, statusText: { enumerable: true }, headers: { enumerable: true }, clone: { enumerable: true } });
const al = n$2((i2) => {
  if (i2.search) return i2.search;
  const o2 = i2.href.length - 1, a2 = i2.hash || (i2.href[o2] === "#" ? "#" : "");
  return i2.href[o2 - a2.length] === "?" ? "?" : "";
}, "getSearch");
function Ti(i2, o2 = false) {
  return i2 == null || (i2 = new URL(i2), /^(about|blob|data):$/.test(i2.protocol)) ? "no-referrer" : (i2.username = "", i2.password = "", i2.hash = "", o2 && (i2.pathname = "", i2.search = ""), i2);
}
n$2(Ti, "stripURLForUseAsAReferrer");
const Ci = /* @__PURE__ */ new Set(["", "no-referrer", "no-referrer-when-downgrade", "same-origin", "origin", "strict-origin", "origin-when-cross-origin", "strict-origin-when-cross-origin", "unsafe-url"]), sl = "strict-origin-when-cross-origin";
function ll(i2) {
  if (!Ci.has(i2)) throw new TypeError(`Invalid referrerPolicy: ${i2}`);
  return i2;
}
n$2(ll, "validateReferrerPolicy");
function ul(i2) {
  if (/^(http|ws)s:$/.test(i2.protocol)) return true;
  const o2 = i2.host.replace(/(^\[)|(]$)/g, ""), a2 = isIP(o2);
  return a2 === 4 && /^127\./.test(o2) || a2 === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(o2) ? true : i2.host === "localhost" || i2.host.endsWith(".localhost") ? false : i2.protocol === "file:";
}
n$2(ul, "isOriginPotentiallyTrustworthy");
function ct(i2) {
  return /^about:(blank|srcdoc)$/.test(i2) || i2.protocol === "data:" || /^(blob|filesystem):$/.test(i2.protocol) ? true : ul(i2);
}
n$2(ct, "isUrlPotentiallyTrustworthy");
function fl(i2, { referrerURLCallback: o2, referrerOriginCallback: a2 } = {}) {
  if (i2.referrer === "no-referrer" || i2.referrerPolicy === "") return null;
  const f2 = i2.referrerPolicy;
  if (i2.referrer === "about:client") return "no-referrer";
  const l2 = i2.referrer;
  let p2 = Ti(l2), h2 = Ti(l2, true);
  p2.toString().length > 4096 && (p2 = h2), o2 && (p2 = o2(p2)), a2 && (h2 = a2(h2));
  const S2 = new URL(i2.url);
  switch (f2) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return h2;
    case "unsafe-url":
      return p2;
    case "strict-origin":
      return ct(p2) && !ct(S2) ? "no-referrer" : h2.toString();
    case "strict-origin-when-cross-origin":
      return p2.origin === S2.origin ? p2 : ct(p2) && !ct(S2) ? "no-referrer" : h2;
    case "same-origin":
      return p2.origin === S2.origin ? p2 : "no-referrer";
    case "origin-when-cross-origin":
      return p2.origin === S2.origin ? p2 : h2;
    case "no-referrer-when-downgrade":
      return ct(p2) && !ct(S2) ? "no-referrer" : p2;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${f2}`);
  }
}
n$2(fl, "determineRequestsReferrer");
function cl(i2) {
  const o2 = (i2.get("referrer-policy") || "").split(/[,\s]+/);
  let a2 = "";
  for (const f2 of o2) f2 && Ci.has(f2) && (a2 = f2);
  return a2;
}
n$2(cl, "parseReferrerPolicyFromHeader");
const $$1 = /* @__PURE__ */ Symbol("Request internals"), qt = n$2((i2) => typeof i2 == "object" && typeof i2[$$1] == "object", "isRequest"), dl = deprecate(() => {
}, ".data is not a valid RequestInit property, use .body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (request)"), vr = class vr2 extends xe {
  constructor(o2, a2 = {}) {
    let f2;
    if (qt(o2) ? f2 = new URL(o2.url) : (f2 = new URL(o2), o2 = {}), f2.username !== "" || f2.password !== "") throw new TypeError(`${f2} is an url with embedded credentials.`);
    let l2 = a2.method || o2.method || "GET";
    if (/^(delete|get|head|options|post|put)$/i.test(l2) && (l2 = l2.toUpperCase()), !qt(a2) && "data" in a2 && dl(), (a2.body != null || qt(o2) && o2.body !== null) && (l2 === "GET" || l2 === "HEAD")) throw new TypeError("Request with GET/HEAD method cannot have body");
    const p2 = a2.body ? a2.body : qt(o2) && o2.body !== null ? In(o2) : null;
    super(p2, { size: a2.size || o2.size || 0 });
    const h2 = new ye(a2.headers || o2.headers || {});
    if (p2 !== null && !h2.has("Content-Type")) {
      const w2 = Ri(p2, this);
      w2 && h2.set("Content-Type", w2);
    }
    let S2 = qt(o2) ? o2.signal : null;
    if ("signal" in a2 && (S2 = a2.signal), S2 != null && !Ks(S2)) throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
    let v2 = a2.referrer == null ? o2.referrer : a2.referrer;
    if (v2 === "") v2 = "no-referrer";
    else if (v2) {
      const w2 = new URL(v2);
      v2 = /^about:(\/\/)?client$/.test(w2) ? "client" : w2;
    } else v2 = void 0;
    this[$$1] = { method: l2, redirect: a2.redirect || o2.redirect || "follow", headers: h2, parsedURL: f2, signal: S2, referrer: v2 }, this.follow = a2.follow === void 0 ? o2.follow === void 0 ? 20 : o2.follow : a2.follow, this.compress = a2.compress === void 0 ? o2.compress === void 0 ? true : o2.compress : a2.compress, this.counter = a2.counter || o2.counter || 0, this.agent = a2.agent || o2.agent, this.highWaterMark = a2.highWaterMark || o2.highWaterMark || 16384, this.insecureHTTPParser = a2.insecureHTTPParser || o2.insecureHTTPParser || false, this.referrerPolicy = a2.referrerPolicy || o2.referrerPolicy || "";
  }
  get method() {
    return this[$$1].method;
  }
  get url() {
    return format(this[$$1].parsedURL);
  }
  get headers() {
    return this[$$1].headers;
  }
  get redirect() {
    return this[$$1].redirect;
  }
  get signal() {
    return this[$$1].signal;
  }
  get referrer() {
    if (this[$$1].referrer === "no-referrer") return "";
    if (this[$$1].referrer === "client") return "about:client";
    if (this[$$1].referrer) return this[$$1].referrer.toString();
  }
  get referrerPolicy() {
    return this[$$1].referrerPolicy;
  }
  set referrerPolicy(o2) {
    this[$$1].referrerPolicy = ll(o2);
  }
  clone() {
    return new vr2(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
n$2(vr, "Request");
let dt = vr;
Object.defineProperties(dt.prototype, { method: { enumerable: true }, url: { enumerable: true }, headers: { enumerable: true }, redirect: { enumerable: true }, clone: { enumerable: true }, signal: { enumerable: true }, referrer: { enumerable: true }, referrerPolicy: { enumerable: true } });
const hl = n$2((i2) => {
  const { parsedURL: o2 } = i2[$$1], a2 = new ye(i2[$$1].headers);
  a2.has("Accept") || a2.set("Accept", "*/*");
  let f2 = null;
  if (i2.body === null && /^(post|put)$/i.test(i2.method) && (f2 = "0"), i2.body !== null) {
    const S2 = rl(i2);
    typeof S2 == "number" && !Number.isNaN(S2) && (f2 = String(S2));
  }
  f2 && a2.set("Content-Length", f2), i2.referrerPolicy === "" && (i2.referrerPolicy = sl), i2.referrer && i2.referrer !== "no-referrer" ? i2[$$1].referrer = fl(i2) : i2[$$1].referrer = "no-referrer", i2[$$1].referrer instanceof URL && a2.set("Referer", i2.referrer), a2.has("User-Agent") || a2.set("User-Agent", "node-fetch"), i2.compress && !a2.has("Accept-Encoding") && a2.set("Accept-Encoding", "gzip, deflate, br");
  let { agent: l2 } = i2;
  typeof l2 == "function" && (l2 = l2(o2));
  const p2 = al(o2), h2 = { path: o2.pathname + p2, method: i2.method, headers: a2[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")](), insecureHTTPParser: i2.insecureHTTPParser, agent: l2 };
  return { parsedURL: o2, options: h2 };
}, "getNodeRequestOptions"), Hn = class Hn2 extends ft {
  constructor(o2, a2 = "aborted") {
    super(o2, a2);
  }
};
n$2(Hn, "AbortError");
let _r = Hn;
var Ln, Pi;
function pl() {
  if (Pi) return Ln;
  if (Pi = 1, !globalThis.DOMException) try {
    const { MessageChannel: i2 } = require("worker_threads"), o2 = new i2().port1, a2 = new ArrayBuffer();
    o2.postMessage(a2, [a2, a2]);
  } catch (i2) {
    i2.constructor.name === "DOMException" && (globalThis.DOMException = i2.constructor);
  }
  return Ln = globalThis.DOMException, Ln;
}
n$2(pl, "requireNodeDomexception");
var bl = pl();
const ml = f$1(bl), { stat: $n } = promises;
n$2((i2, o2) => vi(statSync(i2), i2, o2), "blobFromSync");
n$2((i2, o2) => $n(i2).then((a2) => vi(a2, i2, o2)), "blobFrom");
n$2((i2, o2) => $n(i2).then((a2) => Ei(a2, i2, o2)), "fileFrom");
n$2((i2, o2) => Ei(statSync(i2), i2, o2), "fileFromSync");
const vi = n$2((i2, o2, a2 = "") => new ut([new Sr({ path: o2, size: i2.size, lastModified: i2.mtimeMs, start: 0 })], { type: a2 }), "fromBlob"), Ei = n$2((i2, o2, a2 = "") => new qn([new Sr({ path: o2, size: i2.size, lastModified: i2.mtimeMs, start: 0 })], basename(o2), { type: a2, lastModified: i2.mtimeMs }), "fromFile"), Er = class Er2 {
  constructor(o2) {
    be(this, He);
    be(this, Ve);
    X(this, He, o2.path), X(this, Ve, o2.start), this.size = o2.size, this.lastModified = o2.lastModified;
  }
  slice(o2, a2) {
    return new Er2({ path: O$1(this, He), lastModified: this.lastModified, size: a2 - o2, start: O$1(this, Ve) + o2 });
  }
  async *stream() {
    const { mtimeMs: o2 } = await $n(O$1(this, He));
    if (o2 > this.lastModified) throw new ml("The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.", "NotReadableError");
    yield* createReadStream(O$1(this, He), { start: O$1(this, Ve), end: O$1(this, Ve) + this.size - 1 });
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
};
He = /* @__PURE__ */ new WeakMap(), Ve = /* @__PURE__ */ new WeakMap(), n$2(Er, "BlobDataItem");
let Sr = Er;
const wl = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
async function Ai(i2, o2) {
  return new Promise((a2, f2) => {
    const l2 = new dt(i2, o2), { parsedURL: p2, options: h2 } = hl(l2);
    if (!wl.has(p2.protocol)) throw new TypeError(`node-fetch cannot load ${i2}. URL scheme "${p2.protocol.replace(/:$/, "")}" is not supported.`);
    if (p2.protocol === "data:") {
      const g2 = Us(l2.url), V = new le(g2, { headers: { "Content-Type": g2.typeFull } });
      a2(V);
      return;
    }
    const S2 = (p2.protocol === "https:" ? zs : Bt).request, { signal: v2 } = l2;
    let w2 = null;
    const A2 = n$2(() => {
      const g2 = new _r("The operation was aborted.");
      f2(g2), l2.body && l2.body instanceof me.Readable && l2.body.destroy(g2), !(!w2 || !w2.body) && w2.body.emit("error", g2);
    }, "abort");
    if (v2 && v2.aborted) {
      A2();
      return;
    }
    const T2 = n$2(() => {
      A2(), q();
    }, "abortAndFinalize"), b2 = S2(p2.toString(), h2);
    v2 && v2.addEventListener("abort", T2);
    const q = n$2(() => {
      b2.abort(), v2 && v2.removeEventListener("abort", T2);
    }, "finalize");
    b2.on("error", (g2) => {
      f2(new G(`request to ${l2.url} failed, reason: ${g2.message}`, "system", g2)), q();
    }), Rl(b2, (g2) => {
      w2 && w2.body && w2.body.destroy(g2);
    }), process.version < "v14" && b2.on("socket", (g2) => {
      let V;
      g2.prependListener("end", () => {
        V = g2._eventsCount;
      }), g2.prependListener("close", (I2) => {
        if (w2 && V < g2._eventsCount && !I2) {
          const F = new Error("Premature close");
          F.code = "ERR_STREAM_PREMATURE_CLOSE", w2.body.emit("error", F);
        }
      });
    }), b2.on("response", (g2) => {
      b2.setTimeout(0);
      const V = ol(g2.rawHeaders);
      if (jn(g2.statusCode)) {
        const z = V.get("Location");
        let j2 = null;
        try {
          j2 = z === null ? null : new URL(z, l2.url);
        } catch {
          if (l2.redirect !== "manual") {
            f2(new G(`uri requested responds with an invalid redirect URL: ${z}`, "invalid-redirect")), q();
            return;
          }
        }
        switch (l2.redirect) {
          case "error":
            f2(new G(`uri requested responds with a redirect, redirect mode is set to error: ${l2.url}`, "no-redirect")), q();
            return;
          case "manual":
            break;
          case "follow": {
            if (j2 === null) break;
            if (l2.counter >= l2.follow) {
              f2(new G(`maximum redirect reached at: ${l2.url}`, "max-redirect")), q();
              return;
            }
            const U2 = { headers: new ye(l2.headers), follow: l2.follow, counter: l2.counter + 1, agent: l2.agent, compress: l2.compress, method: l2.method, body: In(l2), signal: l2.signal, size: l2.size, referrer: l2.referrer, referrerPolicy: l2.referrerPolicy };
            if (!Js(l2.url, j2) || !Xs(l2.url, j2)) for (const jt of ["authorization", "www-authenticate", "cookie", "cookie2"]) U2.headers.delete(jt);
            if (g2.statusCode !== 303 && l2.body && o2.body instanceof me.Readable) {
              f2(new G("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), q();
              return;
            }
            (g2.statusCode === 303 || (g2.statusCode === 301 || g2.statusCode === 302) && l2.method === "POST") && (U2.method = "GET", U2.body = void 0, U2.headers.delete("content-length"));
            const D2 = cl(V);
            D2 && (U2.referrerPolicy = D2), a2(Ai(new dt(j2, U2))), q();
            return;
          }
          default:
            return f2(new TypeError(`Redirect option '${l2.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      v2 && g2.once("end", () => {
        v2.removeEventListener("abort", T2);
      });
      let I2 = pipeline(g2, new PassThrough(), (z) => {
        z && f2(z);
      });
      process.version < "v12.10" && g2.on("aborted", T2);
      const F = { url: l2.url, status: g2.statusCode, statusText: g2.statusMessage, headers: V, size: l2.size, counter: l2.counter, highWaterMark: l2.highWaterMark }, Q = V.get("Content-Encoding");
      if (!l2.compress || l2.method === "HEAD" || Q === null || g2.statusCode === 204 || g2.statusCode === 304) {
        w2 = new le(I2, F), a2(w2);
        return;
      }
      const ge = { flush: st.Z_SYNC_FLUSH, finishFlush: st.Z_SYNC_FLUSH };
      if (Q === "gzip" || Q === "x-gzip") {
        I2 = pipeline(I2, st.createGunzip(ge), (z) => {
          z && f2(z);
        }), w2 = new le(I2, F), a2(w2);
        return;
      }
      if (Q === "deflate" || Q === "x-deflate") {
        const z = pipeline(g2, new PassThrough(), (j2) => {
          j2 && f2(j2);
        });
        z.once("data", (j2) => {
          (j2[0] & 15) === 8 ? I2 = pipeline(I2, st.createInflate(), (U2) => {
            U2 && f2(U2);
          }) : I2 = pipeline(I2, st.createInflateRaw(), (U2) => {
            U2 && f2(U2);
          }), w2 = new le(I2, F), a2(w2);
        }), z.once("end", () => {
          w2 || (w2 = new le(I2, F), a2(w2));
        });
        return;
      }
      if (Q === "br") {
        I2 = pipeline(I2, st.createBrotliDecompress(), (z) => {
          z && f2(z);
        }), w2 = new le(I2, F), a2(w2);
        return;
      }
      w2 = new le(I2, F), a2(w2);
    }), nl(b2, l2).catch(f2);
  });
}
n$2(Ai, "fetch$1");
function Rl(i2, o2) {
  const a2 = Buffer$1.from(`0\r
\r
`);
  let f2 = false, l2 = false, p2;
  i2.on("response", (h2) => {
    const { headers: S2 } = h2;
    f2 = S2["transfer-encoding"] === "chunked" && !S2["content-length"];
  }), i2.on("socket", (h2) => {
    const S2 = n$2(() => {
      if (f2 && !l2) {
        const w2 = new Error("Premature close");
        w2.code = "ERR_STREAM_PREMATURE_CLOSE", o2(w2);
      }
    }, "onSocketClose"), v2 = n$2((w2) => {
      l2 = Buffer$1.compare(w2.slice(-5), a2) === 0, !l2 && p2 && (l2 = Buffer$1.compare(p2.slice(-3), a2.slice(0, 3)) === 0 && Buffer$1.compare(w2.slice(-2), a2.slice(3)) === 0), p2 = w2;
    }, "onData");
    h2.prependListener("close", S2), h2.on("data", v2), i2.on("close", () => {
      h2.removeListener("close", S2), h2.removeListener("data", v2);
    });
  });
}
n$2(Rl, "fixResponseChunkedTransferBadEnding");
const Bi = /* @__PURE__ */ new WeakMap(), Dn = /* @__PURE__ */ new WeakMap();
function W(i2) {
  const o2 = Bi.get(i2);
  return console.assert(o2 != null, "'this' is expected an Event object, but got", i2), o2;
}
n$2(W, "pd");
function ki(i2) {
  if (i2.passiveListener != null) {
    typeof console < "u" && typeof console.error == "function" && console.error("Unable to preventDefault inside passive event listener invocation.", i2.passiveListener);
    return;
  }
  i2.event.cancelable && (i2.canceled = true, typeof i2.event.preventDefault == "function" && i2.event.preventDefault());
}
n$2(ki, "setCancelFlag");
function ht(i2, o2) {
  Bi.set(this, { eventTarget: i2, event: o2, eventPhase: 2, currentTarget: i2, canceled: false, stopped: false, immediateStopped: false, passiveListener: null, timeStamp: o2.timeStamp || Date.now() }), Object.defineProperty(this, "isTrusted", { value: false, enumerable: true });
  const a2 = Object.keys(o2);
  for (let f2 = 0; f2 < a2.length; ++f2) {
    const l2 = a2[f2];
    l2 in this || Object.defineProperty(this, l2, Wi(l2));
  }
}
n$2(ht, "Event"), ht.prototype = { get type() {
  return W(this).event.type;
}, get target() {
  return W(this).eventTarget;
}, get currentTarget() {
  return W(this).currentTarget;
}, composedPath() {
  const i2 = W(this).currentTarget;
  return i2 == null ? [] : [i2];
}, get NONE() {
  return 0;
}, get CAPTURING_PHASE() {
  return 1;
}, get AT_TARGET() {
  return 2;
}, get BUBBLING_PHASE() {
  return 3;
}, get eventPhase() {
  return W(this).eventPhase;
}, stopPropagation() {
  const i2 = W(this);
  i2.stopped = true, typeof i2.event.stopPropagation == "function" && i2.event.stopPropagation();
}, stopImmediatePropagation() {
  const i2 = W(this);
  i2.stopped = true, i2.immediateStopped = true, typeof i2.event.stopImmediatePropagation == "function" && i2.event.stopImmediatePropagation();
}, get bubbles() {
  return !!W(this).event.bubbles;
}, get cancelable() {
  return !!W(this).event.cancelable;
}, preventDefault() {
  ki(W(this));
}, get defaultPrevented() {
  return W(this).canceled;
}, get composed() {
  return !!W(this).event.composed;
}, get timeStamp() {
  return W(this).timeStamp;
}, get srcElement() {
  return W(this).eventTarget;
}, get cancelBubble() {
  return W(this).stopped;
}, set cancelBubble(i2) {
  if (!i2) return;
  const o2 = W(this);
  o2.stopped = true, typeof o2.event.cancelBubble == "boolean" && (o2.event.cancelBubble = true);
}, get returnValue() {
  return !W(this).canceled;
}, set returnValue(i2) {
  i2 || ki(W(this));
}, initEvent() {
} }, Object.defineProperty(ht.prototype, "constructor", { value: ht, configurable: true, writable: true }), typeof window < "u" && typeof window.Event < "u" && (Object.setPrototypeOf(ht.prototype, window.Event.prototype), Dn.set(window.Event.prototype, ht));
function Wi(i2) {
  return { get() {
    return W(this).event[i2];
  }, set(o2) {
    W(this).event[i2] = o2;
  }, configurable: true, enumerable: true };
}
n$2(Wi, "defineRedirectDescriptor");
function Tl(i2) {
  return { value() {
    const o2 = W(this).event;
    return o2[i2].apply(o2, arguments);
  }, configurable: true, enumerable: true };
}
n$2(Tl, "defineCallDescriptor");
function Cl(i2, o2) {
  const a2 = Object.keys(o2);
  if (a2.length === 0) return i2;
  function f2(l2, p2) {
    i2.call(this, l2, p2);
  }
  n$2(f2, "CustomEvent"), f2.prototype = Object.create(i2.prototype, { constructor: { value: f2, configurable: true, writable: true } });
  for (let l2 = 0; l2 < a2.length; ++l2) {
    const p2 = a2[l2];
    if (!(p2 in i2.prototype)) {
      const S2 = typeof Object.getOwnPropertyDescriptor(o2, p2).value == "function";
      Object.defineProperty(f2.prototype, p2, S2 ? Tl(p2) : Wi(p2));
    }
  }
  return f2;
}
n$2(Cl, "defineWrapper");
function qi(i2) {
  if (i2 == null || i2 === Object.prototype) return ht;
  let o2 = Dn.get(i2);
  return o2 == null && (o2 = Cl(qi(Object.getPrototypeOf(i2)), i2), Dn.set(i2, o2)), o2;
}
n$2(qi, "getWrapper");
function Pl(i2, o2) {
  const a2 = qi(Object.getPrototypeOf(o2));
  return new a2(i2, o2);
}
n$2(Pl, "wrapEvent");
function vl(i2) {
  return W(i2).immediateStopped;
}
n$2(vl, "isStopped");
function El(i2, o2) {
  W(i2).eventPhase = o2;
}
n$2(El, "setEventPhase");
function Al(i2, o2) {
  W(i2).currentTarget = o2;
}
n$2(Al, "setCurrentTarget");
function Oi(i2, o2) {
  W(i2).passiveListener = o2;
}
n$2(Oi, "setPassiveListener");
const zi = /* @__PURE__ */ new WeakMap(), Ii = 1, Fi = 2, wr = 3;
function Rr(i2) {
  return i2 !== null && typeof i2 == "object";
}
n$2(Rr, "isObject");
function Ot(i2) {
  const o2 = zi.get(i2);
  if (o2 == null) throw new TypeError("'this' is expected an EventTarget object, but got another value.");
  return o2;
}
n$2(Ot, "getListeners");
function Bl(i2) {
  return { get() {
    let a2 = Ot(this).get(i2);
    for (; a2 != null; ) {
      if (a2.listenerType === wr) return a2.listener;
      a2 = a2.next;
    }
    return null;
  }, set(o2) {
    typeof o2 != "function" && !Rr(o2) && (o2 = null);
    const a2 = Ot(this);
    let f2 = null, l2 = a2.get(i2);
    for (; l2 != null; ) l2.listenerType === wr ? f2 !== null ? f2.next = l2.next : l2.next !== null ? a2.set(i2, l2.next) : a2.delete(i2) : f2 = l2, l2 = l2.next;
    if (o2 !== null) {
      const p2 = { listener: o2, listenerType: wr, passive: false, once: false, next: null };
      f2 === null ? a2.set(i2, p2) : f2.next = p2;
    }
  }, configurable: true, enumerable: true };
}
n$2(Bl, "defineEventAttributeDescriptor");
function ji(i2, o2) {
  Object.defineProperty(i2, `on${o2}`, Bl(o2));
}
n$2(ji, "defineEventAttribute");
function Li(i2) {
  function o2() {
    Pe.call(this);
  }
  n$2(o2, "CustomEventTarget"), o2.prototype = Object.create(Pe.prototype, { constructor: { value: o2, configurable: true, writable: true } });
  for (let a2 = 0; a2 < i2.length; ++a2) ji(o2.prototype, i2[a2]);
  return o2;
}
n$2(Li, "defineCustomEventTarget");
function Pe() {
  if (this instanceof Pe) {
    zi.set(this, /* @__PURE__ */ new Map());
    return;
  }
  if (arguments.length === 1 && Array.isArray(arguments[0])) return Li(arguments[0]);
  if (arguments.length > 0) {
    const i2 = new Array(arguments.length);
    for (let o2 = 0; o2 < arguments.length; ++o2) i2[o2] = arguments[o2];
    return Li(i2);
  }
  throw new TypeError("Cannot call a class as a function");
}
n$2(Pe, "EventTarget"), Pe.prototype = { addEventListener(i2, o2, a2) {
  if (o2 == null) return;
  if (typeof o2 != "function" && !Rr(o2)) throw new TypeError("'listener' should be a function or an object.");
  const f2 = Ot(this), l2 = Rr(a2), h2 = (l2 ? !!a2.capture : !!a2) ? Ii : Fi, S2 = { listener: o2, listenerType: h2, passive: l2 && !!a2.passive, once: l2 && !!a2.once, next: null };
  let v2 = f2.get(i2);
  if (v2 === void 0) {
    f2.set(i2, S2);
    return;
  }
  let w2 = null;
  for (; v2 != null; ) {
    if (v2.listener === o2 && v2.listenerType === h2) return;
    w2 = v2, v2 = v2.next;
  }
  w2.next = S2;
}, removeEventListener(i2, o2, a2) {
  if (o2 == null) return;
  const f2 = Ot(this), p2 = (Rr(a2) ? !!a2.capture : !!a2) ? Ii : Fi;
  let h2 = null, S2 = f2.get(i2);
  for (; S2 != null; ) {
    if (S2.listener === o2 && S2.listenerType === p2) {
      h2 !== null ? h2.next = S2.next : S2.next !== null ? f2.set(i2, S2.next) : f2.delete(i2);
      return;
    }
    h2 = S2, S2 = S2.next;
  }
}, dispatchEvent(i2) {
  if (i2 == null || typeof i2.type != "string") throw new TypeError('"event.type" should be a string.');
  const o2 = Ot(this), a2 = i2.type;
  let f2 = o2.get(a2);
  if (f2 == null) return true;
  const l2 = Pl(this, i2);
  let p2 = null;
  for (; f2 != null; ) {
    if (f2.once ? p2 !== null ? p2.next = f2.next : f2.next !== null ? o2.set(a2, f2.next) : o2.delete(a2) : p2 = f2, Oi(l2, f2.passive ? f2.listener : null), typeof f2.listener == "function") try {
      f2.listener.call(this, l2);
    } catch (h2) {
      typeof console < "u" && typeof console.error == "function" && console.error(h2);
    }
    else f2.listenerType !== wr && typeof f2.listener.handleEvent == "function" && f2.listener.handleEvent(l2);
    if (vl(l2)) break;
    f2 = f2.next;
  }
  return Oi(l2, null), El(l2, 0), Al(l2, null), !l2.defaultPrevented;
} }, Object.defineProperty(Pe.prototype, "constructor", { value: Pe, configurable: true, writable: true }), typeof window < "u" && typeof window.EventTarget < "u" && Object.setPrototypeOf(Pe.prototype, window.EventTarget.prototype);
const Vn = class Vn2 extends Pe {
  constructor() {
    throw super(), new TypeError("AbortSignal cannot be constructed directly");
  }
  get aborted() {
    const o2 = Tr.get(this);
    if (typeof o2 != "boolean") throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this === null ? "null" : typeof this}`);
    return o2;
  }
};
n$2(Vn, "AbortSignal");
let pt = Vn;
ji(pt.prototype, "abort");
function kl() {
  const i2 = Object.create(pt.prototype);
  return Pe.call(i2), Tr.set(i2, false), i2;
}
n$2(kl, "createAbortSignal");
function Wl(i2) {
  Tr.get(i2) === false && (Tr.set(i2, true), i2.dispatchEvent({ type: "abort" }));
}
n$2(Wl, "abortSignal");
const Tr = /* @__PURE__ */ new WeakMap();
Object.defineProperties(pt.prototype, { aborted: { enumerable: true } }), typeof Symbol == "function" && typeof Symbol.toStringTag == "symbol" && Object.defineProperty(pt.prototype, Symbol.toStringTag, { configurable: true, value: "AbortSignal" });
let Mn = (gt = class {
  constructor() {
    $i.set(this, kl());
  }
  get signal() {
    return Di(this);
  }
  abort() {
    Wl(Di(this));
  }
}, n$2(gt, "AbortController"), gt);
const $i = /* @__PURE__ */ new WeakMap();
function Di(i2) {
  const o2 = $i.get(i2);
  if (o2 == null) throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${i2 === null ? "null" : typeof i2}`);
  return o2;
}
n$2(Di, "getSignal"), Object.defineProperties(Mn.prototype, { signal: { enumerable: true }, abort: { enumerable: true } }), typeof Symbol == "function" && typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Mn.prototype, Symbol.toStringTag, { configurable: true, value: "AbortController" });
var ql = Object.defineProperty, Ol = n$2((i2, o2) => ql(i2, "name", { value: o2, configurable: true }), "e");
const Mi = Ai;
Ui();
function Ui() {
  !globalThis.process?.versions?.node && !globalThis.process?.env?.DISABLE_NODE_FETCH_NATIVE_WARN && console.warn("[node-fetch-native] Node.js compatible build of `node-fetch-native` is being used in a non-Node.js environment. Please make sure you are using proper export conditions or report this issue to https://github.com/unjs/node-fetch-native. You can set `process.env.DISABLE_NODE_FETCH_NATIVE_WARN` to disable this warning.");
}
n$2(Ui, "s"), Ol(Ui, "checkNodeEnvironment");
const o$1 = !!globalThis.process?.env?.FORCE_NODE_FETCH, r$1 = !o$1 && globalThis.fetch || Mi, n$1 = !o$1 && globalThis.Headers || ye, T$1 = !o$1 && globalThis.AbortController || Mn;
const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s2 = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s2.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s2[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s2[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k2) => query[k2] !== void 0).map((k2) => encodeQueryItem(k2, query[k2])).filter(Boolean).join("&");
}
const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
const protocolRelative = /* @__PURE__ */ Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}
class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}
const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t3 = typeof value;
  if (t3 === "string" || t3 === "number" || t3 === "boolean" || t3 === null) {
    return true;
  }
  if (t3 !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers2) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers2
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers2) {
  if (!defaults) {
    return new Headers2(input);
  }
  const headers = new Headers2(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers2(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}
const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch: fetch2 = globalThis.fetch,
    Headers: Headers2 = globalThis.Headers,
    AbortController: AbortController2 = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers2
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers2)) {
        context.options.headers = new Headers2(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController2();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch2(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r2 = await $fetchRaw(request, options);
    return r2._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch2(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}
function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return r$1;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new Bt.Agent(agentOptions);
  const httpsAgent = new zs.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return r$1(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers = globalThis.Headers || n$1;
const AbortController$1 = globalThis.AbortController || T$1;
const ofetch = createFetch({ fetch, Headers, AbortController: AbortController$1 });
function findTokenInCookie() {
  const match = document.cookie.match(
    new RegExp("(^|;\\s*)([CX]SRF-TOKEN)=([^;]*)", "i")
  );
  return match ? decodeURIComponent(match[3]) : void 0;
}
function findTokenInMeta() {
  return Array.from(document.head.getElementsByTagName("meta")).find((element) => element.name.toLowerCase() === "csrf-token" && !!element.content)?.content;
}
function findTokenInInput() {
  return Array.from(document.body.getElementsByTagName("input")).find((input) => {
    return input.name.toLowerCase() === "_token" && input.type.toLowerCase() === "hidden" && !!input.value;
  })?.value;
}
function isCsrfToken(token) {
  if (token.length < 40) {
    const error = new Error("The token must be an CSRF (40 characters) or XSRF token.");
    error.name = "InvalidToken";
    throw error;
  }
  return token.length === 40;
}
function missingToken(headers) {
  return !Object.keys(headers).find((key) => {
    return ["x-csrf-token", "x-xsrf-token"].includes(key.toLowerCase()) && !!headers[key];
  });
}
function pullTokenConfig(options) {
  return pull(options, "findCsrfToken") || pull(options, "findXsrfToken");
}
function setToken(token, headers) {
  if (token === true && missingToken(headers)) {
    token = findTokenInMeta() ?? findTokenInInput() ?? findTokenInCookie() ?? "";
  }
  if (typeof token === "string") {
    headers[isCsrfToken(token) ? "X-CSRF-TOKEN" : "X-XSRF-TOKEN"] = token;
  }
}
const wfetch = async (options, webAuthnData = {}) => {
  const { path, ...fetchOptions } = options;
  fetchOptions.headers = fetchOptions.headers || {};
  setToken(pullTokenConfig(options), fetchOptions.headers);
  fetchOptions.body = mergeDeep(fetchOptions.body ?? {}, webAuthnData);
  return await ofetch(path, fetchOptions);
};
const benchmark = () => {
  const start = /* @__PURE__ */ new Date();
  return {
    start,
    stop: () => {
      const diffInMs = (/* @__PURE__ */ new Date()).getTime() - start.getTime();
      const minutes = Math.floor(diffInMs / 6e4);
      const seconds = Number((diffInMs % 6e4 / 1e3).toFixed(0));
      return (minutes ? minutes + " minutes, " : "") + (seconds ? seconds + " seconds." : "");
    }
  };
};
function newError(name, message, cause = void 0) {
  const error = new Error(message);
  error.name = name;
  error.cause = cause;
  return error;
}
function webpass(config = {}) {
  const currentConfig = mergeDeep(structuredClone(defaultConfig), config);
  async function attest(options, response) {
    const result = {
      data: void 0,
      credentials: void 0,
      id: void 0,
      success: false,
      error: void 0
    };
    try {
      result.data = result.credentials = await attestRaw(options, response);
    } catch (error) {
      return { ...result, error };
    } finally {
      if (typeof result.data === "object") {
        result.id = result.data?.id || result.data?.uuid || void 0;
      }
      result.success = result.error === void 0;
    }
    return result;
  }
  async function attestRaw(options, response) {
    const bench = benchmark();
    const normalizedOptions = normalizeOptions(options, currentConfig, "attestOptions");
    const normalizedResponseOptions = normalizeOptions(response, currentConfig, "attest");
    console.debug("Attestation Options Sending", normalizedOptions);
    const attestationOptions = await wfetch(normalizedOptions);
    console.debug("Attestation Options Received", attestationOptions);
    if (!attestationOptions || isObjectEmpty(attestationOptions)) {
      throw newError("InvalidAttestationResponse", "The server responded with invalid or empty credential creation options.");
    }
    let credentials;
    try {
      credentials = await startRegistration(attestationOptions);
    } catch (cause) {
      throw newError("AttestationCancelled", "The credentials creation was not completed.", cause);
    }
    console.debug("Attestation Credentials Created", credentials);
    console.debug("Attestation Response Sending", normalizedResponseOptions);
    const result = await wfetch(normalizedResponseOptions, credentials);
    console.debug("Attestation Response Received", result);
    console.debug("Attestation benchmark", bench.stop());
    return result;
  }
  async function assert(options, response) {
    const result = {
      data: void 0,
      user: void 0,
      token: void 0,
      success: false,
      error: void 0
    };
    try {
      result.data = await assertRaw(options, response);
    } catch (error) {
      return { ...result, error };
    } finally {
      if (typeof result.data === "object") {
        result.user = typeof result.data.user === "object" ? result.data.user : result.data;
        result.token = result.data?.token || result.data?.jwt;
        if (!result.token && typeof result.user === "object") {
          result.token = result.user?.token || result.user?.jwt;
        }
      } else if (typeof result.data === "string") {
        result.token = result.data;
      }
      result.success = result.error === void 0;
    }
    return result;
  }
  async function assertRaw(options, response) {
    const bench = benchmark();
    const normalizedOptions = normalizeOptions(options, currentConfig, "assertOptions");
    const normalizedResponseOptions = normalizeOptions(response, currentConfig, "assert");
    console.debug("Assertion Options Sending", normalizedOptions);
    const assertionOptions = await wfetch(normalizedOptions);
    console.debug("Assertion Options Received", assertionOptions);
    if (!assertionOptions || isObjectEmpty(assertionOptions)) {
      throw newError("InvalidAssertionResponse", "The server responded with invalid or empty credential request options.");
    }
    let credentials;
    try {
      credentials = await startAuthentication(
        assertionOptions,
        normalizedOptions.useAutofill ?? normalizedResponseOptions.useAutofill ?? currentConfig.useAutofill
      );
    } catch (cause) {
      throw newError("AssertionCancelled", "The credentials request was not completed.", cause);
    }
    console.debug("Assertion Credentials Retrieved", credentials);
    console.debug("Assertion Response Sending", normalizedResponseOptions);
    const result = await wfetch(normalizedResponseOptions, credentials);
    console.debug("Assertion Response Received", result);
    console.debug("Assertion benchmark", bench.stop());
    return result;
  }
  return {
    assert,
    attest,
    assertRaw,
    attestRaw
  };
}
const Webpass = {
  create: webpass,
  attest: async (options, response) => await webpass().attest(options, response),
  assert: async (options, response) => await webpass().assert(options, response),
  attestRaw: async (options, response) => await webpass().attestRaw(options, response),
  assertRaw: async (options, response) => await webpass().assertRaw(options, response),
  isSupported,
  isNotSupported,
  isUnsupported,
  isAutofillable,
  isNotAutofillable,
  isPlatformAuthenticator,
  isNotPlatformAuthenticator
};
Webpass.create({ findXsrfToken: true });
const _sfc_main$o = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "LoginPage",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      email: "",
      password: ""
    });
    const passkeySupported = ref(false);
    const passkeyError = ref(null);
    const passkeyBusy = ref(false);
    onMounted(() => {
      passkeySupported.value = Webpass.isSupported();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Login" }, null, _parent));
      _push(`<div class="max-w-md mx-auto mt-16"><h1 class="text-2xl font-bold mb-6">Login</h1><form class="space-y-4"><div><label for="email" class="block text-sm text-gray-400 mb-1">Email</label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-primary-500 focus:outline-none" required autofocus>`);
      if (unref(form).errors.email) {
        _push(`<p class="text-red-400 text-sm mt-1">${ssrInterpolate(unref(form).errors.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="password" class="block text-sm text-gray-400 mb-1">Password</label><input id="password"${ssrRenderAttr("value", unref(form).password)} type="password" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-primary-500 focus:outline-none" required>`);
      if (unref(form).errors.password) {
        _push(`<p class="text-red-400 text-sm mt-1">${ssrInterpolate(unref(form).errors.password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition disabled:opacity-50"> Login </button></form>`);
      if (passkeySupported.value) {
        _push(`<!--[--><div class="flex items-center gap-3 my-6"><span class="flex-1 h-px bg-gray-800"></span><span class="text-xs text-gray-500 uppercase tracking-wider">or</span><span class="flex-1 h-px bg-gray-800"></span></div><button type="button"${ssrIncludeBooleanAttr(passkeyBusy.value) ? " disabled" : ""} class="w-full flex items-center justify-center gap-2 border border-gray-700 hover:bg-gray-900 text-gray-100 py-2 rounded-lg transition disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M15 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"></path><path d="m13 11 8 8-2 2-1-1-1 1-1-1-1 1-1-1-1 1-2-2v-3l2-5Z"></path></svg>`);
        if (passkeyBusy.value) {
          _push(`<span>Waiting for passkey…</span>`);
        } else {
          _push(`<span>Sign in with a passkey</span>`);
        }
        _push(`</button>`);
        if (passkeyError.value) {
          _push(`<p class="text-red-400 text-sm mt-2 text-center">${ssrInterpolate(passkeyError.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="text-gray-500 text-sm mt-6 text-center"> Don&#39;t have an account? `);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("register"),
        class: "text-primary-400 hover:text-primary-300"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Sign up`);
          } else {
            return [
              createTextVNode("Sign up")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div><!--]-->`);
    };
  }
});
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/LoginPage.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$o
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "ListStatusTabs",
  __ssrInlineRender: true,
  props: {
    activeStatus: {},
    counts: {}
  },
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const statuses = ["all", "watching", "completed", "plan_to_watch", "on_hold", "dropped"];
    function label(status) {
      return status === "all" ? "All" : LIST_STATUS_LABELS[status];
    }
    function count(status, counts) {
      if (status === "all") {
        return Object.values(counts).reduce((sum, c2) => sum + c2, 0);
      }
      return counts[status] ?? 0;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex gap-1 overflow-x-auto border-b border-gray-800 pb-px" }, _attrs))}><!--[-->`);
      ssrRenderList(statuses, (s2) => {
        _push(`<button class="${ssrRenderClass([__props.activeStatus === s2 ? "border-b-2 border-primary-400 text-primary-400" : "text-gray-400 hover:text-gray-200", "flex items-center gap-1.5 whitespace-nowrap px-4 py-2 text-sm font-medium transition"])}">${ssrInterpolate(label(s2))} <span class="text-xs text-gray-500">(${ssrInterpolate(count(s2, __props.counts))})</span></button>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ListStatusTabs.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  __name: "ListTableView",
  __ssrInlineRender: true,
  props: {
    entries: {},
    readonly: { type: Boolean }
  },
  emits: ["update", "delete", "edit"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const statusOptions = Object.entries(LIST_STATUS_LABELS).map(([value, label]) => ({ value, label }));
    function displayTitle(entry) {
      return entry.anime?.title_english || entry.anime?.title_romaji || "Unknown";
    }
    function handleStatusChange(entry, status) {
      emit("update", entry.id, { status });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-x-auto" }, _attrs))}><table class="w-full text-sm"><thead><tr class="border-b border-gray-800 text-left text-gray-400"><th class="w-12 py-3 pr-2"></th><th class="py-3 pr-4">Title</th><th class="w-40 py-3 pr-4">Status</th><th class="w-20 py-3 pr-4">Score</th><th class="w-32 py-3 pr-4">Progress</th><th class="w-20 py-3 pr-4">Type</th><th class="w-24 py-3">Updated</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(__props.entries, (entry) => {
        _push(`<tr class="border-b border-gray-800/50 hover:bg-gray-900/50 transition"><td class="py-2 pr-2">`);
        if (entry.anime?.cover_image_medium) {
          _push(`<img${ssrRenderAttr("src", entry.anime.cover_image_medium)}${ssrRenderAttr("alt", displayTitle(entry))} class="h-10 w-7 rounded object-cover" loading="lazy">`);
        } else {
          _push(`<!---->`);
        }
        _push(`</td><td class="py-2 pr-4">`);
        if (entry.anime) {
          _push(ssrRenderComponent(_component_Link, {
            href: entry.anime?.slug ? _ctx.route("anime.show", { anime: entry.anime.slug }) : "#",
            class: "text-gray-200 hover:text-primary-400 transition"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(displayTitle(entry))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(displayTitle(entry)), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</td><td class="py-2 pr-4">`);
        if (!__props.readonly) {
          _push(ssrRenderComponent(unref(Select), {
            "model-value": entry.status,
            options: unref(statusOptions),
            "option-label": "label",
            "option-value": "value",
            class: "w-full text-xs",
            "onUpdate:modelValue": (v2) => handleStatusChange(entry, v2)
          }, null, _parent));
        } else {
          _push(`<span class="text-gray-300 text-xs">${ssrInterpolate(unref(LIST_STATUS_LABELS)[entry.status])}</span>`);
        }
        _push(`</td><td class="py-2 pr-4">`);
        if (!__props.readonly) {
          _push(`<input type="number" min="0" max="10" step="0.5"${ssrRenderAttr("value", entry.display_score ?? "")} class="w-16 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-center text-gray-200 text-xs">`);
        } else {
          _push(`<span class="text-gray-300 text-xs">${ssrInterpolate(entry.display_score ?? "-")}</span>`);
        }
        _push(`</td><td class="py-2 pr-4"><div class="flex items-center gap-1"><span class="text-gray-300">${ssrInterpolate(entry.progress)}</span><span class="text-gray-500">/</span><span class="text-gray-500">${ssrInterpolate(entry.anime?.episodes ?? "?")}</span>`);
        if (!__props.readonly) {
          _push(`<button class="ml-1 rounded bg-gray-700 px-1.5 py-0.5 text-xs text-gray-300 hover:bg-gray-600 transition"> + </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></td><td class="py-2 pr-4 text-gray-400">${ssrInterpolate(entry.anime?.format?.replace(/_/g, " ") ?? "-")}</td><td class="py-2 text-gray-500 text-xs">${ssrInterpolate(new Date(entry.updated_at).toLocaleDateString())}</td></tr>`);
      });
      _push(`<!--]--></tbody></table>`);
      if (__props.entries.length === 0) {
        _push(`<p class="py-8 text-center text-gray-500"> No entries found. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ListTableView.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "ListCardView",
  __ssrInlineRender: true,
  props: {
    entries: {},
    readonly: { type: Boolean }
  },
  emits: ["edit"],
  setup(__props, { emit: __emit }) {
    function displayTitle(entry) {
      return entry.anime?.title_english || entry.anime?.title_romaji || "Unknown";
    }
    const statusColors = {
      watching: "border-blue-500",
      completed: "border-green-500",
      on_hold: "border-yellow-500",
      dropped: "border-red-500",
      plan_to_watch: "border-gray-600"
    };
    const statusBadgeColors = {
      watching: "bg-blue-500/20 text-blue-400",
      completed: "bg-green-500/20 text-green-400",
      on_hold: "bg-yellow-500/20 text-yellow-400",
      dropped: "bg-red-500/20 text-red-400",
      plan_to_watch: "bg-gray-700 text-gray-400"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(`<!--[--><div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"><!--[-->`);
      ssrRenderList(__props.entries, (entry) => {
        _push(`<div class="${ssrRenderClass([statusColors[entry.status] ?? "border-gray-700", "group relative overflow-hidden rounded-lg bg-gray-800 border-2"])}">`);
        if (entry.anime) {
          _push(ssrRenderComponent(_component_Link, {
            href: entry.anime?.slug ? _ctx.route("anime.show", { anime: entry.anime.slug }) : "#",
            class: "block"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (entry.anime.cover_image_large || entry.anime.cover_image_medium) {
                  _push2(`<img${ssrRenderAttr("src", entry.anime.cover_image_large || entry.anime.cover_image_medium)}${ssrRenderAttr("alt", displayTitle(entry))} class="aspect-[3/4] w-full object-cover" loading="lazy"${_scopeId}>`);
                } else {
                  _push2(`<div class="aspect-[3/4] w-full bg-gray-700 flex items-center justify-center"${_scopeId}><span class="text-gray-500 text-xs"${_scopeId}>No image</span></div>`);
                }
              } else {
                return [
                  entry.anime.cover_image_large || entry.anime.cover_image_medium ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: entry.anime.cover_image_large || entry.anime.cover_image_medium,
                    alt: displayTitle(entry),
                    class: "aspect-[3/4] w-full object-cover",
                    loading: "lazy"
                  }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "aspect-[3/4] w-full bg-gray-700 flex items-center justify-center"
                  }, [
                    createVNode("span", { class: "text-gray-500 text-xs" }, "No image")
                  ]))
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/95 via-gray-900/70 to-transparent p-2 pt-8"><p class="text-xs font-medium text-gray-200 line-clamp-2 mb-1">${ssrInterpolate(displayTitle(entry))}</p><div class="flex items-center justify-between"><span class="${ssrRenderClass([statusBadgeColors[entry.status] ?? "bg-gray-700 text-gray-400", "text-[10px] px-1.5 py-0.5 rounded-full font-medium"])}">${ssrInterpolate(unref(LIST_STATUS_LABELS)[entry.status])}</span>`);
        if (entry.display_score) {
          _push(`<span class="text-[10px] text-primary-400">${ssrInterpolate(entry.display_score)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="text-[10px] text-gray-500 mt-0.5">${ssrInterpolate(entry.progress)}${ssrInterpolate(entry.anime?.episodes ? ` / ${entry.anime.episodes}` : "")} eps </div></div>`);
        if (!__props.readonly) {
          _push(`<button class="absolute top-1 right-1 rounded bg-gray-900/80 p-1 text-gray-400 opacity-0 group-hover:opacity-100 transition hover:text-gray-200"><svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
      if (__props.entries.length === 0) {
        _push(`<p class="py-8 text-center text-gray-500"> No entries found. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ListCardView.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "ListCompactView",
  __ssrInlineRender: true,
  props: {
    entries: {},
    readonly: { type: Boolean }
  },
  emits: ["update"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const statusOptions = Object.entries(LIST_STATUS_LABELS).map(([value, label]) => ({ value, label }));
    function displayTitle(entry) {
      return entry.anime?.title_english || entry.anime?.title_romaji || "Unknown";
    }
    function handleStatusChange(entry, status) {
      emit("update", entry.id, { status });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(`<!--[--><div class="divide-y divide-gray-800/50"><!--[-->`);
      ssrRenderList(__props.entries, (entry) => {
        _push(`<div class="flex items-center gap-3 py-1.5 hover:bg-gray-900/30 transition text-xs">`);
        if (entry.anime) {
          _push(ssrRenderComponent(_component_Link, {
            href: entry.anime?.slug ? _ctx.route("anime.show", { anime: entry.anime.slug }) : "#",
            class: "flex-1 min-w-0 text-gray-200 hover:text-primary-400 transition truncate"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(displayTitle(entry))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(displayTitle(entry)), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (!__props.readonly) {
          _push(ssrRenderComponent(unref(Select), {
            "model-value": entry.status,
            options: unref(statusOptions),
            "option-label": "label",
            "option-value": "value",
            class: "w-32 text-xs",
            "onUpdate:modelValue": (v2) => handleStatusChange(entry, v2)
          }, null, _parent));
        } else {
          _push(`<span class="w-32 text-gray-300 text-xs">${ssrInterpolate(unref(LIST_STATUS_LABELS)[entry.status])}</span>`);
        }
        _push(`<span class="w-12 text-center text-gray-400">${ssrInterpolate(entry.display_score ?? "-")}</span><div class="flex items-center gap-1 w-20"><span class="text-gray-300">${ssrInterpolate(entry.progress)}</span><span class="text-gray-600">/${ssrInterpolate(entry.anime?.episodes ?? "?")}</span>`);
        if (!__props.readonly) {
          _push(`<button class="rounded bg-gray-700 px-1 text-gray-300 hover:bg-gray-600 transition">+</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><span class="w-16 text-gray-500">${ssrInterpolate(entry.anime?.format?.replace(/_/g, " ") ?? "-")}</span></div>`);
      });
      _push(`<!--]--></div>`);
      if (__props.entries.length === 0) {
        _push(`<p class="py-8 text-center text-gray-500"> No entries found. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ListCompactView.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "MyListPage",
  __ssrInlineRender: true,
  props: {
    entries: {},
    counts: {}
  },
  setup(__props) {
    const props = __props;
    const activeStatus = ref("all");
    const viewMode = ref("table");
    onMounted(() => {
      const saved = localStorage.getItem("list_view");
      if (saved && ["table", "card", "compact"].includes(saved)) {
        viewMode.value = saved;
      }
    });
    const sortField = ref("-updated_at");
    const filteredEntries = computed(() => {
      let entries = props.entries;
      if (activeStatus.value !== "all") {
        entries = entries.filter((e2) => e2.status === activeStatus.value);
      }
      const [dir, field] = sortField.value.startsWith("-") ? ["desc", sortField.value.slice(1)] : ["asc", sortField.value];
      return [...entries].sort((a2, b2) => {
        let aVal = null;
        let bVal = null;
        if (field === "updated_at") {
          aVal = a2.updated_at;
          bVal = b2.updated_at;
        } else if (field === "score") {
          aVal = a2.score ?? -1;
          bVal = b2.score ?? -1;
        } else if (field === "title") {
          aVal = (a2.anime?.title_english || a2.anime?.title_romaji || "").toLowerCase();
          bVal = (b2.anime?.title_english || b2.anime?.title_romaji || "").toLowerCase();
        } else if (field === "progress") {
          aVal = a2.progress;
          bVal = b2.progress;
        }
        if (aVal === null || bVal === null) return 0;
        if (aVal < bVal) return dir === "asc" ? -1 : 1;
        if (aVal > bVal) return dir === "asc" ? 1 : -1;
        return 0;
      });
    });
    const page = usePage();
    const user = computed(() => page.props.auth.user);
    const publicUrl = computed(() => {
      if (!user.value?.list_is_public || !user.value?.username) return null;
      return `${window.location.origin}/user/${user.value.username}/list`;
    });
    const listIsPublic = ref(user.value?.list_is_public ?? false);
    function togglePublic() {
      router.patch(route("settings.profile"), {
        list_is_public: listIsPublic.value
      }, { preserveState: true, preserveScroll: true });
    }
    const copied = ref(false);
    const { updateMutation, destroyMutation } = useListMutations();
    function reloadProps() {
      router.reload({ only: ["entries", "counts"] });
    }
    function handleUpdate(id, patch) {
      updateMutation.mutate(
        { id, ...patch },
        { onSuccess: reloadProps }
      );
    }
    function handleDelete(id) {
      destroyMutation.mutate(id, { onSuccess: reloadProps });
    }
    const editingEntry = ref(null);
    const showEditModal = ref(false);
    function openEdit(entry) {
      editingEntry.value = entry;
      showEditModal.value = true;
    }
    const sortOptions = [
      { label: "Last Updated", value: "-updated_at" },
      { label: "Score", value: "-score" },
      { label: "Title", value: "title" },
      { label: "Progress", value: "-progress" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "My List" }, null, _parent));
      _push(`<div class="space-y-4"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold">My Anime List</h1><div class="flex items-center gap-3"><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(ToggleSwitch), {
        modelValue: listIsPublic.value,
        "onUpdate:modelValue": [($event) => listIsPublic.value = $event, togglePublic]
      }, null, _parent));
      _push(`<span class="text-sm text-gray-400">Public</span></div>`);
      if (publicUrl.value) {
        _push(`<button class="${ssrRenderClass([copied.value ? "text-green-400" : "text-gray-300", "flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm transition hover:border-gray-600 hover:bg-gray-750"])}">`);
        if (!copied.value) {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path></svg>`);
        } else {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`);
        }
        _push(` ${ssrInterpolate(copied.value ? "Copied!" : "Share")}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<a${ssrRenderAttr("href", _ctx.route("list.export"))} class="text-sm text-gray-400 hover:text-gray-200 transition"> Export XML </a>`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("import"),
        class: "text-sm text-gray-400 hover:text-gray-200 transition"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Import `);
          } else {
            return [
              createTextVNode(" Import ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_sfc_main$n, {
        "active-status": activeStatus.value,
        counts: __props.counts,
        onChange: ($event) => activeStatus.value = $event
      }, null, _parent));
      _push(`<div class="flex items-center justify-between"><select class="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-gray-300"><!--[-->`);
      ssrRenderList(sortOptions, (opt) => {
        _push(`<option${ssrRenderAttr("value", opt.value)}${ssrIncludeBooleanAttr(Array.isArray(sortField.value) ? ssrLooseContain(sortField.value, opt.value) : ssrLooseEqual(sortField.value, opt.value)) ? " selected" : ""}>${ssrInterpolate(opt.label)}</option>`);
      });
      _push(`<!--]--></select><div class="flex items-center gap-1"><!--[-->`);
      ssrRenderList(["table", "card", "compact"], (mode) => {
        _push(`<button class="${ssrRenderClass([viewMode.value === mode ? "bg-gray-700 text-gray-200" : "text-gray-500 hover:text-gray-300", "rounded px-2 py-1 text-xs transition"])}">${ssrInterpolate(mode.charAt(0).toUpperCase() + mode.slice(1))}</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (viewMode.value === "table") {
        _push(ssrRenderComponent(_sfc_main$m, {
          entries: filteredEntries.value,
          onUpdate: handleUpdate,
          onDelete: handleDelete,
          onEdit: openEdit
        }, null, _parent));
      } else if (viewMode.value === "card") {
        _push(ssrRenderComponent(_sfc_main$l, {
          entries: filteredEntries.value,
          onEdit: openEdit
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_sfc_main$k, {
          entries: filteredEntries.value,
          onUpdate: handleUpdate
        }, null, _parent));
      }
      if (showEditModal.value && editingEntry.value?.anime) {
        _push(ssrRenderComponent(_sfc_main$F, {
          anime: editingEntry.value.anime,
          entry: editingEntry.value,
          onClose: ($event) => showEditModal.value = false,
          onSaved: ($event) => showEditModal.value = false,
          onDeleted: ($event) => showEditModal.value = false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/MyListPage.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$j
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "NotFoundPage",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "404 - Not Found" }, null, _parent));
      _push(`<div class="text-center mt-24"><h1 class="text-6xl font-bold text-gray-700">404</h1><p class="text-gray-400 mt-4">Page not found.</p>`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("home"),
        class: "text-primary-400 hover:text-primary-300 mt-6 inline-block"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Go Home`);
          } else {
            return [
              createTextVNode("Go Home")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/NotFoundPage.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$i
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "PeopleIndexPage",
  __ssrInlineRender: true,
  props: {
    people: {},
    filters: {}
  },
  setup(__props) {
    const props = __props;
    const search = ref(props.filters.search);
    function personUrl(person) {
      return person.slug ? route("people.show", { person: person.slug }) : "#";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Voice Actors" }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description" content="Browse Japanese voice actors and their anime roles on AniTrack."${_scopeId}><link rel="canonical"${ssrRenderAttr("href", _ctx.route("people.index"))}${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: "Browse Japanese voice actors and their anime roles on AniTrack."
              }),
              createVNode("link", {
                rel: "canonical",
                href: _ctx.route("people.index")
              }, null, 8, ["href"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div><div class="mb-6"><h1 class="text-2xl font-bold text-gray-100 md:text-3xl">Voice Actors</h1><p class="mt-1 text-sm text-gray-400"> Browse ${ssrInterpolate(__props.people.meta.total.toLocaleString())} Japanese voice actors. </p></div><div class="mb-6"><form><input${ssrRenderAttr("value", search.value)} type="search" placeholder="Search voice actors..." class="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"></form></div>`);
      if (__props.people.data.length) {
        _push(`<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"><!--[-->`);
        ssrRenderList(__props.people.data, (person) => {
          _push(ssrRenderComponent(_component_Link, {
            key: person.id,
            href: personUrl(person),
            class: "group block"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="aspect-[3/4] overflow-hidden rounded-lg bg-gray-800"${_scopeId}>`);
                if (person.image_medium) {
                  _push2(`<img${ssrRenderAttr("src", person.image_medium)}${ssrRenderAttr("alt", person.name_full)} class="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy"${_scopeId}>`);
                } else {
                  _push2(`<div class="flex h-full items-center justify-center text-gray-600"${_scopeId}><span class="text-4xl"${_scopeId}>?</span></div>`);
                }
                _push2(`</div><div class="mt-2"${_scopeId}><h3 class="line-clamp-2 text-sm font-medium text-gray-200 group-hover:text-primary-400 transition"${_scopeId}>${ssrInterpolate(person.name_full)}</h3>`);
                if (person.name_native) {
                  _push2(`<p class="line-clamp-1 text-xs text-gray-500"${_scopeId}>${ssrInterpolate(person.name_native)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<p class="mt-0.5 text-xs text-gray-500"${_scopeId}>${ssrInterpolate(person.role_count)} role${ssrInterpolate(person.role_count === 1 ? "" : "s")}</p></div>`);
              } else {
                return [
                  createVNode("div", { class: "aspect-[3/4] overflow-hidden rounded-lg bg-gray-800" }, [
                    person.image_medium ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: person.image_medium,
                      alt: person.name_full,
                      class: "h-full w-full object-cover transition-transform group-hover:scale-105",
                      loading: "lazy"
                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "flex h-full items-center justify-center text-gray-600"
                    }, [
                      createVNode("span", { class: "text-4xl" }, "?")
                    ]))
                  ]),
                  createVNode("div", { class: "mt-2" }, [
                    createVNode("h3", { class: "line-clamp-2 text-sm font-medium text-gray-200 group-hover:text-primary-400 transition" }, toDisplayString(person.name_full), 1),
                    person.name_native ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "line-clamp-1 text-xs text-gray-500"
                    }, toDisplayString(person.name_native), 1)) : createCommentVNode("", true),
                    createVNode("p", { class: "mt-0.5 text-xs text-gray-500" }, toDisplayString(person.role_count) + " role" + toDisplayString(person.role_count === 1 ? "" : "s"), 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="py-16 text-center"><p class="text-gray-500">No voice actors found.</p></div>`);
      }
      _push(`<div class="mt-8">`);
      _push(ssrRenderComponent(_sfc_main$M, {
        "current-page": __props.people.meta.current_page,
        "last-page": __props.people.meta.last_page,
        total: __props.people.meta.total
      }, null, _parent));
      _push(`</div></div><!--]-->`);
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PeopleIndexPage.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$h
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "PersonDetailPage",
  __ssrInlineRender: true,
  props: {
    person: {},
    roles: {},
    og: {}
  },
  setup(__props) {
    function formatLabel(format2) {
      if (!format2) return "";
      return format2.replace(/_/g, " ");
    }
    function animeUrl(anime) {
      if (!anime) return "#";
      if (anime.slug) return route("anime.show", { anime: anime.slug });
      return "#";
    }
    function formatBirthdate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, {
        title: __props.person.name_full
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description"${ssrRenderAttr("content", __props.og.description)}${_scopeId}><link rel="canonical"${ssrRenderAttr("href", __props.og.url)}${_scopeId}><meta property="og:title"${ssrRenderAttr("content", __props.og.title)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", __props.og.description)}${_scopeId}>`);
            if (__props.og.image) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", __props.og.image)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:url"${ssrRenderAttr("content", __props.og.url)}${_scopeId}><meta property="og:type" content="profile"${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: __props.og.description
              }, null, 8, ["content"]),
              createVNode("link", {
                rel: "canonical",
                href: __props.og.url
              }, null, 8, ["href"]),
              createVNode("meta", {
                property: "og:title",
                content: __props.og.title
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: __props.og.description
              }, null, 8, ["content"]),
              __props.og.image ? (openBlock(), createBlock("meta", {
                key: 0,
                property: "og:image",
                content: __props.og.image
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:url",
                content: __props.og.url
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:type",
                content: "profile"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div><div class="mb-6 text-sm text-gray-500">`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("people.index"),
        class: "text-primary-400 hover:text-primary-300"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Voice Actors`);
          } else {
            return [
              createTextVNode("Voice Actors")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="mx-2 text-gray-600">/</span><span>${ssrInterpolate(__props.person.name_full)}</span></div><div class="flex flex-col gap-6 md:flex-row"><div class="w-full shrink-0 md:w-56"><div class="overflow-hidden rounded-lg bg-gray-800">`);
      if (__props.person.image_large || __props.person.image_medium) {
        _push(`<img${ssrRenderAttr("src", __props.person.image_large || __props.person.image_medium)}${ssrRenderAttr("alt", __props.person.name_full)} class="w-full" loading="lazy">`);
      } else {
        _push(`<div class="flex aspect-[3/4] items-center justify-center text-gray-600"><span class="text-5xl">?</span></div>`);
      }
      _push(`</div><div class="mt-4 rounded-lg border border-gray-800 p-3 space-y-2 text-sm">`);
      if (__props.person.gender) {
        _push(`<div class="flex items-start justify-between gap-3"><span class="text-gray-500 shrink-0">Gender</span><span class="text-gray-200 text-right">${ssrInterpolate(__props.person.gender)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.person.birthdate) {
        _push(`<div class="flex items-start justify-between gap-3"><span class="text-gray-500 shrink-0">Born</span><span class="text-gray-200 text-right">${ssrInterpolate(formatBirthdate(__props.person.birthdate))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-start justify-between gap-3"><span class="text-gray-500 shrink-0">Roles</span><span class="text-gray-200 text-right">${ssrInterpolate(__props.person.role_count.toLocaleString())}</span></div>`);
      if (__props.person.site_url) {
        _push(`<div class="pt-1"><a${ssrRenderAttr("href", __props.person.site_url)} target="_blank" rel="noopener noreferrer" class="text-xs text-primary-400 hover:text-primary-300"> AniList → </a></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="min-w-0 flex-1 space-y-6"><div><h1 class="text-2xl font-bold text-gray-100 md:text-3xl">${ssrInterpolate(__props.person.name_full)}</h1>`);
      if (__props.person.name_native) {
        _push(`<p class="mt-1 text-gray-400">${ssrInterpolate(__props.person.name_native)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.roles.data.length) {
        _push(`<div><h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400"> Voice Acting Roles </h2><div class="space-y-2"><!--[-->`);
        ssrRenderList(__props.roles.data, (role, idx) => {
          _push(ssrRenderComponent(_component_Link, {
            key: `${role.anime?.id ?? "x"}-${role.character?.id ?? idx}`,
            href: animeUrl(role.anime),
            class: "group flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/40 p-2 transition hover:border-primary-600 hover:bg-gray-900"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="h-20 w-14 shrink-0 overflow-hidden rounded-md bg-gray-800"${_scopeId}>`);
                if (role.anime?.cover_image_medium) {
                  _push2(`<img${ssrRenderAttr("src", role.anime.cover_image_medium)}${ssrRenderAttr("alt", role.anime.title_romaji)} class="h-full w-full object-cover" loading="lazy"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><h3 class="truncate text-sm font-medium text-gray-100 group-hover:text-primary-400 transition"${_scopeId}>${ssrInterpolate(role.anime?.title_english || role.anime?.title_romaji || "Unknown anime")}</h3><div class="mt-0.5 flex items-center gap-2 text-xs text-gray-500"${_scopeId}>`);
                if (role.anime?.format) {
                  _push2(`<span${_scopeId}>${ssrInterpolate(formatLabel(role.anime.format))}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (role.anime?.season_year) {
                  _push2(`<span${_scopeId}>· ${ssrInterpolate(role.anime.season_year)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (role.anime) {
                  _push2(ssrRenderComponent(_sfc_main$K, {
                    score: role.anime.average_score,
                    size: "sm"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div><div class="flex shrink-0 items-center gap-2 text-right"${_scopeId}><div class="min-w-0"${_scopeId}><p class="truncate text-sm text-gray-200"${_scopeId}>${ssrInterpolate(role.character?.name_full || "—")}</p>`);
                if (role.character?.name_native) {
                  _push2(`<p class="truncate text-xs text-gray-500"${_scopeId}>${ssrInterpolate(role.character.name_native)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-800"${_scopeId}>`);
                if (role.character?.image_medium) {
                  _push2(`<img${ssrRenderAttr("src", role.character.image_medium)}${ssrRenderAttr("alt", role.character.name_full)} class="h-full w-full object-cover" loading="lazy"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
              } else {
                return [
                  createVNode("div", { class: "h-20 w-14 shrink-0 overflow-hidden rounded-md bg-gray-800" }, [
                    role.anime?.cover_image_medium ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: role.anime.cover_image_medium,
                      alt: role.anime.title_romaji,
                      class: "h-full w-full object-cover",
                      loading: "lazy"
                    }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "min-w-0 flex-1" }, [
                    createVNode("h3", { class: "truncate text-sm font-medium text-gray-100 group-hover:text-primary-400 transition" }, toDisplayString(role.anime?.title_english || role.anime?.title_romaji || "Unknown anime"), 1),
                    createVNode("div", { class: "mt-0.5 flex items-center gap-2 text-xs text-gray-500" }, [
                      role.anime?.format ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(formatLabel(role.anime.format)), 1)) : createCommentVNode("", true),
                      role.anime?.season_year ? (openBlock(), createBlock("span", { key: 1 }, "· " + toDisplayString(role.anime.season_year), 1)) : createCommentVNode("", true),
                      role.anime ? (openBlock(), createBlock(_sfc_main$K, {
                        key: 2,
                        score: role.anime.average_score,
                        size: "sm"
                      }, null, 8, ["score"])) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("div", { class: "flex shrink-0 items-center gap-2 text-right" }, [
                    createVNode("div", { class: "min-w-0" }, [
                      createVNode("p", { class: "truncate text-sm text-gray-200" }, toDisplayString(role.character?.name_full || "—"), 1),
                      role.character?.name_native ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "truncate text-xs text-gray-500"
                      }, toDisplayString(role.character.name_native), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-800" }, [
                      role.character?.image_medium ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: role.character.image_medium,
                        alt: role.character.name_full,
                        class: "h-full w-full object-cover",
                        loading: "lazy"
                      }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div><div class="mt-8">`);
        _push(ssrRenderComponent(_sfc_main$M, {
          "current-page": __props.roles.meta.current_page,
          "last-page": __props.roles.meta.last_page,
          total: __props.roles.meta.total
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<div class="py-16 text-center"><p class="text-gray-500">No roles recorded yet.</p></div>`);
      }
      _push(`</div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PersonDetailPage.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$g
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "PlaylistDetailPage",
  __ssrInlineRender: true,
  props: {
    playlist: {},
    isOwner: { type: Boolean }
  },
  setup(__props) {
    function displayTitle(anime) {
      return anime.title_english || anime.title_romaji;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, {
        title: __props.playlist.title
      }, null, _parent));
      _push(`<div class="max-w-3xl mx-auto"><div class="mb-6"><div class="flex items-start justify-between gap-4"><div><h1 class="text-2xl font-bold">${ssrInterpolate(__props.playlist.title)}</h1><p class="text-sm text-gray-500 mt-1"> by `);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("profile.show", { user: __props.playlist.user.username }),
        class: "text-primary-400 hover:text-primary-300"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.playlist.user.username)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.playlist.user.username), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` · ${ssrInterpolate(__props.playlist.item_count)} anime </p></div>`);
      if (__props.isOwner) {
        _push(ssrRenderComponent(unref(Link), {
          href: _ctx.route("playlists.edit", { playlist: __props.playlist.slug })
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Button), {
                label: "Edit",
                size: "small",
                severity: "secondary"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Button), {
                  label: "Edit",
                  size: "small",
                  severity: "secondary"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.playlist.description) {
        _push(`<p class="text-gray-400 text-sm mt-3">${ssrInterpolate(__props.playlist.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-2"><!--[-->`);
      ssrRenderList(__props.playlist.items, (item) => {
        _push(`<div class="${ssrRenderClass([item.is_optional ? "border-gray-800/50 border-dashed" : "border-gray-800", "flex gap-3 bg-gray-900 border rounded-lg p-3"])}"><div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-medium text-gray-400">${ssrInterpolate(item.position)}</div>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.anime.slug ? unref(Link) : "div"), mergeProps({ ref_for: true }, item.anime.slug ? { href: _ctx.route("anime.show", { anime: item.anime.slug }) } : {}, { class: "flex-shrink-0" }), {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (item.anime.cover_image_medium) {
                _push2(`<img${ssrRenderAttr("src", item.anime.cover_image_medium)}${ssrRenderAttr("alt", displayTitle(item.anime))} class="w-12 h-16 object-cover rounded"${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                item.anime.cover_image_medium ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: item.anime.cover_image_medium,
                  alt: displayTitle(item.anime),
                  class: "w-12 h-16 object-cover rounded"
                }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }), _parent);
        _push(`<div class="flex-1 min-w-0"><div class="flex items-center gap-2">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.anime.slug ? unref(Link) : "span"), mergeProps({ ref_for: true }, item.anime.slug ? { href: _ctx.route("anime.show", { anime: item.anime.slug }) } : {}, {
          class: ["font-medium text-gray-100 truncate", item.anime.slug ? "hover:text-primary-400 transition" : ""]
        }), {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(displayTitle(item.anime))}`);
            } else {
              return [
                createTextVNode(toDisplayString(displayTitle(item.anime)), 1)
              ];
            }
          }),
          _: 2
        }), _parent);
        if (item.is_optional) {
          _push(`<span class="text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded"> Optional </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="text-xs text-gray-500 mt-0.5">${ssrInterpolate(item.anime.format)} · ${ssrInterpolate(item.anime.episodes ? `${item.anime.episodes} eps` : "Ongoing")}</div>`);
        if (item.note) {
          _push(`<p class="text-sm text-gray-400 mt-1">${ssrInterpolate(item.note)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div>`);
      if (__props.playlist.items.length === 0) {
        _push(`<div class="text-center py-12 text-gray-500"> This playlist is empty. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PlaylistDetailPage.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const __vite_glob_0_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$f
}, Symbol.toStringTag, { value: "Module" }));
function usePlaylistMutations() {
  const storeMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post("/api/playlists", payload);
      return data.playlist;
    }
  });
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...patch }) => {
      const { data } = await axios.patch(`/api/playlists/${id}`, patch);
      return data.playlist;
    }
  });
  const destroyMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/playlists/${id}`);
    }
  });
  const addItemMutation = useMutation({
    mutationFn: async ({ playlistId, ...payload }) => {
      const { data } = await axios.post(`/api/playlists/${playlistId}/items`, payload);
      return data;
    }
  });
  const updateItemMutation = useMutation({
    mutationFn: async ({ playlistId, itemId, ...patch }) => {
      const { data } = await axios.patch(`/api/playlists/${playlistId}/items/${itemId}`, patch);
      return data;
    }
  });
  const removeItemMutation = useMutation({
    mutationFn: async ({ playlistId, itemId }) => {
      await axios.delete(`/api/playlists/${playlistId}/items/${itemId}`);
    }
  });
  const reorderMutation = useMutation({
    mutationFn: async ({ playlistId, itemIds }) => {
      await axios.patch(`/api/playlists/${playlistId}/reorder`, { item_ids: itemIds });
    }
  });
  return {
    storeMutation,
    updateMutation,
    destroyMutation,
    addItemMutation,
    updateItemMutation,
    removeItemMutation,
    reorderMutation
  };
}
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "PlaylistEditPage",
  __ssrInlineRender: true,
  props: {
    playlist: {}
  },
  setup(__props) {
    const props = __props;
    const isNew = computed(() => !props.playlist);
    const title = ref(props.playlist?.title ?? "");
    const description = ref(props.playlist?.description ?? "");
    const isPublic = ref(props.playlist?.is_public ?? true);
    const items = ref(props.playlist?.items ?? []);
    const saving = ref(false);
    const searchQuery = ref("");
    const searchResults = ref([]);
    const searching = ref(false);
    let searchTimeout = null;
    const { storeMutation, updateMutation, destroyMutation } = usePlaylistMutations();
    function onSearchInput() {
      if (searchTimeout) clearTimeout(searchTimeout);
      if (!searchQuery.value.trim()) {
        searchResults.value = [];
        return;
      }
      searchTimeout = setTimeout(async () => {
        searching.value = true;
        try {
          const { data } = await axios.get(route("api.search"), {
            params: { q: searchQuery.value }
          });
          searchResults.value = data.data.filter(
            (anime) => !items.value.some((i2) => i2.anime.id === anime.id)
          );
        } catch {
          searchResults.value = [];
        } finally {
          searching.value = false;
        }
      }, 300);
    }
    function displayTitle(anime) {
      return anime.title_english || anime.title_romaji;
    }
    async function savePlaylist() {
      saving.value = true;
      try {
        if (isNew.value) {
          const playlist = await storeMutation.mutateAsync({
            title: title.value,
            description: description.value || null,
            is_public: isPublic.value
          });
          router.visit(route("playlists.edit", { playlist: playlist.slug }));
        } else {
          await updateMutation.mutateAsync({
            id: props.playlist.id,
            title: title.value,
            description: description.value || null,
            is_public: isPublic.value
          });
        }
      } finally {
        saving.value = false;
      }
    }
    async function deletePlaylist() {
      if (!props.playlist || !confirm("Delete this playlist?")) return;
      await destroyMutation.mutateAsync(props.playlist.id);
      router.visit(route("playlists.index"));
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, {
        title: isNew.value ? "Create Playlist" : `Edit: ${__props.playlist.title}`
      }, null, _parent));
      _push(`<div class="max-w-3xl mx-auto"><div class="flex items-center justify-between mb-6"><h1 class="text-2xl font-bold">${ssrInterpolate(isNew.value ? "Create Playlist" : "Edit Playlist")}</h1>`);
      if (!isNew.value) {
        _push(`<div class="flex gap-2">`);
        _push(ssrRenderComponent(_component_Link, {
          href: _ctx.route("playlist.show", { playlist: __props.playlist.slug })
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Button), {
                label: "View",
                size: "small",
                severity: "secondary",
                text: ""
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Button), {
                  label: "View",
                  size: "small",
                  severity: "secondary",
                  text: ""
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(Button), {
          label: "Delete",
          size: "small",
          severity: "danger",
          text: "",
          onClick: deletePlaylist
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 mb-6"><div><label class="block text-sm text-gray-400 mb-1">Title</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        modelValue: title.value,
        "onUpdate:modelValue": ($event) => title.value = $event,
        class: "w-full",
        placeholder: "e.g. Gundam Watch Order"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm text-gray-400 mb-1">Description</label>`);
      _push(ssrRenderComponent(unref(Textarea), {
        modelValue: description.value,
        "onUpdate:modelValue": ($event) => description.value = $event,
        class: "w-full",
        rows: "3",
        placeholder: "Describe this watch order..."
      }, null, _parent));
      _push(`</div><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(unref(ToggleSwitch), {
        modelValue: isPublic.value,
        "onUpdate:modelValue": ($event) => isPublic.value = $event
      }, null, _parent));
      _push(`<label class="text-sm text-gray-300 cursor-pointer">Public</label></div>`);
      _push(ssrRenderComponent(unref(Button), {
        label: isNew.value ? "Create Playlist" : "Save Changes",
        loading: saving.value,
        onClick: savePlaylist,
        disabled: !title.value.trim()
      }, null, _parent));
      _push(`</div>`);
      if (!isNew.value) {
        _push(`<!--[--><div class="mb-4"><label class="block text-sm text-gray-400 mb-1">Add anime</label>`);
        _push(ssrRenderComponent(unref(InputText), {
          modelValue: searchQuery.value,
          "onUpdate:modelValue": ($event) => searchQuery.value = $event,
          class: "w-full",
          placeholder: "Search for anime to add...",
          onInput: onSearchInput
        }, null, _parent));
        if (searchResults.value.length > 0) {
          _push(`<div class="mt-1 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden max-h-60 overflow-y-auto"><!--[-->`);
          ssrRenderList(searchResults.value, (anime) => {
            _push(`<button class="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-800 text-left transition">`);
            if (anime.cover_image_medium) {
              _push(`<img${ssrRenderAttr("src", anime.cover_image_medium)}${ssrRenderAttr("alt", displayTitle(anime))} class="w-8 h-11 object-cover rounded">`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="flex-1 min-w-0"><div class="text-sm text-gray-100 truncate">${ssrInterpolate(displayTitle(anime))}</div><div class="text-xs text-gray-500">${ssrInterpolate(anime.format)} · ${ssrInterpolate(anime.episodes ? `${anime.episodes} eps` : "Ongoing")}</div></div></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-2"><!--[-->`);
        ssrRenderList(items.value, (item, index) => {
          _push(`<div class="bg-gray-900 border border-gray-800 rounded-lg p-3"><div class="flex items-center gap-3"><div class="flex flex-col gap-0.5"><button class="text-gray-500 hover:text-gray-300 disabled:opacity-30 text-xs"${ssrIncludeBooleanAttr(index === 0) ? " disabled" : ""}>▲</button><button class="text-gray-500 hover:text-gray-300 disabled:opacity-30 text-xs"${ssrIncludeBooleanAttr(index === items.value.length - 1) ? " disabled" : ""}>▼</button></div><span class="text-sm text-gray-500 w-6 text-center">${ssrInterpolate(index + 1)}</span>`);
          if (item.anime.cover_image_medium) {
            _push(`<img${ssrRenderAttr("src", item.anime.cover_image_medium)}${ssrRenderAttr("alt", displayTitle(item.anime))} class="w-10 h-14 object-cover rounded flex-shrink-0">`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex-1 min-w-0"><div class="text-sm font-medium text-gray-100 truncate">${ssrInterpolate(displayTitle(item.anime))}</div><div class="text-xs text-gray-500">${ssrInterpolate(item.anime.format)} · ${ssrInterpolate(item.anime.episodes ? `${item.anime.episodes} eps` : "Ongoing")}</div></div><label class="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer flex-shrink-0"><input type="checkbox"${ssrIncludeBooleanAttr(item.is_optional) ? " checked" : ""} class="rounded border-gray-600"> Optional </label><button class="text-gray-500 hover:text-red-400 transition text-sm flex-shrink-0"> × </button></div><div class="mt-2 ml-14"><input${ssrRenderAttr("value", item.note ?? "")} type="text" class="w-full bg-transparent border-0 border-b border-gray-800 text-sm text-gray-400 placeholder-gray-600 focus:border-primary-500 focus:ring-0 px-0 py-1" placeholder="Add a note (e.g. &#39;Watch after Season 1 episode 12&#39;)..."></div></div>`);
        });
        _push(`<!--]--></div>`);
        if (items.value.length === 0) {
          _push(`<div class="text-center py-8 text-gray-500 text-sm"> Search above to add anime to this playlist. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PlaylistEditPage.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const __vite_glob_0_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$e
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "PlaylistsIndexPage",
  __ssrInlineRender: true,
  props: {
    playlists: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "My Playlists" }, null, _parent));
      _push(`<div><div class="flex items-center justify-between mb-6"><h1 class="text-2xl font-bold">My Playlists</h1>`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("playlists.create")
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Button), {
              label: "Create Playlist",
              size: "small"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Button), {
                label: "Create Playlist",
                size: "small"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (__props.playlists.length === 0) {
        _push(`<div class="text-center py-16 text-gray-500"><p class="text-lg mb-2">No playlists yet</p><p class="text-sm">Create a watch order playlist to help others discover anime in the right order.</p></div>`);
      } else {
        _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(__props.playlists, (playlist) => {
          _push(ssrRenderComponent(_component_Link, {
            key: playlist.id,
            href: _ctx.route("playlists.edit", { playlist: playlist.slug }),
            class: "block bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition group"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex gap-1 mb-3 h-20 overflow-hidden rounded-lg"${_scopeId}>`);
                if (playlist.cover_images.length > 0) {
                  _push2(`<!--[-->`);
                  ssrRenderList(playlist.cover_images, (src, i2) => {
                    _push2(`<img${ssrRenderAttr("src", src)}${ssrRenderAttr("alt", `Cover ${i2 + 1}`)} class="h-full object-cover flex-1 min-w-0"${_scopeId}>`);
                  });
                  _push2(`<!--]-->`);
                } else {
                  _push2(`<div class="w-full bg-gray-800 flex items-center justify-center text-gray-600 text-sm"${_scopeId}> No anime added </div>`);
                }
                _push2(`</div><h2 class="font-semibold text-gray-100 group-hover:text-primary-400 transition truncate"${_scopeId}>${ssrInterpolate(playlist.title)}</h2><div class="flex items-center gap-2 mt-1 text-xs text-gray-500"${_scopeId}><span${_scopeId}>${ssrInterpolate(playlist.item_count)} anime</span><span${_scopeId}>·</span><span class="${ssrRenderClass(playlist.is_public ? "text-green-500" : "text-gray-500")}"${_scopeId}>${ssrInterpolate(playlist.is_public ? "Public" : "Private")}</span></div>`);
              } else {
                return [
                  createVNode("div", { class: "flex gap-1 mb-3 h-20 overflow-hidden rounded-lg" }, [
                    playlist.cover_images.length > 0 ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(playlist.cover_images, (src, i2) => {
                      return openBlock(), createBlock("img", {
                        key: i2,
                        src,
                        alt: `Cover ${i2 + 1}`,
                        class: "h-full object-cover flex-1 min-w-0"
                      }, null, 8, ["src", "alt"]);
                    }), 128)) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "w-full bg-gray-800 flex items-center justify-center text-gray-600 text-sm"
                    }, " No anime added "))
                  ]),
                  createVNode("h2", { class: "font-semibold text-gray-100 group-hover:text-primary-400 transition truncate" }, toDisplayString(playlist.title), 1),
                  createVNode("div", { class: "flex items-center gap-2 mt-1 text-xs text-gray-500" }, [
                    createVNode("span", null, toDisplayString(playlist.item_count) + " anime", 1),
                    createVNode("span", null, "·"),
                    createVNode("span", {
                      class: playlist.is_public ? "text-green-500" : "text-gray-500"
                    }, toDisplayString(playlist.is_public ? "Public" : "Private"), 3)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PlaylistsIndexPage.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const __vite_glob_0_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$d
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "PrivacyPage",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Privacy Policy" }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description" content="AniTrack Privacy Policy."${_scopeId}><link rel="canonical"${ssrRenderAttr("href", _ctx.route("privacy"))}${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: "AniTrack Privacy Policy."
              }),
              createVNode("link", {
                rel: "canonical",
                href: _ctx.route("privacy")
              }, null, 8, ["href"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mx-auto max-w-3xl space-y-8 py-4"><h1 class="text-3xl font-bold">Privacy Policy</h1><p class="text-sm text-gray-500">Last updated: March 8, 2026</p><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">1. Information We Collect</h2><p class="text-gray-400 leading-relaxed">When you create an account, we collect:</p><ul class="list-disc pl-6 space-y-1 text-gray-400"><li><strong class="text-gray-300">Account information:</strong> name, email address, and password</li><li><strong class="text-gray-300">Profile information:</strong> username, bio, timezone, and avatar (optional)</li><li><strong class="text-gray-300">Anime list data:</strong> your watchlist entries, scores, progress, and notes</li><li><strong class="text-gray-300">Error diagnostics:</strong> when errors occur, we may collect your IP address, browser information, and the page you were visiting to help us diagnose and fix issues</li></ul></section><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">2. How We Use Your Information</h2><p class="text-gray-400 leading-relaxed">Your information is used to:</p><ul class="list-disc pl-6 space-y-1 text-gray-400"><li>Provide and maintain the AniTrack service</li><li>Display your anime tracking data to you</li><li>Show your public profile and list to other users (if you enable sharing)</li><li>Authenticate your account and secure your data</li></ul><p class="text-gray-400 leading-relaxed"> We do not sell your personal information. We do not use your data for advertising or marketing purposes. </p></section><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">3. Cookies</h2><p class="text-gray-400 leading-relaxed">AniTrack uses the following cookies:</p><ul class="list-disc pl-6 space-y-1 text-gray-400"><li><strong class="text-gray-300">Essential cookies:</strong> session cookies to keep you logged in and protect against cross-site request forgery</li><li><strong class="text-gray-300">Analytics cookies:</strong> Google Analytics cookies (e.g. <code class="text-gray-300">_ga</code>, <code class="text-gray-300">_ga_*</code>) to help us understand how visitors use the site. These cookies collect anonymous usage data such as pages visited and session duration</li></ul><p class="text-gray-400 leading-relaxed"> We do not use third-party advertising cookies. </p></section><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">4. Third-Party Services</h2><p class="text-gray-400 leading-relaxed">AniTrack uses the following third-party services:</p><ul class="list-disc pl-6 space-y-1 text-gray-400"><li><strong class="text-gray-300">AniList:</strong> we retrieve anime information from the <a href="https://anilist.co" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:text-primary-300">AniList API</a>. Cover images are served directly from AniList&#39;s CDN.</li><li><strong class="text-gray-300">Google Analytics:</strong> we use <a href="https://marketingplatform.google.com/about/analytics/" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:text-primary-300">Google Analytics 4</a> to collect anonymous usage statistics. This data helps us understand traffic patterns and improve the site. Google may process this data as described in <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:text-primary-300">Google&#39;s Privacy Policy</a>.</li><li><strong class="text-gray-300">Sentry:</strong> we use <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:text-primary-300">Sentry</a> for error tracking and performance monitoring. When an error occurs, Sentry may receive personally identifiable information including your IP address, browser and OS details, the URL you were visiting, and request data. This data is used solely to diagnose and fix bugs. See <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:text-primary-300">Sentry&#39;s Privacy Policy</a> for details.</li></ul><p class="text-gray-400 leading-relaxed"> When you visit AniTrack, your browser may make requests to these external services. </p></section><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">5. Data Retention</h2><p class="text-gray-400 leading-relaxed"> Your account data is retained for as long as your account is active. If you delete your account, your data will be soft-deleted and may be permanently removed after a reasonable retention period. Anime list entries you have deleted are soft-deleted and not immediately purged. </p></section><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">6. Data Security</h2><p class="text-gray-400 leading-relaxed"> We take reasonable measures to protect your information. Passwords are hashed using industry-standard algorithms. All traffic is encrypted via HTTPS. However, no method of transmission over the internet is 100% secure. </p></section><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">7. Your Rights</h2><p class="text-gray-400 leading-relaxed">You have the right to:</p><ul class="list-disc pl-6 space-y-1 text-gray-400"><li>Access your personal data through your account settings</li><li>Update or correct your information at any time</li><li>Export your anime list data</li><li>Delete your account and associated data</li><li>Make your anime list private or public</li></ul></section><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">8. Changes to This Policy</h2><p class="text-gray-400 leading-relaxed"> We may update this privacy policy from time to time. Continued use of the service after changes constitutes acceptance of the updated policy. We encourage you to review this page periodically. </p></section></div><!--]-->`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PrivacyPage.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const __vite_glob_0_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$c
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "ProfilePage",
  __ssrInlineRender: true,
  props: {
    profile: {},
    stats: {},
    avg_score: {},
    episodes_watched: {}
  },
  setup(__props) {
    const props = __props;
    const memberSince = computed(() => {
      return new Date(props.profile.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    });
    const statuses = ["watching", "completed", "plan_to_watch", "on_hold", "dropped"];
    const totalEntries = computed(() => {
      return Object.values(props.stats).reduce((sum, count) => sum + count, 0);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, {
        title: __props.profile.name
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description"${ssrRenderAttr("content", __props.profile.bio || `${__props.profile.name}'s anime profile on AniTrack.`)}${_scopeId}><link rel="canonical"${ssrRenderAttr("href", _ctx.route("profile.show", { user: __props.profile.username }))}${_scopeId}><meta property="og:title"${ssrRenderAttr("content", `${__props.profile.name}'s Profile — AniTrack`)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", __props.profile.bio || `Check out ${__props.profile.name}'s anime profile on AniTrack.`)}${_scopeId}>`);
            if (__props.profile.avatar_url) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", __props.profile.avatar_url)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="profile"${_scopeId}><meta name="twitter:card" content="summary"${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: __props.profile.bio || `${__props.profile.name}'s anime profile on AniTrack.`
              }, null, 8, ["content"]),
              createVNode("link", {
                rel: "canonical",
                href: _ctx.route("profile.show", { user: __props.profile.username })
              }, null, 8, ["href"]),
              createVNode("meta", {
                property: "og:title",
                content: `${__props.profile.name}'s Profile — AniTrack`
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: __props.profile.bio || `Check out ${__props.profile.name}'s anime profile on AniTrack.`
              }, null, 8, ["content"]),
              __props.profile.avatar_url ? (openBlock(), createBlock("meta", {
                key: 0,
                property: "og:image",
                content: __props.profile.avatar_url
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "profile"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="max-w-4xl mx-auto"><div class="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-6"><div class="flex items-center gap-6">`);
      _push(ssrRenderComponent(_sfc_main$T, {
        name: __props.profile.name,
        "avatar-url": __props.profile.avatar_url,
        size: "lg"
      }, null, _parent));
      _push(`<div><h1 class="text-2xl font-bold">${ssrInterpolate(__props.profile.name)}</h1><p class="text-gray-400 text-sm mt-1">Member since ${ssrInterpolate(memberSince.value)}</p>`);
      if (__props.profile.timezone) {
        _push(`<p class="text-gray-500 text-xs mt-1">${ssrInterpolate(__props.profile.timezone)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (__props.profile.bio) {
        _push(`<p class="text-gray-300 mt-4 whitespace-pre-line">${ssrInterpolate(__props.profile.bio)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.profile.list_is_public) {
        _push(ssrRenderComponent(_component_Link, {
          href: _ctx.route("profile.list", { user: __props.profile.username }),
          class: "text-primary-400 hover:text-primary-300 text-sm mt-3 inline-block"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` View Anime List → `);
            } else {
              return [
                createTextVNode(" View Anime List → ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-gray-900 border border-gray-800 rounded-xl p-6"><h2 class="text-lg font-semibold mb-4">Anime Stats</h2>`);
      if (totalEntries.value > 0) {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"><!--[-->`);
        ssrRenderList(statuses, (status) => {
          _push(`<div class="bg-gray-800 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-primary-400">${ssrInterpolate(__props.stats[status] ?? 0)}</div><div class="text-xs text-gray-400 mt-1">${ssrInterpolate(unref(LIST_STATUS_LABELS)[status])}</div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="text-gray-500">No anime in list yet.</p>`);
      }
      if (totalEntries.value > 0) {
        _push(`<div class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4"><div class="bg-gray-800 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-gray-200">${ssrInterpolate(totalEntries.value)}</div><div class="text-xs text-gray-400 mt-1">Total Entries</div></div><div class="bg-gray-800 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-gray-200">${ssrInterpolate(__props.episodes_watched.toLocaleString())}</div><div class="text-xs text-gray-400 mt-1">Episodes Watched</div></div><div class="bg-gray-800 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-gray-200">${ssrInterpolate(__props.avg_score?.toFixed(1) ?? "-")}</div><div class="text-xs text-gray-400 mt-1">Mean Score</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><!--]-->`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/ProfilePage.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const __vite_glob_0_18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$b
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "PublicListPage",
  __ssrInlineRender: true,
  props: {
    profile: {},
    is_public: { type: Boolean },
    entries: {},
    counts: {}
  },
  setup(__props) {
    const props = __props;
    const activeStatus = ref("all");
    const viewMode = ref("table");
    onMounted(() => {
      const saved = localStorage.getItem("list_view");
      if (saved && ["table", "card", "compact"].includes(saved)) {
        viewMode.value = saved;
      }
    });
    const sortField = ref("-updated_at");
    const filteredEntries = computed(() => {
      let entries = props.entries;
      if (activeStatus.value !== "all") {
        entries = entries.filter((e2) => e2.status === activeStatus.value);
      }
      const [dir, field] = sortField.value.startsWith("-") ? ["desc", sortField.value.slice(1)] : ["asc", sortField.value];
      return [...entries].sort((a2, b2) => {
        let aVal = null;
        let bVal = null;
        if (field === "updated_at") {
          aVal = a2.updated_at;
          bVal = b2.updated_at;
        } else if (field === "score") {
          aVal = a2.score ?? -1;
          bVal = b2.score ?? -1;
        } else if (field === "title") {
          aVal = (a2.anime?.title_english || a2.anime?.title_romaji || "").toLowerCase();
          bVal = (b2.anime?.title_english || b2.anime?.title_romaji || "").toLowerCase();
        } else if (field === "progress") {
          aVal = a2.progress;
          bVal = b2.progress;
        }
        if (aVal === null || bVal === null) return 0;
        if (aVal < bVal) return dir === "asc" ? -1 : 1;
        if (aVal > bVal) return dir === "asc" ? 1 : -1;
        return 0;
      });
    });
    const sortOptions = [
      { label: "Last Updated", value: "-updated_at" },
      { label: "Score", value: "-score" },
      { label: "Title", value: "title" },
      { label: "Progress", value: "-progress" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, {
        title: `${__props.profile.name}'s Anime List`
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description"${ssrRenderAttr("content", `Browse ${__props.profile.name}'s anime list on AniTrack.`)}${_scopeId}><link rel="canonical"${ssrRenderAttr("href", _ctx.route("profile.list", { user: __props.profile.username }))}${_scopeId}><meta property="og:title"${ssrRenderAttr("content", `${__props.profile.name}'s Anime List — AniTrack`)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", `Browse ${__props.profile.name}'s anime list on AniTrack.`)}${_scopeId}>`);
            if (__props.profile.avatar_url) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", __props.profile.avatar_url)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary"${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: `Browse ${__props.profile.name}'s anime list on AniTrack.`
              }, null, 8, ["content"]),
              createVNode("link", {
                rel: "canonical",
                href: _ctx.route("profile.list", { user: __props.profile.username })
              }, null, 8, ["href"]),
              createVNode("meta", {
                property: "og:title",
                content: `${__props.profile.name}'s Anime List — AniTrack`
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: `Browse ${__props.profile.name}'s anime list on AniTrack.`
              }, null, 8, ["content"]),
              __props.profile.avatar_url ? (openBlock(), createBlock("meta", {
                key: 0,
                property: "og:image",
                content: __props.profile.avatar_url
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="space-y-4">`);
      if (!__props.is_public) {
        _push(`<div class="max-w-4xl mx-auto text-center py-16"><h1 class="text-2xl font-bold mb-2">${ssrInterpolate(__props.profile.name)}&#39;s Anime List</h1><p class="text-gray-400">This list is private.</p>`);
        _push(ssrRenderComponent(_component_Link, {
          href: _ctx.route("profile.show", { user: __props.profile.username }),
          class: "text-primary-400 hover:text-primary-300 text-sm mt-4 inline-block"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` View profile `);
            } else {
              return [
                createTextVNode(" View profile ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!--[--><div class="flex items-center justify-between"><h1 class="text-2xl font-bold">`);
        _push(ssrRenderComponent(_component_Link, {
          href: _ctx.route("profile.show", { user: __props.profile.username }),
          class: "hover:text-primary-400 transition"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(__props.profile.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(__props.profile.name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`&#39;s Anime List </h1></div>`);
        _push(ssrRenderComponent(_sfc_main$n, {
          "active-status": activeStatus.value,
          counts: __props.counts,
          onChange: ($event) => activeStatus.value = $event
        }, null, _parent));
        _push(`<div class="flex items-center justify-between"><select class="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-gray-300"><!--[-->`);
        ssrRenderList(sortOptions, (opt) => {
          _push(`<option${ssrRenderAttr("value", opt.value)}${ssrIncludeBooleanAttr(Array.isArray(sortField.value) ? ssrLooseContain(sortField.value, opt.value) : ssrLooseEqual(sortField.value, opt.value)) ? " selected" : ""}>${ssrInterpolate(opt.label)}</option>`);
        });
        _push(`<!--]--></select><div class="flex items-center gap-1"><!--[-->`);
        ssrRenderList(["table", "card", "compact"], (mode) => {
          _push(`<button class="${ssrRenderClass([viewMode.value === mode ? "bg-gray-700 text-gray-200" : "text-gray-500 hover:text-gray-300", "rounded px-2 py-1 text-xs transition"])}">${ssrInterpolate(mode.charAt(0).toUpperCase() + mode.slice(1))}</button>`);
        });
        _push(`<!--]--></div></div>`);
        if (viewMode.value === "table") {
          _push(ssrRenderComponent(_sfc_main$m, {
            entries: filteredEntries.value,
            readonly: ""
          }, null, _parent));
        } else if (viewMode.value === "card") {
          _push(ssrRenderComponent(_sfc_main$l, {
            entries: filteredEntries.value,
            readonly: ""
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(_sfc_main$k, {
            entries: filteredEntries.value,
            readonly: ""
          }, null, _parent));
        }
        _push(`<!--]-->`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PublicListPage.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __vite_glob_0_19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$a
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "RegisterPage",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      name: "",
      username: "",
      email: "",
      password: "",
      password_confirmation: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Create Account" }, null, _parent));
      _push(`<div class="max-w-md mx-auto mt-16"><h1 class="text-2xl font-bold mb-6">Create Account</h1><form class="space-y-4"><div><label for="name" class="block text-sm text-gray-400 mb-1">Name</label><input id="name"${ssrRenderAttr("value", unref(form).name)} type="text" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-primary-500 focus:outline-none" required autofocus>`);
      if (unref(form).errors.name) {
        _push(`<p class="text-red-400 text-sm mt-1">${ssrInterpolate(unref(form).errors.name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="username" class="block text-sm text-gray-400 mb-1">Username</label><input id="username"${ssrRenderAttr("value", unref(form).username)} type="text" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-primary-500 focus:outline-none" required placeholder="letters, numbers, hyphens, underscores">`);
      if (unref(form).errors.username) {
        _push(`<p class="text-red-400 text-sm mt-1">${ssrInterpolate(unref(form).errors.username)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="email" class="block text-sm text-gray-400 mb-1">Email</label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-primary-500 focus:outline-none" required>`);
      if (unref(form).errors.email) {
        _push(`<p class="text-red-400 text-sm mt-1">${ssrInterpolate(unref(form).errors.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="password" class="block text-sm text-gray-400 mb-1">Password</label><input id="password"${ssrRenderAttr("value", unref(form).password)} type="password" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-primary-500 focus:outline-none" required>`);
      if (unref(form).errors.password) {
        _push(`<p class="text-red-400 text-sm mt-1">${ssrInterpolate(unref(form).errors.password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="password_confirmation" class="block text-sm text-gray-400 mb-1">Confirm Password</label><input id="password_confirmation"${ssrRenderAttr("value", unref(form).password_confirmation)} type="password" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-primary-500 focus:outline-none" required></div><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition disabled:opacity-50"> Sign Up </button></form><p class="text-gray-500 text-sm mt-4 text-center"> Already have an account? `);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("login"),
        class: "text-primary-400 hover:text-primary-300"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Login`);
          } else {
            return [
              createTextVNode("Login")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div><!--]-->`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/RegisterPage.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __vite_glob_0_20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$9
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "ScheduleDayColumn",
  __ssrInlineRender: true,
  props: {
    utcDate: {},
    slots: {},
    isToday: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const timezone = computed(() => page.props.auth?.user?.timezone);
    const { formatCountdown, formatLocalTime, formatLocalDate } = useCountdown();
    const dayLabel = computed(() => {
      if (!props.slots.length) {
        return (/* @__PURE__ */ new Date(props.utcDate + "T12:00:00Z")).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: timezone.value
        });
      }
      return formatLocalDate(props.slots[0].airs_at, timezone.value);
    });
    const validSlots = computed(() => props.slots.filter((s2) => s2.anime !== null));
    function displayTitle(slot) {
      return slot.anime.title_english || slot.anime.title_romaji || "Unknown";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-2" }, _attrs))}><div class="${ssrRenderClass([__props.isToday ? "bg-primary-600/20 text-primary-400 border border-primary-600/40" : "bg-gray-900 text-gray-400", "rounded-lg px-3 py-2 text-center text-sm font-semibold"])}">${ssrInterpolate(dayLabel.value)} `);
      if (__props.isToday) {
        _push(`<span class="ml-1 text-xs">(Today)</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (validSlots.value.length) {
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(validSlots.value, (slot) => {
          _push(ssrRenderComponent(_component_Link, {
            key: slot.id,
            href: slot.anime.slug ? _ctx.route("anime.show", { anime: slot.anime.slug }) : "#",
            class: "group flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 p-2 transition hover:border-gray-700 hover:bg-gray-900"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="h-14 w-10 shrink-0 overflow-hidden rounded-md bg-gray-800"${_scopeId}>`);
                if (slot.anime.cover_image_medium) {
                  _push2(`<img${ssrRenderAttr("src", slot.anime.cover_image_medium)}${ssrRenderAttr("alt", displayTitle(slot))} class="h-full w-full object-cover" loading="lazy"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><p class="line-clamp-2 text-xs font-medium text-gray-200 group-hover:text-primary-400 transition"${_scopeId}>${ssrInterpolate(displayTitle(slot))}</p><p class="mt-0.5 text-[10px] text-gray-500"${_scopeId}> EP ${ssrInterpolate(slot.episode)} · ${ssrInterpolate(unref(formatLocalTime)(slot.airs_at, timezone.value))}</p><p class="text-[10px] font-medium text-primary-400"${_scopeId}>${ssrInterpolate(unref(formatCountdown)(slot.airs_at))}</p></div>`);
                _push2(ssrRenderComponent(_sfc_main$K, {
                  score: slot.anime.average_score,
                  size: "sm",
                  class: "shrink-0"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode("div", { class: "h-14 w-10 shrink-0 overflow-hidden rounded-md bg-gray-800" }, [
                    slot.anime.cover_image_medium ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: slot.anime.cover_image_medium,
                      alt: displayTitle(slot),
                      class: "h-full w-full object-cover",
                      loading: "lazy"
                    }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "min-w-0 flex-1" }, [
                    createVNode("p", { class: "line-clamp-2 text-xs font-medium text-gray-200 group-hover:text-primary-400 transition" }, toDisplayString(displayTitle(slot)), 1),
                    createVNode("p", { class: "mt-0.5 text-[10px] text-gray-500" }, " EP " + toDisplayString(slot.episode) + " · " + toDisplayString(unref(formatLocalTime)(slot.airs_at, timezone.value)), 1),
                    createVNode("p", { class: "text-[10px] font-medium text-primary-400" }, toDisplayString(unref(formatCountdown)(slot.airs_at)), 1)
                  ]),
                  createVNode(_sfc_main$K, {
                    score: slot.anime.average_score,
                    size: "sm",
                    class: "shrink-0"
                  }, null, 8, ["score"])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="rounded-lg border border-gray-800/50 py-6 text-center text-xs text-gray-600"> No episodes </div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ScheduleDayColumn.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "SchedulePage",
  __ssrInlineRender: true,
  props: {
    days: {},
    weekOffset: {},
    weekStart: {},
    weekEnd: {},
    myListOnly: { type: Boolean },
    isAuth: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const orderedDays = computed(() => {
      const result = [];
      const todayUtc = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      for (let i2 = 0; i2 < 7; i2++) {
        const d2 = new Date(props.weekStart);
        d2.setUTCDate(d2.getUTCDate() + i2);
        const utcDate = d2.toISOString().slice(0, 10);
        result.push({
          utcDate,
          isToday: utcDate === todayUtc
        });
      }
      return result;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Airing Schedule" }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description" content="See what anime is airing this week on AniTrack."${_scopeId}><link rel="canonical"${ssrRenderAttr("href", _ctx.route("schedule"))}${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: "See what anime is airing this week on AniTrack."
              }),
              createVNode("link", {
                rel: "canonical",
                href: _ctx.route("schedule")
              }, null, 8, ["href"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="space-y-6"><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h1 class="text-2xl font-bold text-gray-100">Airing Schedule</h1><div class="flex items-center gap-3">`);
      if (__props.isAuth) {
        _push(`<button class="${ssrRenderClass([__props.myListOnly ? "border-primary-500 bg-primary-600/20 text-primary-400" : "border-gray-700 bg-gray-900 text-gray-400 hover:text-gray-200", "rounded-lg border px-3 py-1.5 text-sm transition"])}"> My List </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center gap-1"><button${ssrIncludeBooleanAttr(__props.weekOffset === 0) ? " disabled" : ""} class="rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-400 transition hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-40"> This Week </button><button${ssrIncludeBooleanAttr(__props.weekOffset === 1) ? " disabled" : ""} class="rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-400 transition hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-40"> Next Week </button></div></div></div><div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7"><!--[-->`);
      ssrRenderList(orderedDays.value, (day) => {
        _push(ssrRenderComponent(_sfc_main$8, {
          key: day.utcDate,
          "utc-date": day.utcDate,
          slots: __props.days[day.utcDate] ?? [],
          "is-today": day.isToday
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      if (!Object.keys(__props.days).length) {
        _push(`<div class="py-16 text-center text-gray-500"><p>No episodes scheduled for this week.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/SchedulePage.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __vite_glob_0_21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$7
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "SeasonSelector",
  __ssrInlineRender: true,
  props: {
    year: {},
    season: {},
    adjacentSeasons: {}
  },
  setup(__props) {
    function seasonLabel(season) {
      return season.charAt(0) + season.slice(1).toLowerCase();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("seasonal", { year: __props.adjacentSeasons.previous.year, season: __props.adjacentSeasons.previous.season.toLowerCase() }),
        class: "rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-gray-200"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ← ${ssrInterpolate(seasonLabel(__props.adjacentSeasons.previous.season))} ${ssrInterpolate(__props.adjacentSeasons.previous.year)}`);
          } else {
            return [
              createTextVNode(" ← " + toDisplayString(seasonLabel(__props.adjacentSeasons.previous.season)) + " " + toDisplayString(__props.adjacentSeasons.previous.year), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h2 class="text-xl font-bold text-gray-100">${ssrInterpolate(seasonLabel(__props.season))} ${ssrInterpolate(__props.year)}</h2>`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("seasonal", { year: __props.adjacentSeasons.next.year, season: __props.adjacentSeasons.next.season.toLowerCase() }),
        class: "rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-gray-200"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(seasonLabel(__props.adjacentSeasons.next.season))} ${ssrInterpolate(__props.adjacentSeasons.next.year)} → `);
          } else {
            return [
              createTextVNode(toDisplayString(seasonLabel(__props.adjacentSeasons.next.season)) + " " + toDisplayString(__props.adjacentSeasons.next.year) + " → ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SeasonSelector.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "SeasonalPage",
  __ssrInlineRender: true,
  props: {
    groups: {},
    year: {},
    season: {},
    adjacentSeasons: {}
  },
  setup(__props) {
    function seasonLabel(season) {
      return season.charAt(0) + season.slice(1).toLowerCase();
    }
    function formatLabel(format2) {
      if (format2 === "OTHER") return "Other";
      return format2.replace(/_/g, " ");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, {
        title: `${seasonLabel(__props.season)} ${__props.year} Anime`
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description"${ssrRenderAttr("content", `Browse all anime airing in ${seasonLabel(__props.season)} ${__props.year}.`)}${_scopeId}><link rel="canonical"${ssrRenderAttr("href", _ctx.route("seasonal"))}${_scopeId}><meta property="og:title"${ssrRenderAttr("content", `${seasonLabel(__props.season)} ${__props.year} Anime — AniTrack`)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", `Browse all anime airing in ${seasonLabel(__props.season)} ${__props.year}.`)}${_scopeId}><meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary"${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: `Browse all anime airing in ${seasonLabel(__props.season)} ${__props.year}.`
              }, null, 8, ["content"]),
              createVNode("link", {
                rel: "canonical",
                href: _ctx.route("seasonal")
              }, null, 8, ["href"]),
              createVNode("meta", {
                property: "og:title",
                content: `${seasonLabel(__props.season)} ${__props.year} Anime — AniTrack`
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: `Browse all anime airing in ${seasonLabel(__props.season)} ${__props.year}.`
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="space-y-8"><div class="flex flex-col items-center gap-4"><h1 class="text-3xl font-bold text-gray-100">Seasonal Anime</h1>`);
      _push(ssrRenderComponent(_sfc_main$6, {
        year: __props.year,
        season: __props.season,
        "adjacent-seasons": __props.adjacentSeasons
      }, null, _parent));
      _push(`</div>`);
      if (__props.groups.length) {
        _push(`<div class="space-y-10"><!--[-->`);
        ssrRenderList(__props.groups, (group) => {
          _push(`<section><h2 class="mb-4 text-xl font-semibold text-gray-200">${ssrInterpolate(formatLabel(group.format))} <span class="ml-2 text-sm font-normal text-gray-500">(${ssrInterpolate(group.anime.length)})</span></h2><div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"><!--[-->`);
          ssrRenderList(group.anime, (anime) => {
            _push(ssrRenderComponent(_sfc_main$C, {
              key: anime.id ?? anime.anilist_id,
              anime,
              "view-mode": "grid"
            }, null, _parent));
          });
          _push(`<!--]--></div></section>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="py-16 text-center"><p class="text-gray-500">No anime found for this season.</p></div>`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/SeasonalPage.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __vite_glob_0_22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "SettingsPage",
  __ssrInlineRender: true,
  props: {
    timezones: {},
    publicApiEnabled: { type: Boolean },
    apiTokens: {},
    passkeys: {}
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const user = computed(() => page.props.auth.user);
    const profileForm = useForm({
      name: user.value.name,
      username: user.value.username,
      email: user.value.email,
      bio: user.value.bio ?? "",
      timezone: user.value.timezone,
      avatar_url: user.value.avatar_url ?? "",
      list_is_public: user.value.list_is_public ?? false
    });
    const passwordForm = useForm({
      current_password: "",
      password: "",
      password_confirmation: ""
    });
    const timezoneOptions = computed(
      () => props.timezones.map((tz) => ({ label: tz, value: tz }))
    );
    const tokenForm = useForm({ name: "" });
    const justCreatedToken = ref(null);
    const revokingId = ref(null);
    watch(
      () => page.props.flash.newApiToken,
      (token) => {
        if (token) {
          justCreatedToken.value = token;
        }
      },
      { immediate: true }
    );
    function revokeToken(token) {
      const confirmed = window.confirm(
        `Revoke "${token.name}"? Any clients using this token will stop working immediately.`
      );
      if (!confirmed) return;
      revokingId.value = token.id;
      router.delete(route("settings.api-tokens.destroy", { token: token.id }), {
        preserveScroll: true,
        onFinish: () => {
          revokingId.value = null;
        }
      });
    }
    function dismissNewToken() {
      justCreatedToken.value = null;
    }
    function copyToken(value) {
      void navigator.clipboard?.writeText(value);
    }
    function formatWhen(iso) {
      if (!iso) return "never";
      return new Date(iso).toLocaleString();
    }
    const passkeySupported = ref(false);
    const passkeyError = ref(null);
    const passkeyBusy = ref(false);
    const passkeyAlias = ref("");
    const passkeyDeletingId = ref(null);
    onMounted(() => {
      passkeySupported.value = Webpass.isSupported();
    });
    function deletePasskey(passkey) {
      if (!window.confirm(`Remove "${passkey.alias}"? You won't be able to sign in with this passkey anymore.`)) {
        return;
      }
      passkeyDeletingId.value = passkey.id;
      router.delete(route("settings.passkeys.destroy", { passkey: passkey.id }), {
        preserveScroll: true,
        onFinish: () => {
          passkeyDeletingId.value = null;
        }
      });
    }
    function summariseUserAgent(ua) {
      if (!ua) return "Unknown device";
      if (/Chrome\/\S+/.test(ua) && /AniTrack/i.test(ua)) return "AniTrack Chrome Extension";
      if (/Chrome\/\S+/.test(ua)) return "Chrome";
      if (/Firefox\/\S+/.test(ua)) return "Firefox";
      if (/Safari\/\S+/.test(ua) && !/Chrome/.test(ua)) return "Safari";
      if (/curl\/\S+/i.test(ua)) return "curl";
      if (/PostmanRuntime/i.test(ua)) return "Postman";
      return ua.slice(0, 60);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Settings" }, null, _parent));
      _push(`<div class="max-w-2xl mx-auto space-y-8"><h1 class="text-2xl font-bold">Settings</h1>`);
      if (unref(page).props.flash.message) {
        _push(`<div class="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg">${ssrInterpolate(unref(page).props.flash.message)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-gray-900 border border-gray-800 rounded-xl p-6"><h2 class="text-lg font-semibold mb-4">Profile</h2><form class="space-y-4"><div><label class="block text-sm text-gray-400 mb-1">Name</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        modelValue: unref(profileForm).name,
        "onUpdate:modelValue": ($event) => unref(profileForm).name = $event,
        class: "w-full",
        invalid: !!unref(profileForm).errors.name
      }, null, _parent));
      if (unref(profileForm).errors.name) {
        _push(`<p class="text-red-400 text-sm mt-1">${ssrInterpolate(unref(profileForm).errors.name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm text-gray-400 mb-1">Username</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        modelValue: unref(profileForm).username,
        "onUpdate:modelValue": ($event) => unref(profileForm).username = $event,
        class: "w-full",
        invalid: !!unref(profileForm).errors.username
      }, null, _parent));
      _push(`<p class="text-gray-500 text-xs mt-1">Your profile URL: /user/${ssrInterpolate(unref(profileForm).username || "...")}</p>`);
      if (unref(profileForm).errors.username) {
        _push(`<p class="text-red-400 text-sm mt-1">${ssrInterpolate(unref(profileForm).errors.username)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm text-gray-400 mb-1">Email</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        modelValue: unref(profileForm).email,
        "onUpdate:modelValue": ($event) => unref(profileForm).email = $event,
        type: "email",
        class: "w-full",
        invalid: !!unref(profileForm).errors.email
      }, null, _parent));
      if (unref(profileForm).errors.email) {
        _push(`<p class="text-red-400 text-sm mt-1">${ssrInterpolate(unref(profileForm).errors.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm text-gray-400 mb-1">Bio</label>`);
      _push(ssrRenderComponent(unref(Textarea), {
        modelValue: unref(profileForm).bio,
        "onUpdate:modelValue": ($event) => unref(profileForm).bio = $event,
        rows: "3",
        class: "w-full",
        invalid: !!unref(profileForm).errors.bio
      }, null, _parent));
      if (unref(profileForm).errors.bio) {
        _push(`<p class="text-red-400 text-sm mt-1">${ssrInterpolate(unref(profileForm).errors.bio)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm text-gray-400 mb-1">Timezone</label>`);
      _push(ssrRenderComponent(unref(Select), {
        modelValue: unref(profileForm).timezone,
        "onUpdate:modelValue": ($event) => unref(profileForm).timezone = $event,
        options: timezoneOptions.value,
        "option-label": "label",
        "option-value": "value",
        filter: "",
        class: "w-full",
        invalid: !!unref(profileForm).errors.timezone
      }, null, _parent));
      if (unref(profileForm).errors.timezone) {
        _push(`<p class="text-red-400 text-sm mt-1">${ssrInterpolate(unref(profileForm).errors.timezone)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm text-gray-400 mb-1">Avatar URL</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        modelValue: unref(profileForm).avatar_url,
        "onUpdate:modelValue": ($event) => unref(profileForm).avatar_url = $event,
        class: "w-full",
        placeholder: "https://example.com/avatar.jpg",
        invalid: !!unref(profileForm).errors.avatar_url
      }, null, _parent));
      if (unref(profileForm).errors.avatar_url) {
        _push(`<p class="text-red-400 text-sm mt-1">${ssrInterpolate(unref(profileForm).errors.avatar_url)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(unref(ToggleSwitch), {
        modelValue: unref(profileForm).list_is_public,
        "onUpdate:modelValue": ($event) => unref(profileForm).list_is_public = $event
      }, null, _parent));
      _push(`<label class="text-sm text-gray-400">Make my anime list public</label></div>`);
      _push(ssrRenderComponent(unref(Button), {
        type: "submit",
        label: "Save Profile",
        loading: unref(profileForm).processing,
        disabled: unref(profileForm).processing
      }, null, _parent));
      _push(`</form></div><div class="bg-gray-900 border border-gray-800 rounded-xl p-6"><h2 class="text-lg font-semibold mb-4">Change Password</h2><form class="space-y-4"><div><label class="block text-sm text-gray-400 mb-1">Current Password</label>`);
      _push(ssrRenderComponent(unref(Password), {
        modelValue: unref(passwordForm).current_password,
        "onUpdate:modelValue": ($event) => unref(passwordForm).current_password = $event,
        feedback: false,
        "toggle-mask": "",
        class: "w-full",
        "input-class": "w-full",
        invalid: !!unref(passwordForm).errors.current_password
      }, null, _parent));
      if (unref(passwordForm).errors.current_password) {
        _push(`<p class="text-red-400 text-sm mt-1">${ssrInterpolate(unref(passwordForm).errors.current_password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm text-gray-400 mb-1">New Password</label>`);
      _push(ssrRenderComponent(unref(Password), {
        modelValue: unref(passwordForm).password,
        "onUpdate:modelValue": ($event) => unref(passwordForm).password = $event,
        feedback: false,
        "toggle-mask": "",
        class: "w-full",
        "input-class": "w-full",
        invalid: !!unref(passwordForm).errors.password
      }, null, _parent));
      if (unref(passwordForm).errors.password) {
        _push(`<p class="text-red-400 text-sm mt-1">${ssrInterpolate(unref(passwordForm).errors.password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm text-gray-400 mb-1">Confirm New Password</label>`);
      _push(ssrRenderComponent(unref(Password), {
        modelValue: unref(passwordForm).password_confirmation,
        "onUpdate:modelValue": ($event) => unref(passwordForm).password_confirmation = $event,
        feedback: false,
        "toggle-mask": "",
        class: "w-full",
        "input-class": "w-full"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(Button), {
        type: "submit",
        label: "Change Password",
        severity: "secondary",
        loading: unref(passwordForm).processing,
        disabled: unref(passwordForm).processing
      }, null, _parent));
      _push(`</form></div><div class="bg-gray-900 border border-gray-800 rounded-xl p-6"><h2 class="text-lg font-semibold mb-1">Passkeys</h2><p class="text-sm text-gray-400 mb-4"> Sign in without a password using a security key (e.g. YubiKey), your device&#39;s biometrics, or another authenticator. </p>`);
      if (!passkeySupported.value) {
        _push(`<div class="text-sm text-amber-300 bg-amber-950/40 border border-amber-800 rounded-lg p-3 mb-4"> Your browser doesn&#39;t support passkeys. Try the latest Chrome, Firefox, or Safari. </div>`);
      } else {
        _push(`<form class="flex gap-2 mb-6"><div class="flex-1">`);
        _push(ssrRenderComponent(unref(InputText), {
          modelValue: passkeyAlias.value,
          "onUpdate:modelValue": ($event) => passkeyAlias.value = $event,
          placeholder: "e.g. YubiKey 5C, MacBook Touch ID",
          class: "w-full",
          disabled: passkeyBusy.value
        }, null, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(unref(Button), {
          type: "submit",
          label: passkeyBusy.value ? "Waiting for passkey…" : "Add passkey",
          loading: passkeyBusy.value,
          disabled: passkeyBusy.value
        }, null, _parent));
        _push(`</form>`);
      }
      if (passkeyError.value) {
        _push(`<p class="text-red-400 text-sm mb-4">${ssrInterpolate(passkeyError.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.passkeys.length === 0) {
        _push(`<div class="text-sm text-gray-500"> No passkeys yet. Add one above to enable passwordless sign-in. </div>`);
      } else {
        _push(`<ul class="divide-y divide-gray-800"><!--[-->`);
        ssrRenderList(__props.passkeys, (passkey) => {
          _push(`<li class="py-3 flex items-start justify-between gap-3"><div class="min-w-0 flex-1"><div class="font-medium truncate">${ssrInterpolate(passkey.alias)}</div><div class="text-xs text-gray-600 mt-0.5"> Added ${ssrInterpolate(formatWhen(passkey.created_at))}</div></div>`);
          _push(ssrRenderComponent(unref(Button), {
            type: "button",
            size: "small",
            label: "Remove",
            severity: "danger",
            outlined: "",
            loading: passkeyDeletingId.value === passkey.id,
            disabled: passkeyDeletingId.value === passkey.id,
            onClick: ($event) => deletePasskey(passkey)
          }, null, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul>`);
      }
      _push(`</div>`);
      if (__props.publicApiEnabled) {
        _push(`<div class="bg-gray-900 border border-gray-800 rounded-xl p-6"><h2 class="text-lg font-semibold mb-1">API Tokens</h2><p class="text-sm text-gray-400 mb-4"> Issue tokens for third-party integrations. Each token can read and modify your list on your behalf — treat them like passwords. See the `);
        _push(ssrRenderComponent(_component_Link, {
          href: _ctx.route("developers"),
          class: "text-emerald-400 hover:underline"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`developer docs`);
            } else {
              return [
                createTextVNode("developer docs")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(` for endpoint details. </p>`);
        if (justCreatedToken.value) {
          _push(`<div class="bg-amber-950/40 border border-amber-800 rounded-lg p-4 mb-4"><div class="flex items-start justify-between gap-3"><div class="min-w-0 flex-1"><p class="text-amber-300 text-sm font-medium mb-1"> Copy your token now — you won&#39;t be able to see it again. </p><p class="text-gray-400 text-xs mb-2"><strong>${ssrInterpolate(justCreatedToken.value.name)}</strong></p><code class="block w-full break-all bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm font-mono text-amber-200">${ssrInterpolate(justCreatedToken.value.plain_text)}</code></div><div class="flex flex-col gap-2 shrink-0">`);
          _push(ssrRenderComponent(unref(Button), {
            type: "button",
            size: "small",
            label: "Copy",
            severity: "secondary",
            onClick: ($event) => copyToken(justCreatedToken.value.plain_text)
          }, null, _parent));
          _push(ssrRenderComponent(unref(Button), {
            type: "button",
            size: "small",
            label: "Dismiss",
            severity: "secondary",
            text: "",
            onClick: dismissNewToken
          }, null, _parent));
          _push(`</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<form class="flex gap-2 mb-6"><div class="flex-1">`);
        _push(ssrRenderComponent(unref(InputText), {
          modelValue: unref(tokenForm).name,
          "onUpdate:modelValue": ($event) => unref(tokenForm).name = $event,
          placeholder: "e.g. Chrome Extension — Work Laptop",
          class: "w-full",
          invalid: !!unref(tokenForm).errors.name
        }, null, _parent));
        if (unref(tokenForm).errors.name) {
          _push(`<p class="text-red-400 text-sm mt-1">${ssrInterpolate(unref(tokenForm).errors.name)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        _push(ssrRenderComponent(unref(Button), {
          type: "submit",
          label: "Create Token",
          loading: unref(tokenForm).processing,
          disabled: unref(tokenForm).processing || unref(tokenForm).name.trim().length === 0
        }, null, _parent));
        _push(`</form>`);
        if (__props.apiTokens.length === 0) {
          _push(`<div class="text-sm text-gray-500"> No tokens yet. Create one above to get started. </div>`);
        } else {
          _push(`<ul class="divide-y divide-gray-800"><!--[-->`);
          ssrRenderList(__props.apiTokens, (token) => {
            _push(`<li class="py-3 flex items-start justify-between gap-3"><div class="min-w-0 flex-1"><div class="flex items-center gap-2"><span class="font-medium truncate">${ssrInterpolate(token.name)}</span></div><div class="text-xs text-gray-500 mt-1 space-x-2"><span>Last used: ${ssrInterpolate(formatWhen(token.last_used_at))}</span>`);
            if (token.last_used_ip) {
              _push(`<span>· from ${ssrInterpolate(token.last_used_ip)}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (token.last_used_user_agent) {
              _push(`<span> · ${ssrInterpolate(summariseUserAgent(token.last_used_user_agent))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="text-xs text-gray-600 mt-0.5"> Created ${ssrInterpolate(formatWhen(token.created_at))}</div></div>`);
            _push(ssrRenderComponent(unref(Button), {
              type: "button",
              size: "small",
              label: "Revoke",
              severity: "danger",
              outlined: "",
              loading: revokingId.value === token.id,
              disabled: revokingId.value === token.id,
              onClick: ($event) => revokeToken(token)
            }, null, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/SettingsPage.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __vite_glob_0_23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$4
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "StudioDetailPage",
  __ssrInlineRender: true,
  props: {
    studio: {},
    anime: {},
    og: {},
    kind: {}
  },
  setup(__props) {
    const props = __props;
    const labels = computed(() => props.kind === "producer" ? {
      breadcrumbText: "Producers",
      breadcrumbRoute: "producers.index",
      kindLabel: "Producer",
      emptyMessage: "No anime found for this producer."
    } : {
      breadcrumbText: "Studios",
      breadcrumbRoute: "studios.index",
      kindLabel: "Animation studio",
      emptyMessage: "No anime found for this studio."
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, {
        title: __props.studio.name
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description"${ssrRenderAttr("content", __props.og.description)}${_scopeId}><link rel="canonical"${ssrRenderAttr("href", __props.og.url)}${_scopeId}><meta property="og:title"${ssrRenderAttr("content", __props.og.title)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", __props.og.description)}${_scopeId}><meta property="og:url"${ssrRenderAttr("content", __props.og.url)}${_scopeId}><meta property="og:type" content="website"${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: __props.og.description
              }, null, 8, ["content"]),
              createVNode("link", {
                rel: "canonical",
                href: __props.og.url
              }, null, 8, ["href"]),
              createVNode("meta", {
                property: "og:title",
                content: __props.og.title
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: __props.og.description
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:url",
                content: __props.og.url
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div><div class="mb-6"><div class="text-sm text-gray-500">`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route(labels.value.breadcrumbRoute),
        class: "text-primary-400 hover:text-primary-300"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(labels.value.breadcrumbText)}`);
          } else {
            return [
              createTextVNode(toDisplayString(labels.value.breadcrumbText), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="mx-2 text-gray-600">/</span><span>${ssrInterpolate(__props.studio.name)}</span></div><h1 class="mt-2 text-2xl font-bold text-gray-100 md:text-3xl">${ssrInterpolate(__props.studio.name)}</h1><p class="mt-1 text-sm text-gray-400">${ssrInterpolate(labels.value.kindLabel)} · ${ssrInterpolate(__props.studio.anime_count.toLocaleString())} anime </p>`);
      if (__props.studio.website_url) {
        _push(`<a${ssrRenderAttr("href", __props.studio.website_url)} target="_blank" rel="noopener noreferrer" class="mt-2 inline-block text-sm text-primary-400 hover:text-primary-300"> Official website → </a>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.anime.data.length) {
        _push(`<div><div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"><!--[-->`);
        ssrRenderList(__props.anime.data, (item) => {
          _push(ssrRenderComponent(_sfc_main$C, {
            key: item.id ?? item.anilist_id,
            anime: item,
            "view-mode": "grid"
          }, null, _parent));
        });
        _push(`<!--]--></div><div class="mt-8">`);
        _push(ssrRenderComponent(_sfc_main$M, {
          "current-page": __props.anime.meta.current_page,
          "last-page": __props.anime.meta.last_page,
          total: __props.anime.meta.total
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<div class="py-16 text-center"><p class="text-gray-500">${ssrInterpolate(labels.value.emptyMessage)}</p></div>`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/StudioDetailPage.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __vite_glob_0_24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "StudioIndexPage",
  __ssrInlineRender: true,
  props: {
    studios: {},
    filters: {},
    kind: {}
  },
  setup(__props) {
    const props = __props;
    const labels = computed(() => props.kind === "producer" ? {
      heading: "Anime Producers",
      description: "Browse anime production companies and licensors.",
      countSuffix: "producers",
      searchPlaceholder: "Search producers...",
      empty: "No producers found.",
      indexRoute: "producers.index",
      showRoute: "producers.show"
    } : {
      heading: "Anime Studios",
      description: "Browse animation studios and explore their catalog.",
      countSuffix: "animation studios",
      searchPlaceholder: "Search studios...",
      empty: "No studios found.",
      indexRoute: "studios.index",
      showRoute: "studios.show"
    });
    const search = ref(props.filters.search);
    function studioUrl(studio) {
      return studio.slug ? route(labels.value.showRoute, { studio: studio.slug }) : "#";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, {
        title: labels.value.heading
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description"${ssrRenderAttr("content", labels.value.description)}${_scopeId}><link rel="canonical"${ssrRenderAttr("href", _ctx.route(labels.value.indexRoute))}${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: labels.value.description
              }, null, 8, ["content"]),
              createVNode("link", {
                rel: "canonical",
                href: _ctx.route(labels.value.indexRoute)
              }, null, 8, ["href"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div><div class="mb-6"><h1 class="text-2xl font-bold text-gray-100 md:text-3xl">${ssrInterpolate(labels.value.heading)}</h1><p class="mt-1 text-sm text-gray-400"> Browse ${ssrInterpolate(__props.studios.meta.total.toLocaleString())} ${ssrInterpolate(labels.value.countSuffix)}. </p></div><div class="mb-6"><form><input${ssrRenderAttr("value", search.value)} type="search"${ssrRenderAttr("placeholder", labels.value.searchPlaceholder)} class="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"></form></div>`);
      if (__props.studios.data.length) {
        _push(`<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
        ssrRenderList(__props.studios.data, (studio) => {
          _push(ssrRenderComponent(_component_Link, {
            key: studio.id,
            href: studioUrl(studio),
            class: "group flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3 transition hover:border-primary-600 hover:bg-gray-900"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="truncate font-medium text-gray-200 group-hover:text-primary-400"${_scopeId}>${ssrInterpolate(studio.name)}</span><span class="ml-3 shrink-0 rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400"${_scopeId}>${ssrInterpolate(studio.anime_count)}</span>`);
              } else {
                return [
                  createVNode("span", { class: "truncate font-medium text-gray-200 group-hover:text-primary-400" }, toDisplayString(studio.name), 1),
                  createVNode("span", { class: "ml-3 shrink-0 rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400" }, toDisplayString(studio.anime_count), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="py-16 text-center"><p class="text-gray-500">${ssrInterpolate(labels.value.empty)}</p></div>`);
      }
      _push(`<div class="mt-8">`);
      _push(ssrRenderComponent(_sfc_main$M, {
        "current-page": __props.studios.meta.current_page,
        "last-page": __props.studios.meta.last_page,
        total: __props.studios.meta.total
      }, null, _parent));
      _push(`</div></div><!--]-->`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/StudioIndexPage.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __vite_glob_0_25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "TermsPage",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Terms of Service" }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description" content="AniTrack Terms of Service."${_scopeId}><link rel="canonical"${ssrRenderAttr("href", _ctx.route("terms"))}${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: "AniTrack Terms of Service."
              }),
              createVNode("link", {
                rel: "canonical",
                href: _ctx.route("terms")
              }, null, 8, ["href"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mx-auto max-w-3xl space-y-8 py-4"><h1 class="text-3xl font-bold">Terms of Service</h1><p class="text-sm text-gray-500">Last updated: March 8, 2026</p><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">1. Acceptance of Terms</h2><p class="text-gray-400 leading-relaxed"> By accessing or using AniTrack, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service. </p></section><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">2. Description of Service</h2><p class="text-gray-400 leading-relaxed"> AniTrack is a personal anime tracking platform that allows users to browse anime information, maintain a personal watchlist, track viewing progress, and share their anime list with others. </p></section><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">3. User Accounts</h2><p class="text-gray-400 leading-relaxed"> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate information when creating an account and keep it up to date. You may not create accounts for the purpose of abusing the service or other users. </p></section><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">4. Acceptable Use</h2><p class="text-gray-400 leading-relaxed">You agree not to:</p><ul class="list-disc pl-6 space-y-1 text-gray-400"><li>Use the service for any unlawful purpose</li><li>Attempt to gain unauthorised access to any part of the service</li><li>Interfere with or disrupt the service or its infrastructure</li><li>Scrape, crawl, or otherwise extract data from the service in an automated manner beyond normal use</li><li>Impersonate any person or entity</li></ul></section><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">5. Third-Party Content</h2><p class="text-gray-400 leading-relaxed"> Anime information, metadata, and images displayed on AniTrack are sourced from third-party providers, primarily AniList. AniTrack does not claim ownership of this content. The accuracy and availability of third-party content is not guaranteed. </p></section><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">6. Limitation of Liability</h2><p class="text-gray-400 leading-relaxed"> AniTrack is provided &quot;as is&quot; without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free. In no event shall AniTrack be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service. </p></section><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">7. Termination</h2><p class="text-gray-400 leading-relaxed"> We reserve the right to suspend or terminate your account at our discretion, without prior notice, for conduct that we determine violates these terms or is harmful to the service or other users. You may delete your account at any time through the settings page. </p></section><section class="space-y-3"><h2 class="text-xl font-semibold text-gray-200">8. Changes to Terms</h2><p class="text-gray-400 leading-relaxed"> We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the updated terms. We encourage you to review this page periodically. </p></section></div><!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/TermsPage.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __vite_glob_0_26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$Q },
  __name: "TopAnimePage",
  __ssrInlineRender: true,
  props: {
    anime: {},
    metric: {}
  },
  setup(__props) {
    function displayTitle(anime) {
      return anime.title_english || anime.title_romaji;
    }
    function formatLabel(format2) {
      if (!format2) return "";
      return format2.replace(/_/g, " ");
    }
    function animeUrl(anime) {
      if (anime.slug) {
        return route("anime.show", { anime: anime.slug });
      }
      if (anime.anilist_id) {
        return route("anime.show.anilist", { anilistId: anime.anilist_id });
      }
      return "#";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, {
        title: __props.metric === "rated" ? "Top Rated Anime" : "Most Popular Anime"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description"${ssrRenderAttr("content", __props.metric === "rated" ? "The highest rated anime of all time." : "The most popular anime of all time.")}${_scopeId}><link rel="canonical"${ssrRenderAttr("href", __props.metric === "rated" ? _ctx.route("top.rated") : _ctx.route("top.popular"))}${_scopeId}><meta property="og:title"${ssrRenderAttr("content", __props.metric === "rated" ? "Top 100 Rated Anime — AniTrack" : "Top 100 Most Popular Anime — AniTrack")}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", __props.metric === "rated" ? "The highest rated anime of all time." : "The most popular anime of all time.")}${_scopeId}><meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary"${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: __props.metric === "rated" ? "The highest rated anime of all time." : "The most popular anime of all time."
              }, null, 8, ["content"]),
              createVNode("link", {
                rel: "canonical",
                href: __props.metric === "rated" ? _ctx.route("top.rated") : _ctx.route("top.popular")
              }, null, 8, ["href"]),
              createVNode("meta", {
                property: "og:title",
                content: __props.metric === "rated" ? "Top 100 Rated Anime — AniTrack" : "Top 100 Most Popular Anime — AniTrack"
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: __props.metric === "rated" ? "The highest rated anime of all time." : "The most popular anime of all time."
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mx-auto max-w-5xl space-y-6"><h1 class="text-3xl font-bold text-gray-100 text-center">Top 100 Anime</h1><div class="flex justify-center gap-1 rounded-lg bg-gray-900 p-1">`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("top.rated"),
        class: ["rounded-md px-6 py-2 text-sm font-medium transition", __props.metric === "rated" ? "bg-gray-700 text-gray-100" : "text-gray-400 hover:text-gray-200"]
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Top Rated `);
          } else {
            return [
              createTextVNode(" Top Rated ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("top.popular"),
        class: ["rounded-md px-6 py-2 text-sm font-medium transition", __props.metric === "popular" ? "bg-gray-700 text-gray-100" : "text-gray-400 hover:text-gray-200"]
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Most Popular `);
          } else {
            return [
              createTextVNode(" Most Popular ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="space-y-2"><!--[-->`);
      ssrRenderList(__props.anime, (item, index) => {
        _push(ssrRenderComponent(_component_Link, {
          key: item.id ?? item.anilist_id,
          href: animeUrl(item),
          class: "flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900 p-3 transition hover:border-gray-700 hover:bg-gray-800/80"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="${ssrRenderClass([index < 3 ? "text-primary-400" : "text-gray-500", "w-10 shrink-0 text-center text-lg font-bold"])}"${_scopeId}>${ssrInterpolate(index + 1)}</div><div class="h-16 w-11 shrink-0 overflow-hidden rounded bg-gray-800"${_scopeId}>`);
              if (item.cover_image_medium || item.cover_image_large) {
                _push2(`<img${ssrRenderAttr("src", (item.cover_image_medium || item.cover_image_large) ?? void 0)}${ssrRenderAttr("alt", displayTitle(item))} class="h-full w-full object-cover" loading="lazy"${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><h3 class="truncate font-medium text-gray-200"${_scopeId}>${ssrInterpolate(displayTitle(item))}</h3><div class="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500"${_scopeId}>`);
              if (item.format) {
                _push2(`<span${_scopeId}>${ssrInterpolate(formatLabel(item.format))}</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (item.episodes) {
                _push2(`<span${_scopeId}>${ssrInterpolate(item.episodes)} ep</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (item.status) {
                _push2(`<span class="hidden sm:inline"${_scopeId}>${ssrInterpolate(item.status.replace(/_/g, " "))}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="flex shrink-0 items-center gap-4"${_scopeId}>`);
              if (__props.metric === "rated") {
                _push2(`<div class="text-right"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$K, {
                  score: item.bayesian_score ?? item.average_score,
                  size: "md"
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.metric === "popular") {
                _push2(`<div class="text-right"${_scopeId}><span class="text-sm font-semibold text-gray-300"${_scopeId}>${ssrInterpolate(item.popularity?.toLocaleString())}</span><div class="text-[10px] text-gray-500"${_scopeId}>popularity</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="hidden text-right sm:block"${_scopeId}>`);
              if (__props.metric === "rated") {
                _push2(`<span class="text-xs text-gray-500"${_scopeId}>${ssrInterpolate(item.popularity?.toLocaleString())} pop</span>`);
              } else {
                _push2(ssrRenderComponent(_sfc_main$K, {
                  score: item.bayesian_score ?? item.average_score,
                  size: "sm"
                }, null, _parent2, _scopeId));
              }
              _push2(`</div></div>`);
            } else {
              return [
                createVNode("div", {
                  class: ["w-10 shrink-0 text-center text-lg font-bold", index < 3 ? "text-primary-400" : "text-gray-500"]
                }, toDisplayString(index + 1), 3),
                createVNode("div", { class: "h-16 w-11 shrink-0 overflow-hidden rounded bg-gray-800" }, [
                  item.cover_image_medium || item.cover_image_large ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: (item.cover_image_medium || item.cover_image_large) ?? void 0,
                    alt: displayTitle(item),
                    class: "h-full w-full object-cover",
                    loading: "lazy"
                  }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "min-w-0 flex-1" }, [
                  createVNode("h3", { class: "truncate font-medium text-gray-200" }, toDisplayString(displayTitle(item)), 1),
                  createVNode("div", { class: "mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500" }, [
                    item.format ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(formatLabel(item.format)), 1)) : createCommentVNode("", true),
                    item.episodes ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(item.episodes) + " ep", 1)) : createCommentVNode("", true),
                    item.status ? (openBlock(), createBlock("span", {
                      key: 2,
                      class: "hidden sm:inline"
                    }, toDisplayString(item.status.replace(/_/g, " ")), 1)) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("div", { class: "flex shrink-0 items-center gap-4" }, [
                  __props.metric === "rated" ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-right"
                  }, [
                    createVNode(_sfc_main$K, {
                      score: item.bayesian_score ?? item.average_score,
                      size: "md"
                    }, null, 8, ["score"])
                  ])) : createCommentVNode("", true),
                  __props.metric === "popular" ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-right"
                  }, [
                    createVNode("span", { class: "text-sm font-semibold text-gray-300" }, toDisplayString(item.popularity?.toLocaleString()), 1),
                    createVNode("div", { class: "text-[10px] text-gray-500" }, "popularity")
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "hidden text-right sm:block" }, [
                    __props.metric === "rated" ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "text-xs text-gray-500"
                    }, toDisplayString(item.popularity?.toLocaleString()) + " pop", 1)) : (openBlock(), createBlock(_sfc_main$K, {
                      key: 1,
                      score: item.bayesian_score ?? item.average_score,
                      size: "sm"
                    }, null, 8, ["score"]))
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/TopAnimePage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __vite_glob_0_27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main
}, Symbol.toStringTag, { value: "Module" }));
function t() {
  return t = Object.assign ? Object.assign.bind() : function(t3) {
    for (var e2 = 1; e2 < arguments.length; e2++) {
      var o2 = arguments[e2];
      for (var n2 in o2) ({}).hasOwnProperty.call(o2, n2) && (t3[n2] = o2[n2]);
    }
    return t3;
  }, t.apply(null, arguments);
}
const e = String.prototype.replace, o = /%20/g, n = { RFC1738: function(t3) {
  return e.call(t3, o, "+");
}, RFC3986: function(t3) {
  return String(t3);
} };
var r = "RFC3986";
const i = Object.prototype.hasOwnProperty, s = Array.isArray, u = /* @__PURE__ */ new WeakMap();
var l = function(t3, e2) {
  return u.set(t3, e2), t3;
};
function c(t3) {
  return u.has(t3);
}
var a = function(t3) {
  return u.get(t3);
}, f = function(t3, e2) {
  u.set(t3, e2);
};
const p = (function() {
  const t3 = [];
  for (let e2 = 0; e2 < 256; ++e2) t3.push("%" + ((e2 < 16 ? "0" : "") + e2.toString(16)).toUpperCase());
  return t3;
})(), y = function(t3, e2) {
  const o2 = e2 && e2.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (let e3 = 0; e3 < t3.length; ++e3) void 0 !== t3[e3] && (o2[e3] = t3[e3]);
  return o2;
}, d = function t2(e2, o2, n2) {
  if (!o2) return e2;
  if ("object" != typeof o2) {
    if (s(e2)) e2.push(o2);
    else {
      if (!e2 || "object" != typeof e2) return [e2, o2];
      if (c(e2)) {
        var r2 = a(e2) + 1;
        e2[r2] = o2, f(e2, r2);
      } else (n2 && (n2.plainObjects || n2.allowPrototypes) || !i.call(Object.prototype, o2)) && (e2[o2] = true);
    }
    return e2;
  }
  if (!e2 || "object" != typeof e2) {
    if (c(o2)) {
      for (var u2 = Object.keys(o2), p2 = n2 && n2.plainObjects ? { __proto__: null, 0: e2 } : { 0: e2 }, d2 = 0; d2 < u2.length; d2++) p2[parseInt(u2[d2], 10) + 1] = o2[u2[d2]];
      return l(p2, a(o2) + 1);
    }
    return [e2].concat(o2);
  }
  let h2 = e2;
  return s(e2) && !s(o2) && (h2 = y(e2, n2)), s(e2) && s(o2) ? (o2.forEach(function(o3, r3) {
    if (i.call(e2, r3)) {
      const i2 = e2[r3];
      i2 && "object" == typeof i2 && o3 && "object" == typeof o3 ? e2[r3] = t2(i2, o3, n2) : e2.push(o3);
    } else e2[r3] = o3;
  }), e2) : Object.keys(o2).reduce(function(e3, r3) {
    const s2 = o2[r3];
    return e3[r3] = i.call(e3, r3) ? t2(e3[r3], s2, n2) : s2, e3;
  }, h2);
}, h = 1024, b = function(t3, e2, o2, n2) {
  if (c(t3)) {
    var r2 = a(t3) + 1;
    return t3[r2] = e2, f(t3, r2), t3;
  }
  var i2 = [].concat(t3, e2);
  return i2.length > o2 ? l(y(i2, { plainObjects: n2 }), i2.length - 1) : i2;
}, m = function(t3, e2) {
  if (s(t3)) {
    const o2 = [];
    for (let n2 = 0; n2 < t3.length; n2 += 1) o2.push(e2(t3[n2]));
    return o2;
  }
  return e2(t3);
}, g = Object.prototype.hasOwnProperty, w = { brackets: function(t3) {
  return t3 + "[]";
}, comma: "comma", indices: function(t3, e2) {
  return t3 + "[" + e2 + "]";
}, repeat: function(t3) {
  return t3;
} }, v = Array.isArray, j = Array.prototype.push, $ = function(t3, e2) {
  j.apply(t3, v(e2) ? e2 : [e2]);
}, E = Date.prototype.toISOString, O = { addQueryPrefix: false, allowDots: false, allowEmptyArrays: false, arrayFormat: "indices", charset: "utf-8", charsetSentinel: false, delimiter: "&", encode: true, encodeDotInKeys: false, encoder: function(t3, e2, o2, n2, r2) {
  if (0 === t3.length) return t3;
  let i2 = t3;
  if ("symbol" == typeof t3 ? i2 = Symbol.prototype.toString.call(t3) : "string" != typeof t3 && (i2 = String(t3)), "iso-8859-1" === o2) return escape(i2).replace(/%u[0-9a-f]{4}/gi, function(t4) {
    return "%26%23" + parseInt(t4.slice(2), 16) + "%3B";
  });
  let s2 = "";
  for (let t4 = 0; t4 < i2.length; t4 += h) {
    const e3 = i2.length >= h ? i2.slice(t4, t4 + h) : i2, o3 = [];
    for (let t5 = 0; t5 < e3.length; ++t5) {
      let n3 = e3.charCodeAt(t5);
      45 === n3 || 46 === n3 || 95 === n3 || 126 === n3 || n3 >= 48 && n3 <= 57 || n3 >= 65 && n3 <= 90 || n3 >= 97 && n3 <= 122 || "RFC1738" === r2 && (40 === n3 || 41 === n3) ? o3[o3.length] = e3.charAt(t5) : n3 < 128 ? o3[o3.length] = p[n3] : n3 < 2048 ? o3[o3.length] = p[192 | n3 >> 6] + p[128 | 63 & n3] : n3 < 55296 || n3 >= 57344 ? o3[o3.length] = p[224 | n3 >> 12] + p[128 | n3 >> 6 & 63] + p[128 | 63 & n3] : (t5 += 1, n3 = 65536 + ((1023 & n3) << 10 | 1023 & e3.charCodeAt(t5)), o3[o3.length] = p[240 | n3 >> 18] + p[128 | n3 >> 12 & 63] + p[128 | n3 >> 6 & 63] + p[128 | 63 & n3]);
    }
    s2 += o3.join("");
  }
  return s2;
}, encodeValuesOnly: false, format: r, formatter: n[r], indices: false, serializeDate: function(t3) {
  return E.call(t3);
}, skipNulls: false, strictNullHandling: false }, T = {}, R = function(t3, e2, o2, n2, r2, i2, s2, u2, l2, c2, a2, f2, p2, y2, d2, h2, b2, g2) {
  let w2 = t3, j2 = g2, E2 = 0, _2 = false;
  for (; void 0 !== (j2 = j2.get(T)) && !_2; ) {
    const e3 = j2.get(t3);
    if (E2 += 1, void 0 !== e3) {
      if (e3 === E2) throw new RangeError("Cyclic object value");
      _2 = true;
    }
    void 0 === j2.get(T) && (E2 = 0);
  }
  if ("function" == typeof c2 ? w2 = c2(e2, w2) : w2 instanceof Date ? w2 = p2(w2) : "comma" === o2 && v(w2) && (w2 = m(w2, function(t4) {
    return t4 instanceof Date ? p2(t4) : t4;
  })), null === w2) {
    if (i2) return l2 && !h2 ? l2(e2, O.encoder, b2, "key", y2) : e2;
    w2 = "";
  }
  if ("string" == typeof (I2 = w2) || "number" == typeof I2 || "boolean" == typeof I2 || "symbol" == typeof I2 || "bigint" == typeof I2 || (function(t4) {
    return !(!t4 || "object" != typeof t4 || !(t4.constructor && t4.constructor.isBuffer && t4.constructor.isBuffer(t4)));
  })(w2)) return l2 ? [d2(h2 ? e2 : l2(e2, O.encoder, b2, "key", y2)) + "=" + d2(l2(w2, O.encoder, b2, "value", y2))] : [d2(e2) + "=" + d2(String(w2))];
  var I2;
  const S2 = [];
  if (void 0 === w2) return S2;
  let A2;
  if ("comma" === o2 && v(w2)) h2 && l2 && (w2 = m(w2, l2)), A2 = [{ value: w2.length > 0 ? w2.join(",") || null : void 0 }];
  else if (v(c2)) A2 = c2;
  else {
    const t4 = Object.keys(w2);
    A2 = a2 ? t4.sort(a2) : t4;
  }
  const D2 = u2 ? e2.replace(/\./g, "%2E") : e2, k2 = n2 && v(w2) && 1 === w2.length ? D2 + "[]" : D2;
  if (r2 && v(w2) && 0 === w2.length) return k2 + "[]";
  for (let e3 = 0; e3 < A2.length; ++e3) {
    const m2 = A2[e3], j3 = "object" == typeof m2 && void 0 !== m2.value ? m2.value : w2[m2];
    if (s2 && null === j3) continue;
    const O2 = f2 && u2 ? m2.replace(/\./g, "%2E") : m2, _3 = v(w2) ? "function" == typeof o2 ? o2(k2, O2) : k2 : k2 + (f2 ? "." + O2 : "[" + O2 + "]");
    g2.set(t3, E2);
    const I3 = /* @__PURE__ */ new WeakMap();
    I3.set(T, g2), $(S2, R(j3, _3, o2, n2, r2, i2, s2, u2, "comma" === o2 && h2 && v(w2) ? null : l2, c2, a2, f2, p2, y2, d2, h2, b2, I3));
  }
  return S2;
}, _ = Object.prototype.hasOwnProperty, I = Array.isArray, S = { allowDots: false, allowEmptyArrays: false, allowPrototypes: false, allowSparse: false, arrayLimit: 20, charset: "utf-8", charsetSentinel: false, comma: false, decodeDotInKeys: false, decoder: function(t3, e2, o2) {
  const n2 = t3.replace(/\+/g, " ");
  if ("iso-8859-1" === o2) return n2.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(n2);
  } catch (t4) {
    return n2;
  }
}, delimiter: "&", depth: 5, duplicates: "combine", ignoreQueryPrefix: false, interpretNumericEntities: false, parameterLimit: 1e3, parseArrays: true, plainObjects: false, strictNullHandling: false }, A = function(t3) {
  return t3.replace(/&#(\d+);/g, function(t4, e2) {
    return String.fromCharCode(parseInt(e2, 10));
  });
}, D = function(t3, e2) {
  return t3 && "string" == typeof t3 && e2.comma && t3.indexOf(",") > -1 ? t3.split(",") : t3;
}, k = function(t3, e2, o2, n2) {
  if (!t3) return;
  const r2 = o2.allowDots ? t3.replace(/\.([^.[]+)/g, "[$1]") : t3, i2 = /(\[[^[\]]*])/g;
  let s2 = o2.depth > 0 && /(\[[^[\]]*])/.exec(r2);
  const u2 = s2 ? r2.slice(0, s2.index) : r2, l2 = [];
  if (u2) {
    if (!o2.plainObjects && _.call(Object.prototype, u2) && !o2.allowPrototypes) return;
    l2.push(u2);
  }
  let a2 = 0;
  for (; o2.depth > 0 && null !== (s2 = i2.exec(r2)) && a2 < o2.depth; ) {
    if (a2 += 1, !o2.plainObjects && _.call(Object.prototype, s2[1].slice(1, -1)) && !o2.allowPrototypes) return;
    l2.push(s2[1]);
  }
  return s2 && l2.push("[" + r2.slice(s2.index) + "]"), (function(t4, e3, o3, n3) {
    let r3 = n3 ? e3 : D(e3, o3);
    for (let e4 = t4.length - 1; e4 >= 0; --e4) {
      let n4;
      const i3 = t4[e4];
      if ("[]" === i3 && o3.parseArrays) n4 = c(r3) ? r3 : o3.allowEmptyArrays && ("" === r3 || o3.strictNullHandling && null === r3) ? [] : b([], r3, o3.arrayLimit, o3.plainObjects);
      else {
        n4 = o3.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
        const t5 = "[" === i3.charAt(0) && "]" === i3.charAt(i3.length - 1) ? i3.slice(1, -1) : i3, e5 = o3.decodeDotInKeys ? t5.replace(/%2E/g, ".") : t5, s3 = parseInt(e5, 10);
        o3.parseArrays || "" !== e5 ? !isNaN(s3) && i3 !== e5 && String(s3) === e5 && s3 >= 0 && o3.parseArrays && s3 <= o3.arrayLimit ? (n4 = [], n4[s3] = r3) : "__proto__" !== e5 && (n4[e5] = r3) : n4 = { 0: r3 };
      }
      r3 = n4;
    }
    return r3;
  })(l2, e2, o2, n2);
};
function N(t3, e2) {
  const o2 = /* @__PURE__ */ (function(t4) {
    return S;
  })();
  if ("" === t3 || null == t3) return o2.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  const n2 = "string" == typeof t3 ? (function(t4, e3) {
    const o3 = { __proto__: null }, n3 = (e3.ignoreQueryPrefix ? t4.replace(/^\?/, "") : t4).split(e3.delimiter, Infinity === e3.parameterLimit ? void 0 : e3.parameterLimit);
    let r3, i3 = -1, s2 = e3.charset;
    if (e3.charsetSentinel) for (r3 = 0; r3 < n3.length; ++r3) 0 === n3[r3].indexOf("utf8=") && ("utf8=%E2%9C%93" === n3[r3] ? s2 = "utf-8" : "utf8=%26%2310003%3B" === n3[r3] && (s2 = "iso-8859-1"), i3 = r3, r3 = n3.length);
    for (r3 = 0; r3 < n3.length; ++r3) {
      if (r3 === i3) continue;
      const t5 = n3[r3], u2 = t5.indexOf("]="), l2 = -1 === u2 ? t5.indexOf("=") : u2 + 1;
      let c2, a2;
      -1 === l2 ? (c2 = e3.decoder(t5, S.decoder, s2, "key"), a2 = e3.strictNullHandling ? null : "") : (c2 = e3.decoder(t5.slice(0, l2), S.decoder, s2, "key"), a2 = m(D(t5.slice(l2 + 1), e3), function(t6) {
        return e3.decoder(t6, S.decoder, s2, "value");
      })), a2 && e3.interpretNumericEntities && "iso-8859-1" === s2 && (a2 = A(a2)), t5.indexOf("[]=") > -1 && (a2 = I(a2) ? [a2] : a2);
      const f2 = _.call(o3, c2);
      f2 && "combine" === e3.duplicates ? o3[c2] = b(o3[c2], a2, e3.arrayLimit, e3.plainObjects) : f2 && "last" !== e3.duplicates || (o3[c2] = a2);
    }
    return o3;
  })(t3, o2) : t3;
  let r2 = o2.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  const i2 = Object.keys(n2);
  for (let e3 = 0; e3 < i2.length; ++e3) {
    const s2 = i2[e3], u2 = k(s2, n2[s2], o2, "string" == typeof t3);
    r2 = d(r2, u2, o2);
  }
  return true === o2.allowSparse ? r2 : (function(t4) {
    const e3 = [{ obj: { o: t4 }, prop: "o" }], o3 = [];
    for (let t5 = 0; t5 < e3.length; ++t5) {
      const n3 = e3[t5], r3 = n3.obj[n3.prop], i3 = Object.keys(r3);
      for (let t6 = 0; t6 < i3.length; ++t6) {
        const n4 = i3[t6], s2 = r3[n4];
        "object" == typeof s2 && null !== s2 && -1 === o3.indexOf(s2) && (e3.push({ obj: r3, prop: n4 }), o3.push(s2));
      }
    }
    return (function(t5) {
      for (; t5.length > 1; ) {
        const e4 = t5.pop(), o4 = e4.obj[e4.prop];
        if (s(o4)) {
          const t6 = [];
          for (let e5 = 0; e5 < o4.length; ++e5) void 0 !== o4[e5] && t6.push(o4[e5]);
          e4.obj[e4.prop] = t6;
        }
      }
    })(e3), t4;
  })(r2);
}
class x {
  constructor(t3, e2, o2) {
    var n2, r2;
    this.name = t3, this.definition = e2, this.bindings = null != (n2 = e2.bindings) ? n2 : {}, this.wheres = null != (r2 = e2.wheres) ? r2 : {}, this.config = o2;
  }
  get template() {
    const t3 = `${this.origin}/${this.definition.uri}`.replace(/\/+$/, "");
    return "" === t3 ? "/" : t3;
  }
  get origin() {
    return this.config.absolute ? this.definition.domain ? `${this.config.url.match(/^\w+:\/\//)[0]}${this.definition.domain}${this.config.port ? `:${this.config.port}` : ""}` : this.config.url : "";
  }
  get parameterSegments() {
    var t3, e2;
    return null != (t3 = null == (e2 = this.template.match(/{[^}?]+\??}/g)) ? void 0 : e2.map((t4) => ({ name: t4.replace(/{|\??}/g, ""), required: !/\?}$/.test(t4) }))) ? t3 : [];
  }
  matchesUrl(t3) {
    var e2;
    if (!this.definition.methods.includes("GET")) return false;
    const o2 = this.template.replace(/[.*+$()[\]]/g, "\\$&").replace(/(\/?){([^}?]*)(\??)}/g, (t4, e3, o3, n3) => {
      var r3;
      const i3 = `(?<${o3}>${(null == (r3 = this.wheres[o3]) ? void 0 : r3.replace(/(^\^)|(\$$)/g, "")) || "[^/?]+"})`;
      return n3 ? `(${e3}${i3})?` : `${e3}${i3}`;
    }).replace(/^\w+:\/\//, ""), [n2, r2] = t3.replace(/^\w+:\/\//, "").split("?"), i2 = null != (e2 = new RegExp(`^${o2}/?$`).exec(n2)) ? e2 : new RegExp(`^${o2}/?$`).exec(decodeURI(n2));
    if (i2) {
      for (const t4 in i2.groups) i2.groups[t4] = "string" == typeof i2.groups[t4] ? decodeURIComponent(i2.groups[t4]) : i2.groups[t4];
      return { params: i2.groups, query: N(r2) };
    }
    return false;
  }
  compile(t3) {
    return this.parameterSegments.length ? this.template.replace(/{([^}?]+)(\??)}/g, (e2, o2, n2) => {
      var r2, i2;
      if (!n2 && [null, void 0].includes(t3[o2])) throw new Error(`Ziggy error: '${o2}' parameter is required for route '${this.name}'.`);
      if (this.wheres[o2] && !new RegExp(`^${n2 ? `(${this.wheres[o2]})?` : this.wheres[o2]}$`).test(null != (i2 = t3[o2]) ? i2 : "")) throw new Error(`Ziggy error: '${o2}' parameter '${t3[o2]}' does not match required format '${this.wheres[o2]}' for route '${this.name}'.`);
      return encodeURI(null != (r2 = t3[o2]) ? r2 : "").replace(/%7C/g, "|").replace(/%25/g, "%").replace(/\$/g, "%24");
    }).replace(this.config.absolute ? /(\.[^/]+?)(\/\/)/ : /(^)(\/\/)/, "$1/").replace(/\/+$/, "") : this.template;
  }
}
class C extends String {
  constructor(e2, o2, n2 = true, r2) {
    if (super(), this.t = null != r2 ? r2 : "undefined" != typeof Ziggy ? Ziggy : null == globalThis ? void 0 : globalThis.Ziggy, !this.t && "undefined" != typeof document && document.getElementById("ziggy-routes-json") && (globalThis.Ziggy = JSON.parse(document.getElementById("ziggy-routes-json").textContent), this.t = globalThis.Ziggy), this.t = t({}, this.t, { absolute: n2 }), e2) {
      if (!this.t.routes[e2]) throw new Error(`Ziggy error: route '${e2}' is not in the route list.`);
      this.i = new x(e2, this.t.routes[e2], this.t), this.u = this.l(o2);
    }
  }
  toString() {
    const e2 = Object.keys(this.u).filter((t3) => !this.i.parameterSegments.some(({ name: e3 }) => e3 === t3)).filter((t3) => "_query" !== t3).reduce((e3, o2) => t({}, e3, { [o2]: this.u[o2] }), {});
    return this.i.compile(this.u) + (function(t3, e3) {
      let o2 = t3;
      const i2 = (function(t4) {
        if (!t4) return O;
        if (void 0 !== t4.allowEmptyArrays && "boolean" != typeof t4.allowEmptyArrays) throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
        if (void 0 !== t4.encodeDotInKeys && "boolean" != typeof t4.encodeDotInKeys) throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
        if (null != t4.encoder && "function" != typeof t4.encoder) throw new TypeError("Encoder has to be a function.");
        const e4 = t4.charset || O.charset;
        if (void 0 !== t4.charset && "utf-8" !== t4.charset && "iso-8859-1" !== t4.charset) throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
        let o3 = r;
        if (void 0 !== t4.format) {
          if (!g.call(n, t4.format)) throw new TypeError("Unknown format option provided.");
          o3 = t4.format;
        }
        const i3 = n[o3];
        let s3, u3 = O.filter;
        if (("function" == typeof t4.filter || v(t4.filter)) && (u3 = t4.filter), s3 = t4.arrayFormat in w ? t4.arrayFormat : "indices" in t4 ? t4.indices ? "indices" : "repeat" : O.arrayFormat, "commaRoundTrip" in t4 && "boolean" != typeof t4.commaRoundTrip) throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
        return { addQueryPrefix: "boolean" == typeof t4.addQueryPrefix ? t4.addQueryPrefix : O.addQueryPrefix, allowDots: void 0 === t4.allowDots ? true === t4.encodeDotInKeys || O.allowDots : !!t4.allowDots, allowEmptyArrays: "boolean" == typeof t4.allowEmptyArrays ? !!t4.allowEmptyArrays : O.allowEmptyArrays, arrayFormat: s3, charset: e4, charsetSentinel: "boolean" == typeof t4.charsetSentinel ? t4.charsetSentinel : O.charsetSentinel, commaRoundTrip: t4.commaRoundTrip, delimiter: void 0 === t4.delimiter ? O.delimiter : t4.delimiter, encode: "boolean" == typeof t4.encode ? t4.encode : O.encode, encodeDotInKeys: "boolean" == typeof t4.encodeDotInKeys ? t4.encodeDotInKeys : O.encodeDotInKeys, encoder: "function" == typeof t4.encoder ? t4.encoder : O.encoder, encodeValuesOnly: "boolean" == typeof t4.encodeValuesOnly ? t4.encodeValuesOnly : O.encodeValuesOnly, filter: u3, format: o3, formatter: i3, serializeDate: "function" == typeof t4.serializeDate ? t4.serializeDate : O.serializeDate, skipNulls: "boolean" == typeof t4.skipNulls ? t4.skipNulls : O.skipNulls, sort: "function" == typeof t4.sort ? t4.sort : null, strictNullHandling: "boolean" == typeof t4.strictNullHandling ? t4.strictNullHandling : O.strictNullHandling };
      })(e3);
      let s2, u2;
      "function" == typeof i2.filter ? (u2 = i2.filter, o2 = u2("", o2)) : v(i2.filter) && (u2 = i2.filter, s2 = u2);
      const l2 = [];
      if ("object" != typeof o2 || null === o2) return "";
      const c2 = w[i2.arrayFormat], a2 = "comma" === c2 && i2.commaRoundTrip;
      s2 || (s2 = Object.keys(o2)), i2.sort && s2.sort(i2.sort);
      const f2 = /* @__PURE__ */ new WeakMap();
      for (let t4 = 0; t4 < s2.length; ++t4) {
        const e4 = s2[t4];
        i2.skipNulls && null === o2[e4] || $(l2, R(o2[e4], e4, c2, a2, i2.allowEmptyArrays, i2.strictNullHandling, i2.skipNulls, i2.encodeDotInKeys, i2.encode ? i2.encoder : null, i2.filter, i2.sort, i2.allowDots, i2.serializeDate, i2.format, i2.formatter, i2.encodeValuesOnly, i2.charset, f2));
      }
      const p2 = l2.join(i2.delimiter);
      let y2 = true === i2.addQueryPrefix ? "?" : "";
      return i2.charsetSentinel && (y2 += "iso-8859-1" === i2.charset ? "utf8=%26%2310003%3B&" : "utf8=%E2%9C%93&"), p2.length > 0 ? y2 + p2 : "";
    })(t({}, e2, this.u._query), { addQueryPrefix: true, arrayFormat: "indices", encodeValuesOnly: true, skipNulls: true, encoder: (t3, e3) => "boolean" == typeof t3 ? Number(t3) : e3(t3) });
  }
  p(e2) {
    e2 ? this.t.absolute && e2.startsWith("/") && (e2 = this.h().host + e2) : e2 = this.m();
    let o2 = {};
    const [n2, r2] = Object.entries(this.t.routes).find(([t3, n3]) => o2 = new x(t3, n3, this.t).matchesUrl(e2)) || [void 0, void 0];
    return t({ name: n2 }, o2, { route: r2 });
  }
  m() {
    const { host: t3, pathname: e2, search: o2 } = this.h();
    return (this.t.absolute ? t3 + e2 : e2.replace(this.t.url.replace(/^\w*:\/\/[^/]+/, ""), "").replace(/^\/+/, "/")) + o2;
  }
  current(e2, o2) {
    const { name: n2, params: r2, query: i2, route: s2 } = this.p();
    if (!e2) return n2;
    const u2 = new RegExp(`^${e2.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`).test(n2);
    if ([null, void 0].includes(o2) || !u2) return u2;
    const l2 = new x(n2, s2, this.t);
    o2 = this.l(o2, l2);
    const c2 = t({}, r2, i2);
    if (Object.values(o2).every((t3) => !t3) && !Object.values(c2).some((t3) => void 0 !== t3)) return true;
    const a2 = (t3, e3) => Object.entries(t3).every(([t4, o3]) => Array.isArray(o3) && Array.isArray(e3[t4]) ? o3.every((o4) => e3[t4].includes(o4) || e3[t4].includes(decodeURIComponent(o4))) : "object" == typeof o3 && "object" == typeof e3[t4] && null !== o3 && null !== e3[t4] ? a2(o3, e3[t4]) : e3[t4] == o3 || e3[t4] == decodeURIComponent(o3));
    return a2(o2, c2);
  }
  h() {
    var t3, e2, o2, n2, r2, i2;
    const { host: s2 = "", pathname: u2 = "", search: l2 = "" } = "undefined" != typeof window ? window.location : {};
    return { host: null != (t3 = null == (e2 = this.t.location) ? void 0 : e2.host) ? t3 : s2, pathname: null != (o2 = null == (n2 = this.t.location) ? void 0 : n2.pathname) ? o2 : u2, search: null != (r2 = null == (i2 = this.t.location) ? void 0 : i2.search) ? r2 : l2 };
  }
  get params() {
    const { params: e2, query: o2 } = this.p();
    return t({}, e2, o2);
  }
  get routeParams() {
    return this.p().params;
  }
  get queryParams() {
    return this.p().query;
  }
  has(t3) {
    return this.t.routes.hasOwnProperty(t3);
  }
  l(e2 = {}, o2 = this.i) {
    null != e2 || (e2 = {}), e2 = ["string", "number"].includes(typeof e2) ? [e2] : e2;
    const n2 = o2.parameterSegments.filter(({ name: t3 }) => !this.t.defaults[t3]);
    return Array.isArray(e2) ? e2 = e2.reduce((e3, o3, r2) => t({}, e3, n2[r2] ? { [n2[r2].name]: o3 } : "object" == typeof o3 ? o3 : { [o3]: "" }), {}) : 1 !== n2.length || e2[n2[0].name] || !e2.hasOwnProperty(Object.values(o2.bindings)[0]) && !e2.hasOwnProperty("id") || (e2 = { [n2[0].name]: e2 }), t({}, this.v(o2), this.j(e2, o2));
  }
  v(e2) {
    return e2.parameterSegments.filter(({ name: t3 }) => this.t.defaults[t3]).reduce((e3, { name: o2 }, n2) => t({}, e3, { [o2]: this.t.defaults[o2] }), {});
  }
  j(e2, { bindings: o2, parameterSegments: n2 }) {
    return Object.entries(e2).reduce((e3, [r2, i2]) => {
      if (!i2 || "object" != typeof i2 || Array.isArray(i2) || !n2.some(({ name: t3 }) => t3 === r2)) return t({}, e3, { [r2]: i2 });
      if (!i2.hasOwnProperty(o2[r2])) {
        if (!i2.hasOwnProperty("id")) throw new Error(`Ziggy error: object passed as '${r2}' parameter is missing route model binding key '${o2[r2]}'.`);
        o2[r2] = "id";
      }
      return t({}, e3, { [r2]: i2[o2[r2]] });
    }, {});
  }
  valueOf() {
    return this.toString();
  }
}
function P(t3, e2, o2, n2) {
  const r2 = new C(t3, e2, o2, n2);
  return t3 ? r2.toString() : r2;
}
const U = { install(t3, e2) {
  const o2 = (t4, o3, n2, r2 = e2) => P(t4, o3, n2, r2);
  parseInt(t3.version) > 2 ? (t3.config.globalProperties.route = o2, t3.provide("route", o2)) : t3.mixin({ methods: { route: o2 } });
} };
createServer(
  (page) => createInertiaApp({
    page,
    render: renderToString,
    title: (title) => title ? `${title} — AniTrack` : "AniTrack",
    resolve: (name) => {
      const pages = /* @__PURE__ */ Object.assign({ "./Pages/Admin/DashboardPage.vue": __vite_glob_0_0, "./Pages/Admin/FeatureFlagsPage.vue": __vite_glob_0_1, "./Pages/Admin/UsersPage.vue": __vite_glob_0_2, "./Pages/AnimeDetailPage.vue": __vite_glob_0_3, "./Pages/AnimeIndexPage.vue": __vite_glob_0_4, "./Pages/DevelopersPage.vue": __vite_glob_0_5, "./Pages/ErrorPage.vue": __vite_glob_0_6, "./Pages/HomePage.vue": __vite_glob_0_7, "./Pages/ImportPage.vue": __vite_glob_0_8, "./Pages/LoginPage.vue": __vite_glob_0_9, "./Pages/MyListPage.vue": __vite_glob_0_10, "./Pages/NotFoundPage.vue": __vite_glob_0_11, "./Pages/PeopleIndexPage.vue": __vite_glob_0_12, "./Pages/PersonDetailPage.vue": __vite_glob_0_13, "./Pages/PlaylistDetailPage.vue": __vite_glob_0_14, "./Pages/PlaylistEditPage.vue": __vite_glob_0_15, "./Pages/PlaylistsIndexPage.vue": __vite_glob_0_16, "./Pages/PrivacyPage.vue": __vite_glob_0_17, "./Pages/ProfilePage.vue": __vite_glob_0_18, "./Pages/PublicListPage.vue": __vite_glob_0_19, "./Pages/RegisterPage.vue": __vite_glob_0_20, "./Pages/SchedulePage.vue": __vite_glob_0_21, "./Pages/SeasonalPage.vue": __vite_glob_0_22, "./Pages/SettingsPage.vue": __vite_glob_0_23, "./Pages/StudioDetailPage.vue": __vite_glob_0_24, "./Pages/StudioIndexPage.vue": __vite_glob_0_25, "./Pages/TermsPage.vue": __vite_glob_0_26, "./Pages/TopAnimePage.vue": __vite_glob_0_27 });
      const page2 = pages[`./Pages/${name}.vue`];
      if (!page2) return pages["./Pages/ErrorPage.vue"];
      return page2;
    },
    setup({ App, props, plugin }) {
      const app = createSSRApp({ render: () => h$1(App, props) });
      app.use(plugin);
      const ziggy = props.initialPage.props.ziggy;
      globalThis.Ziggy = ziggy;
      app.use(U, {
        ...ziggy,
        location: ziggy?.location ? new URL(ziggy.location) : void 0
      });
      globalThis.route = app.config.globalProperties.route;
      app.use(createPinia());
      app.use(VueQueryPlugin);
      app.use(PrimeVue, {
        unstyled: false,
        theme: {
          preset: Aura,
          options: {
            darkModeSelector: ".dark"
          }
        }
      });
      app.use(ToastService);
      app.component("Link", Link);
      app.component("Head", Head);
      return app;
    }
  })
);
export {
  br as b,
  qn as q
};
