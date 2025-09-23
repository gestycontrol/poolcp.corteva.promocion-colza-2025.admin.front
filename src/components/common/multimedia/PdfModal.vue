<template>
    <Modal @shown="shown" @hidden="hidden" ref="modal" :modalClass="modalClass" formClass="h-100"
        formContainerClass="h-100" :modalBackdropClass="modalBackdropClass">
        <template #title>
            <slot name="title">{{ pdf.name }}</slot>
        </template>
        <div class="position-relative h-100">
            <div :class="{ border: !this.fullscreen, 'fullscreen-pdf': this.fullscreen }" class="h-100 pdf-container">
                <div class="pdf-viewer-container h-100">
                    <iframe :src="pdfUrl" class="w-100 h-100 border-0" @load="onPdfLoaded"
                        :title="pdf.name || 'PDF Preview'">
                    </iframe>
                </div>
            </div>
        </div>
        <template #footer v-if="buttons">
            <div class="row">
                <div class="col text-start me-auto">
                    <button type="button" @click="hide" class="btn btn-outline-dark btn-sm me-2">
                        {{ i18n('Close') }}
                    </button>
                </div>
                <div class="col text-end">
                    <slot name="actions"></slot>
                    <button type="button" @click="download" class="btn btn-dark btn-sm ms-1">
                        {{ i18n('Download') }}
                    </button>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script>
import Modal from "@/components/common/layout/Modal.vue";
import LeftArrowIcon from "@/assets/svg/left-arrow.vue";
import RightArrowIcon from "@/assets/svg/right-arrow.vue";

export default {
    components: {
        Modal,
        LeftArrowIcon,
        RightArrowIcon,
    },
    props: {
        pdf: {
            type: Object,
            default() {
                return {};
            },
        },
        downloadAction: {
            type: Function,
        },
        navigation: Boolean,
        buttons: {
            type: Boolean,
            default: true
        },
        fullscreen: Boolean,
    },
    emits: [
        'shown',
        'hidden',
        'next',
        'prev',
        'loaded',
    ],
    data() {
        return {
            zoomLevel: 1,
            currentPage: 1,
            totalPages: 1,
            pdfLoaded: false,
        };
    },
    computed: {
        modalBackdropClass() {
            if (this.fullscreen) return 'modal-pdf-backdrop modal-pdf-backdrop-fullscreen';
            return 'modal-pdf-backdrop';
        },
        modalClass() {
            if (this.fullscreen) return 'modal-pdf modal-fullscreen';
            return 'modal-pdf modal-xl modal-x2l';
        },
        pdfUrl() {
            if (!this.pdf.url) return '';

            // Add zoom and page parameters to the PDF URL if supported
            const url = new URL(this.pdf.url);
            url.searchParams.set('zoom', Math.round(this.zoomLevel * 100));
            if (this.currentPage > 1) {
                url.searchParams.set('page', this.currentPage);
            }
            return url.toString();
        },
    },
    methods: {
        inIframe() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        },
        download() {
            if (this.downloadAction) {
                this.downloadAction();
            } else {
                window.open(this.pdf.url);
            }
        },
        show() {
            this.$refs['modal'].show({
                fullscreen: this.inIframe()
            });
        },
        hide() {
            this.$refs['modal'].hide();
        },
        shown() {
            this.$emit('shown');
        },
        hidden() {
            this.$emit('hidden');
        },
        onPdfLoaded() {
            this.pdfLoaded = true;
            this.$emit('loaded');
        },
        zoomIn() {
            if (this.zoomLevel < 3) {
                this.zoomLevel = Math.min(3, this.zoomLevel + 0.25);
            }
        },
        zoomOut() {
            if (this.zoomLevel > 0.5) {
                this.zoomLevel = Math.max(0.5, this.zoomLevel - 0.25);
            }
        },
        resetZoom() {
            this.zoomLevel = 1;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
    }
};
</script>
<style scoped>
.pdf-container {
    background: #f8f9fa;
    border-radius: 0.375rem;
    overflow: hidden;
}

.pdf-controls {
    background: #fff;
    padding: 0.5rem;
    border-bottom: 1px solid #dee2e6;
}

.pdf-viewer-container {
    background: #fff;
    position: relative;
}

.fullscreen-pdf {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background: #000;
}

.fullscreen-pdf .pdf-viewer-container {
    height: 100vh !important;
}

.modal-pdf-backdrop {
    background-color: rgba(0, 0, 0, 0.8);
}

.modal-pdf-backdrop-fullscreen {
    background-color: rgba(0, 0, 0, 0.95);
}

.multimedia-navigation {
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
}

.multimedia-navigation .prev {
    left: 10px;
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 10px;
    border-radius: 50%;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
}

.multimedia-navigation .next {
    right: 10px;
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 10px;
    border-radius: 50%;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
}

.multimedia-navigation a:hover {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    text-decoration: none;
}
</style>
