<template>
  <div class="order-notify-wrap">
    <div v-if="list.length === 0">
      <span>Danh sách rỗng</span>
    </div>
    <div v-else>
      <div class="order-notify-item" v-for="item in list" :key="item.id">
        <div>
          <b>{{ item.alias }}</b>
        </div>
        <div>
          <p v-html="item.desc" />
        </div>
        <div>
          <i>Vào lúc : {{ item.created }}</i>
        </div>
        <div :class="`notify-${status}`">
          <i v-html="item.message" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListOrderMessage",
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    status: String,
  },
};
</script>

<style scoped>
.order-notify-wrap {
  max-width: 500px;
  max-height: 500px;
  overflow: auto;
  padding: 10px 15px;
  color: black;
}
.order-notify-item {
  padding: 5px;
  border-bottom: 1px solid var(--grayColor);
}
.notify-error {
  color: red;
}
.notify-success {
  color: var(--primaryColor);
}
</style>
