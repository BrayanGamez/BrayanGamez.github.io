window.onload = inicio;
window.onresize = reajuste;

// Direcciones de los videos.
var videos = ["videos/video01/video0100000.mp4",
    "videos/video02/video0200000.mp4", "videos/video03/video0300000.mp4", "videos/video04/video0400000.mp4",
    "videos/video05/video0500000.mp4", "videos/video06/video0600000.mp4", "videos/video07/video0700000.mp4",
    "videos/video08/video0800000.mp4", "videos/video09/video0900000.mp4", "videos/video10/video1000000.mp4",
    "videos/video11/video1100000,mp4"
];

// Títulos de los videos
var titulos = ["Bosque nublado", "Intersección de tren", "Café en las Montañas", "Animales de corral", "Bosque nublado 2.0",
    "Intersección de tren 2.0", "Café en las Montañas 2.0", "Animales de corral 2.0", "Bosque nublado 3.0", "Intersección de tren 3.0",
    "Café en las Montañas 3.0"];

var vid; // Variable que se referirá al video.

// Velocidades e índices
let estados = [0.2, 0.5, 1, 2, 2.5];
speed = 2;

// Orden de reproducción
var orden = [];
var videoActual = 0;
var primera = true; // Variable que indica que es el primer video en reproducirse.

var mostrar = true;

// Calidad de reproducción
var indiceCalidad, calidadAuto;
let resoluciones = ['240p', '360p', '480p', '720p'];

// Variable que indica si el mouse está presionado
var mouseAbajo = false;

// Variable que indica que el avance/retraso del video está ocurriendo
var movimientoCombinado = false;

// Variable que indica que se está cambiando el volumen con la barra 
var movimientoVolumen = false;

// Variable que indica que el video se pausó al adelantar/retrasar con el mouse
var videopausado = false;

// Variables que indican cuandos se está mostrando la ventana de velocidades y resoluciones, respectivamente.
var mostrandoV = false;
var mostrandoR = false;

// Variable que indica si está en modo pantalla completa
var pantallaCompleta = false;

