(function () {
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  // Header: some ao rolar para baixo e volta ao rolar para cima.
  var topo = document.querySelector(".topo");
  if (topo) {
    var ultimo = window.scrollY, esperando = false;
    var atualizar = function () {
      var y = window.scrollY;
      if (y < 80 || y < ultimo - 4) topo.classList.remove("oculto");
      else if (y > ultimo + 4) topo.classList.add("oculto");
      ultimo = y; esperando = false;
    };
    window.addEventListener("scroll", function () {
      if (!esperando) { esperando = true; window.requestAnimationFrame(atualizar); }
    }, { passive: true });
    topo.addEventListener("focusin", function () { topo.classList.remove("oculto"); });
  }

  // Reel: 720p por padrão (celular e conexão lenta), 1080p em telas grandes.
  // O vídeo só é carregado quando o visitante aperta play.
  var video = document.getElementById("video");
  if (video) {
    var conexao = navigator.connection || {};
    var leve = conexao.saveData || /(^|-)2g$/.test(conexao.effectiveType || "");
    var grande = window.matchMedia("(min-width: 900px)").matches && !leve;
    if (grande) {
      video.querySelector("source").src = "media/reel_1080p.mp4";
      video.load();
    }
    video.addEventListener("play", function () { video.preload = "auto"; }, { once: true });
  }

  // Vídeos individuais: o nome do projeto abre um player. Sem JS, o link abre o MP4.
  var janela = document.getElementById("janela");
  var player = document.getElementById("video-projeto");
  var titulo = document.getElementById("janela-titulo");
  if (!janela || typeof janela.showModal !== "function") return;

  function fechar() {
    player.pause();
    player.removeAttribute("src");
    player.removeAttribute("poster");
    player.load();
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest("a.projeto");
    if (!link) return;
    e.preventDefault();
    titulo.textContent = link.dataset.titulo || link.textContent.trim();
    player.poster = link.dataset.poster || "";
    player.src = link.getAttribute("href");
    janela.showModal();
    var p = player.play();
    if (p && p.catch) p.catch(function () { /* o visitante aperta play */ });
  });

  document.getElementById("fechar").addEventListener("click", function () { janela.close(); });
  janela.addEventListener("close", fechar);
  janela.addEventListener("click", function (e) { if (e.target === janela) janela.close(); });
})();
