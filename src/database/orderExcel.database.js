import DB from "./index";

const TABLE_NAME = "orderExcel";

const orderExcelDatabase = {
  add: (data) => {
    const request = DB();

    return new Promise((resolve, reject) => {
      request.onerror = function (error) {
        reject(error);
      };

      request.onsuccess = (e) => {
        const db = e.target.result;
        const transaction = db.transaction([TABLE_NAME], "readwrite");

        transaction.objectStore(TABLE_NAME).add({
          order_excel_config: data.order_excel_config,
          savedListOrder: data.savedListOrder,
          list_hub: data.list_hub,
          session_id: 1,
        });

        transaction.complete = function () {
          resolve();
        };
      };
    });
  },

  put: (data) => {
    const request = DB();

    return new Promise((resolve, reject) => {
      request.onerror = function (error) {
        reject(error);
      };

      request.onsuccess = (e) => {
        const db = e.target.result;
        const transaction = db.transaction([TABLE_NAME], "readwrite");

        transaction.objectStore(TABLE_NAME).put({
          order_excel_config: data.order_excel_config,
          savedListOrder: data.savedListOrder,
          list_hub: data.list_hub,
          session_id: 1,
        });

        transaction.complete = function () {
          resolve();
        };
      };
    });
  },

  get: () => {
    const session_id = 1;

    const request = DB();

    return new Promise((resolve, reject) => {
      request.onerror = function (error) {
        reject(error);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction([TABLE_NAME], "readonly");
        const store = transaction.objectStore(TABLE_NAME);

        store.get(session_id).onsuccess = function (event) {
          resolve(event.target.result);
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

        const requestClear = store.clear();

        requestClear.onsuccess = function () {
          resolve(true);
        };
      };
    });
  },
};

export default orderExcelDatabase;
