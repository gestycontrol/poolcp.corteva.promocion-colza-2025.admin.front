<template>
    <Modal modalClass="modal-fullscreen-sm-down" @hidden="hidden" ref="modal">
        <template #title>
            {{ title }}
        </template>

        <div class="text-center">
            <div class="mb-3">
                <svg height="16" style="overflow:visible;enable-background:new 0 0 32 32; width: 4rem; height: 4rem;"
                    viewBox="0 0 32 32" width="16" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g>
                        <g id="Error_1_">
                            <g id="Error">
                                <circle cx="16" cy="16" id="BG" r="16" style="fill:#D72828;" />
                                <path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign"
                                    style="fill:#E6E6E6;" />
                            </g>
                        </g>
                    </g>
                </svg>
            </div>

            <strong>{{ text }}</strong>
        </div>

        <template #footer>
            <div class="row">
                <div class="col text-end">
                    <button type="button" @click="hide" class="btn btn-danger">{{ i18n('OK') }}</button>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script>
import Modal from "@/components/common/layout/Modal.vue";

export default {
    components: {
        Modal,
    },
    data() {
        return {
            title: null,
            text: null,
        };
    },
    emits: [
        'hidden',
    ],
    methods: {
        show(title, text) {
            if (title && text) {
                this.title = title;
                this.text = text;
            } else {
                this.text = title || this.i18n('There was an error.');
                this.title = this.i18n('Error');
            }

            this.$refs['modal'].show();
        },
        hide() {
            this.$refs['modal'].hide();
        },
        hidden() {
            this.$emit('hidden');
        },
    }
};
</script>