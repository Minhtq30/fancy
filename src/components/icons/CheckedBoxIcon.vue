<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 22 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.76172 9.99463L9.79533 14.3869L20.5516 3.40625"
      stroke="black"
      stroke-width="1.8"
      stroke-linecap="square"
    />
    <path
      d="M13 1.5H2.2C1.53726 1.5 1 2.03726 1 2.7V20.3C1 20.9627 1.53726 21.5 2.2 21.5H19.8C20.4627 21.5 21 20.9627 21 20.3V9.5"
      stroke="black"
      stroke-width="1.8"
    />
  </svg>
</template>
<script>
export default {
  props: {
    width: {
      type: Number,
      default: 30,
    },
    height: {
      type: Number,
      default: 30,
    },
  },
};
</script>
