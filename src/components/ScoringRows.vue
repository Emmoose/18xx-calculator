<template>
  <tbody class="scoring-info">
    <tr>
      <td>Stock Value</td>
      <ScoringTData
        v-for="(value, index) in playerStockValue"
        v-bind:key="index"
        v-bind:cell-value="value"
      >
      </ScoringTData>
    </tr>
    <tr>
      <td>Cash</td>
      <CashTData
        v-for="(cash, index) in playersCash"
        v-bind:key="index"
        v-bind:index="index"
        v-bind:cash="cash"
      />
    </tr>
    <tr>
      <td>Simulated OR's Value</td>
      <ScoringTData
        v-for="(value, index) in playerSimulatedIncome"
        v-bind:key="index"
        v-bind:cell-value="value"
      ></ScoringTData>
    </tr>
    <tr class="wealth-table">
      <td>Total Wealth</td>
      <ScoringTData
        v-for="(value, index) in playerScore"
        v-bind:key="index"
        v-bind:cell-value="value"
      >
      </ScoringTData>
    </tr>
    <tr>
      <td>Ranking</td>
      <ScoringTData
        v-for="(value, index) in playerRanking"
        v-bind:key="index"
        v-bind:cell-value="value"
      />
    </tr>
  </tbody>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import CashTData from "@/components/CashTData";
import ScoringTData from "@/components/ScoringTData";

export default {
  name: "ScoringRows",
  components: {
    CashTData,
    ScoringTData,
  },
  computed: {
    ...mapGetters([
      "playerStockValue",
      "playerSimulatedIncome",
      "playerScore",
      "playerRanking",
    ]),
    ...mapState(["playersCash"]),
  },
};
</script>
