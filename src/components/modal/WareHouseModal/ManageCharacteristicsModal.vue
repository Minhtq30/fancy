<template>
  <a-modal
    class="manage-characteristics-modal"
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="656"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <template v-slot:title>
      <div class="t-flex t-flex-row t-items-center t-w-full">
        <h3
          class="t-text-center t-text-white t-mb-0 t-text-[24px] t-font-medium t-h-[25px]"
          style="
            flex: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          "
        >
          Quản lý đặc tính
        </h3>
        <span class="t-flex t-cursor-pointer" @click="handleCancel">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2.01429L17.9857 0L10 7.98571L2.01429 0L0 2.01429L7.98571 10L0 17.9857L2.01429 20L10 12.0143L17.9857 20L20 17.9857L12.0143 10L20 2.01429Z"
              fill="#fff"
            />
          </svg>
        </span>
      </div>
    </template>
    <div class="t-text-black t-text-[16px]">
      <div class="manage-characteristics-modal-content">
        <div class="t-px-[25px]">
          <p class="t-text-[16px] t-font-medium t-m-0">Thêm đặc tính mới</p>
          <div class="t-flex t-mt-[15px] t-flex-wrap t-gap-[10px]">
            <g-input
              class="t-min-w-[100px] t-max-w-[100px] t-flex-1"
              placeholder="Size/ Màu"
              v-model="newCharacteristic.name"
              :outer-error-message="validate.characteristic_name"
            ></g-input>
            <div
              class="t-flex t-justify-start t-items-center t-flex-wrap t-gap-[10px]"
            >
              <button
                class="t-relative button-toggle-characteristic t-h-[28px] t-py-[4px] t-px-[10px] t-rounded-[5px] t-flex t-justify-center t-items-center"
                v-for="value in arrayNewCharacteristicValues"
                :class="
                  value.checked
                    ? ' t-bg-[#069255] t-text-[#fff]'
                    : 't-bg-[#fff] t-text-[#069255] t-border-solid t-border-[1px] t-border-[#069255]'
                "
                :key="value"
                @click="toggleValueCharacteristic(value)"
              >
                {{ value.value }}
              </button>
            </div>
            <g-input
              class="t-min-w-[100px] t-flex-1"
              placeholder="+ Nhập giá trị đặc tính (S/M/...)"
              v-model="newCharacteristic.value"
              :outer-error-message="validate.characteristic_value"
              @input-change="validateCharacteristicValue"
              @keyup.enter="addCharacteristicValue"
            ></g-input>
            <button
              v-show="buttonAddValue && !disabledButton.add"
              class="t-bg-transparent t-bg-[#069255] t-h-[32px] t-p-0 t-w-[30px] t-h-[25px] t-text-[16px] t-font-normal t-text-[#fff] t-rounded-[5px]"
              @click="addCharacteristicValue"
            >
              +
            </button>
            <button
              :class="disabledButton.save ? 'disabled' : ''"
              class="t-bg-transparent t-rounded-[5px] t-border-[2px] t-border-solid t-border-[#069255] t-h-[32px] t-p-0 t-w-[50px] t-text-[16px] t-font-normal t-text-[#069255]"
              @click="submitAddCharacteristic"
            >
              Lưu
            </button>
          </div>
        </div>
        <div
          class="list-characteristics t-mt-[20px] t-relative"
          :class="characteristics.length !== 0 ? '' : 't-h-[200px]'"
        >
          <p class="t-px-[25px] t-text-[16px] t-font-medium t-m-0">
            Danh sách đặc tính
          </p>
          <div
            class="overlay"
            v-if="loadingSpin || characteristics?.length === 0"
          >
            <a-spin :spinning="loadingSpin || characteristics?.length === 0" />
          </div>
          <div class="t-px-[25px] t-h-[200px] t-overflow-auto">
            <div
              class="list-characteristic t-flex t-flex-col t-py-[10px]"
              v-for="characteristic in characteristics"
              :key="characteristic.id"
            >
              <div
                class="t-flex t-items-center t-justify-between"
                :class="{ itemActive: activeItem === characteristic.id }"
              >
                <div class="t-flex t-items-center">
                  <p class="t-m-0 t-capitalize">{{ characteristic.name }}:</p>
                  <div class="t-flex t-items-center t-ml-[5px]">
                    <p
                      class="characteristic-p t-m-0"
                      v-for="(char, index) in characteristic.values"
                      :key="char.id"
                    >
                      {{ char.value
                      }}{{
                        index === characteristic.values.length - 1 ? "." : ","
                      }}
                    </p>
                  </div>
                </div>
                <div
                  class="t-flex t-cursor-pointer"
                  @click="toggleModalUpdate(characteristic)"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 17.0134L11.413 16.9984L21.045 7.45839C21.423 7.08039 21.631 6.57839 21.631 6.04439C21.631 5.51039 21.423 5.00839 21.045 4.63039L19.459 3.04439C18.703 2.28839 17.384 2.29239 16.634 3.04139L7 12.5834V17.0134ZM18.045 4.45839L19.634 6.04139L18.037 7.62339L16.451 6.03839L18.045 4.45839ZM9 13.4174L15.03 7.44439L16.616 9.03039L10.587 15.0014L9 15.0064V13.4174Z"
                      fill="#069255"
                    />
                    <path
                      d="M5 21H19C20.103 21 21 20.103 21 19V10.332L19 12.332V19H8.158C8.132 19 8.105 19.01 8.079 19.01C8.046 19.01 8.013 19.001 7.979 19H5V5H11.847L13.847 3H5C3.897 3 3 3.897 3 5V19C3 20.103 3.897 21 5 21Z"
                      fill="#069255"
                    />
                  </svg>
                </div>
              </div>
              <transition name="bounce">
                <div
                  v-if="activeItem"
                  :class="{ modalActive: activeItem === characteristic.id }"
                  class="update-characteristic t-py-[20px]"
                >
                  <update-characteristics-modal
                    :characteristicUpdate="characteristic"
                    :key="characteristic.id"
                    @toggleModalUpdate="toggleModalUpdateData"
                  ></update-characteristics-modal>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { GInput } from "@/components";
