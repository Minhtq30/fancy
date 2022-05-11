import { ref, onMounted, watch } from "vue";
import service from "@/services";

export default function useDistrict(provinceId) {
  const districts = ref([]);
  const getDistrict = async () => {
    if (provinceId.value) {
      districts.value = await service.$address.browseDistrictListWithCache(
        provinceId.value
      );
    } else {
      districts.value = [];
    }
  };

  onMounted(getDistrict);
  watch(provinceId, getDistrict);

  return {
    districts,
    getDistrict,
  };
}
