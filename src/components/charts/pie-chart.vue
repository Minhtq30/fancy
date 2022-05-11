<template>
  <div>
    <apexchart
      width="550"
      height="275"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
export default {
  el: "#appl",
  props: {
    series: {
      type: Array,
      default: () => {
        return [25, 25, 25, 25];
      },
    },
  },
  data: function () {
    return {
      options: {
        states: {
          normal: {
            filter: {
              type: "none",
              value: 0,
            },
          },
          hover: {
            filter: {
              type: "none",
            },
          },
          active: {
            allowMultipleDataPointsSelection: true,
            filter: {
              type: "none",
              value: 0,
            },
          },
        },

        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "70%",
              labels: {
                show: false,
                total: {
                  show: true,
                  showAlways: true,
                },
              },
            },
          },
        },

        chart: {
          type: "donut",
        },
        fill: {
          colors: ["#5EB4B8", "#EEBF5C", "#E9693D", "#D2494D"],
        },
        legend: {
          show: true,
          position: "right",
          fontFamily: "Roboto",
          fontWeight: "normal",
          fontSize: "16px",
          offsetY: 60,
          customLegendItems: [
            "Đơn shop hủy",
            "Không liên hệ được",
            "KH từ chối nhận",
            "Khác",
          ],
          markers: {
            fillColors: ["#5EB4B8", "#EEBF5C", "#E9693D", "#D2494D"],
            radius: 4,
          },
          itemMargin: {
            vertical: 4,
          },
        },
        tooltip: {
          enabled: false,
        },
      },
    };
  },
};
</script>

<style></style>
