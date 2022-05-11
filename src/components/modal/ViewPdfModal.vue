<template>
  <div>
    <iframe height="100%" width="100%" :src="base64Data" />
  </div>
</template>
<script>
export default {
  name: "ViewPdfModal",
  props: ["base64Data"],
};
</script>

<style lang="scss" scoped></style>
