import "../../scss/pages/home.scss";

// ─── Logo strip marquee: keep a constant speed regardless of item count ───
// The CSS animation always travels half of .logo-strip__inner's scroll width
// (the logo set is duplicated for a seamless loop) in a fixed duration, so a
// strip with more logos is wider and visibly speeds up. Here we measure the
// track and set its duration from a constant px/sec speed instead.
(() => {
    const SPEED_PX_PER_SEC = 60; // tune to taste
    const FALLBACK_DURATION = 28; // seconds, used if a track can't be measured yet
    let resizeTimer;

    const setDurations = () => {
        document.querySelectorAll(".logo-strip__inner").forEach((track) => {
            const distance = track.scrollWidth / 2;
            const duration = distance ? distance / SPEED_PX_PER_SEC : FALLBACK_DURATION;
            track.style.animationDuration = `${duration}s`;
        });
    };

    const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setDurations, 150);
    };

    document.addEventListener("DOMContentLoaded", setDurations);
    window.addEventListener("load", setDurations); // re-measure once logo images have loaded
    window.addEventListener("resize", onResize);
})();
