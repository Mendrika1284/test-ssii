import { computed, Ref, WritableComputedRef } from "@vue/composition-api";

export function useEmail() {
  // Validate Email is valid with TLD
  // https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript
  // https://gomakethings.com/email-validation-in-javascript/
  function validEmailRule(email: string): boolean {
    if (email !== "") {
      const re = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      return re.test(email);
    } else {
      return true;
    }
  }

  function getEmailRule(): string {
    return "Le format de votre email est incorrect";
  }

  const emailLowerCase = (email: Ref<string>): WritableComputedRef<string> =>
    computed({
      get: () => email.value.toLowerCase().trim(),
      set: (value: string) => (email.value = value.toLowerCase().trim()),
    });
  return {
    validEmailRule,
    getEmailRule,
    emailLowerCase,
  };
}
