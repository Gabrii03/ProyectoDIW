<template>
  <br>

  <div class="row">
    <h4 class="text-center text-primary font-weight-bold">
      <i class="bi bi-person-lines-fill mr-2"></i> TRABAJA CON NOSOTROS
      <router-link to="/" class="btn btn-customb"><i class="bi bi-arrow-return-left me-2"></i></router-link>
    </h4>


  </div>

  <br>
  <div class="container-fluid border p-4">
    <!-- Formulario -->
    <form class="form-in-line">
      <div class="col-10 col-m-6 col-lg-8 mx-auto">

        <!-- Nombres y Apellido -->
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Apellidos: </span>
          <input type="text" class="form-control sm w-50" placeholder="Apellidos" v-model="candidato.apellidos">
          <span class="input-group-text custom-span ms-2 me-2">Nombre: </span>
          <input type="text" class="form-control sm w-50" placeholder="Nombre" v-model="candidato.nombre">
        </div>

        <!-- Email y Móvil -->
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Email: </span>
          <input type="email" class="form-control sm w-50" placeholder="Correo electrónico" v-model="candidato.email"
            @blur="validarEmail(this.candidato.email)">
          <span class="input-group-text custom-span ms-2 me-2">Móvil: </span>
          <input type="text" class="form-control sm w-50" placeholder="Móvil" v-model="candidato.movil
            " @blur="validarTelefono(this.candidato.movil)">
        </div>

        <!-- Categoría y Modalidad -->
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Departamentos: </span>
          <select name="departamento" class="form-control sm w-25" v-model="candidato.departamento">
            <option value="">Selecciona un departamento</option>
            <!-- Se iteran los departamentos y se muestra el 'label' -->
            <option v-for="departamento in departamentos" :key="departamento.id" :value="departamento.id">
              {{ departamento.label }}
            </option>
          </select>
          <span class="input-group-text custom-span ms-auto me-2">Remoto: </span>
          <input class="mx-4" type="radio" name="modalidad" id="modalidad" value="remoto" v-model="candidato.modalidad">
          <label for="remoto">Remoto</label>
          <input class="mx-4" type="radio" name="modalidad" id="modalidad" value="hibrido"
            v-model="candidato.modalidad">
          <label for="hibrido">Híbrido</label>
          <input class="mx-4" type="radio" name="modalidad" id="modalidad" value="presencial"
            v-model="candidato.modalidad">
          <label for="presencial">Presencial</label>
        </div>
        <!--Comentarios-->
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Comentarios: </span>
          <textarea name="comentarios" id="comentarios" cols="130" rows="5"
            v-model="candidato.observaciones"></textarea>
        </div>
        <!-- archivo -->
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">archivo(PDF): </span>
          <input type="file" class="form-control sm w-50" placeholder="Selecciona un archivo(pdf)" id="archivo"
            accept=".pdf" ref="fileInput" @change="handleFileChange">
        </div>
        <!-- Aceptar politica  -->
        <input class="mx-2" type="checkbox" id="ckeckbox" v-model="candidato.privacidad">
        <label for="checkbox">Acepto las condiciones y términos de la <router-link to="/privacidad">Política de
            Privacidad</router-link></label><br>

      </div>

      <!-- Submit -->
      <button class="btn btn-primary m-1" @click.prevent="enviarEmpleado">Alta</button>
    </form>
  </div>




  <div class="container my-5" v-if="isAdmin">
    <h2 class="mb-4">Lista de Datos de Candidatos</h2>
    <div class="container my-2">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead class="table-info rounded-header">
            <tr>
              <th scope="col" class="w-20">Apellidos</th>
              <th scope="col" class="w-20">Nombre</th>
              <th scope="col" class="w-20 text-center">Email</th>
              <th scope="col" class="w-10">Telefono</th>
              <th scope="col" class="w-10 text-center">Departamento</th>
              <th scope="col" class="w-10 text-center">Modalidad</th>
              <th scope="col" class="w-10 text-center">Comentarios</th>
              <th scope="col" class="pale-yellow table-warning">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="candidato in candidatoPorPagina" :key="candidato.id">
              <td class="align-middle">{{ candidato.apellidos }}</td>
              <td class="align-middle">{{ candidato.nombre }}</td>
              <td class="align-middle">{{ candidato.email }}</td>
              <td class="align-middle">{{ candidato.movil }}</td>
              <td class="align-middle">{{ obtenerDepartamentoLabel(candidato.departamento) }}</td>
              <td class="align-middle">{{ candidato.modalidad }}</td>
              <td class="align-middle">{{ candidato.observaciones
                }}</td>
              <td class="text-center align-middle pale-yellow table-warning">
                <div>
                  <button class="btn btn-warning m-2" @click="selelccionarcandidato(candidato)">
                    <i class="fas fa-pencil-alt"></i>
                  </button>

                  <button class="btn btn-danger m-2" @click="eliminarcandidato(candidato.nombre)">
                    <i class="bi bi-trash"></i>
                  </button>

                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="d-flex justify-content-center my-3">
          <button class="btn btn-primary" :disable="currentPage === 1" @click.prevent="paginaAnterior">
            <i class="bi bi-chevron-left"> </i>
          </button>
          <span class="mx-3 align-self-center">Página {{ currentPage }}</span>

          <button class="btn btn-secondary" :disabled="currentPage * perPage >= this.candidatos.length"
            @click.prevent="siguientePagina">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import NavBar from './NavBar.vue';
