<template>
  <div class="t-px-4 t-pt-4">
    <div class="2xl:t-flex t-justify-between">
      <div class="flex align-items-center t-w-full 2xl:w-1/2">
        <h2 class="t-mr-2 mb-0 item-title"><b>Tổng quan</b></h2>
        <live-signal />
        <span class="ml"> Live - {{ currentTime }}</span>
      </div>

      <filterTime class="t-w-full 2xl:w-1/2" />
    </div>
    <div class="t-flex t-flex-wrap">
      <div class="t-w-1/2 3xl:t-w-1/4">
        <Fieldset>
          <template #title>
            <span>Phát sinh</span>
          </template>
          <template #content>
            <div class="t-pt-4 infoField-container">
              <div v-if="loading" class="skeleton-fieldset">
                <g-skeleton-text
                  :active="true"
                  :width="'60%'"
                  class="t-pt-4 t-pl-4"
                />
                <g-skeleton-text
                  :active="true"
                  :width="'60%'"
                  class="t-pt-4 t-pl-4"
                />
                <g-skeleton-text
                  :active="true"
                  :width="'80%'"
                  class="t-pt-4 t-pl-4"
                />
              </div>
              <div v-else>
                <InfoFieldSet
                  text="ĐH"
                  :currentValue="dataState.current.incurred.count_packages"
                  :pastValue="dataState.past.incurred.count_packages"
                />
                <InfoFieldSet
                  :currentValue="dataState.current.incurred.count_products"
                  :pastValue="dataState.past.incurred.count_products"
                  text="SP"
                />
                <InfoFieldSet
                  :currentValue="dataState.current.incurred.total_COD"
                  :pastValue="dataState.past.incurred.total_COD"
                  text="CoD"
                  suffix=" đ"
                />
              </div>
            </div>
          </template>
        </Fieldset>
      </div>
      <div class="t-w-1/2 3xl:t-w-1/4">
        <Fieldset>
          <template #title>
            <span>Thành công</span>
          </template>
          <template #content>
            <div class="t-pt-4 infoField-container">
              <div v-if="loading" class="skeleton-fieldset">
                <g-skeleton-text
                  :active="true"
                  :width="'60%'"
                  class="t-pt-4 t-pl-4"
                />
                <g-skeleton-text
                  :active="true"
                  :width="'60%'"
                  class="t-pt-4 t-pl-4"
                />
                <g-skeleton-text
                  :active="true"
                  :width="'80%'"
                  class="t-pt-4 t-pl-4"
                />
              </div>
              <div v-else>
                <InfoFieldSet
                  text="ĐH"
                  :currentValue="dataState.current.delivered.count_packages"
                  :pastValue="dataState.past.delivered.count_packages"
                />
                <InfoFieldSet
                  :currentValue="dataState.current.delivered.count_products"
                  :pastValue="dataState.past.delivered.count_products"
                  text="SP"
                />
                <InfoFieldSet
                  :currentValue="dataState.current.delivered.total_COD"
                  :pastValue="dataState.past.delivered.total_COD"
                  text="CoD"
                  suffix=" đ"
                />
              </div>
            </div>
          </template>
        </Fieldset>
      </div>
      <div class="t-w-1/2 3xl:t-w-1/4">
        <Fieldset>
          <template #title>
            <span>Đang giao</span>
          </template>
          <template #content>
            <div class="t-pt-4 infoField-container">
              <div v-if="loading" class="skeleton-fieldset">
                <g-skeleton-text
                  :active="true"
                  :width="'60%'"
                  class="t-pt-4 t-pl-4"
                />
                <g-skeleton-text
                  :active="true"
                  :width="'60%'"
                  class="t-pt-4 t-pl-4"
                />
                <g-skeleton-text
                  :active="true"
                  :width="'80%'"
                  class="t-pt-4 t-pl-4"
                />
              </div>
              <div v-else>
                <InfoFieldSet
                  text="ĐH"
                  :currentValue="dataState.current.delivering.count_packages"
                  :pastValue="dataState.past.delivering.count_packages"
                />
                <InfoFieldSet
                  :currentValue="dataState.current.delivering.count_products"
                  :pastValue="dataState.past.delivering.count_products"
                  text="SP"
                />
                <InfoFieldSet
                  :currentValue="dataState.current.delivering.total_COD"
                  :pastValue="dataState.past.delivering.total_COD"
                  text="CoD"
                  suffix=" đ"
                />
              </div>
            </div>
          </template>
        </Fieldset>
      </div>
      <div class="t-w-1/2 3xl:t-w-1/4">
        <Fieldset>
          <template #title>
            <span>Phí vận chuyển</span>
          </template>
          <template #content>
            <div class="t-pt-4 infoField-container">
              <div v-if="loading" class="skeleton-fieldset">
                <g-skeleton-text
                  :active="true"
                  :width="'80%'"
                  class="t-pt-4 t-pl-4"
                />
                <g-skeleton-text
                  :active="true"
                  :width="'80%'"
                  class="t-pt-4 t-pl-4"
                />
              </div>
              <div v-else>
                <template v-if="dataState">
                  <InfoFieldSet
                    text="Giao"
                    :currentValue="dataState.current.fee.ship_money"
                    :pastValue="dataState.past.fee.ship_money"
                    suffix=" đ"
                  />
                  <InfoFieldSet
                    :currentValue="dataState.current.fee.return_fee"
                    :pastValue="dataState.past.fee.return_fee"
                    text="Hoàn"
                    suffix=" đ"
                  />
                </template>
              </div>
            </div>
          </template>
        </Fieldset>
      </div>
    </div>

    <div class="t-w-full t-block 4xl:t-flex">
      <div class="t-w-full 4xl:t-w-1/2">
        <Fieldset>
          <template #title>
            <span>Đơn hoàn</span>
          </template>
          <template #content>
            <div class="pie-container">
              <div
                class="chart-pie"
                :class="
                  !isPieChartDataValid(pieChartData) && !loading
                    ? 't-relative'
                    : ''
                "
              >
                <!-- <div class="chart-pie">
                  <canvas id="chartCity1">
                    <PieChart
                      :idWrapper="'chartCity1'"
                      :legendWrapper="'city-legend1'"
                    ></PieChart>
                  </canvas>
                  <div id="city-legend1" class="legend-wrapper"></div>
                </div> -->
                <div
                  v-if="!isPieChartDataValid(pieChartData) && !loading"
                  class="t-text-center t-w-full"
                  :class="
                    !isPieChartDataValid(pieChartData) && !loading
                      ? 't-absolute t-top-1/2 t-text-center t-w-full'
                      : ''
                  "
                >
                  <p>Đang cập nhật dữ liệu</p>
                </div>
                <Pie
                  :series="pieChartData"
                  :key="range"
                  v-if="isPieChartDataValid(pieChartData) && !loading"
                ></Pie>
              </div>
              <div v-if="loading" class=""></div>
              <div class="value-refund-container" v-else>
                <Value
                  v-if="isPieChartDataValid(pieChartData) && !loading"
                  class="t-pb-10"
                  text="Đơn hàng"
                  :value="returnPackageData.current.total_packages || 0"
                  :percentage="returnPackageData.change.total_packages"
                />
                <Value
                  v-if="isPieChartDataValid(pieChartData)"
                  class="t-pt-20"
                  text="Tỷ lệ hoàn"
                  :value="returnPackageData.current.return_rate || 0 + '%'"
                  :percentagedecrease="
                    returnPackageData.change.return_rate || ''
                  "
                />
              </div>
            </div>
            <div class="reason-container t-pr-4 t-pl-4">
              <div v-if="loading" class="skeleton-fieldset">
                <g-skeleton-text
                  :active="true"
                  :width="'40%'"
                  class="t-pt-4 t-pl-6"
                />
                <g-skeleton-text
                  :active="true"
                  :width="'95%'"
                  class="t-pt-6 t-pl-6"
                />
                <g-skeleton-text
                  :active="true"
                  :width="'95%'"
                  class="t-pt-6 t-pl-6"
                />
                <g-skeleton-text
                  :active="true"
                  :width="'95%'"
                  class="t-pt-6 t-pl-6"
                />
                <g-skeleton-text
                  :active="true"
                  :width="'95%'"
                  class="t-pt-6 t-pl-6"
                />
                <g-skeleton-text
                  :active="true"
                  :width="'95%'"
                  class="t-pt-6 t-pl-6"
                />
              </div>
              <div v-else>
                <h2 class="t-text-lg mb-0">Từ chối nhận hàng</h2>
                <div class="reason-refund" style="margin-top: -6px">
                  <Reason
                    @click="
                      openReasonModal(),
                        ((this.currentRejectType = 'shop_cancel'),
                        (this.reasonTitle = 'Đơn shop hủy'))
                    "
                    text="Đơn shop hủy"
                    :value="
                      currentCustomerRejectData.shop_cancel.count_packages
                    "
                    :percentage="
                      percentChange(
                        currentCustomerRejectData.shop_cancel.count_packages,
                        pastCustomerRejectData.shop_cancel.count_packages
                      )
                    "
                  ></Reason>
                </div>
                <div class="reason-refund">
                  <Reason
                    @click="
                      openReasonModal(),
                        ((this.currentRejectType = 'cannot_contact'),
                        (this.reasonTitle = 'Không liên hệ được'))
                    "
                    text="Không liên hệ được"
                    :value="
                      currentCustomerRejectData.cannot_contact.count_packages
                    "
                    :percentage="
                      percentChange(
                        currentCustomerRejectData.cannot_contact.count_packages,
                        pastCustomerRejectData.cannot_contact.count_packages
                      )
                    "
                  ></Reason>
                </div>
                <div class="reason-refund">
                  <Reason
                    @click="
                      openReasonModal(),
                        ((this.currentRejectType = 'customer_reject'),
                        (this.reasonTitle = 'KH từ chối nhận'))
                    "
                    text="KH từ chối nhận"
                    :value="
                      currentCustomerRejectData.customer_reject.count_packages
                    "
                    :percentage="
                      percentChange(
                        currentCustomerRejectData.customer_reject
                          .count_packages,
                        pastCustomerRejectData.customer_reject.count_packages
                      )
                    "
                  ></Reason>
                </div>
                <div class="reason-refund">
                  <Reason
                    @click="
                      openReasonModal(),
                        ((this.currentRejectType = 'other_reasons'),
                        (this.reasonTitle = 'Hoàn vì lý do khác'))
                    "
                    text="Hoàn vì lý do khác"
                    :value="
                      currentCustomerRejectData.other_reasons.count_packages
                    "
                    :percentage="
                      percentChange(
                        currentCustomerRejectData.other_reasons.count_packages,
                        pastCustomerRejectData.other_reasons.count_packages
                      )
                    "
                  ></Reason>
                </div>
                <div class="reason-refund">
                  <Reason
                    @click="
                      openReasonModal(),
                        ((this.currentRejectType = 'export_exchange'),
                        (this.reasonTitle = 'Giao lại, Giao KH mới'))
                    "
                    style="box-shadow: none"
                    text="Giao lại, Giao KH mới"
                    :value="
                      currentCustomerRejectData.export_exchange.count_packages
                    "
                    :percentage="
                      percentChange(
                        currentCustomerRejectData.export_exchange
                          .count_packages,
                        pastCustomerRejectData.export_exchange.count_packages
                      )
                    "
                  ></Reason>
                </div>
              </div>
            </div>
          </template>
        </Fieldset>
      </div>
      <div class="t-w-full 4xl:t-w-1/2">
        <Fieldset class="t-h-full t-relative">
          <template #title>
            <span>Xu hướng hàng - tiền</span>
          </template>
          <template #content>
            <div class="title-line-chart t-text-primary t-font-normal">
              <p
                :class="toggleLine == true ? 'bgorder' : ''"
                v-on:click="toggleLineChart"
                tabindex="1"
                class="toggle-order"
                id="toggle-order-left"
                style="cursor: pointer"
              >
                <b>ĐH & SP</b>
              </p>
              <div class="border-title t-ml-4 t-mr-4"></div>
              <p
                :class="toggleLine == false ? 'bgfinance' : ''"
                v-on:click="toggleLineChart"
                tabindex="2"
                class="toggle-finance"
                id="toggle-order-right"
                style="cursor: pointer"
              >
                <b>Dòng tiền</b>
              </p>
            </div>
            <div class="chart-line">
              <LineOrder v-if="toggleLine == true" :key="range"></LineOrder>
              <LineFinance
                v-if="toggleLine == false"
                :key="range"
              ></LineFinance>
            </div>
          </template>
        </Fieldset>
      </div>
    </div>

    <div class="wrap-top-table t-w-full t-block 3xl:t-flex t-pb-6">
      <div class="t-w-full 3xl:t-w-1/2">
        <Product :loading="!loading" :key="range" class="t-pl-4" />
      </div>
      <div class="t-w-full 3xl:t-w-1/2">
        <Area :loading="!loading" class="t-pl-4" :key="range" />
      </div>
    </div>
  </div>
  <reason-modal
    :visible="visibleModal.Reason"
    :setVisible="setVisibleModal('Reason')"
    :packageIds="currentRejectPackage"
    :text="reasonTitle"
  ></reason-modal>
