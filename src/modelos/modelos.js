import mongoose from "mongoose";

// Definir el esquema para el artículo con todos los campos necesarios
const articuloSchema = new mongoose.Schema({
  nombre: { type: String, required: true },  // Nombre del artículo
  categoria: { type: String, required: true },  // Categoría del artículo
  descripcion: { type: String },  // Descripción del artículo
  precio: { type: Number, required: true },  // Precio del artículo
  stock: { type: Number, required: true },  // Stock disponible del artículo
  personalizacion: { type: String },  // Detalles de personalización
  imagen: { type: String },  // URL de la imagen
  fechaAlta: { 
    type: Date, 
    required: true, 
  }  // Fecha de alta del artículo
});

// Crear un modelo basado en el esquema
const Articulo = mongoose.model('Articulo', articuloSchema);

export default Articulo;