// Primera funcióna ejecutarse.
function inicio() {

    vid = document.querySelector("video");
    vid.src = `${videos[videoActual]}`;

    resolucionAuto();
    indiceCalidad = calidadAuto;

    // Se centran los elementos
    reajuste();

    // Play/pausa
    vid.onclick = play;
    document.querySelector(".play").onclick = play;

    // Botón del volumen
    document.querySelector(".volumen").onclick = volumen;

    //Botón del siguiente video
    document.querySelector(".siguiente").onclick = siguiente;

    // Botón del video anterior
    document.querySelector(".anterior").onclick = anterior;

    // Maximizar el tamaño de la ventana
    document.querySelector(".ampliar").onclick = ampliar;

    // Avanzar/Retroceder el video según donde se dió click en la barra
    document.querySelector(".barra").onclick = buscar;

    // Reproducir siguiente video al terminarse el actual
    vid.onended = siguiente;

    // Evento para que aparezca el div del controlador 
    document.querySelector(".contenedor").onmousemove = colocarControlador;

    // Evento para que desaparezca el div del controlador.
    document.querySelector(".contenedor").onmouseleave = quitarControlador;

    // Evento para detectar si se está apretando la barra de volumen
    document.getElementById("barraGris").onmousemove = controlVolumen;

    // Se muestra la ventana de las velocidades
    document.querySelector(".velocidad").onclick = mostrarVelocidades;

    // Velocidades de reproducción.
    document.getElementById("v0.2").addEventListener('click', (event) => {
        velocidad(0);
        mostrarVelocidades();
    });

    document.getElementById("v0.5").addEventListener('click', (event) => {
        velocidad(1);
        mostrarVelocidades();
    });

    document.getElementById("v1.0").addEventListener('click', (event) => {
        velocidad(2);
        mostrarVelocidades();
    });

    document.getElementById("v2.0").addEventListener('click', (event) => {
        mostrarVelocidades();
        velocidad(3);
    });

    document.getElementById("v2.5").addEventListener('click', (event) => {
        mostrarVelocidades();
        velocidad(4);
    });

    // Resoluciones del video

    // Mostrar la ventana de resoluciones
    document.querySelector(".calidad").onclick = mostrarResoluciones;

    // Resolución automática 
    document.getElementById("cAuto").addEventListener('click', (event) => {
        resolucionAuto();
        cambiarCalidad(calidadAuto);
        mostrarResoluciones();
    });

    document.getElementById("c240").addEventListener('click', (event) => {
        cambiarCalidad(0);
        mostrarResoluciones();
    });

    document.getElementById("c360").addEventListener('click', (event) => {
        cambiarCalidad(1);
        mostrarResoluciones();
    });

    document.getElementById("c480").addEventListener('click', (event) => {
        cambiarCalidad(2);
        mostrarResoluciones();
    });

    document.getElementById("c720").addEventListener('click', (event) => {
        cambiarCalidad(3);
        mostrarResoluciones();
    });


    // Mientras el cursor se mueva sobre la barra, se cambiará el ancho de la barra de cursor
    document.querySelector(".barra").onmousemove = barraDeCursor;

    // Cuando el cursor abandone la barra, se removerán los cambios
    document.querySelector(".barra").onmouseleave = removerBarradeCursor;

    // Todas las veces que se mantenga presionado el mouse, se ejecutará mouseApretado
    document.body.onmousedown = mouseApretado;

    // Todas las veces que se suelte el mouse, se ejecutará mouseNoApretado
    document.body.onmouseup = mouseNoApretado;

    // Todas las veces que se mueva el mouse por la pantalla, se ejecutará arrastrarCirculo
    document.body.onmousemove = arrastrarCirculo;

    // Mostrar ventana con información para el usuario.
    document.querySelector(".ayuda").onclick = ayuda;

    // Cerrar la ventana de información 
    document.querySelector(".aceptar").onclick = ayuda;

    // Me gusta video
    document.querySelector(".megusta").onclick = megusta;

    // Generar orden aleatorio de videos
    reordenar();

    // Actualizar el avance de la barra de reproducción
    vid.addEventListener('timeupdate', actualizar);
    vid.addEventListener('loadeddata', actualizar);

    // Se cargará la barra de buffer cada vez que el navegador descargue los videos para ser reproducidos.
    vid.addEventListener('progress', retraso);

    // Cada vez que el mouse se posicione sobre los botones centrales, se mostrarán tras medio segundo.
    document.querySelector(".flotante").addEventListener('mousemove', (event) => {
        setTimeout(mostrarFlotantes, 500);
    });

    // Cada vez que el mouse se quite de los botones centrales, se quitarán tras  medio segundo.
    document.querySelector(".flotante").addEventListener('mouseleave', (event) => {
        setTimeout(quitarFlotantes, 500);
    });

}


// FUNCIONAMIENTO BÁSICO DEL REPRODUCTOR

// Pausa/play al dar click
function play() {

    // Si está pausado, se da play
    if (vid.paused) {
        vid.play();
        document.querySelector(".play").src = "img/pausa.png";
        document.querySelector(".play").title = "Pausar el video";

    }
    else { // Si está reproduciendose, se pone en pausa
        vid.pause();
        document.querySelector(".play").src = "img/play.png";
        document.querySelector(".play").title = "Reproducir el video";

    }
}

// Poner/quitar mudo
function volumen() {

    vid.volume = !vid.volume;
    document.querySelector(".volumen").src = `img/volumen${vid.volume}.png`;

    if (vid.volume == 1) {
        document.getElementById("barraVolumen").style.width = "100px";
        document.querySelector(".volumen").title = "Desactivar volumen"
    }
    else {
        document.querySelector(".volumen").title = "Activar volumen";
        document.getElementById("barraVolumen").style.width = "0";

    }

}

// Reordenar aleatoriamente los videos
function reordenar() {
    for (v of videos) {
        do {
            var azar = Math.floor(Math.random() * videos.length);

        } while (orden.indexOf(azar) >= 0);

        orden.push(azar);

    }

    // Comienza el proceso de reproducción de los videos.
    reproducir();
}

// Reproducir el video de turno
function reproducir() {

    let videoToca = orden[videoActual];

    // Se coloca el título del video
    document.getElementById("tituloV").innerHTML = `${titulos[videoToca]}`
    vid.playbackRate = estados[speed];

    tieneLike();

    vid.src = `${videos[videoToca]}`;
    establecerSrc();


    // Si es el primer video, no se reproduce automáticamente; solo se cambia el valor de la variable.
    if (primera) {
        primera = false;
    }
    else { // En el resto de ocasiones, sí se da play.
        vid.play();
    }


}

