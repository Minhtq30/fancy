function convertHamletToOption(hamlets) {
  const options = [];

  hamlets.forEach((item) => {
    options.push({
      value: item.id,
      label: item.name,
    });
  });

  return options;
}

export default convertHamletToOption;
