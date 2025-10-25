const imageThumbnail = () => {
    const thumbnail = document.querySelector("slideshow-controls");
    if (thumbnail) {
        if (window.innerWidth > 750) {
            thumbnail.setAttribute("pagination-position", "left");
        }
        else {
            thumbnail.setAttribute("pagination-position", "center");
        }
    }
    console.log(thumbnail);
}

window.addEventListener('DOMContentLoaded', () => {
    imageThumbnail();
});

window.addEventListener('resize', imageThumbnail());