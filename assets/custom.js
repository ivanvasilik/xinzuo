const hideChat = (item) => {
    let flag = !item.chatVisible;
    console.log('flag', flag)

    if(flag) {
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
        item.setAttribute("chatVisible", "false");

    });

    rep.on('close', () => {
        console.log('Rep is closed');
        item.setAttribute("chatVisible", "true");
    });
})