// Avanzar al siguiente video
function siguiente() {

    // Se limpia el ancho del buffer
    reiniciarBuffer();
    videoActual++;

    if (videoActual >= videos.length) {
        videoActual = 0;
    }


    reproducir();

    // Actualiza los botones según el estado del nuevo video
    vid.paused ? document.querySelector(".play").src = "img/play.png" : document.querySelector(".play").src = "img/pausa.png";

}

// Se retrocede al video anterior
function anterior() {

    // Se limpia el ancho del buffer
    reiniciarBuffer();
    videoActual--;

    if (videoActual < 0) {
        videoActual = videos.length - 1;
    }

    reproducir();

    // Actualiza los botones según el estado del nuevo video
    vid.paused ? document.querySelector(".play").src = "img/play.png" : document.querySelector(".play").src = "img/pausa.png";
}

// Cambiar la velocidad de reproducción
function velocidad(velocidad) {

    speed = velocidad;

    vid.playbackRate = estados[speed];

}

// Evento activado al manipular el teclado
document.addEventListener('keydown', (event) => {

    var tecla = event.key;

    // Si es izquierda, el video se atrasa.
    if (tecla == 'ArrowLeft') {
        atrasar();
    }

    // Si es derecha, el video se adelanta.
    if (tecla == 'ArrowRight') {
        adelantar();
    }

    // Si es el espacio, el video se pausa o reproduce.
    if (tecla == ' ') {
        play();
    }

    // Si es la M, el video se activa o desactiva el mudo
    if (tecla == 'm') {
        volumen();
    }

    // Si es S, se reproduce el siguiente video
    if (tecla == 's') {
        siguiente();
    }

    // Si es A, se reproduce el video anterior.
    if (tecla == 'a') {
        anterior();
    }

    // Si es H, se muestra la ventana de ayuda
    if (tecla == 'h') {
        ayuda();
    }

    // Si es P, se coloca en pantalla completa
    if (tecla == 'p') {
        ampliar();
    }

    if (tecla == 'x') {
        let anchoTotal = document.body.offsetWidth;
        console.log('Desde x ' + anchoTotal)
    }
});

// Función que muestra los atajos del teclado
function ayuda() {

    var ventana = document.querySelector(".ventana");
    // Si es verdadero, se abre la ventana.
    if (mostrar) {
        ventana.style.top = "30vh";
        centrarFlotantes('.ventana', document.body, 'x');
        mostrar = false;

    }
    // Si es falso, se cierra
    else {
        ventana.style.top = "-1000px";
        mostrar = true;

    }
}


// Función que muestra la ventana de velocidades
function mostrarVelocidades() {


    var ventana = document.getElementById("vVelocidades");

    // Si la ventana no se está mostrando, se muestra
    if (!mostrandoV) {
        ventana.style.left = "0";
        mostrandoV = true;

        // Se oculta la ventana de resoluciones para evitar sobreposiciones
        mostrandoR = true;
        mostrarResoluciones();
    }
    else {
        ventana.style.left = "-1000px";
        mostrandoV = false;
    }


}


// Función que muestra la ventana de resoluciones
function mostrarResoluciones() {

    var ventana = document.getElementById("vResoluciones");

    // Si la ventana no se está mostrando, se muestra
    if (!mostrandoR) {
        ventana.style.left = "0";
        mostrandoR = true;

        // Se oculta la ventana de velocidades para evitar sobreposiciones
        mostrandoV = true;
        mostrarVelocidades();
    }
    else {
        ventana.style.left = "-1000px";
        mostrandoR = false;
    }

}

// Función que muestra  los botones flotantes. 
function mostrarFlotantes() {

    var flotantes = document.querySelector(".flotante");
    flotantes.style.opacity = "1";

    // Títulos
    document.querySelector(".velocidad").title = "Mostrar velocidades";
    document.querySelector(".calidad").title = "Mostrar resoluciones";

    if (!pantallaCompleta) {
        document.querySelector(".ampliar").title = "Reducir video";

    } else {
        document.querySelector(".ampliar").title = "Ampliar video";

    }
    // Cursores de los botones flotantes
    document.querySelector(".velocidad").classList.add("boton");
    document.querySelector(".calidad").classList.add("boton");
    document.querySelector(".ampliar").classList.add("boton");
}

