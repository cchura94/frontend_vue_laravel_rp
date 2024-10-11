<template>
    <h1>Gestión Roles</h1>

    <!--{{ roles }}-->

    <Button type="button" label="Nuevo Role" @click="visible_editar_role = true"></Button>

<div v-if="roles.length>0">
    <DataTable :value="roles" tableStyle="min-width: 50rem">
        <Column field="id" header="ID"></Column>
        <Column field="name" header="NOMBRE"></Column>
        <Column field="detalle" header="DETALLE"></Column>
        <Column :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
                <Button icon="pi pi-box" rounded class="mr-2" @click="editRole(slotProps.data)" />
                <Button icon="pi pi-pencil" rounded class="mr-2" @click="modificarRole(slotProps.data)" />
                <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
            </template>
        </Column>
    </DataTable>

</div>

<Dialog v-model:visible="dialogVisible" :header="`Permisos para: ${role.name}`" :style="{ width: '75vw' }" maximizable modal :contentStyle="{ height: '300px' }">
    
    <!--{{ permisos }}-->
    <div class="flex items-center gap-4 mb-4">
        <label for="permiso" class="font-semibold w-24">Nuevo Permiso</label>
        <InputText
          id="permiso"
          class="flex-auto"
          autocomplete="off"
          placeholder="ingrese name"
          v-model="permiso.name"
        />

        <InputText
          id="action"
          class="flex-auto"
          autocomplete="off"
          v-model="permiso.action"
          placeholder="ingrese action"
        />
        <InputText
          id="sub"
          class="flex-auto"
          autocomplete="off"
          v-model="permiso.subject"
          placeholder="ingrese subject"
        />
        <InputText
          id="per"
          class="flex-auto"
          autocomplete="off"
          v-model="permiso.permiso"
          placeholder="ingrese permiso"
        />
        <InputText
          id="desc"
          class="flex-auto"
          autocomplete="off"
          v-model="permiso.descripcion"
          placeholder="ingrese descripcion"
        />
      </div>

      <Button
          type="button"
          label="Guardar Permiso"
          @click="guardarPermiso()"
        ></Button>

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


<Dialog v-model:visible="visible_editar_role" modal header="Editar Role" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Actualiza la Información del Rol.</span>
    <div class="flex items-center gap-4 mb-4">
        <label for="nom" class="font-semibold w-24">Nombre</label>
        <InputText id="nom" class="flex-auto" autocomplete="off" v-model="role.name"/>
    </div>
    <div class="flex items-center gap-4 mb-8">
        <label for="desc" class="font-semibold w-24">detalle</label>
        <InputText id="desc" class="flex-auto" autocomplete="off" v-model="role.detalle" />
    </div>
    <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="visible_editar_role = false"></Button>
        <Button type="button" label="Guardar Cambios" @click="guardarCambios()"></Button>
    </div>
</Dialog>
    
</template>

<script setup>
import Swal from "sweetalert2"
import { onMounted, ref } from "vue";
import roleService from "./../../../services/role.service.js"
import permisoService from "./../../../services/permiso.service.js"

const roles = ref([]);
const lista_permisos = ref([]);
const permisos = ref([]);

const dialogVisible = ref(false)
const role = ref({})
const permiso = ref({name: "", action: "", subject: "", permiso: "", descripcion: ""});
const visible_editar_role = ref(false);


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

const guardarPermiso = async () => {
    await permisoService.guardar(permiso.value)
    getRoles();
}

const modificarRole = async (data) => {
    visible_editar_role.value = true;

    role.value = data

}

const guardarCambios = async () => {
    
    if(role.value.id){
        await roleService.modificar(role.value.id, role.value);

    }else{
        await roleService.guardar(role.value);

    }

    getRoles()

    visible_editar_role.value = false;
}
</script>