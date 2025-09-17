<template>
    <div class="card">
        <div class="card-body bg-danger text-white d-flex justify-content-between align-items-center">
            <div>
                <strong>
                    <ExclamationTriangleIcon />
                    <span class="ms-2">{{ text }}</span>
                </strong>
            </div>
            <div v-if="btnText">
                <button class="btn btn-outline-light" @click="$emit('click')">{{ btnText }}</button>
            </div>
        </div>
    </div>
</template>

<script>
import ExclamationTriangleIcon from "@/assets/svg/exclamation-triangle.vue";
export default {
    components: {
        ExclamationTriangleIcon,
    },
    emits: [
        'click',
    ],
    props: {
        text: String,
        btnText: String,
    },
}
</script>