<template>
  <v-form
    v-if="user"
    ref="form"
    class="user-account-login-form pa-4 pa-md-4 mr-md-4 mb-4"
    style="width: 100%; max-width: 500px"
    @submit.prevent="validate"
  >
    <div class="user-account-login-header mb-4 mb-md-6">
      <h4 class="user-account-subtitle">Mon identifiant de connexion</h4>

      <v-btn
        v-if="!isEditingMail"
        class="ml-4 ml-md-4"
        id="track-modify_user_email"
        color="primary"
        icon
        @click="isEditingMail = !isEditingMail"
      >
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
      <v-btn v-if="isEditingMail" v-show="false" icon>
        <template>
          <v-icon> mdi-help-circle-outline</v-icon>
        </template>
      </v-btn>
    </div>

    <v-text-field
      id="mail"
      v-model="user.email"
      class="ml-md-2"
      disabled
      hint="C'est grâce à cet email que nous pouvons vous contacter et que vous pouvez vous connecter à Ownily."
      label="Adresse email actuelle"
      name="mail"
      outlined
      persistent-hint
      type="text"
    >
      <template v-slot:append>
        <v-tooltip bottom>
          {{ $t(`email.status.${user.emailStatus}`) }}
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <span v-if="user.emailStatus === 'confirmed'">
                <v-icon class="ml-5" color="primary lighten-1"
                  >mdi-check</v-icon
                >
              </span>
            </div>
          </template>
        </v-tooltip>
      </template>
    </v-text-field>
    <v-text-field
      v-if="isEditingMail"
      id="newEmail"
      v-model="user.newEmail"
      :disabled="!isEditingMail"
      :rules="[
        () => !!user.newEmail || 'Le champ ne peut être vide',
        () =>
          (!!user.newEmail && validEmailRule(user.newEmail)) || getEmailRule(),
      ]"
      class="ml-md-2 mt-8"
      label="Nouvelle adresse email"
      name="newEmail"
      outlined
      persistent-hint
      type="text"
    >
      <template v-slot:append>
        <v-tooltip bottom>
          {{ $t(`email.status.${user.emailStatus}`) }}
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <span v-if="user.emailStatus === 'invalid'">
                <v-icon class="ml-5" color="red">mdi-alert-outline</v-icon>
              </span>
              <span v-if="user.emailStatus === 'pending'">
                <v-icon class="ml-5" color="blue">mdi-sync</v-icon>
              </span>
            </div>
          </template>
        </v-tooltip>
      </template>
    </v-text-field>

    <div class="user-account-login-btn">
      <v-btn
        v-if="isEditingMail"
        class="mr-2"
        color="primary"
        depressed
        outlined
        @click="cancelUpdate"
      >
        Annuler
      </v-btn>
      <v-btn v-if="isEditingMail" color="primary" depressed type="submit">
        Valider
      </v-btn>
    </div>
    <v-alert
      v-if="user.emailStatus === 'pending' || user.emailStatus === 'invalid'"
      class="ml-md-2 pt-4 mt-4"
      color="info"
      dark
      outlined
      text
      transition="scale-transition"
    >
      <div class="d-flex">
        <span v-if="user.emailStatus === 'invalid'">
          <v-icon color="red">mdi-alert-outline</v-icon>
        </span>
        <span v-if="user.emailStatus === 'pending'">
          <v-icon color="blue">mdi-sync</v-icon>
        </span>
        <span class="ml-2" color="black" style="white-space: pre-line">{{
          $t(`email.status-detail.${user.emailStatus}`, { msg: user.newEmail })
        }}</span>
      </div>
      <div
        v-if="user.emailStatus === 'pending' || user.emailStatus === 'invalid'"
        class="d-flex text-center pt-2"
      >
        <span>
          <v-icon color="blue">mdi-mail</v-icon>
        </span>
        <a class="ml-2" dark @click="resetEmailStatus"> Renvoyer l'email </a>
        <!-- Cancel is forbidden for first email / only possible if modification -->
        <div v-if="user.newEmail !== user.email">
          <span class="ml-8">
            <v-icon color="blue">mdi-cancel</v-icon>
          </span>
          <a class="ml-4" dark @click="cancelEmailStatus">
            Annuler la modification
          </a>
        </div>
      </div>
    </v-alert>
  </v-form>
