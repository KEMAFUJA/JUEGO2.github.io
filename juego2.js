// Estructura de niveles, cada nivel tiene un grafo y un nodo objetivo
const levels = [//B=CASA
    { graph: { A: ['C:7','B:20'], B: [], C: ['B:8'] },start: 'A', target: 'B' },
    { graph: { A: ['D:10'], B: [], C: ['B:10'], D: ['C:10']},start: 'A', target: 'B' },
    { graph: { A: ['D:6','C:2','B:20'], B: [], C: [], D: ['E:6'], E: ['B:6'] },start: 'A', target: 'B' },
    { graph: { A: ['F:10'], B: [], C: ['B:10'], D: ['B:5'], E: ['D:5'], F:['C:10','E:5'] },start: 'A', target: 'B' },
    { graph: { A: ['G:2','C:10'], B: [], C: ['B:10','D:5'], D: ['E:5'], E: ['B:5'], F: [], G:['C:2','F:2'] },start: 'A', target: 'B' },
    { graph: { A: ['D:10', 'E:2'], B: [], C: ['B:10'], D: ['H:10'], E: ['H:2'], F: ['A'], G: ['C:10'], H:['G:10'] },start: 'A', target: 'B' },
    { graph: { A: ['I:10', 'H:5', 'C:2'], B: [], C: ['B:50'], D: ['H:10'], E: ['B:5'], F: ['A'], G: ['C:10'], H:['E:5','B:10'], I:['D:10',] },start: 'A', target: 'B' },
    { graph: { A: ['I:10', 'H:5', 'C:2','J:20'], B: [], C: ['B:50'], D: ['H:10'], E: ['B:5'], F: ['A'], G: ['C:10'], H:['E:5','B:10'], I:['D:10',],J:['B:20'] },start: 'A', target: 'B' },
    { graph: { A: ['I:10', 'K:5', 'C:2','J:20'], B: [], C: ['B:50'], D: ['H:10'], E: ['B:5'], F: ['A'], G: ['C:10'], H:['E:5','B:10'], I:['D:10',],J:['B:20'],K:['H:5'] },start: 'A', target: 'B' },
    { graph: { A: ['I:10', 'K:5', 'C:2','J:20','L:50'], B: [], C: ['B:50'], D: ['H:10'], E: ['B:5'], F: ['A'], G: ['C:10'], H:['E:5','B:10'], I:['D:10',],J:['B:20'],K:['H:5'] },L:['B:50'],start: 'A', target: 'B' },
];
//limites para dibujar los nodos
const limits = {
    topMin: 10,
    topMax: 350,
    leftMin: 30,
    leftMax: 530
};

const minDis = 100; // Mínimo de 100px entre nodos
//generador de posicion
function posAle(min, max) {
    return Math.floor(Math.random() * ((max - min) / 10 + 1)) * 10 + min;
}

function estaCerca(nuevaPos, posi) {
    return posi.some(pos => {
        const dist = Math.sqrt(
            Math.pow(parseInt(nuevaPos.top) - parseInt(pos.top), 2) +
            Math.pow(parseInt(nuevaPos.left) - parseInt(pos.left), 2)
        );
        return dist < minDis;
    });
}

function generarPosNodo(nodes) {
    const posiciones = [];
    const res = {};

    nodes.forEach(node => {
        let posicion;
        do {
            posicion = {
                top: posAle(limits.topMin, limits.topMax) + 'px',
                left: posAle(limits.leftMin, limits.leftMax) + 'px'
            };
        } while (estaCerca(posicion, posiciones));

        posiciones.push(posicion);
        res[node] = posicion;
    });

    return res;
}

const levelsWithRandomPositions = levels.map(level => {
    const nodes = Object.keys(level.graph); // Extraer los nodos del grafo
    const positions = generarPosNodo(nodes); // Generar posiciones con distancia mínima
    return { ...level, positions }; // Retornar el nivel con las posiciones generadas
});

