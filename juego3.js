// Estructura de niveles, cada nivel tiene un grafo y un nodo objetivo
const levels = [//B=CASA
    { graph: { A: ['B:7','C:20'], B: ['C:8'], C: [] },start: 'A', target: 'C' },
    { graph: { A: ['D:10'], B: ['D:10'], C: ['A:5','B:10'], D: []},start: 'C', target: 'D' },
    /*{ graph: { A: ['B:2', 'D:10'], B: ['C:2'], C: ['D:2'], D: ['E:10'], E: [] },start: 'A', target: 'E' },
    { graph: { A: ['B:5'], B: ['C:5', 'D:2'], C: ['F:5'], D: ['D:2','F:2'], E: ['A:5'], F:[] },start: 'E', target: 'F' },
    /*{ graph: { A: ['B'], B: ['C'], C: ['D'], D: ['E'], E: ['F'], F: ['A'] },start: 'F', target: 'A' },
    { graph: { A: ['D', 'E'], B: ['G'], C: ['G'], D: ['G'], E: ['B','C'], F: ['A'], G: [] },start: 'F', target: 'G' },
    { graph: { A: [], B: ['D', 'E'], C: ['F'], D: ['A'], E: ['B'], F: ['G'], G: ['B','C'] },start: 'D', target: 'A' },
    { graph: { A: ['B'], B: ['C', 'D'], C: ['E'], D: ['F'], E: ['G'], F: ['H'], G: ['H'], H: [] },start: 'A', target: 'H' },
    { graph: { A: ['B'], B: ['C'], C: ['D'], D: ['E'], E: ['F'], F: ['G','H'], G: ['H','A'], H: [] },start: 'G', target: 'H' },
*/];

const limits = {
    topMin: 10,
    topMax: 350,
    leftMin: 10,
    leftMax: 550
};

const minDistance = 100; // Mínimo de 100px entre nodos

function getRandomPosition(min, max) {
    return Math.floor(Math.random() * ((max - min) / 10 + 1)) * 10 + min;
}

function isTooClose(newPos, existingPositions) {
    return existingPositions.some(pos => {
        const distance = Math.sqrt(
            Math.pow(parseInt(newPos.top) - parseInt(pos.top), 2) +
            Math.pow(parseInt(newPos.left) - parseInt(pos.left), 2)
        );
        return distance < minDistance;
    });
}

function generateNodePositions(nodes) {
    const positions = [];
    const result = {};

    nodes.forEach(node => {
        let position;
        do {
            position = {
                top: getRandomPosition(limits.topMin, limits.topMax) + 'px',
                left: getRandomPosition(limits.leftMin, limits.leftMax) + 'px'
            };
        } while (isTooClose(position, positions));

        positions.push(position);
        result[node] = position;
    });

    return result;
}

const levelsWithRandomPositions = levels.map(level => {
    const nodes = Object.keys(level.graph); // Extraer los nodos del grafo
    const positions = generateNodePositions(nodes); // Generar posiciones con distancia mínima
    return { ...level, positions }; // Retornar el nivel con las posiciones generadas
});

function setNodePositions(level) {
    const positions = levelsWithRandomPositions[level].positions; // Obtener posiciones del nivel
    for (const [node, position] of Object.entries(positions)) {
        const element = document.getElementById(node);
        if (element) {
            element.style.position = 'absolute';
            element.style.top = position.top;
            element.style.left = position.left;
        }
    }
}

let currentLevel = 0;
currentNode = levels[currentLevel].start;
let targetNode = levels[currentLevel].target;
let score = 0;

// Función para mover al siguiente nodo
function DividirConexion(connection) {
    const [node, weight] = connection.split(':'); // Divide el string en nodo y peso
    return { node, weight: parseInt(weight, 10) }; // Devuelve un objeto con el nodo y el peso como número
}

