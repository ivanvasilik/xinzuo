document.addEventListener("DOMContentLoaded", () => {
    
    document.addEventListener("mousemove", (e) => {
    const btn = document.getElementById("edge-button");
    const triggerZone = window.innerWidth - 30; // px from right edge

    if (e.clientX > triggerZone) {
        btn.style.right = "0px"; // show
    } else {
        btn.style.right = "-120px"; // hide
    }
});
   
});



// const hideChat = () => {
//     window.rep.hide()
// }