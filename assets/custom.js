const hideChat = (item) => {
    if(item.chatVisible) {
        window.rep.hide()
    } else {
        window.rep.show()
    }
}

document.addEventListener("DOMContentLoaded", () => {
    rep.on('load', () => {
        console.log('Rep loaded');
        item.setAttribute("chatVisible", "true");
    });

    rep.on('open', () => {
        console.log('Rep is open');
        item.setAttribute("chatVisible", "true");

    });

    rep.on('close', () => {
        console.log('Rep is closed');
        item.setAttribute("chatVisible", "false");
    });
})