</template>

<script>
import reasonModal from "@/components/modal/ReasonModal.vue";
import liveSignal from "@/components/LiveSignal.vue";
import Fieldset from "@/components/fieldset/Fieldset.vue";
import Reason from "@/components/fieldset/Refund-reason.vue";
import Pie from "@/components/charts/pie-chart.vue";
// import PieChart from "@/components/home-charts/pie-chart-js.vue";
import Value from "@/components/charts/value-chart.vue";
import LineOrder from "@/components/charts/line-chart-order.vue";
import LineFinance from "@/components/charts/line-chart-finance.vue";
import InfoFieldSet from "@/components/fieldset/Info-fieldset.vue";
// import InfoSkeleton from "@/components/fieldset-home/Info-fieldset-skeleton.vue";
import Product from "@/components/table/table-rank-product/Top-product.vue";
import Area from "@/components/table/table-rank-area/Top-area.vue";
import filterTime from "@/components/fieldset/Filter-time.vue";
import { mapState } from "vuex";
import GSkeletonText from "@/components/elements/skeleton/text.vue";
// import formatPrice from "@/components/FormatPrice.vue";
import overviewService from "@/services/overview.service";
export default {
  components: {
    liveSignal,
    Fieldset,
    Reason,
    Pie,
    Value,
    LineOrder,
    LineFinance,
    InfoFieldSet,
    Product,
    Area,
    filterTime,
    // InfoSkeleton,
    GSkeletonText,
    // formatPrice,
    // PieChart,
    reasonModal,
  },
  computed: {
    ...mapState({
      currentTime: (state) => state.realtimeReport.currentTime,
      range: (state) => state.overview.query,
      returnPackageData: (state) => state.overview.returnPackageData,
    }),
    pieChartData() {
      return this.$store.getters["overview/getDataForPieChart"];
    },
    currentCustomerRejectData() {
      return this.$store.getters["overview/getCustomerRejectData"]("current");
    },
    pastCustomerRejectData() {
      return this.$store.getters["overview/getCustomerRejectData"]("past");
    },
    currentRejectPackage() {
      return this.$store.getters["overview/getCustomerRejectData"]("current")[
        this.currentRejectType
      ];
    },
  },
  data() {
    return {
      toggleLine: true,
      loading: true,
      currentRejectType: "break_product",
      reasonTitle: "Hàng lỗi, hỏng",
      visibleModal: {
        Reason: false,
      },
      packages: [],
      dataState: {
        current: {
          incurred: {
            count_packages: 0,
            total_COD: 0,
          },
          delivered: {
            count_packages: 0,
            total_COD: 0,
          },
          delivering: {
            count_packages: 0,
            total_COD: 0,
          },
          fee: {
            count_packages: 0,
            total_COD: 0,
          },
        },
        past: {
          incurred: {
            count_packages: 0,
            total_COD: 0,
          },
          delivered: {
            count_packages: 0,
            total_COD: 0,
          },
          delivering: {
            count_packages: 0,
            total_COD: 0,
          },
          fee: {
            count_packages: 0,
            total_COD: 0,
          },
        },
      },
    };
  },
  // props: {
  //   reason: String,
  //   text: String,
  // },
  methods: {
    openReasonModal() {
      this.visibleModal.Reason = true;
    },
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    getData() {
      this.packages = this.currentCustomerRejectData;
    },
    toggleLineChart(e) {
      if (
        e.target.attributes[0].ownerDocument.activeElement.id ==
        "toggle-order-left"
      ) {
        this.toggleLine = true;
      } else {
        this.toggleLine = false;
      }
    },
    async dataReturn() {
      try {
        let res = await overviewService.browseDashboard(
          this.$store.state.overview.query
        );
        if (res.data.success) {
          this.dataState.current = res.data.data.current;
          this.dataState.past = res.data.data.past;
        }
      } catch (e) {
        console.log(e);
      }
      this.loading = false;
    },
    percentChange(current, past) {
      if (current && past) {
        return (((current - past) / past) * 100)
          .toFixed(1)
          .replace(/\.?0+$/, "");
      }
      return 0;
    },
    isPieChartDataValid(series) {
      for (let i = 0; i < series.length; i++) {
        if (series[i] > 0) {
          return true;
        }
      }
      return false;
    },
  },
  created() {
    this.loading = true;
    const query = this.$store.state.overview.query;
    this.$store.dispatch("overview/getReturnPackageData", query);
    this.dataReturn();
    this.loading = false;
  },

  mounted() {
    this.$store.commit("overview/setQuery", {
      range: "7_day_before",
      type: "top_selling",
      from: "",
      to: "",
    });
  },

  watch: {
    "$store.state.overview.query": {
      handler() {
        this.loading = true;
        const query = this.$store.state.overview.query;
        this.$store.dispatch("overview/getReturnPackageData", query);
        this.dataReturn();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-pie {
  padding: 30px 0px 10px 0px;
  transform: translateX(-20px);
}

.container-fieldset {
  flex: 50%;
}
.chart-line {
  box-sizing: border-box;
  border-radius: 8px;
  min-height: 516px;
}
.chart-pie {
  min-height: 317px;
}
.wrap-chart {
  display: flex;
}

.pie-container {
  position: relative;
  .value-container {
    position: absolute;
    top: 50%;
    left: 170px;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
  }
}
.title-line-chart {
  display: flex;
  justify-content: center;
  padding-top: 43px;
  .border-title {
    width: 1px;
    height: 16px;
    background-color: gray;
    margin-top: 3px;
  }
}
b {
  font-weight: 500;
}
.bgorder {
  color: #000000;
}
.bgfinance {
  color: #000000;
}
</style>
