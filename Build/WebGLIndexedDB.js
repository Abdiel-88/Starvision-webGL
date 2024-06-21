mergeInto(LibraryManager.library, {
  LoadJSONDataIntoIndexedDB: function() {
    var request = indexedDB.open("StarvisionDB", 1);

    request.onerror = function(event) {
      console.log("Error opening IndexedDB:", event);
    };

    request.onsuccess = function(event) {
      var db = event.target.result;
      var transaction = db.transaction(["Planets"], "readwrite");
      var objectStore = transaction.objectStore("Planets");

      // Fetch the JSON data
      fetch('StreamingAssets/planetdata.json')
        .then(response => response.json())
        .then(data => {
          data.forEach(function(item) {
            objectStore.put(item);
          });
          console.log("Data loaded into IndexedDB.");
        })
        .catch(error => {
          console.error("Error fetching JSON data:", error);
        });
    };

    request.onupgradeneeded = function(event) {
      var db = event.target.result;
      db.createObjectStore("Planets", { keyPath: "Name" });
    };
  },

  GetPlanetsFromIndexedDB: function() {
    var request = indexedDB.open("StarvisionDB", 1);

    request.onerror = function(event) {
      console.log("Error opening IndexedDB:", event);
    };

    request.onsuccess = function(event) {
      var db = event.target.result;
      var transaction = db.transaction(["Planets"], "readonly");
      var objectStore = transaction.objectStore("Planets");
      var getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = function(event) {
        var planets = event.target.result;
        console.log("Planets:", planets);
        var jsonString = JSON.stringify(planets);
        SendMessage('DatabaseManager', 'ReceivePlanetsData', jsonString);
      };

      getAllRequest.onerror = function(event) {
        console.log("Error retrieving data:", event);
      };
    };
  },

  GetPlanetByNameFromIndexedDB: function(name) {
    var request = indexedDB.open("StarvisionDB", 1);

    request.onerror = function(event) {
      console.log("Error opening IndexedDB:", event);
    };

    request.onsuccess = function(event) {
      var db = event.target.result;
      var transaction = db.transaction(["Planets"], "readonly");
      var objectStore = transaction.objectStore("Planets");
      var getRequest = objectStore.get(name);

      getRequest.onsuccess = function(event) {
        var planet = event.target.result;
        console.log("Planet:", planet);
        var jsonString = JSON.stringify(planet);
        SendMessage('DatabaseManager', 'ReceivePlanetData', jsonString);
      };

      getRequest.onerror = function(event) {
        console.log("Error retrieving data:", event);
      };
    };
  }
});
