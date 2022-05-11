function convertWardToOption(wards) {
  const options = [];

  wards.forEach((item) => {
    options.push({
      value: item.id,
      label: item.name,
    });
  });

  return options;
}

export default convertWardToOption;
