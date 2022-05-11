<template>
  <g-multiselect class="filter-select-wrapper" :width="165" :maxHeight="300">
    <template #contentDropdown>
      <g-select
        class="filter-select"
        placeholder="Ca lấy"
        :style="{ width: '84px', textAlign: 'center' }"
        :options="fullOption"
        :open="false"
        :value="getText"
      ></g-select>
    </template>
    <template #contentOption>
      <div>
        <option-item
          title="Sáng nay"
          :options="morning"
          :checked-list="morningToday"
          @onChange="updateCheckList($event, 'morningToday')"
        />
        <option-item
          title="Chiều nay"
          :options="afternoon"
          :checked-list="afternoonToday"
          @onChange="updateCheckList($event, 'afternoonToday')"
        />
        <option-item
          title="Tối nay"
          :options="dark"
          :checked-list="darkToday"
          @onChange="updateCheckList($event, 'darkToday')"
        />

        <option-item
          title="Sáng mai"
          :options="morning"
          :checked-list="morningTomorrow"
          @onChange="updateCheckList($event, 'morningTomorrow')"
        />
        <option-item
          title="Chiều mai"
          :options="afternoon"
          :checked-list="afternoonTomorrow"
          @onChange="updateCheckList($event, 'afternoonTomorrow')"
        />
        <option-item
          title="Tối mai"
          :options="dark"
          :checked-list="darkTomorrow"
          @onChange="updateCheckList($event, 'darkTomorrow')"
        />
        <g-checkbox
          v-model:checked="other"
          class="check-box-all"
          @change="onCheckOtherChange"
        >
          Khác
        </g-checkbox>
      </div>
    </template>
  </g-multiselect>
</template>

<script>
import { forEach } from "lodash";

// Components
import OptionItem from "@/components/filter/filter-common/filter-pick-time-fix/OptionItem";
import GSelect from "@/components/base/SelectBoxInTable";
import GMultiselect from "@/components/base/Multiselect";
import GCheckbox from "@/components/elements/checkbox";

export default {
  name: "filter-pick-time-fix",
  components: {
    OptionItem,
    GSelect,
    GCheckbox,
    GMultiselect,
  },
  beforeMount() {
    this.fullOption = this.getFullOption();
  },
  computed: {
    getText() {
      const checkedList = this.getCheckList(
        this.morningToday,
        this.afternoonToday,
        this.darkToday,
        this.morningTomorrow,
        this.afternoonTomorrow,
        this.darkTomorrow
      );

      if (this.other) {
        return "Khác";
      }

      if (checkedList.length === 1) {
        const option = this.fullOption.find(
          (item) => item.value === checkedList[0]
        ) || { label: "" };
        return option.label;
      }
      if (
        checkedList.length === this.fullOption.length &&
        this.fullOption.length > 0
      ) {
        return "Tất cả";
      }
      if (checkedList.length > 0) {
        return `${checkedList.length} ca lấy`;
      }
      return null;
    },
  },
  data() {
    return {
      fullOption: [],
      morning: [
        {
          label: "7 - 8h",
          value: "7_8",
        },
        {
          label: "8 - 9h",
          value: "8_9",
        },
        {
          label: "9 - 10h",
          value: "9_10",
        },
        {
          label: "10 - 11h",
          value: "10_11",
        },
        {
          label: "11 - 12h",
          value: "11_12",
        },
      ],
      afternoon: [
        {
          label: "12 - 13h",
          value: "12_13",
        },
        {
          label: "13 - 14h",
          value: "13_14",
        },
        {
          label: "14 - 15h",
          value: "14_15",
        },
        {
          label: "15 - 16h",
          value: "15_16",
        },
        {
          label: "16 - 17h",
          value: "16_17",
        },
        {
          label: "17 - 18h",
          value: "17_18",
        },
      ],
      dark: [
        {
          label: "18 - 19h",
          value: "18_19",
        },
        {
          label: "19 - 20h",
          value: "19_20",
        },
        {
          label: "20 - 21h",
          value: "20_21",
        },
        {
          label: "21 - 22h",
          value: "21_22",
        },
      ],
      morningToday: [],
      afternoonToday: [],
      darkToday: [],
      morningTomorrow: [],
      afternoonTomorrow: [],
      darkTomorrow: [],
      other: false,
    };
  },
  methods: {
    getCheckList(
      morningToday = [],
      afternoonToday = [],
      darkToday = [],
      morningTomorrow = [],
      afternoonTomorrow = [],
      darkTomorrow = []
    ) {
      const checkList = [];
      forEach(morningToday, (item) => {
        checkList.push(`${item}:sang_nay`);
      });

      forEach(afternoonToday, (item) => {
        checkList.push(`${item}:chieu_nay`);
      });

      forEach(darkToday, (item) => {
        checkList.push(`${item}:toi_nay`);
      });

      forEach(morningTomorrow, (item) => {
        checkList.push(`${item}:sang_mai`);
      });

      forEach(afternoonTomorrow, (item) => {
        checkList.push(`${item}:chieu_mai`);
      });

      forEach(darkTomorrow, (item) => {
        checkList.push(`${item}:toi_mai`);
      });

      return checkList;
    },
    updateCheckList(data, key) {
      this[key] = data;
      const checkList = this.getCheckList(
        this.morningToday,
        this.afternoonToday,
        this.darkToday,
        this.morningTomorrow,
        this.afternoonTomorrow,
        this.darkTomorrow
      );

      if (checkList.length > 0) {
        this.other = false;
      }

      this.$emit("onChange", checkList);
    },
    getFullOption() {
      const listType = [
        {
          title: "Sáng nay",
          value: "sang_nay",
        },
        {
          title: "Chiều nay",
          value: "chieu_nay",
        },
        {
          title: "Tối nay",
          value: "toi_nay",
        },
        {
          title: "Sáng mai",
          value: "sang_mai",
        },
        {
          title: "Chiều mai",
          value: "chieu_mai",
        },
        {
          title: "Tối mai",
          value: "toi_mai",
        },
      ];
      const listFull = [];
      listType.forEach((item) => {
        if (item.value.includes("sang")) {
          forEach(this.morning, (x) => {
            listFull.push({
              value: `${x.value}:${item.value}`,
              label: `${x.label} ${item.title}`,
            });
          });
        } else if (item.value.includes("chieu")) {
          forEach(this.afternoon, (x) => {
            listFull.push({
              value: `${x.value}:${item.value}`,
              label: `${x.label} ${item.title}`,
            });
          });
        } else if (item.value.includes("toi")) {
          forEach(this.dark, (x) => {
            listFull.push({
              value: `${x.value}:${item.value}`,
              label: `${x.label} ${item.title}`,
            });
          });
        }
      });

      return listFull;
    },
    onCheckOtherChange() {
      if (this.other) {
        this.morningToday = [];
        this.afternoonToday = [];
        this.darkToday = [];
        this.morningTomorrow = [];
        this.afternoonTomorrow = [];
        this.darkTomorrow = [];
        this.$emit("onChange", ["other"]);
      } else {
        this.$emit("onChange", []);
      }
    },
  },
};
</script>

<style scoped></style>
