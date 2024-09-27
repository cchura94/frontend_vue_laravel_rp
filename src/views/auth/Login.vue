<template>
    <h1>Ingresar (Login)</h1>
    
    {{ credenciales }}

    <form @submit.prevent="funIngresar()">
        <label for="">Ingrese su correo</label>
        <input type="email" v-model="credenciales.email">
        <br>
        <label for="">Ingrese su Contraseña</label>
        <input type="password" v-model="credenciales.password">

        <br>
        <input type="submit" value="Ingresar">
    </form>

</template>


<script setup>
import { ref, onMounted } from "vue";
import authService from "./../../services/auth.service"
import {useRouter} from "vue-router"

const credenciales = ref({});
const router = useRouter();

async function funIngresar(){

    // const {edad, ...rest} = {nombre: "Juan", edad: 50, estado: true};
    // console.log(rest)
    
     try {
         const { data } = await authService.login(credenciales.value);
         console.log(data.access_token)
         localStorage.setItem("access_token", data.access_token)
         router.push({name: "MiPerfil"})
         
     } catch (error) {
         alert("Error ")
         
     }

    
}

</script>