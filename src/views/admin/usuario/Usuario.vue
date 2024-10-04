<template>
    
    <div class="card">

        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
    animationDuration=".5s" aria-label="Custom ProgressSpinner" v-if="loading" />

    <Button label="Nuevo Usuario" @click="visible = true" />

<Dialog v-model:visible="visible" modal header="Usuario" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Verifique los datos.</span>
    <div class="flex items-center gap-4 mb-4">
        <label for="username" class="font-semibold w-24">Usuario</label>
        <InputText id="username" class="flex-auto" autocomplete="off" v-model="usuario.name" />
    </div>
    <div class="flex items-center gap-4 mb-8">
        <label for="email" class="font-semibold w-24">Correo Electronico</label>
        <InputText id="email" class="flex-auto" autocomplete="off" v-model="usuario.email" />
    </div>

    <div class="flex items-center gap-4 mb-8">
        <label for="pass" class="font-semibold w-24">Contraseña</label>
        <InputText id="pass" class="flex-auto" autocomplete="off" v-model="usuario.password" />
    </div>
    <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="visible = false"></Button>
        <Button type="button" label="Guardar Usuario" @click="guardarUsuario()"></Button>
    </div>
</Dialog>

        <DataTable :value="usuarios" tableStyle="min-width: 50rem">
            <Column field="id" header="ID"></Column>
            <Column field="name" header="USUARIO"></Column>

            <Column field="email" header="CORREO ELECTRONICO"></Column>
            <Column :exportable="false" style="min-width: 12rem" header="PERSONALES">
                <template #body="slotProps">
                    <div>
                        {{ slotProps.data.persona }}
                    </div>
                </template>
            </Column>
            <Column :exportable="false" style="min-width: 12rem" header="ROLES">
                <template #body="slotProps">
                    <div>
                        <Chip :label="rol.name" removable v-for="(rol, pos) in slotProps.data.roles" :key="pos" />
                        <ul>
                            <!--li v-for="(rol, pos) in slotProps.data.roles" :key="pos">{{ rol.name }}</li-->
                        </ul>
                    </div>
                </template>
            </Column>
            <Column field="created_at" header="CREADO POR"></Column>

            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" rounded class="mr-2" @click="editUsuario(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                </template>
            </Column>
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
const usuario = ref({})
const visible = ref(false)

onMounted(() => {
    getUsuarios()
})

async function getUsuarios(){
    loading.value = true
    const {data} = await usuarioService.listar();
    usuarios.value = data.data
    loading.value = false
}

async function guardarUsuario(){
    try {
        if(usuario.value.id){

            await usuarioService.modificar(usuario.value.id, usuario.value);
            getUsuarios();
        
            visible.value = false;

        }else{
            await usuarioService.guardar(usuario.value);
            getUsuarios();
        
            visible.value = false;

        }
        
    } catch (error) {
        
    }
}

function editUsuario(data){
    usuario.value = data;
    visible.value = true;
}

async function confirmDeleteProduct(data){
    try {
        if(confirm("¿Está seguro de eliminar el usuario?")){
            await usuarioService.eliminar(data.id);
            getUsuarios();

        }

    } catch (error) {
        
    }
}
</script>