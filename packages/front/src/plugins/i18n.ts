import Vue from "vue";
import VueI18n, { LocaleMessages } from "vue-i18n";

Vue.use(VueI18n);

const numberFormats = {
  "fr-FR": {
    currency: {
      style: "currency",
      currency: "EUR",
      currencyDisplay: "symbol",
    },
    "currency-no-decimal": {
      style: "currency",
      currency: "EUR",
      currencyDisplay: "symbol",
      minimumFractionDigits: 0, // set fraction digits to 0 to remove cents
      maximumFractionDigits: 0,
    },
  },
};

const dateTimeFormats = {
  "fr-FR": {
    "day-month-long": {
      day: "numeric",
      month: "long",
    },
    "day-month-year-long": {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
    "month-year-numeric": {
      month: "numeric",
      year: "numeric",
    },
    "month-year-short": {
      month: "short",
      year: "2-digit",
    },
    "month-year": {
      month: "long",
      year: "numeric",
    },
    "month-only": {
      month: "short",
    },
    "year-only": {
      year: "numeric",
    },
    "month-only-full": {
      month: "long",
    },
    "day-month-year-long-hours-minutes": {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    },
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    long: {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    },
  },
} as VueI18n.DateTimeFormats;

function loadLocaleMessages(): LocaleMessages {
  const locales = require.context(
    "../locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages: LocaleMessages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

export default new VueI18n({
  numberFormats,
  dateTimeFormats,
  locale: process.env.VUE_APP_I18N_LOCALE || "fr",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "fr",
  messages: loadLocaleMessages(),
});
