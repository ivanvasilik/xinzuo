const hideChat = (item) => {
    
    if(item.chatVisible) {
        window.rep.hide()
        item.setAttribute("chatVisible", "true");
    } else {
        window.rep.show()
        item.setAttribute("chatVisible", "false");
    }
}