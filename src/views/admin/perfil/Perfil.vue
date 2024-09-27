<template>
    <h1>Mi Perfil</h1>

    <div v-if="perfil">
        {{ perfil }}
    </div>
</template>

<script setup>
    import { onMounted, ref } from "vue";
    import authService from "./../../../services/auth.service";

    const perfil = ref({});

    onMounted(() => {
        getPerfil()
    });

    async function getPerfil(){
        const {data} = await authService.perfil();
        perfil.value = data
    }


</script>