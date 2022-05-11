<template>
  <div class="h-screen t-pt-16 t-pb-12 t-flex t-flex-col t-bg-white">
    <main
      class="t-flex-grow t-flex t-flex-col t-justify-center t-max-w-7xl t-w-full t-mx-auto t-px-4 sm:t-px-6 lg:t-px-8"
    >
      <div class="t-flex-shrink-0 t-flex t-justify-center">
        <div class="t-inline-flex">
          <img
            class="t-w-auto image-error"
            src="/web/img/images/error.png"
            alt="Đã có lỗi xảy ra"
          />
        </div>
      </div>
      <div class="t-py-16">
        <div class="t-text-center">
          <h1
            class="t-mt-2 t-text-4xl t-font-extrabold t-text-gray-900 t-tracking-tight sm:t-text-5xl"
          >
            {{ message }}
          </h1>
          <p class="t-mt-2 t-text-base t-text-gray-500">
            {{ description }}
          </p>
          <div class="t-mt-6">
            <div v-if="!$route.params.message" class="t-mb-3">
              <span class="t-text-gray-500">
                <span v-if="remainSeconds">
                  Bạn sẽ tự động được hướng chuyển về trang chủ sau
                  {{ remainSeconds }} giây.
                </span>
                <span v-else>
                  Bạn đang được chuyển hướng về trang chủ. Vui lòng chờ trong
                  giây lát.
                </span>
              </span>
            </div>
            <a href="/web" class="t-text-base t-font-medium">
              <span class="t-text-green-600">
                Trang chủ<span aria-hidden="true"> &rarr;</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
let interval;

export default {
  name: "Error",
  data() {
    return {
      message: "Lỗi hệ thống.",
      description:
        "Chúng tôi chân thành xin lỗi vì sự cố này. Vui lòng thử lại bằng cách trở lại trang chủ hoặc liên hệ CSKH để được hỗ trợ.",
      remainSeconds: 10,
    };
  },
  created() {
    const params = this.$route.params;

    this.message = params.message || this.message;
    this.description = params.description || this.description;

    if (!this.$route.params.message) {
      interval = setInterval(() => {
        if (this.remainSeconds > 0) {
          this.remainSeconds -= 1;
        } else {
          window.location = "/web";
        }
      }, 1000);
    }
  },
  unmounted() {
    clearInterval(interval);
  },
};
</script>

<style scoped>
.image-error {
  height: 30rem;
}
</style>
