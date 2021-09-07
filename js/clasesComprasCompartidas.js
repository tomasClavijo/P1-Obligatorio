/*Personas - Registro */
class Persona {
  constructor(nombre, seccion, mail) {
    this.nombre = nombre;
    this.seccion = seccion;
    this.mail = mail;
  }
  toString(){
    return this.nombre + " - " + this.seccion + " - " + this.mail;
  }
}
/*Sistema*/
class Sistema {
  constructor() {
    this.listaPersonas = [];
    this.listaNombre = [];
    this.listaCompras = [];
    this.listaNumeros = [];
    this.listaDescrpcion = [];
  }
  agregar(persona) {
    this.listaPersonas.push(persona);
  }
  mostrarTodos() {
    return this.listaPersonas;
  }
  agregarNombre(nombre){
    this.listaNombre.push(nombre);
  }
  agregarCompra(compra) {
    this.listaCompras.push(compra);
  }
  agregarNumero(contadorCompras){
    this.listaNumeros.push(contadorCompras);
  }
  detectarMaximo(gastoMaximo){
    for (let i=0; i<this.listaCompras.length; i++){
      if (this.listaCompras[i].monto > gastoMaximo) {
        gastoMaximo = this.listaCompras[i].monto
      }
    }
    return gastoMaximo;
  } 
  mostrarCompras() {
    return this.listaCompras;
  }
  ordenarNum() {
    this.mostrarCompras().sort(function (primero, segundo) {
    return primero.contadorCompras - segundo.contadorCompras;
    });
  }
  ordenarNom() {
    this.mostrarCompras().sort(function(primero,segundo) {
    return primero.responsable.toUpperCase().localeCompare(segundo.responsable.toUpperCase());
    });
  }
  agregarDescripcion(descripcion) {
    this.listaDescrpcion.push(descripcion);
  }
  mostrarDescripcion(){
    return this.listaDescrpcion;
  }
}
/* Compras - Registro */
class Compra {
  constructor(contadorCompras, responsable, descripcion, monto, correspondiente, estado) {
    this.contadorCompras = contadorCompras;
    this.responsable = responsable;
    this.descripcion = descripcion;
    this.monto = monto;
    this.correspondiente = correspondiente;
    this.estado = estado;
  }
  toString() {
    return this.contadorCompras + "\n " + this.responsable + "\n " + this.descripcion + "\n " + this.monto + "\n " + this.correspondiente + "\n " + this.estado;
  }
}