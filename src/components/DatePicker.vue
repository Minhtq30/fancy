<template>
  <div class="flex g-date-picker-wrapper">
    <div>
      <a-calendar :fullscreen="false" @panelChange="onPanelChange" />
    </div>
  </div>
</template>

<script>
export default {
  name: "GDatePicker",
  props: ["value"],
  methods: {
    onPanelChange(value, mode) {
      console.log(value, mode);
    },
  },
};
</script>
