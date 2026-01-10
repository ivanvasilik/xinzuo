const hideChat = (item) => {
    console.log(item);
    
    if(item.chatVisible) {
        window.rep.hide()
    } else {
        window.rep.show()
    }
}

document.addEventListener("DOMContentLoaded", () => {
    rep.on('load', () => {
        console.log('Rep loaded');
        document.querySelector("#hide-chat").setAttribute("chatVisible", "true");
    });

    rep.on('open', () => {
        console.log('Rep is open');
        document.querySelector("#hide-chat").setAttribute("chatVisible", "true");

    });

    rep.on('close', () => {
        console.log('Rep is closed');
        document.querySelector("#hide-chat").setAttribute("chatVisible", "false");
    });
})