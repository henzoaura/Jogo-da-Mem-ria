// ======================================================
// JOGO DA MEMÓRIA - PALMEIRAS
// ======================================================

// Seleciona todos os cartões do seu HTML
const cartoes = document.querySelectorAll('.memory-card');

// Variáveis de controle de estado do jogo
let primeiraCarta = null;      
let segundaCarta = null;     
let podeClicar = true;      
let paresEncontrados = 0;   // Corrigido o erro de digitação

// Define o total de pares baseado na quantidade de cartões que encontrou (12 / 2 = 6)
const totalDePares = cartoes.length / 2; 

// Seleciona os elementos do topo da tela
const timerElement = document.querySelector('#timer');
const botaoiniciar = document.querySelector('#start');

let segundosPassados = 0; 
let temporizador = null; 

// ======================================================
// FUNÇÕES DO CRONÔMETRO E INICIALIZAÇÃO
// ======================================================

function iniciarCronometro() {
    clearInterval(temporizador); // Reseta caso já estivesse rodando
    segundosPassados = 0;
    timerElement.textContent = "00:00";
    
    temporizador = setInterval(() => {
        segundosPassados++;
        const minutos = String(Math.floor(segundosPassados / 60)).padStart(2, '0');
        const segundos = String(segundosPassados % 60).padStart(2, '0');
        timerElement.textContent = `${minutos}:${seconds}`;
    }, 1000);
}

function iniciarJogo() {
    resetarTabuleiro();
    iniciarCronometro();
}

// ======================================================
// MECÂNICA DO JOGO (VIRAR E COMPARAR)
// ======================================================

function virarCarta() {
    if (!podeClicar) return;
    if (this === primeiraCarta) return; // Evita clicar duas vezes no mesmo card

    this.classList.add('flip');

    if (primeiraCarta === null) {
        primeiraCarta = this;
        return;
    }

    segundaCarta = this;
    verificaPar();
}

function verificaPar() {
    // Compara o 'data-framework' que você configurou no HTML
    const cartasIguais = primeiraCarta.dataset.framework === segundaCarta.dataset.framework;

    if (cartasIguais) {
        manterParEncontrado();
    } else {
        desvirarCartas();
    }
}

function manterParEncontrado() {
    // Desativa o clique nas cartas que já pontuaram
    primeiraCarta.removeEventListener('click', virarCarta);
    segundaCarta.removeEventListener('click', virarCarta);

    paresEncontrados++;
    resetarJogada();

    if (paresEncontrados === totalDePares) {
        fimDeJogo();
    }
}

function desvirarCartas() {
    podeClicar = false;

    // Tempo para o jogador memorizar antes de virar de volta
    setTimeout(() => {
        primeiraCarta.classList.remove('flip');
        segundaCarta.classList.remove('flip');
        resetarJogada();
    }, 1200);
}

function resetarJogada() {
    primeiraCarta = null;
    segundaCarta = null;
    podeClicar = true;
}

// ======================================================
// EMBARALHAR E REINICIAR
// ======================================================

function embaralharCartas() {
    cartoes.forEach(card => {
        const posicaoAleatoria = Math.floor(Math.random() * cartoes.length);
        card.style.order = posicaoAleatoria; // Define a ordem aleatória no CSS Grid
    });
}

function fimDeJogo() {
    clearInterval(temporizador); // Para o relógio
    setTimeout(() => {
        alert(`Parabéns! Você encontrou todos os pares em ${timerElement.textContent}!`);
    }, 500);
}

function resetarTabuleiro() {
    paresEncontrados = 0;

    cartoes.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', virarCarta);
    });

    embaralharCartas();
}

// ======================================================
// ESCUTADORES DE EVENTO (TRIGGERS)
// ======================================================

// O jogo começa oficialmente ao clicar no botão "Iniciar"
botaoiniciar.addEventListener('click', iniciarJogo);

// Embaralha uma primeira vez na carga da página apenas para o visual inicial
embaralharCartas();
