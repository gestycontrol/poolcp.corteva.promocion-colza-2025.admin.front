<template>
    <div class="accordion" :id="id">
        <slot></slot>
    </div>
</template>

<script>
import randomIdMixin from "@/mixins/common/randomIdMixin.js";

export default {
    mixins: [
        randomIdMixin,
    ],
    computed: {
        id() {
            return 'accordion-' + this.randomId;
        },
    },
};
</script>