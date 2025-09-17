<template>
    <AccordionItem :open="innerOpen" @shown="innerOpen = true" @hidden="innerOpen = false">
        <template #title>
            <slot name="title"></slot>
            <template v-if="!hideStatus">
                <span :class="`ms-2 badge ${customStatus.className}`" v-if="customStatus">{{ customStatus.name }}</span>
                <span class="ms-2 badge bg-color-completed" v-else-if="completed">
                    {{ i18n('Completed') }}
                </span>
                <span class="ms-2 badge bg-color-pending" v-else>
                    {{ i18n('Pending') }}
                </span>
            </template>
            <span class="ms-2" v-if="$slots.icons">
                <slot name="icons" class="ms-2"></slot>
            </span>
            <span class="ms-auto">
                <span v-if="checklistCount > 0">
                    {{ checklistActiveCount }}
                    <span class="text-muted">/</span>
                    {{ checklistCount }}
                </span>
            </span>
        </template>

        <slot></slot>

        <template v-if="!hideActions">
            <div class="row g-2 mt-3 mb-2">
                <div class="col-12 col-sm-6">
                    <em class="text-muted" v-if="!markableAsComplete && requiredFieldsNoticeOrDefault">
                        <small>{{ requiredFieldsNoticeOrDefault }}</small>
                    </em>
                </div>
                <div class="col-12 col-sm-6 text-end">
                    <button type="button" class="btn btn-sm btn-link m-2" @click="innerOpen = false">
                        {{ i18n('Collapse Tab') }}
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-dark" :disabled="!markableAsComplete"
                        v-if="!completed && showCompleteButton" @click="completed = true">
                        <CheckCircleIcon />
                        {{ i18n('Mark As Completed') }}
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-dark" v-if="completed && showCompleteButton"
                        @click="completed = false">
                        <LockFillIcon />
                        <span class="d-btnhover-none">
                            {{ i18n('Completed') }}
                        </span>
                        <span class="d-none d-btnhover-inline">
                            {{ i18n('Unmark') }}
                        </span>
                    </button>
                </div>
            </div>
        </template>
        <template v-else>
            <div>
                <div class="row g-2 mt-3">
                    <div class="col text-end">
                        <button type="button" class="btn btn-sm btn-link p-0" @click="innerOpen = false">
                            {{ i18n('Collapse Tab') }}
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </AccordionItem>
</template>

<script>
import AccordionItem from "@/components/common/layout/AccordionItem.vue";
import itemStatusMixin from "@/mixins/common/itemStatusMixin.js";
import CheckCircleIcon from "@/assets/svg/check-circle.vue";
import LockFillIcon from "@/assets/svg/lock-fill.vue";

export default {
    components: {
        AccordionItem,
        CheckCircleIcon,
        LockFillIcon,
    },
    mixins: [
        itemStatusMixin,
    ],
    data() {
        return {
            innerOpen: false,
        };
    },
    created() {
        this.innerOpen = this.open;

        if (this.autocomplete && !this.completed && this.markableAsComplete) {
            this.completed = true;
        }
    },
    computed: {
        requiredFieldsNoticeOrDefault() {
            if (this.requiredFieldsNotice === undefined) {
                return this.i18n('Fields marked with (*) are required.');
            }

            return this.requiredFieldsNotice;
        },
    },
    props: {
        autoclose: {
            type: Boolean,
            default: true,
        },
        open: {
            type: Boolean,
            default: false,
        },
        requiredFields: {
            type: Array,
            default() {
                return [];
            },
        },
        formData: {
            type: Object,
            default() {
                return {};
            },
        },
        requiredFieldsNotice: {
            type: String,
        },
        checklistCount: {
            type: Number,
            default: 0,
        },
        checklistActiveCount: {
            type: Number,
            default: 0,
        },
        showCompleteButton: {
            type: Boolean,
            default: true,
        },
        customStatus: {
            type: Object,
            default() {
                return null;
            },
        },
        hideStatus: {
            type: Boolean,
            default: false,
        },
        hideActions: {
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
        completed() {
            if (this.completed &&
                this.autoclose) {
                this.innerOpen = false;
            }
        },
        innerOpen() {
            if (this.innerOpen) {
                this.$emit('shown');
            } else {
                this.$emit('hidden');
            }
        },
    },
};
</script>