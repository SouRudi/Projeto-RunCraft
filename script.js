const player = document.getElementById('player');
    const gameCont = document.querySelector('.game-cont');
    let posX = 300;
    const velocidade = 5;

    let andandoDireita = false;
    let andandoEsquerda = false;
    let naPrimeira = false;
    let naUltima = false;

    window.addEventListener('keydown', (e) => {
      if (e.key === 'd') andandoDireita = true;
      if (e.key === 'a') andandoEsquerda = true;
      if (e.key === 'w') naPrimeira = true;
      if (e.key === 's') naUltima = true;
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'd') andandoDireita = false;
      if (e.key === 'a') andandoEsquerda = false;
      if (e.key === 'w') naPrimeira = false;
      if (e.key === 's') naUltima = false;
    });

    window.addEventListener('click', () => {
      document.getElementById('player').style.backgroundImage = "url('Imgs/hit.png')";
    });

    let vidas = 3;
    const hearts = [
      document.getElementById('hh1'),
      document.getElementById('hh2'),
      document.getElementById('hh3')
    ];

    function perdeVida() {
      document.body.style.filter = "brightness(0.5) sepia(1) hue-rotate(-50deg) saturate(4)";
      setTimeout(() => {
        document.body.style.filter = "";
      }, 200);

      vidas--;
      if (vidas >= 0 && hearts[vidas]) {
        hearts[vidas].style.visibility = 'hidden';
      }
      if (vidas <= 0) {
        mostrarGameOver();
      }
    }

    let tempo = 0;
    let timerInterval = setInterval(() => {
      tempo++;
      document.getElementById('timer').textContent = tempo + 's';
    }, 1000);

    function mostrarGameOver() {
      document.getElementById('gameover-screen').style.display = 'flex';
      clearInterval(timerInterval);

      let pontuacao = document.getElementById('pontuacao-final');
      if (!pontuacao) {
        pontuacao = document.createElement('h3');
        pontuacao.id = 'pontuacao-final';
        pontuacao.style.color = 'white';
        pontuacao.style.fontFamily = 'Minecraftia';
        pontuacao.style.marginTop = '10px';
        document.getElementById('gameover-screen').appendChild(pontuacao);
      }
      pontuacao.textContent = `Tempo: ${tempo}s`;
      window.addEventListener('mousedown', reiniciarJogo, { once: true });
    }

    function reiniciarJogo() {
      location.reload();
    }


    const inimigos = [];
    const inimigosImgs = ['Imgs/fireball.png', 'Imgs/tnt.png'];

    function criarInimigo() {
      const inimigo = document.createElement('div');
      inimigo.className = 'inimigo';
      const img = inimigosImgs[Math.floor(Math.random() * inimigosImgs.length)];
      inimigo.style.backgroundImage = `url('${img}')`;

      const gameWidth = gameCont.offsetWidth;
      const gameHeight = gameCont.offsetHeight;

      const borda = Math.floor(Math.random() * 4);

      let x, y, velX = 0, velY = 0;
      const speed = 4;

      switch (borda) {
        case 0:
          x = Math.random() * (gameWidth - 40);
          y = 0;
          velX = 0;
          velY = speed;
          break;
        case 1:
          x = gameWidth - 40;
          y = Math.random() * (gameHeight - 40);
          velX = -speed;
          velY = 0;
          break;
        case 2: 
          x = Math.random() * (gameWidth - 40);
          y = gameHeight - 40;
          velX = 0;
          velY = -speed;
          break;
        case 3:
          x = 0;
          y = Math.random() * (gameHeight - 40);
          velX = speed;
          velY = 0;
          break;
      }

      inimigo.style.left = x + 'px';
      inimigo.style.top = y + 'px';

      gameCont.appendChild(inimigo);

      inimigos.push({ el: inimigo, x, y, velX, velY, width: 40, height: 40 });
    }

    function colisaoElemento(a, b) {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      return !(
        ra.right < rb.left ||
        ra.left > rb.right ||
        ra.bottom < rb.top ||
        ra.top > rb.bottom
      );
    }

    function atualizarInimigos() {
      for (let i = inimigos.length - 1; i >= 0; i--) {
        let inim = inimigos[i];
        inim.x += inim.velX;
        inim.y += inim.velY;

        if (
          inim.x < -inim.width ||
          inim.x > gameCont.offsetWidth ||
          inim.y < -inim.height ||
          inim.y > gameCont.offsetHeight
        ) {
          inim.el.remove();
          inimigos.splice(i, 1);
          continue;
        }

        inim.el.style.left = inim.x + 'px';
        inim.el.style.top = inim.y + 'px';

        if (colisaoElemento(player, inim.el)) {
          perdeVida();
          inim.el.remove();
          inimigos.splice(i, 1);
        }
      }
    }

    setInterval(criarInimigo, 500);

    function atualizar() {
      if (andandoDireita) {
        posX += velocidade;
        player.style.backgroundImage = "url('Imgs/Walking_SteveR2.png')";
      }
      if (andandoEsquerda) {
        posX -= velocidade;
        player.style.backgroundImage = "url('Imgs/Walking_SteveL2.png')";
      }
      if (!andandoDireita && !andandoEsquerda) {
        player.style.backgroundImage = "url('Imgs/steve.png')";
      }
      if (naUltima && andandoDireita) {
        player.style.backgroundImage = "url('Imgs/Sneaking_SteveR.png')";
      }
      if (naUltima && andandoEsquerda) {
        player.style.backgroundImage = "url('Imgs/Sneaking_SteveL.png')";
      }
      if (naUltima && !andandoDireita && !andandoEsquerda) {
        player.style.backgroundImage = "url('Imgs/Sneaking_SteveR.png')";
      }

      const gameWidth = gameCont.offsetWidth;
      const playerWidth = player.offsetWidth;
      if (posX < 0) posX = 0;
      if (posX > gameWidth - playerWidth) posX = gameWidth - playerWidth;

      player.style.left = posX + 'px';

      if (naPrimeira) {
        player.style.bottom = '53%';
      } else if (naUltima) {
        player.style.bottom = '20%';
      } else {
        player.style.bottom = '37%';
      }

      atualizarInimigos();

      requestAnimationFrame(atualizar);
    }

    atualizar();
