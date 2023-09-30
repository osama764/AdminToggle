// configuration of Project
const firebaseConfig = {
  apiKey: "AIzaSyAAUwKpK6j5fy3gTzMwamS5QHTJ7xSic0c",
  authDomain: "smart-test-ee901.firebaseapp.com",
  databaseURL: "https://smart-test-ee901-default-rtdb.firebaseio.com",
  projectId: "smart-test-ee901",
  storageBucket: "smart-test-ee901.appspot.com",
  messagingSenderId: "608199887325",
  appId: "1:608199887325:web:1830f4c5d50e2ce9c6ce34"
};

firebase.initializeApp(firebaseConfig);
// Get a reference to  RealTime Database service
const database = firebase.database();

let description = document.querySelector(".description");

let currentName;
let currentImage;
// Retrieve data from the URL
const urlParams = new URLSearchParams(window.location.search);
//Check for data in URL
if (urlParams.has("nameRoom") && urlParams.has("nameImage")) {
  currentName = decodeURIComponent(urlParams.get("nameRoom"));
  currentImage = decodeURIComponent(urlParams.get("nameImage"));

  //Display data on the page
  document.querySelector(".nameCurrentRoom").innerHTML += currentName;
  description.style.backgroundImage = currentImage;
} else {
  console.log("No user data found in URL");
}

let devices = document.querySelector(".devices");
let containPushButtons = document.getElementById("containPushButtons");
let NameOfDevice = document.querySelector(".NameOfDevice");
let contentDevices = document.querySelector(".contentDevices");
let addDevice = document.querySelector(".addDevice");
let closecontentdevices = document.querySelector(".closecontentdevices");
let addNewDevice = document.querySelector(".addNewDevice");
let body = document.querySelector("body");
let modal = document.querySelector("modal");

// button open Form add New Device in this Room
addDevice.addEventListener("click", () => {
  contentDevices.style.transform = "scale(1)";
});

// button close Form
closecontentdevices.addEventListener("click", () => {
  contentDevices.style.transform = "scale(0)";
});

addNewDevice.addEventListener("click", () => {
  // close form after adding new device
  contentDevices.style.transform = "scale(0)";

  // Call data from realtime
  let roomsRef = firebase.database().ref("Rooms");
  // if checkbox not Checked ====> : Normal device without bushing

  if (!containPushButtons.checked) {
    roomsRef
      .orderByChild("Name")
      .equalTo(currentName)
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const devicesArray = childSnapshot.val().devices || [];
          const newDevice = {
            Name: currentName+NameOfDevice.value,
            status: 0,
          };
          const deviceExists = devicesArray.some(
            (device) => device.Name === newDevice.Name
          );
          if (deviceExists) {
            // this message will speech after adding New Device in Room
            let welcomeMessage = new SpeechSynthesisUtterance(
              "This device already exists"
            );
            let speech = window.speechSynthesis;
            welcomeMessage.rate = 0.7;
            speech.speak(welcomeMessage);
            alert("This device already exists");

          } else {
            devicesArray.push(newDevice);
            childSnapshot.ref.update({ devices: devicesArray }).then(() => {
              DisplayDevices()
              DisplayPushDevices()
              console.log("تم إضافة الجهاز بنجاح!");
              // this message will speech after adding New Device in Room
              let welcomeMessage = new SpeechSynthesisUtterance(
                "A new device has been added to the room"
              );
              let speech = window.speechSynthesis;
              welcomeMessage.rate = 0.7;
              speech.speak(welcomeMessage);
            });
          }
        });
      })
      .catch((error) => {
        console.error("حدث خطأ أثناء إضافة الجهاز الجديد:", error);
      });

      
  } else {
    roomsRef
      .orderByChild("Name")
      .equalTo(currentName)
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const devicesArray = childSnapshot.val().devicesPush || [];
          const newDevice = {
            Name: currentName+"Push"+NameOfDevice.value,
            status: 0,
          };
          const deviceExists = devicesArray.some(
            (device) => device.Name === newDevice.Name
          );
          if (deviceExists) {
          // this message will speech after adding New Device in Room
          let welcomeMessage = new SpeechSynthesisUtterance(
            "This device already exists"
          );
          let speech = window.speechSynthesis;
          welcomeMessage.rate = 0.7;
          speech.speak(welcomeMessage);
          alert("This device already exists");
          } else {
            devicesArray.push(newDevice);
            childSnapshot.ref.update({ devicesPush: devicesArray }).then(() => {
              DisplayDevices()
              DisplayPushDevices()
              console.log("تم إضافة الجهاز بنجاح!");
                // this message will speech after adding New Device in Room
                let welcomeMessage = new SpeechSynthesisUtterance(
                  "A new device has been added to the room"
                );
                let speech = window.speechSynthesis;
                welcomeMessage.rate = 0.7;
                speech.speak(welcomeMessage);
            });
          }
        });
      })
      .catch((error) => {
        console.error("حدث خطأ أثناء إضافة الجهاز الجديد:", error);
      });


  }

});

