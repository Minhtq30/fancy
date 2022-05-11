<template>
  <div class="container">
    <a-spin tip="Đang cập nhật ..." />
  </div>
</template>

<script>
// Service
import services from "../services";

// Mixins
import logout from "@/plugins/mixins/logout";

// Util
import { REDIRECT_URI_LOGIN } from "@/contants";

export default {
  name: "Login",
  data() {
    return {
      statusLogin: "pending",
    };
  },
  async mounted() {
    let { access_token, gchat_access_token, gchat_refresh_token } =
      this.$route.query;
    if (access_token) {
      this.statusLogin = "checking";
      services.$shop
        .browseInfoShop(access_token)
        .then((response) => {
          this.loginSuccess(response, {
            access_token,
            gchat_access_token,
            gchat_refresh_token,
          });
        })
        .catch(() => {
          this.loginFail(access_token);
        });
    } else if (!localStorage.getItem("token_ecom")) {
      window.location.replace(REDIRECT_URI_LOGIN);
    } else {
      this.$router.push("/");
    }
  },
  mixins: [logout],
  methods: {
    loginSuccess(response, payload) {
      const { access_token, gchat_access_token, gchat_refresh_token } = payload;
      this.$store.commit("shop/setFullInfoShop", response.data);
      localStorage.setItem("token_ecom", access_token);
      const data = response.data;
      localStorage.setItem("shop_code", data.Shop?.code);
      localStorage.setItem("shop_token", data.Shop?.token);
      localStorage.setItem("shop_type", data.Shop?.shop_type);
      localStorage.setItem("shop_id", data.Shop?.id);
      // gchat_access_token
      // TODO NamVH: Cần xử lý thêm, Hạn chế lưu trữ token vào trong localstorage
      localStorage.setItem("token_gchat", gchat_access_token);
      localStorage.setItem("gchat_refresh_token", gchat_refresh_token);
      // localStorage.setItem(
      //   "token_gchat",
      //   "c_ams6t553qdtcwfzyipjgcpewqt1mkdzmq6pemkvmuzwkudgmxxz3njquwzcee5jx"
      // );
      this.statusLogin = "success";
      setTimeout(() => {
        this.$store.commit("auth/setAuthentication", true);
        // this.$router.push("/");
        window.location.href = "/web";
      }, 100);
      if (localStorage.getItem("token_ecom")) {
        services.$review.browseCheckEnable().then((response) => {
          localStorage.setItem("enable_rate", response?.data);
        });
      }
    },
    loginFail(access_token) {
      this.statusLogin = "error";
      this.onLogout(access_token);
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
