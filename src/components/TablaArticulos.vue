<template>
  <br>
  <div class="row">
    <h4 class="text-center text-primary font-weight-bold"><i class="bi bi-kanban"></i>GESTIÓN DE ARTÍCULOS
    <router-link to="/" class="btn btn-customb"><i class="bi bi-arrow-return-left me-2"></i></router-link>
    </h4>
  </div>
  <br>
  <div class="container-fluid border p-4">
    
      <div class="col-10 col-m-6 col-lg-8 mx-auto">
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Nombre: </span>
          <input type="text" class="form-control sm w-50" placeholder="Nombre del artículo" v-model="articulo.nombre">
          
          <span class="input-group-text custom-span me-2">Categoría: </span>
          <select class="form-control sm w-25" v-model="articulo.categoria">
            <option value="">Seleccionar categoría</option>
            <option v-for="categoria in categorias" :key="categoria" :value="categoria">{{ categoria }}</option>
          </select>
        </div>

        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Descripción: </span>
          <textarea class="form-control" rows="3" placeholder="Descripción de artículo" v-model="articulo.descripcion"></textarea>
          
          <span class="input-group-text custom-span me-2">Precio Unitario: </span>
          <input type="number" class="form-control sm w-50" v-model="articulo.precio">
        </div>

        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Stock: </span>
          <input type="number" class="form-control sm w-50" v-model="articulo.stock">

          <span class="input-group-text custom-span me-2">Personalización: </span>
          <textarea class="form-control" rows="3" placeholder="Detalles de personalización" v-model="articulo.personalizacion"></textarea>
        </div>

        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Imagen: </span>
          <input type="file" class="form-control" @change="cargarImagen">

          <span class="input-group-text custom-span ms-auto me-2">Fecha Alta:</span>
          <input type="date" class="form-control sm w-25" v-model="articulo.fechaAlta">
        </div>
      </div>

      <div class="d-flex justify-content-center">
        <button class="btn btn-primary m-1" @click="agregarArticulo">
            <i class="bi bi-arrosw-up-square mr-2"></i> Grabar
            </button>
        <button class="btn btn-light m-1" @click="limpiarFormCli">
          <i class="bi-arrow-clockwise"></i> Limpiar
        </button>
      </div>
    
  </div>

  <div class="container my-5">
    <h2 class="mb-4">TABLA DE ARTÍCULOS</h2>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead class="table-info rounded-header">
          <tr>
            <th class="w-15 text-center">ID</th>
            <th class="w-20">Nombre</th>
            <th class="w-20">Categoría</th>
            <th class="w-20 text-center">Descripción</th>
            <th class="w-10">Precio</th>
            <th class="w-10 text-center">Stock</th>
            <th class="w-10 text-center">Fecha Alta</th>
            <th class="table-warning">Gestión</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="articulo in articuloPorPagina" :key="articulo._id">
            <td class="align-middle">{{ articulo._id.substring(0,5) }}</td>
            <td class="align-middle">{{ articulo.nombre }}</td>
            <td class="align-middle">{{ articulo.categoria }}</td>
            <td class="align-middle">{{ articulo.descripcion }}</td>
            <td class="align-middle">{{ articulo.precio }}</td>
            <td class="align-middle">{{ articulo.stock }}</td>
            <td class="align-middle">{{ new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(Date.parse(articulo.fechaAlta)) }}</td>
            <td class="text-center align-middle">
              <button class="btn btn-warning m-2" @click.prevent="seleccionaarticulo(articulo)">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button class="btn btn-danger m-2" @click.prevent="eliminararticulo(articulo._id)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-center my-3">
        <button class="btn btn-primary" :disabled="currentPage === 1" @click="paginaAnterior">
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="mx-3 align-self-center">Página {{ currentPage }}</span>
        <button class="btn btn-primary" :disabled="currentPage * pageSize >= articulos.length" @click="siguientePagina">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// Importa las funciones de servicio
import { obtenerArticulos, agregarArticulo, eliminarArticulo, actualizarArticulo} from '../js/articuloServicios';
import Swal from 'sweetalert2';

