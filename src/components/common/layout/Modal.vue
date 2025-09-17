<template>
    <template v-if="isShow">
        <div :style="{ zIndex: zIndex }" :class="`modal fade show text-start ${modalClass}`" :id="modalId" tabindex="-1"
            :aria-labelledby="modalTitleId" style="display: block;">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div :class="`modal-header ${headerClass}`" v-if="showHeader">
                        <h5 :class="`modal-title ${titleClass}`" v-if="showTitle" :id="modalTitleId">
                            <slot name="title"></slot>
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" :aria-label="i18n('Close')"
                            @click="hideOrDelegate"></button>
                    </div>
                    <div :class="`modal-body ${bodyClass}`" v-if="showBody">
                        <form action="javascript:void(0)" @submit="submit">
                            <div class="container-fluid pe-0 ps-0">
                                <slot></slot>
                            </div>
                            <input type="submit" name="submit" value="submit" class="visually-hidden"
                                :id="formHiddenSubmitId">
                        </form>
                    </div>
                    <div :class="`modal-footer ${footerClass}`" v-if="showFooter">
                        <form class="w-100" action="javascript:void(0)" @submit="triggerSubmit">
                            <slot name="footer"></slot>
                        </form>
                    </div>
                </div>
            </div>

        </div>
        <div :style="{ zIndex: zIndex - 1 }" :id="modalBackdropId" class="modal-backdrop fade show"
            :class="modalBackdropClass" @click.stop="hideOrDelegate">
        </div>
    </template>
</template>
<script>
import randomIdMixin from "@/mixins/common/randomIdMixin.js";
const zIndexCounter = {
    zIndex: 1051,
};

export default {
    mixins: [
        randomIdMixin,
    ],
    props: {
        modalClass: {
            type: String,
            default: '',
        },
        headerClass: {
            type: String,
            default: '',
        },
        showHeader: {
            type: Boolean,
            default: true,
        },
        titleClass: {
            type: String,
            default: '',
        },
        showTitle: {
            type: Boolean,
            default: true,
        },
        bodyClass: {
            type: String,
            default: '',
        },
        showBody: {
            type: Boolean,
            default: true,
        },
        footerClass: {
            type: String,
            default: '',
        },
        showFooter: {
            type: Boolean,
            default: true,
        },
        modalBackdropClass: {
            type: String,
            default: '',
        },
        hideDelegate: Function,
    },

    computed: {
        modalId() {
            return 'modal-' + this.randomId;
        },
        modalTitleId() {
            return 'modal-title-' + this.randomId;
        },
        modalBackdropId() {
            return 'modal-backdrop-' + this.randomId;
        },
        formHiddenSubmitId() {
            return 'form-' + this.randomId;
        },
    },
    data() {
        return {
            zIndex: 1050,
            isShow: false,
            options: {},
        };
    },
    unmounted() {
        this.fixBodyClass();
    },
    watch: {
        isShow() {
            this.fixBodyClass();
        }
    },
    emits: [
        'shown',
        'hidden',
        'submit',
    ],
    methods: {
        scrollTop(pos) {
            if (!pos) pos = 0;
            document.querySelector(`#${this.modalId} .modal-body`).scrollTop = pos;
        },
        fixBodyClass() {
            let checkOpenModals = (count) => {
                let visibleModals = typeof (window) !== 'undefined'
                    && window?.document
                    && !!document.querySelector('.modal.show');

                if (visibleModals) {
                    document.body.classList.add('modal-open');
                } else {
                    document.body.classList.remove('modal-open');

                    if (count == 1) {
                        this.exitFullscreen();
                    }
                }

                if (!count ||
                    count < 5) {
                    setTimeout(() => {
                        checkOpenModals((count || 0) + 1);
                    }, 250);
                }
            };

            this.$nextTick(() => {
                checkOpenModals();

                this.$nextTick(() => {
                    if (this.isShow) {
                        this.shown();
                    } else {
                        this.hidden();
                    }
                });
            });
        },
        triggerSubmit() {
            let submit = document.getElementById(this.formHiddenSubmitId);

            if (submit) {
                submit.click();
            }
        },
        fullscreen(elem) {
            if (!elem) return;
            if (document.fullscreenElement) return;

            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        },
        exitFullscreen() {
            if (!document.fullscreenElement) return;

            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                /* IE11 */
                document.msExitFullscreen();
            }
        },
        shown() {
            this.$emit('shown');
            let focus = document.querySelector(`#${this.modalId} [data-custom-autofocus="on"]`);
            if (focus) focus.focus();

            if (this.options.fullscreen) {
                this.$nextTick(() => {
                    if (this.isShow) {
                        this.fullscreen(document.body);
                    }
                });
            }
        },
        hidden() {
            this.$emit('hidden');
        },
        submit() {
            this.$emit('submit');
        },
        show(options) {
            if (!options) {
                options = {};
            }
            this.options = options;
            this.zIndex = zIndexCounter.zIndex++;
            this.isShow = true;
        },
        hide() {
            this.isShow = false;
        },
        hideOrDelegate() {
            if (this.hideDelegate) {
                this.hideDelegate();
            } else {
                this.hide();
            }
        },
        getId() {
            return this.modalId;
        },
    },
};
</script>