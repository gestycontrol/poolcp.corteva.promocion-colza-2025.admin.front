import api from "@/api.js";
import {
    duplicate,
    flattenUrlObject,
} from "@/tools/object.js";

export default {
    components: {
    },
    data() {
        return {
            listPropertyName: 'elements',
            apiResource: 'elements',
            filters: {},
            loadTimeout: null,
            loading: true,
            pagination: {
                disabled: false,
                requestId: 0,
                limit: 10,
                records: [],
                loadPages: 1,
                nextPageURI: null,
                currentPage: 1,
                total: null,
                maxPageLinks: 5,
                singlePage: false,
            },
        }
    },
    watch: {
        paramsUrlEncoded() {
            this.pagination.loadPages = 1;
            this.reload();
        },
    },
    computed: {
        params() {
            let params = duplicate(this.filters);

            if (this.extendApiParams) {
                this.extendApiParams(params);
            }

            params.limit = this.pagination.limit;
            flattenUrlObject(params);

            return params;
        },
        paramsUrlEncoded() {
            return new URLSearchParams(this.params).toString();
        }
    },
    methods: {
        load(force) {
            clearTimeout(this.loadTimeout);

            if (this.pagination.disabled) {
                return;
            }

            this.loading = true;
            this.pagination.requestId++;

            if (!force) {
                this.loadTimeout = setTimeout(() => {
                    this.load(true);
                }, 250);
                return;
            }

            this.pagination.records = [];
            this.pagination.currentPage = 1;
            this.loadPages(this.pagination.requestId, this.apiResource, this.params);
        },
        loadPages(requestId, uri, params) {
            api.getWithHeaders(uri, params).then((result) => {
                if (requestId != this.pagination.requestId) {
                    return;
                }

                const items = result.data,
                    headers = result.headers;

                this.pagination.records = [
                    ...(this.pagination.singlePage ? [] : this.pagination.records),
                    ...items,
                ];

                this.pagination.nextPageURI = headers.get('X-PAGINATE-NEXT');
                this.pagination.total = headers.get('X-PAGINATE-COUNT');

                if (!this.pagination.singlePage
                    && this.pagination.currentPage < this.pagination.loadPages
                    && this.pagination.nextPageURI) {
                    this.pagination.currentPage++;
                    this.loadPages(requestId, this.pagination.nextPageURI);
                    return;
                } else {
                    this.pagination.loadPages = this.pagination.currentPage;
                }

                this[this.listPropertyName] = [...this.pagination.records];
                this.loading = false;

                if (this.afterLoad) {
                    this.afterLoad();
                }
            });
        },
        nextPage() {
            this.loading = true;
            this.pagination.currentPage++;
            this.pagination.loadPages = this.pagination.currentPage;
            this.loadPages(++this.pagination.requestId, this.pagination.nextPageURI);
        },
        goToPage(page, limit) {
            if (this.pagination.limit == limit
                && this.pagination.currentPage == page) {
                return;
            }
            this.loading = true;
            this.pagination.limit = limit;
            this.pagination.currentPage = page;
            this.pagination.loadPages = this.pagination.currentPage;
            this.pagination.singlePage = true;
            this.loadPages(++this.pagination.requestId, `${this.apiResource}${this.apiResource.includes('?') ? '&' : '?'}page=${page}`, this.params);
        },
        reload() {
            this.load();
        },
    },
};
