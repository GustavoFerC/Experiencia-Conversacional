const video = document.getElementById("furiaVideo");
setInterval(() => { if (video.paused) video.play(); }, 200);
video.addEventListener("click", () => video.muted = !video.muted);

let firstMenu = true;
let currentProtocolo = '';
let inEmailForm = false;

document.addEventListener('DOMContentLoaded', () => {
  const chatBtn    = document.getElementById("chat-float-button");
  const chatWindow = document.getElementById("chat-window");
  const chatIcon   = document.getElementById("chat-icon");
  const viewPre    = document.getElementById("view-prechat");
  const viewConf   = document.getElementById("view-confirm");
  const viewChat   = document.getElementById("view-chat");
  const btnAvanc   = document.getElementById("btnAvancar");
  const btnConf    = document.getElementById("btnConfirmar");
  const btnEdit    = document.getElementById("btnEditar");
  const inputMsg   = document.getElementById("inputMsg");
  const btnSend    = document.getElementById("btnSend");
  const confNome   = document.getElementById("confNome");
  const confEmail  = document.getElementById("confEmail");
  const msgInit    = document.getElementById("mensagemInicial");

  chatBtn.addEventListener("click", () => {
    const open = chatWindow.classList.toggle("show");
    chatIcon.src = open ? "imgs/icon-fechar.svg" : "imgs/furia-logo.png";
    if (!open) {
      clearNotification();
      document.getElementById('nome').value = '';
      document.getElementById('email').value = '';
      document.getElementById('chat').innerHTML = '';
      document.getElementById('action-buttons').innerHTML = '';
      viewChat.classList.add('hidden');
      viewConf.classList.add('hidden');
      viewPre.classList.remove('hidden');
      firstMenu = false;
      inEmailForm = false;
    }
  });

  btnAvanc.addEventListener("click", () => {
    clearNotification();
    const nome  = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    if (/\d/.test(nome)) return showNotification("Nome inválido: não inclua números.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showNotification("E-mail inválido: verifique o formato.");
    confNome.innerText  = nome;
    confEmail.innerText = email;
    viewPre.classList.add("hidden");
    viewConf.classList.remove("hidden");
  });

  btnConf.addEventListener("click", () => {
    clearNotification();
    const nome      = confNome.innerText;
    const email     = confEmail.innerText;
    currentProtocolo = gerarProtocolo(email);
    msgInit.innerHTML = `
      <p><strong>Protocolo:</strong> ${currentProtocolo}</p>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>E-mail:</strong> ${email}</p>
    `;
    viewConf.classList.add("hidden");
    viewChat.classList.remove("hidden");
    firstMenu = true;
    showMainMenu(nome);
  });

  btnEdit.addEventListener("click", () => {
    clearNotification();
    viewConf.classList.add("hidden");
    viewPre.classList.remove("hidden");
  });

  btnSend.addEventListener('click', () => {
    if (inEmailForm) sendEmailForm();
    else sendStandard();
  });
  inputMsg.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inEmailForm) sendEmailForm();
      else sendStandard();
    }
  });

  function sendStandard() {
    const text = inputMsg.value.trim();
    if (!text) return;
    adicionarMensagem('usuario', text);
    inputMsg.value = '';
  }
  function sendEmailForm() {
    const text = inputMsg.value.trim();
    if (!text) return;
    adicionarMensagem('usuario', text);
    adicionarMensagem('bot', 'Seu e-mail foi enviado com sucesso! Em breve responderemos.');
    inputMsg.value = '';
    inEmailForm = false;
    clearActions();
    setTimeout(() => showMainMenu(confNome.innerText), 500);
  }
});

function gerarProtocolo(email) {
  const ts  = Date.now().toString().slice(-6);
  const sum = [...email].reduce((s, c) => s + c.charCodeAt(0), 0);
  const rnd = Math.floor(Math.random()*100).toString().padStart(2,'0');
  return (sum + ts + rnd).slice(-9);
}

function showNotification(msg) {
  clearNotification();
  const notif = document.createElement('div'); notif.className = 'chat-notification'; notif.innerText = msg;
  document.getElementById('view-prechat').prepend(notif);
}
function clearNotification() {
  const e = document.querySelector('.chat-notification'); if (e) e.remove();
}

// ====================
// INTERAÇÃO DO CHAT
// ====================


function showMainMenu(nome) {
  clearActions(); inEmailForm = false;
  const msg = firstMenu ? `Olá, ${nome}, seja bem-vindo ao nosso atendimento!` : 'Posso te ajudar em mais algo?';
  adicionarMensagem('bot', msg);
  firstMenu = false;
  const options = [
    { id: 'optLoja',  label: 'Loja' },
    { id: 'optTimes', label: 'Times' },
    { id: 'optRedes', label: 'Redes' },
    { id: 'optAjuda', label: 'Ajuda' }
  ];
  const grid = document.getElementById('action-buttons');
  options.forEach(o => {
    const btn = document.createElement('button'); btn.textContent = o.label;
    btn.addEventListener('click', () => handleOption(o.id, nome)); grid.appendChild(btn);
  });
}


