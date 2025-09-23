<template>
  <div class="monthly-calendar" :style="calendarCssVars">
    <div v-if="showHeader" class="mb-4 mt-2">
      <div class="ms-auto d-flex align-items-center">
        <button class="ms-auto btn btn-outline-dark btn-sm border-end-0" @click="prevYear">‹‹</button>
        <button class="btn btn-outline-dark btn-sm border-end-0" @click="prevMonth">‹</button>
        <select class="form-select form-select-sm border-black border-end-0" :value="month"
          @change="onMonthSelect($event)"
          :style="{ width: (Math.max(...Object.values(monthsMap).map(v => i18n(v).length)) * 0.65) + 3 + 'em' }">
          <option v-for="m in 12" :key="m" :value="m">{{ i18n(monthsMap[m]) }}</option>
        </select>
        <select class="form-select form-select-sm border-black border-end-0" :value="year"
          @change="onYearSelect($event)"
          :style="{ width: (Math.max(...availableYears.map(y => y.toString().length)) * 0.65) + 3 + 'em' }">
          <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
        </select>
        <button class="btn btn-outline-dark btn-sm border-end-0" @click="nextMonth">›</button>
        <button class="me-auto btn btn-outline-dark btn-sm" @click="nextYear">››</button>
      </div>
    </div>
    <div class="d-grid" style="grid-template-columns: repeat(7, 1fr);">
      <div v-for="d in weekdayLabels" :key="d"
        class="py-2 border-bottom text-uppercase small fw-semibold text-center weekday">
        {{ d }}
      </div>
    </div>

    <div v-for="(week, wi) in weeks" :key="wi" class="calendar-week" :style="weekStyle(week)">
      <div v-for="day in week.days" :key="day.key" class="calendar-day border p-2 position-relative"
        :class="{ out: !day.inMonth, disabled: isBeforeMinDate(day.date), 'selection-start': isSelectionStart(day.date), 'selection-end': isSelectionEnd(day.date), 'selection-middle': isSelectionMiddle(day.date) }"
        @click="handleDayClick(day)" @mousedown="handleMouseDown(day)" @mouseenter="handleMouseEnter(day)">
        <div class="d-flex justify-content-end">
          <span class="day-n fw-semibold">
            {{ day.date.getDate() }}
          </span>
        </div>
      </div>
      <div class="events-layer" :style="eventsLayerStyle(week)">
        <div v-for="seg in week.segments" :key="seg.key"
          class="calendar-event rounded-2 px-2 small d-flex align-items-center text-truncate cursor-pointer"
          :class="eventVariantClass(seg.event)" :style="eventStyle(seg)" @click.stop="handleEventClick(seg.event)">
          <span class="text-truncate">
            {{ seg.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDateLocalISO } from '@/tools/date.js';
export default {
  name: 'Calendar',
  props: {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    events: { type: Array, default: () => [], },
    firstDayOfWeek: { type: Number, default: 1 },
    baseDayHeight: { type: Number, default: 92 },
    eventHeight: { type: Number, default: 22 },
    eventGap: { type: Number, default: 4 },
    dayTopOffset: { type: Number, default: 24 },
    showHeader: { type: Boolean, default: false },
    minSelectableDate: { type: [String, Number, Date], default: null },
  },
  emits: [
    'eventClick',
    'selectionChanged',
    'visibleRangeChanged',
  ],
  data() {
    return {
      isSelecting: false,
      selectionStart: null,
      selectionEnd: null,
      dragStart: null,
    };
  },
  computed: {
    monthsMap() {
      return {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
      };
    },
    currentLabel() {
      return `${this.i18n(this.monthsMap[this.month])} ${this.year}`;
    },
    calendarCssVars() {
      return {
        '--mc-day-top': `${this.dayTopOffset}px`,
        '--mc-event-h': `${this.eventHeight}px`,
        '--mc-eventGap': `${this.eventGap}px`,
      };
    },
    weekdayLabels() {
      const weekDays = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
      };

      // January 6, 2025 is a Monday
      const base = this.startOfWeek(new Date(2025, 0, 6), this.firstDayOfWeek);

      return [...Array(7)].map((_, i) => this.i18n(weekDays[this.addDays(base, i).getDay()]));
    },
    normalizedMinSelectableDate() {
      if (!this.minSelectableDate) return null;
      const d = this.toDate(this.minSelectableDate);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    },
    availableYears() {
      const baseYear = this.year || new Date().getFullYear();
      const minYear = this.normalizedMinSelectableDate ? this.normalizedMinSelectableDate.getFullYear() : baseYear - 5;
      const maxYear = baseYear + 5;
      const years = [];
      for (let y = minYear; y <= maxYear; y++) years.push(y);
      return years;
    },
    normalizedEvents() {
      return this.events.map(e => {
        const s = this.atStartOfDay(this.toDate(e.start));
        const endDate = this.toDate(e.end ?? e.start);
        const eInclusive = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999);
        return { ...e, start: s, end: eInclusive };
      });
    },
    monthStart() {
      return new Date(this.year, this.month - 1, 1);
    },
    monthEnd() {
      return new Date(this.year, this.month, 0, 23, 59, 59, 999);
    },
    rangeStart() {
      return this.startOfWeek(this.monthStart, this.firstDayOfWeek);
    },
    rangeEnd() {
      return this.endOfWeek(this.monthEnd, this.firstDayOfWeek);
    },
    weeks() {
      const weeks = [];
      let cursor = new Date(this.rangeStart);

      while (cursor <= this.rangeEnd) {
        const weekStart = new Date(cursor);
        const weekEnd = this.addDays(weekStart, 6);
        const days = [...Array(7)].map((_, i) => {
          const d = this.addDays(weekStart, i);

          return {
            date: d,
            inMonth: d.getMonth() === this.monthStart.getMonth(),
            key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
          };
        });
        const segmentsRaw = this.weekSegments(weekStart, weekEnd, this.normalizedEvents);
        const packed = this.packLanes(segmentsRaw);
        const height = this.baseDayHeight + packed.lanes * (this.eventHeight + this.eventGap);

        weeks.push({ start: weekStart, end: weekEnd, days, segments: packed.segments, lanes: packed.lanes, height });
        cursor = this.addDays(weekStart, 7);
      }
      return weeks;
    },
  },
  watch: {
    year() {
      this.clearSelection();
    },
    month() {
      this.clearSelection();
    },
    firstDayOfWeek() {
      this.emitVisibleRange();
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.emitVisibleRange();
  },
  methods: {
    clearSelection() {
      this.isSelecting = false;
      this.selectionStart = null;
      this.selectionEnd = null;
      this.dragStart = null;
    },
    nextYear() {
      this.setCurrentRange(this.year + 1, this.month);
    },
    prevYear() {
      this.setCurrentRange(this.year - 1, this.month);
    },
    prevMonth() {
      let m = this.month - 1;
      let y = this.year;
      if (m < 1) { m = 12; y -= 1; }

      this.setCurrentRange(y, m);
    },
    nextMonth() {
      let m = this.month + 1;
      let y = this.year;
      if (m > 12) { m = 1; y += 1; }

      this.setCurrentRange(y, m);
    },
    onMonthSelect(e) {
      const m = parseInt(e.target.value, 10);

      if (!isNaN(m)) {
        this.setCurrentRange(this.year, m);
      }
    },
    onYearSelect(e) {
      const y = parseInt(e.target.value, 10);

      if (!isNaN(y)) {
        this.setCurrentRange(y, this.month);
      }
    },
    handleEventClick(event) {
      this.$emit('eventClick', event);
    },
    handleDayClick(day) {
      if (this.isBeforeMinDate(day.date)) return;
      this.selectionStart = new Date(day.date);
      this.selectionEnd = new Date(day.date);
      this.emitSelectionChanged();
    },
    handleMouseDown(day) {
      if (this.isBeforeMinDate(day.date)) return;
      this.isSelecting = true;
      this.dragStart = new Date(day.date);
      this.selectionStart = new Date(day.date);
      this.selectionEnd = new Date(day.date);

      document.addEventListener('selectstart', this.preventDefault);
      document.addEventListener('mouseup', this.handleGlobalMouseUp);
    },
    handleMouseEnter(day) {
      if (!this.isSelecting) return;
      if (this.isBeforeMinDate(day.date)) return;
      this.selectionEnd = new Date(day.date);
    },
    handleMouseUp() {
      if (this.isSelecting) {
        this.isSelecting = false;
        this.emitSelectionChanged();
        document.removeEventListener('selectstart', this.preventDefault);
        document.removeEventListener('mouseup', this.handleGlobalMouseUp);
      }
    },
    handleGlobalMouseUp() {
      this.handleMouseUp();
    },
    preventDefault(e) {
      e.preventDefault();
    },
    emitSelectionChanged() {
      if (this.selectionStart && this.selectionEnd) {
        const start = this.selectionStart < this.selectionEnd ? this.selectionStart : this.selectionEnd;
        const end = this.selectionStart < this.selectionEnd ? this.selectionEnd : this.selectionStart;

        const selectionData = {
          start: formatDateLocalISO(start).split('T')[0],
          end: formatDateLocalISO(end).split('T')[0],
          startDate: start,
          endDate: end
        };

        this.$emit('selectionChanged', selectionData);
      }
    },
    emitVisibleRange() {
      const payload = {
        start: formatDateLocalISO(this.rangeStart).split('T')[0],
        end: formatDateLocalISO(this.rangeEnd).split('T')[0],
        startDate: this.rangeStart,
        endDate: this.rangeEnd,
        year: this.year,
        month: this.month,
        firstDayOfWeek: this.firstDayOfWeek,
      };
      this.$emit('visibleRangeChanged', payload);
    },
    setCurrentRange(year, month) {
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);
      const rangeStart = this.startOfWeek(monthStart, this.firstDayOfWeek);
      const rangeEnd = this.endOfWeek(monthEnd, this.firstDayOfWeek);
      const payload = {
        start: formatDateLocalISO(rangeStart).split('T')[0],
        end: formatDateLocalISO(rangeEnd).split('T')[0],
        startDate: rangeStart,
        endDate: rangeEnd,
        year: year,
        month: month,
        firstDayOfWeek: this.firstDayOfWeek,
      };

      this.$emit('visibleRangeChanged', payload);
    },
    isSelectionStart(date) {
      if (!this.selectionStart || !this.selectionEnd) return false;

      const start = this.selectionStart < this.selectionEnd ? this.selectionStart : this.selectionEnd;
      const result = this.isSameDay(date, start);

      return result;
    },
    isSelectionEnd(date) {
      if (!this.selectionStart || !this.selectionEnd) return false;

      const end = this.selectionStart < this.selectionEnd ? this.selectionEnd : this.selectionStart;
      const result = this.isSameDay(date, end);

      return result;
    },
    isSelectionMiddle(date) {
      if (!this.selectionStart || !this.selectionEnd) return false;

      const start = this.selectionStart < this.selectionEnd ? this.selectionStart : this.selectionEnd;
      const end = this.selectionStart < this.selectionEnd ? this.selectionEnd : this.selectionStart;
      const result = date > start && date < end;

      return result;
    },
    isSameDay(date1, date2) {
      return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
    },
    eventsLayerStyle(week) {
      return {
        gridTemplateRows: `repeat(${week.lanes}, var(--mc-event-h))`,
        rowGap: `${this.eventGap}px`,
      };
    },
    isBeforeMinDate(date) {
      if (!this.normalizedMinSelectableDate) return false;
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      return d < this.normalizedMinSelectableDate;
    },
    toDate(v) {
      if (v instanceof Date) return v;
      if (typeof v === 'number') return new Date(v);

      const d = new Date(v);

      return isNaN(d) ? new Date() : d;
    },
    atStartOfDay(d) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    },
    addDays(d, n) {
      const r = new Date(d); r.setDate(r.getDate() + n);

      return r;
    },
    diffDays(a, b) {
      const ms = this.atStartOfDay(b) - this.atStartOfDay(a);

      return Math.floor(ms / 86400000);
    },
    startOfWeek(d, first) {
      const day = d.getDay(); const diff = (day - first + 7) % 7;

      return this.atStartOfDay(this.addDays(d, -diff));
    },
    endOfWeek(d, first) {
      return this.addDays(this.startOfWeek(d, first), 6);
    },
    overlaps(aStart, aEnd, bStart, bEnd) {
      return aStart <= bEnd && bStart <= aEnd;
    },
    weekSegments(weekStart, weekEnd, events) {
      const segments = [];

      events.forEach(ev => {
        if (!this.overlaps(ev.start, ev.end, weekStart, weekEnd)) return;

        const segStart = ev.start > weekStart ? ev.start : weekStart;
        const segEnd = ev.end < weekEnd ? ev.end : weekEnd;
        const startIndex = this.diffDays(weekStart, segStart);
        const span = this.diffDays(segStart, segEnd) + 1;

        segments.push({
          key: `${ev.id ?? ev.title}-${weekStart.toISOString()}-${startIndex}-${span}`,
          event: ev,
          startIndex,
          span,
          lane: 0,
          label: ev.title,
        });
      });
      segments.sort((a, b) => (a.startIndex - b.startIndex) || (b.span - a.span));

      return segments;
    },
    packLanes(segments) {
      const lanes = [];

      segments.forEach(seg => {
        let placed = false;

        for (let i = 0; i < lanes.length; i++) {
          if (lanes[i] < seg.startIndex) {
            seg.lane = i;
            lanes[i] = seg.startIndex + seg.span - 1;
            placed = true;
            break;
          }
        }

        if (!placed) {
          seg.lane = lanes.length; lanes.push(seg.startIndex + seg.span - 1);
        }
      });

      return {
        segments, lanes: lanes.length
      };
    },
    eventVariantClass(ev) {
      let v = ev.variant;

      if (!v && ev.backgroundColor) {
        return '';
      }

      const map = {
        primary: 'bg-primary-soft',
        success: 'bg-success-soft',
        info: 'bg-info-soft',
        warning: 'bg-warning-soft',
        danger: 'bg-danger-soft',
        secondary: 'bg-secondary-soft',
      };

      return map[v || 'primary'] || map.primary;
    },
    weekStyle(week) {
      return {
        gridTemplateColumns: 'repeat(7, 1fr)', height: `${week.height}px`
      };
    },
    eventStyle(seg) {
      const style = {
        gridColumn: `${seg.startIndex + 1} / span ${seg.span}`,
        gridRow: `${seg.lane + 1}`,
      };

      if (seg.event.color) {
        style.backgroundColor = seg.event.color;
        style.borderColor = seg.event.color;
        style.color = seg.event.text_color || '#fff';
      }

      return style;
    },
    handleClickOutside(event) {
      const calendarElement = this.$el;

      if (calendarElement && !calendarElement.contains(event.target)) {
        this.clearSelection();

      }
    }
  },
  beforeUnmount() {
    document.removeEventListener('selectstart', this.preventDefault);
    document.removeEventListener('mouseup', this.handleGlobalMouseUp);
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>

<style scoped>
.monthly-calendar {
  user-select: none;
}

.calendar-day.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
