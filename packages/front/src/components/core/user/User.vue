<template>
  <div>
    <div class="user-header">
      <div class="user-header-title">
        <TitleH1>Mon profil</TitleH1>
        <v-spacer></v-spacer>
      </div>
    </div>

    <div class="d-flex flex-wrap" style="width: 100%">
      <v-form
        ref="form"
        class="user-card pa-4 pa-md-4 mr-md-4 mb-4"
        style="width: 100%; max-width: 500px"
        @submit.prevent="validate"
      >
        <div class="user-card-header mb-4 mb-md-6">
          <h4 class="user-card-subtitle">Mes données personnelles</h4>
          <v-btn
            v-show="!isEditingData"
            class="ml-4 ml-md-4"
            id="track-modify_profile"
            color="primary"
            icon
            @click="isEditingData = !isEditingData"
          >
            <v-icon title="Modifier">mdi-pencil-outline</v-icon>
          </v-btn>
        </div>

        <div v-if="updatedUser" class="d-md-flex">
          <v-text-field
            id="firstname"
            v-model="updatedUser.firstName"
            :disabled="!isEditingData"
            :rules="[
              () => !!updatedUser.firstName || 'Le champ ne peut pas être vide',
            ]"
            autofocus
            class="mr-md-2"
            label="Prénom"
            name="firstname"
            outlined
            single-line
            type="text"
          />

          <v-text-field
            id="lastname"
            v-model="updatedUser.lastName"
            :disabled="!isEditingData"
            :rules="[
              () => !!updatedUser.lastName || 'Le champ ne peut pas être vide',
            ]"
            class="ml-md-2"
            label="Nom"
            name="lastname"
            outlined
            single-line
            type="text"
          />
        </div>

        <v-text-field
          v-if="updatedUser"
          id="phone"
          v-model="updatedUser.phone"
          :disabled="!isEditingData"
          :rules="[
            () =>
              !updatedUser.phone ||
              (!!updatedUser.phone && updatedUser.phone.length === 10) ||
              'Le numéro de téléphone est invalide',
          ]"
          label="Numéro de téléphone (facultatif)"
          name="phone"
          outlined
          persistent-hint
          single-line
          type="tel"
        />

        <div class="user-card-btn">
          <v-btn
            v-if="isEditingData"
            class="mr-2"
            color="primary"
            depressed
            outlined
            @click="cancelUpdate"
          >
            Annuler
          </v-btn>
          <v-btn v-if="isEditingData" color="primary" depressed type="submit">
            Valider
          </v-btn>
        </div>
      </v-form>

      <UserAccountLogin />

      <UserInformation />
    </div>
  </div>
</template>

<script lang="ts">
import UserAccountLogin from "@/components/core/user/UserAccountLogin.vue";
import UserInformation from "@/components/core/user/UserInformation.vue";
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

import { TitleH1 } from "@/components/atom/title";

export default defineComponent({
  name: "User",
  components: {
    TitleH1,
    UserAccountLogin,
    UserInformation,
  },
  setup(props, context) {
    const updatedUser: Ref<User | undefined> = ref();
    // Gestion de l'edition / annulation
    const isEditingData: Ref<boolean> = ref(false);

    async function validate(e: Event): Promise<void> {
      e.preventDefault();
      if ((context.refs.form as VForm).validate() && updatedUser.value) {
        try {
          await userStore
            .updateUser({
              id: updatedUser.value.id,
              phone: updatedUser.value.phone,
              lastName: updatedUser.value.lastName,
              firstName: updatedUser.value.firstName,
            })
            .then(() => {
              context.emit("validate", updatedUser);
              isEditingData.value = false;
            });
          coreStore.displayFeedback({
            message:
              "La mise à jour de votre profil a bien été prise en compte",
          });
        } catch (err) {
          coreStore.displayFeedback({
            type: FeedbackTypeEnum.ERROR,
            message:
              "Une erreur est survenue lors de la mise à jour de votre profil",
          });
        }
      }
    }

    const init = async () => {
      userStore.fetchLoggedUser();
      const { user } = userStore;
      if (user) {
        updatedUser.value = { ...user };
      }
    };
    async function cancelUpdate() {
      await init();
      isEditingData.value = false;
    }
    watch(
      () => userStore.user,
      () => init(),
      { deep: true }
    );
    onBeforeMount(async () => {
      await init();
    });

    return {
      updatedUser,
      isEditingData,
      validate,
      cancelUpdate,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media screen and
  (min-width: #{map-get($grid-breakpoints, "sm")}) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .user-header-title {
    display: flex;
  }
}

.user-card {
  background: #fff;
  border: 1px solid #ededed;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-self: start;

  h4.user-card-subtitle {
    color: #000 !important;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-transform: uppercase;
  }

  .user-card-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    @media screen and (min-width: #{map-get($grid-breakpoints, 'md')}) {
      flex-direction: row;
    }
  }

  .user-card-btn {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }
}
</style>
