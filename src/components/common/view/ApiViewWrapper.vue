<template>
    <template v-if="notFound === true">
        <DefaultLayout :allowAnonymous="true" :showMenu="false">
            <div class="text-center">
                <h1 class="mt-3">{{ i18n('Upss!') }}</h1>
                <p>{{ i18n('The page you are looking for does not exist.') }}</p>

                <router-link :to="{ name: 'Index' }">
                    {{ i18n('Back to homepage') }}
                </router-link>
            </div>
        </DefaultLayout>
    </template>
    <template v-else-if="notFound === false">
        <slot></slot>
    </template>
    <template v-else-if="!allowAnonymous && hasAuthToken === false">
        <DefaultLayout :allowAnonymous="allowAnonymous" :showMenu="false">
            <div class="p-5 text-center">
                <span class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">{{ i18n('Loading...') }}</span>
                </span>
            </div>
        </DefaultLayout>
    </template>
    <template v-else>
        <div class="p-5 text-center">
            <span class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">{{ i18n('Loading...') }}</span>
            </span>
        </div>
    </template>
</template>

<script>
import api from "@/api.js";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

export default {
    components: {
        DefaultLayout,
    },
    data() {
        return {
            hasAuthToken: null,
        };
    },
    props: ['notFound', 'allowAnonymous'],
    created() {
        this.hasAuthToken = api.hasAuthToken();
    },
};
</script>