export default {
  name: "TablaArticulos",
  data() {
    return {
      articulos: [],
      articulo: {
        nombre: '',
        categoria: '',
        descripcion: '',
        precio: 0.00,
        stock: 0,
        personalizacion: '',
        imagen: '',
        fechaAlta: ''
      },
      imagenSeleccionada: null,
      currentPage: 1,
      pageSize: 5,
      categorias: [
        'Electrónica',
        'Hogar',
        'Ofimática',
        'Deporte',
        'Libros',
        'Otros'
      ]
    };
  },
  computed: {
  articuloPorPagina() {
    const indiceInicial = (this.currentPage - 1) * this.pageSize;
    return this.articulos.slice(indiceInicial, indiceInicial + this.pageSize).map(articulo => {
      // Verificamos si la fechaAlta es un objeto Date o una cadena de texto
      if (articulo.fechaAlta) {
        // Si es una cadena de texto, lo convertimos a Date
        
        // Formateamos la fecha en el formato 'dd/mm/yyyy'

      }
      return articulo;
    });
  }
}
,
  mounted() {
    this.getArticulos(); // Llama a la función para cargar los artículos al iniciar
  },
  methods: {
    // Obtener los artículos desde la base de datos
    async getArticulos() {
      try {
        this.articulos = await obtenerArticulos();
        console.log('Artículos cargados:', this.articulos);  // Verifica los artículos recibidos
      } catch (error) {
        console.error('Error al cargar los artículos:', error);
      }
    },
    siguientePagina() {
      if (this.currentPage * this.pageSize < this.articulos.length) {
        this.currentPage++;
      }
    },
    paginaAnterior() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    seleccionaarticulo(articulo) {
      articulo.fechaAlta = articulo.fechaAlta.split('T')[0];
      this.articulo = { ...articulo };
      
    },
    limpiarFormCli() {
      this.articulo = {
        nombre: '',
        categoria: '',
        descripcion: '',
        precio: 0.00,
        stock: 0,
        personalizacion: '',
        imagen: '',
        fechaAlta: ''
      };
    },

    cargarImagen(event) {
    this.imagenSeleccionada = event.target.files[0]; // Guarda el archivo en data
    },

    // Método para agregar un artículo
    /*async agregarArticulo() {
  try {
    if (this.articulo._id) {
      
      // Actualizar artículo existente
      await actualizarArticulo(this.articulo._id, this.articulo);
      Swal.fire({
        title: 'Artículo actualizado',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      // Agregar nuevo artículo
      const nuevoArticulo = await agregarArticulo(this.articulo);
      this.articulos.push(nuevoArticulo); // Corrige el push
      this.limpiarFormCli(); // Limpia el formulario
      Swal.fire({
        title: 'Artículo agregado',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    }
    await this.getArticulos(); // Actualiza la lista tras la operación
  } catch (error) {
    console.error('Error al agregar/actualizar el artículo', error);
    Swal.fire({
      title: 'Error',
      text: 'No se pudo completar la operación.',
      icon: 'error',
      showConfirmButton: true,
    });
  }
}
,*/

async agregarArticulo() {
  try {
    let datosArticulo;

    if (this.imagenSeleccionada) {
      // Si hay una imagen, se envía en FormData
      const formData = new FormData();
      formData.append("nombre", this.articulo.nombre);
      formData.append("categoria", this.articulo.categoria);
      formData.append("descripcion", this.articulo.descripcion);
      formData.append("precio", this.articulo.precio);
      formData.append("stock", this.articulo.stock);
      formData.append("personalizacion", this.articulo.personalizacion);
      formData.append("fechaAlta", this.articulo.fechaAlta);
      formData.append("imagen", this.imagenSeleccionada); // Se añade la imagen

      datosArticulo = formData;
    } else {
      // Si no hay imagen, se envía como JSON normal
      datosArticulo = { ...this.articulo };
    }

    if (this.articulo._id) {
      // Si el artículo ya existe, actualizarlo
      await actualizarArticulo(this.articulo._id, datosArticulo);
      Swal.fire("Artículo actualizado", "", "success");
    } else {
      // Si es un nuevo artículo, agregarlo
      const nuevoArticulo = await agregarArticulo(datosArticulo);
      this.articulos.push(nuevoArticulo);
      Swal.fire("Artículo agregado", "", "success");
    }

    this.limpiarFormCli(); // Limpiar formulario
    await this.getArticulos(); // Actualizar lista de artículos

  } catch (error) {
    console.error("Error al agregar/actualizar el artículo:", error);
    Swal.fire("Error", "No se pudo completar la operación.", "error");
  }
}
,

    // Método para eliminar un artículo
    async eliminararticulo(id) {
      try {
        await eliminarArticulo(id);
        this.articulos = this.articulos.filter(articulo => articulo._id !== id);
        Swal.fire('Artículo eliminado', '', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el artículo', 'error');
      }
    }
  }
};
</script>

<style scoped>
.custom-date-input {
  width: 12em;
  text-align: center;
}
.btn-primary:hover {
  color: white;
  background-color: rgb(0, 57, 172);
}
.btn-warning:hover {
  background-color: rgb(255, 166, 0);
}
</style>
