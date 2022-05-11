<template>
  <div class="channel__item-col channel__item-created-note">
    <g-input-in-table
      :class="{ 'disable-div': !item.isEdit }"
      :value="item.message"
    />
    <div class="list-tag-message">
      <div class="list-tag">
        <span
          class="item-tag"
          v-for="(item, index) in listTagSelected"
          :key="index"
        >
          <span>{{ item.label }}</span>
        </span>
      </div>
      <div class="option-tag">
        <g-multiselect :width="415" :height="180" class="filter-select-wrapper">
          <template #contentDropdown>
            <g-select
              :class="{ 'disable-div': !item.isEdit }"
              size="small"
              class="filter-select"
              :style="{ textAlign: 'center' }"
              :open="false"
              :options="expNotes"
              :value="selectionText"
            ></g-select>
          </template>
          <template #contentOption>
            <list-options
              :showAll="false"
              :options="expNotes"
              :checked-list-default="messagesData"
              @onChange="handleUpdateOrderMessage"
            >
              <template #label="{ option }">
                {{ option.text }}
              </template>
            </list-options>
            <div class="t-ml-2">
              <tags-note
                :tags="currenTags"
                :packageLabels="packageLabels"
                :serviceData="item?.transport_service"
                @onSelectTag="onSelectTag"
              />
            </div>
          </template>
        </g-multiselect>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Components
import GMultiselect from "@/components/base/Multiselect";
import ListOptions from "@/components/base/ListOptions";
import GSelect from "@/components/base/SelectBoxInTable";
import GInputInTable from "@/components/base/InputInTable";
import TagsNote from "@/components/TagsNote";
import { filter, find, forEach } from "lodash";

const TCID = 10000;

export default defineComponent({
  name: "order-created-col-note",
  components: {
    GSelect,
    TagsNote,
    GMultiselect,
    ListOptions,
    GInputInTable,
  },
  props: {
    orderId: String,
    item: Object,
    packageLabels: Array,
    expNotes: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      messagesData: [],
    };
  },
  computed: {
    currenTags() {
      let currentTag = this.item?.tags || [];
      if (currentTag.length === 0) {
        currentTag = [TCID];
      }
      return currentTag;
    },
    listTagSelected() {
      let listTag = this.packageLabels.filter((x) =>
        this.currenTags.includes(x.value)
      );

      let bigTag = find(this.packageLabels, (x) => x.label === "Giá trị cao");

      if (listTag.length === 1 && listTag[0].value === bigTag.value) {
        listTag = [{ value: TCID, label: "Tiêu chuẩn" }, ...listTag];
      }

      return listTag;
    },
    selectionText() {
      const tags = filter(this.currenTags, (x) => {
        if (this.item.transport_service === "Express") {
          const giacoTag = this.packageLabels.find(
            (item) => item.label === "Gia cố hàng hóa"
          );
          if (!giacoTag) return true;
          return giacoTag.value !== x;
        }
        return true;
      });
      return `Chọn (${this.messagesData.length + tags.length})`;
    },
  },
  methods: {
    handleUpdateOrderMessage(data) {
      // Tính toán thành message và call API.
      const notes = [];
      forEach(data.dataOptions, (item) => {
        notes.push(item.text);
      });

      this.$emit("onChange", {
        data: {
          data: { notes },
          params: {
            note: {
              message: notes,
              replace_all: 1,
            },
          },
        },
        key: "note",
      });
    },
    onSelectTag(item) {
      let tieuChuanTag = find(
        this.packageLabels,
        (x) => x.label === "Tiêu chuẩn"
      );

      let bigTag = find(this.packageLabels, (x) => x.label === "Giá trị cao");

      // Loại bỏ tag tiêu chuẩn trước.
      let tags = this.currenTags.filter(
        (_item) => _item !== tieuChuanTag.value
      );

      if (tieuChuanTag.value === item.value) {
        // nếu có big tag thì add thêm big tag.
        // Nếu chọn tag tiêu chuẩn. => sẽ ẩn hết tất cả các tag khác.
        tags = tags.includes(bigTag.value)
          ? [item.value, bigTag.value]
          : [item.value];
      } else {
        // Nếu tag đang chọn, đã được active thì bỏ chọn.
        if (this.currenTags.includes(item.value)) {
          tags = tags.filter((_item) => _item !== item.value);
        } else {
          // TH chọn các tag khác. (Dễ vỡ + Giao 1 phần)
          tags = [...tags, item.value];
        }
      }

      if (tags.length === 0) {
        // TH rỗng thì mặc định thêm tag tiêu chuẩn vào
        tags = [TCID];
      }

      const requestParam = {
        params: {
          tags: tags.filter((x) => x !== TCID),
        },
      };

      this.$emit("onChange", { data: requestParam, key: "tags" });
    },
  },
});
</script>

<style lang="scss">
.item-tag {
  padding: 0 10px;
  border-radius: 10px;
  background-color: var(--primaryColor);
  color: white;
  margin: 0 5px 5px;
  display: inline-block;
  height: 20px;
  line-height: 20px;
}
.list-tag-message {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>

<style lang="scss">
.channel__item-created-note {
  width: 100%;
  height: 100%;
}
</style>
