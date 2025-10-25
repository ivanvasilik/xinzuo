const imageThumbnail = () => {
    const thumbnail = document.querySelector("slideshow-controls");
    if (thumbnail) {
        thumbnail.setAttribute("pagination-position", "center");
    }
    console.log(thumbnail);
}

window.addEventListener('DOMContentLoaded', () => {
    imageThumbnail();
});

window.addEventListener('resize', imageThumbnail());