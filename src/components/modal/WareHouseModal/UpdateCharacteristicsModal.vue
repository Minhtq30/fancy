<template>
  <div>
    <div class="t-flex t-flex-wrap t-gap-[10px]">
      <g-input
        class="t-min-w-[100px] t-max-w-[100px] t-flex-1"
        placeholder="Size/ Màu"
        v-model="characteristicUpdateData.name"
        :outer-error-message="validate.characteristic_name"
      ></g-input>
      <div
        class="t-flex t-justify-start t-items-center t-flex-wrap t-gap-[10px]"
      >
        <button
          v-for="charValue in characteristicUpdateData.values"
          class="t-relative button-toggle-characteristic t-h-[28px] t-py-[4px] t-px-[10px] t-rounded-[5px] t-flex t-justify-center t-items-center"
          :class="
            charValue.checked
              ? ' t-bg-[#069255] t-text-[#fff]'
              : 't-bg-[#fff] t-text-[#069255] t-border-solid t-border-[1px] t-border-[#069255]'
          "
          :key="charValue"
          @click="toggleValueCharacteristic(charValue)"
        >
          {{ charValue.value }}
        </button>
      </div>
      <g-input
        class="t-min-w-[100px] t-flex-1"
        placeholder="+ Nhập giá trị đặc tính (S/M/...)"
        v-model="characteristicValue"
        :outer-error-message="validate.characteristic_value"
        @keyup.enter="handleAddValueCharacteristic"
        @update:modelValue="handChangeValueCharacteristic"
      ></g-input>
      <button
        v-show="buttonAddValue && !disabledButton.add"
        class="t-bg-transparent t-bg-[#069255] t-h-[32px] t-p-0 t-w-[30px] t-h-[25px] t-text-[16px] t-font-normal t-text-[#fff] t-rounded-[5px]"
        @click="handleAddValueCharacteristic"
      >
        +
      </button>
    </div>
    <div
      class="update-characteristic-actions t-mt-[20px] t-flex t-items-center t-justify-end"
    >
      <button
        class="t-bg-transparent t-mr-[15px] t-rounded-[5px] t-border-[2px] t-border-solid t-border-[#DA4838] t-h-[32px] t-p-0 t-w-[106px] t-text-[16px] t-font-normal t-text-[#DA4838]"
        @click="handleDeleteUpdateCharacteristic(characteristicUpdateData.id)"
      >
        Xóa đặc tính
      </button>
      <button
        class="t-bg-[#00904A] t-rounded-[5px] t-border-[2px] t-border-solid t-border-[#069255] t-h-[32px] t-p-0 t-w-[105px] t-text-[16px] t-font-medium t-text-[#fff]"
        @click="handleSaveUpdateCharacteristic(characteristicUpdateData.id)"
      >
        Lưu đặc tính
      </button>
    </div>
  </div>
</template>

<script>
import { GInput } from "@/components";
// import { v4 as uuidv4 } from "uuid";

