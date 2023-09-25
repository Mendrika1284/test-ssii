<template>
  <v-main id="signUp-registration-compenent">
    <v-container class="fill-height pa-0 ma-0" fluid>
      <SignTemplate>
        <template v-slot:content>
          <div :class="currentStep < 5 ? 'px-1 px-md-4' : ''">
            <v-alert
              v-if="registrationIncomplete == 'true'"
              class="registerForm px-1 px-md-3 my-2"
              outlined
              text
              type="info"
            >
              Bienvenue dans l'onboarding, finalisez votre inscription pour
              profiter des fonctionnalités.
            </v-alert>

            <div class="stepper">
              <div
                :class="`stepper-step ${
                  currentStep === 1 || currentStep === 2
                    ? 'stepper-step-active'
                    : ''
                }`"
              >
                <v-avatar class="avatar">
                  <span>1</span>
                </v-avatar>
                <span v-if="!$vuetify.breakpoint.xsOnly" class="label"
                  >Inscription
                </span>
              </div>
            </div>

            <div v-if="currentStep === 1" class="registerForm px-1 px-md-3">
              <div class="d-flex justify-space-between">
                <h1 class="loginForm-title mb-5">Essayer Ownily</h1>
                <!-- <div class="text-right">
                  <v-btn color="#000" icon @click="openArticleRegistration">
                    <v-icon>mdi-help-circle-outline</v-icon>
                  </v-btn>
                </div> -->
              </div>

              <p class="loginForm-subtitle mb-5 mb-md-10">
                14 jours gratuits. Sans engagement.<br />Sans Carte Bancaire.
              </p>
              <div class="d-md-none mb-7">
                <p class="mb-1">
                  Créez votre compte et découvrez comment Ownily révolutionne la
                  gestion des SCI :
                </p>
                <ul v-if="!$vuetify.breakpoint.xsOnly">
                  <li>suivi automatisé des recettes et charges</li>
                  <li>comptabilité toujours à jour</li>
                  <li>déclaration fiscale en 1 clic</li>
                  <li>accessible 24/7"</li>
                </ul>
              </div>
              <RegisterUserAccount
                step="1"
                @validate="navigate('RegisterUserDetails')"
              />
              <p class="text-center mt-8">
                Vous avez déjà un compte ?{{ "\xa0" }}
                <br v-if="$vuetify.breakpoint.xsOnly" />
                <a
                  style="text-decoration: underline"
                  color="primary"
                  @click="navigate('SignIn')"
                >
                  Connectez-vous ici
                </a>
              </p>
            </div>

            <div v-if="currentStep === 2" class="registerForm px-1 px-md-3">
              <div class="d-flex justify-space-between text-center">
                <h1 class="loginForm-title mb-5">Faisons connaissance</h1>
                <div class="text-right">
                  <v-btn color="#000" icon @click="openArticleRegistration">
                    <v-icon>mdi-help-circle-outline</v-icon>
                  </v-btn>
                </div>
              </div>

              <p class="mb-5 mb-md-10">
                Apprenons à mieux nous connaître pour adapter nos services à
                votre situation.
              </p>
              <p class="d-md-none mb-7">
                La saisie de votre téléphone est un bon moyen de rester en
                contact avec l’équipe Ownily.
              </p>
              <RegisterUserDetails
                step="2"
                @validate="navigate('Examples')"
              ></RegisterUserDetails>
            </div>
          </div>
        </template>

        <template v-slot:img-helper>
          <img v-if="currentStep === 1" id="img-app" src="@/assets/step1.svg" />
          <img
            v-else-if="currentStep === 2"
            id="img-app"
            src="@/assets/step2.jpg"
            width="100%"
          />

          <img v-else id="img-app" src="@/assets/sign.jpg" width="100%" />
        </template>

        <template v-slot:text-helper>
          <div v-if="currentStep === 1">
            <p class="mb-4">
              Créez votre compte et découvrez comment Ownily révolutionne la
              gestion des SCI :
            </p>
            <ul>
              <li>suivi automatisé des recettes et charges</li>
              <li>comptabilité toujours à jour</li>
              <li>déclaration fiscale en 1 clic</li>
              <li>accessible 24/7"</li>
            </ul>
          </div>
          <div v-if="currentStep === 2">
            <p class="mb-3">
              La saisie de votre téléphone est un bon moyen de rester en contact
              avec l’équipe Ownily.
            </p>
          </div>
        </template>
      </SignTemplate>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import SignTemplate from "@/components/sign/SignTemplate.vue";
import RegisterUserAccount from "@/components/sign/signup/steps/RegisterUserAccount.vue";
import RegisterUserDetails from "@/components/sign/signup/steps/RegisterUserDetails.vue";
import {
  computed,
  ComputedRef,
  defineComponent,
  onBeforeMount,
  onMounted,
  ref,
  Ref,
  watch,
} from "@vue/composition-api";
import { coreStore } from "@/store";
import { useInit } from "@/composables";

export default defineComponent({
  name: "Registration",
  components: {
    SignTemplate,
    RegisterUserAccount,
    RegisterUserDetails,
  },
  props: {
    registrationIncomplete: {
      type: String,
      require: true,
      default: "false",
    },
  },
  setup(props, context) {
    const stepBi: Ref<boolean> = ref(false);
    const currentStep: ComputedRef<number> = computed(() => {
      if (context.root.$route.name === "RegisterUser") {
        stepBi.value = false;
        return 1;
      } else if (context.root.$route.name === "RegisterUserDetails") {
        stepBi.value = false;
        return 2;
      } else {
        return stepBi.value ? 6 : 5;
      }
    });

    const { initOnBoardingStep } = useInit();

    watch(currentStep, (val) => {
      initOnBoardingStep(context, val);
    });

    function navigate(routeName: string): void {
      context.root.$router.push({ name: routeName });
    }

    onBeforeMount(async () => {
      try {
        await coreStore.getConfig();
        await initOnBoardingStep(context, 0);
      } catch (err) {
        // redirect error page or modal error
      }
    });

    return {
      currentStep,
      navigate,
      stepBi,
    };
  },
});
</script>

<style lang="scss" scoped>
// @import "~vuetify/src/styles/settings/_variables";

.stepper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: #{map-get($spacers, 4)};

  &-step {
    margin-left: #{map-get($spacers, 2)};
    margin-right: #{map-get($spacers, 2)};

    .avatar {
      height: 20px !important;
      min-width: 20px !important;
      width: 20px !important;
      margin-right: 4px;
      background-color: var(--v-accent-darken1);
      border-color: var(--v-accent-darken1);

      > span {
        color: #ffffff;
        caret-color: #ffffff;
      }
    }

    .label {
      color: var(--v-accent-darken1);
      caret-color: var(--v-accent-darken1);
      border-bottom-style: solid;
      border-bottom-width: medium;
    }

    &-active {
      .avatar {
        height: 20px !important;
        min-width: 20px !important;
        width: 20px !important;
        margin-right: 4px;
        background-color: var(--v-primary-lighten1);
        border-color: var(--v-primary-lighten1);

        > span {
          color: #ffffff;
          caret-color: #ffffff;
        }
      }

      .label {
        color: var(--v-primary-lighten1);
        caret-color: var(--v-primary-lighten1);
        border-bottom-style: solid;
        border-bottom-width: medium;
      }
    }
  }
}

.registerForm {
  max-width: 520px;
  margin: 0 auto;

  &.bi {
    max-width: initial;
    margin: 0;
    padding: 0;
  }

  .loginForm {
    &-title {
      font-weight: 600;
      font-size: 32px;
      line-height: 38px;
    }
    &-subtitle {
      font-weight: 500;
      font-size: 20px;
      line-height: 22px;
    }
  }
}
</style>
