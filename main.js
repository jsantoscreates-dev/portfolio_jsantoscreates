(function () {
  function revealCards() {
    var content = document.querySelector(".content");
    if (!content || !content.querySelector(".project-card")) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      content.classList.add("cards-animate");
      return;
    }

    requestAnimationFrame(function () {
      content.classList.add("cards-animate");
    });
  }

  function applyVideoSources() {
    var mq = window.matchMedia("(max-width: 767px)");
    var videos = document.querySelectorAll(
      ".project-card__media video, .case-hero__media video, .case-section__media video"
    );

    videos.forEach(function (video) {
      var sources = video.querySelectorAll("source");
      if (sources.length < 2) return;

      var target = mq.matches ? sources[0] : sources[sources.length - 1];
      var nextSrc = target.getAttribute("src");
      if (!nextSrc || video.getAttribute("src") === nextSrc) return;

      video.src = nextSrc;
      video.load();
    });
  }

  function initProjectVideos() {
    var videos = document.querySelectorAll(
      ".project-card__media video, .case-hero__media video, .case-section__media video"
    );
    if (!videos.length) return;

    applyVideoSources();

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var mq = window.matchMedia("(max-width: 767px)");

    function playVideos() {
      if (reduceMotion) {
        videos.forEach(function (video) {
          video.pause();
          video.removeAttribute("autoplay");
        });
        return;
      }

      videos.forEach(function (video) {
        video.play().catch(function () {
          /* autoplay bloqueado — o poster fica visível */
        });
      });
    }

    playVideos();

    mq.addEventListener("change", function () {
      applyVideoSources();
      playVideos();
    });
  }

  function init() {
    revealCards();
    initProjectVideos();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
