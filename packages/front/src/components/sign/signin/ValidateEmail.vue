<template>
  <v-main>
    <v-container class="fill-height pa-0 ma-0" fluid>
      <SignTemplate>
        <template v-slot:content>
          <div class="col-12 col-md-8 mx-auto px-0 px-md-3">
            <h1 class="mx-auto mb-8 font-weight-medium">
              <span v-if="error">Lien de validation expiré !</span>
              <span v-if="!error">Validation de votre email !</span>
            </h1>

            <v-alert v-if="error" outlined text type="error">
              Le lien pour valider votre nouvel email de connexion a expiré.
              Pour recevoir un nouveau lien de validation, connectez-vous sur
              votre compte Ownily.<br /><br />
              Rendez-vous dans l'espace <b>Mon profil</b> et cliquez sur le
              bouton <b>Renvoyer l'email de validation</b>
            </v-alert>
            <div class="mt-8">
              <span v-if="error">
                <b>Besoin d’aide ?</b><br />
                Contactez-nous via le live-chat en bas à gauche ou consultez le
                <a href="https://ownily.crisp.help/fr/" target="_blank"
                  >centre d'aide Ownily</a
                >.
              </span>
              <span v-if="!error">
                Bravo, vous venez de valider votre nouvel email de connexion
                avec succès.<br />
                Profitez pleinement de votre
                <router-link :to="{ name: 'SignIn' }" class="mt-5"
                  >compte Ownily</router-link
                >
                en vous connectant avec votre nouvel identifiant.
              </span>
              <br />
            </div>
            <div class="mr-5 mt-8 mt-md-8">
              <router-link :to="{ name: 'SignIn' }">
                Retour à la page de connexion
              </router-link>
            </div>
          </div>
        </template>
        <template v-slot:img-helper>
          <img src="@/assets/validate_mail.png" width="80%" />
        </template>
        <template v-slot:text-helper>
          La validation de
          <span class="secondary--text">votre email </span> vous permet de
          profiter pleinement de votre abonnement
          <span class="secondary--text">Ownily</span>.
        </template>
      </SignTemplate>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import SignTemplate from "@/components/sign/SignTemplate.vue";
import { usersService } from "@/services";
import {
  computed,
  ComputedRef,
  ref,
  Ref,
  SetupContext,
} from "@vue/composition-api";
import { get } from "lodash";

export default {
  name: "ValidateEmail",
  components: {
    SignTemplate,
  },
  setup(props, context: SetupContext) {
    const error: Ref<boolean> = ref(false);

    const token: ComputedRef<string> = computed(
      () => get(context.root.$route.query, "token", "") as string
    );
    const validateEmail = async () => {
      try {
        await usersService.validateEmail({ token: token.value }).then(() => {
          error.value = false;
        });
        // uncomment to bypass this page in case of success
        // await context.root.$router.push({ name: "User" });
      } catch (err) {
        error.value = true;
      }
    };

    validateEmail();

    return {
      error,
    };
  },
};
</script>
