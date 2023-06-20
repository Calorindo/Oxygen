var display = document.getElementById("display");
var inputNumber = document.getElementById("inputNumber");
var errorMessage = document.getElementById("errorMessage");
var countdown = document.getElementById("countdown");
var startButton = document.getElementById("startButton");
var successMessage = document.getElementById("successMessage");
var timerMessage = document.getElementById("timerMessage");

var timerInterval; // Variável para armazenar o intervalo do timer
var canPressStartButton = true; // Variável de controle para o botão "Start"

var remainingTime = 80; // Tempo inicial em segundos
var started = false; // Flag indicando se o timer está iniciado ou não

// Função para gerar um número aleatório de 3 dígitos
function generateRandomNumber() {
  var randomNumber = Math.floor(Math.random() * 900) + 100;
  return randomNumber.toString();
}

// Atualizar o número exibido e o timer
function updateDisplayedNumber() {
  var randomNumber = generateRandomNumber();
  display.textContent = randomNumber;
  inputNumber.value = ""; // Limpar a entrada de texto
  errorMessage.textContent = ""; // Limpar mensagem de erro
}

// Chamar a função inicialmente
updateDisplayedNumber();

// Função chamada ao enviar o número
function submitNumber() {
  var input = inputNumber.value;

  if (input === display.textContent) {
    errorMessage.textContent = ""; // Limpar mensagem de erro, se houver
    clearInterval(timerInterval); // Parar o timer
    started = false; // Marcar como não iniciado
    updateDisplayedNumber(); // Gerar novo número aleatório
    successMessage.textContent = "CODIGO CORRETO!"; // Exibir mensagem de sucesso

    stopMusic(); // Parar a reprodução da música

    // Iniciar o timer de 2 minutos antes de permitir pressionar o botão "Start" novamente
    startButton.disabled = true; // Desabilitar o botão "Start"
    inputNumber.disabled = true; // Desabilitar a caixa de texto
    timerMessage.textContent = "Tempo para reativação: 2:00"; // Exibir a mensagem de tempo para reativação
    countdown.textContent = ""; // Limpar mensagem de tempo restante

    var countdownTime = 120;
    var countdownInterval = setInterval(function() {
      var minutes = Math.floor(countdownTime / 60);
      var seconds = countdownTime % 60;
      countdown.textContent = "Tempo para reativação: " + padZero(minutes) + ":" + padZero(seconds);
      timerMessage.textContent = "Tempo para reativação: " + padZero(minutes) + ":" + padZero(seconds);
      countdownTime--;

      if (countdownTime < 0) {
        clearInterval(countdownInterval);
        countdown.textContent = ""; // Limpar mensagem de tempo para reativação
        startButton.disabled = false; // Habilitar o botão "Start"
        inputNumber.disabled = false; // Habilitar a caixa de texto
        timerMessage.textContent = "Tempo restante: 80 segundos"; // Exibir a mensagem de tempo restante
      }
    }, 1000);

  } else {
    errorMessage.textContent = "Erro: Número incorreto!"; // Exibir mensagem de erro
  }
}

// Função chamada ao pressionar a tecla Enter
function handleKeyPress(event) {
  if (event.key === "Enter") {
    submitNumber();
  }
}

// Adicionar evento de pressionar tecla para o inputNumber
inputNumber.addEventListener("keypress", function(event) {
  if (startButton.disabled) {
    event.preventDefault(); // Impedir que o caractere seja digitado
  } else {
    handleKeyPress(event);
  }
});

// Função chamada ao clicar no botão "Start"
function startTimer() {
  if (!started && canPressStartButton) {
    updateDisplayedNumber(); // Gerar novo número aleatório
    clearInterval(timerInterval); // Parar o timer anterior, se houver
    remainingTime = 80; // Reiniciar o tempo restante
    timerInterval = setInterval(updateTimer, 1000); // Iniciar o timer
    started = true; // Marcar como iniciado

    var audio = document.getElementById("backgroundMusic");
    audio.play(); // Inicia a reprodução do áudio

    // Ocultar o botão "Start"
    startButton.style.display = "none";

    successMessage.textContent = ""; // Limpar mensagem de sucesso

    canPressStartButton = false; // Desabilitar o pressionamento do botão "Start" novamente

    setTimeout(function() {
      startButton.style.display = "inline-block"; // Exibir o botão "Start"
      canPressStartButton = true; // Permitir pressionar o botão "Start" novamente
    }, 120000); // 2 minutos em milissegundos (120000)
  }
}

// Função para atualizar o timer
function updateTimer() {
  countdown.textContent = remainingTime;
  remainingTime--;

  if (remainingTime < 0) {
    clearInterval(timerInterval); // Parar o timer
    countdown.textContent = "0";
    display.textContent = "000";
    errorMessage.textContent = "FALHA DE OXIGÊNIO!";
    successMessage.textContent = ""; // Limpar mensagem de sucesso

    // Exibir o botão "Start"
    startButton.style.display = "inline-block";

    started = false; // Marcar como não iniciado
  }
}

// Função para adicionar um zero à esquerda para minutos/segundos menores que 10
function padZero(value) {
  return value < 10 ? "0" + value : value;
}

// Função para parar a reprodução da música
function stopMusic() {
  var audio = document.getElementById("backgroundMusic");
  audio.pause(); // Pausar a reprodução
  audio.currentTime = 0; // Reiniciar a reprodução a partir do início
}