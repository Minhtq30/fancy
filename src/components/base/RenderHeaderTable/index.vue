<template>
  <div class="g-title-header-wrap" :style="columnsWrapper">
    <div v-for="column in columns" :key="column.key" class="g-title-header">
      {{ column.title }}
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from "vue";
import { forEach } from "lodash";

export default defineComponent({
  name: "RenderHeaderTable",
  props: {
    dataSource: {
      type: Object,
    },
  },
  setup(props) {
    const columns = computed(() => {
      return props.dataSource;
    });

    const columnsWrapper = computed(() => {
      let wrapperStyleStr = "";
      const COL_MIN_WIDTH = "100px";
      forEach(columns.value, (col) => {
        const minMax = `minmax(${col.minWidth || COL_MIN_WIDTH}, ${
          col.width
        }) `;
        wrapperStyleStr += minMax;
      });
      return {
        "grid-template-columns": wrapperStyleStr,
      };
    });

    return {
      columns,
      columnsWrapper,
    };
  },
});
</script>

<style scoped>
.g-title-header {
  font-weight: bold;
  text-align: center;
  height: 77px;
  display: flex;
  align-items: center;
  border-right: 1px solid #dbdbdb;
  justify-content: center;
  border-bottom: 1px solid #dbdbdb;
}
.g-title-header-wrap {
  height: 77px;
  align-items: center;
  display: grid;
  min-width: 100%;
}
</style>
