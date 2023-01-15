<template>
    <v-card :loading="loading" :style="{ left: location.x + 'px', top: location.y + 'px' }" v-show="show"
        @contextmenu.prevent="null">
        <v-list density="compact">
            <v-list-item v-for="item in menu" :key="item.name" @click="item.action" link class="message-menu" :disabled="item.disabled">
                <template v-slot:prepend v-if="item.icon">
                    <v-icon :icon="(item.icon as any)"></v-icon>
                </template>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<style scoped>
.v-card {
    width: 200px;
    max-width: 250px;
    z-index: 99999;
    position: absolute;
    opacity: 0.95;
}
</style>

<script lang="ts" setup>
// vue imports
import type { PropType } from 'vue'
// menu props
const props = defineProps(
    {
        location: {
            type: Object as PropType<{ x: number, y: number }>,
            required: true,
        },
        menu: {
            type: Array as PropType<{ name: string, action: (...params: any[]) => any, icon?: String, disabled?: boolean }[]>,
            required: true,
        },
        show: {
            type: Boolean,
            required: true,
        },
        loading: {
            type: Boolean,
            required: false,
            default: false,
        }
    }
)
</script>