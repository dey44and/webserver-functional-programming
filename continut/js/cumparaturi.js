class Produs {
    constructor(id, nume, cantitate) {
        this.id = id;
        this.nume = nume;
        this.cantitate = cantitate;
    }

    toJSON() {
        return {
            id: this.id,
            nume: this.nume,
            cantitate: this.cantitate
        }
    }
}

class StorageType {
    save() {
        throw new Error("You have to implement this method");
    }

    getMaxIndex() {
        throw new Error("You have to implement this method");
    }

    setMaxIndex() {
        throw new Error("You have to implement this method");
    }
}

class LocalStorage extends StorageType {
    save(item) {
        localStorage.setItem(item.id, JSON.stringify(item));
        this.setMaxIndex(item.id)
    }

    getMaxIndex() {
        return parseInt(localStorage.getItem("maxID"), 10) ?? 1;
    }

    setMaxIndex(id) {
        localStorage.setItem("maxID", parseInt(id, 10) + 1);
    }
}

class IndexStorage extends StorageType {
    constructor() {
        super();
        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

        const request = indexedDB.open("ProductsDB", 1);

        request.onerror = () => {
            console.log("Error IndexedDB");
        }

        request.onupgradeneeded = () => {
            const db = request.result;
            const store = db.createObjectStore("products", { keyPath: "id" });

            store.createIndex("prod_name", ["nume"], { unique: false });
            store.createIndex("prod_quant", ["cantitate"], { unique: false });
        }
    }

    save(item) {
        const request = indexedDB.open("ProductsDB", 1);

        request.onerror = () => {
            console.log("Error IndexedDB");
        }
        request.onsuccess = e => {
            const db = e.target.result;
            const transaction = db.transaction("products", "readwrite");

            const store = transaction.objectStore("products");

            store.put({ id: item.id, nume: item.nume, cantitate: item.cantitate });

            transaction.oncomplete = () => {
                db.close();
            };
        }
    }

    async getMaxIndex() {
        let promise = new Promise((resolve) => {
            const request = indexedDB.open("ProductsDB", 1);

            request.onerror = () => {
                console.log("Error IndexedDB");
            }

            request.onsuccess = e => {
                const db = e.target.result;
                const transaction = db.transaction("products", "readwrite");

                const store = transaction.objectStore("products");
                const all = store.getAll();

                transaction.oncomplete = () => {
                    const rez = Math.max(...all.result.map(elem => elem.id));
                    resolve(rez + 1);
                }
            }
        });

        return await promise;
    }

    async getAllItems() {
        let promise = new Promise((resolve) => {
            const request = indexedDB.open("ProductsDB", 1);

            request.onerror = () => {
                console.log("Error IndexedDB");
            }

            request.onsuccess = e => {
                const db = e.target.result;
                const transaction = db.transaction("products", "readwrite");

                const store = transaction.objectStore("products");
                const all = store.getAll();

                transaction.oncomplete = () => {
                    resolve(all.result)
                }
            }
        });

        return await promise;
    }
}

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            // everything except Firefox
            (e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === "QuotaExceededError" ||
                // Firefox
                e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        );
    }
}

const addToList = () => {
    const nume = document.getElementById("product").value;
    const cantitate = document.getElementById("quantity").value;
    const localOption = document.getElementById("LocalStorage");
    const indexedOption = document.getElementById("IndexedDB");

    if (nume === "" || cantitate === "")
        return;

    if (localOption.checked)
        addToListLocal(nume, cantitate);
    
    if (indexedOption.checked)
        addToListIndexed(nume, cantitate);
}

const addToListLocal = (nume, cantitate) => {
    const storage = new LocalStorage();

    let produs = new Produs(storage.getMaxIndex(), nume, cantitate);

    const lista = document.getElementById("list");
    const row = document.createElement("tr");
    const idCell = document.createElement("td");
    const numeCell = document.createElement("td");
    const cantitateCell = document.createElement("td");

    idCell.textContent = produs.id;

    numeCell.textContent = produs.nume;
    cantitateCell.textContent = produs.cantitate;

    row.appendChild(idCell);
    row.appendChild(numeCell);
    row.appendChild(cantitateCell);

    lista.appendChild(row);

    if (storageAvailable("localStorage")) {
        storage.save(produs)
    } else {
        alert("Ai browser din Syria.");
    }
}

const addToListIndexed = (nume, cantitate) => {
    const storage = new IndexStorage();
    storage.setMaxIndex(0);

    storage.getMaxIndex().then(id => {
        let produs = new Produs(id, nume, cantitate);

        const lista = document.getElementById("list");
        const row = document.createElement("tr");
        const idCell = document.createElement("td");
        const numeCell = document.createElement("td");
        const cantitateCell = document.createElement("td");

        idCell.textContent = produs.id;

        numeCell.textContent = produs.nume;
        cantitateCell.textContent = produs.cantitate;

        row.appendChild(idCell);
        row.appendChild(numeCell);
        row.appendChild(cantitateCell);

        lista.appendChild(row);

        storage.save(produs)
    });
}

function loadListLocal() {
    if (storageAvailable("localStorage")) {
        const lista = document.getElementById("list");

        while (lista.childNodes.length > 2)
            lista.removeChild(lista.lastChild);

        for (let i = 1; i < localStorage.getItem("maxID") ?? 0; i++) {
            const row = document.createElement("tr");
            const idCell = document.createElement("td");
            const numeCell = document.createElement("td");
            const cantitateCell = document.createElement("td");

            const data = JSON.parse(localStorage.getItem(i));

            idCell.textContent = data.id;
            numeCell.textContent = data.nume;
            cantitateCell.textContent = data.cantitate;

            row.appendChild(idCell);
            row.appendChild(numeCell);
            row.appendChild(cantitateCell);

            lista.appendChild(row);
        }
    } else {
        alert("Ai browser din Syria.");
    }
}

const loadListIndexed = () => {
    const storage = new IndexStorage();
    const lista = document.getElementById("list");

    while (lista.childNodes.length > 2)
        lista.removeChild(lista.lastChild);

    storage.getAllItems().then(response => {
        response.forEach(data => {
            const row = document.createElement("tr");
            const idCell = document.createElement("td");
            const numeCell = document.createElement("td");
            const cantitateCell = document.createElement("td");

            idCell.textContent = data.id;
            numeCell.textContent = data.nume;
            cantitateCell.textContent = data.cantitate;

            row.appendChild(idCell);
            row.appendChild(numeCell);
            row.appendChild(cantitateCell);

            lista.appendChild(row);
        });
    });
}

const listWorker = new Worker("js/worker.js");

const notifyWorker = () => {
    let nextID = localStorage.getItem("maxID");
    listWorker.postMessage([nextID]);
}

listWorker.onmessage = () => {
    console.log("Adding element");
    addToList();
}