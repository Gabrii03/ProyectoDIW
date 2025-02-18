<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h4 class="text-2xl font-bold mb-4 text-center text-primary">TIENDA DE ARTICULOS</h4>

    <div class="mb-4 flex justify-center gap-2">
      <button v-for="tipo in tiposArticulos" :key="tipo" @click="filtro = tipo"
        :class="['px-2 py-1 rounded border border-gray-300 bg-white', filtro === tipo ? 'border-blue-500 text-blue-500' : 'text-gray-700']">
        {{ tipo }}
      </button>
    </div>

    <div class="d-flex justify-content-center">
      <div class="container d-flex justify-content-center">
        <div class="table-responsive w-50">
          <table class="table table-striped text-center">
            <thead class="table-info rounded-header">
              <tr>
                <th class="w-20">Imagen</th>
                <th class="w-20">Nombre</th>
                <th class="w-20">Categoría</th>
                <th class="w-20">Precio</th>
                <th class="w-20">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="articulo in articulosFiltrados" :key="articulo._id">
                <td>
                  <img :src="articulo.imagen" alt="Foto del producto" width="64" height="64" class="img-thumbnail"
       @click="openModal(articulo.imagen)" />
                </td>
                <td class="align-middle">{{ articulo.nombre }}</td>
                <td class="align-middle">{{ articulo.categoria }}</td>
                <td class="align-middle">${{ articulo.precio.toFixed(2) }}</td>
                <td>
                  <button @click="añadirAlCarrito(articulo)" class="btn btn-warning m-2">
                    <i class="bi bi-cart4"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar la imagen expandida -->
    <div v-if="isModalOpen" class="modal" @click="closeModal">
      <img :src="modalImage" alt="Foto expandida" class="modal-content" />
    </div>
  </div>
</template>

<script>
import { obtenerArticulos } from '../js/articuloServicios';
export default {
  data() {
    return {
      articulos: [],
      filtro: '',
      tiposArticulos: ['Electrónica', 'Hogar', 'Ofimática', 'Deporte', 'Libros', 'Otros'],
      isModalOpen: false,
      modalImage: '',
    };
  },
  computed: {
    articulosFiltrados() {
      return this.filtro
        ? this.articulos.filter(a => a.categoria === this.filtro)
        : this.articulos;
    },
  },
  mounted() {
    this.getArticulos();
  },
  methods: {
    async getArticulos() {
      try {
        this.articulos = await obtenerArticulos();
        console.log('Artículos cargados:', this.articulos);
      } catch (error) {
        console.error('Error al cargar los artículos:', error);
      }
    },
    añadirAlCarrito(articulo) {
      console.log(`Añadido al carrito: ${articulo.nombre}`);
    },
    openModal(id) {
      this.modalImage = this.obtenerRutaImagen(id);
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    obtenerRutaImagen(id) {
      const extensiones = ['jpeg', 'jpg', 'png'];
      const baseUrl = 'http://localhost:5000/uploads/img/';
      
      for (const ext of extensiones) {
        const url = `${baseUrl}${id}.${ext}`;
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, false);
        try {
          xhr.send();
          if (xhr.status === 200) {
            return url;
          }
        } catch (error) {
          console.error(`Error al comprobar la imagen en: ${url}`, error);
        }
      }
      return 'https://via.placeholder.com/64';
    },
  },
};
</script>

<style scoped>
th,
td {
  text-align: left;
  white-space: nowrap;
  padding: 16px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
}

.modal-content {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
}

.modal-content:hover {
  cursor: zoom-out;
}
</style>
