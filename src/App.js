import React, { Component } from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

class App extends Component {

  constructor(){
    super(); //Mandar al constructor padre, sirve para tener acceso a todas las clases que
    //nos da React y trabajar con estados y propiedades
    this.state = { //estado significa variables que están en memoria
      _id: '',
      nombre: '',
      puesto: '',
      departamento: '',
      salario: 0,
      empleados: []
    }
    toast.configure();
  }
  //Función que se ejecuta al momento de iniciar la aplicación
  componentDidMount(){
    //console.log("Componente cargado");
    this.obtenerEmpleados();
  }//Fin de componentDidMount

  handleChange(e){
    const { name, value} = e.target;
    this.setState({
      [name]: value
    });
    //console.log(this.state);
  }
  addEmpleado(e) {
    //console.log(this.state);
    let meth = 'POST';
    let url = 'http://localhost:3100/api/empleados';
    let mensaje = 'Empleado agregado correctamente';
    if (this.state._id) { //Actualizar un empleado
      meth = 'PUT';
      url+='/'+this.state._id;
      mensaje = 'Empleado actualizado correctamente'
      
    }
    fetch(url, {
        method: meth,
        body: JSON.stringify(this.state),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
         .then(res =>res.json())
         .then(data=>{
             toast(mensaje);
             console.log(data)
             this.setState({
                _id: '',
                nombre: '',
                puesto: '',
                departamento: '',
                salario: 0
             });
             this.obtenerEmpleados();
          })
         .catch(err=>console.log(err))

    //Evitar que se recargue la página al hacer click en el botón
    e.preventDefault();
  }//Fin de addEmpleado

  obtenerEmpleados(){
      fetch('http://localhost:3100/api/empleados')
          .then(res=> res.json())
          .then(data => this.setState({empleados: data}))
          .catch(err => console.log(err));
  }//Fin de obtenerEmpleados

  updateEmpleado(id){
    //console.log(id);
    //Primero obtenemos el empleado de la base de datos
    fetch('http://localhost:3100/api/empleados/'+id)
          .then(res=>res.json())
          .then(data=>{
            //console.log(data)
            this.setState({
              _id: data._id,
              nombre: data.nombre,
              puesto: data.puesto,
              departamento: data.departamento,
              salario: data.salario
            });
          })
          .catch(err=>console.log(err))

  }//Fin del updateEmpleado

  deleteEmpleado(id){
    //console.log(id);
    if (window.confirm('Desea eliminar este empleado?')){
      fetch('http://localhost:3100/api/empleados/'+id,{
        method: 'DELETE',
        headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
        }
      })
        .then(res=>res.json())
        .then((data)=>{
          console.log(data);
          toast('Empleado eliminado correctamente');
          this.obtenerEmpleados();
        })
        .catch(err => console.log(err))
    }
  }//Fin de deleteEmpleado

  render () {
      return (
          <div className="App">
              <nav className="deep-purple darken-3">
                <div className="container">
                    <a className="brand-logo" href="/">
                      Empleados
                    </a>
                </div>
              </nav>
              <ToastContainer />
              <div className="container">
                    <div className="row">
                         {/* Formulario */}
                         <div className="col s5">
                            <div className="card">
                                <div className="card-content">
                                <span className="card-title">Datos del Empleado</span>
                                    <form onSubmit={(e)=>this.addEmpleado(e)}>  
                                        <div className="row">
                                            <div className="input-field col s12">
                                                 <label htmlFor="lnombre">Nombre</label>
                                                 <input type="text" id="lnombre"
                                                        name ="nombre"
                                                        onChange={(e)=>this.handleChange(e)}
                                                        placeholder="Ingrese el nombre" 
                                                        value={this.state.nombre}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <label htmlFor="lpuesto">Puesto</label>
                                                 <input type="text" id="lpuesto"
                                                        name="puesto"
                                                        onChange={(e)=>this.handleChange(e)}
                                                        placeholder="Ingrese el puesto" 
                                                        value={this.state.puesto}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                 <label htmlFor="ldepartamento">Departamento</label>
                                                 <input type="text" id="ldepartamento"
                                                        name="departamento"
                                                        onChange={(e)=>this.handleChange(e)}
                                                        placeholder="Ingrese el departamento" 
                                                        value={this.state.departamento}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                 <label htmlFor="lsalario">Salario</label>
                                                 <input type="number" id="lsalario"
                                                        name="salario"
                                                        onChange={(e)=>this.handleChange(e)}
                                                        placeholder="Ingrese el salario" 
                                                        value={this.state.salario}
                                                />
                                            </div>
                                        </div>
                                        <button type="submit"
                                                className="btn btn deep-purple darken-3">
                                            Guardar        
                                        </button>
                                    </form>
                                </div>
                            </div>
                         </div>                     
                         {/* Tabla de datos*/}
                          <div className="col s7">
                              <table>
                                  <thead>
                                      <tr>
                                          <th>Nombre</th>
                                          <th>Puesto</th>
                                          <th>Departamento</th>
                                          <th>Operaciones</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      this.state.empleados.map( empleado =>{
                                        return (
                                           <tr key={empleado._id}>
                                              <td>{empleado.nombre}</td>
                                              <td>{empleado.puesto}</td>
                                              <td>{empleado.departamento}</td>
                                              <td>{empleado.salario}</td>
                                              <td>
                                                  <button className="btn deep-purple darken-3"
                                                          onClick={()=>this.updateEmpleado(empleado._id)}
                                                  >
                                                      <i className="material-icons">update</i>
                                                  </button>
                                                  <button className="btn red darken-4"
                                                          onClick={()=>this.deleteEmpleado(empleado._id)}
                                                  >
                                                      <i className="material-icons">delete</i>
                                                  </button>
                                              </td>
                                           </tr>
                                        )
                                      })
                                    }
                                  </tbody>
                              </table>
                          </div>
                    </div>
              </div>
          </div>
      );
  }
}

export default App;