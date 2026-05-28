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
    var gestureArmed = false;

    function playVideos() {
      if (reduceMotion) {
        videos.forEach(function (video) {
          video.pause();
          video.removeAttribute("autoplay");
        });
        return;
      }

      videos.forEach(function (video) {
        // Brave/Chromium pode bloquear autoplay se estas flags não estiverem setadas
        // como propriedades (mesmo que existam como atributos no HTML).
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;

        video.play().catch(function () {
          /* autoplay bloqueado — o poster fica visível */
        });
      });
    }

    function armGestureReplay() {
      if (gestureArmed) return;
      gestureArmed = true;

      function onFirstGesture() {
        playVideos();
        window.removeEventListener("click", onFirstGesture, { passive: true });
        window.removeEventListener("touchstart", onFirstGesture, { passive: true });
        window.removeEventListener("keydown", onFirstGesture);
        window.removeEventListener("scroll", onFirstGesture, { passive: true });
      }

      window.addEventListener("click", onFirstGesture, { passive: true, once: true });
      window.addEventListener("touchstart", onFirstGesture, { passive: true, once: true });
      window.addEventListener("keydown", onFirstGesture, { once: true });
      window.addEventListener("scroll", onFirstGesture, { passive: true, once: true });
    }

    playVideos();
    armGestureReplay();

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
