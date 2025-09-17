<template>
  <template v-if="showView">
    <nav class="navbar position-fixed fixed-top navbar-dark bg-primary mb-3 bg-cover no-print" :style="{
      backgroundColor: devEnvironmentName ? '#5ccbff !important' : '#496c70 !important',
    }">
      <div class="container-fluid">
        <div class="applications-wrapper">
          <ApplicationMenu />
          <a class="navbar-brand" href="/">
            <img :src="defaultLogoLightUrl" :alt="defaultCompanyAlias" height="38" data-logo="light">
            <span class="brand-separator"></span> <span class="text-uppercase brand-application">
              {{ appName }}
              {{ devEnvironmentName }}
            </span>
          </a>
        </div>

        <div class="btn-group">
          <slot name="buttons"></slot>
          <button class="btn btn-outline-light d-lg-none" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#aside-menu" aria-controls="aside-menu">
            <i class="custom-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list"
                viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
              </svg>
            </i>
          </button>
        </div>
      </div>
    </nav>

    <template v-if="showMenu">
      <SideMenu>
        <ul class="nav nav-pills flex-column mb-auto">
          <li class="nav-item" v-if="$root.can('SECTION_ACCESS') || $root.can('SECTION_MANAGE')">
            <router-link :to="{ name: 'SectionItemIndex' }" class="nav-link link-dark"
              :class="{ 'active': currentRouteName == 'SectionItemIndex' || currentRouteName == 'SectionItemDetail' }">
              <DashboardIcon />
              <div class="slim-hide">{{ i18n('Section') }}</div>
            </router-link>
          </li>
        </ul>
        <template #userMenu>
          <ul class="dropdown-menu text-small shadow">
            <li>
              <a class="dropdown-item" href="javascript:void(0)" @click="logout">
                {{ i18n('Logout') }}
              </a>
            </li>
          </ul>
        </template>
      </SideMenu>
    </template>

    <main class="container-fluid mt-5 pt-4" :class="{ 'noMenu': !showMenu }">
      <slot></slot>
    </main>
    <BackToTop />
  </template>
</template>

<script>
import $env from '@/tools/environment.js';
const appName = $env('VITE_APP_NAME');
const defaultLogoLightUrl = $env('VITE_DEFAULT_LOGO_LIGHT_URL');
const defaultCompanyAlias = $env('VITE_DEFAULT_COMPANY_ALIAS');
const defaultIcoUrl = $env('VITE_DEFAULT_ICO_URL');
const ignoreUserCompany = $env('VITE_IGNORE_USER_COMPANY');
import api from "@/api.js";
import ApplicationMenu from "@/components/common/layout/ApplicationMenu.vue";
import SideMenu from "@/components/common/layout/SideMenu.vue";
import SectionIcon from "@/assets/svg/calendar-clock.vue";
import ProjectIcon from "@/assets/svg/file.vue";
import DashboardIcon from "@/assets/svg/dashboard.vue";
import ClientIcon from "@/assets/svg/user.vue";
import BackToTop from '@/components/common/layout/BackToTop.vue';

export default {
  components: {
    ApplicationMenu,
    SideMenu,
    SectionIcon,
    ClientIcon,
    ProjectIcon,
    BackToTop,
    DashboardIcon,
  },
  props: {
    allowAnonymous: {
      type: Boolean,
      default: false,
    },
    showMenu: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      devEnvironmentName: false,
      appName,
      defaultLogoLightUrl,
      defaultCompanyAlias,
    };
  },
  computed: {
    currentRouteName() {
      if (!this.$route) return '';
      if (!this.$route.name) return '';

      return this.$route.name;
    },
    showView() {
      return !!this.allowAnonymous || !!(this.$root.loggedUser && this.$root.loggedUser.id);
    }
  },
  methods: {
    logout() {
      this.$router.push({
        name: 'Logout'
      });
    },
  },
  mounted() {
    api.auth().then((user) => {
      let company = null;

      if (user?.company
        && !ignoreUserCompany) {
        company = user.company;
      }

      if (company) {
        this.$root.setCompanyName(user.company.alias);

        [...document.querySelectorAll('[data-logo="light"]')].forEach(e => {
          e.alt = user.company.alias;
          e.src = user.company.logo.light_png_url;
        });
        [...document.querySelectorAll('[data-logo="default"]')].forEach(e => {
          e.alt = user.company.alias;
          e.src = user.company.logo.png_url;
        });
      }

      let icoUrl = company?.logo?.icon_url || defaultIcoUrl;

      if (icoUrl) {
        let link = document.querySelector('link[rel~="icon"]');

        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }

        link.href = icoUrl;
      }
    });
  },
  created() {
    this.devEnvironmentName = api.devEnvironmentName();

    if (!this.allowAnonymous &&
      !api.hasAuthToken()) {
      api.login(
        this.$route.query, {
        name: this.$route.name,
        params: this.$route.params
      }).then((route) => {
        this.$router.push(route);
      });
    } else if (api.hasAuthToken()) {
      api.auth().then((user) => {
        this.$root.loggedUser = user;
      });
    }
  },

};
</script>

<style lang="scss" scoped>
.navbar-brand {
  display: flex;
  flex-direction: column;
}

@media screen and (max-width:511px) {
  .navbar-brand img {
    height: 24px;
    object-fit: contain;
    object-position: left;
  }

  .applications-wrapper {
    .applications-trigger {
      margin-left: 0;
      opacity: 1;
      color: var(--bs-white);
      cursor: pointer;

      .custom-icon__big {
        color: currentColor;
      }
    }
  }
}

@media screen and (min-width:512px) {
  .navbar-brand {
    flex-direction: row;
    align-items: center;
  }

  .brand-separator {
    display: inline-block;
    margin-right: 11px;
    margin-left: 9px;
    background-color: var(--bs-gray-500);
    width: 1px;
    height: 30px;
  }

  .brand-application {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.035rem;
    margin-top: 3px;
  }
}

.brand-application {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.035rem;
  margin-top: 3px;
}

.applications-wrapper {
  display: flex;
  align-items: center;
}
</style>