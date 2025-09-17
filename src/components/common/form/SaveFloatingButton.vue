<template>
    <div>
        <div class="p-5"></div>
        <div class="custom-fixed-bottom">
            <div class="container-fluid">
                <div class="row">
                    <div class="col">
                        <button type="button" class="w-100 btn btn-outline-primary d-block"
                            :disabled="$root.state.saving" @click="$emit('save')">
                            <span class="spinner-border spinner-border-sm" role="status" v-if="$root.state.saving">
                                <span class="visually-hidden">{{ i18n('Saving...') }}</span>
                            </span>
                            <span class="">{{ $root.state.savingStatus }}</span>
                        </button>
                    </div>
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    emits: ['save'],
};
</script>