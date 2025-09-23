<template>
  <ApiViewWrapper :notFound="notFound" :allowAnonymous="false">
    <DefaultLayout>
      <h1 class="h5 mt-2">
        <span class="small text-muted">{{ i18n('Account') }}</span>
        {{ account ? account.name : '' }}
      </h1>

      <SectionManager sectionType="none">
        <SectionItem>
          <template #title>
            {{ i18n('Main Information') }}
          </template>
          <div class="bg-white p-2 border">
            <div class="row g-2 align-items-center">
              <div class="col">
                <h2 class="h5">
                  {{ i18n('Main Information') }}
                </h2>
              </div>
              <div class="col text-end">
                <ActionDropdown ref="actions" :actions="actions" />
              </div>
            </div>
            <div class="row g-2">
              <div class="col-12 col-sm-6 col-lg-4">
                <FieldReadonly :value="account.name" :label="i18n('Name')" />
              </div>
              <div class="col-12 col-sm-6 col-lg-4">
                <FieldReadonly :value="account.email" :label="i18n('Email')" />
              </div>
              <div class="col-12 col-sm-6 col-lg-4">
                <FieldReadonly :value="account.phone" :label="i18n('Phone')" />
              </div>
              <div class="col-12 col-sm-6 col-lg-4">
                <FieldReadonly :value="account.area" :label="i18n('Area')" format="decimal" />
              </div>
              <div class="col-12 col-sm-6 col-lg-4">
                <FieldReadonly :value="account.onboarding_step" :label="i18n('Onboarding Step')" format="int" />
              </div>
              <div class="col-12 col-sm-6 col-lg-4">
                <FieldReadonly :value="account.transfer_mode" :label="i18n('Transfer Mode')" />
              </div>
              <div class="col-12 col-sm-6 col-lg-4">
                <FieldReadonly :value="account.transfer_holder" :label="i18n('Transfer Holder')" />
              </div>
              <div class="col-12 col-sm-6 col-lg-4">
                <FieldReadonly :value="account.transfer_details" :label="i18n('Transfer Details')" />
              </div>
              <div class="col-12 col-sm-6 col-lg-4">
                <FieldReadonly :value="account.points" :label="i18n('Points')" format="int" />
              </div>
            </div>
          </div>
        </SectionItem>
        <SectionItem v-if="can('INVOICE_ACCESS') || can('INVOICE_MANAGE')">
          <template #title>
            {{ i18n('Invoices') }}
          </template>
          <InvoiceSection :account="account" />
        </SectionItem>
      </SectionManager>
      <AccountModal ref="AccountModal" @updated="reload" />
    </DefaultLayout>
  </ApiViewWrapper>
</template>

<script>
import api from "@/api.js";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import ApiViewWrapper from "@/components/common/view/ApiViewWrapper.vue";
import SectionManager from "@/components/common/layout/section/SectionManager.vue";
import SectionItem from "@/components/common/layout/section/SectionItem.vue";
import FieldReadonly from "@/components/common/form/FieldReadonly.vue";
import ActionDropdown from "@/components/common/list/ActionDropdown.vue";
import InvoiceSection from "@/components/invoice/InvoiceSection.vue";
import AccountModal from "@/components/account/AccountModal.vue";

export default {
  components: {
    ApiViewWrapper,
    DefaultLayout,
    SectionManager,
    SectionItem,
    FieldReadonly,
    ActionDropdown,
    InvoiceSection,
    AccountModal,
  },
  data() {
    return {
      account: null,
      notFound: null,
    };
  },
  mounted() {
    api.auth().then((user) => {
      this.$root.loggedUser = user;

      if (!user.loggedIn) {
        return; // Layout non-anonymous will handler redirect
      }

      if (!this.can('ACCOUNT_MANAGE')
        && !this.can('ACCOUNT_ACCESS')) {
        this.$router.push({
          name: 'Index',
        });
        return;
      }

      this.load();
    });
  },
  watch: {
    "$route.params.id"() {
      this.load();
    },
  },
  computed: {
    actions() {
      return [{
        label: this.i18n('Edit'),
        fn: () => {
          this.showAccountModal();
        },
        if: (this.account.acl?.update) === true,
        starred: true,
      },
      {
        label: this.i18n('Delete'),
        fn: () => {
          this.$root.requestConfirmation(this.i18n('Delete? This action cannot be undone.'), () => {
            this.$emit('updating', this.account);
            api.delete(`admin/accounts/${this.account.id}`).then(() => {
              this.$router.push({ name: 'AccountIndex', });
            }).then(() => {
              this.reload();
            });
          });
        },
        if: (this.account.acl?.delete) === true,
        starred: false,
      },
      ];
    },
  },
  methods: {
    load(force) {
      clearTimeout(this.loadTimeout);
      this.notFound = null;

      if (!force) {
        this.loadTimeout = setTimeout(() => {
          this.load(true);
        }, 250);
        return;
      }

      if (!this.$route.params.id) {
        this.notFound = true;
        return;
      }

      api.get(`admin/accounts/${this.$route.params.id}`, { acl: 'account' }).then(account => {
        if (account.acl?.view !== true) {
          this.$router.push({ name: 'AccountIndex', });
          return;
        }

        this.account = account;
        this.$root.setPageTitle([account.name].filter(Boolean).join(' ') + ' | ' + this.i18n('Accounts'));
        this.notFound = false;
      }).catch(() => {
        this.notFound = true;
      });
    },
    reload() {
      this.load();
    },
    showAccountModal() {
      if (!this.$refs.AccountModal) {
        return;
      }

      this.$refs.AccountModal.show(this.account.id);
    },
  },
};
</script>