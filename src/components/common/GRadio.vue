<template>
  <span>
    <!--suppress HtmlFormInputWithoutLabel -->
    <input
      :id="id"
      :value="checkValue"
      v-model="myModel"
      type="radio"
      @input="onChangeInputValue"
    />
    <label :for="id">
      <slot></slot>
    </label>
  </span>
</template>

<script>
export default {
  name: "GRadio",
  props: {
    modelValue: String,
    checkValue: String,
    id: {
      required: true,
      type: String,
    },
  },
  watch: {
    modelValue(val) {
      if (val !== this.myModel) {
        this.myModel = val;
      }
    },
  },
  mounted() {
    this.myModel = this.modelValue;
  },
  data: () => {
    return { myModel: "" };
  },
  methods: {
    onChangeInputValue(e) {
      this.$emit("update:modelValue", e.target.value);
      this.$emit("onSelectionChange", e.target.value);
    },
  },
};
</script>

<style scoped>
label {
  height: 28px;
}
[type="radio"]:checked,
[type="radio"]:not(:checked) {
  position: absolute;
  left: -9999px;
  opacity: 0;
}

[type="radio"]:checked + label,
[type="radio"]:not(:checked) + label {
  position: relative;
  padding-left: 20px;
  cursor: pointer;
  line-height: 20px;
  display: flex;
  align-items: center;
  color: #000;
}

[type="radio"]:checked + label:before {
  content: "";
  position: absolute;
  left: 0;
  top: calc(100% - 22px);
  width: 18px;
  height: 18px;
  border: 1px solid #069255;
  border-radius: 100%;
  background: #fff;
}

[type="radio"]:not(:checked) + label:before {
  content: "";
  position: absolute;
  left: 0;
  top: calc(100% - 22px);
  width: 18px;
  height: 18px;
  border: 1px solid #069255;
  border-radius: 100%;
  background: #fff;
}

[type="radio"]:checked + label:after,
[type="radio"]:not(:checked) + label:after {
  content: "";
  width: 10px;
  height: 10px;
  background: #069255;
  position: absolute;
  top: calc(100% - 18px);
  left: 4px;
  border-radius: 100%;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
}

[type="radio"]:not(:checked) + label:after {
  opacity: 0;
  -webkit-transform: scale(0);
  transform: scale(0);
}

[type="radio"]:checked + label:after {
  opacity: 1;
  -webkit-transform: scale(1);
  transform: scale(1);
}
</style>
