window.addEventListener("load", inicio);
google.charts.load('current', { 'packages': ['corechart', "bar"] });
google.charts.setOnLoadCallback(drawChart); 
let sistema = new Sistema();
let contadorCompras = 0;
/*Registro*/
function inicio(){
  document.getElementById("idBotonPersona").addEventListener("click", agregarPersona);
  document.getElementById("idBotonTabla").addEventListener("click", agregarCompras);
  document.getElementById("idBotonReintegro").addEventListener("click", cambiarEstado);
  document.getElementById("idBotonConsulta").addEventListener("click", consultarPendientes);
  document.getElementById("idBotonDescripcion").addEventListener("click", buscarDescripcion);
  document.getElementById("idBotonGraficar").addEventListener("click", drawChart); 
  document.getElementById("idRadioNumero").addEventListener("change", Change);
  document.getElementById("idRadioNombre").addEventListener("change",Change);
} 
function agregarPersona() {
  if (document.getElementById("idFormulario").reportValidity()) {
    let nombre = document.getElementById("idNombre").value;
    let seccion = document.getElementById("idSeccion").value;
    let mail = document.getElementById("idMail").value;
    let persona = new Persona(nombre, seccion, mail);
    if (repeticiones(nombre) === false) {
      sistema.agregar(persona);
      actualizarLista();
      sistema.agregarNombre(nombre);
      agregarSelect("idSelect", sistema.listaNombre);
      agregarSelect("idSelectDos", sistema.listaNombre);
      agregarCheckBox();
    }
  }
}
function agregarSelect(idSelect, listaNombre) {
  let selectConNombre = document.getElementById(idSelect);
  selectConNombre.innerHTML = "";
  for (let i = 0; i < listaNombre.length; i++) {
    let nodo = document.createElement("option");
    nodo.setAttribute("value", listaNombre[i]);
    let nodoT = document.createTextNode(listaNombre[i]);
    nodo.appendChild(nodoT);
    selectConNombre.appendChild(nodo);
  }
}
function actualizarLista() {
  document.getElementById("idFormulario").reset();
  let lista = document.getElementById("idLista");
  lista.innerHTML="";
  let datos = sistema.mostrarTodos();
  for (elemento of datos) {
    let x = document.createElement("li");
    let nodo = document.createTextNode(elemento);
    x.appendChild(nodo);
    lista.appendChild(x);
  }
}
function agregarCheckBox() {
  let container = document.getElementById("idCheckbox");
  container.innerHTML= "";
  let personasEnSistema = sistema.mostrarTodos();
  for (let i = 0; i < personasEnSistema.length; i++) {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = sistema.listaPersonas[i].nombre.replace(/ /g, "");
    checkbox.name = 'Personas';
    checkbox.value = sistema.listaPersonas[i].nombre.replace(/ /g, "");
    let label = document.createElement('label')
    label.htmlFor = sistema.listaPersonas[i].nombre.replace(/ /g, "");
    label.appendChild(document.createTextNode(sistema.listaPersonas[i].nombre));
    let br = document.createElement('br');
    container.appendChild(checkbox);
    container.appendChild(label);
    container.appendChild(br);
  }
}
function repeticiones() {
  let nombrePersona = document.getElementById("idNombre").value;
  let repeticion = false;
  for (i = 0; i < sistema.listaPersonas.length || repeticion; i++) {
    if (nombrePersona.toLowerCase() === (sistema.listaPersonas[i].nombre).toLowerCase()) { // Cumple su función, pero presenta un error en consola al momento de cumplirse la igualdad.
      repeticion = true;
      alert("La persona ya ha sido registrada");
    }
  }
  return repeticion;
}
/* Compras - Registro */
function agregarCompras() {
  if (document.getElementById("idFormularioRegistro").reportValidity()) {
    let responsable = document.getElementById("idSelect").value;
    let descripcion = document.getElementById("idDescripcion").value;
    let monto = parseInt(document.getElementById("idMonto").value);
    let correspondiente = imprimirChecks().join();
    let estado = "Pendiente"
    if (correspondiente === "") {
      alert("No ha seleccionado a quien corresponde la compra.");
    } else {
      contadorCompras++
      let compra = new Compra(contadorCompras,responsable,descripcion,monto,correspondiente, estado);
      sistema.agregarCompra(compra);
      sistema.agregarNumero(contadorCompras);
      agregarSelect("idSelectTres", sistema.listaNumeros);
      document.getElementById("idFormularioRegistro").reset();
      cargarTabla("idTabla");
      console.log(sistema.listaCompras);
    }
  }
}
function imprimirChecks() {
  let personas = document.getElementsByName("Personas");
  let personasSeleccionadas = [];
  for (let i = 0; i < personas.length; i++) {
    if (personas[i].type == "checkbox" && personas[i].checked) {
      personasSeleccionadas.push(personas[i].value);
    }
  }
  return personasSeleccionadas;
}
function Change(){
  if (document.getElementById("idRadioNumero").checked) {
    sistema.ordenarNum();
    cargarTabla("idTabla");
  } else if (document.getElementById("idRadioNombre").checked) {
    sistema.ordenarNom();
    cargarTabla("idTabla");
  }
}
function cargarTabla(idTabla) {
  let tabla = document.getElementById(idTabla);
  tabla.innerHTML = "";
  let datos = sistema.listaCompras;
  cargarEncabezado(idTabla);
  for (let elemento of datos){
    let fila = tabla.insertRow();
    for (let i in elemento){
      let celda = fila.insertCell();
      celda.innerHTML= elemento[i];
    }
  }
}
function cargarEncabezado(idTabla) {
  let tabla = document.getElementById(idTabla);
  let encabezado = ["NÚMERO", "RESPONABLE", "DESCRIPCIÓN", "MONTO", "PARTICIPANTES", "ESTADO"];
  for (let i = 0; i<encabezado.length; i++){
    let th = tabla.appendChild(document.createElement("th"));
    th.appendChild(document.createTextNode(encabezado[i]));
  }
}
function cambiarEstado() {
  let reintegrar = parseInt(document.getElementById("idSelectTres").value);
  for (let i = 0; i < sistema.listaCompras.length; i++) {
    if (sistema.listaCompras[i].contadorCompras === reintegrar) {
      sistema.listaCompras[i].estado = "Reintegrado";
      borrar();
      eliminarValor(reintegrar);
      limpiarPantalla();
      cargarTabla("idTabla");
    }
  }
}
function borrar() {
  var sel = document.getElementById("idSelectTres");
  sel.remove(sel.selectedIndex);
}
function eliminarValor(valor) {
  for (let i = 0; i< sistema.listaNumeros.length; i++) {
    if (sistema.listaNumeros[i] === valor) {
      sistema.listaNumeros.splice(i,1);
    }
  }
}
function limpiarPantalla() {
  let tabla = document.getElementById("idTabla");
  tabla.innerHTML = "";
}
/* Consultas */
function cantidadParticipantes(i) {
  let contadorParticipantes = 1;
  for (let j = 0; j < sistema.listaCompras[i].correspondiente.length; j++) {
    if (sistema.listaCompras[i].correspondiente.charAt(j) === ",") {
      contadorParticipantes++;
    }
  }
  return contadorParticipantes;
}
function cantidadParticipantes(i) {
  let contadorParticipantes = 1;
  for (let j = 0; j < sistema.listaCompras[i].correspondiente.length; j++) {
    if (sistema.listaCompras[i].correspondiente.charAt(j) === ",") {
      contadorParticipantes++;
    }
  }
  return contadorParticipantes;
}
function cantidadParticipantes(i) {
  let contadorParticipantes = 1;
  for (let j = 0; j < sistema.listaCompras[i].correspondiente.length; j++) {
    if (sistema.listaCompras[i].correspondiente.charAt(j) === ",") {
      contadorParticipantes++;
    }
  }
  return contadorParticipantes;
}
function consultarPendientes() {
  let persona = document.getElementById("idSelectDos").value;
  let deuda = 0;
  for (let i = 0; i < sistema.listaCompras.length; i++) {
    if ((sistema.listaCompras[i].correspondiente.includes(persona)) && (sistema.listaCompras[i].estado === "Pendiente")) {
      let deudaParcial = (sistema.listaCompras[i].monto) / cantidadParticipantes(i);
      deuda += deudaParcial;
    }
  }
  let responsableCompra = 0;
  for (let i = 0; i < sistema.listaCompras.length; i++) {
    if ((sistema.listaCompras[i].responsable.includes(persona)) && (sistema.listaCompras[i].estado === "Pendiente")) {
      responsableCompra += sistema.listaCompras[i].monto;
    }
  }
  let participante = document.getElementById("idComprasParticipantes");
  participante.innerHTML = "";
  participante.innerHTML = "Participó en total por $" + deuda;
  let responsable = document.getElementById("idComprasResponsables");
  responsable.innerHTML = "";
  responsable.innerHTML = "Responsable de compras por $" + responsableCompra;
}
function buscarDescripcion(){
  if (document.getElementById("idFormularioDescripcion").reportValidity()) {
    let descripcion = document.getElementById("idBusqueda").value;
    let lista = document.getElementById("idListaDescripcion");
    lista.innerHTML = ""
    for (var i = 0; i < sistema.listaCompras.length; i++) {
      if (sistema.listaCompras[i].descripcion.includes(descripcion)) {
        let header = document.getElementById("idHeaderResultado");
        let encabezado = document.createElement("h4");
        let nodoEncabezado = document.createTextNode("Resultado (se muestra la primera coincidencia)");
        header.innerHTML = "";
        encabezado.appendChild(nodoEncabezado);
        header.appendChild(encabezado);
        let cortar = sistema.listaCompras[i].descripcion.search(descripcion);
        let primerTrozo = sistema.listaCompras[i].descripcion.slice(0, cortar);
        let trozoSpan = sistema.listaCompras[i].descripcion.slice(cortar, cortar+descripcion.length);
        let tercerTrozo = sistema.listaCompras[i].descripcion.slice(cortar+descripcion.length, sistema.listaCompras[i].descripcion.length);
        let li = document.createElement("li");
        let span = document.createElement("span");
        let nodoSpan = document.createTextNode(trozoSpan);
        let nodoPrimerTrozo = document.createTextNode(primerTrozo);
        let nodoTercerTrozo = document.createTextNode(tercerTrozo);
        let numeroCompra = document.createTextNode("Compra " + sistema.listaCompras[i].contadorCompras + " ");
        li.appendChild(numeroCompra);
        li.appendChild(nodoPrimerTrozo);
        span.appendChild(nodoSpan);
        li.appendChild(span);
        li.appendChild(nodoTercerTrozo);
        lista.appendChild(li)
      }
    }
  }
}
/* GRAFICA */
function drawChart() {
  var grafica = new google.visualization.DataTable();
  grafica.addColumn("string", "ejeX");
  grafica.addColumn("number", "ejeY");
  let gastoMaximo = 0
  let maximo = sistema.detectarMaximo(gastoMaximo);
  let ejeX = "";
  let ejeY = 0;
  let rangoSuperior = 0;
  let rangoInferior = 0;
  let redondeo = Math.ceil(maximo/99); 
  grafica.addRows(redondeo);
  for (let i=0; i < redondeo; i++) {
    rangoInferior = i*100;
    rangoSuperior = rangoInferior + 99;
    ejeX = rangoInferior + "-" + rangoSuperior;
    grafica.setCell(i, 0, ejeX);
    for (let x=0; x<sistema.listaCompras.length; x++){
      if (sistema.listaCompras[x].monto >= rangoInferior && sistema.listaCompras[x].monto <= rangoSuperior) {
        ejeY++
      }
    }
    grafica.setCell(i,1,ejeY);
    ejeY= 0;
    ejeX = "";
  }
  let options = { //Se incluye options en javascript, ya que el formato se altera al ingresarlo en la
    "title": "Grafica de Montos",
    "width": 400,
    "height": 300,
  }
  var chart = new google.visualization.ColumnChart(document.getElementById("idGrafica"));
  chart.draw(grafica, options);
} 