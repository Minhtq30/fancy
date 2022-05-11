<template>
  <div>
    <g-checkbox
      v-model:checked="checkAll"
      :indeterminate="indeterminate"
      class="check-box-all"
      @change="onCheckAllChange"
    >
      {{ title }}
    </g-checkbox>
    <div
      v-show="checkAll || indeterminate || showAll"
      class="list-checkbox-child g-checkbox"
    >
      <a-checkbox-group
        @input="onChange"
        :value="checkedList"
        :options="options"
      />
    </div>
  </div>
</template>

<script>
import GCheckbox from "@/components/elements/checkbox";

export default {
  name: "OptionItem",
  components: {
    GCheckbox,
  },
  props: {
    options: Array,
    checkedList: Array,
    title: String,
    showAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      checkAll: false,
      indeterminate: false,
    };
  },
  watch: {
    checkedList(newValue) {
      let check = true;
      this.options.forEach((item) => {
        if (newValue.includes(item.value)) {
          check = false;
        }
      });

      if (newValue.length === 0 || check) {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
  },
  methods: {
    onCheckAllChange(e) {
      const optionKey = this.options.map((item) => item.value);
      const checkedList = e.target.checked ? optionKey : [];
      this.indeterminate = false;
      this.$emit("onChange", checkedList);
    },
    onChange(e) {
      let checkListTemp = this.checkedList;
      if (e.target.checked) {
        // Chọn.
        checkListTemp = [...checkListTemp, e.target.value];
      } else {
        // Bỏ chọn.
        checkListTemp = checkListTemp.filter((item) => item !== e.target.value);
      }
      this.checkAll = checkListTemp.length > 0;
      this.indeterminate =
        !!checkListTemp.length && checkListTemp.length < this.options.length;
      this.$emit("onChange", checkListTemp);
    },
  },
};
</script>

<style lang="scss">
.list-checkbox-child {
  .ant-checkbox-wrapper {
    width: 100%;
    padding: 5px 10px;
  }
  .ant-checkbox-inner {
    width: 20px;
    height: 20px;
  }
  .ant-checkbox-inner {
    border-color: var(--disabledColor) !important;
  }
}
.check-box-all {
  font-size: 0.875rem !important;
  width: 100% !important;
  padding: 5px 10px !important;

  .ant-checkbox-inner {
    width: 20px;
    height: 20px;
  }
  .ant-checkbox-inner {
    border-color: var(--disabledColor) !important;
  }
}
</style>

<style scoped>
.list-checkbox-child {
  padding-left: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
