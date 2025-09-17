<style src="leaflet/dist/leaflet.css"></style>

<template>
    <template v-if="!invalidCoordinates">
        <div :id="id" style="aspect-ratio: 4/3;">
        </div>
    </template>
</template>

<script>
import Map from 'leaflet';
import markerImg from '@/assets/img/marker.png';
import objectVModelMixin from "@/mixins/common/objectVModelMixin.js";
import randomIdMixin from "@/mixins/common/randomIdMixin.js";

export default {
    data: () => ({
        map: null,
        marker: null,
    }),
    mixins: [
        randomIdMixin,
        objectVModelMixin,
    ],
    computed: {
        id() {
            return 'map-' + this.randomId;
        },
        invalidCoordinates() {
            return !this.value ||
                this.value.lat === null ||
                this.value.lng === null ||
                this.value.lat === undefined ||
                this.value.lng === undefined ||
                this.value.lat === '' ||
                this.value.lng === '';
        }
    },
    mounted() {
        this.setMarker();
    },
    watch: {
        'value.lat'() {
            this.setMarker();
        },
        'value.lng'() {
            this.setMarker();
        },
    },
    methods: {
        setMarker() {
            if (this.invalidCoordinates) return;
            if (!document.getElementById(this.id)) return;

            this.$nextTick(() => {
                if (!this.map) {
                    let map = Map.map(this.id).setView([this.value.lat * 1, this.value.lng * 1], 17);
                    Map.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);
                    this.map = map;
                } else {
                    this.map.setView([this.value.lat * 1, this.value.lng * 1], 17);
                }

                let icon = Map.icon({
                    iconUrl: markerImg,
                    iconSize: [38, 38],
                });

                if (this.marker) {
                    this.map.removeLayer(this.marker);
                }

                this.marker = Map.marker([this.value.lat * 1, this.value.lng * 1], {
                    icon: icon,
                    draggable: this.draggable,
                }).addTo(this.map);

                if (this.title) {
                    let popupLink = '<a href="http://www.google.com/maps/place/' + this.value.lat + ' ' +
                        this
                            .value
                            .lng + '" target="blank">' + this.title + '</a>';
                    this.marker.bindPopup(popupLink);
                }

                if (this.draggable)
                    this.marker.on('dragend', () => {
                        this.value = this.marker.getLatLng();
                        // Convert to string
                        this.value.lat = '' + this.value.lat;
                        this.value.lng = '' + this.value.lng;
                    });
            });
        }
    },
    props: {
        title: {
            type: String,
            default: '',
        },
        draggable: {
            type: Boolean,
            default: false,
        }
    },
};
</script>