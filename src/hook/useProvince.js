import service from "@/services";
import { ref, onMounted } from "vue";
import common from "@/utils/common";

export default function useProvince(data) {
  const provinces = ref([]);
  const getProvince = async () => {
    if (data && data.length > 0) {
      provinces.value = data;
    } else {
      const response = await service.$address.browseProvinceListWithCache();
      const provinceConvert =
        common.convertLabelValueDataSource({
          dataSource: response,
          labelName: "name",
          valueName: "id",
          toStringValue: true,
        }) || [];
      provinces.value = provinceConvert;
    }
  };

  onMounted(getProvince);

  return {
    provinces,
    getProvince,
  };
}
