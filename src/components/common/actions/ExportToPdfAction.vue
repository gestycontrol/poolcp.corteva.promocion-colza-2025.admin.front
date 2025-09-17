<template>
  <button class="btn btn-sm btn-outline-dark" type="button" @click="exportElement">
    <PdfIcon />
    {{ i18n('Export') }}
  </button>
</template>

<script>
import PdfIcon from "@/assets/svg/pdf.vue";

export default {
  components: {
    PdfIcon,
  },
  props: {
    selector: {
      type: String,
      default: 'table:not([data-no-export]), [data-exportable]'
    },
    context: {
      type: Element,
      default: null
    },
    basename: {
      type: String,
      required: true
    },
  },
  methods: {
    exportElement(e) {
      let elements = this.context;

      if (!elements) {
        let context = e.target,
          selector = this.selector;
        while (context) {
          elements = context.querySelectorAll(selector);

          if (elements && elements.length > 0) {
            break;
          }

          context = context.parentNode;
        }
      } else if (this.selector) {
        elements = this.context.querySelectorAll(this.selector);
      }

      if (!elements || elements.length === 0) return;
      this.$root.exportToPdf(elements, this.basename);
    },
  },
};
</script>