</template>

<script lang="ts">
import { useEmail } from "@/composables";
import { FeedbackTypeEnum, VForm } from "@/models";
import { coreStore, userStore } from "@/store";
import { User } from "@edmp/api";
import {
  defineComponent,
  onBeforeMount,
  ref,
  Ref,
  watch,
} from "@vue/composition-api";

export default defineComponent({
  name: "UserConnexion",
  setup(props, context) {
    const user: Ref<User | undefined> = ref();

    // Gestion de l'edition / annulation
    const isEditingMail: Ref<boolean> = ref(false);

    async function validate(e: Event): Promise<void> {
      e.preventDefault();

      if ((context.refs.form as VForm).validate()) {
        try {
          if (user.value?.email === user.value?.newEmail) {
            coreStore.displayFeedback({
              type: FeedbackTypeEnum.INFO,
              timeout: 10000,
              message:
                "Veuillez modifier votre email avant de valider ou cliquez sur annuler.",
            });
            return;
          }

          if (user.value) {
            await userStore
              .updateUser({
                id: user.value.id,
                newEmail: user.value.newEmail,
                emailStatus: "pending",
              })
              .then(() => {
                context.emit("validate");
                isEditingMail.value = false;
              });
            coreStore.displayFeedback({
              timeout: 15000,
              type: FeedbackTypeEnum.INFO,
              message:
                "Une vérification vient d'être envoyée sur la nouvelle adresse email saisie : validez-la pour activer le nouvel identifiant.",
            });
          }
        } catch (err) {
          coreStore.displayFeedback({
            type: FeedbackTypeEnum.ERROR,
            message:
              "Une erreur est survenue lors de la mise à jour de votre adresse email.\n" +
              "L'adresse email est peut-être déjà associée à un compte. ",
          });
        }
      }
    }

    const { validEmailRule, getEmailRule } = useEmail();

    function cancelUpdate() {
      isEditingMail.value = false;
    }

    // Call backend to reset email status to pending in order to resend a mail
    const resetEmailStatus = () => {
      userStore.fetchLoggedUser().then(async () => {
        if (user.value?.newEmail) {
          userStore
            .updateUser({ id: user.value.id, emailStatus: "pending" } as User)
            .then(() =>
              coreStore.displayFeedback({
                type: FeedbackTypeEnum.INFO,
                timeout: 13000,
                message:
                  "Une vérification vient d'être envoyée sur la nouvelle adresse email saisie : validez-la pour activer le nouvel identifiant.",
              })
            );
        }
      });
    };

    const cancelEmailStatus = async () => {
      // Revient à l'état initial en supprimant le nouvel email et en restituant l'état
      // DOit on accepter de passer à confirm ...
      if (user.value) {
        userStore.updateUser({
          id: user.value.id,
          emailStatus: "confirmed",
          newEmail: undefined,
        });
      }
    };

    const init = () => {
      userStore.fetchLoggedUser();
      const { user: userStored } = userStore;
      if (userStored) {
        user.value = { ...userStored };
      }
    };

    watch(
      () => userStore.user,
      () => init(),
      { deep: true }
    );

    onBeforeMount(() => init());

    return {
      user,
      isEditingMail,
      validEmailRule,
      getEmailRule,
      validate,
      cancelUpdate,
      resetEmailStatus,
      cancelEmailStatus,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-account-login-form {
  background: #fff;
  border: 1px solid #ededed;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: start;

  h4.user-account-subtitle {
    color: #000 !important;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-transform: uppercase;
  }

  .user-account-login-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    @media screen and (min-width: #{map-get($grid-breakpoints, 'md')}) {
      flex-direction: row;
      align-items: center;
    }
  }

  .user-account-login-btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
