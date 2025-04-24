// Play/Pause toggle and volume control
document.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('bg-music');
  const playPauseBtn = document.getElementById('play-pause');
  const volumeSlider = document.getElementById('volume-slider');

  playPauseBtn.addEventListener('click', function() {
    if (audio.paused) {
      audio.play();
      playPauseBtn.classList.remove('play');
      playPauseBtn.classList.add('pause');
      playPauseBtn.setAttribute('aria-label', 'Pause background music');
    } else {
      audio.pause();
      playPauseBtn.classList.remove('pause');
      playPauseBtn.classList.add('play');
      playPauseBtn.setAttribute('aria-label', 'Play background music');
    }
  });

  volumeSlider.addEventListener('input', function() {
    audio.volume = parseFloat(this.value);
  });

  // Scroll reveal for sections
  const revealElements = document.querySelectorAll('.story-section, .grid-section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealElements.forEach(element => {
    observer.observe(element);
  });
});
