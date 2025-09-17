<template>
    <div class="language-switcher" :class="{ dark }" v-if="(availableLanguages || []).length > 1">
        <div class="dropdown">
            <button class="btn dropdown-toggle language-btn"
                :class="isMobile ? 'btn-outline-dark' : 'btn-outline-light'" type="button" aria-expanded="false"
                :title="i18n('Change Language')" ref="dropdownButton" @click="toggleDropdown">
                <span class="flag-icon me-1" :class="`flag-icon-${getCurrentLangFlag()}`"></span>
                <span class="current-lang">{{ getCurrentLangDisplay() }}</span>
            </button>
            <ul class="dropdown-menu language-dropdown"
                :class="{ 'show': isOpen, 'dropdown-menu-up': shouldShowUp, 'dropdown-menu-left': shouldShowLeft }"
                ref="dropdownMenu">
                <li v-for="lang in availableLanguages" :key="lang.code">
                    <a class="dropdown-item language-option" :class="{ 'active': isCurrentLang(lang.code) }"
                        href="javascript:void(0)" @click="switchLanguage(lang.code)">
                        <span class="flag-icon" :class="`flag-icon-${lang.flag}`"></span>
                        <span class="language-native">{{ lang.native }}</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { langs } from "@/tools/i18n.js";

export default {
    name: 'LanguageSwitcher',
    props: {
        dark: {
            type: Boolean,
            default: false
        },
    },
    data() {
        const availableLanguages = [
            { code: 'es', name: 'Spanish', native: 'Español', flag: 'es' },
            { code: 'en', name: 'English', native: 'English', flag: 'en' },
            { code: 'pt', name: 'Portuguese', native: 'Português', flag: 'pt' },
            { code: 'fr', name: 'French', native: 'Français', flag: 'fr' },
            { code: 'de', name: 'German', native: 'Deutsch', flag: 'de' },
            { code: 'it', name: 'Italian', native: 'Italiano', flag: 'it' }
        ].filter(l => langs().indexOf(l.code) !== -1);

        return {
            availableLanguages,
            changingToLang: null,
            shouldShowUp: false,
            shouldShowLeft: false,
            isOpen: false,
        };
    },
    mounted() {
        if (this.availableLanguages.length < 2) return;

        // Add event listener for window resize
        window.addEventListener('resize', this.checkDropdownPosition);

        // Add click outside listener
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
        if (this.availableLanguages.length < 2) return;

        // Remove event listeners
        window.removeEventListener('resize', this.checkDropdownPosition);
        document.removeEventListener('click', this.handleClickOutside);
    },
    computed: {
        isMobile() {
            return window.innerWidth <= 768;
        }
    },
    methods: {
        getCurrentLangDisplay() {
            const currentLang = this.changingToLang || this.$root.getCurrentLang();
            const lang = this.availableLanguages.find(l => l.code === currentLang);
            return lang ? lang.code.toUpperCase() : currentLang.toUpperCase();
        },
        getCurrentLangFlag() {
            const currentLang = this.changingToLang || this.$root.getCurrentLang();
            const lang = this.availableLanguages.find(l => l.code === currentLang);
            return lang ? lang.flag : 'en';
        },
        isCurrentLang(langCode) {
            return this.$root.getCurrentLang() === langCode;
        },
        switchLanguage(langCode) {
            this.changingToLang = langCode;
            this.$root.switchLang(langCode);
            this.closeDropdown();
        },
        toggleDropdown() {
            if (this.isOpen) {
                this.closeDropdown();
            } else {
                this.openDropdown();
            }
        },
        openDropdown() {
            this.isOpen = true;
            this.$nextTick(() => {
                this.checkDropdownPosition();
            });
        },
        closeDropdown() {
            this.isOpen = false;
        },
        handleClickOutside(event) {
            if (this.isOpen && !this.$el.contains(event.target)) {
                this.closeDropdown();
            }
        },
        checkDropdownPosition() {
            if (this.$refs.dropdownButton && this.$refs.dropdownMenu) {
                const buttonRect = this.$refs.dropdownButton.getBoundingClientRect();
                const menuHeight = this.$refs.dropdownMenu.offsetHeight;
                const menuWidth = this.$refs.dropdownMenu.offsetWidth;
                const viewportHeight = window.innerHeight;
                const viewportWidth = window.innerWidth;
                const spaceBelow = viewportHeight - buttonRect.bottom;
                const spaceAbove = buttonRect.top;
                const spaceRight = viewportWidth - buttonRect.left;
                const spaceLeft = buttonRect.right;

                // If there's not enough space below but enough space above, show dropdown upward
                this.shouldShowUp = spaceBelow < menuHeight && spaceAbove > menuHeight;

                // If there's not enough space on the right but enough space on the left, show dropdown to the left
                this.shouldShowLeft = spaceRight < menuWidth && spaceLeft > menuWidth;
            }
        },
    }
};
</script>