function move(node) {
    // Obtén las conexiones del nodo actual
    const connections = levels[currentLevel].graph[currentNode];
    // Busca si la conexión solicitada existe
    const connection = connections.find(c => c.startsWith(node + ':'));

    if (connection) {
        // Conexión válida
        const { weight } = DividirConexion(connection);

        // Mostrar el nodo escogido
        document.getElementById('escogiste').innerText = "ESCOGISTE EL NODO: " + node;

        // Dibujar la línea de conexión válida
        drawLine(currentNode, node, 'green');

        // Sumar el peso al puntaje
        score += weight;

        // Cambiar el color del nodo visitado
        document.getElementById(node).style.backgroundColor = '#2ecc71';

        // Actualizar el nodo actual
        currentNode = node;
    } else {
        // Conexión inválida
        drawLine(currentNode, node, 'red'); // Línea roja
        score -= 5; // Penalización

        // Reinicia el juego limpiando las líneas y el estado
        setTimeout(() => {
            resetCanvas();
            resetNodes();
        }, 1000);

        currentNode = levels[currentLevel].start; // Reiniciar al nodo inicial
    }

    // Actualizar el puntaje en la interfaz
    updateScore();

    // Verificar si se alcanzó el objetivo
    checkWin();
}

// Función para dibujar las líneas entre los nodos
function drawLine(from, to, color) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const fromNode = document.getElementById(from);
    const toNode = document.getElementById(to);

    const fromX = fromNode.offsetLeft + fromNode.offsetWidth / 2;
    const fromY = fromNode.offsetTop + fromNode.offsetHeight / 2;
    const toX = toNode.offsetLeft + toNode.offsetWidth / 2;
    const toY = toNode.offsetTop + toNode.offsetHeight / 2;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
}

// Función para comprobar si el jugador ha alcanzado el objetivo
function checkWin() {
    if (currentNode === targetNode) {
        document.getElementById('message').innerText = "¡Felicidades! Llegaste al nodo objetivo.";

        setTimeout(() => {
            if (currentLevel < levels.length - 1) {
                nextLevel();
            } else {
                // Último nivel completado
                document.getElementById('message').innerText = "¡Juego terminado! Has completado todos los niveles.";
                document.getElementById('informacion').innerText = "FELICIDADES";
                // Mostrar botón para reiniciar
                /*const restartButton = document.getElementById('button');
                restartButton.style.display = 'block';
                restartButton.onclick = restartGame;
                document.body.appendChild(restartButton);*/
                document.querySelector('.centered-container').style.display = 'block';
                document.getElementById('PRIMERO').textContent = 'FELICIDADES GANASTE CON ' + score+ 'PTS.'; 
                document.getElementById('iniciar').textContent = 'JUGAR DE NUEVO'; 
                
                document.getElementById('victoryImage').style.display = 'block';
                document.getElementById('graph-container').style.display = 'none'; // Ocultar el grafo
                document.getElementById('card').style.display = 'none'; // Ocultar el grafo
                document.getElementById('backgroundMusic').pause();
                currentTrackIndex.currentTime = 0;
                currentTrackIndex = 0;
    
                document.getElementById('victoryAudio').play();
            }
        }, 1500);

        setTimeout(() => {
            document.getElementById('message').innerText = ""; // Borrar mensaje
        }, 2000);
    }
}

// Definir el archivo de audio "Nivel"
const audioNivel = new Audio('nivel.wav'); // Este archivo dice "Nivel"

// Definir los archivos de audio para los niveles
const audioNumeros = [
    'nivel 1.wav',
    'nivel 2.wav',
    'nivel 3.wav',
    'nivel 4.wav',
    'nivel 5.wav',
    'nivel 6.wav',
    'nivel 7.wav',
    'nivel 8.wav',
    'nivel 9.wav',
    'nivel 10.wav',
];

// Función para reproducir los audios de "Nivel" y luego el número correspondiente
function playNivelAudio(level) {
    // Primero reproducimos el audio "Nivel"
    audioNivel.play();

    // Cuando el audio de "Nivel" termine, reproducimos el audio correspondiente al número
    audioNivel.onended = () => {
        const audio = new Audio(audioNumeros[level]); // Crea un nuevo objeto de audio y lo reproduce
        audio.play();
    };
}


