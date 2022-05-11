<template>
  <div class="wrapper mr">
    <input-select :width="'53px'" :setOpen="setIsOpen" :is-active="isOpen">
      <template #content>
        <img src="@/assets/icons/warehouse.svg" class="" />
      </template>
      <template v-if="isOpen" #dropdown>
        <div class="dropdown-overlay overlay-warehouse-dropdown">
          <div v-if="!options.length" class="option-item">Danh sách trống</div>
          <div
            v-else
            v-for="option in options"
            :key="option.key"
            @click="handleClick(option.key)"
            class="option-item"
          >
            <g-checkbox
              :checked="value?.toString() === option.key.toString()"
            />
            <a-tooltip :title="option.title" :placement="'left'">
              <span class="ml">{{ option.title }}</span>
            </a-tooltip>
          </div>
        </div>
      </template>
    </input-select>
  </div>
</template>

<script>
import { mapState } from "vuex";

import GCheckbox from "../elements/checkbox.vue";
import InputSelect from "@/components/select/InputSelect.vue";

export default {
  name: "SelectWarehouseMenuRight",
  props: ["isOpen", "setIsOpen", "value", "onChange"],
  components: {
    InputSelect,
    GCheckbox,
  },
  methods: {
    open() {
      this.setIsOpen(true);
    },
    handleClick(_value) {
      this.onChange(_value);
    },
  },
  computed: {
    ...mapState({
      warehouses: (state) => state.warehouse.warehouses || [],
    }),
    options() {
      let _warehouses = this.warehouses.map((w) => ({
        ...w,
        key: w.id,
        title: w.name,
      }));

      if (_warehouses?.length) {
        _warehouses = [
          {
            key: "all",
            title: "Tất cả",
          },
          ..._warehouses,
        ];
      }

      return _warehouses;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  .option-item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 30px;
    line-height: 30px;
    align-items: center;
  }
  .dropdown-overlay {
    max-height: 589px !important;
    overflow-y: auto;
    @media only screen and (max-height: 915px) {
      height: 350px;
    }
  }
}
</style>
