<template>
  <div class="change-avatar-wrapper">
    <span class="change-avatar-wrapper__title">
      {{ imageType === "avatar" ? "Ảnh đại diện" : "Ảnh cá nhân" }}
      <a-spin v-if="uploading" size="small" />
    </span>
    <div
      class="change-avatar-wrapper__main flex t-items-center t-justify-center mt pointer"
      :class="{ 'is-empty': !imageSrc, 'is-uploading': uploading }"
      @click="handleClickInput"
      :style="{ backgroundImage: `url(${base64Src || this.value})` }"
    >
      <template v-if="!imageSrc">
        <span class="plus-icon">+</span>
        <span>Thêm ảnh</span>
      </template>
      <div v-else class="overlay pointer">
        <camera-shop-info-icon />
      </div>
    </div>
    <input
      ref="inputMedia"
      @change="handleChangeFile"
      type="file"
      style="display: none"
      accept="image/*"
    />
  </div>
</template>

<script>
import CameraShopInfoIcon from "@/components/icons/CameraShopInfoIcon.vue";
import services from "@/services";
import { imageToBase64 } from "@/utils";

export default {
  name: "ChangeAvatar",
  props: ["imageType", "value"],
  components: {
    CameraShopInfoIcon,
  },
  data() {
    return {
      imageSrc: "",
      uploading: false,
      base64Src: "",
      isSuccess: false,
    };
  },
  methods: {
    handleClickInput() {
      if (this.uploading) return;
      this.$refs["inputMedia"].click();
    },
    async handleChangeFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      let base64Src = "";

      try {
        base64Src = await imageToBase64(file);
      } catch (error) {
        this.$message.error("Định dạng ảnh không hợp lệ");
        return;
      }

      this.uploading = true;

      const dataUpdate = new FormData();
      dataUpdate.append("image", file);
      dataUpdate.append("image_type", this.imageType);

      try {
        const response = await services.$shop.updateAvatar(dataUpdate);

        if (response?.data?.success) {
          this.$message.success(response?.data?.message);
          const field =
            this.imageType === "individual" ? "individual_photo" : "avatar";

          this.$store.commit("shop/updateBasicShopInfo", {
            [field]: base64Src,
          });
        } else {
          this.$message.error(
            response?.data?.message || "Cập nhật ảnh đại diện thất bại"
          );
        }
      } catch (error) {
        console.log(error);
        this.$message.error(
          error?.response?.data?.message || "Cập nhật ảnh đại diện thất bại"
        );
      }

      this.uploading = false;
    },
  },
  watch: {
    value(_value) {
      if (!this.imageSrc) {
        this.imageSrc = _value;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.change-avatar-wrapper {
  border: 1px solid #c4c4c4;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  &__title {
    color: #bdbdbd;
    line-height: 20px;
  }
  &__main {
    color: var(--primaryColor);
    width: 115px;
    height: 115px;
    flex-direction: column;
    border-radius: 3px;
    background-size: cover;
    background-position: center;
    position: relative;
    .overlay {
      position: absolute;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.65);
      width: 100%;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: 0.1s linear;
      transform: translateY(10px);
    }
    &.is-uploading {
      opacity: 0.65;
      .overlay {
        display: none !important;
      }
    }
    &.is-empty {
      border: 2px dashed var(--primaryColor);
    }
    .plus-icon {
      font-size: 35px;
      line-height: 35px;
    }
    &:hover {
      .overlay {
        opacity: 1;
        transform: translateY(0px);
      }
    }
  }
}
</style>
