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
    var homeVideos = document.querySelectorAll(".project-card__media video");
    var caseVideos = document.querySelectorAll(".case-hero__media video, .case-section__media video");
    if (!homeVideos.length && !caseVideos.length) return;

    applyVideoSources();

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var mq = window.matchMedia("(max-width: 767px)");
    var gestureArmed = false;

    function prepareVideo(video) {
      // Alguns browsers (ex.: Brave/Chromium) exigem estas flags como propriedades
      // para permitir autoplay (mesmo que existam como atributos no HTML).
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("autoplay", "");
    }

    function playVideos() {
      if (reduceMotion) {
        homeVideos.forEach(function (video) {
          video.pause();
          video.removeAttribute("autoplay");
        });
        caseVideos.forEach(function (video) {
          video.pause();
          video.removeAttribute("autoplay");
        });
        return;
      }

      // Case study: tocar logo (só 1-2 vídeos)
      caseVideos.forEach(function (video) {
        prepareVideo(video);
        video.play().catch(function () {
          /* autoplay bloqueado — o poster fica visível */
        });
      });
    }

    function initHomeLazyPlayback() {
      if (!homeVideos.length) return;

      // Pausa tudo de início para evitar 4 vídeos a competir no load.
      homeVideos.forEach(function (video) {
        prepareVideo(video);
        try {
          video.pause();
        } catch (e) {}
      });

      // Fallback simples se não houver IntersectionObserver
      if (!("IntersectionObserver" in window)) {
        homeVideos.forEach(function (video) {
          video.play().catch(function () {});
        });
        return;
      }

      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var video = entry.target;
            if (entry.isIntersecting) {
              video.play().catch(function () {});
            } else {
              try {
                video.pause();
              } catch (e) {}
            }
          });
        },
        { root: null, rootMargin: "200px 0px", threshold: 0.01 }
      );

      homeVideos.forEach(function (video) {
        io.observe(video);
      });
    }

    function armGestureReplay() {
      if (gestureArmed) return;
      gestureArmed = true;

      function onFirstGesture() {
        playVideos();
        // Gesto do utilizador também ajuda a arrancar os vídeos da home
        homeVideos.forEach(function (video) {
          video.play().catch(function () {});
        });
      }

      window.addEventListener("click", onFirstGesture, { passive: true, once: true });
      window.addEventListener("touchstart", onFirstGesture, { passive: true, once: true });
      window.addEventListener("keydown", onFirstGesture, { once: true });
      window.addEventListener("scroll", onFirstGesture, { passive: true, once: true });
    }

    playVideos();
    initHomeLazyPlayback();
    armGestureReplay();

    mq.addEventListener("change", function () {
      applyVideoSources();
      playVideos();
    });

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) playVideos();
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
