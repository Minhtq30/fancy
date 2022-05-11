<template>
  <div>
    <span class="description-limit">Số lượng bản ghi / trang</span>
    &nbsp;
    <g-select
      class="page-limit"
      :disabled="loading"
      :value="limit.toString()"
      :default-active-first-option="false"
      @change="onChangeLimit"
    >
      <a-select-option value="25">25</a-select-option>
      <a-select-option value="50">50</a-select-option>
      <a-select-option value="100">100</a-select-option>
    </g-select>
    &nbsp; Trang {{ page + 1 }}/{{ totalPages }}
    <g-button
      :disabled="loading || page === 0"
      class="ml"
      @click="handleChangePage(page - 1)"
    >
      Trang trước
    </g-button>
    <g-button
      :disabled="loading || page === totalPages - 1"
      class="ml"
      @click="handleChangePage(page + 1)"
    >
      Trang sau
    </g-button>
  </div>
</template>

<script>
import { GSelect, GButton } from "@/components/elements";

export default {
  name: "Pagination",
  components: {
    GSelect,
    GButton,
  },
  props: {
    loading: Boolean,
    totalPages: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      limit: 25, // Default 25.
      page: 0,
    };
  },
  methods: {
    onChangeLimit(limitCurrent) {
      this.limit = limitCurrent;
      this.page = 0;
      this.$emit("onChange", { page: 0, limit: Number(limitCurrent) });
    },
    handleChangePage(pageCurrent) {
      this.page = pageCurrent;
      this.$emit("onChange", { page: Number(pageCurrent), limit: this.limit });
    },
  },
};
</script>

<style scoped></style>
