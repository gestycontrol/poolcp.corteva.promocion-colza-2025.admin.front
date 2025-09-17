<template>
  <div class="bg-white border p-2 mt-3">
    <div class="table-responsive position-relative"
      :class="{ 'with-actions-gap': users.length < 4, 'opacity-50': loading }">
      <table class="table">
        <thead>
          <tr class="d-none d-lg-table-row">
            <th scope="col">{{ i18n('Id') }}</th>
            <th scope="col">{{ i18n('First Name') }}</th>
            <th scope="col">{{ i18n('Last Name') }}</th>
            <th scope="col">{{ i18n('Email') }}</th>
            <th scope="col">{{ i18n('Profile') }}</th>
            <th data-no-export scope="col" style="min-width: 48px">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <UserListItem v-for="user in usersWithProfiles" :user="user" :key="user.id" @edit="showUserModal"
            @password="showUserPasswordModal" @deleted="$emit('deleted', $event)" @updated="$emit('updated', $event)"
            @updating="$emit('updating', $event)" />
          <EmptyListItem v-if="!usersWithProfiles || usersWithProfiles.length == 0" :loading="loading" :colspan="7" />
          <LazyLoadListItem v-if="!loading && (lazyLoad || autoLazyLoad)" :autoLazyLoad="autoLazyLoad" :colspan="7"
            @next="$emit('next', $event)" />
        </tbody>
      </table>
      <div class="position-absolute h-100 w-100 top-0" @click.stop v-if="loading"></div>
    </div>
  </div>
  <UserModal ref="UserModal" @updated="$emit('updated', $event)" />
  <UserPasswordModal ref="UserPasswordModal" @updated="$emit('updated', $event)" />
</template>

<script>
import api from "@/api.js";
import UserListItem from "@/modules/idp/UserListItem.vue";
import UserModal from "@/modules/idp/UserModal.vue";
import UserPasswordModal from "@/modules/idp/UserPasswordModal.vue";
import EmptyListItem from "@/components/common/list/EmptyListItem.vue";
import LazyLoadListItem from "@/components/common/list/LazyLoadListItem.vue";
import Tooltip from "@/components/common/layout/Tooltip.vue";
import $env from "@/tools/environment.js";

export default {
  components: {
    UserListItem,
    UserModal,
    UserPasswordModal,
    EmptyListItem,
    LazyLoadListItem,
    Tooltip,
  },
  emits: [
    'updated',
    'deleted',
    'updated',
    'updating',
    'next',
  ],
  props: {
    loading: Boolean,
    lazyLoad: Boolean,
    autoLazyLoad: Boolean,
    users: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      usersWithProfiles: [],
      profilesLoaded: false,
    };
  },
  watch: {
    users: {
      handler() {
        this.loadProfiles();
      },
      immediate: true,
    },
  },
  methods: {
    async loadProfiles() {
      if (!this.users || this.users.length === 0) {
        this.usersWithProfiles = [];
        return;
      }

      this.profilesLoaded = false;
      const usersWithProfiles = [];

      // Cargar perfiles para todos los usuarios en paralelo
      const profilePromises = this.users.map(async (user) => {
        try {
          const profiles = await api.cached(`${api.urls.idp}users/${user.id}/profiles`);
          const filteredProfiles = profiles.filter(p => p.application.id == $env('VITE_IDP_CLIENT_ID'));
          
          // Solo incluir usuarios que tienen al menos un perfil
          if (filteredProfiles.length > 0) {
            return {
              ...user,
              profiles: filteredProfiles,
              profilesText: filteredProfiles.map(profile => profile.name).join(', ')
            };
          }
          return null;
        } catch (error) {
          console.error(`Error loading profiles for user ${user.id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(profilePromises);
      this.usersWithProfiles = results.filter(user => user !== null);
      this.profilesLoaded = true;
    },
    showUserModal(user) {
      if (!this.$refs.UserModal) return;
      this.$refs.UserModal.show(user.id);
    },
    showUserPasswordModal(localUser) {
      if (!this.$refs.UserPasswordModal) return;
      this.$refs.UserPasswordModal.show(localUser.id);
    },
  },
};
</script>