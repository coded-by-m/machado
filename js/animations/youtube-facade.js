export function initYoutubeFacade() {
  const buttons = document.querySelectorAll('[data-yt]');
  if (!buttons.length) return;

  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  buttons.forEach((btn) => {
    const video = btn.querySelector('video[data-src]');
    if (video && !isMobile) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.src = video.dataset.src;
              video.play().catch(() => {});
              observer.disconnect();
            }
          });
        },
        { rootMargin: '200px' }
      );
      observer.observe(btn);
    }

    btn.addEventListener('click', () => {
      // guard — evita disparo duplo enquanto o iframe carrega
      if (btn.dataset.carregando) return;
      btn.dataset.carregando = 'true';
      btn.classList.add('is-loading');

      const id = btn.dataset.yt;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&color=white`;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.className = 'sobre-yt__iframe sobre-yt__iframe--carregando';
      iframe.title = btn.getAttribute('aria-label') || 'Vídeo institucional';

      // o iframe entra no DOM para comecar a baixar; o poster so sai quando ele esta pronto
      const troca = () => {
        iframe.classList.remove('sobre-yt__iframe--carregando');
        btn.remove();
      };
      iframe.addEventListener('load', troca, { once: true });
      // rede ruim nao pode deixar o usuario preso no estado de loading
      setTimeout(troca, 6000);

      btn.insertAdjacentElement('afterend', iframe);
    });
  });
}
