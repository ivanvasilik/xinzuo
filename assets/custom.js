const hideChat = (item) => {
    console.log(item.getAttribute("chatvisible") === 'true');
    
    if(item.getAttribute("chatvisible") === 'true') {
        document.querySelector("#hide-chat").setAttribute("chatvisible", false);
        window.rep.hide()
    } else {
        window.rep.show()
        document.querySelector("#hide-chat").setAttribute("chatvisible", true);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    rep.on('load', () => {
        console.log('Rep loaded');
        document.querySelector("#hide-chat").setAttribute("chatvisible", true);
        // window.rep.show()
    });

    rep.on('close', () => {

    });
})