const hideChat = (item) => {
    console.log(item, item.getAttribute("chatvisible"));
    
    if(item.getAttribute("chatvisible")) {
        window.rep.hide()
    } else {
        window.rep.show()
    }
}

document.addEventListener("DOMContentLoaded", () => {
    rep.on('load', () => {
        console.log('Rep loaded');
        document.querySelector("#hide-chat").setAttribute("chatvisible", true);
    });

    rep.on('open', () => {
        console.log('Rep is open');
        document.querySelector("#hide-chat").setAttribute("chatvisible", true);

    });

    rep.on('close', () => {
        console.log('Rep is closed');
        document.querySelector("#hide-chat").setAttribute("chatvisible", false);
    });
})