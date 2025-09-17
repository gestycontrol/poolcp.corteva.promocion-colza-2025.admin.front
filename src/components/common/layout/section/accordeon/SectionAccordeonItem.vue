<template>
    <div class="accordion-item">
        <h2 class="accordion-header" :id="headingId">
            <button :class="{ 'accordion-button': true, 'collapsed': !innerOpen }" type="button"
                :aria-expanded="innerOpen ? 'true' : 'false'" :aria-controls="collapseId" @click="toggle"
                :id="buttonId">
                <slot name="title"></slot>
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
            default: false,
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
            let event,
                el = document.getElementById(this.headingId);

            if (this.innerOpen) {
                this.$emit('shown');
                event = new CustomEvent('shown.bs.collapse', {
                    bubbles: true,
                });
            } else {
                this.$emit('hidden');
                event = new CustomEvent('hidden.bs.collapse', {
                    bubbles: true,
                });
            }

            if (el) {
                this.$nextTick(() => {
                    el.dispatchEvent(event);
                });
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