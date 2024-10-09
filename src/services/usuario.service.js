import Api from "./api.service"

export default {
    listar: () => {
        return Api().get("/usuario")
    },
    mostrar: (id) => {
        return Api().get("/usuario/"+id);
    },
    guardar: (datos) => {
        return Api().post("/usuario/", datos);
    },

    modificar: (id, datos) => {
        return Api().put("/usuario/"+id, datos);
    },

    eliminar: (id) => {
        return Api().delete("/usuario/"+id);
    },

    asignarRoles: (id, roles_id) => {
        return Api().post("/usuario/"+id+"/asignar-roles", roles_id);
    },
}