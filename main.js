(function () {
  'use strict';

  // Timing constants — slow, editorial rhythm
  var ONSET_DELAY_MS = 60;   // Composed pause before first reveal
  var STAGGER_MS = 150;       // Breathing room between cards
  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================
  // Project card reveal system
  // ============================================

  function initProjectReveal() {
    var cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    // Reduced motion: show all immediately
    if (REDUCED_MOTION) {
      cards.forEach(function (card) {
        card.classList.add('is-visible');
      });
      return;
    }

    var revealQueue = [];
    var isProcessing = false;
    var hasStarted = false;

    function revealCard(card) {
      // Double RAF ensures styles are computed before transition begins
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          card.classList.add('is-visible');
        });
      });
    }

    function processRevealQueue() {
      if (isProcessing || !revealQueue.length) return;
      isProcessing = true;

      var card = revealQueue.shift();

      // First card gets onset delay for composed feel
      var delay = hasStarted ? 0 : ONSET_DELAY_MS;
      hasStarted = true;

      setTimeout(function () {
        revealCard(card);

        // Process next card after stagger interval
        setTimeout(function () {
          isProcessing = false;
          processRevealQueue();
        }, STAGGER_MS);
      }, delay);
    }

    function queueReveal(card) {
      if (card.classList.contains('is-visible')) return;
      if (revealQueue.indexOf(card) !== -1) return;
      revealQueue.push(card);
      processRevealQueue();
    }

    // Intersection Observer for scroll-based reveal
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              queueReveal(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -6% 0px',
          threshold: 0.01
        }
      );

      cards.forEach(function (card) {
        observer.observe(card);
      });
    } else {
      // Fallback: reveal all with stagger
      setTimeout(function () {
        cards.forEach(function (card, i) {
          setTimeout(function () {
            card.classList.add('is-visible');
          }, i * STAGGER_MS);
        });
      }, ONSET_DELAY_MS);
    }
  }

  // ============================================
  // Video source selection (responsive)
  // ============================================

  function applyVideoSources() {
    var isMobile = window.matchMedia('(max-width: 767px)').matches;
    var videos = document.querySelectorAll(
      '.project-card__media video, .case-hero__media video, .case-section__media video'
    );

    videos.forEach(function (video) {
      var sources = video.querySelectorAll('source');
      if (sources.length < 2) return;

      var target = isMobile ? sources[0] : sources[sources.length - 1];
      var nextSrc = target.getAttribute('src');
      if (!nextSrc || video.getAttribute('src') === nextSrc) return;

      video.src = nextSrc;
      video.load();
    });
  }

  // ============================================
  // Video playback and readiness
  // ============================================

  function initProjectVideos() {
    var homeVideos = document.querySelectorAll('.project-card__media video');
    var caseVideos = document.querySelectorAll('.case-hero__media video, .case-section__media video');

    if (!homeVideos.length && !caseVideos.length) return;

    applyVideoSources();

    var mq = window.matchMedia('(max-width: 767px)');
    var gestureArmed = false;

    function prepareVideo(video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('autoplay', '');
    }

    function playVideo(video) {
      prepareVideo(video);
      video.play().catch(function () {
        // Autoplay blocked — poster remains visible
      });
    }

    function playAllCaseVideos() {
      if (REDUCED_MOTION) {
        caseVideos.forEach(function (video) {
          video.pause();
          video.removeAttribute('autoplay');
        });
        return;
      }

      caseVideos.forEach(function (video) {
        playVideo(video);
      });
    }

    function initHomeVideos() {
      if (!homeVideos.length) return;

      if (REDUCED_MOTION) {
        homeVideos.forEach(function (video) {
          video.pause();
          video.removeAttribute('autoplay');
        });
        return;
      }

      // Play all home videos immediately on page load
      homeVideos.forEach(function (video) {
        playVideo(video);
      });
    }

    function armGestureReplay() {
      if (gestureArmed) return;
      gestureArmed = true;

      function onFirstGesture() {
        playAllCaseVideos();
        homeVideos.forEach(function (video) {
          video.play().catch(function () {});
        });
      }

      window.addEventListener('click', onFirstGesture, { passive: true, once: true });
      window.addEventListener('touchstart', onFirstGesture, { passive: true, once: true });
      window.addEventListener('keydown', onFirstGesture, { once: true });
      window.addEventListener('scroll', onFirstGesture, { passive: true, once: true });
    }

    playAllCaseVideos();
    initHomeVideos();
    armGestureReplay();

    mq.addEventListener('change', function () {
      applyVideoSources();
      playAllCaseVideos();
      if (homeVideos.length) {
        playVideo(homeVideos[0]);
      }
    });

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) {
        playAllCaseVideos();
      }
    });
  }

  // ============================================
  // Init
  // ============================================

  function init() {
    initProjectVideos();
    initProjectReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
