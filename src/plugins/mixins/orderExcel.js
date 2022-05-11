import { find } from "lodash";
import { SHOP_CUSTOM_TAGS } from "@/contants/order";

export default {
  computed: {
    notDeliverOptions() {
      return this.$store.state.constant.not_delivered_options;
    },
    notDeliverOptionsKey() {
      return this.notDeliverOptions.map((tag) => tag.value);
    },
  },
  methods: {
    generateMessage(tags, not_delivered_fee, tagList) {
      let message = "";
      if (
        !tagList.some(
          (tag) =>
            SHOP_CUSTOM_TAGS.map((shopTag) => shopTag.key).indexOf(tag.key) >= 0
        )
      ) {
        tagList = [...SHOP_CUSTOM_TAGS, ...tagList];
      }
      for (let i = 0; i < tagList.length; i++) {
        let tag = tagList[i];
        if (tag && tags.includes(tagList[i].key)) {
          message += "; " + tag.title;
          if (tagList[i].key === 19 && not_delivered_fee) {
            message +=
              " " +
              not_delivered_fee
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
              " đ";
          }
        }
      }

      let tag = find(
        this.notDeliverOptions,
        (x) =>
          x.value ===
          tags.find((tag) => this.notDeliverOptionsKey.includes(tag))
      );
      message = tag
        ? message + "; " + "Hoàn hàng: " + tag["label"].toLowerCase()
        : "";
      message = message.slice(2);
      return message;
    },
  },
};
