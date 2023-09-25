<template>
  <v-form ref="form" class="registerUserAccount" @submit.prevent="validate">
    <v-text-field
      id="mail"
      v-model="emailLowerCase"
      :rules="[
        () => !!emailLowerCase || 'Saisissez votre email',
        () =>
          validEmailRule(emailLowerCase) ||
          'Le format de votre email est incorrect',
      ]"
      label="Adresse email"
      name="mail"
      outlined
      type="text"
    />

    <v-checkbox
      id="track-accept_cgu"
      v-model="acceptationCGU"
      :rules="[
        () => !!acceptationCGU || 'L\'acceptation des CGU est obligatoire',
      ]"
      class="registerUserAccount-checkbox mt-0 pt-0"
      color="primary"
    >
      <template v-slot:label>
        <span>
          J'ai lu et j'accepte les
          <a id="cguLink track-see_cgu" color="primary" @click="openCGU">
            Conditions d'Utilisation
          </a>
          et la
          <a color="primary" @click="openPVP">Politique Vie Privée</a>
          .
        </span>
      </template>
    </v-checkbox>

    <v-checkbox
      id="track-optin_newsletter"
      v-model="optinMarket"
      class="registerUserAccount-checkbox mt-0 pt-0"
      color="primary"
    >
      <template v-slot:label>
        <span style="color: #0e0e0e">
          Je souhaite m'abonner à la newsletter mensuelle
        </span>
      </template>
    </v-checkbox>

    <v-scroll-x-transition>
      <v-alert v-if="!!acceptationCGU" outlined text type="info">
        En cochant cette case, vous certifiez avoir lu et accepté sans réserve
        les présentes CGU.
      </v-alert>
    </v-scroll-x-transition>

    <v-scroll-x-transition>
      <v-alert v-if="error" class="mt-3" outlined text type="error">
        Une erreur est survenue lors de la création de votre compte.<br />
        L'adresse email utilisée est peut-être déjà associée à un compte.
      </v-alert>
    </v-scroll-x-transition>

    <v-row class="align-end ma-0 my-4">
      <!-- <span id="form-step" class="registerUserAccount-step"
        >{{ step }} / 6</span
      > -->
      <v-spacer />
      <v-btn
        :loading="validateInProgress"
        class="px-6"
        color="primary"
        depressed
        type="submit"
        id="track-next_1"
      >
        Créer mon compte
        <template v-slot:loader>
          Créer mon compte
          <v-progress-circular
            class="ml-3"
            indeterminate
            size="20"
            width="2"
          ></v-progress-circular>
        </template>
      </v-btn>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { useEmail } from "@/composables";
import { VForm } from "@/models";
import { usersService } from "@/services";
import { userAccountStore, userStore } from "@/store";
import { defineComponent, Ref, ref } from "@vue/composition-api";

export default defineComponent({
  name: "RegisterUserAccount",
  props: {
    step: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const email: Ref<string> = ref("");
    const acceptationCGU: Ref<boolean> = ref(false);
    const optinMarket: Ref<boolean> = ref(false);

    const validateInProgress: Ref<boolean> = ref(false);
    const error: Ref<boolean> = ref(false);

    async function validate(e: Event): Promise<void> {
      e.preventDefault();
      error.value = false;
      if ((context.refs.form as VForm).validate()) {
        validateInProgress.value = true;
        try {
          await userAccountStore
            .createUserAccount({ username: email.value })
            .then(({ username }) =>
              userAccountStore.login({
                username,
              })
            )
            .then(async () => {
              const user = userStore.user;
              if (user) {
                await usersService.update({
                  id: user.id,
                });
              }
            })
            .then(() => {
              context.emit("validate");
            });
        } catch (err) {
          console.error(err);
          error.value = true;
          validateInProgress.value = false;
        }
      }
    }

    const { validEmailRule, emailLowerCase } = useEmail();

    async function openCGU(e: Event): Promise<void> {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      window.open(
        "https://ownily.fr/conditions-generales-d-utilisation",
        "_blank"
      );
    }

    async function openPVP(e: Event): Promise<void> {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      window.open("https://ownily.fr/politique", "_blank");
    }

    return {
      emailLowerCase: emailLowerCase(email),
      validEmailRule,

      acceptationCGU,
      openCGU,
      optinMarket,
      error,
      validate,
      validateInProgress,
      openPVP,
    };
  },
});
</script>
<style lang="scss">
.registerUserAccount {
  .registerUserAccount-checkbox {
    .v-label {
      color: #0e0e0e;

      &.error--text {
        color: #0e0e0e !important;
      }
    }
  }

  .registerUserAccount-step {
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
    color: #000000;
  }
}
</style>