// // استدعاء الدالتين تلقائيًا عند حدوث أي تغيير في البيانات

// View stored data from realtime Database ( Normal devices without bushing )
// View stored data from realtime Database ( Normal devices without bushing )
// function DisplayDevices() {
//   devices.innerHTML = "";
//   firebase.database().ref("Rooms")
//     .orderByChild("Name")
//     .equalTo(currentName)
//     .once("value", function(snapshot) { // استخدمت "once" بدلاً من "on" لضمان استدعاء البيانات مرة واحدة فقط

//       snapshot.forEach(function(roomSnapshot) {
//         const devicesArray = roomSnapshot.child("devices").val() || [];
//         if (Array.isArray(devicesArray)) {
//           devicesArray.forEach(function(device, i) {
//             let checked = device.status === 1 ? "checked" : "";
//             let card = `<div class="card border-0 p-2">
//               <span style="opacity:0">${i}</span>
//               <p class="nameOfDevice">${device.Name}</p>
//               <i class="fa-solid fa-trash-can deletbtnDevice"></i>
              
//               <div class="form-check form-switch d-block me-auto ms-auto">
//                 <input class="form-check-input" type="checkbox" role="switch" id="device_${i}" ${checked}>
//                 <label class="form-check-label" for="device_${i}"></label>
//               </div>
          
//               <span style="opacity:0">${roomSnapshot.key}</span>
//             </div>`;

//             // تحقق من عدم تكرار عرض الأجهزة القديمة
//             if (!devices.innerHTML.includes(card)) {
//               devices.innerHTML += card;
//             }
//           });
//         }
//       });
//     });
// }

function DisplayDevices() {
  devices.innerHTML = "";
  firebase.database().ref("Rooms")
    .orderByChild("Name")
    .equalTo(currentName)
    .on("value", function(snapshot) { // استخدمت "on" بدلاً من "once" للاشتراك في تحديثات البيانات
      devices.innerHTML = "";
      snapshot.forEach(function(roomSnapshot) {
        const devicesArray = roomSnapshot.child("devices").val() || [];
        if (Array.isArray(devicesArray)) {
          devicesArray.forEach(function(device, i) {
            let checked = device.status === 1 ? "checked" : "";
            let card = `<div class="card border-0 p-2">
              <span style="opacity:0">${i}</span>
              <p class="nameOfDevice">${device.Name}</p>
              <i class="fa-solid fa-trash-can deletbtnDevice"></i>
              
              <div class="form-check form-switch d-block me-auto ms-auto">
                <input class="form-check-input" type="checkbox" role="switch" id="device_${i}" ${checked}>
                <label class="form-check-label" for="device_${i}"></label>
              </div>
          
              <span style="opacity:0">${roomSnapshot.key}</span>
            </div>`;
      
            // تحقق من عدم تكرار عرض الأجهزة القديمة
            if (!devices.innerHTML.includes(card)) {

              devices.innerHTML += card;
            }
          });
        }
      });
    });
}
// View stored data from realtime Database (  devices  bushing )
// function DisplayPushDevices() {
//   devices.innerHTML = ""; // قمت بإضافة هذا السطر لتفريغ عنصر الـ devices قبل عرض الأجهزة الجديدة

