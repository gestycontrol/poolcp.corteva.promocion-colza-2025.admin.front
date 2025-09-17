<template>
    <template v-if="userApplications && userApplications.length > 1">
        <span class="applications-trigger" @click="openApplicationMenu">
            <ListIcon :big="true" />
        </span>
        <div class="applications-menu" @click="closeApplicationMenu">
            <div class="applications-header">
                <img :src="defaultLogoLightUrl" :alt="defaultCompanyAlias" height="38" data-logo="light">
            </div>
            <nav>
                <ul>
                    <li v-for="userApplication in userApplications" :key="userApplication.id">
                        <a :href="userApplication.main_url" target="_blank" v-if="userApplication.id != currentAppId">
                            <i v-if="userApplication.svg" class="custom-icon custom-icon__big"
                                v-dompurify-html="userApplication.svg"></i>
                            <span class="application-name">{{ userApplication.alias }}</span>
                        </a>
                        <a href="/" class="application-current" v-else>
                            <i v-if="userApplication.svg" class="custom-icon custom-icon__big"
                                v-dompurify-html="userApplication.svg"></i>
                            <span class="application-name">{{ userApplication.alias }}</span>
                        </a>
                    </li>
                </ul>
            </nav>
            <span class="applications-close" @click="closeApplicationMenu">
                <CloseIcon :big="true" />
            </span>
        </div>
    </template>
</template>
<script>
import $env from '@/tools/environment.js';
const defaultLogoLightUrl = $env('VITE_DEFAULT_LOGO_LIGHT_URL');
const defaultCompanyAlias = $env('VITE_DEFAULT_COMPANY_ALIAS');
import api from "@/api.js";
import CloseIcon from "@/assets/svg/close.vue";
import ListIcon from "@/assets/svg/list.vue";

export default {
    components: {
        CloseIcon,
        ListIcon,
    },
    data() {
        return {
            currentAppId: null,
            userApplications: [],
            defaultLogoLightUrl,
            defaultCompanyAlias,
        };
    },
    mounted() {
        api.cached(`${api.urls.idp}users/me/applications`).then(applications => {
            this.userApplications = applications;

            this.userApplications.filter(a => {
                try {
                    let appUrl = new URL(a.main_url);

                    return appUrl.host == window.location.host;
                } catch (e) {
                    return false;
                }
            }).forEach((a) => {
                this.currentAppId = a.id;
            });
        });
    },
    methods: {
        openApplicationMenu() {
            document.body.classList.add('applications-menu-visible');
        },
        closeApplicationMenu() {
            document.body.classList.remove('applications-menu-visible');
        }
    }
};
</script>
<style lang="scss">
.applications-trigger {
    position: relative;
    width: 24px;
    height: 22px;
    margin-right: 14px;

    @media screen and (min-width:512px) {
        margin-left: -40px;
        opacity: 0;
    }

    transition: all 300ms ease-in-out;
    color: var(--bs-white);

    &:after {
        content: "";
        position: absolute;
        top: -10px;
        right: -8px;
        bottom: -10px;
        left: -8px;
    }

    .custom-icon__big {
        color: currentColor;
    }
}

.applications-wrapper {

    &:hover,
    &:active {
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

.applications-menu {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 320px;
    background-color: var(--bs-dark);
    z-index: 2000;
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.2);
    transform: translate3d(-100%, 0, 0);
    transition: all 180ms ease-out;

    .applications-header {
        padding: 8px 16px 8px;
    }

    ul {
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        margin-top: 8px;

        li {
            width: calc(50% - 20px);
            list-style-image: none;
            list-style-type: none;
            margin-bottom: 8px;

            &:nth-child(odd) {
                margin-left: 16px;
                margin-right: 4px;
            }

            &:nth-child(even) {
                margin-right: 16px;
                margin-left: 4px;
            }

            a {
                display: block;
                padding: 20px 4px 12px;
                text-align: center;
                text-decoration: none;
                border: 1px solid transparent;
                font-size: 14px;
                letter-spacing: -0.02rem;
                color: var(--bs-white);
                transition: all 180ms ease-out;

                &:hover,
                &:active {
                    border: 1px solid rgba(#fff, 0.2);
                    background-color: rgba(#fff, 0.1);

                    .custom-icon__big {
                        opacity: 1;
                    }
                }

                .application-name {
                    display: block;

                }

                .custom-icon__big {
                    display: block;
                    width: 24px;
                    height: 24px;
                    margin-left: auto;
                    margin-right: auto;
                    color: currentColor;
                    margin-bottom: 8px;
                    opacity: .6;
                    transition: all 200ms ease-out;
                }
            }
        }
    }

    .applications-close {
        display: block;
        width: 24px;
        height: 24px;
        position: absolute;
        top: 16px;
        right: 12px;
        cursor: pointer;

        .custom-icon__big {
            color: var(--bs-white);
            opacity: .5;
            transition: all 200ms ease-out;
        }

        &:hover {
            .custom-icon__big {
                opacity: 1;
            }
        }
    }
}

body.applications-menu-visible {
    .applications-menu {
        transition: all 200ms ease-in;
        transform: translate3d(0, 0, 0);

        &:after {
            content: "";
            position: fixed;
            top: 0;
            bottom: 0;
            left: -100%;
            width: calc(100vw + 320px);
            z-index: -1;
        }
    }
}
</style>