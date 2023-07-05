/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
let palos = ["viu", "cua", "hex", "cir"];
// Array de número de cartas
let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
//let numeros = [9, 10, 11, 12];

// paso (top y left) en pixeles de una carta a la siguiente en un mazo
let paso = 5;

// Tapetes				
let tapeteInicial   = document.getElementById("inicial");
let tapeteSobrantes = document.getElementById("sobrantes");
let tapeteReceptor1 = document.getElementById("receptor1");
let tapeteReceptor2 = document.getElementById("receptor2");
let tapeteReceptor3 = document.getElementById("receptor3");
let tapeteReceptor4 = document.getElementById("receptor4");

// Mazos
let mazoInicial   = [];
let mazoSobrantes = [];
let mazoReceptor1 = [];
let mazoReceptor2 = [];
let mazoReceptor3 = [];
let mazoReceptor4 = [];

// Contadores de cartas
let contInicial     = document.getElementById("contador_inicial");
let contSobrantes   = document.getElementById("contador_sobrantes");
let contReceptor1   = document.getElementById("contador_receptor1");
let contReceptor2   = document.getElementById("contador_receptor2");
let contReceptor3   = document.getElementById("contador_receptor3");
let contReceptor4   = document.getElementById("contador_receptor4");
let contMovimientos = document.getElementById("contador_movimientos");

// Tiempo
let contTiempo  = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos 	 = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador


/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

 
// Rutina asociada a boton reset
/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/

// Función para reiniciar el juego
function reiniciarJuego() {
	
	mazoInicial   = [];
	mazoSobrantes = [];
	mazoReceptor1 = [];
	mazoReceptor2 = [];
	mazoReceptor3 = [];
	mazoReceptor4 = [];

	reiniciaTapete(tapeteInicial);
	reiniciaTapete(tapeteSobrantes);
	reiniciaTapete(tapeteReceptor1);
	reiniciaTapete(tapeteReceptor2);
	reiniciaTapete(tapeteReceptor3);
	reiniciaTapete(tapeteReceptor4);
	
	comenzarJuego();
}

function reiniciaTapete(tapete) {
	let imgsTapete = tapete.getElementsByTagName('img');
	let imgsTapeteArray = Array.from(imgsTapete);

	for (let img of imgsTapeteArray) {
	  if (tapete.contains(img)) {
		tapete.removeChild(img);
	  }
	}
}
  
// Asignar evento de clic al botón de reinicio
let resetButton = document.getElementById("reset");
resetButton.addEventListener("click", () => reiniciarJuego());


// El juego arranca ya al cargar la página: no se espera a reiniciar
/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/

// Función para el evento dragstart
function dragStart(e) {
	e.dataTransfer.setData( "text/plain/numero", e.target.dataset["numero"] );
	e.dataTransfer.setData( "text/plain/palo", e.target.dataset["palo"] );
	e.dataTransfer.setData( "text/plain/id", e.target.dataset["id"] );
}

// Función para el evento drag
function drag(e) {
}

// Función para el evento dragend
function dragEnd(e) {
}

// Función para el evento dragenter
function dragEnter(e) {
	e.preventDefault();
	e.target.classList.add('drag-over');
}

// Función para el evento dragover
function dragOver(e) {
    e.preventDefault();
	e.target.classList.add('drag-over');
}9

// Función para el evento dragleave
function dragLeave(e) {
	e.preventDefault();
	e.target.classList.remove('drag-over');
}

// Función para el evento drop
function drop(e) {
    e.preventDefault();
	e.target.classList.remove('drag-over');
	
    let numero = e.dataTransfer.getData("text/plain/numero");
	let palo = e.dataTransfer.getData("text/plain/palo");
	let id = e.dataTransfer.getData("text/plain/id");

	let receptorId = e.target.id;
	let receptorMazo = [];

	if(receptorId.includes('-')) {
		receptorId = e.target.parentElement.id;
	}

	switch (receptorId) {
		case "receptor1":
			receptorMazo = mazoReceptor1;
			break;
		case "receptor2":
			receptorMazo = mazoReceptor2;
			break;
		case "receptor3":
			receptorMazo = mazoReceptor3;
			break;
		case "receptor4":
			receptorMazo = mazoReceptor4;
			break;
		case "sobrantes":
			moverASobrantes(id);
			break;
		default:
			break;
	}
	
	if (validarMovimiento(numero, palo, receptorMazo)) {
		let carta = document.getElementById(id);
		let parent = carta.parentElement;

		if(parent.id.includes('inicial')) {
			mazoInicial = mazoInicial.filter(item => item.id !== id);
		} 
		if(parent.id.includes('sobrantes')) {
			mazoSobrantes = mazoSobrantes.filter(item => item.id !== id);
		} 

		receptorMazo.push(carta);
		let tapeteReceptor = document.getElementById(receptorId);

		carta.style.top = "15px";
		carta.style.left = "15px";
		carta.setAttribute( "draggable", false );
		tapeteReceptor.appendChild(carta);

		actualizarContadores();
	} 

	// Llamar a la función para observar el mazo inicial
	observarMazoInicial();
}


