<template>
  <Modal ref="modal" modalClass="modal-sm">
    <template #title>
      {{ i18n('Export') }}
    </template>

    <div class="row g-2">
      <div class="col d-flex align-items-center justify-content-center">
        <ExportToExcelAction :selector="selector" :context="context" :basename="basename" />
        <ExportToPdfAction :selector="selector" :context="context" :basename="basename" class="ms-2" />
      </div>
    </div>

    <template #footer>
      <div class="row">
        <div class="col text-end">
          <button type="button" class="btn btn-danger" @click="hide">{{ i18n('Cancel') }}</button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/common/layout/Modal.vue";
import ExportToExcelAction from "@/components/common/actions/ExportToExcelAction.vue";
import ExportToPdfAction from "@/components/common/actions/ExportToPdfAction.vue";

export default {
  components: {
    Modal,
    ExportToExcelAction,
    ExportToPdfAction,
  },
  props: {
    selector: String,
    context: Element,
    basename: String,
  },
  data() {
    return {};
  },
  methods: {
    show() {
      this.submitted = false;
      this.$refs['modal'].show();
    },
    hide() {
      this.$refs['modal'].hide();
    },
  }
}
</script>