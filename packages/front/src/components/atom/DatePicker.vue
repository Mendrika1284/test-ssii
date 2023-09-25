<template>
  <v-menu
    v-model="datePickerShowed"
    :close-on-content-click="false"
    transition="scale-transition"
    min-width="290px"
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :id="refId"
        v-on="on"
        v-bind="attrs"
        outlined
        :dense="dense"
        :hide-details="hideDetails"
        :label="label"
        type="text"
        :required="required"
        append-icon="mdi-calendar"
        v-bind:value="computedValue"
        :class="inputClass"
        readonly
        :disabled="disabled"
        :error="error"
        :rules="rules"
      ></v-text-field>
    </template>
    <v-date-picker
      ref="picker"
      no-title
      scrollable
      hint="DD/MM/YYYY format"
      :min="min"
      :max="max"
      v-model="date"
      @input="
        $emit('input', $event);
        datePickerShowed = false;
      "
      v-bind="$attrs"
    ></v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import { getMoment } from "@edmp/api";
import {
  defineComponent,
  ref,
  Ref,
  computed,
  watch,
  PropType,
} from "@vue/composition-api";
import { formatDate } from "@/utils";

export default defineComponent({
  name: "DatePicker",
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      required: true,
      validator(value) {
        try {
          return getMoment(value as string, "YYYY-MM-DD").isValid();
        } catch {
          return false;
        }
      },
    },
    min: {
      type: String,
      default: undefined,
      validator(value) {
        if (!value) return true;
        try {
          return getMoment(value as string, "YYYY-MM-DD").isValid();
        } catch {
          return false;
        }
      },
    },
    max: {
      type: String,
      default: undefined,
      validator(value) {
        if (!value) return true;
        try {
          return getMoment(value as string, "YYYY-MM-DD").isValid();
        } catch {
          return false;
        }
      },
    },
    error: {
      type: [String, Boolean],
      default: undefined,
    },
    label: {
      type: String,
      default: "Sélectionner une date",
    },
    refId: {
      type: String,
      default: "datePickerId",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    alwaysReopenOnYear: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: [Function, Array],
      default: undefined,
    },
    required: {
      type: Boolean,
      default: false,
    },
    formatDate: {
      type: Function as PropType<(date: string) => string>,
      default: undefined,
    },
    "hide-details": {
      type: [String, Boolean],
      default: "auto",
    },
  },
  model: {
    prop: "value",
    event: "input",
  },
  setup(props) {
    const picker = ref();
    const datePickerShowed: Ref<boolean> = ref(false);
    const computedValue = computed(() => {
      return props.formatDate
        ? props.formatDate(props.value)
        : formatDate(props.value);
    });

    if (props.alwaysReopenOnYear) {
      watch(datePickerShowed, (val) => {
        val && setTimeout(() => (picker.value.activePicker = "YEAR"));
      });
    }

    return {
      picker,
      computedValue,
      datePickerShowed,
      inputClass: props.dense ? "shrink date-picker" : undefined,
    };
  },
  data: function () {
    return {
      date: `${this.value}`,
      // Have to rename without "-" to be used in vue template
      hideDetails: this["hide-details"],
    };
  },
});
</script>

<style lang="scss">
.date-picker.v-input--dense .v-text-field__slot {
  // width: 90px;
  // input {
  //   width: 90px;
  // }
}
</style>