export default {
  components: { GInput },
  props: ["characteristicUpdate", "toggleModalUpdate"],
  data() {
    return {
      characteristicValue: "",
      characteristicUpdateData: {},
      arrayValueCharacteristic: [],
      arrayValueCharacteristicCheck: [],
      validate: {
        characteristic_name: "",
        characteristic_value: "",
      },
      buttonAddValue: false,
      disabledButton: {
        add: false,
        save: true,
      },
    };
  },
  mounted() {
    this.characteristicUpdateData = {
      name: this.characteristicUpdate.name || "",
      id: this.characteristicUpdate.id || null,
      values:
        this.characteristicUpdate.values.map((value) => {
          return {
            ...value,
            checked: true,
          };
        }) || [],
    };
    if (this.characteristicUpdateData.values.length !== 0) {
      this.arrayValueCharacteristicCheck =
        this.characteristicUpdateData.values.map((val) => {
          return val.value.toLowerCase();
        });
    }
  },
  computed: {},
  methods: {
    handleDeleteUpdateCharacteristic(id) {
      if (id) {
        this.$store.dispatch("warehouse/deleteProductCharacteristics", {
          id,
          is_delete: true,
        });
        this.$emit("toggleModalUpdate", true);
      }
    },
    async handleSaveUpdateCharacteristic(id) {
      this.handleValidate();
      if (id && this.handleValidate()) {
        const newCharacteristicUpdateData = this.characteristicUpdateData.values
          .filter((val) => {
            return val.checked !== false;
          })
          .map((val) => {
            return {
              id: val.id_value || val.id,
              value: val.value,
            };
          });
        await this.$store.dispatch("warehouse/updateProductCharacteristics", {
          id: id,
          name: this.characteristicUpdateData.name,
          values: newCharacteristicUpdateData,
        });
        await this.$store.dispatch("warehouse/getProductCharacteristics");
        this.$emit("toggleModalUpdate", true);
      }
    },
    handleAddValueCharacteristic() {
      if (this.characteristicValue && this.checkValueCharacteristic()) {
        this.characteristicUpdateData.values.push({
          value: this.characteristicValue,
          checked: true,
        });
        this.arrayValueCharacteristicCheck.push(
          this.characteristicValue.toLowerCase()
        );
        this.characteristicValue = "";
      }
    },
    toggleValueCharacteristic(value) {
      if (value) {
        let index = this.characteristicUpdateData.values.findIndex(
          (val) => val.value === value.value
        );
        this.characteristicUpdateData.values[index].checked =
          !this.characteristicUpdateData.values[index].checked;
        this.arrayValueCharacteristicCheck =
          this.arrayValueCharacteristicCheck.filter((val) => {
            return val !== value.value;
          });
      }
    },
    handChangeValueCharacteristic(data) {
      if (data !== "") {
        this.validate.characteristic_value = "";
      }
    },
    checkValueCharacteristic() {
      this.validate.characteristic_value = "";
      if (this.characteristicValue && this.characteristicValue.length <= 10) {
        if (
          this.arrayValueCharacteristicCheck.includes(
            this.characteristicValue.toLowerCase()
          )
        ) {
          this.validate.characteristic_value = "Trùng với giá trị trước đó";
          return false;
        }
      } else if (
        this.characteristicValue &&
        this.characteristicValue.length > 10
      ) {
        this.validate.characteristic_value = "Nhỏ hơn 10 ký tụ";
        return false;
      }
      return true;
    },
    handleValidate() {
      let isValid = true;
      this.validate.characteristic_value = "";
      this.validate.characteristic_name = "";
      if (!this.characteristicUpdateData.name) {
        this.validate.characteristic_name = "Nhập tên đặc tính";
        isValid = false;
      }
      if (this.characteristicUpdateData.name.length > 10) {
        this.validate.characteristic_name = "Nhỏ hơn 10 ký tụ";
        isValid = false;
      }
      return isValid;
    },
  },
  watch: {
    // characteristicUpdate: function () {
    //   this.characteristicUpdateData = {
    //     name: this.characteristicUpdate.name || "",
    //     id: this.characteristicUpdate.id || null,
    //     values: this.characteristicUpdate.values || [],
    //   };
    // },
    characteristicValue: function () {
      this.characteristicValue
        ? (this.buttonAddValue = true)
        : (this.buttonAddValue = false);
    },
  },
};
</script>

<style lang="scss" scoped>
.manage-characteristics-modal {
  .update-characteristic {
    display: none;
    transition: 0.3s;
  }
  .modalActive {
    display: block;
  }
  .itemActive {
    display: none;
  }
  .overlay {
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    width: calc(100% - 30px);
    z-index: 1;
  }
  .disabled {
    border-color: #bdbdbd;
    color: #bdbdbd;
    cursor: not-allowed;
  }
  .list-characteristic + .list-characteristic {
    border-top: 1px solid #e0e0e0;
  }
  .list-characteristic {
    .characteristic-p {
      margin-left: 3px;
    }
  }
}
</style>

<style lang="scss"></style>
