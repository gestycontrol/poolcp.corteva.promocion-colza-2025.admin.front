<template>
    <div class="text-muted small d-inline-flex align-items-center" :id="id">
        <template v-if="openedCount > 0">
            <button @click="closeAll" class="btn btn-link btn-sm p-0" type="button">
                {{ i18n('Collapse All Tabs') }}
            </button>
        </template>
        <template v-else-if="closedCount > 0">
            <button @click="openAll" class="btn btn-link btn-sm p-0" type="button">
                {{ i18n('Open All Tabs') }}
            </button>
        </template>
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
            openedCount: 0,
            closedCount: 0,
            timeout: null,
        };
    },
    mounted() {
        clearTimeout(this.timeout);
        this.updateStatus();
        this.getContext().addEventListener('shown.bs.collapse', this.delayUpdateStatus);
        this.getContext().addEventListener('hidden.bs.collapse', this.delayUpdateStatus);
    },
    beforeUnmount() {
        clearTimeout(this.timeout);
        this.getContext().removeEventListener('shown.bs.collapse', this.delayUpdateStatus);
        this.getContext().removeEventListener('hidden.bs.collapse', this.delayUpdateStatus);
    },
    computed: {
        id() {
            return 'manage-accordion-action-' + this.randomId;
        },
    },
    methods: {
        getContext() {
            let element = document.getElementById(this.id),
                context = (element ? element.closest('.accordion-body') : null);
            context = context || document;

            return context;
        },
        delayUpdateStatus() {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.updateStatus();
            }, 100);
        },
        updateStatus() {
            let context = this.getContext(),
                openedCount = 0,
                closedCount = 0;

            context.querySelectorAll('.accordion-button').forEach(el => {
                if (el.closest('.accordion-collapse.collapse:not(.show)')) {
                    closedCount++;
                } else if (el.closest('.card-collapsable.is-collapsed')) {
                    closedCount++;
                } else if (!el.classList.contains('collapsed')) {
                    openedCount++;
                } else {
                    closedCount++;
                }
            });

            context.querySelectorAll('.card-collapsable').forEach(el => {
                if (el.closest('.accordion-collapse.collapse:not(.show)')) {
                    closedCount++;
                } else if (el.closest('.card-collapsable.is-collapsed')) {
                    closedCount++;
                } else if (!el.classList.contains('is-collapsed')) {
                    openedCount++;
                } else {
                    closedCount++;
                }
            });

            this.openedCount = openedCount;
            this.closedCount = closedCount;
        },
        openAll() {
            let context = this.getContext();

            context.querySelectorAll('.accordion-button.collapsed').forEach(btn => {
                btn.click();
            });
            context.querySelectorAll('.card-collapsable.is-collapsed').forEach(btn => {
                btn.click();
            });
        },
        closeAll() {
            let context = this.getContext();

            context.querySelectorAll('.accordion-button:not(.collapsed)').forEach(btn => {
                btn.click();
            });
            context.querySelectorAll('.card-collapsable:not(.is-collapsed)').forEach(btn => {
                btn.click();
            });
        },
    }
};
</script>