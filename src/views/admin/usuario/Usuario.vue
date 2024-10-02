<template>
    
    <div class="card">

        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
    animationDuration=".5s" aria-label="Custom ProgressSpinner" v-if="loading" />

        <DataTable :value="usuarios" tableStyle="min-width: 50rem">
            <Column field="id" header="ID"></Column>
            <Column field="name" header="Nombre"></Column>
            <Column field="email" header="CORREO ELECTRONICO"></Column>
            <Column field="created_at" header="CREADO POR"></Column>
        </DataTable>
    </div>

    <h1>Lista de Usuarios</h1>
   
    <table border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>CORREO</th>
                <th>CREADO_EN</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="us in usuarios" :key="us.id">
                <td>{{ us.id }}</td>
                <td>{{ us.name }}</td>
                <td>{{ us.email }}</td>
                <td>{{ us.created_at }}</td>
            </tr>
        </tbody>
    </table>


</template>

<script setup>
import { onMounted, ref } from "vue";
import usuarioService from "./../../../services/usuario.service"

const usuarios = ref([]);
const loading = ref(true)

onMounted(() => {
    getUsuarios()
})

async function getUsuarios(){
    loading.value = true
    const {data} = await usuarioService.listar();
    usuarios.value = data.data
    loading.value = false
}
</script>