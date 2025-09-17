<template>
    <aside class="custom-aside" :class="[isSlim ? 'custom-aside-slim' : '']">
        <div class="offcanvas offcanvas-lg offcanvas-start h-100 d-flex" data-bs-scroll="true" tabindex="-1"
            id="aside-menu" aria-labelledby="aside-menu-label">
            <div class="offcanvas-header">
                <a class="navbar-brand" href="/">
                    <img :src="defaultLogoUrl" :alt="defaultCompanyAlias" height="38" data-logo="default">
                </a>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="d-flex flex-column flex-shrink-0">
                    <slot></slot>
                </div>
            </div>
            <div class="d-flex flex-column flex-shrink-0 d-none d-lg-block">
                <ul class="nav nav-pills flex-column mb-auto">
                    <li class="nav-item">
                        <a href="javascript:void(0)" class="nav-link link-dark" :class="[isSlim ? 'slim' : 'normal']"
                            @click="toggleSlimMode">
                            <SlimIcon :class="{ 'rotate-180': isSlim }" />
                            <div class="slim-hide">{{ isSlim ? i18n('Expand') : i18n('Collapse') }}</div>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="custom-offcanvas-footer mt-auto" v-if="$root.loggedUser && $root.loggedUser.id">
                <div class="dropdown">
                    <a href="javascript:void(0)"
                        class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        <img :src="$root.loggedUser.avatar_url" alt="" width="28" height="28"
                            class="rounded-circle me-2">
                        <div class="slim-hide m-0">{{ $root.loggedUser.first_name }}</div>
                    </a>
                    <slot name="userMenu"></slot>
                </div>
            </div>
        </div>
    </aside>
</template>
<script>
import $env from '@/tools/environment.js';
const defaultLogoUrl = $env('VITE_DEFAULT_LOGO_URL');
const defaultCompanyAlias = $env('VITE_DEFAULT_COMPANY_ALIAS');
import SlimIcon from "@/assets/svg/slim.vue";

export default {
    components: {
        SlimIcon
    },
    data() {
        return {
            isSlim: false,
            defaultLogoUrl,
            defaultCompanyAlias,
        };
    },
    mounted() {
        try {
            this.isSlim = !!JSON.parse(localStorage.getItem('isSlim'));
        } catch (e) {
            console.error(e);
            this.isSlim = false;
        }

        if (this.isSlim === true) {
            document.body.classList.add('slim-aside');
        } else {
            document.body.classList.remove('slim-aside');
        }
    },
    methods: {
        toggleSlimMode() {
            this.isSlim = !this.isSlim;
            localStorage.setItem('isSlim', JSON.stringify(this.isSlim));

            if (this.isSlim === true) {
                document.body.classList.add('slim-aside');
            } else {
                document.body.classList.remove('slim-aside');
            }
        }
    },
};
</script>
<style scoped>
::v-deep(.rotate-180 svg) {
    transform: rotate(180deg);
}
</style>