function clearActions() { document.getElementById('action-buttons').innerHTML = ''; }


function handleOption(optId, nome) {
  const frases = { optLoja:'Quero saber sobre a loja.', optTimes:'Quero saber mais sobre os times.', optRedes:'Quero ver as redes sociais.', optAjuda:'Preciso de ajuda.' };
  adicionarMensagem('usuario', frases[optId]);
  appendBotTyping(() => {
    switch(optId) {
      case 'optLoja': adicionarMensagem('bot','Nossa loja lançou produtos novos! 🎉 Use FUTURE10.'); appendBotImage('imgs/furia-thumb.png'); setTimeout(()=>showMainMenu(nome),500); break;
      case 'optTimes': adicionarMensagem('bot','Times de CS:GO, LoL e mais no lobby.gg/twitch.tv/furia.'); appendBotImage('imgs/logo-furia.svg'); setTimeout(()=>showMainMenu(nome),500); break;
      case 'optRedes': adicionarMensagem('bot','Siga-nos: @FURIA nas redes sociais.'); appendBotImage('imgs/furia-logo.png'); setTimeout(()=>showMainMenu(nome),500); break;
      case 'optAjuda':
 
        document.getElementById('chat').innerHTML=''; clearActions(); showHelpSubmenu(); break;
    }
  });
}


function showHelpSubmenu() {
  const grid = document.getElementById('action-buttons');
  [['Enviar e-mail','subEmail'],['Falar com atendente','subAtendente']].forEach(([label,id])=>{
    const btn=document.createElement('button'); btn.textContent=label;
    btn.addEventListener('click',()=>{
      if(id==='subEmail'){
       
        document.getElementById('chat').innerHTML=''; clearActions(); showEmailForm();
      } else {
   
        document.getElementById('chat').innerHTML=''; clearActions();
        const pos = Math.floor(Math.random()*10) + 1;
        adicionarMensagem('bot', `Você entrou na fila! Sua posição atual é ${pos}.`);
    
        const exitBtn = document.createElement('button');
        exitBtn.textContent = 'Sair';
        exitBtn.addEventListener('click', () => {
   
          document.getElementById('chat').innerHTML = '';
          clearActions();
          firstMenu = false;
          showMainMenu(document.getElementById('confNome').innerText);
        });
        grid.appendChild(exitBtn);
      }
    }); grid.appendChild(btn);
  });
} grid.appendChild(btn);

function showEmailForm() {
  inEmailForm = true;
  const chat = document.getElementById('chat');
  const emailUser = document.getElementById('confEmail').innerText;
  chat.innerHTML = `
    <div class="email-form">
      <p style="color:#000;"><strong>E-mail:</strong> ${emailUser}</p>
      <p style="color:#000;"><strong>Para:</strong> FURIA@OFICIAL.BR</p>
      <p style="color:#000;"><strong>Protocolo:</strong> ${currentProtocolo}</p>
    </div>
  `;
  chat.scrollTop = chat.scrollHeight;

  clearActions();
  const grid = document.getElementById('action-buttons');
  const exitBtn = document.createElement('button');
  exitBtn.textContent = 'Sair';
  exitBtn.addEventListener('click', () => {
    document.getElementById('chat').innerHTML = '';
    clearActions();
    firstMenu = false;
    inEmailForm = false;
    showMainMenu(document.getElementById('confNome').innerText);
  });
  grid.appendChild(exitBtn);
}

function adicionarMensagem(remetente,texto){const chat=document.getElementById('chat');const div=document.createElement('div');div.className=`chat-message ${remetente}`;div.textContent=remetente==='usuario'?`Você: ${texto}`:texto;chat.appendChild(div);chat.scrollTop=chat.scrollHeight;}
function appendBotImage(src){const chat=document.getElementById('chat');const img=document.createElement('img');img.src=src;img.className='chat-image';chat.appendChild(img);chat.scrollTop=chat.scrollHeight;}
function appendBotTyping(cb){const chat=document.getElementById('chat');const div=document.createElement('div');div.className='chat-message bot typing';div.textContent='FURIA está digitando...';chat.appendChild(div);chat.scrollTop=chat.scrollHeight;setTimeout(()=>{div.remove();cb();},1000);}
const chatWindow=document.getElementById('chat-window');chatWindow.addEventListener('wheel',e=>{if(chatWindow.matches(':hover')){e.preventDefault();chatWindow.scrollTop+=e.deltaY;}},{passive:false});
