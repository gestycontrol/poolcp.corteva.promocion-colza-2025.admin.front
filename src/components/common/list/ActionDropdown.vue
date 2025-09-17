<template>
    <div :class="`btn-group position-static ${cssClass}`" v-if="hasValidActions">
        <button :class="`btn btn-${size} btn-outline-${theme} text-nowrap`" type="button" v-if="firstStarredAction"
            @click="callFirstStarredAction">
            {{ firstStarredAction.label }}
        </button>
        <template v-if="hasAdditionalActions && !dropDownHidden">
            <button :class="`btn btn-${size} btn-outline-${theme} dropdown-toggle`" type="button" :id="id"
                data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                ⋮
            </button>
            <ul class="dropdown-menu" :aria-labelledby="id">
                <template :key="index" v-for="(action, index) in validActions">
                    <li v-if="action !== firstStarredAction">
                        <a class="dropdown-item" href="javascript:void(0)" @click="executeAction(action)">
                            {{ action.label }}
                        </a>
                    </li>
                </template>
            </ul>
        </template>
    </div>
</template>

<script>
import randomIdMixin from "@/mixins/common/randomIdMixin.js";

export default {
    mixins: [
        randomIdMixin,
    ],
    props: {
        size: {
            type: String,
            default: 'sm',
        },
        cssClass: {
            type: String,
            default: '',
        },
        actions: {
            type: Array,
            default: () => [],
        },
        theme: {
            type: String,
            default: 'dark',
        },
    },
    data() {
        return {
            dropDownHidden: false,
        };
    },
    methods: {
        callFirstStarredAction() {
            if (!this.firstStarredAction) return;
            this.firstStarredAction.fn();
        },
        hideDropdown() {
            this.dropDownHidden = true;
            this.$nextTick(() => {
                this.dropDownHidden = false;
            });
        },
        executeAction(action) {
            this.hideDropdown();
            action.fn();
        },
    },
    computed: {
        id() {
            return 'actions-dropdown-' + this.randomId;
        },
        validActions() {
            return this.actions.filter(action => action.if !== false);
        },
        firstStarredAction() {
            return this.validActions.find(action => action.starred === true);
        },
        hasValidActions() {
            return this.validActions.length > 0;
        },
        hasAdditionalActions() {
            return this.validActions.filter((action) => action !== this.firstStarredAction).length > 0;
        },
    },
}
</script>