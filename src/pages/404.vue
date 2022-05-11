<template>
  <div class="h-screen t-pt-16 t-pb-12 t-flex t-flex-col t-bg-white">
    <main
      class="t-flex-grow t-flex t-flex-col t-justify-center t-max-w-7xl t-w-full t-mx-auto t-px-4 sm:t-px-6 lg:t-px-8"
    >
      <div class="t-flex-shrink-0 t-flex t-justify-center">
        <div class="t-inline-flex">
          <span class="t-sr-only">Workflow</span>
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
            Không tìm thấy trang
          </h1>
          <p class="t-mt-2 t-text-base t-text-gray-500">
            Rất tiếc, chúng tôi không thể tìm thấy trang bạn yêu cầu
          </p>
          <div class="t-mt-6">
            <a
              @click="$router.push({ name: 'overview' })"
              class="t-text-base t-font-medium t-text-green-600"
              >Trang chủ<span aria-hidden="true"> &rarr;</span></a
            >
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "Empty",
};
</script>

<style scoped>
.image-error {
  height: 30rem;
}
</style>