// Función para mover a sobrantes
function moverASobrantes(id){
	let carta = document.getElementById(id);
	mazoInicial = mazoInicial.filter(item => item.id !== id);
	mazoSobrantes.push(carta);

	carta.style.top = "15px";
    carta.style.left = "15px";
	tapeteSobrantes.appendChild(carta);

	contSobrantes.textContent = mazoSobrantes.length;
	actualizarContadores();
}

// Función para validar el movimiento de una carta a un receptor
function validarMovimiento(numero, palo, receptorMazo) {
	if (receptorMazo.length === 0) {
		return numero === "12";
	} else {
		const ultimaCartaMazoReceptor = receptorMazo[receptorMazo.length - 1];
		const paloUltimaCartaMazo = ultimaCartaMazoReceptor.dataset.palo;
		const numeroUltimaCartaMazo = ultimaCartaMazoReceptor.dataset.numero;

		let colorUltimaCarta = colorCarta(paloUltimaCartaMazo);
		let colorNuevaCarta = colorCarta(palo);

		if(((colorUltimaCarta === 'naranja' && colorNuevaCarta === 'gris') || (colorUltimaCarta === 'gris' && colorNuevaCarta === 'naranja')) 
			&& (numero == numeroUltimaCartaMazo -1 )){
			return true;	
		} else {
			return false;
		}	
	}
}

function colorCarta(palo){
	let naranja = ['cua','viu'];
	let gris = ['cir','hex'];

	const esNaranja = naranja.find((elem) => elem === palo) !== undefined;
	const esGris = gris.find((elem) => elem === palo) !== undefined;

	if(esNaranja) {
		return 'naranja';
	} 
	if(esGris) {
		return 'gris';
	}

}

// Función para actualizar los contadores de cartas
function actualizarContadores() {
	contInicial.textContent = mazoInicial.length;
	contSobrantes.textContent = mazoSobrantes.length;
	contReceptor1.textContent = mazoReceptor1.length;
	contReceptor2.textContent = mazoReceptor2.length;
	contReceptor3.textContent = mazoReceptor3.length;
	contReceptor4.textContent = mazoReceptor4.length;
	
	let numMov = parseInt(contMovimientos.innerHTML);	
	numMov += 1;
	contMovimientos.innerHTML = numMov;
}

// Definir la función para observar el mazo inicial
function observarMazoInicial() {
	if(mazoInicial.length === 0 && mazoSobrantes !== 0){
		barajar(mazoSobrantes);  
		cargarTapeteInicial(mazoSobrantes);
		reiniciaTapete(tapeteSobrantes);
		
		contSobrantes.textContent = 0;
		contInicial.textContent = mazoSobrantes.length;
		mazoInicial = mazoSobrantes;
		mazoSobrantes = [];
	} 

	if(mazoInicial.length === 0 && mazoSobrantes.length === 0){
		let divFinJuego = document.getElementById('finJuego');
		divFinJuego.classList.remove('finJuego');

		let tiempo = document.getElementById('tiempoJuego');
		tiempo.innerHTML = contTiempo.innerHTML;
		let movs = document.getElementById('movimientos');
		movs.innerHTML = contMovimientos.innerHTML;

		clearTimeout(temporizador);
	}
}  

