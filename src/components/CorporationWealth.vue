<template>
  <div class="companyvalue-matrix">
    <table>
      <thead>
        <tr>
          <th colspan="3">Corporation Wealth</th>
        </tr>
        <tr>
          <th>Corporations</th>
          <th>Revenue</th>
          <th>Stock Value</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(corporation, index) in corporationsWealth"
          v-bind:key="index"
        >
          <td
            class="corporation-cell"
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
              class="companyvalue-matrix__input"
              v-model.number="corporation.stockValue"
              @change="$emit('sharepart-changed')"
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
              class="companyvalue-matrix__input"
              v-model.number="corporation.revenue"
              @change="$emit('company-revenue-changed')"
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
  props: {
    corporationsWealth: Array,
    currency: Object,
  },
};
</script>