<style lang="scss" scoped>
.language-switcher {
    .language-btn {
        display: flex;
        align-items: center;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        border-radius: 0.375rem;
        transition: all 0.2s ease;

        &,
        &:active,
        &:hover,
        &:focus {
            border-color: white;
            color: white;
            background: none;
        }

        .current-lang {
            font-weight: 500;
            margin-left: 0.25rem;
        }
    }

    .flag-icon {
        display: inline-block;
        width: 1.5rem;
        aspect-ratio: 3 / 2;
        border-radius: 2px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-right: 0.5rem;
    }

    .flag-icon.flag-icon-en {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3Crect width='60' height='30' fill='%23012169'/%3E%3Cpath d='M0 0 L60 30 M60 0 L0 30' stroke='%23ffffff' stroke-width='6'/%3E%3Cpath d='M0 0 L60 30 M60 0 L0 30' stroke='%23c8102e' stroke-width='3'/%3E%3Cpath d='M30 0 V30 M0 15 H60' stroke='%23ffffff' stroke-width='10'/%3E%3Cpath d='M30 0 V30 M0 15 H60' stroke='%23c8102e' stroke-width='6'/%3E%3C/svg%3E");
    }

    .flag-icon.flag-icon-es {
        background-image: linear-gradient(to bottom,
                #aa151b 0 25%,
                #f1bf00 25% 75%,
                #aa151b 75% 100%);
    }

    .flag-icon.flag-icon-de {
        background-image: linear-gradient(to bottom,
                #000000 0 33.333%,
                #dd0000 33.333% 66.666%,
                #ffce00 66.666% 100%);
    }

    .flag-icon.flag-icon-fr {
        background-image: linear-gradient(to right,
                #0055a4 0 33.333%,
                #ffffff 33.333% 66.666%,
                #ef4135 66.666% 100%);
    }

    .flag-icon.flag-icon-it {
        background-image: linear-gradient(to right,
                #009246 0 33.333%,
                #ffffff 33.333% 66.666%,
                #ce2b37 66.666% 100%);
    }

    .flag-icon.flag-icon-pt {
        background-image: linear-gradient(to right,
                #006600 0 40%,
                #ff0000 40% 100%);
    }

    .language-dropdown {
        min-width: 130px;
        padding: 0.5rem 0;
        border: none;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        background: white;
        display: none;
        position: absolute;
        z-index: 1000;

        &.show {
            display: block;
        }

        &.dropdown-menu-up {
            top: auto !important;
            bottom: 100% !important;
            margin-bottom: 0.125rem;
        }

        &.dropdown-menu-left {
            left: auto !important;
            right: 0 !important;
        }

        .language-option {
            display: flex;
            align-items: center;
            padding: 0.30rem 0.5rem;
            color: #495057;
            text-decoration: none;
            transition: all 0.2s ease;
            position: relative;

            &:hover {
                background-color: #f8f9fa;
                color: #212529;
            }

            &.active {
                background-color: #e9ecef;
                color: #495057;
                font-weight: 500;
            }

            .language-name {
                font-weight: 500;
                margin-right: 0.5rem;
            }

            .language-native {
                color: #6c757d;
                font-size: 0.875rem;
                flex-grow: 1;
            }
        }
    }

    &.dark {

        .language-btn,
        .language-btn:active,
        .language-btn:hover,
        .language-btn:focus {
            border-color: #222 !important;
            color: #fff !important;
            background: #222 !important;
        }

        .language-dropdown {
            background: #222 !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }

        .language-option {
            color: #fff !important;         &:hover {
                background-color: #333 !important;
                color: #fff !important;
            }
            &.active {
                background-color: #444 !important;
                color: #fff !important;
            }
            .language-native {
                color: #bbb !important;
            }
        }
    }
}

@media (max-width: 768px) {
    .language-switcher {

        .language-btn,
        .language-btn:active,
        .language-btn:hover,
        .language-btn:focus {
            border-radius: 0 !important;
            color: white !important;
            border-color: white !important;
            padding: 0.84rem 0.5rem !important;
            font-size: 0.8rem !important;

            .current-lang {
                display: none;
            }
        }
    }
}
</style>