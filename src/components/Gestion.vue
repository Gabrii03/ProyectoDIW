<template>
    <br>
    <h4 class="font-weight-bold text-uppercase text-primary position-relative d-inline-block m-3">Panel de Control<i class="bi bi-menu-button m-2"></i></h4>
    <br>
    
    <div class="container-fluid d-flex justify-content-center pt-5">
    <form class="d-inline">
        <div class="row text-center">
            <div class="col">
                <button class="btn btn-primary btn-fixed m-2">
                    <a class="nav-link active" aria-current="page" href="/usuarios">Gestión Usuarios</a>
                </button>
            </div>
            <div class="col">
                <button class="btn btn-primary btn-fixed m-2">
                    <a class="nav-link active" aria-current="page" href="/empleo">Gestión Empleo</a>
                </button>
            </div>
        </div>
        <div class="row text-center">
            <div class="col">
                <button class="btn btn-primary btn-fixed m-2">
                    <a class="nav-link active" aria-current="page" href="/comentarios">Gestión Comentarios</a>
                </button>
            </div>
            <div class="col">
                <button class="btn btn-primary btn-fixed m-2">
                    <a class="nav-link active" aria-current="page" href="/articulos">Gestión Artículos</a>
                </button>
            </div>
        </div>
        <div class="row text-center">
            <div class="col">
                <button class="btn btn-dark btn-fixed m-2"><a class="nav-link active" aria-current="page" href="#">ToDo</a></button>
            </div>
            <div class="col">
                <button class="btn btn-dark btn-fixed m-2"><a class="nav-link active" aria-current="page" href="#">ToDo</a></button>
            </div>
        </div>
    </form>
</div>
</template>

<script>
export default {
    name: "PaginaInicio",
    components: {}
}
</script>

<style>
 .botones{
    display: flex;
    margin-left: 40%; 
 }
 
 .botones-iz, .botones-der {
    margin: 10px;
 }

 
 button.btn-hover2:disabled {
    background-color: #b9b9b9b9;
    cursor: not-allowed;
    opacity: 1; 
    border: 1px solid white;
 }
</style>
