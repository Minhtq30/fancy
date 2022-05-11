<template>
  <span>{{ formatedValue }}</span>
</template>

<script>
export default {
  name: "FormatPrice",
  props: ["value"],
  computed: {
    formatedValue() {
      return this.value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>