function nextLevel() {
    currentLevel++;  // Incrementar el nivel
    currentNode = levels[currentLevel].start;  // Establecer el nodo de inicio del nuevo nivel
    targetNode = levels[currentLevel].target;  // Establecer el nodo objetivo para el nuevo nivel
      
    score += 20;//Bonificación de puntos por avanzar de nivel
    updateScore();

    // Actualizar el nivel en la interfaz
    document.getElementById('level').innerText = "Nivel: " + (currentLevel + 1);
    document.getElementById('informacion').innerText = "Estás en el nodo " + currentNode + " y debes llegar al nodo " + targetNode;
    playNivelAudio(currentLevel);
    // Restablecer los nodos y el canvas para el nuevo nivel
    resetNodes();
    resetCanvas();
    setNodePositions(currentLevel);
    document.getElementById(currentNode).style.backgroundColor = 'green';
}


// Función para actualizar el puntaje
function updateScore() {
    document.getElementById('score').innerText = "Puntaje: " + score;
}

// Función para reiniciar los nodos
function resetCanvas() {
    // Limpiar el canvas
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo
}

function resetNodes() {
    // Restablecer el color de los nodos
    const nodes = document.querySelectorAll('.node');
    nodes.forEach(node => node.style.backgroundColor = '#3498db'); // Color original
}


let currentTrackIndex = 0; // Índice de la canción actual
const audioPlayer = document.getElementById('backgroundMusic');

// Lista de canciones
const playlist = [
    'Rap 3 Master.mp3',
    'Rock 2 Master.mp3',
    'FIESTA MIEL SAN MARCO.mp3',
];

// Función para reproducir la canción actual
function playCurrentTrack() {
    audioPlayer.src = playlist[currentTrackIndex];
    audioPlayer.play();
}

// Event listener para cuando la canción termine
audioPlayer.addEventListener('ended', function () {
    currentTrackIndex++; // Avanza al siguiente índice
    if (currentTrackIndex < playlist.length) {
        playCurrentTrack(); // Reproduce la siguiente canción
    } else {
        currentTrackIndex = 0; // Reinicia la lista si es necesario
        playCurrentTrack(); // Reproduce la primera canción nuevamente
    }
});

// Función para iniciar la lista de reproducción desde el principio
/*function startPlaylist() {
    currentTrackIndex = 0; // Asegúrate de comenzar desde la primera canción
    playCurrentTrack();
}

function startAutoPlay() {
    const interval = setInterval(() => {
        if (currentNode === levels[currentLevel].target) {
            clearInterval(interval);
            console.log("¡Juego completado!");
            return;
        }

        computerMove();
    }, 1000); // Espera 1 segundo entre movimientos para visualizar el flujo
}*/

function minimax(node, depth, isMaximizing) {
    if (depth === 0 || node === levels[currentLevel].target) {
        // Valor heurístico simple: la distancia al nodo objetivo
        return node === levels[currentLevel].target ? 100 : -10; // Ponderar más los objetivos alcanzados
    }

    const connections = levels[currentLevel].graph[node];
    if (!connections || connections.length === 0) {
        return isMaximizing ? -Infinity : Infinity; // Nodo sin conexiones
    }

    let bestValue = isMaximizing ? -Infinity : Infinity;

    connections.forEach(connection => {
        const { node: nextNode } = DividirConexion(connection);
        const value = minimax(nextNode, depth - 1, !isMaximizing);
        if (isMaximizing) {
            bestValue = Math.max(bestValue, value);
        } else {
            bestValue = Math.min(bestValue, value);
        }
    });

    return bestValue;
}

function computerMove() {
    const connections = levels[currentLevel].graph[currentNode];
    let bestMove = null;
    let bestValue = -Infinity;

    // Evaluar todas las conexiones posibles
    connections.forEach(connection => {
        const { node } = DividirConexion(connection);
        const value = minimax(node, 2, false); // Profundidad 2
        if (value > bestValue) {
            bestValue = value;
            bestMove = node;
        }
    });

    if (bestMove) {
        move(bestMove);
    }
}

