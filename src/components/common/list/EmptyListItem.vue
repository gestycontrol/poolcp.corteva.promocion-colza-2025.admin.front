<template>
    <div :class="containerClass" v-if="!colspan" data-no-export>
        <div class="card">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-12 text-truncate text-center">
                        <template v-if="!loading">
                            {{ label }}
                        </template>

                        <template v-else>
                            <div class="p-1 text-center">
                                <span class="spinner-border spinner-border-sm" role="status">
                                    <span class="visually-hidden">
                                        {{ i18n('Loading...') }}
                                    </span>
                                </span>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <tr v-if="colspan" data-no-export>
        <td :colspan="colspan" class="text-center">
            <template v-if="!loading">
                {{ label }}
            </template>

            <template v-else>
                <div class="p-1 text-center">
                    <span class="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden">
                            {{ i18n('Loading...') }}
                        </span>
                    </span>
                </div>
            </template>
        </td>
    </tr>
</template>

<script>
import { i18n } from "@/tools/i18n.js";

export default {
    props: {
        colspan: Number,
        loading: Boolean,
        label: {
            type: String,
            default: i18n('No results.'),
        },
        containerClass: {
            type: String,
            default: '',
        },
    },
};
</script>