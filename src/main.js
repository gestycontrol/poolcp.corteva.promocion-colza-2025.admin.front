import { createApp } from "vue";
import {
    createWebHistory,
    createRouter,
} from "vue-router";
import routes from "@/routes";
import App from "@/App.vue";
import globalMixin from '@/mixins/common/globalMixin.js';
import VueDOMPurifyHTML from 'vue-dompurify-html';

import $env from '@/tools/environment';

const additionalStylesheetUrl = $env('VITE_CUSTOM_STYLE_SHEET');

if (additionalStylesheetUrl) {
    document.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${additionalStylesheetUrl}">`);
}

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'active',
    linkExactActiveClass: 'exact-active',
    scrollBehavior() {
        return {
            x: 0,
            y: 0
        }
    }
});

const WHITELIST_ROUTE_NAMES = $env('VITE_WHITELIST_ROUTE_NAMES', '').split(',').filter(Boolean);
const WHITELIST_ROUTE_FALLBACK_REDIRECT = $env('VITE_WHITELIST_ROUTE_FALLBACK_REDIRECT', '/');

router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0);

    if (WHITELIST_ROUTE_NAMES.length > 0
        && to?.name
        && !WHITELIST_ROUTE_NAMES.includes(to.name)) {
        location.href = WHITELIST_ROUTE_FALLBACK_REDIRECT;
        next(false);
    } else {
        next();
    }
});

createApp(App).mixin(globalMixin).use(router).use(VueDOMPurifyHTML).mount("#app");