//   firebase.database().ref("Rooms")
//     .orderByChild("Name")
//     .equalTo(currentName)
//     .once("value", function(snapshot) {

//       snapshot.forEach(function(roomSnapshot) {
//         const devicesArray = roomSnapshot.child("devicesPush").val() || [];

//         devicesArray.forEach(function(device, i) {
//           let card = `<div class="card border-0 p-2">
//             <span style="opacity:0">${i}</span>
//             <p class="nameOfDevice">${device.Name}</p>
//             <i class="fa-solid fa-trash-can deletbtnDevice pushbtn"></i>
//             <div class="container">
//               <button class="push btn btn-primary">Push</button>
//             </div>
      
//             <span style="opacity:0">${roomSnapshot.key}</span>
//           </div>`;
//           devices.innerHTML += card;
//         });
//       });
//     }, function(error) {
//       console.error("حدث خطأ أثناء قراءة الأجهزة:", error);
//     });
// }

function DisplayPushDevices() {

  firebase.database().ref("Rooms")
    .orderByChild("Name")
    .equalTo(currentName)
    .on("value", function(snapshot) { // استخدمت "on" بدلاً من "once" للاشتراك في تحديثات البيانات
  
      snapshot.forEach(function(roomSnapshot) {
        const devicesArray = roomSnapshot.child("devicesPush").val() || [];

        devicesArray.forEach(function(device, i) {
          let card = `<div class="card border-0 p-2">
            <span style="opacity:0">${i}</span>
            <p class="nameOfDevice">${device.Name}</p>
            <i class="fa-solid fa-trash-can deletbtnDevice pushbtn"></i>
            <div class="container">
              <button class="push btn btn-primary">Push</button>
            </div>
      
            <span style="opacity:0">${roomSnapshot.key}</span>
          </div>`;

          // تحقق من عدم تكرار عرض الأجهزة القديمة
          if (!devices.innerHTML.includes(card)) {
            devices.innerHTML += card;
          }
        });
      });
    }, function(error) {
      console.error("حدث خطأ أثناء قراءة الأجهزة:", error);
    });
}
// caling two functions during load Page
window.onload = () => {
  DisplayDevices();
  DisplayPushDevices();
};

// setInterval(() => {
//   DisplayDevices()
//   DisplayPushDevices()
// }, 3000);


// initialization of two variables to store index and name of device


let index;
let newNameOfDevice;

// container all Devices
devices.addEventListener("click", (e) => {
  
  // index and uid :==> (id) and name of current Device to use later during updating
  let uid = e.target.parentElement.parentElement.lastElementChild.innerHTML;
  index = e.target.parentElement.parentElement.firstElementChild.innerHTML;


  // uid and index for this current element
  uid = e.target.parentElement.lastElementChild.innerHTML;
  index = e.target.parentElement.firstElementChild.innerHTML;
  // the Element that contains classes : ( fa-solid fa-xmark deletbtnDevice notPushDevice ) will be deleted
  if (e.target.classList == "fa-solid fa-trash-can deletbtnDevice") {

    if (confirm("Confirm Delete")) {
      deleteDevice( uid,index,"devices");
    } else {
      alert("Delete Cancel")
    }
  }
  if (e.target.classList == "fa-solid fa-trash-can deletbtnDevice pushbtn") {
    if (confirm("Confirm Delete")) {
      deleteDevice(uid,index, "devicesPush");
    } else {
      alert("Delete Cancel")
    }

  }
});
// devices.addEventListener("change", (e) => {
//   // index and uid :==> (id) and name of current Device to use later during updating
//   let uid = e.target.parentElement.parentElement.lastElementChild.innerHTML;
//   index = e.target.parentElement.parentElement.firstElementChild.innerHTML;

//   // the Element that contains classes : ( chekinput ) and checked will be updated

//   if (e.target.classList == "form-check-input") {
//     if(e.target.checked){
//       newNameOfDevice =
//       e.target.parentElement.parentElement.firstElementChild.nextElementSibling
//         .innerHTML;

