<template>
  <main-content>
    <template #main>
      <div class="shop-policy-info">
        <h3 class="t-text-[18px] t-font-medium t-mb-[5px]">
          Chính sách của shop
        </h3>
        <p class="t-text-[#808080]">
          Chính sách này sẽ được áp dụng mặc định cho tất cả lượt đăng đơn của
          shop.
        </p>
        <div class="t-flex t-flex-col">
          <h3 class="t-text-[16px] t-font-medium t-mb-[15px]">Giao hàng</h3>
          <div class="t-flex t-flex-col 2xl:t-flex-row t-gap-0 2xl:t-gap-20">
            <div>
              <div
                v-for="(tag, index) in tagList"
                :key="tag.key"
                class="t-mb-[10px]"
              >
                <g-checkbox
                  v-if="tagKey1.includes(index)"
                  :checked="policy.deliver_package[tag.field] === 1 || false"
                  @change="handleChangeCheckbox(tag)"
                >
                  <div class="t-flex t-items-center">
                    <p
                      class="t-mb-0 t-w-[430px]"
                      :class="tag.key === 19 ? 'tag-key-19' : ''"
                    >
                      {{ tag.title }}
                    </p>
                    <a-tooltip :mouseEnterDelay="0.5" placement="bottom">
                      <template #title v-if="tag.extFeeNoteExplain">
                        <template
                          v-for="(text, index) in tag.extFeeNoteExplain"
                          :key="index"
                        >
                          <div class="t-mb-2">{{ text }}<br /></div>
                        </template>
                      </template>
                      <span class="notify-free t-underline t-text-primary">{{
                        tag.extFeeNote
                      }}</span>
                    </a-tooltip>
                  </div>
                </g-checkbox>
              </div>
            </div>
            <div>
              <div
                v-for="(tag, index) in tagList"
                :key="tag.key"
                class="t-mb-[10px]"
              >
                <g-checkbox
                  v-if="tagKey2.includes(index)"
                  :checked="
                    policy.deliver_package[tag.field] === 1 ||
                    policy.deliver_package[tag.field].is_selected === 1 ||
                    false
                  "
                  @change="handleChangeCheckbox(tag)"
                >
                  <div class="t-flex t-items-center">
                    <p
                      class="t-mb-0 t-w-[430px]"
                      :class="tag.key === 19 ? 'tag-key-19' : ''"
                    >
                      {{ tag.title }}
                      <g-input
                        class="t-ml-[20px] t-mr-[5px] t-w-[125px]"
                        v-if="tag.key === 19"
                        :borderless="true"
                        :number-only="true"
                        v-model="policy.deliver_package.not_delivered_fee.fee"
                        :formatter="$filters.integerFormatter"
                        :parser="$filters.numberCommaParser"
                        @on-blur="emitInfo"
                        @input-change="changeValueDeliveredFee"
                        :size="20"
                        placeholder="20000"
                      ></g-input>
                      <span v-if="tag.key === 19">đ</span>
                    </p>
                    <a-tooltip :mouseEnterDelay="0.5" placement="bottom">
                      <template #title v-if="tag.extFeeNoteExplain">
                        <template
                          v-for="(text, index) in tag.extFeeNoteExplain"
                          :key="index"
                        >
                          <div class="t-mb-2">{{ text }}<br /></div>
                        </template>
                      </template>
                      <span class="notify-free t-underline t-text-primary">{{
                        tag.extFeeNote
                      }}</span>
                    </a-tooltip>
                  </div>
                </g-checkbox>
              </div>
            </div>
          </div>
        </div>
        <div class="t-flex t-flex-col">
          <h3 class="t-text-[16px] t-font-medium t-mb-[5px]">Phí ship</h3>
          <div class="t-flex t-items-center t-mt-[10px]">
            <g-checkbox
              class="checkbox"
              :checked="policy.fee.is_freeship || false"
              @change="policy.fee.is_freeship = !policy.fee.is_freeship"
            >
              <div :style="{ display: 'inline-block' }">Shop trả</div>
            </g-checkbox>
            <g-checkbox
              :checked="!policy.fee.is_freeship || false"
              @change="policy.fee.is_freeship = !policy.fee.is_freeship"
            >
              <div :style="{ display: 'inline-block' }">Khách hàng trả</div>
            </g-checkbox>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div
        class="button t-h-[40px] t-flex t-items-center t-justify-end t-w-full"
      >
        <g-button
          class="button-policy-save t-w-[154px] t-rounded-[5px] t-py-[8px] t-px-[30px] t-bg-[#00904A] t-text-[#fff]"
          @click="handleSubmit"
          :loading="loading"
        >
          Lưu thay đổi
        </g-button>
      </div>
    </template>
  </main-content>
