<template>
  <div class="flex top-area-content t-justify-between">
    <div class="ranking">
      <h1
        :class="type === 'top_selling' ? 'rank-green' : 'rank-red'"
        class="t-mb-1"
      >
        <b class="ranking-number t-pr-5">{{ rank }}</b>
      </h1>
    </div>
    <div class="t-w-full">
      <div class="info-order">
        <div class="flex order-name t-text-base t-justify-between">
          <p class="t-mb-2">
            <b>{{ area.name }}</b>
          </p>
          <div class="change-rate-product flex">
            <p>
              <vue3-autocounter
                :startAmount="0"
                :endAmount="area.quantity"
                :suffix="' ĐH'"
                :duration="1"
              />
            </p>
            <p class="t-pl-2 t-pr-2 t-text-primary t-text-14 t-leading-4.5">
              {{ area.rate }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex t-items-center t-justify-between">
        <div class="order-rate t-text-sm t-text-faded">
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
                area.male == 0 && area.female == 0
                  ? '0'
                  : (area.male / (area.male + area.female)) * 100
              "
              :suffix="'%'"
              :duration="1"
            />
          </p>
          <p class="t-mb-1">Nam</p>
        </div>
        <div class="border-top-table-content t-mr-6 t-ml-6"></div>
        <div class="woman-rate t-text-sm t-text-faded">
          <p class="t-mb-1">
            <vue3-autocounter
              :startAmount="0"
              :endAmount="
                area.male == 0 && area.female == 0
                  ? '0'
                  : (area.female / (area.male + area.female)) * 100
              "
              :suffix="'%'"
              :duration="1"
            />
          </p>
          <p class="t-mb-1">Nữ</p>
        </div>
        <div class="border-top-table-content t-mr-6 t-ml-6"></div>
        <div class="ellipse-rate t-text-sm t-text-faded">
          <p class="t-mb-1">
            <vue3-autocounter
              :startAmount="0"
              :endAmount="
                type === 'top_selling' ? area.is_blue : area.is_purple
              "
              :duration="1"
            />
          </p>
          <div
            :class="type === 'top_selling' ? 'ellipse-green' : 'ellipse-violet'"
            class="t-mb-2 ellipse-area"
          ></div>
        </div>
        <div class="border-top-table-content t-mr-6 t-ml-6"></div>
        <div class="flag-rate t-text-base">
          <p class="t-mb-1 t-text-sm t-text-faded">
            <vue3-autocounter
              :startAmount="0"
              :endAmount="
                type === 'top_selling'
                  ? area.good_report
                  : area.bad_report_public
              "
              :duration="1"
            />
          </p>
          <div
            class="t-mb-2 flag-area t-mr-10"
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
import flag from "@/assets/icons/flag_green.svg";
import flagRed from "@/assets/icons/flag_red.svg";
import Vue3Autocounter from "vue3-autocounter";

export default {
  name: "TopAreaContent",
  data() {
    return {
      flag,
      flagRed,
    };
  },
  components: {
    Vue3Autocounter,
  },
  props: {
    area: Object,
    type: String,
    rank: Number,
  },

  methods: {
    calPercent() {
      if (this.area.total === 0) {
        return 0;
      } else if (this.type === "top_selling") {
        return (this.area.total_success / this.area.total) * 100;
      } else {
        return (this.area.total_return / this.area.total) * 100;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
b {
  font-weight: 500;
}
.top-area-content {
  align-items: flex-end;
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
.flag-area {
  display: block;
  width: 9px;
  height: 12px;
  margin-left: 4px;
}
.ellipse-area {
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 8px;
  background-color: #00904a;
  margin-left: 2px;
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
</style>
