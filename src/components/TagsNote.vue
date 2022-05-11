<template>
  <div>
    <a-row :gutter="[8, 8]" align="middle" class="form-item">
      <a-col v-for="item in listTags" :key="item.value">
        <a-tooltip>
          <template #title>
            <div>
              {{ item.payload.note || item.label }}
            </div>
          </template>
          <g-button
            style="height: 25px; border-radius: 20px"
            :disabled="item.label === 'Giá trị cao'"
            @click="onSelectTag(item)"
            :type="tags.includes(item.value) ? 'primary' : 'outlined'"
          >
            {{ item.label }}
          </g-button>
        </a-tooltip>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import GButton from "@/components/common/GButton";
import { filter } from "lodash";

const TCID = 10000;

export default {
  name: "TagsNote",
  components: {
    GButton,
  },
  props: {
    serviceData: {
      type: String,
    },
    packageLabels: {
      type: Array,
    },
    tags: {
      type: Array,
      default() {
        return [TCID];
      },
    },
  },
  computed: {
    listTags() {
      return filter(this.packageLabels, (x) => {
        if (this.serviceData === "Express") {
          return x.label !== "Gia cố hàng hóa";
        }
        return true;
      });
    },
  },
  methods: {
    onSelectTag(item) {
      this.$emit("onSelectTag", item);
    },
  },
};
</script>

<style scoped></style>
