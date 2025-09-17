<template>
  <button :class="cssClass" type="button" @click="exportElement">
    <ExcelIcon />
    {{ i18n('Export') }}
  </button>
</template>

<script>
import ExcelIcon from "@/assets/svg/excel.vue";

export default {
  components: {
    ExcelIcon,
  },
  props: {
    selector: {
      type: String,
      default: 'table:not([data-no-export]), [data-exportable]',
    },
    context: {
      type: Element,
      default: null,
    },
    basename: {
      type: String,
    },
    cssClass: {
      type: String,
      default: 'btn btn-sm btn-outline-dark',
    },
  },
  methods: {
    exportElement(e) {
      let element = this.context;

      if (!element) {
        let context = e.target,
          selector = this.selector;

        if (!selector) selector = 'table:not([data-no-export]), [data-exportable]';

        while (context) {
          element = context.querySelector(selector);

          if (element) {
            break;
          }

          context = context.parentNode;
        }
      } else if (this.selector) {
        element = this.context.querySelector(this.selector);
      }

      if (!element) return;

      this.$root.exportToExcel(element, this.basename);
    },
  },
};
</script>