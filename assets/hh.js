const imageThumbnail = () => {
    const thumbnail = document.querySelector("slideshow-controls");
    console.log(thumbnail);
}

window.addEventListener('DOMContentLoaded', () => {
    imageThumbnail();
});

window.addEventListener('resize', imageThumbnail());