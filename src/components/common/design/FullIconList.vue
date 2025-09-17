<template>
    <div class="row g-2">
        <div v-for="(icon, index) in icons" :key="index" class="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-1">
            <component :is="icon.name" />
            <Tooltip :title="icon.name">
                <div class="text-center text-truncate text-small">
                    {{ icon.name }}
                </div>
            </Tooltip>
        </div>
    </div>
</template>

<script>
import Tooltip from '@/components/common/layout/Tooltip.vue';
export default {
    data() {
        return {
            iconFiles: [
                'add-request',
                'application',
                'arrow-price-down',
                'arrow-price-up',
                'atom',
                'back',
                'bank',
                'bar-chart',
                'basket-shopping',
                'bell',
                'box-open',
                'browser',
                'building',
                'calculator',
                'calendar-clock',
                'calendar-range',
                'calendar',
                'camera',
                'card-text',
                'catastro',
                'chat-right-text',
                'chat-right',
                'check-circle',
                'check-mark',
                'chevron-up',
                'chevron',
                'clean',
                'client',
                'clip',
                'clipboard-check',
                'close',
                'cloud-arrow-down',
                'cloud-arrow-up',
                'coins',
                'collection-card-text',
                'computer',
                'covered-balcony',
                'cross-mark-circle',
                'cross-mark',
                'cross',
                'custom-dashboard',
                'dashboard',
                'database',
                'door',
                'download-outline',
                'download',
                'dropdown',
                'droplet',
                'earmark',
                'edit',
                'employee-portal',
                'euro',
                'excel-old',
                'excel',
                'exclamation-triangle',
                'eye-cross',
                'eye',
                'favourite',
                'file-earmark-plus',
                'file',
                'files',
                'flow',
                'folder',
                'gear',
                'google',
                'grid-alt',
                'grid-layout',
                'grid',
                'guarantee',
                'hammer',
                'hand-holding-medical',
                'heart-cross',
                'heart-pulse',
                'heart',
                'historic',
                'home-investor',
                'home-vip',
                'home',
                'house-buy',
                'house-down',
                'house-favourite',
                'house-gear',
                'house-medical',
                'house-new',
                'house-sale',
                'house-search-request',
                'house-search',
                'house-up',
                'houses',
                'id-badge',
                'img',
                'key',
                'left-arrow',
                'line-chart',
                'list',
                'location',
                'lock-fill',
                'logo',
                'marker',
                'megaphone',
                'mobile',
                'money',
                'no-guarantee',
                'no-image',
                'notifications',
                'pantheon',
                'pdf',
                'pencil',
                'people-carry-box',
                'people',
                'plane',
                'playlist',
                'question',
                'radiator',
                'receive',
                'resume-area',
                'resume-bath',
                'resume-room',
                'right-arrow',
                'scan',
                'search',
                'send',
                'settings-select',
                'slim',
                'sort-down',
                'star',
                'table',
                'three-d',
                'three-dots-vertical',
                'trash',
                'ul-list',
                'upload-outline',
                'upload',
                'user-admin',
                'user-nurse',
                'user-tie',
                'user',
                'users',
                'video',
                'wardrobe',
                'web',
                'window',
            ],
            icons: []
        };
    },
    components: { Tooltip, },
    async created() {
        for (const file of this.iconFiles) {
            const name = this.getIconNameFromFile(file);
            const component = await import(`@/assets/svg/${file}.vue`);
            this.$options.components[name] = component.default;
            this.icons.push({ name });
        }
    },
    methods: {
        getIconNameFromFile(file) {
            return file
                .split('-')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join('') + 'Icon';
        }
    }
};
</script>