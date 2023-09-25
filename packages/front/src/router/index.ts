import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { userAccountStore, userStore } from "@/store";

import Core from "@/components/core/Core.vue";
import Registration from "@/components/sign/signup/Registration.vue";
import Login from "@/components/sign/signin/Login.vue";
import ValidateEmail from "@/components/sign/signin/ValidateEmail.vue";
import User from "@/components/core/user/User.vue";
import Examples from "@/components/core/examples/Examples.vue";

import { ROUTE_NAMES } from "./routes";
import { PositionResult } from "vue-router/types/router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/signin",
    name: ROUTE_NAMES.SignIn,
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/validate-email",
    name: ROUTE_NAMES.ValidateEmail,
    component: ValidateEmail,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/signup",
    name: ROUTE_NAMES.SignUp,
    redirect: { name: ROUTE_NAMES.RegisterUser },
    meta: {
      requiresAuth: false,
    },
    component: {
      // Inline declaration of a component that renders our <router-view>
      render: (c) => c("router-view"),
    },
    children: [
      {
        path: "/user",
        name: ROUTE_NAMES.RegisterUser,
        component: Registration,
        props: (route) => Object.assign({}, route.query, route.params),
      },
      {
        path: "/user-details",
        name: ROUTE_NAMES.RegisterUserDetails,
        component: Registration,
        props: (route) => Object.assign({}, route.query, route.params),
      },
    ],
  },

  {
    path: "/",
    component: Core,
    name: ROUTE_NAMES.Root,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/user",
        name: ROUTE_NAMES.User,
        component: User,
      },
      {
        path: "/examples",
        name: ROUTE_NAMES.Examples,
        component: Examples,
        props: (route) => Object.assign({}, route.query, route.params),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "hash",
  routes,
  scrollBehavior(to): PositionResult {
    if (to.hash) {
      if (to.hash === "#top") {
        return {
          x: 0,
          y: 0,
          behavior: "smooth",
        };
      } else if (to.hash === "#bottom") {
        return {
          x: 0,
          y:
            document.body.scrollHeight || document.documentElement.scrollHeight,
          behavior: "smooth",
        };
      } else {
        return {
          selector: to.hash,
          behavior: "smooth",
          offset: { x: 0, y: 70 },
        };
      }
    }
    return { x: 0, y: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  const excludedRoutesToFetchUser = ["SignIn", "RegisterUser", "ValidateEmail"];
  if (
    !userAccountStore.isLogged &&
    ((to.name && !excludedRoutesToFetchUser.includes(to.name)) ||
      to.path === "/")
  ) {
    await userAccountStore.fetchLoggedUserAccount();
  }

  if (to.path === "/") {
    if (userStore.isLogged) {
      next({ name: ROUTE_NAMES.Examples });
    } else {
      next({ name: ROUTE_NAMES.SignIn });
    }
  } else {
    const requiresAuth = to.matched.some((route) => route.meta.requiresAuth);

    // Check navigation when user is authenticated only
    if (requiresAuth) {
      const isLogged = !!(await userStore.fetchLoggedUser());

      if (isLogged) {
        next();
      } else {
        // User as not subscribe or other redirection in future.
        console.log("cannot navigate on next:", to.path);
        next({ name: ROUTE_NAMES.SignIn });
      }
    } else {
      next();
    }
  }
});

export default router;
