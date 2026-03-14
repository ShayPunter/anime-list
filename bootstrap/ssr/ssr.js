import { defineComponent, computed, mergeProps, useSSRContext, ref, resolveComponent, withCtx, createTextVNode, watch, onUnmounted, unref, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, onMounted, withDirectives, vModelText, Fragment, renderList, reactive, onScopeDispose, resolveDynamicComponent, createSSRApp, h as h$1 } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderAttr, ssrRenderStyle, ssrLooseContain, ssrLooseEqual, ssrRenderVNode, renderToString } from "vue/server-renderer";
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
import ToggleSwitch from "primevue/toggleswitch";
import Password from "primevue/password";
import createServer from "@inertiajs/vue3/server";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Aura from "@primevue/themes/aura";
const _sfc_main$N = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$N = _sfc_main$N.setup;
_sfc_main$N.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/UserAvatar.vue");
  return _sfc_setup$N ? _sfc_setup$N(props, ctx) : void 0;
};
const _sfc_main$M = /* @__PURE__ */ defineComponent({
  __name: "AppNavbar",
  __ssrInlineRender: true,
  props: {
    user: {},
    isAuthenticated: { type: Boolean }
  },
  setup(__props) {
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
        href: _ctx.route("search"),
        class: "text-gray-400 hover:text-gray-100 transition"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Search`);
          } else {
            return [
              createTextVNode("Search")
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
        _push(`<div class="relative"><button class="flex items-center gap-2 text-gray-400 hover:text-gray-100 transition">`);
        _push(ssrRenderComponent(_sfc_main$N, {
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
const _sfc_setup$M = _sfc_main$M.setup;
_sfc_main$M.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AppNavbar.vue");
  return _sfc_setup$M ? _sfc_setup$M(props, ctx) : void 0;
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$L = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
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
  _push(`</li></ul></div><div><h3 class="mb-3 text-sm font-semibold text-gray-300">Legal</h3><ul class="space-y-2 text-sm"><li>`);
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
}
const _sfc_setup$L = _sfc_main$L.setup;
_sfc_main$L.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AppFooter.vue");
  return _sfc_setup$L ? _sfc_setup$L(props, ctx) : void 0;
};
const AppFooter = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["ssrRender", _sfc_ssrRender]]);
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
const _sfc_main$K = /* @__PURE__ */ defineComponent({
  __name: "AppLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const user = computed(() => page.props.auth.user);
    const isAuthenticated = computed(() => !!user.value);
    useFlashToast();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-950 text-gray-100 dark" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$M, {
        user: user.value,
        "is-authenticated": isAuthenticated.value
      }, null, _parent));
      _push(`<main class="container mx-auto px-4 py-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(ssrRenderComponent(unref(Toast), { position: "top-right" }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$K = _sfc_main$K.setup;
_sfc_main$K.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/AppLayout.vue");
  return _sfc_setup$K ? _sfc_setup$K(props, ctx) : void 0;
};
const _sfc_main$J = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
      const _component_Link = resolveComponent("Link");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Admin Dashboard" }, null, _parent));
      _push(`<div class="mx-auto max-w-6xl space-y-8"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold">Admin Dashboard</h1>`);
      _push(ssrRenderComponent(_component_Link, {
        href: _ctx.route("admin.users"),
        class: "rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Manage Users `);
          } else {
            return [
              createTextVNode(" Manage Users ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"><div class="rounded-xl border border-gray-800 bg-gray-900 p-4"><div class="text-2xl font-bold text-primary-400">${ssrInterpolate(__props.stats.total_users.toLocaleString())}</div><div class="mt-1 text-xs text-gray-400">Total Users</div></div><div class="rounded-xl border border-gray-800 bg-gray-900 p-4"><div class="text-2xl font-bold text-primary-400">${ssrInterpolate(__props.stats.new_users_this_month)}</div><div class="mt-1 text-xs text-gray-400">New This Month</div></div><div class="rounded-xl border border-gray-800 bg-gray-900 p-4"><div class="text-2xl font-bold text-primary-400">${ssrInterpolate(__props.stats.total_anime.toLocaleString())}</div><div class="mt-1 text-xs text-gray-400">Anime in DB</div></div><div class="rounded-xl border border-gray-800 bg-gray-900 p-4"><div class="text-2xl font-bold text-primary-400">${ssrInterpolate(__props.stats.total_list_entries.toLocaleString())}</div><div class="mt-1 text-xs text-gray-400">List Entries</div></div><div class="rounded-xl border border-gray-800 bg-gray-900 p-4"><div class="text-2xl font-bold text-primary-400">${ssrInterpolate(__props.stats.total_episodes_watched.toLocaleString())}</div><div class="mt-1 text-xs text-gray-400">Episodes Watched</div></div><div class="rounded-xl border border-gray-800 bg-gray-900 p-4"><div class="text-2xl font-bold text-primary-400">${ssrInterpolate(__props.stats.active_users_today)}</div><div class="mt-1 text-xs text-gray-400">Active Today</div></div></div><div class="grid gap-6 lg:grid-cols-2"><div class="rounded-xl border border-gray-800 bg-gray-900 p-6"><h2 class="mb-4 text-lg font-semibold">Sync Status</h2><div class="space-y-3"><div class="flex items-center justify-between"><span class="text-sm text-gray-400">Releasing Anime</span><span class="${ssrRenderClass([syncStatusColor(__props.syncStatuses.releasing), "text-sm font-medium capitalize"])}">${ssrInterpolate(__props.syncStatuses.releasing)}</span></div><div class="flex items-center justify-between"><span class="text-sm text-gray-400">Incremental Sync</span><span class="${ssrRenderClass([syncStatusColor(__props.syncStatuses.incremental), "text-sm font-medium capitalize"])}">${ssrInterpolate(__props.syncStatuses.incremental)}</span></div><div class="flex items-center justify-between"><span class="text-sm text-gray-400">Airing Schedule</span><span class="${ssrRenderClass([syncStatusColor(__props.syncStatuses.schedule), "text-sm font-medium capitalize"])}">${ssrInterpolate(__props.syncStatuses.schedule)}</span></div></div></div><div class="rounded-xl border border-gray-800 bg-gray-900 p-6"><h2 class="mb-4 text-lg font-semibold">Recent Users</h2><div class="space-y-3"><!--[-->`);
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
const _sfc_setup$J = _sfc_main$J.setup;
_sfc_main$J.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/DashboardPage.vue");
  return _sfc_setup$J ? _sfc_setup$J(props, ctx) : void 0;
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$J
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$I = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$I = _sfc_main$I.setup;
_sfc_main$I.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/PaginationBar.vue");
  return _sfc_setup$I ? _sfc_setup$I(props, ctx) : void 0;
};
const _sfc_main$H = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
      _push(`<div class="mx-auto max-w-6xl space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold">User Management</h1><p class="mt-1 text-sm text-gray-400">${ssrInterpolate(__props.users.meta.total)} total users</p></div>`);
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
        _push(ssrRenderComponent(_sfc_main$N, {
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
      _push(ssrRenderComponent(_sfc_main$I, {
        "current-page": __props.users.meta.current_page,
        "last-page": __props.users.meta.last_page,
        total: __props.users.meta.total
      }, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$H = _sfc_main$H.setup;
_sfc_main$H.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/UsersPage.vue");
  return _sfc_setup$H ? _sfc_setup$H(props, ctx) : void 0;
};
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$H
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$G = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ScoreBadge.vue");
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const _sfc_main$F = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/GenreBadge.vue");
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const _sfc_main$E = /* @__PURE__ */ defineComponent({
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
                _push2(ssrRenderComponent(_sfc_main$G, {
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
                        createVNode(_sfc_main$G, {
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
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SeasonsSection.vue");
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const _sfc_main$D = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/RelatedAnimeRow.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
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
const _sfc_main$C = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AiringScheduleTable.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
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
const _sfc_main$B = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ListEntryModal.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const _sfc_main$A = /* @__PURE__ */ defineComponent({
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
        _push(ssrRenderComponent(_sfc_main$B, {
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
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AddToListButton.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
const _sfc_main$z = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
    function displayTitle(anime) {
      return anime.title_english || anime.title_romaji;
    }
    function formatLabel(format) {
      if (!format) return "Unknown";
      return format.replace(/_/g, " ");
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
        _push(ssrRenderComponent(_sfc_main$A, {
          anime: __props.anime,
          "initial-entry": __props.list_entry
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-4 space-y-3 text-sm"><div class="rounded-lg border border-gray-800 p-3 space-y-2"><div class="flex justify-between"><span class="text-gray-500">Format</span><span class="text-gray-200">${ssrInterpolate(formatLabel(__props.anime.format))}</span></div><div class="flex justify-between"><span class="text-gray-500">Episodes</span><span class="text-gray-200">${ssrInterpolate(__props.anime.episodes ?? "?")}</span></div>`);
      if (__props.anime.duration) {
        _push(`<div class="flex justify-between"><span class="text-gray-500">Duration</span><span class="text-gray-200">${ssrInterpolate(__props.anime.duration)} min</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-between"><span class="text-gray-500">Status</span><span class="text-gray-200">${ssrInterpolate(statusLabel(__props.anime.status))}</span></div><div class="flex justify-between"><span class="text-gray-500">Season</span><span class="text-gray-200">${ssrInterpolate(seasonLabel(__props.anime.season, __props.anime.season_year))}</span></div>`);
      if (__props.anime.aired_from) {
        _push(`<div class="flex justify-between"><span class="text-gray-500">Aired</span><span class="text-gray-200">${ssrInterpolate(formatDate(__props.anime.aired_from))} – ${ssrInterpolate(formatDate(__props.anime.aired_to))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.anime.source) {
        _push(`<div class="flex justify-between"><span class="text-gray-500">Source</span><span class="text-gray-200">${ssrInterpolate(sourceLabel(__props.anime.source))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="rounded-lg border border-gray-800 p-3 space-y-2"><div class="flex items-center justify-between"><span class="text-gray-500">Score</span>`);
      _push(ssrRenderComponent(_sfc_main$G, {
        score: __props.anime.average_score
      }, null, _parent));
      _push(`</div>`);
      if (__props.anime.mean_score) {
        _push(`<div class="flex justify-between"><span class="text-gray-500">Mean</span><span class="text-gray-200">${ssrInterpolate(__props.anime.mean_score.toFixed(1))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-between"><span class="text-gray-500">Popularity</span><span class="text-gray-200">#${ssrInterpolate(__props.anime.popularity?.toLocaleString() ?? "?")}</span></div>`);
      if (__props.anime.favourites) {
        _push(`<div class="flex justify-between"><span class="text-gray-500">Favourites</span><span class="text-gray-200">${ssrInterpolate(__props.anime.favourites.toLocaleString())}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(mainStudios).length || unref(otherStudios).length) {
        _push(`<div class="rounded-lg border border-gray-800 p-3 space-y-2"><!--[-->`);
        ssrRenderList(unref(mainStudios), (studio) => {
          _push(`<div class="flex justify-between"><span class="text-gray-500">Studio</span><span class="font-medium text-gray-200">${ssrInterpolate(studio.name)}</span></div>`);
        });
        _push(`<!--]--><!--[-->`);
        ssrRenderList(unref(otherStudios), (studio) => {
          _push(`<div class="flex justify-between"><span class="text-gray-500">Producer</span><span class="text-gray-300">${ssrInterpolate(studio.name)}</span></div>`);
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
          _push(ssrRenderComponent(_sfc_main$F, {
            key: genre.id,
            name: genre.name
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$E, { seasons: __props.seasons }, null, _parent));
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
      _push(ssrRenderComponent(_sfc_main$D, {
        relations: __props.anime.relations ?? []
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$C, {
        schedules: __props.anime.airing_schedules ?? []
      }, null, _parent));
      _push(`</div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/AnimeDetailPage.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$z
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$y = /* @__PURE__ */ defineComponent({
  __name: "AnimeCard",
  __ssrInlineRender: true,
  props: {
    anime: {},
    viewMode: {}
  },
  setup(__props) {
    const props = __props;
    const mode = computed(() => props.viewMode ?? "grid");
    function formatLabel(format) {
      if (!format) return "";
      return format.replace(/_/g, " ");
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
              _push2(ssrRenderComponent(_sfc_main$G, {
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
              _push2(ssrRenderComponent(_sfc_main$G, {
                score: __props.anime.average_score,
                size: "sm"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="flex flex-wrap gap-1"${_scopeId}><!--[-->`);
              ssrRenderList(__props.anime.genres.slice(0, 3), (genre) => {
                _push2(ssrRenderComponent(_sfc_main$F, {
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
                    createVNode(_sfc_main$G, {
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
                    createVNode(_sfc_main$G, {
                      score: __props.anime.average_score,
                      size: "sm"
                    }, null, 8, ["score"])
                  ]),
                  createVNode("div", { class: "flex flex-wrap gap-1" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.anime.genres.slice(0, 3), (genre) => {
                      return openBlock(), createBlock(_sfc_main$F, {
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
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AnimeCard.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const _sfc_main$x = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/FilterSidebar.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const _sfc_main$w = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SortBar.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
function useBrowseFilters() {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const filters = reactive({
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
    return !!(filters.format || filters.status || filters.season || filters.season_year || filters.genre || filters.studio);
  });
  return {
    filters,
    applyFilters,
    clearFilters,
    hasActiveFilters
  };
}
const _sfc_main$v = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
      _push(ssrRenderComponent(_component_Head, { title: "Browse Anime" }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description" content="Browse and discover anime by genre, format, season, and more on AniTrack."${_scopeId}><link rel="canonical"${ssrRenderAttr("href", _ctx.route("anime.index"))}${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: "Browse and discover anime by genre, format, season, and more on AniTrack."
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
      _push(`<div class="flex gap-6"><aside class="hidden w-56 shrink-0 lg:block"><div class="sticky top-20"><h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Filters</h2>`);
      _push(ssrRenderComponent(_sfc_main$x, {
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
        _push(ssrRenderComponent(_sfc_main$x, {
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
      _push(ssrRenderComponent(_sfc_main$w, {
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
          _push(ssrRenderComponent(_sfc_main$y, {
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
      _push(ssrRenderComponent(_sfc_main$I, {
        "current-page": __props.anime.meta.current_page,
        "last-page": __props.anime.meta.last_page,
        total: __props.anime.meta.total
      }, null, _parent));
      _push(`</div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/AnimeIndexPage.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$v
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$u = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/ErrorPage.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$u
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$t = /* @__PURE__ */ defineComponent({
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
                _push2(ssrRenderComponent(_sfc_main$G, {
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
                      createVNode(_sfc_main$G, {
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
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AnimeHeroSection.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["anime-search", debouncedQuery],
    queryFn: async () => {
      const { data: data2 } = await axios.get("/api/search", {
        params: { q: debouncedQuery.value }
      });
      return data2;
    },
    enabled,
    staleTime: 15 * 60 * 1e3
  });
  const results = computed(() => data.value?.data ?? []);
  const total = computed(() => data.value?.total ?? 0);
  return {
    query,
    debouncedQuery,
    results,
    total,
    isLoading,
    isError
  };
}
const _sfc_main$s = /* @__PURE__ */ defineComponent({
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
              href: _ctx.route("search") + "?q=" + encodeURIComponent(unref(query)),
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
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SearchBar.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const _sfc_main$r = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/DashboardStatsBar.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const _sfc_main$q = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ContinueWatchingRow.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const _sfc_main$p = /* @__PURE__ */ defineComponent({
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
                _push2(ssrRenderComponent(_sfc_main$G, {
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
                  createVNode(_sfc_main$G, {
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
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AiringTodaySection.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const _sfc_main$o = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
      _push(ssrRenderComponent(_sfc_main$s, null, null, _parent));
      _push(`</div>`);
      if (__props.isAuthenticated && __props.stats) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_sfc_main$r, {
          "total-anime": __props.stats.totalAnime,
          "episodes-watched": __props.stats.episodesWatched,
          "avg-score": __props.stats.avgScore,
          "watching-count": __props.stats.watchingCount
        }, null, _parent));
        if (__props.airingToday && __props.airingToday.length) {
          _push(ssrRenderComponent(_sfc_main$p, { slots: __props.airingToday }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (__props.continueWatching && __props.continueWatching.length) {
          _push(ssrRenderComponent(_sfc_main$q, { entries: __props.continueWatching }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$t, {
        anime: __props.seasonalShowcase,
        title: `${seasonLabel(__props.currentSeason)} ${__props.currentYear} Anime`,
        "see-all-route": _ctx.route("seasonal", { year: __props.currentYear, season: __props.currentSeason.toLowerCase() })
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$t, {
        anime: __props.airingNow,
        title: "Currently Airing",
        "see-all-route": _ctx.route("anime.index", { "filter[status]": "RELEASING", sort: "-popularity" })
      }, null, _parent));
      if (__props.topRated.length) {
        _push(ssrRenderComponent(_sfc_main$t, {
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
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/HomePage.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$o
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$n = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ImportWizard.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
  __name: "ImportPage",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Import from MAL" }, null, _parent));
      _push(`<div><h1 class="text-2xl font-bold mb-6">Import from MAL</h1>`);
      _push(ssrRenderComponent(_sfc_main$n, null, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/ImportPage.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$m
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
  __name: "LoginPage",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      email: "",
      password: ""
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
      _push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition disabled:opacity-50"> Login </button></form><p class="text-gray-500 text-sm mt-4 text-center"> Don&#39;t have an account? `);
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
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/LoginPage.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$l
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$k = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ListStatusTabs.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ListTableView.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const _sfc_main$i = /* @__PURE__ */ defineComponent({
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
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(`<!--[--><div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"><!--[-->`);
      ssrRenderList(__props.entries, (entry) => {
        _push(`<div class="group relative overflow-hidden rounded-lg bg-gray-800">`);
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
        _push(`<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/95 via-gray-900/70 to-transparent p-2 pt-8"><p class="text-xs font-medium text-gray-200 line-clamp-2 mb-1">${ssrInterpolate(displayTitle(entry))}</p><div class="flex items-center justify-between"><span class="text-[10px] text-gray-400">${ssrInterpolate(unref(LIST_STATUS_LABELS)[entry.status])}</span>`);
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
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ListCardView.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ListCompactView.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
      _push(ssrRenderComponent(_sfc_main$k, {
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
        _push(ssrRenderComponent(_sfc_main$j, {
          entries: filteredEntries.value,
          onUpdate: handleUpdate,
          onDelete: handleDelete,
          onEdit: openEdit
        }, null, _parent));
      } else if (viewMode.value === "card") {
        _push(ssrRenderComponent(_sfc_main$i, {
          entries: filteredEntries.value,
          onEdit: openEdit
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_sfc_main$h, {
          entries: filteredEntries.value,
          onUpdate: handleUpdate
        }, null, _parent));
      }
      if (showEditModal.value && editingEntry.value?.anime) {
        _push(ssrRenderComponent(_sfc_main$B, {
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
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/MyListPage.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$g
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/NotFoundPage.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$f
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PlaylistDetailPage.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$e
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
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PlaylistEditPage.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$d
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PlaylistsIndexPage.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$c
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PrivacyPage.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$b
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
      _push(ssrRenderComponent(_sfc_main$N, {
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
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/ProfilePage.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __vite_glob_0_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$a
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
        _push(ssrRenderComponent(_sfc_main$k, {
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
          _push(ssrRenderComponent(_sfc_main$j, {
            entries: filteredEntries.value,
            readonly: ""
          }, null, _parent));
        } else if (viewMode.value === "card") {
          _push(ssrRenderComponent(_sfc_main$i, {
            entries: filteredEntries.value,
            readonly: ""
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(_sfc_main$h, {
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
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PublicListPage.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __vite_glob_0_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$9
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/RegisterPage.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __vite_glob_0_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$8
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
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
                _push2(ssrRenderComponent(_sfc_main$G, {
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
                  createVNode(_sfc_main$G, {
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
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ScheduleDayColumn.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
        _push(ssrRenderComponent(_sfc_main$7, {
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
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/SchedulePage.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __vite_glob_0_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$6
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
  __name: "SearchPage",
  __ssrInlineRender: true,
  setup(__props) {
    const { query, results, total, isLoading } = useAnimeSearch();
    onMounted(() => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) {
        query.value = q;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Search" }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description" content="Search for anime on AniTrack."${_scopeId}><link rel="canonical"${ssrRenderAttr("href", _ctx.route("search"))}${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: "Search for anime on AniTrack."
              }),
              createVNode("link", {
                rel: "canonical",
                href: _ctx.route("search")
              }, null, 8, ["href"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mx-auto max-w-4xl space-y-6"><h1 class="text-2xl font-bold text-gray-100">Search Anime</h1><input${ssrRenderAttr("value", unref(query))} type="text" placeholder="Search by title..." class="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500" autofocus>`);
      if (unref(isLoading) && unref(query).length >= 2) {
        _push(`<div class="py-8 text-center text-gray-500"> Searching... </div>`);
      } else if (unref(query).length >= 2 && unref(results).length === 0) {
        _push(`<div class="py-8 text-center text-gray-500"> No results found for &quot;${ssrInterpolate(unref(query))}&quot; </div>`);
      } else if (unref(results).length) {
        _push(`<div><p class="mb-4 text-sm text-gray-400">${ssrInterpolate(unref(total))} results for &quot;${ssrInterpolate(unref(query))}&quot;</p><div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"><!--[-->`);
        ssrRenderList(unref(results), (anime) => {
          _push(ssrRenderComponent(_sfc_main$y, {
            key: anime.id ?? anime.anilist_id,
            anime,
            "view-mode": "grid"
          }, null, _parent));
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="py-8 text-center text-gray-500"> Type at least 2 characters to search. </div>`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/SearchPage.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __vite_glob_0_18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SeasonSelector.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
    function formatLabel(format) {
      if (format === "OTHER") return "Other";
      return format.replace(/_/g, " ");
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
      _push(ssrRenderComponent(_sfc_main$4, {
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
            _push(ssrRenderComponent(_sfc_main$y, {
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/SeasonalPage.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __vite_glob_0_19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
  __name: "SettingsPage",
  __ssrInlineRender: true,
  props: {
    timezones: {}
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
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
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
      _push(`</form></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/SettingsPage.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __vite_glob_0_20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
const __vite_glob_0_21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ layout: _sfc_main$K },
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
    function formatLabel(format) {
      if (!format) return "";
      return format.replace(/_/g, " ");
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
                _push2(ssrRenderComponent(_sfc_main$G, {
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
                _push2(ssrRenderComponent(_sfc_main$G, {
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
                    createVNode(_sfc_main$G, {
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
                    }, toDisplayString(item.popularity?.toLocaleString()) + " pop", 1)) : (openBlock(), createBlock(_sfc_main$G, {
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
const __vite_glob_0_22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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
      const pages = /* @__PURE__ */ Object.assign({ "./Pages/Admin/DashboardPage.vue": __vite_glob_0_0, "./Pages/Admin/UsersPage.vue": __vite_glob_0_1, "./Pages/AnimeDetailPage.vue": __vite_glob_0_2, "./Pages/AnimeIndexPage.vue": __vite_glob_0_3, "./Pages/ErrorPage.vue": __vite_glob_0_4, "./Pages/HomePage.vue": __vite_glob_0_5, "./Pages/ImportPage.vue": __vite_glob_0_6, "./Pages/LoginPage.vue": __vite_glob_0_7, "./Pages/MyListPage.vue": __vite_glob_0_8, "./Pages/NotFoundPage.vue": __vite_glob_0_9, "./Pages/PlaylistDetailPage.vue": __vite_glob_0_10, "./Pages/PlaylistEditPage.vue": __vite_glob_0_11, "./Pages/PlaylistsIndexPage.vue": __vite_glob_0_12, "./Pages/PrivacyPage.vue": __vite_glob_0_13, "./Pages/ProfilePage.vue": __vite_glob_0_14, "./Pages/PublicListPage.vue": __vite_glob_0_15, "./Pages/RegisterPage.vue": __vite_glob_0_16, "./Pages/SchedulePage.vue": __vite_glob_0_17, "./Pages/SearchPage.vue": __vite_glob_0_18, "./Pages/SeasonalPage.vue": __vite_glob_0_19, "./Pages/SettingsPage.vue": __vite_glob_0_20, "./Pages/TermsPage.vue": __vite_glob_0_21, "./Pages/TopAnimePage.vue": __vite_glob_0_22 });
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
