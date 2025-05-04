
  const mensagens = [
    "VAI FURIAAAA!!! 🔥🔥",
    "Que jogada incrível!",
    "Esse time é insano!",
    "Vamos com tudo!",
    "CAMPEÕES!!!",
    "Orgulho da nação!"
  ];

  function adicionarMensagem() {
    const container = document.getElementById("chat-messages");
    const msg = document.createElement("p");
    msg.textContent = mensagens[Math.floor(Math.random() * mensagens.length)];
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  const video = document.getElementById("furiaVideo");

  // Impede pausa com vigilância constante
  setInterval(() => {
    if (video.paused) {
      video.play();
    }
  }, 200);
  
  // Clique no vídeo alterna som (mute/unmute)
  video.addEventListener("click", () => {
    video.muted = !video.muted;
  });
  
  document.addEventListener('keydown', (e) => {
    // Bloqueia espaço e 'k' que pausam vídeo
    if (e.code === 'Space' || e.key.toLowerCase() === 'k') {
      e.preventDefault();
    }
  });

 
  // CHAT



