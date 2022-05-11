<template>
  <div class="g-list-option">
    <a-checkbox
      v-if="showAll"
      v-model:checked="checkAll"
      :indeterminate="indeterminate"
      @change="onCheckAllChange"
      class="g-checkbox-check-all"
    >
      Tất cả
    </a-checkbox>
    <div>
      <a-checkbox-group
        :class="{
          'g-checkbox-row': mode === 'row',
          [classContent]: true,
          'g-checkbox-row-padding': hasPadding,
        }"
        :value="checkedList"
        :options="options"
        @change="onChangeSelected"
      >
        <template #label="{ ...option }">
          <slot name="label" :option="option" />
        </template>
      </a-checkbox-group>
    </div>
  </div>
  <div
    @click="handleSelected"
    v-if="modeOption === 'multi-after'"
    class="g-list-option-button"
  >
    <button>Chọn {{ checkedList.length }} {{ unit }}</button>
  </div>
</template>

<script>
import { computed, reactive, ref, toRefs, watch } from "vue";

export default {
  name: "ListOptions",
  props: {
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    checkedListDefault: {
      type: Array,
      default() {
        return [];
      },
    },
    showAll: {
      type: Boolean,
      default: true,
    },
    mode: {
      type: String,
      default: "row",
    },
    modeOption: {
      type: String,
      default: "multi",
    },
    classContent: {
      type: String,
      default: "",
    },
    unitString: {
      type: String,
      default: "Sản phẩm",
    },
    hasPadding: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const plainKeyOptions = computed(() =>
      props.options.map((item) => item.value)
    );

    const state = reactive({
      indeterminate:
        !!props.checkedListDefault.length &&
        props.checkedListDefault.length < plainKeyOptions.value.length,
      checkAll:
        props.checkedListDefault.length === plainKeyOptions.value.length,
      checkedList: props.checkedListDefault,
    });

    const unit = ref(props.unitString);

    const onCheckAllChange = (e) => {
      Object.assign(state, {
        checkedList: e.target.checked ? plainKeyOptions.value : [],
        indeterminate: false,
      });

      emit("onChange", state);
    };

    const handleSelected = () => {
      emit("onSelectedMulti");
    };

    const onChangeSelected = (checkedValue) => {
      const newValue = checkedValue.filter(
        (item) => !state.checkedList.includes(item)
      );
      const lostValue = state.checkedList.filter(
        (item) => !checkedValue.includes(item)
      );

      Object.assign(state, {
        checkedList:
          props.modeOption === "simple" ? newValue : [...checkedValue],
      });
      const dataOptions = props.options.filter((item) =>
        state.checkedList.includes(item.value)
      );

      if (props.modeOption === "simple") {
        emit("onChange", {
          value: state.checkedList[0],
          dataOptions: dataOptions[0],
        });
      } else if (props.modeOption === "multi-after") {
        // Do something.
        if (newValue.length > 0) {
          const _dataOptions = props.options.filter((item) =>
            newValue.includes(item.value)
          );
          emit("onSelected", {
            value: newValue[0],
            dataOptions: _dataOptions[0],
          });
        }
        if (lostValue.length > 0) {
          const _dataOptions = props.options.filter((item) =>
            lostValue.includes(item.value)
          );
          emit("onUnSelected", {
            value: lostValue[0],
            dataOptions: _dataOptions[0],
          });
        }
        emit("onChange", { ...state, dataOptions });
      } else {
        emit("onChange", { ...state, dataOptions });
      }
    };

    // TODO: Nếu default thay đổi thì cập nhật lại.
    watch(
      () => props.checkedListDefault,
      (newVal) => {
        state.indeterminate =
          !!newVal.length && newVal.length < plainKeyOptions.value.length;
        state.checkAll = newVal.length === plainKeyOptions.value.length;
        state.checkedList = newVal;
      }
    );

    watch(
      () => state.checkedList,
      (val) => {
        state.indeterminate =
          !!val.length && val.length < plainKeyOptions.value.length;
        state.checkAll = val.length === plainKeyOptions.value.length;
      }
    );

    return {
      ...toRefs(state),
      unit,
      plainKeyOptions,
      onCheckAllChange,
      onChangeSelected,
      handleSelected,
    };
  },
};
</script>

<style lang="scss">
.g-checkbox-check-all {
  width: 100%;
  height: 35px;
  align-items: center !important;
  display: flex !important;
  padding-left: 10px !important;
  .ant-checkbox-inner {
    width: 20px;
    height: 20px;
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: var(--primaryColor);
    border-color: var(--primaryColor);
  }
  .ant-checkbox-indeterminate .ant-checkbox-inner {
    background-color: var(--primaryColor);
  }
  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    width: 10px;
    height: 2px;
    background-color: white;
  }
}

.g-checkbox-row-padding {
  .ant-checkbox-group-item {
    padding-left: 10px;
  }
}

.g-checkbox-row {
  width: 100%;
  .ant-checkbox-group-item {
    width: 100%;
    align-items: center;
    display: flex;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 35px;
  }
  .ant-checkbox-inner {
    width: 20px;
    height: 20px;
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: var(--primaryColor);
    border-color: var(--primaryColor);
  }
}
</style>

<style lang="scss" scoped>
.g-list-option {
  position: relative;
}
.g-list-option-button {
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: 10px;
  font-size: 0.875rem;
  background-color: white;
  button {
    width: 100%;
    background-color: var(--primaryColor);
    color: white;
    font-weight: 500;
    padding: 5px;
    border-radius: 4px;
  }
}
</style>
