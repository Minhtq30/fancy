<template>
  <div v-if="showMessage" class="text-message">
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: String,
    showMessage: Boolean,
  },
  name: "ErrorMessageInTable",
};
</script>

<style scoped>
.text-message {
  width: 100%;
  padding: 0 2px;
  margin-top: 2px;
  background: #eb5757;
  color: #fff;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  height: 14px;
}
</style>