// Función que quita los botones flotantes. 
function quitarFlotantes() {

    var flotantes = document.querySelector(".flotante");
    flotantes.style.opacity = "0";

    // Títulos
    document.querySelector(".velocidad").title = "";
    document.querySelector(".calidad").title = "";
    document.querySelector(".ampliar").title = "";

    // Cursores de los botones flotantes
    document.querySelector(".velocidad").classList.remove("boton");
    document.querySelector(".calidad").classList.remove("boton");
    document.querySelector(".ampliar").classList.remove("boton");
}


// AVANCE DEL VIDEO


// Se actualiza la marca del tiempo, junto con la barra de avance
function actualizar() {
    document.getElementById("marcaTiempo").innerHTML
        = `${conversion(vid.currentTime)} / ${conversion(vid.duration)}`;

    // barra de avance
    let porcentaje = (100 * vid.currentTime) / vid.duration;
    document.querySelector(".avanceBarra").style.width = `${porcentaje}%`;


}


// Conversión de segundos al formato deseado
function conversion(tiempo) {

    tiempo = tiempo | 0;
    var segundos, minutos, horas;

    // Si el tiempo es menor a 1 minuto
    if (tiempo < 60) {
        horas = "00";
        minutos = "00";
        segundos = (tiempo <= 9) ? "0" + tiempo : tiempo;
    }
    // Si el tiempo es menor a 1 hora
    else if (tiempo < 3600) {
        horas = "00";

        minutos = (tiempo / 60) | 0;
        minutos = (minutos <= 9) ? "0" + minutos : minutos;

        segundos = tiempo - (minutos * 60);
        segundos = (segundos <= 9) ? "0" + segundos : segundos;

    }
    // Si el tiempo es mayor a 1 hora
    else {

        horas = (tiempo / 3600) | 0;
        horas = (horas <= 9) ? "0" + horas : horas;

        minutos = tiempo - (horas * 3600);
        minutos = (minutos / 60) | 0;
        minutos = (minutos <= 9) ? "0" + minutos : minutos;

        segundos = tiempo - (horas * 3600) - (minutos * 60);
        segundos = (segundos <= 9) ? "0" + segundos : segundos;


    }

    // Cuando solo el tiempo es menor a 1 hora, el formato es 00:00
    if (horas == '00') {
        return `${minutos}:${segundos}`
    }
    // Si es mayor a 1 hora, el formato es 00:00:00
    else {
        return `${horas}:${minutos}:${segundos}`
    }
}

// Funciones para atrasar o adelantar 5s.

function adelantar() {
    vid.currentTime += 5.00;
}

function atrasar() {
    vid.currentTime -= 5.00;
}

// Cambiar al minuto del video donde se dió click
function buscar(e) {

    var dondehehechoclick;

    if (!pantallaCompleta) {
        dondehehechoclick = e.clientX - 132;
    }
    else {
        dondehehechoclick = e.clientX - 22;
    }
    let anchoNavegador = document.querySelector(".barra").offsetWidth;
    let porcentaje = dondehehechoclick / anchoNavegador;
    let posicion = vid.duration * porcentaje;
    vid.currentTime = posicion;
}

/* Función que ubica la posición del cursor sobre la barra de avance y cambia el ancho de la barra del "cursor" hasta
esa posición
*/
function barraDeCursor(e) {

    var anchoBarra = document.querySelector(".barra").offsetWidth;
    var porcentaje = (e.offsetX / anchoBarra) * 100;
    document.querySelector(".cursorBarra").style.width = `${porcentaje}%`;

    // Se muestra el pequeño círculo al final de la barra de avance
    document.querySelector(".frontera").style.visibility = "visible";

    // movimientoCombinado indica que el mouse se empezó a apretar dentro de la barra de avance.
    if (mouseAbajo == true) {
        movimientoCombinado = true;
    }
}


// Función para quitar la barra del cursor, y el círculo anterior
function removerBarradeCursor() {
    document.querySelector(".cursorBarra").style.width = "0";
    document.querySelector(".frontera").style.visibility = "hidden";
}

