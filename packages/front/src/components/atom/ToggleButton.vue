<template>
  <div class="toggle-button-control">
    <div
      class="toggle-button"
      :class="{ enabled: isEnabled }"
      @click="toggle"
      :disabled="disabled"
      :style="{
        '--ref-color': color,
        '--color': enhancedColor,
        '--lighten-color': lightenColor,
        '--secondary-color': secondaryColor,
      }"
    >
      <div class="button"></div>
    </div>
    <span v-if="isEnabled" class="toggle-button-label">Activé</span>
    <span v-else class="toggle-button-label">Désactivé</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { addAlphaTo6DigitsHexColor } from "@/utils/color";

export default defineComponent({
  name: "ToggleButton",
  model: {
    prop: "isEnabled",
    event: "toggle",
  },
  props: {
    isEnabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: "#222291",
    },
    secondaryColor: {
      type: String,
      required: false,
      default: "#E0E0E0",
    },
    disabled: {
      type: Boolean,
      required: false,
      default: undefined,
    },
  },
  setup(props) {
    return {
      lightenColor: props.disabled
        ? addAlphaTo6DigitsHexColor("#bdbdbd", 0.4)
        : addAlphaTo6DigitsHexColor(props.color, 0.4),
      enhancedColor: props.disabled ? "#bdbdbd" : props.color,
    };
  },
  watch: {
    disabled: function () {
      this.lightenColor = this.disabled
        ? addAlphaTo6DigitsHexColor("#bdbdbd", 0.4)
        : addAlphaTo6DigitsHexColor(this.color, 0.4);
      this.enhancedColor = this.disabled ? "#bdbdbd" : this.color;
    },
  },
  methods: {
    toggle: function () {
      if (!this.disabled) {
        this.$emit("toggle", !this.isEnabled);
      }
    },
  },
});
</script>

<style lang="scss">
.toggle-button-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 5em;
  // Variables
  $toggle-button-primary-ref-color: var(--ref-color);
  $toggle-button-primary-color: var(--color);
  $toggle-button-lighten-primary-color: var(--lighten-color);
  $toggle-button-secondary-color: var(--secondary-color);
  $toggle-button-height: 1.6em;
  $toggle-button-border-thickness: 2px;
  $switch-transition: all 0.3s ease-in-out;
  $button-side-length: calc(
    #{$toggle-button-height} - (2 * #{$toggle-button-border-thickness})
  );
  .toggle-button {
    height: $toggle-button-height;
    width: calc(#{$toggle-button-height} * 2);
    border: $toggle-button-border-thickness solid $toggle-button-secondary-color;
    box-shadow: inset 0px 0px $toggle-button-border-thickness 0px
      rgba(0, 0, 0, 0.33);
    border-radius: $toggle-button-height;
    transition: $switch-transition;
    background-color: $toggle-button-secondary-color;
    cursor: pointer;

    .button {
      height: $button-side-length;
      width: $button-side-length;
      border: $toggle-button-border-thickness solid
        $toggle-button-secondary-color;
      border-radius: $button-side-length;
      background-color: #ffffff;
      transition: $switch-transition;
    }

    &.enabled {
      background-color: $toggle-button-lighten-primary-color;
      box-shadow: none;
      .button {
        background-color: $toggle-button-primary-ref-color;
        border-color: $toggle-button-primary-color;
        transform: translateX(
          calc(#{$button-side-length} + (2 *#{$toggle-button-border-thickness}))
        );
      }
    }
  }
  .toggle-button-label {
    margin-bottom: 2px;
  }
}
</style>