// Desarrollo del comienzo de juego
function comenzarJuego() {
	/* Crear baraja, es decir crear el mazoInicial. Este será un array cuyos 
	elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
	Sugerencia: en dos bucles for, bárranse los "palos" y los "numeros", formando
	oportunamente el nombre del fichero png que contiene a la carta (recuérdese poner
	el path correcto en la URL asociada al atributo src de <img>). Una vez creado
	el elemento img, inclúyase como elemento del array mazoInicial. 
	*/

	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/	
     for (let i = 0; i < palos.length; i++) {
        for (let j = 0; j < numeros.length; j++) {
            let carta = document.createElement("img");
			const idCarta = numeros[j] +"-" + palos[i];
            carta.src = "./imagenes/baraja/" +idCarta + ".png";
			carta.setAttribute("data-palo", palos[i]);
			carta.setAttribute("data-numero", numeros[j]);
			carta.setAttribute("data-id", idCarta);
			carta.setAttribute("id", idCarta);
			carta.setAttribute( "draggable", true );
			
			// Evento dragstart: se dispara cuando se comienza a arrastrar el objeto (carta)
			carta.ondragstart = dragStart;

			// Evento drag: se dispara mientras se está arrastrando el objeto (carta)
			carta.ondrag = drag;

			// Evento dragend: se dispara cuando se ha terminado de arrastrar el objeto (carta)
			carta.ondragend = dragEnd;

            mazoInicial.push(carta);
        }
    }
	
	// Añadimos drag and drop a los tapetes	
	tapeteSobrantes.ondragenter = dragEnter;
	tapeteSobrantes.ondragover = dragOver;
	tapeteSobrantes.ondragleave = dragLeave;
	tapeteSobrantes.ondrop = drop;	

	tapeteReceptor1.ondragenter = dragEnter;
	tapeteReceptor1.ondragover = dragOver;
	tapeteReceptor1.ondragleave = dragLeave;
	tapeteReceptor1.ondrop = drop;	
	
	tapeteReceptor2.ondragenter = dragEnter;
	tapeteReceptor2.ondragover = dragOver;
	tapeteReceptor2.ondragleave = dragLeave;
	tapeteReceptor2.ondrop = drop;
	
	tapeteReceptor3.ondragenter = dragEnter;
	tapeteReceptor3.ondragover = dragOver;
	tapeteReceptor3.ondragleave = dragLeave;
	tapeteReceptor3.ondrop = drop;
	
	tapeteReceptor4.ondragenter = dragEnter;
	tapeteReceptor4.ondragover = dragOver;
	tapeteReceptor4.ondragleave = dragLeave;
	tapeteReceptor4.ondrop = drop;
	
	// Barajar y dejar mazoInicial en tapete inicial
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	barajar(mazoInicial);
    cargarTapeteInicial(mazoInicial);

	// Puesta a cero de contadores de mazos
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	setContador(contInicial, mazoInicial.length);
    setContador(contSobrantes, 0);
    setContador(contReceptor1, 0);
    setContador(contReceptor2, 0);
    setContador(contReceptor3, 0);
    setContador(contReceptor4, 0);
    setContador(contMovimientos, 0);
	
	// Arrancar el conteo de tiempo
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	arrancarTiempo();
} // comenzarJuego


/**
	Se debe encargar de arrancar el temporizador: cada 1000 ms se
	debe ejecutar una función que a partir de la cuenta autoincrementada
	de los segundos (segundos totales) visualice el tiempo oportunamente con el 
	format hh:mm:ss en el contador adecuado.

	Para descomponer los segundos en horas, minutos y segundos pueden emplearse
	las siguientes igualdades:

	segundos = truncar (   segundos_totales % (60)                 )
	minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
	horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

	donde % denota la operación módulo (resto de la división entre los operadores)

	Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
	   00:02:14

	Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que 
	evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
	el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
	a clearInterval en su caso.   
*/

function arrancarTiempo(){
    if (temporizador) clearInterval(temporizador);
    let hms = function (){
        let seg = Math.trunc( segundos % 60 );
        let min = Math.trunc( (segundos % 3600) / 60 );
        let hor = Math.trunc( (segundos % 86400) / 3600 );
        let tiempo = ( (hor<10)? "0"+hor : ""+hor ) 
                    + ":" + ( (min<10)? "0"+min : ""+min )  
                    + ":" + ( (seg<10)? "0"+seg : ""+seg );
        setContador(contTiempo, tiempo);
        segundos++;
    };
    segundos = 0;
    hms(); // Primera visualización 00:00:00
    temporizador = setInterval(hms, 1000);
} // arrancarTiempo


/**
	Si mazo es un array de elementos <img>, en esta rutina debe ser
	reordenado aleatoriamente. Al ser un array un objeto, se pasa
	por referencia, de modo que si se altera el orden de dicho array
	dentro de la rutina, esto aparecerá reflejado fuera de la misma.
*/
function barajar(mazo) {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	for (let i = mazo.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = mazo[i];
        mazo[i] = mazo[j];
        mazo[j] = temp;
    }	
} // barajar

/**
 	En el elemento HTML que representa el tapete inicial (variable tapeteInicial)
	se deben añadir como hijos todos los elementos <img> del array mazo.
	Antes de añadirlos, se deberían fijar propiedades como la anchura, la posición,
	coordenadas top y left, algun atributo de tipo data-...
	Al final se debe ajustar el contador de cartas a la cantidad oportuna
*/
function cargarTapeteInicial(mazo) {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	for (let i = 0; i < mazo.length; i++) {
        let carta = mazo[i];
        carta.style.width = "70px";
        carta.style.position = "absolute";
		carta.style.top = `${paso * i}px`;
        carta.style.left = `${paso * i}px`;
        tapeteInicial.appendChild(carta);
    }
    setContador(contInicial, mazo.length);
} // cargarTapeteInicial


/**
 	Esta función debe incrementar el número correspondiente al contenido textual
   	del elemento que actúa de contador
*/
function incContador(contador){
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/	
	let valor = parseInt(contador.innerText);
    valor++;
    contador.innerText = valor;
} // incContador

/**
	Idem que anterior, pero decrementando 
*/
function decContador(contador){
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! ***/	
	let valor = parseInt(contador.innerText);
    valor--;
    contador.innerText = valor;
} // decContador

/**
	Similar a las anteriores, pero ajustando la cuenta al
	valor especificado
*/
function setContador(contador, valor) {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	contador.innerText = valor;
} // setContador

comenzarJuego();
barajar(mazoInicial);



