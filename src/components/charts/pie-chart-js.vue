<script>
import { Chart, registerables } from "chart.js";
export default {
  name: "Test",
  data() {
    return {
      values: [80, 10, 10, 10, 10, 10, 10, 10],
    };
  },
  created() {
    Chart.register(...registerables);
  },
  mounted() {
    let ctx = document.getElementById(`${this.idWrapper}`);
    // let self = this;
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [
          "Khác",
          "Hà Nội",
          "Hồ Chí Minh",
          "Đà Nẵng",
          "Hải Phòng",
          "Vinh",
          "Nghệ An",
          "Thanh Hóa",
        ],
        datasets: [
          {
            labels: [
              "Khác",
              "Hà Nội",
              "Hồ Chí Minh",
              "Đà Nẵng",
              "Hải Phòng",
              "Vinh",
              "Nghệ An",
              "Thanh Hóa",
            ],
            backgroundColor: [
              "#069255",
              "#0DA060",
              "#21BA78",
              "#64B46E",
              "#9BA80B",
              "#BFCF17",
              "#DDCD3C",
              "#CB9634",
            ],
            data: self.values,
          },
        ],
      },
      options: {
        // responsive: false,
        cutout: "70%",
        plugins: {
          legend: {
            display: true,
            position: "right",
          },
        },
      },
      //   plugins: [
      //     {
      //       beforeInit: function (chart) {
      //         let firstRow = document.createElement("div"),
      //           secondRow = document.createElement("div");
      //         firstRow.classList.add("first-row");
      //         secondRow.classList.add("second-row");

      //         for (let i = 0; i < chart.data.labels.length; i++) {
      //           if (i < chart.data.labels.length / 2) {
      //             firstRow.innerHTML +=
      //               '<div class="legend-item"><div class="dot-item" style="background-color:' +
      //               chart.data.datasets[0].backgroundColor[i] +
      //               '">   </div><span>' +
      //               chart.data.datasets[0].labels[i] +
      //               "</span></div>";
      //           } else {
      //             secondRow.innerHTML +=
      //               '<div class="legend-item"><div class="dot-item" style="background-color:' +
      //               chart.data.datasets[0].backgroundColor[i] +
      //               '">   </div><span>' +
      //               chart.data.datasets[0].labels[i] +
      //               "</span></div>";
      //           }
      //         }
      //         document
      //           .getElementById(`${self.legendWrapper}`)
      //           .appendChild(firstRow);
      //         document
      //           .getElementById(`${self.legendWrapper}`)
      //           .appendChild(secondRow);
      //       },
      //     },
      //   ],
    });
  },
  props: {
    idWrapper: {
      type: String,
      required: true,
    },
    legendWrapper: {
      type: String,
      required: true,
    },
  },
};
</script>
<style lang="scss">
// .legend-wrapper {
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   margin: 1rem 0;
//   .first-row {
//     display: flex;
//     justify-content: center;
//     margin: 1rem 0;
//   }
//   .second-row {
//     display: flex;
//     justify-content: center;
//   }
//   .legend-item {
//     display: inline-block;
//     width: 25%;
//     text-align: left;
//   }
//   .dot-item {
//     border: none;
//     border-radius: 50%;
//     width: 1.3rem;
//     height: 1.3rem;
//     margin-right: 5px;
//     display: inline-block;
//   }
// }
// #chartCity1,
// #chartCity2 {
//   margin: 0 auto;
// }
// #city-legend1,
// #city-legend2 {
//   padding-left: 50px;
// }
// .wrap-chart,
// .wrap-line-chart {
//   display: flex;
//   justify-content: space-between;
// }
// .wrap-line-chart {
//   padding-top: 40px;
//   padding-bottom: 40px;
// }
</style>
