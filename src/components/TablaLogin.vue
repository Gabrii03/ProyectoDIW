<template>
  <div>
  <div class="text-center my-4">
    <h4 class="font-weight-bold text-uppercase text-primary position-relative d-inline-block m-3"> <!-- Icono decorativo -->
      Iniciar sesión<i class="bi bi-box-arrow-in-right m-2"></i>
    </h4>
    <br>
    <router-link to="/" class="btn btn-customb"> <i class="bi bi-arrow-return-left me-2"></i></router-link>
  </div>

  <form @submit.prevent="iniciarSesion">
      <!-- Campo DNI -->
      <div class="mb-3">
        <label for="dni" class="form-label">DNI:</label>
        <input
          type="text"
          id="dni"
          class="form-control"
          v-model="dni"
          required
        />
      </div>

      <!-- Campo Contraseña -->
      <div class="mb-3">
        <label for="pass" class="form-label">Contraseña:</label>
        <input
          type="password"
          id="pass"
          class="form-control"
          v-model="pass"
          required
        />
      </div>

      <!-- Botón de login -->
      <button type="submit" class="btn btn-primary">Iniciar sesión</button>
    </form>

    <!-- Mensaje de error -->
    <div v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
//import Swal from 'sweetalert2';
import passport from  '../config/passport.mjs';
import Swal from 'sweetalert2'; 

export default {
  name: "TablaLogin",
  components: {
    
  },
  data() {
    return {
      dni: "",
      pass: "",
      errorMessage: "",
      usuarios: [] // Aquí se almacenarán los usuarios cargados desde el archivo JSON
    };
  },

  created() {
    // Cargar los usuarios desde el archivo datos.json al crear el componente
    this.getUsuarios();
  },

  methods: {
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

      async getUsuarios() {
          try {
              const response = await fetch('http://localhost:3000/usuarios');
              if (!response.ok) {
                  throw new Error('Error en la solicitud: ' + response.statusText);
              }

              // Obtener y ordenar usuarios por apellidos y luego por nombre
              this.usuarios = (await response.json()).sort((a, b) =>
                  a.apellidos.localeCompare(b.apellidos) || a.nombre.localeCompare(b.nombre)
              );

              } catch (error) {
                  console.error(error);
              }
          },


      async iniciarSesion() {
          // Buscar el usuario con el DNI proporcionado
          const usuario = this.usuarios.find((user) => user.dni === this.dni);
  
          // Verificar si el usuario existe
          if (usuario) {
          // Verificar la contraseña usando passport para compararla con la encriptada
          const contrasenaCorrecta = await passport.verificarContrasena(
              this.pass,
              usuario.pass
          );

        if (contrasenaCorrecta) {
          if(usuario.tipo === "admin"){
            this.errorMessage = "";
            this.mostrarAlerta("Bienvenido","Sesión Iniciada","sucess")
            localStorage.setItem('isLogueado','true')
            localStorage.setItem('isAdmin','true')
            this.$router.push({name:'inicio'}).then(()=> {
              window.location.reload();
            });
          }
          alert("Inicio de sesión exitoso");
          // Redirigir o hacer algo después del inicio de sesión
        } else {
          this.errorMessage = "DNI o contraseña incorrectos. Inténtalo de nuevo.";
        }
      } else {
        this.errorMessage = "DNI o contraseña incorrectos. Inténtalo de nuevo.";
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin-top: 50px;
}
</style>

