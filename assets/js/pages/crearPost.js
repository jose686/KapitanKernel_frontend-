import { crearPost } from "../services/postServicio.js"; 
import { listarUsuarios } from "../services/usuarioServicio.js"; 
import { obtenerTodasLasCategorias} from "../services/categoriaServicio.js"; 



const formularioPost = document.getElementById('postForm'); 
const inputTitulo = document.getElementById('titulo');
const inputMetaDescripcion = document.getElementById('metaDescripcion');
const selectAutor = document.getElementById('idAutor'); 
const selectCategorias = document.getElementById('idsCategorias'); 
const selectEstado = document.getElementById('estado'); 



async function cargarDatosRelacionales() {
    
    try {
        const autores = await listarUsuarios(); 
        
        selectAutor.innerHTML = '<option value="" disabled selected>Seleccione un Autor</option>';
        autores.forEach(autor => {
            const option = document.createElement('option');
            option.value = autor.idUsuario; 
            option.textContent = autor.nombreUsuario; 
            selectAutor.appendChild(option);
        });
    }catch (error) {
        console.error("❌ No se pudieron cargar los autores:", error);
        selectAutor.innerHTML = '<option value="" disabled>Error al cargar autores</option>';
    }

  
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


cargarDatosRelacionales();



formularioPost.addEventListener('submit', async (e) => {
    e.preventDefault(); 

   
    const titulo = inputTitulo.value.trim();
    const metaDescripcion = inputMetaDescripcion.value.trim();
    
    
    const idAutor = selectAutor.value; 
    const estado = selectEstado.value; 
    
    
    /*const idsCategorias = Array.from(selectCategorias.selectedOptions).map(option => option.value);

    
    if (!titulo || !metaDescripcion || !idAutor || !estado || idsCategorias.length === 0) {
        return alert("🔴 Error: Por favor, complete el título, meta-descripción, autor, estado y seleccione al menos una categoría.");
    }
    
   
    const postData = { 
        titulo: titulo,
        metaDescripcion: metaDescripcion,
        fechaPublicacion: new Date().toISOString(), 
        estado: estado,
        bloquesDeContenido: [] 
    };

    console.log("Datos del nuevo Post (RequestBody):", postData);
    console.log("IDs de Relación (Parámetros):", { idAutor, idsCategorias });

   
    try {
        
        const nuevoPost = await crearPost(postData, idAutor, idsCategorias); 

        alert(`✅ Post '${nuevoPost.titulo}' creado con éxito (ID: ${nuevoPost.idTipo})!`);
        
        formularioPost.reset(); 
    } catch (error) {
        
        console.error("🔴 Fallo en la creación del Post:", error);
        alert(`❌ Error al crear el Post: ${error.message}`);
    }
    });
    */

    // 1. Mapear Categorías a objetos:
    const categoriasSeleccionadas = Array.from(selectCategorias.selectedOptions).map(option => ({
        idCategoria: Number(option.value) 
    }));

    // 2. Construcción del RequestBody COMPLETO Y CORREGIDO
    const postData = { 
        titulo: titulo,
        metaDescripcion: metaDescripcion,
        fechaPublicacion: new Date().toISOString(), 
        estado: estado,
    
        // 💥 CORRECCIÓN CRÍTICA: ANIDAR EL AUTOR
        autor: { 
            idUsuario: Number(idAutor) 
        },
    
        // 💥 CORRECCIÓN CRÍTICA: ANIDAR LAS CATEGORÍAS
        categorias: categoriasSeleccionadas,
    
        bloquesDeContenido: [] 
    };

    // ...

    // 3. Llamada al servicio SIMPLIFICADA (solo enviamos el cuerpo)
    try {
            // LLAMADA CORREGIDA
            const nuevoPost = await crearPost(postData); 

            alert(`✅ Post '${nuevoPost.titulo}' creado con éxito (ID: ${nuevoPost.idPost || nuevoPost.id})!`);
        
            // ...
    } catch (error) {
            // ...
}});
