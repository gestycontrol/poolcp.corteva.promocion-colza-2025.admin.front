<template>
    <span :class="cssClass" v-if="!fullHtml">
        <template v-if="prefix">
            {{ prefix }}
        </template>
        <template v-if="displayAs === 'translation_key'">
            {{ i18n(providedValue.translation_key) }}
        </template>
        <template v-else-if="displayAs === 'name'">
            {{ providedValue.name }}
        </template>
        <template v-else-if="displayAs === 'title'">
            {{ providedValue.title }}
        </template>
        <template v-else-if="displayAs === 'full_name'">
            {{ providedValue.first_name }} {{ providedValue.last_name }}
        </template>
        <template v-else-if="displayAs === 'alias'">
            {{ providedValue.alias }}
        </template>
        <template v-else-if="displayAs === 'label'">
            {{ providedValue.label }}
        </template>
        <template v-else-if="displayAs === 'formatted'">
            {{ providedValue.formatted }}
        </template>
        <template v-else-if="displayAs === 'code'">
            {{ providedValue.code }}
        </template>
        <template v-else-if="displayAs === 'id'">
            {{ providedValue.id }}
        </template>
        <template v-else-if="displayAs === 'yes'">
            {{ i18n('Yes') }}
        </template>
        <template v-else-if="displayAs === 'no'">
            {{ i18n('No') }}
        </template>
        <template v-else-if="displayAs === 'nl2br'">
            <p class="text-nl2br">{{ providedValue }}</p>
        </template>
        <template v-else-if="displayAs === 'exact'">
            {{ formattedValue }}
        </template>
        <template v-else>
            <span class="text-nowrap">
                <span class="text-muted small">--</span>
                &nbsp;
            </span>
        </template>
        <template v-if="suffix">
            {{ suffix }}
        </template>
    </span>
    <template v-else>
        <span :class="cssClass" v-dompurify-html="fullHtml"></span>
    </template>
</template>

<script>
import { formatNumberES } from '@/tools/number.js';
import { formatDate, formatTime } from '@/tools/date.js';
import { encode } from 'html-entities';

