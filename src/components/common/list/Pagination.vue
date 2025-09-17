<template>
    <div class="position-relative" :class="{ 'opacity-50': loading }">
        <div class="row" :class="cssClass">
            <div class="col-lg-4">
                <div class="d-flex align-items-center">
                    <DropDownField :modelValue="pagination.limit" @update:modelValue="goToPage(1, $event)"
                        :label="i18n('%s item(s) per page')" :list="limitOptions" />
                </div>
            </div>
            <div class="col-lg-8">
                <div class="d-flex">
                    <ul class="ms-auto pagination">
                        <li class="page-item page-item-icon">
                            <a class="page-link" :class="{ disabled: pagination.currentPage === 1 }" role="button"
                                @click.prevent="goToPage(pagination.currentPage - 1)">
                                <LeftArrowIcon />
                            </a>
                        </li>
                        <li class="page-item" v-for="page in pages" :key="page"
                            :class="{ active: page === pagination.currentPage, disabled: page === '…' }">
                            <a class="page-link" role="button" v-if="page !== '…'" @click.prevent="goToPage(page)">
                                {{ page }}
                            </a>
                            <span class="page-link" v-else>…</span>
                        </li>
                        <li class="page-item page-item-icon">
                            <a class="page-link" :class="{ disabled: pagination.currentPage >= totalPages }"
                                role="button" @click.prevent="goToPage(pagination.currentPage + 1)">
                                <RightArrowIcon />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="position-absolute h-100 w-100 top-0" @click.stop v-if="loading"></div>
    </div>
</template>

<script>
import DropDownField from '@/components/common/form/DropDownField.vue';
import LeftArrowIcon from '@/assets/svg/left-arrow.vue';
import RightArrowIcon from '@/assets/svg/right-arrow.vue';
export default {
    components: {
        DropDownField,
        LeftArrowIcon,
        RightArrowIcon,
    },
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        pagination: {
            type: Object,
            required: true
        },
        cssClass: {
            type: String,
            default: ''
        },
    },
    emits: ['goToPage'],
    methods: {
        goToPage(page, limit) {
            limit = limit || this.pagination.limit;
            this.$emit('goToPage', page, limit);
        },
        amendPages(pages) {
            pages = pages.sort((a, b) => a - b);
            const pagesWithEllipsis = [];

            for (let i = 0; i < pages.length; i++) {
                pagesWithEllipsis.push(pages[i]);

                if (pages[i] + 1 !== pages[i + 1]
                    && i < pages.length - 1
                ) {
                    pagesWithEllipsis.push('…');
                }
            }

            return pagesWithEllipsis;
        },
    },
    computed: {
        limitOptions() {
            let limitOptions = [10, 25, 50, 100];

            if (this.pagination.limitOptions) {
                limitOptions = [...this.pagination.limitOptions];
            }

            if (!limitOptions.includes(this.pagination.limit)) {
                limitOptions.push(this.pagination.limit);
            }

            return limitOptions.sort((a, b) => a - b).map((limit) => ({
                value: limit,
                label: limit.toString(),
            }));
        },
        totalPages() {
            return Math.ceil(this.pagination.total / this.pagination.limit);
        },
        pages() {
            if (!this.pagination.total) {
                return [];
            }

            const pages = [];

            pages.push(1);

            if (!pages.includes(this.pagination.currentPage)) {
                pages.push(this.pagination.currentPage);
            }

            if (!pages.includes(this.totalPages)) {
                pages.push(this.totalPages);
            }

            for (let i = 1; i <= this.pagination.maxPageLinks; i++) {
                [1, -1].forEach((offset) => {
                    const page = this.pagination.currentPage + offset * i;

                    if (page > 1
                        && page < this.totalPages
                        && !pages.includes(page)
                        && pages.length < this.pagination.maxPageLinks
                    ) {
                        pages.push(page);
                    }
                });
            }

            return this.amendPages(pages);
        },
    },
};
</script>
<style scoped>
.page-item-icon {
    width: 2rem;
}

.page-item-icon a {
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    text-align: center;
}

.page-item.disabled {
    pointer-events: none;
    cursor: default;
}
</style>