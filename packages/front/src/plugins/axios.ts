import axios, { AxiosResponse } from "axios";
import router from "@/router";
import { coreStore } from "@/store";
import { get } from "lodash";
import { FunctionalError } from "@edmp/api";
import i18n from "@/plugins/i18n";
import { v4 as uuidv4 } from "uuid";
import { FeedbackTypeEnum } from "@/models";
import { ROUTE_NAMES } from "@/router/routes";

export const externalAxios = axios.create();

const handleError = async (
  response: AxiosResponse
): Promise<{ message: string; type: FeedbackTypeEnum }> => {
  // Default message is error is unknown
  let message =
    "Une erreur inattendue s'est produite. Si le problème persiste, contactez le support";
  const type = FeedbackTypeEnum.ERROR;
  // Status of error
  const status = response.status;
  // Retrieve data part or error
  let data = response.data;

  // For "Blob" we need to retrieve data in message
  if (response.request.responseType === "blob") {
    const text = await data.text();
    data = JSON.parse(text);
  }

  if (status === 401) {
    const { name: routeName } = router.currentRoute;

    if (
      routeName &&
      routeName !== ROUTE_NAMES.SignIn &&
      routeName !== ROUTE_NAMES.RegisterUser
    ) {
      router.push({ name: ROUTE_NAMES.SignIn });
      message = "Votre session est expirée merci de vous reconnecter";
    } else {
      // No route Name
      message = "";
    }
  } else if (status === 403) {
    message =
      "Vous n'avez pas les droits nécessaires pour accéder à ce service";
  } else if (String(status).startsWith("5")) {
    message =
      "Oups nous rencontrons des difficultés pour accéder à ce service. Nos équipes font le maximum pour rétablir le service." +
      " Nos excuses pour la gêne occasionnée";
  } else if (String(status).startsWith("4")) {
    // Error 422 and 400 are functional errors
    const functionalError = data as FunctionalError;

    if (functionalError?.error) {
      const exist = i18n.te("errors." + functionalError.error);
      if (exist) {
        message = i18n.t("errors." + functionalError.error) as string;
      } else {
        message = `Une erreur inattendue s'est produite. Si le problème persiste, contactez le support. (message: ${functionalError.message} code: ${functionalError.error})`;
      }
    }
  }
  return { message, type };
};

export default function initAxios(): void {
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      if (error.response) {
        const response: AxiosResponse = error.response;
        const manager = get(error.config.headers, "ERROR_HANDLER_STRATEGY");
        const feedback = await handleError(response);

        if (feedback.message !== "" && manager !== "IGNORE") {
          // Display message in Popup
          coreStore.displayFeedback(feedback);
        }
      }
      return Promise.reject(error);
    }
  );

  axios.interceptors.request.use((value) => {
    // Set a Correlation Id to trace log between Front and Back
    if (value.headers) {
      value.headers["x-request-id"] = uuidv4();
    }
    return value;
  });
}
