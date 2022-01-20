<template>
  <div class="companyvalue-matrix" v-on:scroll="calulateIfCorpNameOutside">
    <div
      v-if="corporationTip && isCorpNameOutside"
      class="corp-name-mobile"
      :style="{
        'background-color': selectedCorporation.information.color,
        color: selectedCorporation.information.text,
      }"
    >
      {{ selectedCorporation.information.name }}
    </div>
    <table>
      <thead>
        <tr>
          <th colspan="3">Corporation Wealth</th>
        </tr>
        <tr>
          <th>Corporations</th>
          <th>Stock Value</th>
          <th>Per Stock Revenue</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(corporation, index) in corporationsWealth"
          v-bind:key="index"
        >
          <td
            ref="corporationName"
            class="td-corporation"
            :style="{
              'background-color': corporation.information.color,
              color: corporation.information.text,
            }"
          >
            {{ corporation.information.name }}
          </td>
          <td>
            <span
              class="currency-on-input"
              v-bind:class="{
                left: currency.location == 'left',
                right: currency.location == 'right',
              }"
              >{{ currency.sign }}</span
            >

            <input
              placeholder="Stock value"
              type="number"
              v-model.number="corporation.stockValue"
              @change="$emit('sharepart-changed')"
              @focus="showCorporationTip(corporation)"
              @blur="hideCorporationTip"
            />
          </td>
          <td>
            <span
              class="currency-on-input"
              v-bind:class="{
                left: currency.location == 'left',
                right: currency.location == 'right',
              }"
              >{{ currency.sign }}</span
            >
            <input
              placeholder="Revenue"
              type="number"
              v-model.number="corporation.revenue"
              @change="$emit('company-revenue-changed')"
              @focus="showCorporationTip(corporation)"
              @blur="hideCorporationTip"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "CorporationWealth",
  data: function () {
    return {
      corporationTip: false,
      isCorpNameOutside: false,
      selectedCorporation: { information: { color: null, text: null } },
    };
  },
  props: {
    corporationsWealth: Array,
    currency: Object,
  },
  methods: {
    showCorporationTip(corporation) {
      this.corporationTip = true;
      this.selectedCorporation = corporation;
    },
    hideCorporationTip() {
      this.corporationTip = true;
    },
    calulateIfCorpNameOutside() {
      this.$refs.corporationName[0].getBoundingClientRect().x < -220
        ? (this.isCorpNameOutside = true)
        : (this.isCorpNameOutside = false);
    },
  },
};
</script>