export default {
    props: {
        modelValue: {},
        value: {},
        format: {
            type: String,
        },
        formatClass: {
            type: [String, Function],
        },
        step: {
            type: String,
        },
        resettable: {
            type: Boolean,
            default: false,
        },
        label: {},
        allowZero: {
            type: Boolean,
            default: false,
        },
        suffix: String,
        prefix: String,
    },
    computed: {
        providedValue() {
            return this.value !== undefined ? this.value : this.modelValue;
        },
        computedFormat() {
            if ((this.format || '').startsWith('decimal-')) {
                return 'decimal';
            }

            const formatsByStep = {
                '1': 'int',
                '0.1': 'decimal',
                '0.01': 'decimal',
            };

            return this.format || formatsByStep[this.step || ''] || '';
        },
        computedDecimalPrecision() {
            if (this.computedFormat === 'decimal'
                && (this.format || '').startsWith('decimal-')
            ) {
                return parseInt(this.format.substring(8));
            }

            return 2;
        },
        computedFormatIsCurrency() {
            return this.computedFormat && (this.computedFormat.startsWith('currency-') || this.computedFormat.endsWith('-currency'));
        },
        computedFormatCurrencySymbolBefore() {
            if (!this.computedFormatIsCurrency) return '';
            if (this.computedFormat.endsWith('-currency')) return this.computedFormat.substring(0, this.computedFormat.length - 9);

            return '';
        },
        computedFormatCurrencySymbolAfter() {
            if (!this.computedFormatIsCurrency) return '';
            if (this.computedFormat.startsWith('currency-')) return this.computedFormat.substring(9);

            return '';
        },
        cssClass() {
            if (typeof this.formatClass === 'function') {
                return this.formatClass(this.providedValue);
            }

            return this.formatClass;
        },
        formattedValue() {
            if (this.isEmptyValue(this.providedValue)) {
                return '';
            }

            let value = this.providedValue;
            let format = this.computedFormatIsCurrency ? 'currency' : this.computedFormat;

            const formattersByFormat = {
                'euro': this.formatEuro,
                'inteuro': this.formatIntEuro,
                'currency': this.formatCurrency,
                'int': this.formatInt,
                'decimal': this.formatDecimal,
                'percent': this.formatPercent,
                'boolean': this.formatBoolean,
                'date': this.formatDate,
                'time': this.formatTime,
                'datetime': this.formatDateTime,
                'email': this.formatEmailLink,
                'tel': this.formatTelLink,
            };

            let result = formattersByFormat[format] ? formattersByFormat[format](value) : value;

            if (format === 'currency') {
                result = this.computedFormatCurrencySymbolBefore + result + this.computedFormatCurrencySymbolAfter;
            }

            return result;
        },
        formattedUrlDisplayValue() {
            if (!this.formattedValue) return this.formattedValue;
            if (['email', 'tel'].includes(this.format)) return this.providedValue;
            if (this.formattedValue.startsWith('mailto:')) return this.formattedValue.substr(7);
            if (this.formattedValue.startsWith('tel:')) return this.formattedValue.substr(4);

            return this.formattedValue;
        },
        formattedUrlTarget() {
            if (!this.formattedValue) return '_self';
            if (this.formattedValue.toLowerCase().startsWith('http://')) return '_blank';
            if (this.formattedValue.toLowerCase().startsWith('https://')) return '_blank';
            if (this.formattedValue.toLowerCase().startsWith('ftp://')) return '_blank';
            if (this.formattedValue.toLowerCase().startsWith('ftps://')) return '_blank';

            return '_self';
        },
        displayAs() {
            const options = [
                ['empty', this.isEmptyValue(this.providedValue)],
                ['translation_key', this.providedValue?.translation_key],
                ['name', this.providedValue?.name],
                ['full_name', (this.providedValue?.first_name !== undefined && this.providedValue?.last_name !== undefined) && (this.providedValue?.first_name || this.providedValue?.last_name)],
                ['alias', this.providedValue?.alias],
                ['label', this.providedValue?.label],
                ['formatted', this.providedValue?.formatted !== undefined],
                ['title', this.providedValue?.title],
                ['code', this.providedValue?.code],
                ['empty', this.providedValue === undefined],
                ['id', this.providedValue?.id],
                ['yes', this.providedValue === true],
                ['no', this.providedValue === false],
                ['url', this.providedValue && ['url', 'link', 'email', 'tel'].includes(this.format)],
                ['nl2br', this.providedValue && this.format === 'nl2br'],
                ['img', this.providedValue && this.format === 'img'],
            ];

            let option = options.filter((opt) => opt[1])[0];
            option = option?.[0] || 'exact';

            if (option === 'formatted' && this.isEmptyValue(this.providedValue?.formatted)) {
                option = 'empty';
            }

            return option;
        },
        fullHtml() {
            let fullHtml = null;

            if (this.displayAs === 'url') {
                const urlClass = this.formattedValue === this.formattedUrlDisplayValue ? 'text-break' : '';

                fullHtml = `<a href="${encode(this.formattedValue)}" target="${encode(this.formattedUrlTarget)}" rel="noopener" class="${encode(urlClass)}">${encode(this.formattedUrlDisplayValue)}</a>`;
            } else if (this.displayAs === 'img') {
                fullHtml = `<a href="${encode(this.formattedValue)}" class="d-inline-block pt-1 me-1" target="_blank" rel="noopener"><img src="${encode(this.formattedValue)}" alt="" class="w-100 border-0" /></a>`;
            }

            if (fullHtml) {
                if (this.prefix) {
                    fullHtml = encode(this.prefix) + fullHtml;
                }

                if (this.suffix) {
                    fullHtml = fullHtml + encode(this.suffix);
                }
            }

            return fullHtml;
        }
    },
    methods: {
        isEmptyValue(value) {
            return value === null || value === undefined || value === '';
        },
        formatEuro(value) {
            return formatNumberES(value, 2) + '€';
        },
        formatIntEuro(value) {
            return formatNumberES(value, 0) + '€';
        },
        formatCurrency(value) {
            return formatNumberES(value, 2);
        },
        formatInt(value) {
            return formatNumberES(value, 0);
        },
        formatDecimal(value) {
            return formatNumberES(value, this.computedDecimalPrecision);
        },
        formatPercent(value) {
            return `${formatNumberES(value, 2)}%`;
        },
        formatBoolean(value) {
            return value ? this.i18n('Yes') : this.i18n('No');
        },
        formatDate(value) {
            return formatDate(value);
        },
        formatTime(value) {
            return formatTime(value);
        },
        formatDateTime(value) {
            return `${formatDate(value)} ${formatTime(value)}`;
        },
        formatEmailLink(value) {
            return `mailto:${value}`;

        },
        formatTelLink(value) {
            let tel = value.split('+').join('00');
            ['-', '.', ' ', '/'].forEach(char => {
                tel = tel.split(char).join('');
            });

            return `tel:${tel}`;
        },
    }
};
</script>
<style scoped>
.text-nl2br {
    white-space: pre-line;
}
</style>