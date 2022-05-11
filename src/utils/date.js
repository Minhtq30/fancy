export const formatMomentDate = (momentDate, format) => {
  const date = new Date(momentDate._d);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  if (format === "DD-MM-YYYY") {
    return `${day}-${month}-${year}`;
  }

  if (format === "DD-MM") {
    return `${day}-${month}`;
  }

  if (format === "DD/MM") {
    return `${day}/${month}`;
  }

  if (format === "H:M ngày DD/MM/YYYY") {
    return `${hours}:${minutes} ngày ${day}/${month}/${year}`;
  }

  if (format === "H:M DD/MM/YYYY") {
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }

  if (format == "hh:mm") {
    return `${hours}:${minutes}`;
  }

  if (format == "hh:mm DD/MM") {
    return `${hours}:${minutes} ${day}/${month}`;
  }

  return `${year}-${month}-${day}`;
};

export const formatDateTimeRequest = (_dateTime, withoutTime = false) => {
  if (!_dateTime && Number(_dateTime) !== 0) return "";
  try {
    const newDate = new Date(_dateTime);

    const day = newDate.getDate().toString().padStart(2, "0");
    const month = (newDate.getMonth() + 1).toString().padStart(2, "0");
    const year = newDate.getFullYear();

    const hours = newDate.getHours().toString().padStart(2, "0");
    const minutes = newDate.getMinutes().toString().padStart(2, "0");
    const seconds = newDate.getSeconds().toString().padStart(2, "0");

    if (withoutTime) {
      return `${year}-${month}-${day}`;
    }
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error(error);
    return _dateTime;
  }
};

export const formatDayTime = (time) => {
  const dateTime = new Date(time);
  const day = dateTime.getDate().toString().padStart(2, "0");
  const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
  const year = dateTime.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formatCountdownTime = (_timeString) => {
  const now = new Date();
  const dateTime = new Date(_timeString);

  const seconds = Math.floor((now - dateTime) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days) return `${days} ngày trước`;
  if (hours) return `${hours} giờ truóc`;
  if (minutes) return `${minutes} phút trước`;
  return `${seconds} giây truóc`;
};

export const formatCreatedEventProduct = (_createdTs) => {
  const now = new Date().getTime();
  const totalSeconds = Math.floor((now - _createdTs) / 1000);

  if (totalSeconds < 60) return "Vừa mới";
  if (totalSeconds < 60 * 60) {
    const totalMinutes = Math.floor(totalSeconds / 60);
    return `${totalMinutes} phút`;
  }
  if (totalSeconds < 60 * 60 * 24) {
    const totalHours = Math.floor(totalSeconds / (60 * 60));
    return `${totalHours} giờ`;
  }

  const createdTs = new Date(_createdTs);

  return `${createdTs.getDate().toString().padStart(2, "0")}/${(
    createdTs.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}`;
};
