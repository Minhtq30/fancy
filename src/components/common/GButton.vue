<template>
  <button :class="buttonClass" @click="onClick">
    <a-space>
      <span v-if="isShowIcon" class="g-button-icon__wrapper">
        <component :is="icon"></component>
      </span>
      <slot />
    </a-space>
  </button>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "GButton",
  components: {
    "save-icon": defineAsyncComponent(() => import("../icons/SaveIcon.vue")),
    "upload-icon": defineAsyncComponent(() =>
      import("../icons/UploadIcon.vue")
    ),
  },
  props: {
    iconType: String,
    type: {
      type: String,
      default: "primary",
      validator: (prop) =>
        ["primary", "outlined", "outlined-danger", "text", "danger"].includes(
          prop
        ),
    },
    size: {
      type: String,
      default: "default",
      validator: (prop) => ["small", "default", "large"].includes(prop),
    },
  },
  data() {
    return {};
  },
  computed: {
    buttonClass() {
      return [
        "g-button",
        `g-button__type--${this.type}`,
        `g-button__size--${this.size}`,
      ];
    },
    isShowIcon() {
      return (
        this.iconType &&
        this.iconType !== "" &&
        this.iconType !== null &&
        this.iconType !== undefined
      );
    },
    icon() {
      return `${this.iconType}-icon`;
    },
  },
  methods: {
    onFocus() {
      this.$emit("focus");
    },
    onClick(e) {
      this.$emit("onClick", e);
    },
  },
};
</script>

<style lang="scss" scoped>
.g-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--button-border-radius);

  &__type {
    &--primary {
      color: #fff;
      background-color: var(--primaryColor);
      border: 1px solid var(--primaryColor);
    }
    &--outlined {
      color: var(--primaryColor);
      background-color: #fff;
      border: 1px solid var(--primaryColor);
      &-danger {
        background-color: #fff;
        border: 1px solid var(--dangerColor);
      }
    }
    &--text {
      color: var(--primaryColor);
      border: none;
      background-color: #fff;
      &-danger {
        background-color: #fff;
        border: 1px solid var(--dangerColor);
      }
    }
  }
  &__size {
    &--small {
      font-size: 0.75em;
      padding: 0.5em 0.5em;
    }
    &--default {
      font-size: 1em;
      padding: 0.75em 0.75em;
    }
    &--large {
      font-size: 1.25em;
      padding: 0.75em 0.75em;
    }
  }
}
</style>
