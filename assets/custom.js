const hideChat = (item) => {
    let flag = !item.chatVisible;
    console.log('flag', flag)

    if(flag) {
        window.rep.show()
        item.setAttribute("chatVisible", "false");
    } else {
        window.rep.hide()
        item.setAttribute("chatVisible", "true");
    }
}