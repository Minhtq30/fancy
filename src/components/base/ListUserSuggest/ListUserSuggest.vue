<template>
  <div class="list-user-suggest-by-phone">
    <template v-for="(item, index) in options" :key="index">
      <div @click="handleSelectedAddress(item)" class="item-user">
        <div>
          <b>{{ item.username }} - {{ item.phone }}</b>
        </div>
        <div>{{ item.address }}</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "ListUserSuggestByPhone",
  props: {
    options: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    handleSelectedAddress(item) {
      this.$emit("on-selected", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.list-user-suggest-by-phone {
  overflow: auto;
  width: 100%;
}
.item-user {
  padding: 10px 15px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  border-bottom: 1px solid var(--grayColor);
}
.item-user:hover {
  background-color: var(--primaryColor) !important;
  color: white;
}
</style>
