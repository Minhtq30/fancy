<template>
  <div
    class="channel__item-col channel__item-phone"
    @paste.prevent="handlePasteFromExcel"
  >
    <g-multiselect
      :visible="visible"
      :width="300"
      class="filter-select-wrapper"
    >
      <template #contentDropdown>
        <input-in-table
          class="input-phone"
          v-model:value="phone"
          placeholder="SĐT"
          :formatter="numberParser"
          @blur="handleGetCustomerInfoByPhone"
          :debounce="debounceConfig"
        />
      </template>
      <template #contentOption>
        <a-spin class="g-spin-address" :spinning="loading">
          <list-user-suggest-by-phone
            :options="optionSuggestion"
            @on-selected="handleSelectedUser"
          />
        </a-spin>
      </template>
    </g-multiselect>
    <error-message-in-table
      :showMessage="validState"
      :message="invalidMessage"
    />
    <div class="input-phone-duplicate" v-if="customerDetail.is_duplicate">
      <i>1 ĐH đang xử lí</i>
    </div>
    <div class="loading-phone">
      <a-spin :indicator="indicator" :spinning="loading" />
    </div>
  </div>
</template>

<script>
import { defineComponent, h } from "vue";
import { LoadingOutlined } from "@ant-design/icons-vue";

// Components
import GMultiselect from "@/components/base/Multiselect";
import InputInTable from "@/components/base/InputInTable";
import ErrorMessageInTable from "@/components/base/ErrorMessageInTable";
import ListUserSuggestByPhone from "@/components/base/ListUserSuggest/ListUserSuggest";

// Validate
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { get, isArray, map, size, trim } from "lodash";
import services from "@/services";

// Mixin
import commonMixin from "@/plugins/mixins/common";
import { isValidPhone } from "@/utils";

export default defineComponent({
  name: "order-excel-col-phone",
  components: {
    ListUserSuggestByPhone,
    GMultiselect,
    InputInTable,
    ErrorMessageInTable,
  },
  mixins: [commonMixin],
  props: {
    dataSource: {
      type: String,
      default: "",
    },
    customerDetail: {
      type: String,
      default: "",
    },
    debounceConfig: {
      type: Number,
      default: 0,
    },
  },
  validations: {
    phone: {
      required,
      minLength: minLength(10),
    },
  },
  computed: {
    phone: {
      get() {
        return this.dataSource;
      },
      async set(nextValue) {
        this.$emit("onUpdateItemByFieldName", {
          name: "phone",
          value: nextValue,
        });
        // Call API suggest phone number.
        this.loading = true;
        this.optionSuggestion = await this.searchCustomerByPhone(nextValue);
        this.loading = false;
        this.visible = true;
      },
    },
    validState() {
      return !isValidPhone(this.phone);
    },
    invalidMessage() {
      if (!isValidPhone(this.phone)) {
        return "SĐT sai";
      }
      return "SĐT thiếu";
    },
  },
  data() {
    return {
      optionSuggestion: [],
      loading: false,
      timer: null,
      visible: false,
    };
  },
  setup() {
    const v$ = useVuelidate();
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: "20px",
      },
      spin: true,
    });

    return {
      v$,
      indicator,
    };
  },
  methods: {
    handleCloseVisible() {
      this.visible = false;
    },
    handleSelectedUser(item) {
      this.$emit("onUpdateItemByFieldName", {
        name: "phone",
        value: item.phone,
      });
      this.$emit("onUpdateItemByFieldName", {
        name: "name",
        value: item.username,
      });
      this.$emit("handlePasteAddress", item.address);
      this.$emit("onUpdateItemByFieldName", {
        name: "address",
        value: item.address,
      });
      this.visible = false;
      this.optionSuggestion = [];
    },
    handlePasteFromExcel(event) {
      this.$emit("onPasteFromExcel", "phone", event);
    },
    handleGetCustomerInfoByPhone() {
      if (!this.validState) {
        this.$emit("onGetCustomerInfoByPhone");
      } else {
        this.$emit("onUpdateDataPhoneInvalid");
      }
    },
    async searchCustomerByPhone(term) {
      if (size(trim(term)) === 0) return;
      let result = await services.$customer.browseCustomerByPhone(term);
      let data = get(result, "data", []);
      if (!isArray(data)) {
        data = [];
      }
      return map(data, (x) => {
        return {
          phone: x.tel,
          value: x.id,
          address: x.add,
          username: x.name,
        };
      });
    },
  },
  unmounted() {
    clearTimeout(this.timer);
  },
});
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
.input-phone::-webkit-outer-spin-button,
.input-phone::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
.input-phone[type="number"] {
  -moz-appearance: textfield;
}

.channel__item-phone {
  position: relative;
}
.loading-phone {
  position: absolute;
  left: 0;
  top: -15px;
}
.input-phone-duplicate {
  font-size: small;
  color: var(--primaryColor);
  text-decoration: underline;
  cursor: pointer;
}
</style>
