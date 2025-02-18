import Swal from "sweetalert2";

const API_URL = "http://localhost:5000/articulos"; // Ajusta la URL a tu servidor

export async function obtenerArticulos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            Swal.fire("Error", "No se pudo obtener el listado de artículos", "error");
            throw new Error("Error al obtener los artículos");
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener los artículos:", error);
        throw error;
    }
}

export async function actualizarArticulo(id, datosArticulo) {
    console.log('Datos de artículo para actualizar:', datosArticulo); // Verifica los datos enviados

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosArticulo),
        });

        if (!response.ok) {
            const errorMessage = await response.text();  // Obtener el cuerpo de la respuesta de error
            Swal.fire("Error", `No se pudo actualizar el artículo: ${errorMessage}`, "error");
            throw new Error("Error al actualizar el artículo");
        }

        return await response.json();
    } catch (error) {
        console.error("Error al actualizar el artículo:", error);
        Swal.fire("Error", "No se pudo conectar al servidor o campos vacíos", "error");
        throw error;
    }
}

export async function agregarArticulo(datosArticulo) {
    console.log('Datos de artículo recibidos en servicio:', datosArticulo); // Verifica los datos
    
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosArticulo),
        });

        if (!response.ok) {
            const errorMessage = await response.text();  // Obtener el cuerpo de la respuesta de error
            Swal.fire("Error", `No se pudo agregar el artículo: ${errorMessage}`, "error");
            throw new Error("Error al agregar el artículo");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en la solicitud:", error);
        Swal.fire("Error", "No se pudo conectar al servidor o campos vacíos", "error");
        throw error;
    }
}

export async function eliminarArticulo(id) {
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const errorMessage = await response.text();  // Obtener el cuerpo de la respuesta de error
            Swal.fire("Error", `No se pudo eliminar el artículo: ${errorMessage}`, "error");
            throw new Error("Error al eliminar el artículo");
        }

        return await response.json();
    } catch (error) {
        console.error("Error al eliminar el artículo:", error);
        Swal.fire("Error", "No se pudo eliminar el artículo", "error");
        throw error;
    }
}
