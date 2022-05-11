<template>
  <div>
    <apexchart
      type="bar"
      height="500"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import overviewService from "@/services/overview.service";
import { formatMomentDate } from "@/utils/date";
const space = `<svg style="width:0px;height:14px;background:#fff;"></svg>`;
const eyeIcon = `<svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C4.56873 0 0 6.54545 0 6.54545C0 6.54545 4.56873 13.0909 12 13.0909C19.4313 13.0909 24 6.54545 24 6.54545C24 6.54545 19.4313 0 12 0ZM12 10.9091C7.69855 10.9091 4.44436 8.19927 2.85927 6.54545C3.99382 5.36182 5.98145 3.64691 8.59091 2.76109C7.9764 3.52463 7.63979 4.47444 7.63636 5.45455C7.63636 6.61185 8.0961 7.72176 8.91444 8.5401C9.73278 9.35844 10.8427 9.81818 12 9.81818C13.1573 9.81818 14.2672 9.35844 15.0856 8.5401C15.9039 7.72176 16.3636 6.61185 16.3636 5.45455C16.3602 4.47444 16.0236 3.52463 15.4091 2.76109C18.0196 3.64691 20.0084 5.36291 21.1407 6.54545C19.5535 8.20146 16.3004 10.9091 12 10.9091Z" fill="#069255"/></svg>`;
export default {
  components: {},
  el: "#app",
  data: () => {
    return {
      series: [
        {
          type: "line",
          name: "Sản phẩm",
          data: [],
        },
        {
          type: "line",
          name: "Tỷ lệ hoàn hủy",
          data: [],
        },
        {
          type: "line",
          name: `Đơn hàng ${space}`,
          data: [],
        },
        {
          type: "bar",
          name: `Xu Hướng ${eyeIcon}`,
          data: [],
        },
      ],
      options: {},
      chartOptions: {
        colors: ["#259062", "#D2494D", "#EEBF5C"],
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
              value: 0,
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
        legend: {
          fontFamily: "Roboto",
          fontWeight: "normal",
          fontSize: "16px",
          horizontalAlign: "left",
          offsetX: 9,
          offsetY: 6,
          onItemClick: {
            toggleDataSeries: false,
          },
          formatter: function (seriesName) {
            return `${seriesName}`;
          },
          markers: {
            width: 90,
            height: 2,
            fillColors: ["#fff", "#fff"],
            customHTML: [
              function () {
                return '<div style="witdh:90px;height:2px;background-color:#259062;border-radius:2px;"></div><div style="width: 16px;height: 16px;border-radius:12px;background-color: #259062;border: 4px solid #FFFFFF;margin-left: 38px;margin-top: -9px;"></div>';
              },
              function () {
                return '<div style="witdh:90px;height:2px;background-color:#D2494D;border-radius:2px;"></div><div style="width: 16px;height: 16px;border-radius:12px;background-color: #D2494D;border: 4px solid #FFFFFF;margin-left: 38px;margin-top: -9px;"></div>';
              },
              function () {
                return '<div style="witdh:90px;height:2px;background-color:#EEBF5C;border-radius:2px;"></div><div style="width: 16px;height: 16px;border-radius:12px;background-color: #EEBF5C;border: 4px solid #FFFFFF;margin-left: 38px;margin-top: -9px;"></div>';
              },
              function () {
                return '<div style="margin-bottom:4px;width:90px;height:2px;background:#fff;border-radius:2px;background-image: linear-gradient(to right, grey 43%, rgba(158,158,158,0) 0%);background-position: bottom;background-size: 12px 3px;background-repeat: repeat-x;"></div>';
              },
            ],
          },
          itemMargin: {
            horizontal: 30,
            vertical: 8,
          },
        },
        tooltip: {
          enabled: true,
          enabledOnSeries: [0, 1, 2],
          shared: true,
          followCursor: true,
          intersect: false,
          inverseOrder: true,
          y: {
            formatter: (val) => {
              return (Math.round(val * 100) / 100)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
          },
        },
        markers: {
          size: [5, 5],
          strokeColors: "#fff",
          strokeWidth: 2,
          strokeOpacity: 3,
        },
        chart: {
          type: "line",
          zoom: {
            enabled: false,
          },
          dropShadow: {
            enabled: false,
          },
          toolbar: {
            tools: {
              download: false,
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
          width: 2,
        },
        grid: {
          strokeDashArray: 5,
          row: {
            colors: ["#fff", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            style: {
              fontFamily: "Roboto",
              fontWeight: "normal",
              fontSize: "14px",
              colors: "#808080",
            },
          },
          categories: [],
        },
        yaxis: [
          {
            seriesName: "Sản phẩm",
            tickAmount: 5,
            labels: {
              style: {
                fontFamily: "Roboto",
                fontWeight: "normal",
                fontSize: "14px",
                colors: "#259062",
              },
              formatter: (val) => {
                return (Math.round(val * 100) / 100)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              },
            },
          },
          {
            seriesName: "Tỷ lệ hoàn hủy",
            tickAmount: 5,
            labels: {
              style: {
                fontFamily: "Roboto",
                fontWeight: "normal",
                fontSize: "14px",
                colors: "#D2494D",
              },
              formatter: (value) => {
                return Math.round(value * 100) / 100 + "%";
              },
            },
            opposite: true,
          },
          {
            show: false,
            seriesName: "Sản phẩm",
            tickAmount: 5,
            labels: {
              style: {
                fontFamily: "Roboto",
                fontWeight: "normal",
                fontSize: "14px",
                colors: "#EEBF5C",
              },
              formatter: (val) => {
                return (Math.round(val * 100) / 100)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              },
            },
          },
          {
            show: false,
            seriesName: "Xu hướng",
            tickAmount: 5,
            labels: {
              style: {
                fontFamily: "Roboto",
                fontWeight: "normal",
                fontSize: "14px",
                colors: "#808080",
              },
              formatter: (val) => {
                return val;
              },
              tooltip: {
                show: false,
              },
            },
          },
        ],
      },
    };
  },
  methods: {
    async getData() {
      this.chartOptions.xaxis.categories = [];
      this.series[0].data = [];
      this.series[1].data = [];
      this.series[2].data = [];
      try {
        let res = await overviewService.browseLineChart(
          this.$store.state.overview.query
        );
        res = res.data;
        if (res.success) {
          for (let item of Object.keys(res.data)) {
            let dateInput = {};
            dateInput._d = item;
            !this.chartOptions.xaxis.categories.push(
              formatMomentDate(dateInput, "DD-MM")
            );
          }
          for (let date in res.data) {
            let obj = res.data[date];
            this.series[0].data.push(!obj.product ? 0 : obj.product.value);
            this.series[1].data.push(
              !obj.order ||
                !obj.total_return ||
                obj.total_return.value == 0 ||
                obj.order.value == 0
                ? 0
                : obj.total_return.value / obj.order.value
            );
            this.series[2].data.push(!obj.order ? 0 : obj.order.value);
          }
          this.options = this.chartOptions;
          if (this.options.xaxis.categories == 0) {
            this.updateBlankChart();
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    updateBlankChart() {
      this.options = {
        ...this.options,
        ...{
          tooltip: {
            enabled: false,
          },
          markers: {
            size: [0, 0],
          },
          xaxis: {
            ...this.options.xaxis,
            labels: {
              show: false,
            },
          },
          yaxis: [
            {
              ...this.options.yaxis[0],
              labels: {
                ...this.options.yaxis[0].labels,
                formatter: () => {
                  return "0";
                },
              },
            },
            {
              ...this.options.yaxis[1],
              min: 0,
              max: 100,
              labels: {
                ...this.options.yaxis[1].labels,
                formatter: (val) => {
                  return val + "%";
                },
              },
            },
            {
              ...this.options.yaxis[2],
              labels: {
                ...this.options.yaxis[2].labels,
                formatter: () => {
                  return "0";
                },
              },
            },
          ],
        },
      };
    },
  },
  created() {
    this.getData();
  },
  watch: {
    // "$store.state.overview.query.range": function () {
    //   this.getData();
    // },

    "$store.state.overview.query": {
      handler() {
        this.getData();
      },
      deep: true,
    },
  },
};
</script>

<style>
.apexcharts-legend-series {
  display: flex !important;
  align-items: baseline;
}
</style>
