const hideChat = (item) => {
    const hideChatElement = document.querySelector("#hide-chat");
    const eyeIcon = hideChatElement.querySelector(".chat-icon-eye");
    const eyeSlashIcon = hideChatElement.querySelector(".chat-icon-eye-slash");
    
    if(item.getAttribute("chatvisible") === 'true') {
        hideChatElement.setAttribute("chatvisible", "false");
        window.rep.hide();
        // Show eye-slash icon, hide eye icon
        if (eyeIcon) eyeIcon.style.display = 'none';
        if (eyeSlashIcon) eyeSlashIcon.style.display = 'block';
    } else {
        window.rep.show();
        hideChatElement.setAttribute("chatvisible", "true");
        // Show eye icon, hide eye-slash icon
        if (eyeIcon) eyeIcon.style.display = 'block';
        if (eyeSlashIcon) eyeSlashIcon.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    rep.on('load', () => {
        console.log('Rep loaded');
        const hideChatElement = document.querySelector("#hide-chat");
        if (hideChatElement) {
            hideChatElement.setAttribute("chatvisible", "true");
            // Ensure eye icon is visible on load
            const eyeIcon = hideChatElement.querySelector(".chat-icon-eye");
            const eyeSlashIcon = hideChatElement.querySelector(".chat-icon-eye-slash");
            if (eyeIcon) eyeIcon.style.display = 'block';
            if (eyeSlashIcon) eyeSlashIcon.style.display = 'none';
        }
    });
})