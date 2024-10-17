<script setup>
import { ref } from 'vue';
import { useAbility } from '@casl/vue'
import AppMenuItem from './AppMenuItem.vue';

const { can } = useAbility()

const model = ref([
    {
        label: 'Administración',
        items: [
            { label: 'Admin', icon: 'pi pi-fw pi-home', to: '/admin', visible: can('manage', 'all') },
            { label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/admin/perfil', visible: can('index', 'user') }
        ]
    },
    {
        label: 'Gestión Usuarios',
        items: [
            { label: 'Lista Usuarios', icon: 'pi pi-fw pi-id-card', to: '/admin/usuario', name: 'user', visible: can('index', 'user') },
        ]
    },
    {
        label: 'Seguridad',
        icon: 'pi pi-fw pi-briefcase',
        to: '/roles',
        visible: true,
        items: [
            {
                label: 'Roles',
                icon: 'pi pi-fw pi-globe',
                to: '/admin/roles',
                name: 'role',
                visible: can('index', 'role')
            },
            /*
            {
                label: 'Gestiónar',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/login',
                        name: 'auth'
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/auth/error'
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        to: '/auth/access'
                    }
                ]
            }
            */
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
