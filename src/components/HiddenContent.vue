<template>
  <span class="pointer" @click="toogleHidden">
    <u>{{ value }}</u>
  </span>
</template>

<script>
export default {
  name: "HiddenContent",
  props: ["text", "first", "last"],
  data() {
    return {
      isHidden: true,
    };
  },
  methods: {
    toogleHidden() {
      this.isHidden = !this.isHidden;
    },
  },
  computed: {
    value() {
      if (this.isHidden)
        return (
          this.text?.slice(0, this.first) +
          "***" +
          this.text?.slice(this.text?.length - this.last, this.text?.length)
        );
      return this.text;
    },
  },
};
</script>