// Avance y retraso del video en tiempo real. Este método se ejecuta siempre que se mueva el mouse, pero 
// solo tiene efectos cuando el mouse se empezó a presionar dentro de la barra y se sigue presionando
function arrastrarCirculo(e) {

    // Siempre y cuando el mouse esté apretado
    if (movimientoCombinado == true) {

        if (!vid.paused) { // Si el video está reproduciendose, se pausa durante el movimiento
            play();
            videopausado = true;
        }

        document.querySelector(".frontera").style.visibility = "visible";

        var posicion;

        if (!pantallaCompleta) {
            posicion = e.clientX - 132;
        }
        else {
            posicion = e.clientX - 22;
        }
        let anchoBarra = document.querySelector(".barra").offsetWidth;
        let porcentaje = (posicion * 100) / anchoBarra;

        document.querySelector(".avanceBarra").style.width = `${porcentaje}%`;
        vid.currentTime = vid.duration * (porcentaje / 100);

    }

}


// La variable mouseAbajo indica que el mouse está siendo apretado
function mouseApretado() {
    mouseAbajo = true;
}

// Se desactivan las variables cuando el mouse se suelta
function mouseNoApretado() {

    // Si el proceso de arrastre dio lugar y el video estaba pausado por eso, se da play
    if (movimientoCombinado == true && videopausado) {
        play();
        videopausado = false;
    }
    movimientoCombinado = false;
    mouseAbajo = false;
    movimientoVolumen = false;
    document.querySelector(".frontera").style.visibility = "hidden";

}

// BUFFER Y CARGA

// Hay una espera de 0.4 segundos para que el usuario vea que el buffer cargó completamente.
function retraso() {
    setTimeout(cargarBuffer, 400);
    circulodeCarga();
}

/* La función cargarBuffer usa buffered, propiedad que devuelve los rangos de tiempo ya descargados del video.
Cada lapso de tiempo tiene un inicio (start) y un final (end) en segundos.
Tomando el final del último rango, se calcula el porcentaje de video descargado con respecto a la duración total
Dicho calculo se usa para determinar el ancho de la barra de buffer*/
function cargarBuffer() {

    var finalBuffer = vid.buffered.end(vid.buffered.length - 1);
    var duracionV = vid.duration;

    if (duracionV > 0) {
        var calculo = (finalBuffer / duracionV) * 100;
        document.querySelector(".bufferBarra").style.width = `${calculo}%`;
    }

}

// Gráfica circular que muestra la carga del buffer 
function circulodeCarga() {

    var finalBuffer = vid.buffered.end(vid.buffered.length - 1);
    var duracionV = vid.duration;

    if (duracionV > 0) {
        var calculo = (finalBuffer / duracionV) * 100;

        var resultado = 410 - (calculo * 410 / 100);
        document.querySelector(".circle").style.strokeDashoffset = `${resultado}`;

        document.querySelector(".number").innerHTML = `${Math.round(calculo)}%`;

        // EDITAR si se desea cambiar el momento en que la gráfica se deje de ver.
        if (calculo == 100) {
            document.querySelector(".progress-bar").style.display = "none";
        }
    }
}

// Se reinicia el ancho del buffer antes de cambiar al video.
function reiniciarBuffer() {
    document.querySelector(".bufferBarra").style.width = 0;
    document.querySelector(".circle").style.strokeDashoffset = `410`;
    document.querySelector('.number').innerHTML = "";
    document.querySelector(".progress-bar").style.display = "block";

}

// FUNCIONES DE APARIENCIA Y DISPLAY DEL REPRODUCTOR

// Maximizar/minimizar el tamaño del video
function ampliar() {

    var doc = window.document.documentElement;
    if (doc.requestFullscreen) {
        doc.requestFullscreen();
    } else if (doc.webkitRequestFullscreen) { /* Safari */
        doc.webkitRequestFullscreen();
    } else if (doc.msRequestFullscreen) { /* IE11 */
        doc.msRequestFullscreen();
    }


    let anchoTotal = window.screen.availWidth - 20;
    let contenedorV = document.querySelector(".columna2").style;
    contenedorV.width = `${anchoTotal}px`;

    contenedorV.position = "relative";
    contenedorV.left = "-110px";
    document.querySelector(".columna1").style.zIndex = 5;

    document.querySelector(".ampliar").alt = "Reducir video";
    document.querySelector(".ampliar").src = "img/reducir.svg";
    document.querySelector(".ampliar").onclick = reducirBoton   ;

    pantallaCompleta = true;
    
}

