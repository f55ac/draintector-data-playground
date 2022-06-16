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

var times = {}, inputs = {};

async function generateDataPoint() {
    let uuid = inputs["uuid"];

    console.log(inputs);
    if (!times[uuid])
        times[uuid] = Date.now();
    else
        times[uuid] += 15 * 60 * 1000;

    let getRef = await get(ref(database, `/uuids/${uuid}`));
    if (!getRef.exists()) await push(ref(database, `uuids/${uuid}`), name);
    let pushRef = await push(ref(database, `/data/${uuid}`), {
        current_level: inputs["cl"],
        epoch: times[uuid],
        flood_threshold: inputs["tl"]
    });
    let updateRef = await push(ref(database, `/updates/${uuid}`), times[uuid]);
    let pushed = await get(pushRef);
    let updated = await get(updateRef);
    console.log(JSON.stringify(pushed));
    console.log(JSON.stringify(updated));
}

var button = document.createElement("button");
button.innerHTML = "send data";
button.addEventListener("click", generateDataPoint);
document.getElementById("root").append(button);

// =====getter=====
var log = document.getElementById("log");
async function getall(_) {
    let data = await get(ref(database, '/')).then(snapshot=>snapshot.val());
    log.innerHTML += JSON.stringify(data);
}
var getall_button = document.createElement("button"); getall_button.innerHTML = "get all";
getall_button.addEventListener("click", getall);
document.getElementById("root").append(getall_button);

async function getuuid(uuid) {
    let data = await get(ref(database, `/data/${uuid}`)).then(snapshot=>snapshot.val());
    log.innerHTML += JSON.stringify(data);
}
var getuuid_button = document.createElement("button");
getuuid_button.innerHTML = "get uuid";
getuuid_button.addEventListener("click", (value)=>getuuid(value));
document.getElementById("root").append(getuuid_button);


var in1 = document.getElementById("uuid");
var in2 = document.getElementById("name");
var in3 = document.getElementById("cl");
var in4 = document.getElementById("tl");

in1.addEventListener("input", (event) => inputs[in1.id]=event.value);
in2.addEventListener("input", (event) => inputs[in2.id]=event.value);
in3.addEventListener("input", (event) => inputs[in3.id]=event.value);
in4.addEventListener("input", (event) => inputs[in4.id]=event.value);
