<template>
    <div data-no-export :class="containerClass" v-if="!colspan" @click="$emit('next')" ref="observe">
        <div class="card bg-light">
            <div class="card-body" role="button" @click.stop="$emit('next')">
                <div class="row align-items-center">
                    <div class="col-12 text-truncate text-center">
                        <a href="javascript:void(0)">{{ label }}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <tr data-no-export v-if="colspan" role="button" @click.stop="$emit('next')" ref="observe">
        <td :colspan="colspan" class="text-start">
            <a href="javascript:void(0)">{{ label }}</a>
        </td>
    </tr>
</template>

<script>
import 'intersection-observer';
import { i18n } from "@/tools/i18n.js";

export default {
    emits: ['next'],
    props: {
        colspan: Number,
        autoLazyLoad: Boolean,
        label: {
            type: String,
            default: i18n('Load more...'),
        },
        containerClass: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            emitTimeout: null,
            observer: null,
        };
    },
    mounted() {
        this.$nextTick(() => {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: [0, 0.25, 0.5, 0.75, 1.0],
            };

            const observer = new IntersectionObserver(this.handleIntersection, options);
            observer.observe(this.$refs.observe);
            this.observer = observer;
        });
    },
    beforeUnmount() {
        clearTimeout(this.emitTimeout);

        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    },
    methods: {
        delayEmitNext() {
            clearTimeout(this.emitTimeout);

            this.$nextTick(() => {
                if (!this.$el) return;

                clearTimeout(this.emitTimeout);
                this.emitTimeout = setTimeout(() => {
                    this.$emit('next');
                }, 100);
            });
        },
        handleIntersection(entries) {
            entries.forEach((entry) => {
                if (entry.isIntersecting && this.autoLazyLoad) {
                    this.delayEmitNext();
                }
            });
        },
    },
};
</script>