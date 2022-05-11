function convertDistrictToOption(provinces) {
  const options = [];

  provinces.forEach((item) => {
    options.push({
      value: item.id,
      label: item.name,
    });
  });

  return options;
}

export default convertDistrictToOption;
