<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="626"
    :maskClosable="!loading"
    :title="'Thiết lập kịch bản ghi chú'"
    @cancel="handleCancel"
  >
    <div class="note-for-created-order-modal-wrapper">
      <input
        class="mb-1 w-100"
        :value="noteString"
        @input="handleChangeNoteString"
      />
      <div class="wrapper-default-note">
        <g-checkbox
          v-for="(expNote, index) in expNotes"
          :key="index"
          :checked="noteString.includes(expNote.text)"
          @change="handleToogleExpNote(expNote.text)"
        >
          {{ expNote.text }}
        </g-checkbox>
      </div>
      <div class="wrapper-default-tags mb-1">
        <tags-note
          :tags="tags"
          :packageLabels="packageLabels"
          @onSelectTag="onSelectTag"
        />
      </div>
      <div class="flex">
        <g-checkbox-custom
          :checked="replaceAll"
          :onChange="handleToogleReplaceAll"
        />
        <span class="ml pointer t-text-black" @click="handleToogleReplaceAll"
          >Xóa ghi chú hiện tại của các ĐH, thay bằng kịch bản ghi chú
          mới.</span
        >
      </div>
      <g-button
        :disabled="replaceAll && !noteString.trim()"
        class="primary w-100 mt-1"
        @click="onSubmit"
      >
        Xác nhận
      </g-button>
    </div>
  </g-modal>
</template>

<script>
import find from "lodash/find";
import GModal from "../elements/modal.vue";
import GButton from "../elements/button.vue";
import GCheckbox from "../elements/checkbox.vue";
import GCheckboxCustom from "../elements/checkbox-custom.vue";
import TagsNote from "@/components/TagsNote";

const TCID = 10000;

export default {
  name: "NoteForCreatedOrderModal",
  props: [
    "visible",
    "setVisible",
    "packageLabels",
    "expNotes",
    "handleSubmit",
    "selectedListOrder",
  ],
  components: {
    GModal,
    GButton,
    GCheckbox,
    GCheckboxCustom,
    TagsNote,
  },
  data() {
    return {
      tags: [TCID],
      noteString: "",
      replaceAll: true,
    };
  },
  methods: {
    onSubmit() {
      const dataUpdate = {
        tags: this.tags.filter((t) => t !== TCID),
        note: {
          message: this.noteString.split(";").map((note) => note.trim()),
          replace_all: this.replaceAll ? 1 : 0,
        },
      };
      this.handleSubmit(dataUpdate);
      this.handleCancel();
    },
    handleCancel() {
      this.setVisible(false);
    },
    handleChangeNoteString(event) {
      this.noteString = event.target.value;
    },
    handleToogleExpNote(text) {
      if (this.noteString.includes(text)) {
        this.noteString = this.noteString
          .replace(`; ${text}`, "")
          .replace(text, "");
      } else {
        let prefix = "";
        const strTrim = this.noteString.trim();
        if (strTrim && strTrim[strTrim.length - 1] !== ";") {
          prefix = "; ";
        }
        this.noteString = strTrim + prefix + text;
      }
    },
    onSelectTag(item) {
      let tieuChuanTag = find(
        this.packageLabels,
        (x) => x.label === "Tiêu chuẩn"
      );

      // Loại bỏ tag tiêu chuẩn trước.
      let tags = this.tags.filter((_item) => _item !== tieuChuanTag.value);

      if (tieuChuanTag.value === item.value) {
        // Nếu chọn tag tiêu chuẩn. => sẽ ẩn hết tất cả các tag khác.
        tags = [item.value];
      } else {
        // Nếu tag đang chọn, đã được active thì bỏ chọn.
        if (this.tags.includes(item.value)) {
          tags = tags.filter((_item) => _item !== item.value);
        } else {
          // TH chọn các tag khác. (Dễ vỡ + Giao 1 phần)
          tags.push(item.value);
        }
      }

      if (tags.length === 0) {
        // TH rỗng thì mặc định thêm tag tiêu chuẩn vào
        tags = [TCID];
      }

      this.tags = tags;
    },
    handleToogleReplaceAll() {
      this.replaceAll = !this.replaceAll;
    },
  },
  watch: {
    visible(_visible) {
      if (_visible) {
        this.tags = [TCID];
        this.noteString = "";
        this.replaceAll = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.note-for-created-order-modal-wrapper {
  input {
    outline: none;
    border: 0;
    width: 100%;
    border-bottom: 1px solid #c4c4c4;
  }
  .wrapper-default-note {
    .ant-checkbox-wrapper {
      margin-left: 0;
      display: block !important;
      margin-bottom: 0.75rem;
    }
  }
}
</style>
