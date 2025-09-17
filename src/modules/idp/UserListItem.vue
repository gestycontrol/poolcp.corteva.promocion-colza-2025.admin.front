<template>
  <tr @dblclick="$refs['actions'].callFirstStarredAction();"
    class="d-block d-lg-table-row bg-white px-2 py-2 mb-2 border p-lg-0 mb-lg-0 border-lg-0">
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Id') }}</span>
      <FieldReadonly :value="user.id" />
    </td>
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('First Name') }}</span>
      <FieldReadonly :value="user.first_name" />
    </td>
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Last Name') }}</span>
      <FieldReadonly :value="user.last_name" />
    </td>
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Email') }}</span>
      <FieldReadonly :value="user.email" />
    </td>
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Profile') }}</span>
      <FieldReadonly :value="user.profilesText" />
    </td>
    <td data-no-export class="d-block d-lg-table-cell text-end border-0 border-lg-bottom" @click.stop>
      <ActionDropdown ref="actions" :actions="actions" />
    </td>
  </tr>
</template>

<script>
import api from "@/api.js";
import * as idp from "@/modules/idp/idp.js";
import FieldReadonly from "@/components/common/form/FieldReadonly.vue";
import ActionDropdown from "@/components/common/list/ActionDropdown.vue";
import $env from "@/tools/environment.js";

export default {
  components: {
    FieldReadonly,
    ActionDropdown,
  },
  props: {
    user: Object,
  },
  data() {
    return {
      localUser: null,
    };
  },
  emits: [
    'edit',
    'password',
    'deleted',
    'updating',
    'updated',
  ],
  watch: {
    user: {
      handler: function () {
        this.loadLocalUser();
      },
      deep: true,
    },
  },
  mounted() {
    this.loadLocalUser();
  },
  methods: {
    loadLocalUser() {
      this.localUser = null;

      if (this.user.userOrigin.code === 'local') {
        api.cached(`${api.urls.idp}localUsers/${this.user.origin_identifier}?acl=1`).then(localUser => {
          this.localUser = localUser;
        });
      }
    },
    removeUserProfiles() {
      api.get(`${api.urls.idp}users/${this.user.id}/profiles`).then(profiles => {
        const realUserAdminProfileId = parseInt($env('VITE_IDP_REAL_USER_ADMIN_PROFILE_ID')) || null;
        const applicationUserAdminProfileId = parseInt($env('VITE_IDP_APPLICATION_USER_ADMIN_PROFILE_ID')) || null;

        const profilesToRemove = profiles.filter(p =>
          p.application.id == $env('VITE_IDP_CLIENT_ID') ||
          (realUserAdminProfileId && p.id == realUserAdminProfileId) ||
          (applicationUserAdminProfileId && p.id == applicationUserAdminProfileId)
        );

        if (profilesToRemove.length === 0) {
          this.$root.showSuccessModal(this.i18n('User cannot be removed.'));
          this.$emit('updated', this.user);
          return;
        }

        const promises = profilesToRemove.map(profile =>
          api.delete(`${api.urls.idp}users/${this.user.id}/profiles/${profile.id}`)
        );

        Promise.all(promises).then(() => {
          api.clearCache();
          this.$root.showSuccessModal(this.i18n('User removed.'));
          this.$emit('deleted', this.user);
        }).catch((error) => {
          console.error('Error removing profiles:', error);
          this.$root.showErrorModal(this.i18n('An error occurred while removing user.'));
          this.$emit('updated', this.user);
        });
      }).catch((error) => {
        console.error('Error getting user profiles:', error);
        this.$root.showErrorModal(this.i18n('An error occurred while removing user.'));
        this.$emit('updated', this.user);
      });
    }
  },
  computed: {
    actions() {
      return [{
        label: this.i18n('Edit'),
        fn: () => {
          this.$emit('edit', this.user);
        },
        if: (this.user.acl?.update) === true || (this.localUser?.acl?.update) === true,
        starred: true,
      },
      {
        label: this.i18n('Detail'),
        fn: () => {
          this.$emit('edit', this.user);
        },
        if: (this.user.acl?.update) !== true,
        starred: true,
      },
      {
        label: this.i18n('Change Password'),
        fn: () => {
          this.$emit('password', this.localUser);
        },
        if: (this.localUser?.acl?.setPassword) === true,
        starred: true,
      },
      {
        label: this.i18n('Simulate'),
        fn: () => {
          this.$emit('updating', this.user);
          api.post(`${api.urls.idp}users/${this.user.id}/getLoginAsCode/${$env('VITE_IDP_CLIENT_ID')}`).then((result) => {
            localStorage.clear();
            window.location.href = `/fromlogin?code=${encodeURIComponent(result.code)}`;
          }).catch((error) => {
            this.$root.showErrorModal('No se pudo simular al usuario.');
            this.$emit('updated', this.user);
          });
        },
        if: (this.user.acl?.getLoginAsCode) === true,
        starred: true,
      },
      {
        label: this.i18n('Remove'),
        fn: () => {
          this.$emit('updating', this.user);
          this.$root.requestConfirmation(this.i18n('Remove user?'), () => {
            this.removeUserProfiles();
          });
        },
        if: (this.user.acl?.delete) === true || (this.localUser?.acl?.delete) === true,
        starred: false,
      },
      ];
    },
  },
};
</script>