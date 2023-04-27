var canvas, ctx, borderColorPicker, fillColorPicker;
var learnPage = false;

schimbaContinut('acasa');

/* Browser informations - Section 1 */

function loadInfo() {
  if(learnPage) {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    getTime();
    // Timer for time
    setInterval(getTime, 1000);

    // Browser info
    let elementOrigin = document.getElementById("origin");
    let elementInfo = document.getElementById("info");
    elementOrigin.innerHTML = "Origin: " + location.href;
    elementInfo.innerHTML = "Browser name: " + navigator.appCodeName + " " + navigator.appName + "</br>Browser version: " + 
                            navigator.appVersion + "</br>Operating system: " + navigator.oscpu;

    let elementLocation = document.getElementById("location");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            elementLocation.innerHTML = "Location: (Latitude: " + latitude + ", Longitude: " + longitude + ")";
        });
    } else {
        elementLocation.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
}

function getTime() {
  if(learnPage) {
    let element = document.getElementById("current-time");
    element.innerHTML = "Ora exacta: " + (new Date());
  }
}

/* Get mouse coordinates and save - Section 2*/
function loadCanvas() {
  if(learnPage) {
    function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width,
        scaleY = canvas.height / rect.height;
    
      return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
      }
    }
  
    let start = {};
    function startRect(e) {
        start = getMousePos(canvas, e);
    }
    window.addEventListener("mousedown", startRect);
  
    let stop = {};
    function stopRect(e) {
        stop = getMousePos(canvas, e);
  
        borderColorPicker = document.getElementById("border-color-picker");
        fillColorPicker = document.getElementById("fill-color-picker");
  
        ctx.beginPath();
        ctx.rect(start.x, start.y, stop.x - start.x, stop.y - start.y);
        ctx.strokeStyle = borderColorPicker.value;
        ctx.fillStyle = fillColorPicker.value;
        ctx.fill();
        ctx.stroke();
    }
    window.addEventListener("mouseup", stopRect);
  }
}

/* Edit table - Section 3 */

function insertRow() {
    //Obținem poziția introdusă de utilizator
    var pos = document.getElementById("position").value;
    
    //Obținem referința la tabel
    var table = document.getElementById("table");
    
    //Creăm un nou rând
    var newRow = table.insertRow(pos);
    
    //Adăugăm celule noi în rândul nou creat
    for (var i = 0; i < table.rows[0].cells.length; i++) {
      var newCell = newRow.insertCell(i);
      newCell.innerHTML = "New Cell";
    }
    
    //Obținem valoarea color picker-ului
    var color = document.getElementById("color-picker").value;
    
    //Setăm culoarea de fundal a celulelor din rândul nou creat
    for (var i = 0; i < newRow.cells.length; i++) {
      newRow.cells[i].style.backgroundColor = color;
    }
}

function insertColumn() {
    //Obținem poziția introdusă de utilizator
    var pos = document.getElementById("position").value;
    
    //Obținem referința la tabel
    var table = document.getElementById("table");
    
    //Adăugăm celule noi în fiecare rând
    for (var i = 0; i < table.rows.length; i++) {
      var newCell = table.rows[i].insertCell(pos);
      newCell.innerHTML = "New Cell";
    }
    
    //Obținem valoarea color picker-ului
    var color = document.getElementById("color-picker").value;
    
    //Setăm culoarea de fundal a celulelor din coloana nou creată
    for (var i = 0; i < table.rows.length; i++) {
      table.rows[i].cells[pos].style.backgroundColor = color;
    }
}
  
/* Load content for website */
function schimbaContinut(resource, fun1, fun2) {
  var xhttp = new XMLHttpRequest(); // Creează obiectul XMLHttpRequest
  var fileName = resource + ".html";

  if(resource == "invat") {
    learnPage = true;
  } else {
    learnPage = false;
  }
  console.log("Status: " + learnPage);

  xhttp.onreadystatechange = function() { // Se apelează atunci când se schimbă starea cererii
    if (this.readyState == 4 && this.status == 200) { // Dacă cererea este finalizată și răspunsul este OK
      document.getElementById("content").innerHTML = this.responseText; // Pune conținutul în elementul cu id-ul "continut"
      if(resource == "invat") {
        if(fun1 && learnPage) {
          window[fun1]();
        }
        if(fun2 && learnPage) {
          window[fun2]();
        }
      }
      else {
        if (fun1) {
          var elementScript = document.createElement('script');
            elementScript.onload = function () {
              console.log("hello");
              if (fun2) {
                window[fun2]();
            }
          };
          elementScript.src = fun1;
          document.head.appendChild(elementScript);
          } else {
            if (fun2) {
              window[fun2]();
            }
          }
      }
    }
  };
  xhttp.open("GET", fileName, true); // Inițializează cererea GET către fișierul cu numele dat
  xhttp.send(); // Trimite cererea
}

/* Verifica pagina de login */

const verificaJSON = () => {
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const statusItem = document.getElementById("status")
            const data = JSON.parse(this.responseText);
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            for (let i = 0; i < data.length; i++) {
                if (data[i]["username"] === username && data[i]["password"] === password) {
                    statusItem.style.color = "green";
                    statusItem.innerHTML = "Utilizatorul exista!";
                    return;
                }
            }
            statusItem.style.color = "red";
            statusItem.innerHTML = "Utilizatorul nu exista!";
        }
    };
    xhttp.open("GET", "resurse/utilizatori.json", true);
    xhttp.send();
}