<template>
  <div class="card">
    <ProgressSpinner
      style="width: 50px; height: 50px"
      strokeWidth="8"
      fill="transparent"
      animationDuration=".5s"
      aria-label="Custom ProgressSpinner"
      v-if="loading"
    />

    <Button label="Nuevo Usuario" @click="visible = true" />

    <Dialog
      v-model:visible="visible"
      modal
      header="Usuario"
      :style="{ width: '25rem' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8"
        >Verifique los datos.</span
      >
      <div class="flex items-center gap-4 mb-4">
        <label for="username" class="font-semibold w-24">Usuario</label>
        <InputText
          id="username"
          class="flex-auto"
          autocomplete="off"
          v-model="usuario.name"
        />
      </div>
      <div class="flex items-center gap-4 mb-8">
        <label for="email" class="font-semibold w-24">Correo Electronico</label>
        <InputText
          id="email"
          class="flex-auto"
          autocomplete="off"
          v-model="usuario.email"
        />
      </div>

      <div class="flex items-center gap-4 mb-8">
        <label for="pass" class="font-semibold w-24">Contraseña</label>
        <InputText
          id="pass"
          class="flex-auto"
          autocomplete="off"
          v-model="usuario.password"
        />
      </div>

      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="visible = false"
        ></Button>
        <Button
          type="button"
          label="Guardar Usuario"
          @click="guardarUsuario()"
        ></Button>
      </div>
    </Dialog>

    <Dialog
      v-model:visible="visible_roles"
      modal
      header="Roles"
      :style="{ width: '40rem' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8"
        >Verifique los Roles Asignados.</span
      >
      <div class="flex items-center gap-4 mb-4">
        <label for="username" class="font-semibold w-24">Roles</label>

        <MultiSelect
          v-model="roleSelecteds"
          display="chip"
          :options="roles"
          optionLabel="name"
          filter
          placeholder="Seleccionar Roles"
          :maxSelectedLabels="4"
          class="w-full md:w-100"
        />
      </div>

      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="visible_roles = false"
        ></Button>
        <Button
          type="button"
          label="Guardar Roles"
          @click="guardarRolesAsignados()"
        ></Button>
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
            <Chip
              :label="rol.name"
              v-for="(rol, pos) in slotProps.data.roles"
              :key="pos"
            />
            <ul>
              <!--li v-for="(rol, pos) in slotProps.data.roles" :key="pos">{{ rol.name }}</li-->
            </ul>
          </div>
        </template>
      </Column>
      <Column field="created_at" header="CREADO POR"></Column>

      <Column :exportable="false" style="min-width: 12rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-user"
            rounded
            class="mr-2"
            @click="editRoles(slotProps.data)"
          />

          <Button
            icon="pi pi-pencil"
            rounded
            class="mr-2"
            @click="editUsuario(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="confirmDeleteProduct(slotProps.data)"
          />
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
import usuarioService from "./../../../services/usuario.service";
import roleService from "../../../services/role.service";

const usuarios = ref([]);
const loading = ref(true);
const usuario = ref({});
const visible = ref(false);
const visible_roles = ref(false);
const roles = ref([]);
const roleSelecteds = ref()

onMounted(() => {
  getUsuarios();
  getRoles();
});

async function getUsuarios() {
    try {
        loading.value = true;
        const { data } = await usuarioService.listar();
        usuarios.value = data.data;
        loading.value = false;
        
    } catch (error) {
        alert("error al recuperar la lista de usuarios")
    }
}

async function getRoles() {
  const { data } = await roleService.listar();
  roles.value = data.roles;
}

async function guardarUsuario() {
  try {
    if (usuario.value.id) {
      await usuarioService.modificar(usuario.value.id, usuario.value);
      getUsuarios();

      visible.value = false;
    } else {
      await usuarioService.guardar(usuario.value);
      getUsuarios();

      visible.value = false;
    }
  } catch (error) {}
}

function editUsuario(data) {
  usuario.value = data;
  visible.value = true;
}

async function confirmDeleteProduct(data) {
  try {
    if (confirm("¿Está seguro de eliminar el usuario?")) {
      await usuarioService.eliminar(data.id);
      getUsuarios();
    }
  } catch (error) {}
}

const editRoles = (data) => {
    console.log(data);
    const nuevosDatos = []

    roleSelecteds.value = [];
    data.roles.forEach((rol_select) => {
        const existe = roles.value.some(obj => obj.id == rol_select.id)
        if(existe){
            const {pivot, ...rest} = rol_select;
            // roles.value.splice(roles.value.findIndex(obj => obj.id == rol_select.id), 1);
            nuevosDatos.push(rest);
        }

    })

    roleSelecteds.value = nuevosDatos;
    

  visible_roles.value = true;
  usuario.value = data
};

const guardarRolesAsignados = async () => {
    const roles_id = []
    if(roleSelecteds.value.length>0){
        roleSelecteds.value.forEach(role => {
            const { id, ...resto } = role;
            roles_id.push(id);        
        });
    
        await usuarioService.asignarRoles(usuario.value.id, {roles_id: roles_id})
    
        visible_roles.value = false
        getUsuarios();

    }
}
</script>
