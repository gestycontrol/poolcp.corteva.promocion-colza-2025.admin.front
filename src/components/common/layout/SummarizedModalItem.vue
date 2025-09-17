<template>
    <template v-if="tag == 'tr'">
        <tr @click="showDetail" :class="cssClass" :id="id">
            <slot name="summary"></slot>
        </tr>
    </template>
    <template v-else>
        <div @click="showDetail" :class="cssClass" :id="id">
            <slot name="summary"></slot>
        </div>
    </template>
    <Modal @shown="shown" @hidden="hidden" ref="modal" @submit="submit" :modalClass="modalClass">
        <template #title>
            <slot name="title"></slot>
        </template>

        <slot></slot>

        <template #footer>
            <slot name="footer"></slot>
        </template>
    </Modal>
</template>
<script>
import Modal from "@/components/common/layout/Modal.vue";

export default {
    components: {
        Modal,
    },
    props: {
        modalClass: {
            type: String,
            default: '',
        },
        class: {
            type: String,
            default: '',
        },
        id: {
            type: String,
            default: '',
        },
        tag: {
            type: String,
            default: 'div',
        },
    },
    emits: [
        'detailShown',
        'detailHidden',
        'detailSubmitted',
    ],
    computed: {
        cssClass() {
            return this.class;
        },
    },
    methods: {
        showDetail() {
            this.submitted = false;
            this.$refs['modal'].show();
        },
        hideDetail() {
            this.$refs['modal'].hide();
        },
        shown() {
            this.$emit('detailShown');
        },
        hidden() {
            this.$emit('detailHidden');
        },
        submit() {
            this.$emit('detailSubmitted', this.formData);
        },
    }
};
</script>