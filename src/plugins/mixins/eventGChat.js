export default {
  methods: {
    $mixinSendMessage(payload) {
      // console.log("Event From Fancy", payload);
      document
        .getElementById("chat-iframe")
        .contentWindow.postMessage(payload, "*");
    },
    $mixinSendEventChatWithMember(cod_id) {
      const data = {
        type: "create_group_chat_by_members",
        payload: {
          members: [
            {
              id: cod_id,
            },
          ],
        },
      };

      this.$mixinSendMessage(data);
    },
    $mixinSendEventChatWithCSKH() {
      const data = {
        type: "create_chat_shop_with_cshk",
        payload: {
          shop: {
            shop_id: localStorage.getItem("shop_id"),
          },
        },
      };

      this.$mixinSendMessage(data);
    },
    $mixinSendEventChatWithCSKHByBill(billId) {
      const data = {
        type: "create_chat_shop_with_cshk",
        payload: {
          bill: {
            code: billId,
          },
          shop: {
            shop_id: localStorage.getItem("shop_id"),
          },
        },
      };

      this.$mixinSendMessage(data);
    },
    $mixinSendEventAuthentication() {
      const data = {
        type: "authentication",
        payload: {
          token: localStorage.getItem("token_gchat"),
          refresh_token: localStorage.getItem("gchat_refresh_token"),
          ecom_admin_token: localStorage.getItem("token_ecom"),
          shop_token: localStorage.getItem("shop_token"),
        },
      };

      this.$mixinSendMessage(data);
    },
    $mixinSendEventGroupChatByPackage(orderId) {
      const data = {
        type: "create_shop_chat_by_package",
        payload: {
          package: {
            order: orderId,
          },
        },
      };

      this.$mixinSendMessage(data);
    },
  },
};