// Además de reducir, quita el modo pantalla completa.
function reducirBoton() {

    reducir();

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }

}


// Función que se ejecuta al salir de la pantalla completa
function reducir() {
    let contenedorV = document.querySelector(".columna2").style;
    contenedorV.width = "initial";

    contenedorV.position = "static";
    contenedorV.left = "unset";
    document.querySelector(".columna1").style.zIndex = "unset";

    document.querySelector(".ampliar").onclick = ampliar;
    document.querySelector(".ampliar").src = "img/ampliar.svg";

    pantallaCompleta = false;


}

// Función que centra los botones flotantes en un contenedor según el eje indicado.
function centrarFlotantes(clase, contenedor, dimension) {
    var botones = document.querySelector(clase);

    var porcentaje;

    if (dimension == 'x') {
        var anchoContenedor = contenedor.offsetWidth;
        porcentaje = (botones.offsetWidth / anchoContenedor) * 100;

        var resultado = 50 - (porcentaje / 2);
        botones.style.left = `${resultado}%`;
    }
    else if (dimension == 'y') {
        var altoContenedor = contenedor.offsetHeight;
        porcentaje = (botones.offsetHeight / altoContenedor) * 100;

        var resultado = 50 - (porcentaje / 2);
        botones.style.top = `${resultado}%`;
    }


}

// Función que envia los botones laterales al fondo de la pantalla.
function ajustarLaterales() {
    var altoVideo = vid.offsetHeight;
    var altoSuperior = document.querySelector(".superior").offsetHeight;
    var altoInferior = document.querySelector(".inferior").offsetHeight;

    var rowGapFinal = altoVideo - altoSuperior - altoInferior;
    document.querySelector(".columna1").style.gridRowGap = `${rowGapFinal / 2}px`;
    document.querySelector(".columna1").style.paddingTop = `${rowGapFinal / 4}px`;
}

// Especifíca la altura mínima del video
function alturaMinima() {
    var altoSuperior = document.querySelector(".superior").offsetHeight;
    var altoInferior = document.querySelector(".inferior").offsetHeight;
    var alturaMinima = altoSuperior + altoInferior;

    vid.style.minHeight = `${alturaMinima}px`;
}

// Especifica el ancho mínimo del video.
function anchoMinimo() {
    var anchoBotones = document.querySelector(".flotante").offsetWidth;

    vid.style.minWidth = `${anchoBotones}px`;
}


// Función que actualiza los estilos ante cambios en el tamaño de la ventana
function reajuste() {
    centrarFlotantes('.flotante', vid, 'x');
    ajustarLaterales();
    alturaMinima();
    anchoMinimo();
    centrarFlotantes('.progress-bar', document.querySelector(".contenedorVideo"), 'x');
    centrarFlotantes('.progress-bar', document.querySelector(".contenedorVideo"), 'y');

    // Si no hay ningun elemento en pantalla completa, se debe reiniciar a las posiciones iniciales.
    if (document.fullscreenElement == null) {
        reducir();
    }


}


// Para cada video hay 4 versiones de distinta resolución. Esta función cambia el archivo del video por el adecuado..
function cambiarCalidad(calidad) {

    indiceCalidad = calidad;

    // Se guarda la posición del video actual.
    var posicionT = vid.currentTime;
    establecerSrc();
    vid.currentTime = posicionT;
    play();
}

// La función cambia la ruta del archivo según la resolución de turno.
function establecerSrc() {

    var ruta = vid.src;
    var nuevaRuta = ruta.substring(0, ruta.length - 9) + '_' + resoluciones[indiceCalidad] + '.mp4';
    vid.src = `${nuevaRuta}`;
    vid.playbackRate = estados[speed];

}


