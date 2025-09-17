import Field from "@/components/common/form/Field.vue";
import SummarizedModalItem from "@/components/common/layout/SummarizedModalItem.vue";
import objectVModelMixin from "@/mixins/common/objectVModelMixin.js";

export default {
    components: {
        SummarizedModalItem,
        Field,
    },
    props: {
        readonly: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    mixins: [
        objectVModelMixin,
    ],
    emits: [
        'detailShown',
        'detailHidden',
        'detailSubmitted',
    ],
    methods: {
        showDetail() {
            if (!this.$refs['summarizedModalItem']) return;
            this.$refs['summarizedModalItem'].showDetail();
        },
        hideDetail() {
            if (!this.$refs['summarizedModalItem']) return;
            this.$refs['summarizedModalItem'].hideDetail();
        },
        detailShown() {
            this.$emit('detailShown');
        },
        detailHidden() {
            this.$emit('detailHidden');
        },
        detailSubmitted() {
            this.hideDetail();
            this.$emit('detailSubmitted', this.formData);
        },
    }
};