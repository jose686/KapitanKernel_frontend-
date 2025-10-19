// assets/js/pages/crearPost.js

import { crearPost } from "../services/postServicio.js"; 
import { listarUsuarios } from "../services/usuarioServicio.js"; 
import { obtenerTodasLasCategorias} from "../services/categoriaServicio.js"; 

// --- Selección de Elementos del DOM ---
const formularioPost = document.getElementById('postForm'); 
const inputTitulo = document.getElementById('titulo');
const inputMetaDescripcion = document.getElementById('metaDescripcion');
const selectAutor = document.getElementById('idAutor'); 
const selectCategorias = document.getElementById('idsCategorias'); 
const selectEstado = document.getElementById('estado'); 
const fechaPublicacion = new Date().toISOString().slice(0, 19);

/**
 * Carga los usuarios y categorías en los select del formulario.
 */
async function cargarDatosRelacionales() {
    // Carga de Autores
    try {
        const autores = await listarUsuarios(); 
        selectAutor.innerHTML = '<option value="" disabled selected>Seleccione un Autor</option>';
        autores.forEach(autor => {
            const option = document.createElement('option');
            option.value = autor.idUsuario; 
            option.textContent = autor.nombreUsuario + ' (ID: ' + autor.idUsuario + ')'; 
            selectAutor.appendChild(option);
        });
    } catch (error) {
        console.error("❌ No se pudieron cargar los autores:", error);
        selectAutor.innerHTML = '<option value="" disabled>Error al cargar autores</option>';
    }

  // Carga de Categorías
    try {
        const categorias = await obtenerTodasLasCategorias(); 
        selectCategorias.innerHTML = ''; 
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.idCategoria; 
          
            option.textContent = categoria.nombreCategoria; 
            selectCategorias.appendChild(option);
        });
    } catch (error) {
        console.error("❌ No se pudieron cargar las categorías:", error);
        selectCategorias.innerHTML = '<option value="" disabled>Error al cargar categorías</option>';
    }
}


formularioPost.addEventListener('submit', async (e) => {
    e.preventDefault(); 


    const titulo = inputTitulo.value.trim();
    const metaDescripcion = inputMetaDescripcion.value.trim();
    const idAutor = selectAutor.value; 
    const estado = selectEstado.value; 
    
const categoriasSeleccionadas = Array.from(selectCategorias.selectedOptions).map(option => ({
        // 🚀 USAR EL NOMBRE DE CLAVE CORRECTO: 'idCategoria'
        idCategoria: Number(option.value) 
    }));

    const postData = { 
        titulo: inputTitulo.value.trim(),
        metaDescripcion: inputMetaDescripcion.value.trim(),
        estado: selectEstado.value,
        
        // Autor es correcto
        idAutor: { 
            idUsuario: Number(selectAutor.value) 
        },
        
        // ✅ PASO 2: ASIGNAR EL ARRAY YA CREADO, SIN VOLVER A MAPEAR
        categorias: categoriasSeleccionadas,

        bloquesDeContenido: []
    };

    console.log("JSON a enviar:", JSON.stringify(postData, null, 2));

    try {
        const nuevoPost = await crearPost(postData); 
        alert(`✅ Post '${nuevoPost.titulo}' creado con éxito (ID: ${nuevoPost.idTipo})!`);
        
        formularioPost.reset(); 
    } catch (error) {
        console.error("Error al crear post:", error);
        alert("❌ Error al crear el post. Revise la consola para detalles del error 400.");
    }
});


// --- Inicialización ---
document.addEventListener('DOMContentLoaded', cargarDatosRelacionales);