export default function normalize(data) {
  let ids = [];
  let byId = {};

  for (let item of data) {
    ids.push(item.id);
    byId[item.id] = item;
  }

  return { ids, byId };
}
