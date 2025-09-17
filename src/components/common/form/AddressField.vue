<template>
    <div :id="id">
        <div class="row g-2" v-if="!(open && canDeployDetail) || isCoordinatePicker">
            <div class="col">
                <TextField :smallLabel="true" :placeholder="i18n('Street And Number')" :label="label"
                    :pseudoRequired="pseudoRequired || required" :required="required" :disabled="disabled"
                    :customAutofocus="customAutofocus" :readonly="readonly" ref="address" v-model="value.formatted"
                    :errorMessage="errorMessages.formatted ? errorMessages.formatted : errorMessage">
                    <button class="btn btn-outline-secondary" type="button" @click="toggleOpen"
                        v-if="canDeployDetail && !isCoordinatePicker">
                        <DropdownIcon />
                    </button>
                </TextField>
            </div>
        </div>

        <div v-if="(open && canDeployDetail)">
            <div class="row g-2 mb-2" v-if="!isCoordinatePicker">
                <div class="col-12 col-sm-8">
                    <TextField :smallLabel="true" :placeholder="i18n('Street')" :label="i18n('Street')"
                        :pseudoRequired="pseudoRequired || required" :required="required" :disabled="disabled"
                        :customAutofocus="false" :readonly="readonly" v-model="value.street_name"
                        :errorMessage="errorMessages.street_name">
                        <button class="btn btn-outline-secondary" type="button" @click="toggleOpen">
                            <DropdownIcon :rotate="180" />
                        </button>
                    </TextField>
                </div>
                <div class="col-12 col-sm-4">
                    <TextField :smallLabel="true" :placeholder="i18n('Number')" :label="i18n('Number')"
                        :pseudoRequired="pseudoRequired || required" :required="required" :disabled="disabled"
                        :customAutofocus="false" :readonly="readonly" v-model="value.street_number"
                        :errorMessage="errorMessages.street_number" />
                </div>
            </div>
            <div class="row g-2 mb-2" v-if="!isCoordinatePicker">
                <div class="col-6 col-sm-3">
                    <TextField :smallLabel="true" :placeholder="i18n('Block')" :label="i18n('Block')"
                        :disabled="disabled" :customAutofocus="false" :readonly="readonly" v-model="value.block"
                        :errorMessage="errorMessages.block" />
                </div>
                <div class="col-6 col-sm-3">
                    <TextField :smallLabel="true" :placeholder="i18n('Staircase')" :label="i18n('Staircase')"
                        :disabled="disabled" :customAutofocus="false" :readonly="readonly" v-model="value.stairs"
                        :errorMessage="errorMessages.stairs" />

                </div>
                <div class="col-6 col-sm-3">
                    <TextField :smallLabel="true" :placeholder="i18n('Floor')" :label="i18n('Floor')"
                        :disabled="disabled" :customAutofocus="false" :readonly="readonly" v-model="value.floor"
                        :errorMessage="errorMessages.floor" />

                </div>
                <div class="col-6 col-sm-3">
                    <TextField :smallLabel="true" :placeholder="i18n('Door')" :label="i18n('Door')" :disabled="disabled"
                        :customAutofocus="false" :readonly="readonly" v-model="value.door"
                        :errorMessage="errorMessages.door" />

                </div>
            </div>
            <div class="row g-2 mb-2" v-if="!isCoordinatePicker">
                <div class="col-12 col-sm-4">
                    <TextField :smallLabel="true" :placeholder="i18n('Postal Code')" :label="i18n('Postal Code')"
                        :pseudoRequired="pseudoRequired || required" :required="required" :disabled="disabled"
                        :customAutofocus="false" :readonly="readonly" v-model="value.postal_code"
                        :errorMessage="errorMessages.postal_code" />
                </div>
                <div class="col-12 col-sm-8">
                    <TextField :smallLabel="true" :placeholder="i18n('Municipality')" :label="i18n('Municipality')"
                        :pseudoRequired="pseudoRequired || required" :required="required" :disabled="disabled"
                        :customAutofocus="false" :readonly="readonly" v-model="value.city"
                        :errorMessage="errorMessages.city" />
                </div>
            </div>
            <div class="row g-2 mb-2" v-if="!isCoordinatePicker">
                <div class="col-12 col-sm-4">
                    <TextField :smallLabel="true" :placeholder="i18n('Province')" :label="i18n('Province')"
                        :pseudoRequired="pseudoRequired || required" :required="required" :disabled="disabled"
                        :customAutofocus="false" :readonly="readonly" v-model="value.province"
                        :errorMessage="errorMessages.province" />
                </div>
                <div class="col-12 col-sm-4">
                    <TextField :smallLabel="true" :placeholder="i18n('State')" :label="i18n('State')"
                        :pseudoRequired="pseudoRequired || required" :required="required" :disabled="disabled"
                        :customAutofocus="false" :readonly="readonly" v-model="value.state"
                        :errorMessage="errorMessages.state" />
                </div>
                <div class="col-12 col-sm-4">
                    <TextField :smallLabel="true" :placeholder="i18n('Country')" :label="i18n('Country')"
                        :pseudoRequired="pseudoRequired || required" :required="required" :disabled="disabled"
                        :customAutofocus="false" :readonly="readonly" v-model="value.country"
                        :errorMessage="errorMessages.country" />
                </div>
            </div>
            <div class="row g-2 mb-2" v-if="!isCoordinatePicker">
                <div class="col-6">
                    <TextField :smallLabel="true" :placeholder="i18n('Latitude')" :label="i18n('Latitude')"
                        :pseudoRequired="pseudoRequired || required" :required="required" :disabled="disabled"
                        :customAutofocus="false" :readonly="readonly" v-model="value.coordinates.lat"
                        :errorMessage="errorMessages.coordinates" />
                </div>
                <div class="col-6">
                    <TextField :smallLabel="true" :placeholder="i18n('Longitude')" :label="i18n('Longitude')"
                        :pseudoRequired="pseudoRequired || required" :required="required" :disabled="disabled"
                        :customAutofocus="false" :readonly="readonly" v-model="value.coordinates.lng" />
                </div>
            </div>
            <div class="row g-2 mb-2" :class="{ 'mt-2': isCoordinatePicker }">
                <div class="col-12">
                    <SingleMarkerMap v-model="value.coordinates" :errorMessage="errorMessages.coordinates"
                        :draggable="!disabled && !readonly" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TextField from "@/components/common/form/TextField.vue";
