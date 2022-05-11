<template>
  <div class="field-container t-height-full">
    <div class="wrapper">
      <div class="legend">
        <slot name="title"></slot>
      </div>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.field-container {
  flex-grow: 1;
  margin: 12px;
}
.wrapper {
  width: 100%;
  min-height: 157px;
  position: relative;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  margin-top: 30px;
}
.legend {
  position: absolute;
  background: #ffffff;
  height: 38px;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  border-radius: 5.70213px;
  top: -1.1875rem;
  left: 1rem;
  display: flex;
  align-items: center;
  text-align: center;
  font-weight: 500;
  padding: 0 1rem;
  font-size: 1.125rem;
}
</style>
