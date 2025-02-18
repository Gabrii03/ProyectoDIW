<template>
    <div class="container mt-5">
        <h4 class="text-center text-primary font-weight-bold">Página de contacto</h4>
        <br>
        <form @submit.prevent="enviarCorreo">
            <div class="form-group">
                <label for="nombre">Nombre</label>
                <input type="text" id="nombre" class="form-control" v-model="contacto.nombre" @blur="nombreTocado = true">
            </div>
            
            <div class="form-group">
                <label for="telefono">Teléfono</label>
                <input type="text" id="telefono" class="form-control" v-model="contacto.telefono" @blur="telefonoTocado = true">
            </div>
            
            <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input type="email" id="email" class="form-control" v-model="contacto.email" @blur="emailTocado = true">
            </div>
            
            <div class="form-group">
                <label for="mensaje">Mensaje</label>
                <textarea id="mensaje" class="form-control" v-model="contacto.mensaje"></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary">Enviar</button>
        </form>
    </div>
</template>

<script>
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';

export default {
    data(){
        return {
            contacto: {
                nombre:'',
                telefono:'',
                email: '',
                mensaje: ''
            },
            nombreTocado: false,
            telefonoTocado: false,
            emailTocado: false
        };
    },
    computed: {
        esNombreValido() {
            return this.contacto.nombre.trim() !== '';
        },
        esTelefonoValido(){
            const regexTelefono = /^[67]\d{8}$/;
            return regexTelefono.test(this.contacto.telefono.trim());
        },
        esEmailValido(){
            const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regexEmail.test(this.contacto.email.trim());
        },
        esMensajeValido() {
            return this.contacto.mensaje.trim() !== '';
        }
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
            });
        },
        enviarCorreo() {
            if (!this.esNombreValido) {
                this.mostrarAlerta('Error', 'El nombre es obligatorio', 'error');
                return;
            }
            if (!this.esTelefonoValido) {
                this.mostrarAlerta('Error', 'Debe ser un número válido (9 dígitos, empieza con 6 o 7)', 'error');
                return;
            }
            if (!this.esEmailValido) {
                this.mostrarAlerta('Error', 'Ingrese un correo válido', 'error');
                return;
            }
            if (!this.esMensajeValido) {
                this.mostrarAlerta('Error', 'El mensaje no puede estar vacío', 'error');
                return;
            }

            const templateParams= {
                nombre: this.contacto.nombre,
                telefono: this.contacto.telefono,
                email: this.contacto.email,
                mensaje: this.contacto.mensaje
            };

            emailjs.send(
                'your_service_id',
                'your_template_id',
                templateParams,
                'your_user_id'
            )
            .then((response) => {
                console.log('Correo enviado correctamente', response);
                this.mostrarAlerta('Éxito', 'Tu mensaje ha sido enviado con éxito.', 'success');
            })
            .catch((error) => {
                console.error('Error al enviar correo:', error);
                this.mostrarAlerta('Error', 'Hubo un error al enviar el mensaje. Intenta de nuevo más tarde.', 'error');
            });
        }
    }
};
</script>

<style>
</style>
