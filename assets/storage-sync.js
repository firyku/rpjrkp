(function () {
  const endpoint = "api/storage.php";
  const databaseValues = new Map();
  const nativeGetItem = Storage.prototype.getItem;
  const nativeSetItem = Storage.prototype.setItem;
  const nativeRemoveItem = Storage.prototype.removeItem;

  try {
    const request = new XMLHttpRequest();
    request.open("GET", endpoint, false);
    request.send(null);
    if (request.status === 200) {
      const response = JSON.parse(request.responseText || "{}");
      Object.entries(response.items || {}).forEach(([key, value]) => {
        databaseValues.set(key, String(value));
        nativeRemoveItem.call(window.localStorage, key);
      });
    }
  } catch (error) {
    console.warn("Sinkronisasi awal database belum tersedia.", error);
  }

  Storage.prototype.getItem = function (key) {
    if (this === window.localStorage && String(key).startsWith("rpjrkp-")) {
      return databaseValues.has(String(key)) ? databaseValues.get(String(key)) : null;
    }
    return nativeGetItem.call(this, key);
  };

  Storage.prototype.setItem = function (key, value) {
    if (this !== window.localStorage || !String(key).startsWith("rpjrkp-")) {
      nativeSetItem.call(this, key, value);
      return;
    }

    databaseValues.set(String(key), String(value));
    nativeRemoveItem.call(window.localStorage, key);

    fetch(endpoint, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: String(key), value: String(value) }),
      keepalive: true,
    }).catch((error) => console.warn("Data belum tersinkron ke database.", error));
  };
})();
