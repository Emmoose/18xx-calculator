<template>
  <div class="bank-summation">
    <table>
      <thead>
        <tr>
          <th class="main-header" colspan="3">Bank Estimate</th>
        </tr>
        <tr>
          <th>Total Cash</th>
          <th>Simulated Income</th>
          <th>Summation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ bankSummation.cash }}</td>
          <td>{{ bankSummation.simulatedIncome }}</td>
          <td>{{ bankSummation.total }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "BankSummary",

  computed: {
    ...mapGetters(["bankSummation"]),
  },
};
</script>
