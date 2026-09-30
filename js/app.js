console.log("javascript")
const url ='http://localhost:8000/movimientos'

function borrarCampos(){
    
document.getElementById("id_campo").value='';
document.getElementById("quantity").value='';
document.getElementById("concept").value='';
document.getElementById("date").value='';

}

function mostrarFormulario(){
    borrarCampos();
    document.getElementById("formulario").style.display="block";
}

function ocultarFormulario(){
    document.getElementById("formulario").style.display="none";
}

let nuevo = document.getElementById("btnNuevo");
nuevo.addEventListener("click",mostrarFormulario);

let cerrar = document.getElementById("btnCerrar");
cerrar.addEventListener("click",ocultarFormulario);


function mostrarMovimientos(){
//url de la api 
//const url ='http://localhost:8000/movimientos'
//seleccion del cuerpo de la tabla por DOM
const tbody = document.getElementById('cuerpo-tabla');

//Petición http GET usando FetchAPI
fetch(url)
.then(response => response.json())//convertir en json la respuesta
.then(data=>{
    let filas='';//variable para acomular filas de las tablas en html
    //recorro las lista de json data y guardo en formato html en filas
    data.forEach(element => {
        filas += ` 
        <tr>
            <td>${element.id}</td>
            <td>${element.concept}</td>
            <td>${element.quantity}</td>
            <td>${element.date}</td>
        </tr>
        `
    });

    //Insertar la fila cargada dentro de la tabla con la variable tbody
    tbody.innerHTML=filas;

}).catch(error=>console.log("Error al cargar los datos: ",error));

}

mostrarMovimientos();

 
function refrescoMovimiento(mensaje){
    //cargar de vuelta la tabla
    mostrarMovimientos();
    alert(mensaje)
    //limpiar campos de formulario
    document.getElementById("id_campo").value='';
    document.getElementById("quantity").value='';
    document.getElementById("concept").value='';
    document.getElementById("date").value='';
    //cerrar formulario
    ocultarFormulario();
}

function capturarItemLista(){
    //accedo a lista completa de tabla
    const tabla = document.getElementById("tabla");
    //asociando tabla con rows quitamos las propiedades de lista de tabla cargada
    for (let i = 0; i < tabla.rows.length; i++) {
        //acceso a recorrido del contenido de tabla por posicion con funcion onclick
        tabla.rows[i].onclick = function(){
          
          let id = this.cells[0].innerHTML;
          let fecha = this.cells[3].innerHTML;
          let concepto=this.cells[1].innerHTML;
          let cantidad = this.cells[2].innerHTML;
          //alert(`id: ${id}, fecha:${fecha}, concepto:${concepto}, cantidad: ${cantidad}`);
          //llamar a abrir formulario
          mostrarFormulario();
          
          //cargar el dato capturado de fila en los inputs del formulario
          document.getElementById("id_campo").value=id;
          document.getElementById("quantity").value=cantidad;
          document.getElementById("concept").value=concepto;
          document.getElementById("date").value=fecha;
          
        }
        
    }
}

let tabla = document.getElementById("tabla");
tabla.addEventListener("click",capturarItemLista)

function borrarMovimiento(){
    //captura el dato del input que contiene al id
    let id_value= document.getElementById("id_campo").value;
    if(id_value===''){
        alert("debes seleccionar un registro");
        return;
    }
    
    const url = 'http://127.0.0.1:8000/movimientos';
    
    fetch(`${url}/${id_value}`,{
        method: 'DELETE'
    }).then(response=>{
        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`)
        }
        refrescoMovimiento("Registro eliminado!");

    }).catch(
        error=>{
            alert("No se ha podido completar la peticion de eliminar movimiento");
            console.log("Detalle error: ",error);
        }
    )
}

function confirmarBorrado(){
    let confirmacion = confirm("Estas seguro/a que deseas eliminar el registro");
    if (confirmacion){
        borrarMovimiento();
    }else{
        alert("Operación cancelada");
    }
}

let borrar = document.getElementById("btnBorrar");
borrar.addEventListener("click",confirmarBorrado);

function validarCampos(concept,quantity,date){
     //validar datos === significa extrictamente igual osea valor y tipo de dato
    if(concept === "" ){
       alert("Debes agregar un concepto")
       return; 
    }
    if(quantity == 0 || quantity === ""){
        alert("Debes agregar una cantidad positiva o negativa")
        return;
    }
    //formato de 'aaaa-mm-dd' para comparar con la fecha ingresada
    const hoy = new Date().toISOString().split('T')[0];
    if(!date || date > hoy){
        alert("Debes agregar una fecha menor o igual a hoy");
        return;
    }
}

function actualizarMovimiento(){
    //capturar el id, desde formulario para actualizarlo
    let id_value= document.getElementById("id_campo").value;
    if(id_value===''){
        alert("debes seleccionar un registro");
        return;
    }
    //capturar los datos ingresados en mi formulario
    const date = document.getElementById('date').value;
    const concept = document.getElementById('concept').value;
    const quantity = document.getElementById('quantity').value;
    
    //llamo a validar campos
    validarCampos(concept,quantity,date);
   
    
    if(id_value===""){
        alert("Debes seleccionar un registro");
        return
    }
    fetch(`${url}/${id_value}`,{
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(
            {
                date:date,
                concept:concept,
                quantity: Number(quantity)
            }
        )

    }).then(response=>{
        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`)
        }

        refrescoMovimiento("Registro Actualizado!");


    }).catch(
        error=>{
            alert("No se ha podido completar la peticion de actualizar movimiento");
            console.log("Detalle error: ",error);
        }
    )


}
let actualizar = document.getElementById("btnEditar");
actualizar.addEventListener("click",actualizarMovimiento);

function altaMovimiento(){
    
    //capturar los valores ingresados en formulario
    const date = document.getElementById("date").value;
    const concept = document.getElementById("concept").value;
    const quantity = document.getElementById("quantity").value;
    if(date===''&& concept===''&& quantity===''){
        alert("debes seleccionar un registro");
        return;
    }

    //llamo a validar campos
    validarCampos(concept,quantity,date);

    fetch(
        url,
        {
         method:'POST',
         headers:{
            'Content-Type':'application/json'
         },
         body: JSON.stringify(
            {
             date: date,
             concept: concept,
             quantity: Number(quantity)   
            }
         )   
        }
    )
    .then(response => {
        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`)
        }

        refrescoMovimiento("Registro correcto!")
    }

    )
    .catch(
         error=>{
            alert("No se ha podido completar la peticion de registro de movimiento");
            console.log("Detalle error: ",error);
        }
    );

}

let guardar = document.getElementById("btnGuardar");