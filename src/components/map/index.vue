<template>
  <div id="map" class="g-map" :style="{ height: `${height}px` }"></div>
  <img class="g-map-logo" src="/web/img/map/gmap-logo.png" />
</template>

<script>
import maplibregl from "maplibre-gl";

// Util.
import { GMAP_TILE } from "@/contants";
import getMidPoint from "@/utils/getMidPoint";
import services from "@/services";

export default {
  name: "GMap",
  props: {
    height: {
      type: Number,
      default: 500,
    },
    startAddress: {
      type: String,
      default: "",
    },
    endAddress: {
      type: String,
      default: "",
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      map: null,
      popup: null,
      timer: null,
      timerRouter: null,
      timerPoint: null,
    };
  },
  watch: {
    data(newData) {
      this.updateDataPoint(newData);
    },
  },
  mounted() {
    if (!this.map) {
      this.timer = setTimeout(() => {
        this.map = new maplibregl.Map({
          container: "map",
          style: `${GMAP_TILE}/styles/osm-liberty-2d-optimal/style.json`,
          center: [105.79743274723911, 20.91631197420464], // starting position [lng, lat]
          zoom: 10, // starting zoom
        });
        this.updateDataPoint(this.data);
        const geoJson = this.getSelectGeoJson([]);
        const vm = this;
        this.map.on("load", function () {
          vm.map.addSource("route", {
            type: "geojson",
            data: geoJson,
          });
          vm.map.addSource("route_point", {
            type: "geojson",
            data: geoJson,
          });

          vm.map.loadImage(
            "/web/img/map/point/start_marker.png",
            (error, image) => {
              if (error) throw error;
              if (!vm.map.hasImage("start_marker"))
                vm.map.addImage("start_marker", image);
            }
          );
          vm.map.loadImage(
            "/web/img/map/point/end_marker.png",
            (error, image) => {
              if (error) throw error;
              if (!vm.map.hasImage("end_marker"))
                vm.map.addImage("end_marker", image);
            }
          );

          vm.map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#00904A",
              "line-width": 8,
            },
          });

          vm.map.addLayer({
            id: "point-direct-start",
            type: "symbol",
            source: "route_point",
            filter: ["all", ["==", "typePoint", "start_point"]],
            layout: {
              "icon-image": "start_marker",
              "text-field": "{nameView}",
              "text-offset": [1.5, 0],
              "text-size": 12,
              "text-font": ["Roboto Condensed Bold"],
              "text-max-width": 15,
              "text-anchor": "left",
            },
            paint: {
              "text-color": "#00904A",
              "text-halo-blur": 0.5,
              "text-halo-color": "#ffffff",
              "text-halo-width": 1,
            },
          });

          vm.map.addLayer({
            id: "point-direct-end",
            source: "route_point",
            type: "symbol",
            filter: ["all", ["==", "typePoint", "end_point"]],
            layout: {
              "icon-image": "end_marker",
              "text-field": "{nameView}",
              "text-offset": [1.5, 0],
              "text-size": 12,
              "text-font": ["Roboto Condensed Bold"],
              "text-max-width": 15,
              "text-anchor": "left",
            },
            paint: {
              "text-color": "#E74C3C",
              "text-halo-blur": 0.5,
              "text-halo-color": "#ffffff",
              "text-halo-width": 1,
            },
          });
        });
      }, 200);
    }
  },
  unmounted() {
    this.map = null;
    clearTimeout(this.timer);
    clearTimeout(this.timerRouter);
    clearTimeout(this.timerPoint);
  },
  methods: {
    async getDataPoint({
      start_point = "",
      end_point = "",
      percent_of_distance = 0,
      type_transport = "driving",
    }) {
      let mid_point = "";
      let _start_point = [];
      let _end_point = [];
      let profile = "car";

      let router = {};
      let geometry = [];
      try {
        _start_point = start_point.split(",");
        _end_point = end_point.split(",");

        // get icon from type_transport.
        switch (type_transport) {
          case "flying": {
            break;
          }
          case "motorbiking": {
            profile = "motorcycle";
            break;
          }
          default: {
            break;
          }
        }

        if (
          type_transport !== "flying" &&
          end_point &&
          start_point &&
          _start_point.length > 1 &&
          _end_point.length > 1
        ) {
          try {
            const params = {
              gh_requests: [
                {
                  points: [
                    [_start_point[1], _start_point[0]],
                    [_end_point[1], _end_point[0]],
                  ],
                  calc_points: true,
                  elevation: false,
                  locale: "vi-VN",
                  algorithm: "alternative_route",
                  points_encoded: false,
                  vehicle: profile,
                  request_id: "17853-1705",
                  instructions: true,
                },
              ],
            };
            const response = await services.$map.browseGetRouter(params);
            if (response.success) {
              router = response.data.gh_responses.find(
                (item) => item.request_id === "17853-1705"
              );
            }
          } catch (error) {
            console.log(error);
          }

          const _geometry = router.paths[0].points.coordinates;
          geometry = _geometry;
          const _instructions = router.paths[0].instructions;
          const maxDistance = router.paths[0].distance;
          let _distanceCurent = 0;
          const _instruction =
            _instructions.find((item) => {
              _distanceCurent += item.distance;
              if (
                parseInt((_distanceCurent / maxDistance) * 100) >=
                percent_of_distance
              )
                return true;
              return false;
            }) || {};

          const _interval = _instruction.interval;
          const _index = parseInt((_interval[1] + _interval[0]) / 2);
          mid_point =
            Number(percent_of_distance) !== 0
              ? Number(percent_of_distance) === 100
                ? end_point
                : `${_geometry[_index][1]}, ${_geometry[_index][0]}`
              : start_point;
        } else if (end_point && start_point) {
          const midPoint = getMidPoint(
            Number(_start_point[0]),
            Number(_start_point[1]),
            Number(_end_point[0]),
            Number(_end_point[1])
          );
          const quarterPoint = getMidPoint(
            Number(_start_point[0]),
            Number(_start_point[1]),
            Number(midPoint[0]),
            Number(midPoint[1])
          );
          const lessQuaterPoint = getMidPoint(
            Number(midPoint[0]),
            Number(midPoint[1]),
            Number(_end_point[0]),
            Number(_end_point[1])
          );
          const nearPoint = getMidPoint(
            Number(lessQuaterPoint[0]),
            Number(lessQuaterPoint[1]),
            Number(_end_point[0]),
            Number(_end_point[1])
          );

          if (Number(percent_of_distance) <= 25) {
            mid_point = `${quarterPoint[0]}, ${quarterPoint[1]}`;
          } else if (Number(percent_of_distance) <= 50) {
            mid_point = `${midPoint[0]}, ${midPoint[1]}`;
          } else if (Number(percent_of_distance) <= 75) {
            mid_point = `${lessQuaterPoint[0]}, ${lessQuaterPoint[1]}`;
          } else if (Number(percent_of_distance) <= 99) {
            mid_point = `${nearPoint[0]}, ${nearPoint[1]}`;
          }
        }
      } catch (e) {
        console.log(e);
      }

      const _mid_point = mid_point.split(",");

      return {
        start_point: _start_point,
        end_point: _end_point,
        mid_point: _mid_point,
        path: router.paths ? router.paths[0] : [],
        geometry,
        percent_of_distance,
        type_transport,
      };
    },
    getContentPopup(data) {
      return `
       <div>
            <img src="/web/img/map/direct/${data.type_transport}.svg" /> \t&nbsp;
            <b>Hoàn thành: ${data.percent_of_distance}%</b>
       </div>
      `;
    },
    updateViewMap(data) {
      // Draw point.
      const geoPointJson = this.getPointGeoJson(data);
      this.timerPoint = setTimeout(() => {
        this.map.getSource("route_point").setData(geoPointJson);
      }, 400);

      // Draw router.
      if (data.type_transport === "flying") {
        // Do some thing.
        const geoJson = this.getRouterFly(data);
        this.timerRouter = setTimeout(() => {
          this.map.getSource("route").setData(geoJson);

          const _point = geoJson.features[0]?.geometry?.coordinates || [];
          const bounds = _point.reduce(function (bounds, coord) {
            return bounds.extend(coord);
          }, new maplibregl.LngLatBounds(_point[0], _point[0]));

          const contentHTML = this.getContentPopup(data);

          if (this.popup) {
            this.popup.remove();
          }
          this.popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
          })
            .setLngLat([data.mid_point[1], data.mid_point[0]])
            .setHTML(contentHTML)
            .addTo(this.map);

          this.map.fitBounds(bounds, {
            padding: { top: 120, bottom: 120, left: 120, right: 120 },
          });
        }, 400);
      } else if (data.start_point && data.end_point && data.mid_point) {
        // TH đẩy đủ các điểm đến, điểm đi.
        const geoJson = this.getSelectGeoJson(data.path);

        this.timerRouter = setTimeout(() => {
          this.map.getSource("route").setData(geoJson);

          const bounds = data.geometry.reduce(function (bounds, coord) {
            return bounds.extend(coord);
          }, new maplibregl.LngLatBounds(data.geometry[0], data.geometry[0]));

          const contentHTML = this.getContentPopup(data);

          if (this.popup) {
            this.popup.remove();
          }
          this.popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
          })
            .setLngLat([data.mid_point[1], data.mid_point[0]])
            .setHTML(contentHTML)
            .addTo(this.map);

          this.map.fitBounds(bounds, {
            padding: { top: 120, bottom: 120, left: 120, right: 120 },
          });
        }, 400);
      } else if (data.start_point) {
        // TH chỉ có 1 điểm.
        // Xóa đường đi cũ.
        const geoJson = this.getSelectGeoJson([]);
        this.timerRouter = setTimeout(() => {
          this.map.getSource("route").setData(geoJson);
          this.map.jumpTo({
            center: [data.start_point[1], data.start_point[0]],
            zoom: 15,
          });
        }, 400);
      }
    },
    getPointGeoJson(data) {
      const geoJson = {
        type: "FeatureCollection",
        features: [],
      };

      if (data?.start_point?.length === 2) {
        geoJson.features.push({
          type: "Feature",
          properties: {
            ...data,
            nameView: this.startAddress,
            typePoint: "start_point",
          },
          geometry: {
            type: "Point",
            coordinates: [data.start_point[1], data.start_point[0]],
          },
        });
      }
      if (data?.end_point?.length === 2) {
        geoJson.features.push({
          type: "Feature",
          properties: {
            ...data,
            nameView: this.endAddress,
            typePoint: "end_point",
          },
          geometry: {
            type: "Point",
            coordinates: [data.end_point[1], data.end_point[0]],
          },
        });
      }

      if (data.type_transport === "flying") {
        // Nếu là "Fly" cần tính lại đường đi
      }

      return geoJson;
    },
    getSelectGeoJson(path) {
      let _data = {
        type: "FeatureCollection",
        features: this.getFeature(path),
      };
      return _data;
    },
    getRouterFly(data) {
      let _data = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates:
                [
                  [data.start_point[1], data.start_point[0]],
                  [data.end_point[1], data.end_point[0]],
                ] || [],
            },
          },
        ],
      };
      return _data;
    },
    getFeature(path) {
      return [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: (path.points && path.points.coordinates) || [],
          },
        },
      ];
    },
    async updateDataPoint(newData) {
      // Update something.
      const start_point = newData?.start_point ? newData?.start_point[0] : "";
      const end_point = newData?.end_point ? newData?.end_point[0] : "";
      const percent_of_distance = newData?.percent_of_distance
        ? newData?.percent_of_distance[0]
        : "";
      const type_transport = newData?.type_transport
        ? newData?.type_transport[0]
        : "";

      let data = {
        start_point: start_point.split(","),
        end_point: end_point.split(","),
        type_transport,
        percent_of_distance,
      };

      try {
        if (
          start_point &&
          end_point &&
          percent_of_distance &&
          type_transport !== "flying"
        ) {
          data = await this.getDataPoint({
            start_point,
            end_point,
            percent_of_distance,
            type_transport,
          });
        }
      } catch (e) {
        console.log(e);
      }

      this.updateViewMap(data);
    },
  },
};
</script>

<style scoped>
.g-map-logo {
  position: absolute;
  bottom: 15px;
  left: 20px;
  width: 120px;
}
</style>