import DictionaryField from "@/components/common/form/DictionaryField.vue";
import SingleMarkerMap from "@/components/common/maps/SingleMarkerMap.vue";
import objectVModelMixin from "@/mixins/common/objectVModelMixin.js";
import fieldMixin from "@/mixins/common/fieldMixin.js";
import DropdownIcon from "@/assets/svg/dropdown.vue";

import { formatAddress, } from "@/tools/address.js";
import { insertGoogleMapsScript, } from "@/tools/maps.js";

export default {
    data() {
        return {
            isAutocompleteSet: false,
            open: false,
            errorMessages: {},
            type: 'address',
            autocompleteEngine: null,
        };
    },
    components: {
        TextField,
        DictionaryField,
        SingleMarkerMap,
        DropdownIcon,
    },
    mixins: [
        objectVModelMixin,
        fieldMixin,
    ],
    mounted() {
        this.setAutocomplete();
    },
    props: {
        resettable: {
            type: Boolean,
            default: false,
        },
        exact: {
            type: Boolean,
            default: false,
        },
        pseudoRequired: Boolean,
        required: Boolean,
        allowManualInput: {
            type: Boolean,
            default: false,
        },
        allowInvalidInput: {
            type: Boolean,
            default: false,
        },
        isCoordinatePicker: {
            type: Boolean,
            default: false,
        },
        autocompleteTypes: {
            type: [String, Array],
            default: 'geocode',
        },
    },
    computed: {
        computedAutocompleteTypes() {
            let types = null;

            if (typeof this.autocompleteTypes === 'string') {
                types = this.autocompleteTypes.split(',').map(type => type.trim()).filter(Boolean);
            } else if (Array.isArray(this.autocompleteTypes)) {
                types = this.autocompleteTypes.filter(Boolean);
            }

            if (!types || types.length === 0) {
                types = ['geocode'];
            }

            return types;
        },
        ignoreInvalidPostalCode() {
            return this.isCoordinatePicker;
        },
        canDeployDetail() {
            return (this.value.is_geocoded
                || this.allowManualInput);
        },
        isComplete() {
            return this.value.street_name &&
                this.value.street_number &&
                this.value.postal_code &&
                this.value.city &&
                this.value.province &&
                this.value.state &&
                this.value.country;
        }
    },
    watch: {
        'value.street_name'() {
            this.setFormattedAddress();
        },
        'value.street_number'() {
            this.setFormattedAddress();
        },
        'value.block'() {
            this.setFormattedAddress();
        },
        'value.stairs'() {
            this.setFormattedAddress();
        },
        'value.floor'() {
            this.setFormattedAddress();
        },
        'value.door'() {
            this.setFormattedAddress();
        },
        'value.city'() {
            this.setFormattedAddress();
        },
        'value.postal_code'() {
            this.setFormattedAddress();
        },
        'value.province'() {
            this.setFormattedAddress();
        },
        'value.state'() {
            this.setFormattedAddress();
        },
        'value.country'() {
            this.setFormattedAddress();
        },
        'value.formatted'() {
            if (this.isCoordinatePicker) return;
            this.setFormattedAddress();
        },
        value() {
            if (this.value === null ||
                this.value === undefined) this.value = {};

            if (!this.value.coordinates) {
                this.value.coordinates = {};
            }
        }
    },
    methods: {
        setFormattedAddress() {
            this.value.formatted = formatAddress(this.value);
        },
        toggleOpen() {
            this.blink = false;

            if (!this.allowInvalidInput
                && !this.isComplete
                && this.open) {
                let focus = document.getElementById(this.id).querySelectorAll(`#${this.id} [data-pseudo-required="true"]`),
                    focused = false;
                focus.forEach((i) => {
                    if (focused) return;

                    if (!i.value) {
                        i.focus();
                        focused = true;
                    }
                });
            } else if (this.open) {
                this.open = false;
                this.blink = true;
            } else {
                this.open = true;
            }
        },
        delayAutocomplete() {
            insertGoogleMapsScript();

            if (this.isAutocompleteSet) return;
            setTimeout(() => {
                this.setAutocomplete();
            }, 200);
        },
        setAutocomplete() {
            if (this.isAutocompleteSet || !this.$refs['address'] || !this.isAutocompleteEngineAvailable()) {
                return this.delayAutocomplete();
            }

            this.isAutocompleteSet = true;

            this.autocompleteEngine = new google.maps.places.Autocomplete(
                document.getElementById(this.$refs['address'].getId()),
                { types: this.computedAutocompleteTypes }
            );

            this.autocompleteEngine.addListener('place_changed', this.handlePlaceChanged);
        },
        isAutocompleteEngineAvailable() {
            return typeof google !== 'undefined' &&
                google.maps &&
                google.maps.places &&
                google.maps.places.Autocomplete;
        },
        extractAddressPart(place, typeWhitelist) {
            if (!place.address_components) return '';
            return place.address_components
                .flatMap(component => component.types.includes(typeWhitelist) ? component.long_name : [])
                .join(', ');
        },
        handlePlaceChanged() {
            this.resetAddressFields();

            const place = this.autocompleteEngine.getPlace();
            const postalCode = this.extractAddressPart(place, 'postal_code');

            if (!postalCode && !this.ignoreInvalidPostalCode) {
                this.errorMessages.formatted = this.i18n('Indicate the address with street and number');
                return;
            }

            this.value.is_geocoded = true;
            this.updateAddressFields(place, postalCode);

            if (place.geometry && place.geometry.location) {
                this.value.coordinates = place.geometry.location.toJSON();
                this.convertCoordinatesToString();
            }

            if (!this.value.city) {
                this.value.city = this.extractAddressPart(place, 'postal_town');
            }

            if (this.exact || !this.isComplete) {
                this.open = true;
            }
        },
        resetAddressFields() {
            this.errorMessages = {};
            this.value = {
                is_geocoded: false,
                postal_code: '',
                street_number: '',
                street_name: '',
                city: '',
                province: '',
                state: '',
                country: '',
                coordinates: { lat: '', lng: '' }
            };
        },
        updateAddressFields(place, postalCode) {
            this.value.formatted = place.formatted_address;
            this.value.postal_code = postalCode;
            this.value.street_number = this.extractAddressPart(place, 'street_number');
            this.value.street_name = this.extractAddressPart(place, 'route');
            this.value.city = this.extractAddressPart(place, 'locality');
            this.value.province = this.extractAddressPart(place, 'administrative_area_level_2');
            this.value.state = this.extractAddressPart(place, 'administrative_area_level_1');
            this.value.country = this.extractAddressPart(place, 'country');
        },
        convertCoordinatesToString() {
            this.value.coordinates.lat = '' + this.value.coordinates.lat;
            this.value.coordinates.lng = '' + this.value.coordinates.lng;
        },
    },
};
</script>