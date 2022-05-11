import { ref, onMounted, watch } from "vue";
import service from "@/services";

export default function useWard(districtId) {
  const wards = ref([]);
  const getWard = async () => {
    if (districtId.value) {
      wards.value = await service.$address.browseWardListWithCache(
        districtId.value
      );
    } else {
      wards.value = [];
    }
  };

  onMounted(getWard);
  watch(districtId, getWard);

  return {
    wards,
    getWard,
  };
}
