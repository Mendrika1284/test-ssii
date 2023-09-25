<template>
  <v-form ref="form" class="loginForm" @submit.prevent="connect">
    <v-slide-y-transition>
      <div id="form-auth">
        <h1 class="loginForm-title mx-auto mb-9">Je m'identifie</h1>

        <v-text-field
          outlined
          v-model="username"
          :rules="[() => !!username || 'Saisissez votre email']"
          id="username"
          label="Email"
          name="username"
          type="text"
        />
        <v-scroll-x-transition>
          <v-alert outlined text type="error" v-if="error">
            Vérifier vos informations d'authentification
          </v-alert>
        </v-scroll-x-transition>
        <div class="text-right">
          <v-btn
            color="primary"
            depressed
            class="px-6 mt-2"
            ripple
            type="submit"
            id="track-connect"
          >
            Je me connecte
          </v-btn>
        </div>
      </div>
    </v-slide-y-transition>
  </v-form>
</template>

<script lang="ts">
import { ref, defineComponent, watch, Ref } from "@vue/composition-api";

import { VForm } from "@/models";
import { userAccountStore } from "@/store";
import { UserAccountsService } from "@edmp/api";

export default defineComponent({
  name: "LoginForm",
  setup(props, context) {
    const username: Ref<string> = ref("");
    const error: Ref<boolean> = ref(false);

    function connect(e: Event): void {
      e.preventDefault();
      if ((context.refs.form as VForm).validate()) {
        const credentials: UserAccountsService.LoginIn = {
          username: username.value,
        };
        userAccountStore
          .login(credentials)
          .then(() => context.root.$router.push("/"))
          .catch(() => (error.value = true));
      }
    }

    watch([username], () => {
      error.value = false;
    });

    return {
      username,
      error,
      connect,
    };
  },
});
</script>

<style lang="scss" scoped>
.loginForm {
  .loginForm-title {
    font-weight: 500;
    font-size: 32px;
    line-height: 38px;
  }
}
</style>
