<template>
  <v-form ref="form" class="registerUserDetails" @submit.prevent="validate">
    <div class="d-flex">
      <v-text-field
        id="lastname"
        v-model="lastname"
        :rules="[() => !!lastname || 'Saisissez votre nom']"
        autofocus
        class="mr-2"
        label="Nom"
        name="lastname"
        outlined
        type="text"
      />
      <v-text-field
        id="firstname"
        v-model="firstname"
        :rules="[() => !!firstname || 'Saisissez votre prénom']"
        class="ml-2"
        label="Prénom"
        name="firstname"
        outlined
        type="text"
      />
    </div>

    <v-text-field
      id="phone"
      v-model="phoneValid"
      :rules="[
        () => !!phone || 'Saisissez votre numéro de téléphone',
        () =>
          !phone ||
          (!!phone && phone.length === 10) ||
          'Le numéro de téléphone est invalide (Exemple: 0612345678)',
      ]"
      class="mb-2"
      label="Numéro de téléphone"
      name="phone"
      hint="Exemple: 0612345678"
      persistent-hints
      outlined
      type="tel"
    />

    <v-row class="align-end ma-0 my-4">
      <!-- <span id="form-step" class="registerUserDetails-step"
        >{{ step }} / 6</span
      > -->
      <v-spacer />
      <v-btn
        :loading="validateInProgress"
        id="track-next_2"
        class="px-6"
        color="primary"
        depressed
        type="submit"
      >
        Suivant
        <template v-slot:loader>
          Suivant
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
import { VForm } from "@/models";
import { userStore } from "@/store";
import { computed, defineComponent, Ref, ref } from "@vue/composition-api";

export default defineComponent({
  name: "RegisterUserDetails",
  props: {
    step: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const firstname: Ref<string> = ref("");
    const lastname: Ref<string> = ref("");
    const phone: Ref<string> = ref("");
    const validateInProgress: Ref<boolean> = ref(false);

    async function validate(e: Event): Promise<void> {
      e.preventDefault();
      if ((context.refs.form as VForm).validate()) {
        validateInProgress.value = true;
        try {
          const { user } = userStore;
          if (user) {
            await userStore
              .updateUser({
                id: user.id,
                firstName: firstname.value,
                lastName: lastname.value,
                phone: phone.value,
              })
              .then(() => {
                context.emit("validate");
              });
          }
        } catch (err) {
          console.error(err);
        } finally {
          validateInProgress.value = false;
        }
      }
    }

    const phoneValid = computed({
      get: () => phone.value.toLowerCase().trim(),
      set: (value: string) => (phone.value = value.replace(/[^\d]/g, "")),
    });

    return {
      firstname,
      lastname,
      phone,
      phoneValid,
      validate,
      validateInProgress,
    };
  },
});
</script>
<style lang="scss" scoped>
.registerUserDetails {
  .registerUserDetails-checkbox {
    .v-label {
      color: #0e0e0e;

      &.error--text {
        color: #0e0e0e !important;
      }
    }
  }

  .registerUserDetails-step {
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
    color: #000000;
  }
}
</style>
