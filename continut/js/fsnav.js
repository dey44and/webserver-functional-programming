document.addEventListener("DOMContentLoaded", function() {
    var fsNavCloseBtn = document.querySelector(".fsnav_close");
    var checkbox = document.getElementById("toggle");

    checkbox.checked = "false";

    fsNavCloseBtn.addEventListener("click", function() {
        this.parentElement.className = "fsnav";
        checkbox.checked = "false";
    });

    
    checkbox.addEventListener("change", (event) => {
        if(!event.currentTarget.checked) {
            fsNavCloseBtn.parentElement.className = "fsnav fsnav--open";
        }
    });
});