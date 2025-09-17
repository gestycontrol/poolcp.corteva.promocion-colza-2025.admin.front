<template>
    <div class="accordion-item">
        <h2 class="accordion-header" :id="headingId">
            <button :class="{ 'accordion-button': true, 'collapsed': !innerOpen }" type="button"
                :aria-expanded="innerOpen ? 'true' : 'false'" :aria-controls="collapseId" @click="toggle"
                :id="buttonId">
                <div class="d-flex align-items-center w-100">
                    <div class="text-start">
                        <slot name="title"></slot>
                    </div>
                    <div class="ms-auto me-2 text-end">
                        <slot name="icons-end"></slot>
                    </div>
                </div>
            </button>
        </h2>
        <div :id="collapseId" :class="{ 'accordion-collapse collapse': true, 'show': innerOpen }"
            :aria-labelledby="headingId">
            <div class="accordion-body">
                <slot></slot>
                <div class="row" v-if="!hideInnerClose">
                    <div class="col-12 text-end">
                        <button type="button" class="btn btn-sm btn-link m-2" @click="toggle">
                            {{ i18n('Collapse Tab') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import randomIdMixin from "@/mixins/common/randomIdMixin.js";

export default {
    mixins: [
        randomIdMixin,
    ],
    data() {
        return {
            innerOpen: false,
        };
    },
    created() {
        this.innerOpen = this.open;
    },
    computed: {
        headingId() {
            return 'accordion-heading-' + this.randomId;
        },
        collapseId() {
            return 'accordion-collapse-' + this.randomId;
        },
        buttonId() {
            return 'accordion-button-' + this.randomId;
        },
    },
    props: {
        open: {
            type: Boolean,
            default: false,
        },
        hideInnerClose: {
            type: Boolean,
            default: true,
        },
    },
    emits: [
        'shown',
        'hidden',
    ],
    watch: {
        open() {
            this.innerOpen = this.open;
        },
        innerOpen() {
            if (this.innerOpen) {
                this.$emit('shown');
            } else {
                this.$emit('hidden');
            }
        },
    },
    methods: {
        syncInnerOpen() {
            let btn = document.getElementById(this.buttonId);
            this.innerOpen = btn ? !btn.classList.contains('collapsed') : false;
        },
        toggle() {
            this.syncInnerOpen();
            this.$nextTick(() => {
                this.innerOpen = !this.innerOpen;
            });
        },
    }
};
</script>