import { v4 as uuidv4 } from "uuid";
import UpdateCharacteristicsModal from "@/components/modal/WareHouseModal/UpdateCharacteristicsModal";
import { mapState } from "vuex";
export default {
  components: { UpdateCharacteristicsModal, GInput },
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    setVisible: Function,
  },
  mounted() {},
  computed: {
    ...mapState({
      characteristics: (state) => state.warehouse.productCharacteristics,
    }),
  },
  data() {
    return {
      loadingSpin: false,
      activeItem: null,
      newCharacteristic: {
        name: "",
        value: "",
      },
      arrayNewCharacteristicValues: [],
      buttonAddValue: false,
      validate: {
        characteristic_name: "",
        characteristic_value: "",
      },
      disabledButton: {
        add: false,
        save: true,
      },
    };
  },
  methods: {
    handleCancel() {
      this.handleResetValue();
      this.setVisible(false);
    },
    submitAddCharacteristic() {
      // this.handleValidate();
      if (this.handleValidate() === true && !this.disabledButton.save) {
        let values = this.arrayNewCharacteristicValues.map((item) =>
          item.checked ? item : null
        );
        values = values.filter((item) => item !== null);
        this.$store.dispatch("warehouse/addProductCharacteristics", {
          name: this.newCharacteristic.name,
          values: values.map((value, index) => {
            return {
              ...value,
              order: index + 1,
            };
          }),
        });
        this.newCharacteristic.name = "";
        this.newCharacteristic.value = "";
        this.arrayNewCharacteristicValues = [];
      }
    },
    addCharacteristicValue() {
      let characteristicValues = this.arrayNewCharacteristicValues.map(
        (item) => item.value
      );
      if (
        this.newCharacteristic.value &&
        !characteristicValues.includes(this.newCharacteristic.value)
      ) {
        this.arrayNewCharacteristicValues.push({
          id: uuidv4(),
          value: this.newCharacteristic.value,
          checked: true,
        });
        this.newCharacteristic.value = "";
      }
    },
    toggleModalUpdateData(data) {
      if (data) {
        this.activeItem = null;
      }
    },
    toggleValueCharacteristic(value) {
      if (value) {
        let index = this.arrayNewCharacteristicValues.findIndex(
          (val) => val.id === value.id
        );
        this.arrayNewCharacteristicValues[index].checked =
          !this.arrayNewCharacteristicValues[index].checked;
      }
    },
    toggleModalUpdate(n) {
      if (this.activeItem === n.id) {
        this.activeItem = null;
      } else {
        this.activeItem = n.id;
      }
    },
    handleValidate() {
      let isValid = true;
      this.validate.characteristic_value = "";
      this.validate.characteristic_name = "";
      if (!this.newCharacteristic.name && !this.disabledButton.save) {
        this.validate.characteristic_name = "Nhập tên đặc tính";
        isValid = false;
      }
      if (
        this.arrayNewCharacteristicValues.length === 0 &&
        !this.disabledButton.save
      ) {
        this.validate.characteristic_value = "Nhập giá trị đặc tính";
        isValid = false;
      }

      return isValid;
    },

    handleResetValue() {
      this.newCharacteristic.name = "";
      this.newCharacteristic.value = "";
      this.arrayNewCharacteristicValues = [];
      this.buttonAddValue = false;
      this.validate.characteristic_name = "";
      this.validate.characteristic_value = "";
      this.disabledButton.add = false;
      this.disabledButton.save = true;
      this.activeItem = null;
    },
    validateCharacteristicValue() {
      this.newCharacteristic.value
        ? (this.buttonAddValue = true)
        : (this.buttonAddValue = false);
      this.newCharacteristic.name.length > 10
        ? (this.validate.characteristic_name = "Nhỏ hơn 10 ký tụ")
        : (this.validate.characteristic_name = "");
      this.newCharacteristic.name &&
      this.newCharacteristic.name.length <= 10 &&
      this.arrayNewCharacteristicValues.length !== 0
        ? (this.disabledButton.save = false)
        : (this.disabledButton.save = true);
      let characteristicValues = this.arrayNewCharacteristicValues.map(
        (item) => item.value
      );
      if (this.newCharacteristic && this.newCharacteristic.value.length <= 10) {
        characteristicValues.includes(this.newCharacteristic.value)
          ? (this.validate.characteristic_value = "Trùng với giá trị trước đó")
          : (this.validate.characteristic_value = "");
        characteristicValues.includes(this.newCharacteristic.value)
          ? (this.disabledButton.add = true)
          : (this.disabledButton.add = false);
      } else if (
        this.newCharacteristic &&
        this.newCharacteristic.value.length > 10
      ) {
        this.newCharacteristic.value.length > 10
          ? (this.validate.characteristic_value = "Nhỏ hơn 10 ký tụ")
          : (this.validate.characteristic_value = "");
        this.newCharacteristic.value.length > 10
          ? (this.disabledButton.add = true)
          : (this.disabledButton.add = false);
      }
    },
  },
  watch: {
    "characteristicValue.value": function () {},
    characteristicValue: {
      handler() {
        this.validateCharacteristicValue();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.manage-characteristics-modal {
  .update-characteristic {
    display: none;
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

<style lang="scss">
.manage-characteristics-modal {
  .bounce-enter-active {
    animation: bounce-in 0.3s;
  }
  .bounce-leave-active {
    opacity: 0;
    transition: 0.3s;
  }
  @keyframes bounce-in {
    0% {
      transform: translateY(10px);
    }
    100% {
      transform: translateY(0);
    }
  }
  .g-input__wrapper {
    .outerError {
      position: absolute;
      bottom: -21px;
      font-size: 12px;
      z-index: 99;
    }
  }
  .ant-modal-content {
    border-radius: 13px 13px 12px 12px;
    .ant-modal-header {
      padding: 11px 24px;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
  }
  .ant-input:focus {
    border-color: #d9d9d9;
    box-shadow: none;
  }
  .ant-input:hover {
    border-color: #d9d9d9;
    box-shadow: none;
  }
  .ant-modal-body {
    padding: 20px 0 10px 0;
  }
}
</style>
