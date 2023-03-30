function loadInfo() {
    setInterval(getTime, 1000)
    let elementOrigin = document.getElementById("origin")
    let elementInfo = document.getElementById("info")
    elementOrigin.innerHTML = "Origin: " + location.href
    elementInfo.innerHTML = "Browser name: " + navigator.appName + "</br>Browser version: " + navigator.appVersion
}

function getTime() {
    let element = document.getElementById("current-time")
    element.innerHTML = "Ora exacta: " + (new Date())
}