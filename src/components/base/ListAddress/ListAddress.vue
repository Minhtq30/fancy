<template>
  <div class="list-address">
    <template v-for="(item, index) in list" :key="index">
      <div @click="handleSelectedAddress(item)" class="item-address">
        {{ item.FullName }}
      </div>
    </template>
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  name: "ListAddress",
  props: ["list"],
  methods: {
    handleSelectedAddress(address) {
      const objAddress = {
        FullName: address.FullName,
        customer_province_id:
          address.Level === 1
            ? get(address, "AddressId")
            : get(address, "ProvinceId"),
        customer_province:
          address.Level === 1 ? get(address, "Name") : get(address, "Province"),
        customer_district_id:
          address.Level === 2
            ? get(address, "AddressId")
            : get(address, "DistrictId"),
        customer_district:
          address.Level === 2 ? get(address, "Name") : get(address, "District"),
        customer_street_id: get(address, "StreetId"),
        customer_street: get(address, "Street"),
        customer_ward_id:
          address.Level === 3
            ? get(address, "AddressId")
            : get(address, "WardId"),
        customer_ward:
          address.Level === 3 ? get(address, "Name") : get(address, "Ward"),
        customer_hamlet_id:
          address.Level === 4
            ? get(address, "AddressId")
            : get(address, "HamletId"),
        customer_hamlet:
          address.Level === 4 ? get(address, "Name") : get(address, "Hamlet"),
        customer_specific_id:
          address.Level === 4
            ? get(address, "AddressId")
            : get(address, "HamletId"),
        customer_specific:
          address.Level === 4 ? get(address, "Name") : get(address, "Hamlet"),
      };
      this.$emit("on-selected", objAddress);
    },
  },
};
</script>

<style lang="scss" scoped>
.list-address {
  overflow: auto;
  width: 100%;
}
.item-address {
  padding: 10px 15px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  border-bottom: 1px solid var(--grayColor);
}
.item-address:hover {
  background-color: var(--primaryColor) !important;
  color: white;
}
</style>
