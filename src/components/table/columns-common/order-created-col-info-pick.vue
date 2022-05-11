<template>
  <div class="channel__item-col channel__item-info-pick">
    <div>
      <b>{{ session?.alias }}</b>
    </div>
    <div v-if="session?.pick_address_name">
      Kho lấy hàng: {{ session?.pick_address_name }}
    </div>
    <div v-else>Kho lấy hàng: Chưa xác định</div>
    <div>
      <span>Nhân viên lấy hàng:</span>
      <div v-if="!session?.cod_phone" class="cod-info">Chưa xác định</div>
      <div v-else class="cod-info">
        <img :src="session?.cod_avatar" />
        <span>{{ session?.cod_name }}</span> /
        <hidden-content :text="session?.cod_phone" :first="3" :last="3" />
      </div>
    </div>
    <div v-if="session?.alias">
      <span> Thời gian lấy: </span>
      <g-multiselect
        :width="300"
        :forceHide="!item.isEdit"
        class="filter-select-wrapper"
        :showApplyToAllChecked="false"
      >
        <template #contentDropdown>
          <div
            @click="handleOpen"
            class="input-pick_time"
            :class="{ 'disable-div': !item.isEdit }"
          >
            <div class="pick-time-created">
              <div class="pick-time-created-slot">
                {{ item?.pick_time_slot || "0-0h" }}
              </div>
              <div class="pick-time-created-date">
                {{ item?.date_to_delay_pick || "0-0-0" }}
              </div>
              <div class="arrow-right" />
            </div>
          </div>
        </template>
        <template #contentOption>
          <option-item
            v-if="listOptionToday.length > 0"
            :title="todayText"
            :options="listOptionToday"
            :checked-list="checkList"
            @onChange="updateCheckList($event, listOptionToday, todayText)"
            :showAll="true"
          />
          <option-item
            v-if="listOptionTomorrow.length > 0"
            :title="tomorrowText"
            :options="listOptionTomorrow"
            :checked-list="checkList"
            @onChange="
              updateCheckList($event, listOptionTomorrow, tomorrowText)
            "
            :showAll="true"
          />
        </template>
      </g-multiselect>
    </div>
    <div v-else>
      <span> Thời gian lấy: Chưa xác định</span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Components
import { HiddenContent } from "@/components";
import GMultiselect from "@/components/base/Multiselect";
import OptionItem from "@/components/filter/filter-common/filter-pick-time-fix/OptionItem";

// Mixin
import pickTime from "@/plugins/mixins/pickTime";

// Util
import { formatDayTime } from "@/utils/date";

export default defineComponent({
  name: "order-created-col-info-pick",
  props: {
    orderId: String,
    session: Object,
    item: Object,
  },
  data() {
    return {
      firstOpen: false,
      listOptionToday: [],
      listOptionTomorrow: [],
      checkList: [],
    };
  },
  mixins: [pickTime],
  components: {
    HiddenContent,
    GMultiselect,
    OptionItem,
  },
  computed: {
    todayText() {
      return formatDayTime(new Date());
    },
    tomorrowText() {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return formatDayTime(tomorrow);
    },
  },
  methods: {
    updateCheckList(data, options, textDay) {
      if (data.length === 1) {
        this.checkList = [Number(data[0])];
      } else if (data.length === 0) {
        this.checkList = [];
      } else {
        const x = data.filter((item) => item !== this.checkList[0]);
        this.checkList = [Number(x[0])];
      }

      if (this.checkList.length > 0) {
        const option = options.find((item) => item.value === this.checkList[0]);
        this.$emit("onChange", {
          data: this.getParamUpdate({ ...option, textDay }),
          key: "pick_time",
        });
      }
    },
    getParamUpdate(pickTime) {
      const dates = pickTime.textDay.split("-");
      return {
        data: {
          pick_time_slot_text: pickTime.text.split(" ")[0],
          pick_time_slot: pickTime.id,
          pick_work_shift: this.getPickTimeWorkShift(pickTime.type),
          pick_date: `${dates[2]}-${dates[1]}-${dates[0]}`,
        },
        params: {
          pick_time_slot: pickTime.id,
          pick_work_shift: this.getPickTimeWorkShift(pickTime.type),
          pick_date: `${dates[2]}-${dates[1]}-${dates[0]}`,
        },
      };
    },
    getPickTimeWorkShift(type) {
      if (type.includes("sang")) return 1;
      if (type.includes("chieu")) return 2;
      if (type.includes("toi")) return 3;
    },
    convertDataPickTime(pickTimes) {
      const today = [];
      const tomorrow = [];
      pickTimes.forEach((item) => {
        if (item?.type.includes("nay")) {
          today.push(item);
        }
        if (item?.type.includes("mai")) {
          tomorrow.push(item);
        }
      });
      return {
        today,
        tomorrow,
      };
    },
    async handleOpen() {
      const warehouse = {
        province_id: this.session?.province_id,
        district_id: this.session?.district_id,
      };
      const products = this.item.products;

      if (
        !this.firstOpen &&
        this.session?.province_id &&
        this.session?.district_id
      ) {
        this.firstOpen = true;
        // Call API to update listOptionPickTime.
        const pickTimes = await this.handleBrowsePickTimes({
          warehouse,
          products,
        });
        const { tomorrow, today } = this.convertDataPickTime(pickTimes.pickup);
        this.listOptionToday = today;
        this.listOptionTomorrow = tomorrow;
        console.log(this.listOptionToday, this.listOptionTomorrow);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.input-pick_time {
  display: inline-block;
}
.pick-time-created {
  position: relative;
  display: inline-block;
  &-slot {
    margin-left: 10px;
    width: 100px;
    display: inline-block;
    border-bottom: 1px solid #e0e0e0;
    text-align: center;
  }
  &-date {
    margin-left: 10px;
    width: 100px;
    display: inline-block;
    border-bottom: 1px solid #e0e0e0;
    text-align: center;
  }
}
</style>

<style lang="scss">
.channel__item-info-pick {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  > div {
    margin: 10px 0;
  }
  .cod-info {
    display: inline-block;
    margin-left: 5px;
    img {
      width: 25px;
      height: 25px;
      border-radius: 50px;
      margin-right: 5px;
    }
  }
}
</style>