// Función de me gusta
function megusta() {

    // Se revisa que el navegador soporte el uso de local storage
    if (typeof (Storage) !== "undefined") {

        // Temporalmente, el ID es el título del video.
        var ID = idTemporal(document.getElementById("tituloV").innerHTML);

        if (localStorage.getItem(ID)) {

            if (localStorage.getItem(ID) == "Me gusta") {
                localStorage.setItem(ID, "No me gusta");
                document.querySelector(".megusta").src = "img/corazon_negro.png";
                document.querySelector(".megusta").title = "Me gusta";

            } else if (localStorage.getItem(ID, "No me gusta")) {
                localStorage.setItem(ID, "Me gusta");
                document.querySelector(".megusta").src = "img/corazon_morado.png";
                document.querySelector(".megusta").title = "Quitar me gusta";

            }
        }
        else {
            // Creación del objeto por primera vez 
            localStorage.setItem(ID, "Me gusta");
            document.querySelector(".megusta").src = "img/corazon_morado.png";
            document.querySelector(".megusta").title = "Quitar me gusta";

        }

    } else {
        alert('El navegador usado no soporta local Storage');
    }
}

// Revisa si el video actual tiene likes
function tieneLike() {
    var ID = idTemporal(document.getElementById("tituloV").innerHTML);

    // Se revisa que localStorage sea soportado por el navegador.
    if (typeof (Storage) !== "undefined") {

        if (localStorage.getItem(ID)) {

            if (localStorage.getItem(ID) == "Me gusta") {// Si hay un me gusta, el corazón se pone rojo
                document.querySelector(".megusta").src = "img/corazon_morado.png";
                document.querySelector(".megusta").title = "Quitar me gusta";

            } else if (localStorage.getItem(ID) == "No me gusta") { // Si hay un no me gusta, el corazón se pone negro
                document.querySelector(".megusta").src = "img/corazon_negro.png";
                document.querySelector(".megusta").title = "Me gusta";

            }
        }
        else {
            document.querySelector(".megusta").src = "img/corazon_negro.png";
            document.querySelector(".megusta").title = "Me gusta";
        }

    } else {
        alert('El navegador usado no soporta local Storage');
    }
}

// Se modifican los titulos para que funcionen como IDs temporales.
function idTemporal(titulo) {

    var idTemporal = '';

    for (var c = 0; c < titulo.length; c++) {
        if (titulo.charAt(c) == ' ') {
            idTemporal += '&';
        }
        else {
            idTemporal += titulo.charAt(c);
        }
    }

    return idTemporal;
}


// CONTROL DEL VOLUMEN

// Se activa cuando el cursor está en la barra gris del volumen
function controlVolumen() {

    // Se registra si el mouse está apretado.
    if (mouseAbajo == true) {
        movimientoVolumen = true;
    }
}

// Cuando el mouse se posiciona, se muestra el control del volumen.
function colocarControlador(e) {
    var barraVolumen = document.getElementById("barraVolumen"); // Variable que refiere a la barra roja

    document.getElementById("sobresaliente").style.visibility = "visible";
    document.getElementById("barraGris").style.width = "100px";
    barraVolumen.style.width = `${vid.volume * 100}px`;


    if (movimientoVolumen == true) {
        barraVolumen.style.transition = "width 0s";

        let volumen = e.clientX - 118;

        var anchoV = document.getElementById("barraGris").offsetWidth;
        var porcentaje = volumen / anchoV;

        if (porcentaje < 0) {
            vid.volume = 0;
            document.querySelector(".volumen").src = "img/volumen0.png"; // Se cambia a la imagen de mudo
        }
        else if (porcentaje > 1) {
            vid.volume = 1;
            document.querySelector(".volumen").src = "img/volumen1.png"; // Se cambia a la imagen de volumen activado
        } else {
            vid.volume = porcentaje;
            document.querySelector(".volumen").src = "img/volumen1.png"; // Se cambia a la imagen de volumen activado
        }
    }
}

// Cuando el mouse se retira, se quita el control del volumen.
function quitarControlador() {
    document.getElementById("barraVolumen").style.width = "0";
    document.getElementById("barraGris").style.width = "0";
    document.getElementById("sobresaliente").style.visibility = "hidden";
    barraVolumen.style.transition = "width 0.5s";

}

// Función que determina la mejor resolución de video de acuerdo al tamaño de la ventana
function resolucionAuto() {

    let ancho = window.innerWidth;

    // Calidad menor: 240p
    if (ancho < 1000) {
        calidadAuto = 0;
    }
    // 360p
    else if (ancho < 1200) {
        calidadAuto = 1;
    }
    // 480p
    else if (ancho < 1500) {
        calidadAuto = 2;
    }
    // 720p
    else {
        calidadAuto = 3;
    }

}