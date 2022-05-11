<template>
  <main-content>
    <template #main>
      <div class="notiPage-account">
        <h3 class="t-text-[18px] t-font-medium t-mb-[10px]">
          Cài đặt thông báo
        </h3>
        <div class="notiPage-account t-flex t-flex-col">
          <g-checkbox
            @change="onChangeCheckboxSms"
            v-model:checked="shopInfo.receive_sms_cod"
          >
            <div :style="{ display: 'inline-block' }">
              Nhận tin nhắn xác nhận lấy hàng
            </div>
          </g-checkbox>
          <g-checkbox
            @change="onChangeCheckboxEmail"
            v-model:checked="shopInfo.subcribe_report"
          >
            <div :style="{ display: 'inline-block' }">
              Nhận email báo cáo từ GHTK
            </div>
          </g-checkbox>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="button t-flex t-items-center t-justify-end t-w-full">
        <button
          class="button-save t-rounded-[5px] t-py-[8px] t-px-[30px] t-bg-[#00904A] t-text-[#fff]"
        >
          Lưu thay đổi
        </button>
      </div>
    </template>
  </main-content>
</template>

<script>
import MainContent from "./main-content.vue";
// import { GCheckbox } from "@/components/elements";
import GCheckbox from "@/components/elements/checkbox";
import { message } from "ant-design-vue";
import notificationService from "@/services/notification.service";
import { mapState } from "vuex";

export default {
  components: {
    GCheckbox,
    MainContent,
  },
  // mounted() {
  //   setTimeout(() => {
  //     this.initData();
  //   }, 500);
  // },
  data() {
    return {
      isChecked: {
        sms: false,
        email: false,
      },
    };
  },
  computed: {
    ...mapState({
      shopInfo: (state) => state.shop.Shop,
    }),
  },
  methods: {
    // initData() {
    //   this.isChecked.sms = this.shopInfo?.receive_sms_cod === 1 ? true : false;
    //   this.isChecked.email = this.shopInfo?.subcribe_report;
    // },
    async onChangeCheckboxSms(e) {
      this.codeApi = e.target.checked === true ? 1 : 0;
      try {
        const response = await notificationService.receiveSms(
          JSON.stringify({
            receive_sms_cod: this.codeApi,
          })
        );
        if (response.data.success) {
          message.success(response.data.message);
          this.$store.commit("shop/setCheckReceiveSms", this.codeApi);
        }
      } catch (error) {
        console.log(error);
        message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
        this.loading = false;
      }
    },
    async onChangeCheckboxEmail(e) {
      this.codeApi = e.target.checked === true ? 1 : 0;
      try {
        const response = await notificationService.receiveEmail(
          JSON.stringify({
            subscribe_report: this.codeApi,
          })
        );
        if (response.data.success) {
          message.success(response.data.message);
          this.$store.commit("shop/setCheckSubcribeReport", e.target.checked);
        }
      } catch (error) {
        console.log(error);
        message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.notiPage-account {
  &__checkbox {
    margin: 20px 0 0 0;
  }
}
</style>
<style lang="scss">
.notiPage-account {
  .ant-checkbox-wrapper {
    font-size: 16px;
  }
  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin: 15px 0 0 0;
  }
  .ant-checkbox-inner {
    width: 20px;
    height: 20px;
  }
}
</style>
