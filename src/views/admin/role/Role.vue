<template>
    <h1>Gestión Roles</h1>

    <!--{{ roles }}-->
<div v-if="roles.length>0">
    <DataTable :value="roles" tableStyle="min-width: 50rem">
        <Column field="id" header="ID"></Column>
        <Column field="name" header="NOMBRE"></Column>
        <Column field="detalle" header="DETALLE"></Column>
        <Column :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" rounded class="mr-2" @click="editRole(slotProps.data)" />
                <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
            </template>
        </Column>
    </DataTable>

</div>

<Dialog v-model:visible="dialogVisible" :header="`Permisos para: ${role.name}`" :style="{ width: '75vw' }" maximizable modal :contentStyle="{ height: '300px' }">
    
    <!--{{ permisos }}-->
    <div class="card">
        <PickList v-model="permisos" dataKey="id" breakpoint="1400px">
            <template #option="{ option  }">
                {{ option.name }}
            </template>
        </PickList>
    </div>


    <template #footer>
        <Button label="Guardar Cambios" icon="pi pi-check" @click="guardarPermisosRoles()" />
    </template>
</Dialog>
    
</template>

<script setup>
import Swal from "sweetalert2"
import { onMounted, ref } from "vue";
import roleService from "./../../../services/role.service.js"

const roles = ref([]);
const lista_permisos = ref([]);
const permisos = ref([]);

const dialogVisible = ref(false)
const role = ref({})



onMounted(() => {
    getRoles()
})

const getRoles = async () => {
    const {data} = await roleService.listar();
    roles.value = data.roles;
    lista_permisos.value = data.permisos;
    // permisos.value = data.permisos;
    permisos.value = [data.permisos, []]
    
}

const editRole = (data) => {
    console.log(data.permisos)
    dialogVisible.value = true

    const nuevosDatos = []
    permisos.value[0] = [...lista_permisos.value];

    data.permisos.forEach(element => {
        const {pivot, ...rest} = element;

        const existe = permisos.value[0].some(obj => obj.id == element.id)
        if(existe){
            permisos.value[0].splice(permisos.value[0].findIndex(obj => obj.id == element.id), 1);
            nuevosDatos.push(rest);
        }
    });

    role.value = data
    permisos.value[1] = nuevosDatos
}

const guardarPermisosRoles = async () => {
    dialogVisible.value = false;
    try {
        const {data} = await roleService.actualizarPermisos(role.value.id,permisos.value[1]);
        roles.value = [];
        getRoles();
        console.log(data);

        Swal.fire({
            title: "Permisos Actualizados",
            text: "OK Para continuar",
            icon: "success"
        });

        
    } catch (error) {
        alert("Error al actuali los permisos");
    }
}
</script>