import Swal from 'sweetalert2';

export default {
  name: "TablaEmpleo",
  components: {
    // NavBar
  },

  data() {
    return {

      candidato: {
        id: '',
        apellidos: '',
        nombre: '',
        email: '',
        movil: '',
        departamento: '',
        modalidad: '',
        privacidad: '',
        observaciones: ''
      },
      archivo: null,
      candidatos: [],
      departamentos: [],
      currentPage: 1,
      pageSize: 5,

    };
  },

  mounted() {
    this.getcandidatos();
    this.getDepartamentos();

  },

  computed: {
    candidatoPorPagina() {
      const candidatosFiltrados = this.candidatos;
      const indiceInicial = (this.currentPage - 1) * this.pageSize;
      return candidatosFiltrados.slice(indiceInicial, indiceInicial + this.pageSize)
    },
  },

  methods: {
    obtenerDepartamentoLabel(departamentoId) {
      // Buscar el departamento que coincida con el id
      const departamento = this.departamentos.find(d => d.id === departamentoId);
      // Si se encuentra el departamento, devolver su label; de lo contrario, devolver un valor por defecto
      return departamento ? departamento.label : 'No asignado';
    },
    validarTelefono(telefono) {
      if (telefono == '') {
        this.mostrarAlerta('Error', 'El teléfono con formato no valido', 'error');
      }
      const regex = /^[67]\d{8}$/;
      if (!regex.test(telefono)) {
        this.mostrarAlerta('Error', 'El teléfono con formato no valido', 'error')
      }
    },
    validarEmail(email) {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!regex.test(email)) {
        this.mostrarAlerta('Error', 'El correo electrónico tiene un formato no válido', 'error');
      }
    },
    siguientePagina() {
      if (this.currentPage * this.pageSize < this.candidatos.length) {
        this.currentPage++;
      }
    },

    paginaAnterior() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    handleFileChange(event) {
      this.archivo = event.target.files[0];
      console.log(this.archivo)
    },

    async seleccionarcandidato(candidato) {
      try {
        this.limpiarFormCli()
        const response = await fetch('http://localhost:3000/candidatos');
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
        const candidatos = await response.json();

        // Encontrar el candidato por su DNI
        const candidatoEncontrado = candidatos.find(c => c.nombre === candidato.nombre);


        if (candidatoEncontrado) {
          // Convertir la fecha de alta al formato dd/mm/yyyy
          // Asignar el objeto completo de provincia y municipio


          this.candidato = { ...candidatoEncontrado }
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta('Error', 'No se pudo cargar el candidato desde el servidor.', 'error');
      }
    },

    limpiarCampos() {
      // Limpiar los campos del formulario
      this.nombre = '';
      this.apellidos = '';
      this.email = '';
      this.movil = '';
      this.departamento = '';
      this.modalidad = '';
      this.observaciones = '';
      this.privacidad = '';
      this.archivo = null;
      this.$refs.fileInput.value = null;

      // Mostrar mensaje de éxito con SweetAlert
      Swal.fire({
        icon: 'info',
        title: 'Campos limpiados',
        text: 'Los campos del formulario se han limpiado correctamente.',
      });
    },

    limpiarTarea() {
      this.nombre = '';
      this.apellidos = '';
      this.email = '';
      this.movil = '';
      this.departamento = '';
      this.modalidad = '';
      this.observaciones = '';
      this.privacidad = '';
      this.$refs.fileInput.value = null;

    },
    async getcandidatos() {
      try {
        const response = await fetch('http://localhost:3000/candidatos');
        if (!response.ok) {
          throw new Error('Error en la solicitud:' + response.statusText);
        }
        this.candidatos = (await response.json()).sort((a, b) => a.apellidos.localeCompare(b.apellidos) || a.nombre.localeCompare(b.nombre));
      } catch (error) {
        console.error(error);
      }
    },


    mostrarAlerta(titulo, mensaje, icono) {
      Swal.fire({
        title: titulo,
        text: mensaje,
        icon: icono,
        customClass: {
          container: 'custom-alert-container',
          popup: 'custom-alert-popup',
          modal: 'custom-alert-modal'
        }
      })
    },

    async estasSeguro() {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres actualizar este candidato?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        customClass: {
          container: 'custom-alert-container',
          popup: 'custom-alert-popup',
          modal: 'custom-alert-modal',
          confirmButton: 'btn-aceptar',
          cancelButton: 'btn-cancelar',
          closeButton: 'weqweqwe'
        }
      });

      // Retorna true si el usuario acepta (hace clic en "Aceptar") o false si cancela
      return result.isConfirmed;
    }
    ,

    async enviarEmpleado() {
          try {
            // Validaciones
            if (!this.candidato.apellidos || !this.candidato.nombre || !this.candidato.email || !this.candidato.movil
              || !this.candidato.departamento || !this.candidato.modalidad) {
              this.mostrarAlerta("Aviso", "Todos los campos obligatorios", "warning");
              return; // Detiene la ejecución si falta algún campo
            }

            // Política de privacidad
            if (!this.candidato.privacidad) {
              this.mostrarAlerta("Aviso", "Debe Aceptar las Condiciones de Privacidad", "warning");
              return;
            }

            // **Paso 1: Enviar los datos del candidato**
            const datos = {
              apellidos: this.candidato.apellidos,
              nombre: this.candidato.nombre,
              email: this.candidato.email,
              movil: this.candidato.movil,
              categoria: this.candidato.departamento,
              modalidad: this.candidato.modalidad,
              comentarios: this.candidato.comentarios,
              privacidad: true
            };

            const responseCandidato = await fetch('http://localhost:3000/candidatos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(datos), // Enviamos los datos como JSON
            });

            if (!responseCandidato.ok) {
              const errorData = await responseCandidato.json();
              throw new Error(`Error al guardar los datos del candidato: ${errorData.message || 'Desconocido'}`);
            }

            // Paso 2: Subir el archivo PDF (si existe)
         
            if (this.archivo) {

              const formData = new FormData();
              const candidatoId = this.candidato.movil;
              console.log('Candidato ID:', this.candidato.movil);
              if (!candidatoId) {
                throw new Error('No se pudo obtener el ID del candidato');
              }
              const nuevoArchivo = new File([this.archivo], `${candidatoId}.pdf`, { type: this.archivo.type });
              formData.append('archivo', nuevoArchivo);
              formData.append('candidatoId', candidatoId) 
              console.log(nuevoArchivo)
              const fileResponse = await fetch('http://localhost:5000/subircv', {
                method: 'POST',
                body: formData,
                credentials : 'include'
              });
            
              if (!fileResponse.ok) {
                throw new Error('Error al subir el archivo');
              }else{
                console.log('hubo respuesta:', fileResponse);
              }


              const fileData = await fileResponse.json();
              console.log('Archivo subido correctamente:', fileData);
            }
            // Si todo fue bien
            this.mostrarAlerta("Aviso", "Datos y archivo enviados correctamente", "success");
            this.getCandidatos(); // Si necesitas actualizar la lista de candidatos

            // Restablecer formulario
            this.candidato = {
              apellidos: '',
              nombre: '',
              email: '',
              movil: '',
              departamento: '',
              modalidad: '',
              comentarios: '',
            };
            this.$refs.fileInput.value = null;
            this.isChecked = false;

          } catch (error) {
            console.error('Error:', error);
            //this.mostrarAlerta("Error", error.message, "error");  // Mostrar el error en la alerta
          }
        },

    async grabarcandidato() {
      // Verificar si los campos requeridos están llenos
      if (this.candidato.apellidos && this.candidato.nombre && this.candidato.departamento && this.candidato.email && this.candidato.movil && this.candidato.privacidad && this.candidato.modalidad) {
        try {
          // Eliminar el 'id' si está presente, ya que el servidor lo genera automáticamente
          const candidatoData = { ...this.candidato }; // Crear una copia del objeto para evitar mutaciones
          delete candidatoData.id; // Eliminar 'id' para que el servidor lo genere

          candidatoData.baja = ''; // Establecer un valor para 'baja' si es necesario

          // Si el candidato tiene un 'id', significa que es una actualización
          if (this.candidato.id) {
            // Preguntar al usuario si está seguro de actualizar
            const confirmar = await this.estasSeguro();

            if (confirmar) {
              // Realizar la actualización del candidato
              const response = await fetch(`http://localhost:3000/candidatos/${this.candidato.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(candidatoData),
              });

              if (!response.ok) {
                throw new Error('Error al actualizar el candidato: ' + response.statusText);
              }

              if (this.archivo) {
                        const formdata = new FormData;
                        const candidatoId = this.candidato.movil || 'default';
                        const nuevoArchivo = new File([this.archivo], `${candidatoId}.pdf`, { type: this.archivo.type })
                        formdata.append("archivo", nuevoArchivo);
                        formdata.append("candidatoId", candidatoId)
                        console.log(nuevoArchivo);
                        const uploadResponse = await fetch('http://localhost:5000/subirarchivo', {
                            method: 'POST',
                            body: formdata,
                            credentials: 'include'
                        });

                        if (!uploadResponse.ok) {
                            throw new Error(`Error al subir el archivo ${response.statusText}`);
                        } else {
                            console.log('hubo respuesta: ', uploadResponse);
                        }
                    }

              this.mostrarAlerta('Aviso', 'Candidato actualizado correctamente', 'success');
              this.getcandidatos(); // Recargar la lista de candidatos
            } else {
              this.mostrarAlerta('Aviso', 'La actualización del candidato ha sido cancelada.', 'info');
            }
          } else {
            // Si no tiene 'id', crear un nuevo candidato
            const response = await fetch('http://localhost:3000/candidatos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(candidatoData), // Enviar los datos sin el 'id'
            });

            if (!response.ok) {
              throw new Error('Error al guardar el candidato: ' + response.statusText);
            }

            const nuevoCandidato = await response.json();
            this.candidatos.push(nuevoCandidato); // Agregar el nuevo candidato al array
            this.mostrarAlerta('Aviso', 'Candidato grabado correctamente', 'success');
            this.getcandidatos(); // Recargar la lista de candidatos
          }
        } catch (error) {
          console.error(error);
          this.mostrarAlerta('Error', 'No se pudo grabar el candidato.', 'error');
        }
      } else {
        this.mostrarAlerta('Error', 'Por favor, completa todos los campos requeridos.', 'error');
      }
    },

    async eliminarcandidato(nombre) {
      try {
        const response = await fetch("http://localhost:3000/candidatos");
        if (!response.ok) {
          throw new Error("Error en la solicitud: " + response.statusText);
        }

        const candidatos = await response.json();
        const candidatoExistente = candidatos.find(candidato => candidato.nombre === nombre);

        if (candidatoExistente) {
          // Usar DELETE en lugar de PUT
          const deleteResponse = await fetch(`http://localhost:3000/candidatos/${candidatoExistente.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            }
          });

          if (!deleteResponse.ok) {
            throw new Error("Error al eliminar el candidato: " + deleteResponse.statusText);
          }

          this.mostrarAlerta("Aviso", "Candidato eliminado correctamente", "success");
          this.getcandidatos(); // Actualizar lista de candidatos
        } else {
          this.mostrarAlerta("Error", "Candidato no encontrado", "error");
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta("Error", "No se pudo eliminar al candidato", "error");
      }
    }
    ,

    async modificarcandidato() {
      if (this.candidato.id) {
        try {


          const response = await fetch(`http://localhost:3000/candidatos/${this.candidato.id}`, { // URL interpolada correctamente
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.candidato),
          });


          if (!response.ok) {
            throw new Error('Error al modificar el candidato:' + response.statusText);
          }
          this.mostrarAlerta("Aviso", "candidato modificado correctamente", "success");
          this.getcandidatos();

        } catch (error) {
          console.error(error);
        }
      } else {
        this.mostrarAlerta('Error', 'Debe seleccionar un candidato para modificar', 'error')
      }
    },



    async getDepartamentos() {
      try {
        const response = await fetch('http://localhost:3000/departamentos');
        if (!response.ok) {
          throw new Error('Error en la solicitud:' + response.statusText);
        }
        this.departamentos = await response.json();
      } catch (error) {
        console.error(error);
      }
    },
    async prueba() {

    },
  }
}

</script>

<style scoped>
.custom-date-input {
  width: 12em;
  text-align: center;
}
</style>