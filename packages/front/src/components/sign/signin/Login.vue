<template>
  <v-main>
    <v-container class="fill-height pa-0 ma-0" fluid>
      <SignTemplate>
        <template v-slot:content>
          <div class="mx-auto" style="max-width: 500px">
            <LoginForm class="mt-5 mb-11"></LoginForm>
            <div class="loginSignup text-left">
              <h1 class="mx-auto mb-4 loginSignup-title">Première visite ?</h1>
              <p class="mb-2">
                Créez ici votre compte en quelques clics pour tester Ownily
                gratuitement.
              </p>
              <div class="text-right mb-10">
                <v-btn
                  color="primary"
                  depressed
                  class="px-6"
                  ripple
                  @click="$router.push({ name: 'SignUp' })"
                  id="track-register"
                >
                  Je m'inscris
                </v-btn>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:img-helper>
          <img id="img-app" src="@/assets/sign.jpg" width="100%" />
        </template>
        <template v-slot:text-helper>
          Nous sommes contents de vous retrouver ! <br /><br />
          <span class="white--text">Connectez-vous </span>pour continuer et
          accéder à votre <span class="white--text">compte Ownily</span>.
        </template>
      </SignTemplate>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import LoginForm from "@/components/sign/signin/LoginForm.vue";
import SignTemplate from "@/components/sign/SignTemplate.vue";

export default {
  name: "Login",
  components: {
    LoginForm,
    SignTemplate,
  },
};
</script>

<style lang="scss" scoped>
.loginSignup {
  .loginSignup-title {
    font-weight: 500;
    font-size: 32px;
    line-height: 38px;
  }
}
</style>
