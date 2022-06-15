import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js'
import { getDatabase, ref, child, get, push, remove, set } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js'

const firebaseConfig = {
  apiKey: "AIzaSyCkrrH0grVByOer9uFNihCLESnGVMM0guw",
  authDomain: "iot-draintector.firebaseapp.com",
  databaseURL: "https://iot-draintector-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "iot-draintector",
  storageBucket: "iot-draintector.appspot.com",
  messagingSenderId: "212413131112",
  appId: "1:111111111111:web:5d9a5537h11244257h1c81"
};

function typedArrayToURL(data, mimeType) {
  return URL.createObjectURL(new Blob([JSON.stringify(data)], {type: mimeType}))
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function firebaseFetchData(uuid) {
    return get(ref(database, uuid)).then((snapshot) => {
        return snapshot.val()
    });
}

async function firebaseGetData(uuid) {
    const drainData = await firebaseFetchData(`/-DRAIN_LIST/${uuid}`);
    const drainName = await firebaseFetchData(`/-DRAIN_UUID/${uuid}`);

    let returnData = [];
    for (let key in drainData) {
        const element = drainData[key];
        returnData.push({ time: new Date(element.epoch),
                          cl: parseFloat(element.current_level),
                          tl: parseFloat(element.flood_threshold) });
    }

    return returnData;
}

var times = {}, inputs = {};

async function generateDataPoint(uuid, name, current, threshold) {
    if (!times[uuid])
        times[uuid] = Date.now();
    else
        times[uuid] += 15 * 60 * 1000;
    let getRef = await get(ref(database, `/uuids/${uuid}`)).then(snap=>snap.val());
    if (!getRef.exists()) await push(ref(database, `uuids/${uuid}`), name);
    let path = "/data/" + uuid;
    let pushRef = await push(ref(database, path), {
        current_level: current,
        epoch: time,
        flood_threshold: threshold
    });
    let updateRef = await push(ref(database, `/updates/${uuid}`), times[uuid]);
    let pushed = await get(pushRef);
    let updated = await get(updateRef);
    console.log(JSON.stringify(pushed));
    console.log(JSON.stringify(updated));
}

async function callthat(uuid) {
    await generateDataPoint(uuid, name, current, threshold);
}
var button = document.createElement("button");
button.innerHTML = "send data";
button.addEventListener("click", callthat);
document.getElementById("root").append(button);

async function getall(_) {
    let data = await get(ref(database, '/')).then(snapshot=>snapshot.val());
    var log = document.getElementById("log");
    log.innerHTML += JSON.stringify(data);
}
var getall_button = document.createElement("button");
getall_button.innerHTML = "get all";
getall_button.addEventListener("click", getall);
document.getElementById("root").append(getall_button);

async function getuuid() {
    let data = await get(ref(database, '/')).then(snapshot=>snapshot.val());
    var log = document.getElementById("log");
    log.innerHTML += JSON.stringify(data);
}
var getuuid_button = document.createElement("button");
getuuid_button.innerHTML = "get uuid";
getuuid_button.addEventListener("click", (value)=>getuuid(value));
document.getElementById("root").append(getuuid_button);

var in1 = document.getElementById("uuid");
var in2 = document.getElementById("name");
var in3 = document.getElementById("wl");
var in4 = document.getElementById("al");

function handle(id, value) {
    inputs[id] = value;
}

in1.addEventListener("input", (value) => handle(in1.id, value));
in2.addEventListener("input", (value) => handle(in2.id, value));
in3.addEventListener("input", (value) => handle(in3.id, value));
in4.addEventListener("input", (value) => handle(in4.id, value));
