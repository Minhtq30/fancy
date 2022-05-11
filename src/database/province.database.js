import DB from "./index";

const TABLE_NAME = "provinces";

const provinceDatabase = {
  add: (data) => {
    const request = DB();

    return new Promise((resolve, reject) => {
      request.onerror = function (error) {
        reject(error);
      };

      request.onsuccess = (e) => {
        const db = e.target.result;
        const transaction = db.transaction([TABLE_NAME], "readwrite");

        for (const item of data) {
          transaction.objectStore(TABLE_NAME).add(item);
        }

        transaction.complete = function () {
          resolve();
        };
      };
    });
  },
  get: () => {
    const request = DB();

    return new Promise((resolve, reject) => {
      request.onerror = function (error) {
        reject(error);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction([TABLE_NAME], "readonly");
        const store = transaction.objectStore(TABLE_NAME);

        store.getAll().onsuccess = function (eventGetAll) {
          resolve(eventGetAll.target.result);
        };
      };
    });
  },

  clear: () => {
    const request = DB();

    return new Promise((resolve, reject) => {
      request.onerror = function (error) {
        reject(error);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction([TABLE_NAME], "readwrite");
        const store = transaction.objectStore(TABLE_NAME);

        store.clear();
      };
    });
  },
};

export default provinceDatabase;
