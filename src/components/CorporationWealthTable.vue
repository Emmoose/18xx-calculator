<template>
  <div
    class="companyvalue-matrix"
    v-on:scroll="calulateIfCorpNameOutside('showHintWealthTable')"
  >
    <table>
      <thead>
        <tr>
          <th class="main-header" colspan="3">Corporation Wealth</th>
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
            ref="showHintWealthTable"
            class="td-corporation"
            :style="{
              'background-color': corporations[index].color,
              color: corporations[index].text,
            }"
          >
            {{ corporations[index].name }}
          </td>
          <td>
            <TableDataCurrency :currency="currency" />
            <input
              placeholder="Stock value"
              type="number"
              v-model.number="corporation.stockValue"
              @keydown="$emit('calculate-player-stock-value')"
              @focus="setInputFocused(true, index, 'showHintWealthTable')"
              @blur="setInputFocused(false, null, 'showHintWealthTable')"
            />
          </td>
          <td>
            <TableDataCurrency :currency="currency" />
            <input
              placeholder="Revenue"
              type="number"
              v-model.number="corporation.revenue"
              @keydown="$emit('run-simulator')"
              @focus="setInputFocused(true, index, 'showHintWealthTable')"
              @blur="setInputFocused(false, null, 'showHintWealthTable')"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import TableDataCurrency from "@/components/TableDataCurrency";
import checkCorpHintMixin from "../mixins/checkCorpHintMixin";
export default {
  name: "CorporationWealthTable",
  mixins: [checkCorpHintMixin],
  components: {
    TableDataCurrency,
  },

  props: {
    corporations: Array,
    corporationsWealth: Array,
    currency: Object,
  },
};
</script>

<style
  lang="less"
  src="../assets/less/_CorporationWealthTable.less"
  scoped
></style>
