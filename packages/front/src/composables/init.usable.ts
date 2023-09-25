import { ROUTE_NAMES } from "@/router/routes";
import { userAccountStore, userStore } from "@/store";
import { SetupContext } from "@vue/composition-api";

export function useInit() {
  async function initApp() {
    await userAccountStore.fetchLoggedUserAccount();
  }

  async function initOnBoardingStep(
    context: SetupContext,
    currentStep: number
  ): Promise<void> {
    await initApp();
    if (!userAccountStore.isLogged && currentStep > 1) {
      context.root.$router.push({
        name: "SignIn",
      });
    } else if (userAccountStore.isLogged) {
      // Si les données requises pour le compte sont présant on redirige
      // vers `context.root.$router.currentRoute.fullPath` ou `Examples`.
      // Sinon (else if) on éffèctue une reprise de l'onboarding.
      if (userStore.isLogged && currentStep == 0) {
        const { fullPath } = context.root.$router.currentRoute;
        if (fullPath != undefined || fullPath != null) {
          // Néccéssaire pour test 2e2
          context.root.$router.push({
            path: context.root.$router.currentRoute.fullPath,
          });
        } else {
          context.root.$router.push({
            name: ROUTE_NAMES.Examples,
          });
        }
      } else if (!userStore.user && currentStep !== 2) {
        context.root.$router.push({
          name: "RegisterUserDetails",
          query: { registrationIncomplete: "true" },
        });
      }
    }
  }
  return {
    initApp,
    initOnBoardingStep,
  };
}
