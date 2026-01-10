const hideChat = (item) => {
    item.setAttribute("chatVisible", "false");

    if(item.chatVisible) {
        window.rep.hide()
    } else {
        window.rep.show()
    }
}