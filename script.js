
    /***************
     * CONFIGURAÇÕES
     ***************/
    // 👉 Seu nome (padrão: "Samuel Theodore Lima")
    const MY_NAME = "Samuel Theodore Lima";
    // Se quiser exigir correspondência exata do nome dela, troque para true e defina EXPECTED.
    const REQUIRE_EXACT_MATCH = false;
    const EXPECTED = null;
    const MIN_WORDS = 2; // nome + sobrenome ao menos

    /***************
     * UTILIDADES
     ***************/
    function normalize(str){
      return str
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/\s+/g, ' ');
    }
    function isLikelyFullName(str){
      const words = str.trim().split(/\s+/);
      if (words.length < MIN_WORDS) return false;
      return /^[\p{L}\s'.-]+$/u.test(str);
    }
    function formatDateLongPTBR(date = new Date()){
      const fmt = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      let s = fmt.format(date);
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    function show(el){ el.classList.remove('d-none'); }
    function hide(el){ el.classList.add('d-none'); }

    /***************
     * CONFETE
     ***************/
    function launchConfetti(durationMs = 5000){
      const container = document.getElementById('confetti');
      container.innerHTML = '';
      const colors = ['#f7c948','#b88a44','#ff6b6b','#6bcBef','#9ae6b4','#f4a6ff','#ffd1a6'];
      const start = performance.now();

      function spawn(){
        const i = document.createElement('i');
        const size = Math.random()*8 + 6;
        i.style.width = `${size}px`;
        i.style.height = `${size*1.3}px`;
        i.style.left = `${Math.random()*100}%`;
        i.style.top = `-20px`;
        i.style.background = colors[Math.floor(Math.random()*colors.length)];
        i.style.transform = `translateY(0) rotate(${Math.random()*360}deg)`;
        const duration = Math.random()*2.5 + 3.5;
        i.style.animationDuration = `${duration}s`;
        i.style.borderRadius = `${Math.random()>.5 ? 2 : 50}%`;
        container.appendChild(i);
        setTimeout(()=> i.remove(), duration*1000 + 200);
      }

      const timer = setInterval(()=>{
        if (performance.now() - start > durationMs){
          clearInterval(timer);
          return;
        }
        for (let k=0; k<14; k++) spawn();
      }, 180);
    }

    /***************
     * ELEMENTOS
     ***************/
    const step1 = document.getElementById('step1');
    const step3 = document.getElementById('step3');

    const input = document.getElementById('fullName');
    const errorEl = document.getElementById('error');

    const btnContinue = document.getElementById('btnContinue');
    const btnClear = document.getElementById('btnClear');
    const btnConfirm = document.getElementById('btnConfirm');
    const btnPrint = document.getElementById('btnPrint');
    const btnAgain = document.getElementById('btnAgain');
    const btnPlay = document.getElementById('btnPlay');

    const previewName = document.getElementById('previewName');

    const herNameEls = [document.getElementById('herName'), document.getElementById('herName2'), document.getElementById('herSign')];
    const myNameEls  = [document.getElementById('myName'),  document.getElementById('myName2'),  document.getElementById('mySign')];

    const dateLongEl = document.getElementById('dateLong');
    const audio = document.getElementById('weddingAudio');

    const confirmModal = new bootstrap.Modal('#confirmModal', { backdrop: 'static', keyboard: false });

    let herNameRaw = '';

    function setMyName(name){
      myNameEls.forEach(el => el.textContent = name);
    }
    setMyName(MY_NAME);

    function setError(msg){
      if (!msg){
        errorEl.textContent = '';
        input.classList.remove('is-invalid');
        return;
      }
      errorEl.textContent = msg;
      input.classList.add('is-invalid');
    }

    async function playWeddingMarch(){
      try{
        audio.currentTime = 0;
        audio.volume = 0.85;
        await audio.play();
        btnPlay.classList.add('d-none');
      }catch(e){
        // Autoplay bloqueado – mostrar botão
        btnPlay.classList.remove('d-none');
      }
    }

    btnContinue.addEventListener('click', ()=>{
      setError('');
      const val = input.value || '';
      if (!isLikelyFullName(val)){
        setError('Coloque seu nome completo — apenas letras e espaços.');
        input.focus();
        return;
      }
      herNameRaw = val.trim();
      previewName.textContent = herNameRaw;
      confirmModal.show();
    });

    btnClear.addEventListener('click', ()=>{
      input.value = '';
      setError('');
      input.focus();
    });

    btnConfirm.addEventListener('click', async ()=>{
      // Regras de validação extra (opcional)
      if (REQUIRE_EXACT_MATCH && EXPECTED){
        if (normalize(herNameRaw) !== normalize(EXPECTED)){
          confirmModal.hide();
          setError('Ops, não reconheci. Confere se escreveu seu nome completo certinho?');
          input.focus();
          return;
        }
      }

      // Preenche a certidão
      herNameEls.forEach(el => el.textContent = herNameRaw);
      dateLongEl.textContent = formatDateLongPTBR(new Date());

      // Troca de tela
      confirmModal.hide();
      document.body.classList.add('ceremony');
      hide(step1);
      show(step3);

      // Confete + música
      launchConfetti(5000);
      await playWeddingMarch();
    });

    btnPrint.addEventListener('click', ()=> window.print());

    btnAgain.addEventListener('click', ()=>{
      audio.pause();
      btnPlay.classList.add('d-none');
      document.body.classList.remove('ceremony');
      document.getElementById('confetti').innerHTML = '';
      input.value = '';
      setError('');
      show(step1);
      hide(step3);
      setTimeout(()=> input.focus(), 100);
    });

    btnPlay.addEventListener('click', playWeddingMarch);

    // UX: Enter no campo envia
    input.addEventListener('keydown', (e)=>{
      if (e.key === 'Enter') btnContinue.click();
    });

    // Foco inicial
    setTimeout(()=> input.focus(), 200);