</template>

<script>
import MainContent from "./main-content.vue";
import GCheckbox from "@/components/elements/checkbox";
import GInput from "@/components/common/GInput";
import { message } from "ant-design-vue";
import policyInfoService from "@/services/policyShopInfo.service";
import GButton from "@/components/elements/button.vue";

//index của tag cần lấy ra
const TAG_KEY_1 = [0, 1, 2, 3]; // group tag 1 ( for CSS purpose only)
const TAG_KEY_2 = [4, 5, 6]; // group tag 2 ( for CSS purpose only)

export default {
  components: { MainContent, GCheckbox, GInput, GButton },
  data() {
    return {
      tagKey1: TAG_KEY_1,
      tagKey2: TAG_KEY_2,
      loading: false,
      tagsChecked: [],
      initObjectPolicy: {},
      policy: {
        fee: {
          is_freeship: 0,
        },
        deliver_package: {
          checking_service: 0,
          try_on_service: 0,
          calling_service: 0,
          partial_shipment_item_selecting: 0,
          partial_shipment_item_returning: 0,
          not_delivered_fee: {
            is_selected: 0,
            fee: 0,
          },
          allow_cod_change_pick_money: 0,
        },
      },
    };
  },
  async mounted() {
    if (!this.$store.getters["shop/notDeliverOptionTag"]) {
      await this.$store.dispatch("shop/getShopConfig");
    }
    this.setPolicyData();
  },
  computed: {
    tagList() {
      // lọc ra các tag đang được hỗ trợ cho màn config hiện tại
      return this.$store.state.constant.tagListExcel.filter((tag) => {
        return tag.key > 8 && tag.key !== 21;
      });
    },
  },
  methods: {
    isObject(obj) {
      return obj != null && typeof obj === "object";
    },
    // Hàm so sánh sâu
    isDeepEqual(obj1, obj2) {
      const keys1 = Object.keys(obj1); // trả về mảng các thuộc tính của obj1
      const keys2 = Object.keys(obj2); // trả về mảng các thuộc tính của obj2

      // nếu số lượng keys khác nhau thì chắc chắn khác nhau
      if (keys1.length !== keys2.length) {
        return false;
      }

      for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];

        // kiểm tra xem hai giá trị có cùng là object hay không
        const areObjects = this.isObject(val1) && this.isObject(val2);

        // nếu cùng là object thì phải gọi đệ quy để so sánh 2 object
        if (areObjects && !this.isDeepEqual(val1, val2)) {
          return false;
        }

        // nếu không cùng là object thì so sánh giá trị
        if (!areObjects && val1 !== val2) {
          return false;
        }
      }

      return true;
    },
    handleCheckChangePolicy() {
      return this.isDeepEqual(this.policy, this.initObjectPolicy);
    },
    handleChangeCheckbox(tag) {
      if (tag.field === "not_delivered_fee") {
        if (this.checkValueFee()) {
          this.policy.deliver_package[tag.field].is_selected =
            this.policy.deliver_package[tag.field].is_selected === 0 ? 1 : 0;
        }
      } else {
        this.policy.deliver_package[tag.field] =
          this.policy.deliver_package[tag.field] === 0 ? 1 : 0;
      }
    },
    changeValueDeliveredFee() {
      const data = Number(this.policy.deliver_package.not_delivered_fee.fee);
      if (!data || data < 10000 || data > 20000000) {
        this.policy.deliver_package.not_delivered_fee.is_selected = 0;
      }
    },
    checkValueFee() {
      if (!this.policy.deliver_package.not_delivered_fee.fee) {
        message.error("Số tiền không giao được thu không được để trống.");
        return false;
      } else if (
        Number(this.policy.deliver_package.not_delivered_fee.fee) < 10000
      ) {
        message.error("Số tiền không giao được nhỏ hơn 10,000đ.");
        return false;
      } else if (
        Number(this.policy.deliver_package.not_delivered_fee.fee) > 20000000
      ) {
        message.error("Số tiền không giao được lớn hơn 20,000,000đ.");
        return false;
      }
      return true;
    },
    setPolicyData() {
      const data = this.$store.state.shop.policyShopInfo;
      if (data) {
        this.policy = {
          deliver_package: {
            checking_service: data?.deliver_package?.checking_service || 0,
            try_on_service: data?.deliver_package?.try_on_service || 0,
            calling_service: data?.deliver_package?.calling_service || 0,
            partial_shipment_item_selecting:
              data?.deliver_package?.partial_shipment_item_selecting || 0,
            partial_shipment_item_returning:
              data?.deliver_package?.partial_shipment_item_returning || 0,
            not_delivered_fee: data?.deliver_package?.not_delivered_fee,
            allow_cod_change_pick_money:
              data?.deliver_package?.allow_cod_change_pick_money || 0,
          },
          fee: {
            is_freeship: data?.fee?.is_freeship === 1,
          },
        };
        this.policy.deliver_package.not_delivered_fee = {
          ...data?.deliver_package?.not_delivered_fee,
          fee: data?.deliver_package?.not_delivered_fee.fee || 0,
        };
        this.initObjectPolicy.deliver_package = {
          ...this.policy.deliver_package,
          not_delivered_fee: {
            ...this.policy.deliver_package.not_delivered_fee,
          },
        };
        this.initObjectPolicy.fee = {
          ...this.policy.fee,
        };
      }
    },
    async handleSubmit() {
      if (!this.handleCheckChangePolicy()) {
        if (!this.loading) {
          this.loading = true;
          this.policy.fee = {
            is_freeship: this.policy.fee.is_freeship === true ? 1 : 0,
          };
          if (
            this.policy.deliver_package.checking_service === 0 &&
            this.policy.deliver_package.try_on_service === 0
          ) {
            this.policy.deliver_package.not_allow_checking_service = 1;
          }
          if (this.policy.deliver_package.not_delivered_fee.is_selected === 0) {
            this.policy.deliver_package.not_delivered_fee.fee = 0;
          }
          try {
            const response = await policyInfoService.savePolicy({
              policy: this.policy,
            });
            if (response.data.success) {
              message.success(
                response.data.message || "Cập nhật cấu hình thành công!"
              );
            } else {
              message.error(
                response.data.message || "Đã có lỗi xảy ra, vui lòng thử lại!"
              );
            }
            await this.$store.dispatch("shop/getShopConfig");
            this.setPolicyData();
          } catch (error) {
            message.error("Đã có lỗi xảy ra, vui lòng thử lại sau.");
          }
          this.loading = false;
        }
      } else {
        message.warn("Dữ liệu không thay đổi");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.shop-policy-info {
  &__checkbox {
    margin: 20px 0 0 0;
  }
  .checkbox {
    margin-right: 10px;
  }
  .tag-key-19 {
    display: flex;
    align-items: center;
  }
}
</style>
<style lang="scss">
.shop-policy-info {
  label.ant-checkbox-wrapper.g-checkbox.size-undefined {
    display: flex;
    align-items: center;
  }
  .ant-checkbox-wrapper {
    font-size: 16px;
  }
  .ant-checkbox-inner {
    width: 20px;
    height: 20px;
    border-radius: 5px;
  }
  span.notify-free.t-underline.t-text-primary {
    width: 100px;
  }
  span.ant-checkbox {
    margin-top: 2px;
  }
  .g-input__wrapper {
    height: 30px;
    .g-input {
      min-height: 0;
      padding: 0;
      text-align: end;
    }
  }
}
.button-policy-save {
  height: 100% !important;
  background-color: #069255;
  color: #ffffff !important;
  &:hover,
  &:focus {
    background-color: #069255;
    color: #ffffff !important;
  }
}
</style>
