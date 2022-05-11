import { ref, onMounted, watch } from "vue";
import _ from "lodash";

// Service
import service from "@/services";

// Util
import convertHamletToOption from "@/utils/convertHamletToOption";

export default function useHamlet(wardId) {
  const special_address = ref([]);
  const hamlet_address = ref([]);
  const getHamlet = async () => {
    if (wardId.value) {
      const hamlets = await service.$address.browseHamletAddress(wardId.value);
      special_address.value = convertHamletToOption(
        _.get(hamlets, ["data", "special_address"]) || []
      );
      hamlet_address.value = convertHamletToOption(
        _.get(hamlets, ["data", "hamlet_address"]) || []
      );
    } else {
      special_address.value = [];
      hamlet_address.value = [];
    }
  };

  onMounted(getHamlet);
  watch(wardId, getHamlet);

  return {
    special_address,
    hamlet_address,
    getHamlet,
  };
}
