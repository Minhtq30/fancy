export default {
  data() {
    return {
      loading: true,
      timer: null,
    };
  },
  mounted() {
    this.timer = setTimeout(this.onTurnOffLoading, 10);
  },
  unmounted() {
    clearTimeout(this.timer);
  },
  methods: {
    onTurnOffLoading() {
      this.loading = false;
      clearTimeout(this.timer);
    },
    onUpdateLoading(status) {
      this.loading = status;
    },
  },
};
