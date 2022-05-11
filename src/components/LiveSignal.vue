<template>
  <div class="live-signal" />
</template>

<script>
export default {
  name: "LiveSignal",
};
</script>

<style lang="scss" scoped>
@-webkit-keyframes pulse {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgba(235, 87, 87, 0.4);
  }
  70% {
    -webkit-box-shadow: 0 0 0 10px rgba(235, 87, 87, 0);
  }
  100% {
    -webkit-box-shadow: 0 0 0 0 rgba(235, 87, 87, 0);
  }
}

@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(235, 87, 87, 0.4);
    box-shadow: 0 0 0 0 rgba(235, 87, 87, 0.4);
  }
  70% {
    -moz-box-shadow: 0 0 0 10px rgba(235, 87, 87, 0);
    box-shadow: 0 0 0 10px rgba(235, 87, 87, 0);
  }
  100% {
    -moz-box-shadow: 0 0 0 0 rgba(235, 87, 87, 0);
    box-shadow: 0 0 0 0 rgba(235, 87, 87, 0);
  }
}
.live-signal {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #eb5757 !important;
  animation: pulse 2s infinite;
}
</style>
