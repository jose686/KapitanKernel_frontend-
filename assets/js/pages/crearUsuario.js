import { obtenerTodosLosTiposDeUsuario } from "../services/tiposUsuarioServicio.js"; 
import { crearUsuario } from '../services/usuarioServicio.js'; 


const formularioRegistro = document.getElementById('registroForm'); 
const inputNombreUsuario = document.getElementById('nombreUsuario');
const inputCorreo = document.getElementById('correo');
const inputContrasena = document.getElementById('contrasena');
const selectTipoUsuario = document.getElementById('tipoUsuario');


async function cargarTiposUsuario() {
    try {
        const tipos = await obtenerTodosLosTiposDeUsuario(); 

        tipos.forEach(tipo => {
            const option = document.createElement('option');
            
           
            option.value = tipo.nombreTipo; 
            
            option.textContent = tipo.nombreTipo; 
            selectTipoUsuario.appendChild(option);
        });
    } catch (error) {
        console.error("No se pudieron cargar los tipos de usuario:", error);
        selectTipoUsuario.innerHTML = '<option value="" disabled>Error al cargar roles</option>';
    }
}

cargarTiposUsuario();



formularioRegistro.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const nombreUsuario = inputNombreUsuario.value.trim();
    const correo = inputCorreo.value.trim();
    const contrasena = inputContrasena.value;
    
   
    const nombreTipoUsuario = selectTipoUsuario.value; 

    
    if (!nombreUsuario || !correo || !contrasena || !nombreTipoUsuario) {
        return alert("Por favor, complete todos los campos y seleccione un Tipo de Usuario válido.");
    }

 
    const usuarioData = { 
        nombreUsuario: nombreUsuario,
        correo: correo,
        contrasena_hash: contrasena, 
        
  
        tipoUsuario: {
            nombreTipo: nombreTipoUsuario 
        }
    };
    
   
    
    console.log("Datos del nuevo usuario a crear:", usuarioData);

    try {
        const nuevoUsuario = await crearUsuario(usuarioData);

        alert(`✅ Usuario '${nuevoUsuario.nombreUsuario}' creado con éxito (ID: ${nuevoUsuario.idUsuario})!`);
        
        formularioRegistro.reset(); 
    } catch (error) {
        console.error("Fallo en la creación del usuario:", error);
        alert(`❌ Error al crear el usuario: ${error.message}`);
    }
});