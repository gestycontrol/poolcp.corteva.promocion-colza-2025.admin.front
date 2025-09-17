<template>
  <router-view></router-view>
  <DangerModal :message="confirm.message" ref="DangerModal" @confirmed="_confirmAction" />
  <SuccessModal ref="SuccessModal" @hidden="successModalResolve" />
  <ErrorModal ref="ErrorModal" @hidden="errorModalResolve" />
  <LoadingOverlay ref="LoadingOverlay" v-if="showLoadingOverlay" />
</template>

<script>
import $env from '@/tools/environment.js';
const appName = $env('VITE_APP_NAME');
const defaultCompanyAlias = $env('VITE_DEFAULT_COMPANY_ALIAS');

import DangerModal from "@/components/common/confirm/DangerModal.vue";
import SuccessModal from "@/components/common/confirm/SuccessModal.vue";
import ErrorModal from "@/components/common/confirm/ErrorModal.vue";
import LoadingOverlay from "@/components/common/view/LoadingOverlay.vue";
import {
  i18n,
  switchLang,
  getCurrentLang,
} from "@/tools/i18n.js";
import { exportToExcel, } from "@/tools/excel.js";
import { exportToPdf, } from "@/tools/pdf.js";
import { setCookie, getCookie, } from "@/tools/cookie.js";
import api from "@/api.js";

export default {
  components: {
    DangerModal,
    SuccessModal,
    ErrorModal,
    LoadingOverlay,
  },
  created() {
    window.addEventListener('beforeunload', (event) => {
      if (!this.state.saved) {
        event.returnValue = i18n('Exit without saving? Changes will be lost.');
      }
    });
    this.loadFeatures();
  },
  data() {
    return {
      pageTitle: '',
      companyName: defaultCompanyAlias,
      confirm: {
        action: null,
        message: null,
      },
      saveAction: null,
      reloadAction: null,
      loggedUser: {},
      config: {},
      state: {
        loading: false,
        saving: false,
        savingError: '',
        saved: true,
        savingStatus: i18n('Saved'),
      },
      showLoadingOverlay: false,
      successModalResolve: null,
      errorModalResolve: null,
      features: {},
    };
  },
  mounted() {
    window.addEventListener('resize', this.fixTableHeight);
  },
  methods: {
    i18n,
    switchLang(lang) {
      api.auth().then(user => {
        if (user.loggedIn) {
          api.updateUserLanguage(lang).then(() => {
            switchLang(lang);
          });
        } else {
          switchLang(lang);
        }
      });
    },
    getCurrentLang,
    setCompanyName(company) {
      this.companyName = company || defaultCompanyAlias;
      this.setDocumentTitle();
    },
    setPageTitle(title) {
      this.pageTitle = title;
      this.setDocumentTitle();
    },
    setDocumentTitle() {
      window.document.title = (this.pageTitle ? this.pageTitle + ' | ' : '') + appName + (this.companyName ? ' | ' +
        this.companyName : '');
    },
    save() {
      if (!this.saveAction) return;
      this.saveAction.queue();
    },
    reload() {
      if (!this.reloadAction) return;
      this.reloadAction();
    },
    toggleCard(event) {
      let is_open = event.target.closest('.card-header').classList.contains('is-collapsed');
      event.target.closest('.card-header').classList.toggle('is-collapsed')

      let newEvent;

      if (is_open) {
        newEvent = new CustomEvent('shown.bs.collapse', {
          bubbles: true,
        });
      } else {
        newEvent = new CustomEvent('hidden.bs.collapse', {
          bubbles: true,
        });
      }

      this.$nextTick(() => {
        event.target.dispatchEvent(newEvent);
      });
    },
    exportToPdf,
    exportToExcel,
    _confirmAction() {
      if (this.confirm.action) {
        this.confirm.action();
      }
    },
    requestConfirmation(message, onConfirm) {
      onConfirm = onConfirm || function () { };

      return new Promise((resolve, reject) => {
        this.confirm.message = message;
        this.confirm.action = () => {
          onConfirm();
          resolve();
        };

        if (!this.$refs['DangerModal']) return;
        this.$refs['DangerModal'].show();
      });
    },
    showLoading() {
      this.showLoadingOverlay = true;
    },
    hideLoading() {
      this.showLoadingOverlay = false;
    },
    setLoading(loading) {
      this.state.loading = loading;
    },
    setSaving(saving) {
      this.state.saving = saving;

      if (this.state.saving) {
        this.state.saved = false;
        this.state.savingError = '';
        this.state.savingStatus = i18n('Saving...');
      }
    },
    setSavingError(savingError) {
      this.state.savingError = savingError;

      if (this.state.savingError) {
        this.state.saved = false;
        this.state.savingStatus = i18n('Error while saving');
      }
    },
    setSaved(saved) {
      this.state.saved = saved;

      if (this.state.saved) {
        this.state.saving = false;
        this.state.savingError = '';
        this.state.savingStatus = i18n('Saved');
      } else {
        this.state.savingStatus = i18n('Unsaved changes');
      }
    },
    setCookie,
    getCookie,
    showSuccessModal(title, text) {
      return new Promise((resolve) => {
        this.$refs['SuccessModal'].show(title, text);
        this.successModalResolve = resolve;
      });
    },
    showErrorModal(title, text) {
      return new Promise((resolve) => {
        this.$refs['ErrorModal'].show(title, text);
        this.errorModalResolve = resolve;
      });
    },
    loadFeatures() {
      return api.getFeatures().then((response) => {
        this.features = response;
      });
    },
    fixTableHeight() {
      [...document.querySelectorAll('.table-onscreen')].forEach((table) => {
        let full_table_size = table.scrollHeight;
        let table_absolute_bottom = table.getBoundingClientRect().top + full_table_size;
        let window_bottom = window.innerHeight;

        let table_max_height_new = full_table_size - (table_absolute_bottom - window_bottom + 20);

        if (table_max_height_new < full_table_size) {
          table.style.maxHeight = `${table_max_height_new}px`;
        } else {
          table.style.maxHeight = 'none';
        }
      });
    },
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/app.scss";

#app[data-local-backend-url]:after {
  content: "Backend: " attr(data-local-backend-url);
  text-align: center;
  padding: 2rem;
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: rgba(255, 0, 0, 0.4);
  z-index: 10000;
  transform: rotate(-45deg);
  font-family: monospace;
}
</style>