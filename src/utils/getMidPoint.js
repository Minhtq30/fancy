function getMidPoint(_lat1, _lon1, _lat2, _lon2) {
  const lat1 = (_lat1 * Math.PI) / 180;
  const lon1 = (_lon1 * Math.PI) / 180;
  const lat2 = (_lat2 * Math.PI) / 180;
  const lon2 = (_lon2 * Math.PI) / 180;

  const Bx = Math.cos(lat2) * Math.cos(lon2 - lon1);
  const By = Math.cos(lat2) * Math.sin(lon2 - lon1);
  const latMid = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By)
  );
  const lonMid = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

  return [latMid / (Math.PI / 180), lonMid / (Math.PI / 180)];
}

export default getMidPoint;
