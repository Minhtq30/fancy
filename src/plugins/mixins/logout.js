import { REDIRECT_URI_LOGOUT } from "@/contants";

// Service
import services from "@/services";

export default {
  methods: {
    async onLogout(access_token) {
      // TODO NamVH: bật loading khi logout. => tránh trường hợp server xử lý chậm.
      // const res = await services.$auth.logout(access_token);
      try {
        access_token = access_token || localStorage.getItem("token_ecom");
        // TODO NamVH: bỏ tạm việc check điều kiện.
        // Clear IndexDB.
        await services.$auth.logoutIndexDBLocal();
        services.$auth.logout(access_token);
        // TODO NamVH: Cần xử lý thêm, Hạn chế lưu trữ token vào trong localstorage
        // if (res.success) {
        // }
      } catch (e) {
        console.log(e);
      } finally {
        localStorage.clear();
      }
      this.$store.commit("sessionStorage/logout");
      setTimeout(() => {
        window.location.replace(REDIRECT_URI_LOGOUT);
      }, 100);
    },
  },
};
