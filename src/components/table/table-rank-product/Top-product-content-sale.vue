<template>
  <div class="flex top-product-content t-justify-between">
    <div class="ranking flex">
      <h1
        :class="type === 'top_selling' ? 'rank-green' : 'rank-red'"
        class="t-mb-1"
      >
        <b class="ranking-number t-pr-5">{{ rank }}</b>
      </h1>
      <div
        class="image-default"
        :style="{
          backgroundImage: `url(${
            product.img_path === '' ? orderDefaultImage : product.img_path
          }`,
        }"
      ></div>
    </div>
    <div class="t-w-full">
      <div class="info-order">
        <div class="flex order-name t-text-base t-justify-between t-pl-2">
          <div class="t-max-w-[400px]">
            <p class="t-mb-2 t-break-all t-font-medium">
              {{ product.title }}
            </p>
          </div>
          <div class="change-rate-product flex">
            <p>
              <vue3-autocounter
                :startAmount="0"
                :endAmount="product.quantity"
                :suffix="' SP'"
                :duration="1"
              />
            </p>
            <p class="t-pl-2 t-text-primary">{{ product.rate }}</p>
          </div>
        </div>
      </div>
      <div class="flex t-items-center t-justify-between">
        <div class="order-rate t-text-sm t-text-faded t-pl-2">
          <p class="t-mb-1">
            <vue3-autocounter
              :startAmount="0"
              :endAmount="calPercent()"
              :suffix="'%'"
              :duration="1"
            />
          </p>
          <p class="t-mb-1">
            {{ type === "top_selling" ? "Giao thành công" : "Hoàn hủy" }}
          </p>
        </div>
        <div class="border-top-table-content t-mr-6 t-ml-3"></div>
        <div class="man-rate t-text-sm t-text-faded">
          <p class="t-mb-1">
            <vue3-autocounter
              :startAmount="0"
              :endAmount="
                product.male == 0 && product.female == 0
                  ? '0'
                  : (product.male / (product.male + product.female)) * 100
              "
              :suffix="'%'"
              :duration="1"
            />
          </p>
          <p class="t-mb-1">Nam</p>
        </div>
        <div class="border-top-table-content t-mr-6 t-ml-6"></div>
        <div class="woman-rate t-text-sm t-text-faded">
          <vue3-autocounter
            :startAmount="0"
            :endAmount="
              product.male == 0 && product.female == 0
                ? '0'
                : (product.female / (product.male + product.female)) * 100
            "
            :suffix="'%'"
            :duration="1"
          />
          <p class="t-mb-1">Nữ</p>
        </div>
        <div class="border-top-table-content t-mr-7 t-ml-6"></div>
        <div class="ellipse-rate t-text-sm t-text-faded">
          <p class="t-mb-2">
            <vue3-autocounter
              :startAmount="0"
              :endAmount="
                type === 'top_selling' ? product.is_blue : product.is_purple
              "
              :duration="1"
            />
          </p>
          <div
            :class="type === 'top_selling' ? 'ellipse-green' : 'ellipse-violet'"
            class="t-mb-2 ellipse-product"
          ></div>
        </div>
        <div class="border-top-table-content t-mr-7 t-ml-7"></div>
        <div class="flag-rate t-text-base">
          <p class="t-mb-2 t-text-sm t-text-faded">
            <vue3-autocounter
              :startAmount="0"
              :endAmount="
                type === 'top_selling'
                  ? product.good_report
                  : product.bad_report_public
              "
              :duration="1"
            />
          </p>
          <div
            class="t-mb-2 t-ml-1 flag-product t-mr-7"
            :style="{
              backgroundImage: `url(${type === 'top_selling' ? flag : flagRed}`,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderDefaultImage from "@/assets/images/default_product.svg";
import flag from "@/assets/icons/flag_green.svg";
import flagRed from "@/assets/icons/flag_red.svg";
import Vue3Autocounter from "vue3-autocounter";

export default {
  name: "TopProductContent",
  data() {
    return {
      orderDefaultImage,
      flag,
      flagRed,
    };
  },
  props: {
    product: Object,
    type: String,
    rank: Number,
  },
  components: {
    Vue3Autocounter,
  },
  methods: {
    calPercent() {
      if (this.product.total === 0) {
        return 0;
      } else if (this.type === "top_selling") {
        return (this.product.total_success / this.product.total) * 100;
      } else {
        return (this.product.total_return / this.product.total) * 100;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
b {
  font-weight: 500;
}
.rank-green {
  -webkit-text-stroke-color: #069255;
}
.ranking-number {
  font-family: Roboto;
  font-style: normal;
  color: #fff;
  -webkit-text-stroke-width: 2px;
  flex: none;
  order: 0;
  flex-grow: 0;
}
.rank-red {
  -webkit-text-stroke-color: #eb5757;
}
.image-default {
  display: block;
  width: 60px;
  height: 60px;
  background-size: 60px 60px;
  border-radius: 40px;
  align-self: center;
}
.border-top-table-content {
  width: 1px;
  height: 24px;
  background-color: #e0e0e0;
  margin-bottom: 14px;
}
.flag-product {
  display: block;
  width: 9px;
  height: 12px;
}
.ellipse-product {
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 8px;
  margin-left: 2px;
}
.ellipse-green {
  background-color: #00904a;
}
.ellipse-violet {
  background-color: #7f007f;
}
.info-order {
  width: 100%;
  p {
    margin-bottom: 0.5rem !important;
  }
}
.ranking {
  align-self: center;
}
</style>
