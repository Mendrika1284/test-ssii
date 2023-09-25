<template>
  <v-dialog
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-card-text v-show="!!message" v-html="message" class="pa-4">
      </v-card-text>
      <v-card-actions class="pt-0 d-flex justify-end flex-wrap">
        <v-btn
          outlined
          depressed
          :color="options.color"
          class="mt-1 mx-2"
          @click.native="cancel"
        >
          Non
        </v-btn>

        <v-btn
          depressed
          :color="options.color"
          class="mt-1 mx-2"
          @click.native="agree"
        >
          Oui
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  UnwrapRef,
} from "@vue/composition-api";

interface ConfirmModalState {
  dialog: boolean;
  resolve?: (value: boolean) => void;
  reject?: (value: boolean) => void;
  message?: string;
  options: {
    color: string;
    width: number;
    zIndex: number;
  };
}

export default defineComponent({
  setup() {
    const state: UnwrapRef<ConfirmModalState> = reactive({
      dialog: false,
      resolve: undefined,
      reject: undefined,
      message: undefined,
      options: {
        color: "primary",
        width: 300,
        zIndex: 200,
      },
    } as ConfirmModalState);

    const open = (message, options) => {
      state.dialog = true;
      state.message = message;
      state.options = Object.assign(state.options, options);
      return new Promise((resolve, reject) => {
        state.resolve = resolve;
        state.reject = reject;
      });
    };

    const agree = () => {
      if (state.resolve) state.resolve(true);
      state.dialog = false;
    };

    const cancel = () => {
      if (state.resolve) state.resolve(false);
      state.dialog = false;
    };

    return {
      ...toRefs(state),
      open,
      agree,
      cancel,
    };
  },
});
</script>
