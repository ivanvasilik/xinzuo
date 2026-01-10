const hideChat = (item) => {
    let flag = !!item.chatVisible

    if(flag) {
        window.rep.hide()
        item.setAttribute("chatVisible", "true");
    } else {
        window.rep.show()
        item.setAttribute("chatVisible", "false");
    }
}