function ponerPosicionNodo(level) {
    const posicion = levelsWithRandomPositions[level].positions; // Obtener posiciones del nivel
    const nombres = ['QUIL', 'TROZ', 'MOFE', 'XYPA', 'WERO', 'KNOZ', 'VRIX', 'PAXU', 'LURN', 'ZEKY']; // Lista de nombres
    // Mezclar los nombres aleatoriamente
    const shuffledNames = nombres.sort(() => Math.random() - 0.5);

    let i = 0; // Índice para asignar los nombres
    for (const [node, pos] of Object.entries(posicion)) {
        const elem = document.getElementById(node);
        if (elem) {
            elem.style.position = 'absolute';
            elem.style.top = pos.top;
            elem.style.left = pos.left;
            
            // Asignar el nombre aleatorio al innerText
            if (i>1){
            elem.innerText = shuffledNames[i];}
            i++; // Incrementar el índice
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
    const conexiones = levels[currentLevel].graph[currentNode];
    // Busca si la conexión solicitada existe
    const conexion = conexiones.find(c => c.startsWith(node + ':'));

    if (conexion) {
        // Conexión válida
        const { weight } = DividirConexion(conexion);
        document.getElementById('escogiste').innerText = "ESCOGISTE EL NODO: " + document.getElementById(node).innerText;
        dibujarLinea(currentNode, node, 'green'); // Dibujar la línea de conexión válida
        updateScore(weight);
        // Cambiar el color del nodo visitado
        document.getElementById(node).style.backgroundColor = '#2ecc71';
        currentNode = node;
    } else {
        // Conexión inválida
        dibujarLinea(currentNode, node, 'red'); // Línea roja
        updateScore(-5); // Penalización

        // Reinicia el juego limpiando las líneas y el estado
        setTimeout(() => {
            resetCanvas();
            resetNodes();
        }, 1000);

        currentNode = levels[currentLevel].start; // Reiniciar al nodo inicial
    }
    
    checkWin();
}

// Función para dibujar las líneas entre los nodos
function dibujarLinea(from, to, color) {
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
        document.getElementById('message').innerText = "¡Felicidades! Llegaste al Casa.";

        setTimeout(() => {
            if (currentLevel < levels.length - 1) {
                document.getElementById('escogiste').innerText = "";
                document.getElementById('informacion2').innerText = "";
                sigLevel();
            } else {
                // Último nivel completado
                document.getElementById('message').innerText = "¡Juego terminado! Has completado todos los niveles.";
                document.getElementById('informacion').innerText = "FELICIDADES";
                document.getElementById('escogiste').innerText = "";
                document.getElementById('SEGUNDO').innerText = ""; 
                // Mostrar botón para reiniciar
                /*const restartButton = document.getElementById('button');
                restartButton.style.display = 'block';
                restartButton.onclick = restartGame;
                document.body.appendChild(restartButton);*/
                document.querySelector('.centered-container').style.display = 'block';
                document.getElementById('PRIMERO').textContent = 'FELICIDADES GANASTE CON ' + score + 'PTS.'; 
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


function sigLevel() {
    currentLevel++;  // Incrementar el nivel
    currentNode = levels[currentLevel].start;  // Establecer el nodo de inicio del nuevo nivel
    targetNode = levels[currentLevel].target;  // Establecer el nodo objetivo para el nuevo nivel
    if (score !== 0){  
        updateScore(20);}//Bonificación de puntos por avanzar de nivel  

    // Actualizar el nivel en la interfaz
    document.getElementById('level').innerText = "Nivel: " + (currentLevel + 1);
    //document.getElementById('informacion').innerText = "Estás en el nodo " + currentNode + " y debes llegar al nodo " + targetNode;
    playNivelAudio(currentLevel);
    // Restablecer los nodos y el canvas para el nuevo nivel
    resetNodes();
    resetCanvas();
    ponerPosicionNodo(currentLevel);
    document.getElementById(currentNode).style.backgroundColor = 'green';
}


// Función para actualizar el puntaje
function updateScore( pts) {
    setTimeout(() => {
        score+=pts;
        document.getElementById('score').innerText = "Puntaje " + score ; // Borrar mensaje
    }, 1000);
    if (pts < 0) {
        document.getElementById('score').innerText = "Puntaje: " + (score +""+ pts);
        document.getElementById('score').className = 'num';
    } else if (pts > 0) {
        document.getElementById('score').innerText = "Puntaje: " + (score + "+" + pts);
        document.getElementById('score').className = 'numero';
    }
    

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
function startPlaylist() {
    currentTrackIndex = 0; // Asegúrate de comenzar desde la primera canción
    playCurrentTrack();
}

// Selecciona el botón de inicio
const iniciarButton = document.getElementById('iniciar');
iniciarButton.onclick = function () {
    const centeredContainer = document.querySelector('.centered-container');
    centeredContainer.style.display = 'none';

    const gameContainer = document.querySelector('.card');
    gameContainer.style.display = 'block';

    startGame();
};


function giveHint() {
    const connections = levels[currentLevel].graph[currentNode];
    if (!connections || connections.length === 0) {
        document.getElementById('informacion2').innerText = "No hay conexiones desde este nodo.";
        return;
    }

    let bestMove = null;
    let bestValue = -Infinity;

    connections.forEach(connection => {
        const { node } = DividirConexion(connection);
        const value = minimax(node, 1, false); // Profundidad fija de 1 para la pista
        if (value > bestValue) {
            bestValue = value;
            bestMove = connection; // Guardar la conexión completa
        }
    });

    if (bestMove) {
        nodo=DividirConexion(bestMove).node;
        document.getElementById('informacion2').innerText = "Pista: Sigue el camino hacia el nodo " + document.getElementById(nodo).innerText;
        document.getElementById('escogiste').innerText = "ESCOGISTE EL NODO: " + document.getElementById(nodo).innerText;
        dibujarLinea(currentNode, nodo, 'green');
        document.getElementById(nodo).style.backgroundColor = '#2ecc71';
        currentNode = nodo;
        checkWin();
    } else {
        document.getElementById('informacion2').innerText = "No se encontró un movimiento óptimo.";
    }
}

    /**
 * Minimax: calcula el mejor valor posible desde un nodo.
 * @param {number} node - El nodo actual a evaluar.
 * @param {number} depth - La profundidad máxima a explorar.
 * @param {boolean} isMaximizing - Si es el turno del jugador o de la computadora.
 * @returns {number} El valor evaluado para este nodo.
 */

    function isTerminalNode(node) {
        return levels[currentLevel].graph[node].length === 0 || node === targetNode;
    }

    function minimax(node, depth, isMaximizing) {
        if (depth === 0 || isTerminalNode(node)) {
            return evaluateNode(node);
        }
    
        const connections = levels[currentLevel].graph[node];
        if (isMaximizing) {
            let maxEval = -Infinity;
            connections.forEach(connection => {
                const { node: nextNode } = DividirConexion(connection);
                const eval = minimax(nextNode, depth - 1, false);
                maxEval = Math.max(maxEval, eval);
            });
            return maxEval;
        } else {
            let minEval = Infinity;
            connections.forEach(connection => {
                const { node: nextNode } = DividirConexion(connection);
                const eval = minimax(nextNode, depth - 1, true);
                minEval = Math.min(minEval, eval);
            });
            return minEval;
        }
    }
    
        
    function evaluateNode(node) {
        if (node === targetNode) {
            return 100; // Gran recompensa si se alcanza el objetivo
        }
        return -10; // Penalización por cada paso intermedio
    }

const hintButton = document.getElementById('hint-button');
hintButton.onclick = () => {
    //document.getElementById('informacion').innerText="¡Botón presionado!";
    giveHint();
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
    document.getElementById('informacion2').innerText = "";
    document.getElementById('message').innerText = "";
    document.getElementById('escogiste').innerText = "";
    //document.getElementById('button').style.display = 'none';
    //document.getElementById('informacion').innerText = "Estás en el nodo " + currentNode + " y debes llegar al nodo " + targetNode;
    // Restablecer canvas y nodos
    const nodes = document.querySelectorAll('.node');
    nodes.forEach((node) => {
        // Elimina cualquier estilo "inline" para restablecer el CSS original
        node.style.top = '';
        node.style.left = '';
    });

    updateScore(0);  // Mostrar puntaje inicial
    resetCanvas();
    resetNodes();
    ponerPosicionNodo(currentLevel);
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
  