function playCurrentLevel() {
    const interval = setInterval(() => {
        if (currentNode === levels[currentLevel].target) {
            clearInterval(interval);
            console.log(`¡Nivel ${currentLevel + 1} completado!`);
            return;
        }

        computerMove();
    }, 1500); // 1 segundo entre movimientos para observar el progreso
}

function playAllLevels() {
    let levelIndex = 0;

    function playNextLevel() {
        if (levelIndex >= levels.length) {
            checkWin();
            return;
        }

        currentLevel = levelIndex;
        startGame();

        const interval = setInterval(() => {
            if (currentNode === levels[currentLevel].target) {
                clearInterval(interval);
                console.log(`¡Nivel ${levelIndex + 1} completado!`);
                levelIndex++;
                playNextLevel(); // Pasar al siguiente nivel
            } else {
                computerMove();
            }
        }, 1000);
    }

    playNextLevel(); // Comenzar desde el primer nivel
}

// Asociar eventos a los botones
document.getElementById('play-level').onclick = function () {
    playCurrentLevel();
};

document.getElementById('play-all-levels').onclick = function () {
    playAllLevels();
};


// Selecciona el botón de inicio
const iniciarButton = document.getElementById('iniciar');
iniciarButton.onclick = function () {
    const centeredContainer = document.querySelector('.centered-container');
    centeredContainer.style.display = 'none';

    const gameContainer = document.querySelector('.card');
    gameContainer.style.display = 'block';

    startGame();
    //startAutoPlay(); // Iniciar el flujo automático
};

// Función para comenzar el juego
function startGame() {
    currentLevel = 0;
    currentNode = levels[currentLevel].start;
    targetNode = levels[currentLevel].target;
    score = 0;
    document.getElementById('victoryImage').style.display = 'none';
    document.getElementById('victoryAudio').pause();
    document.getElementById('victoryAudio').currentTime=0;
    
    // Iniciar música y juego
    startPlaylist(); // Inicia la primera canción
    playNivelAudio(0);
    document.getElementById('graph-container').style.display = 'block';
    document.getElementById('card').style.display = 'block';
    document.getElementById('level').innerText = "Nivel: 1";
    document.getElementById('score').innerText = "Puntaje: 0";
    document.getElementById('informacion').innerText = "";
    document.getElementById('message').innerText = "";
    document.getElementById('escogiste').innerText = "";
    //document.getElementById('button').style.display = 'none';
    document.getElementById('informacion').innerText = "Estás en el nodo " + currentNode + " y debes llegar al nodo " + targetNode;
    // Restablecer canvas y nodos
    const nodes = document.querySelectorAll('.node');
    nodes.forEach((node) => {
        // Elimina cualquier estilo "inline" para restablecer el CSS original
        node.style.top = '';
        node.style.left = '';
    });

    updateScore();  // Mostrar puntaje inicial
    resetCanvas();
    resetNodes();
    setNodePositions(currentLevel);
    document.getElementById(currentNode).style.backgroundColor = 'green';
    
}



function toggleDropdown() {
    const content = document.getElementById("dropdownContent");
    if (content.style.display === "none") {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  }


  const toggleButton = document.getElementById('toggleMusic');
  let isPaused = false; // Estado de la música (pausado o reproduciendo)
  
  // Evento para alternar la música
  toggleButton.addEventListener('click', () => {
      if (isPaused) {
          // Reanuda la música actual
          audioPlayer.play();
          toggleButton.textContent = 'PAUSAR MUSICA'; // Cambia el texto del botón
          toggleButton.setAttribute('data-label', 'PAUSAR MUSICA');
          isPaused = false;
      } else {
          // Pausa la música actual
          audioPlayer.pause();
          toggleButton.textContent = 'REPRODUCIR MUSICA'; // Cambia el texto del botón
          toggleButton.setAttribute('data-label', 'REPRODUCIR MÚSICA');
          isPaused = true;
      }
  });
  