//     updateStatus(uid, index, 1,"devices");
//     }
//     else{
//       newNameOfDevice =
//       e.target.parentElement.parentElement.firstElementChild.nextElementSibling
//         .innerHTML;

//     updateStatus(uid, index, 0,"devices");
  
    
//     }
//   }



// });


// function delete device using index and uid
// استمع لحدث تغيير عنصر "devices"
// devices.addEventListener("change", (e) => {
//   // قم بالحصول على البيانات اللازمة للتحديث
//   let uid = e.target.parentElement.parentElement.lastElementChild.innerHTML;
//   let index = e.target.parentElement.parentElement.firstElementChild.innerHTML;
//   let newValue = e.target.checked ? 1 : 0;

//   // قم بتحديث القيمة في قاعدة البيانات في الوقت الحقيقي
//   const databaseRef = firebase.database().ref("Rooms").child(uid);

//   databaseRef.child("devices").child(index).child("status").set(newValue, function(error) {
//     if (error) {
//       console.error('حدث خطأ أثناء تحديث القيمة:', error);
//     } else {
//       console.log('تم تحديث القيمة بنجاح!');
//     }
//   });
// });


// استمع لحدث تغيير عنصر "devices"
devices.addEventListener("change", (e) => {
  let uid = e.target.parentElement.parentElement.lastElementChild.innerHTML;
  let index = e.target.parentElement.parentElement.firstElementChild.innerHTML;
  let newValue = e.target.checked ? 1 : 0;

  // قم بتحديث القيمة في قاعدة البيانات
  const databaseRef = firebase.database().ref("Rooms").child(uid);

  databaseRef.child("devices").child(index).child("status").set(newValue, function(error) {
    if (error) {
      console.error('حدث خطأ أثناء تحديث القيمة:', error);
    } else {
      console.log('تم تحديث القيمة بنجاح!');
    }
  });
});

// استمع لتغييرات البيانات في الوقت الحقيقي
const databaseRef = firebase.database().ref("Rooms");
databaseRef.on("value", function(snapshot) {
  const rooms = snapshot.val();

  // قم بتحديث حالة الـ checkbox بناءً على قيمة "status" المستلمة من Firebase
  rooms.forEach(room => {
    room.devices.forEach(device => {
      const checkbox = document.getElementById(device.id);
      checkbox.checked = device.status === 1;
    });
  });
});
function deleteDevice(uid, index, NameOfArray) {
  $.ajax({
    url: `https://smart-test-ee901-default-rtdb.firebaseio.com/Rooms/${uid}/${NameOfArray}/${index}.json`,
    method: "DELETE",
    success: function () {
      alert("Device deleted successfully");
    },
    error: function () {
      alert("Failed to delete Device");
    },
  });
}


devices.addEventListener("mousedown", (e) => {
  let uid = e.target.parentElement.parentElement.lastElementChild.innerHTML;
  index = e.target.parentElement.parentElement.firstElementChild.innerHTML;

  // the Element that contains classes : ( chekinput ) and checked will be updated
  if (e.target.classList == "push btn btn-primary") {

  
updateStatus(uid, index, 1,"devicesPush");

  }
});

devices.addEventListener("mouseup", (e) => {
  let uid = e.target.parentElement.parentElement.lastElementChild.innerHTML;
  index = e.target.parentElement.parentElement.firstElementChild.innerHTML;

  if (e.target.classList == "push btn btn-primary") {

updateStatus(uid, index, 0,"devicesPush");

  }
});


function updateStatus(uid, index, newValue, arrayName) {
  const databaseRef = firebase.database().ref("Rooms").child(uid);

  databaseRef.once("value", function(snapshot) {
    const dataArray = snapshot.child(arrayName).val();

    if (dataArray[index]) {
      dataArray[index].status = newValue;
    }

    databaseRef.child(arrayName).set(dataArray, function(error) {
      if (error) {
        console.error('حدث خطأ أثناء تحديث القيمة:', error);
      } else {
        console.log('تم تحديث القيمة بنجاح!');
      }
    });
  });
}

