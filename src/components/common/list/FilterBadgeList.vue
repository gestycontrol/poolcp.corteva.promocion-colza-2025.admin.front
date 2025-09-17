<template>
    <div class="row mt-3" v-if="badges && badges.length > 0">
        <div class="col">
            <span class="badge bg-primary custom-pill" v-for="(badge, badgeIndex) in badges" :key="badgeIndex">
                <template v-if="Array.isArray(badge.label)">
                    <template v-for="(label, index) in badge.label" :key="index">
                        <span :class="{
                            iterationIsLast: index === badge.label.length - 1,
                            iterationIsMiddle: index < badge.label.length - 2,
                            iterationIsPreLast: index === badge.label.length - 2
                        }">
                            <FormattedValue :value="label" />
                        </span>
                    </template>
                </template>
                <template v-else>
                    <FormattedValue :value="badge.label" />
                </template>
                <button type="button" class="btn-close btn-close-white" :aria-label="i18n('Remove')"
                    @click="clear(true, badge)"></button>
            </span>
            <span class="badge bg-secondary custom-pill custom-pill-all">
                {{ i18n('Clear all filters') }}
                <button type="button" class="btn-close" :aria-label="i18n('Remove')" @click="clear(false)"></button>
            </span>
        </div>
    </div>
</template>

<script>
import FormattedValue from "@/components/common/form/FormattedValue.vue";
import { formatDate } from "@/tools/date.js";

export default {
    components: {
        FormattedValue,
    },
    props: {
        filters: {
            type: Object,
            default() {
                return {};
            },
        },
        badgeFunction: {
            type: Function,
            default: (badges, key, value) => false,
        },
    },
    methods: {
        formatDate,
        clear(hasBadge, badge) {
            if (hasBadge) {
                if (this.filters[badge.key] && Array.isArray(this.filters[badge.key])) {
                    this.filters[badge.key] = [];
                } else {
                    delete this.filters[badge.key];
                }
            } else {
                Object.keys(this.filters).forEach(key => { delete this.filters[key]; });
            }
        },
        createBadge(key, value) {
            if (key.endsWith('_at_from')) {
                return { label: `${this.i18n('From: ')}${formatDate(value)}`, key };
            } else if (key.endsWith('_at_to')) {
                return { label: `${this.i18n('To: ')}${formatDate(value)}`, key };
            } else if (key.endsWith('date_from')) {
                return { label: `${this.i18n('From: ')}${formatDate(value)}`, key };
            } else if (key.endsWith('date_to')) {
                return { label: `${this.i18n('To: ')}${formatDate(value)}`, key };
            } else if (key.endsWith('_at')) {
                return { label: formatDate(value), key };
            } else if (key === 'is_deleted' && value !== false) {
                return { label: value === 'all' ? this.i18n('All') : this.i18n('Inactive'), key };
            } else if (Array.isArray(value) && value.length > 0 && value.every(v => typeof v !== 'object')) {
                return { label: value.join(', '), key };
            } else {
                return { label: value, key };
            }
        },
        shouldSkipBadge(badges, key, value) {
            return (!value && value !== false) ||
                (Array.isArray(value) && value.length === 0) ||
                (value && (typeof value === 'object') && Object.keys(value).length === 0) ||
                this.badgeFunction(badges, key, value);
        }
    },
    computed: {
        badges() {
            const badges = [];

            Object.keys(this.filters).forEach((key) => {
                const value = this.filters[key];

                if (!this.shouldSkipBadge(badges, key, value)) {
                    if (key !== 'orderBy') {
                        badges.push(this.createBadge(key, value));
                    }
                }
            });

            return badges;
        },
    },
};
</script>