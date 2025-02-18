<template>
    <br>

    <div class="row">
        <h4 class="text-center text-primary font-weight-bold">
            <i class="bi bi-chat-left-text"></i> ZONA DE COMENTARIOS
            <router-link to="/" class="btn btn-customb"><i class="bi bi-arrow-return-left me-2"></i></router-link>
        </h4>


    </div>

    <br>
    <div class="container-fluid border p-4">
        <!-- Formulario -->
        <form class="form-in-line">
            <div class="col-10 col-m-6 col-lg-8 mx-auto">


                <!-- Email y Móvil -->
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span me-2">Email: </span>
                    <input type="email" class="form-control sm w-50" placeholder="Correo electrónico"
                        v-model="candidato.clienteEmail" @blur="validarEmail(this.candidato.clienteEmail)">
                    <span class="input-group-text custom-span ms-2 me-2">Móvil: </span>
                    <input type="text" class="form-control sm w-50" placeholder="Móvil" v-model="candidato.clienteMovil
                        " @blur="validarTelefono(this.candidato.clienteMovil)">
                </div>

                <!--Comentarios-->
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span me-2">Mensaje: </span>
                    <textarea name="comentarios" id="comentarios" cols="130" rows="5"
                        v-model="candidato.clienteMensaje"></textarea>
                </div>

                <!--eSTRELLA-->
                <!--<div class="star-valor">-->


                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span me-2">Valoración: </span>
                    <div class="star-valor" >
                        <span v-for="n in 5" :key="n" :class="n <= candidato.clienteValor ? 'bi bi-star-fill' : 'bi bi-star'"
                            @click="setValor(n)" class="star-icon" ></span>
                    </div>


                    <button class="btn btn-light m-1" @click="limpiarFormCli()">
                        <i class="bi-arrow-clockwise"></i>
                    </button>
                </div>







                <!-- Aceptar politica  -->
                <input class="mx-2" type="checkbox" id="ckeckbox" v-model="candidato.lopd">
                <label for="checkbox">Acepto las condiciones y términos de la <router-link to="/privacidad">Política de
                        Privacidad</router-link></label><br>

            </div>

            <!-- Submit -->
            <button class="btn btn-primary m-1" @click.prevent="grabarcandidato">Alta</button>
        </form>
    </div>




    <div class="container my-5">
        <div class="row">
            <h5 class="text-center font-weight-bold">
                <i class="bi bi-file-earmark-bar-graph"></i> TABLA DE COMENTARIOS

            </h5>


        </div>
        <div class="container my-2">


            <div class="table-responsive">
                <table class="table table-striped">
                    <thead class="table-info rounded-header">
                        <tr>
                            <th scope="col" class="w-20">ID</th>
                            <th scope="col" class="w-20">Fecha</th>
                            <th scope="col" class="w-20 text-center">Email</th>
                            <th scope="col" class="w-10">Mensaje</th>
                            <th scope="col" class="w-10 text-center">Valoración</th>
                            <th scope="col" class="pale-yellow table-warning" v-if="isAdmin">Gestiónn</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="candidato in candidatoPorPagina" :key="candidato.id">
                            <td class="align-middle">{{ candidato.id }}</td>
                            <td class="align-middle">{{ candidato.fechaComentario }}</td>
                            <td class="align-middle">{{ candidato.clienteEmail }}</td>
                            <td class="align-middle">{{ candidato.clienteMensaje }}</td>

                            <td class="align-middle">{{ candidato.clienteValor }}</td>
                            <td class="text-center align-middle pale-yellow table-warning" v-if="isAdmin">
                                <div>
                                    <button class="btn btn-warning m-2" @click="selelccionarcandidato(candidato)">
                                        <i class="fas fa-pencil-alt"></i>
                                    </button>

                                    <button class="btn btn-danger m-2" @click="eliminarcandidato(candidato.id)">
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

            clienteValor: 0,

            candidato: {
                id: '',
                clienteEmail: '',
                clienteMensaje: '',
                fechaComentario: '',
                clienteMovil: '',
                clienteValor: '0',
                lopd: ''
                
            },
            candidatos: [],
            usuarios: [],
            currentPage: 1,
            pageSize: 5,

        };
    },

    mounted() {
        this.getcandidatos();
        this.getusuarios();

    },

    computed: {
        candidatoPorPagina() {
            const candidatosFiltrados = this.candidatos;
            const indiceInicial = (this.currentPage - 1) * this.pageSize;
            return candidatosFiltrados.slice(indiceInicial, indiceInicial + this.pageSize)
        },
    },

    methods: {

        setValor(n) {
            this.clienteValor = n;
            this.candidato.clienteValor = n;
        
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

        async selelccionarcandidato(candidato) {
            
            try {
                this.limpiarFormCli()
                const response = await fetch('http://localhost:3000/comentarios');
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }
                const candidatos = await response.json();

                // Encontrar el candidato por su id
                const candidatoEncontrado = candidatos.find(c => c.id === candidato.id);


                if (candidatoEncontrado) {
                    
                    // Convertir la fecha de alta al formato dd/mm/yyyy
                    // Asignar el objeto completo de provincia y municipio

                    this.clienteValor = this.candidato.clienteValor;
                    this.candidato = { ...candidatoEncontrado }
                }
            } catch (error) {
                console.error(error);
                this.mostrarAlerta('Error', 'No se pudo cargar el candidato desde el servidor.', 'error');
            }
        },


        limpiarFormCli() {
            this.candidato = {
                id: '',
                clienteEmail: '',
                clienteMensaje: '',
                fechaComentario: '',
                clienteMovil: '',
                clienteValor: '0',
                lopd: ''
            }
            this.clienteValor = 0;

        },

        async getcandidatos() {
            try {
                const response = await fetch('http://localhost:3000/comentarios');
                if (!response.ok) {
                    throw new Error('Error en la solicitud:' + response.statusText);
                }
                this.candidatos = (await response.json());
            } catch (error) {
                console.error(error);
            }
        },
        async getusuarios() {
            try {
                const response = await fetch('http://localhost:3000/usuarios');
                if (!response.ok) {
                    throw new Error('Error en la solicitud:' + response.statusText);
                }
                this.usuarios = (await response.json()).sort((a, b) => a.apellidos.localeCompare(b.apellidos) || a.nombre.localeCompare(b.nombre));
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
        obtenerFechaHoy() {
      const fecha = new Date();
    
      
      
      const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
      //return fecha.toLocaleDateString('es-ES');  // Formato dd/mm/yyyy
      return fechaFormateada;
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

        async grabarcandidato() {

            const usuarioEncontrado = this.usuarios.find(c => c.email === this.candidato.clienteEmail);
            
            this.candidato.fechaComentario = this.obtenerFechaHoy();
            if(usuarioEncontrado != null){
                console.log("Existe")
            
            // Verificar si los campos requeridos están llenos
            if (this.candidato.clienteMovil && this.candidato.clienteEmail && this.candidato.lopd && this.candidato.clienteValor

                !=0
            ) {
                try {
                    // Eliminar el 'id' si está presente, ya que el servidor lo genera automáticamente
                    const candidatoData = { ...this.candidato }; // Crear una copia del objeto para evitar mutaciones
                    delete candidatoData.id; // Eliminar 'id' para que el servidor lo genere

                

                    // Si el candidato tiene un 'id', significa que es una actualización
                    if (this.candidato.id) {
                        // Preguntar al usuario si está seguro de actualizar
                        const confirmar = await this.estasSeguro();

                        if (confirmar) {
                            // Realizar la actualización del candidato
                            const response = await fetch(`http://localhost:3000/comentarios/${this.candidato.id}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(candidatoData),
                            });

                            if (!response.ok) {
                                throw new Error('Error al actualizar el candidato: ' + response.statusText);
                            }

                            this.mostrarAlerta('Aviso', 'Candidato actualizado correctamente', 'success');
                            this.getcandidatos(); // Recargar la lista de candidatos
                            this.limpiarFormCli();
                        } else {
                            this.mostrarAlerta('Aviso', 'La actualización del candidato ha sido cancelada.', 'info');
                        }
                    } else {
                        // Si no tiene 'id', crear un nuevo candidato
                        const response = await fetch('http://localhost:3000/comentarios', {
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
                        this.limpiarFormCli();
                        
                    }
                } catch (error) {
                    console.error(error);
                    this.mostrarAlerta('Error', 'No se pudo grabar el candidato.', 'error');
                }
            } else {
                this.mostrarAlerta('Error', 'Por favor, completa todos los campos requeridos.', 'error');
            }
        }else{
            this.mostrarAlerta('Error', 'El usuario debe estar registrado.', 'error');
            }
        }

        ,

        async eliminarcandidato(id) {
            try {
                const response = await fetch("http://localhost:3000/comentarios");
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.statusText);
                }

                const candidatos = await response.json();
                const candidatoExistente = candidatos.find(candidato => candidato.id === id);

                if (candidatoExistente) {
                    // Usar DELETE en lugar de PUT
                    const deleteResponse = await fetch(`http://localhost:3000/comentarios/${candidatoExistente.id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });

                    if (!deleteResponse.ok) {
                        throw new Error("Error al eliminar el candidato: " + deleteResponse.statusText);
                    }

                    this.mostrarAlerta("Aviso", "Comentario eliminado correctamente", "success");
                    this.getcandidatos(); // Actualizar lista de candidatos
                } else {
                    this.mostrarAlerta("Error", "Comentario no encontrado", "error");
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


                    const response = await fetch(`http://localhost:3000/comentarios/${this.candidato.id}`, { // URL interpolada correctamente
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


    }
}

</script>

<style scoped>
.star-valor {
    font-size: 2rem;
    /* TamaÃ±o de las estrellas */
    color: #ffc107;
    /* Color dorado */
    cursor: pointer;
}

.star-icon {
    margin-right: 5px;
}

.custom-date-input {
    width: 12em;
    text-align: center;
}
</style>