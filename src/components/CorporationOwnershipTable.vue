<template>
  <div
    class="corporation-ownership-matrix"
    v-on:scroll="calulateIfCorpNameOutside('showHintOwnershipTable')"
  >
    <table>
      <thead>
        <tr>
          <th class="main-header" :colspan="players.length + 1">
            Corporations Ownership
          </th>
        </tr>
        <tr>
          <th>Corporation</th>
          <th v-for="(player, index) in players" v-bind:key="index">
            <input
              type="text"
              v-model.number="player.name"
              v-on:focus="player.name = null"
              @keydown="$emit('calculate-player-stock-value')"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(companyRow, index) in playerCorporationOwnership"
          v-bind:key="index"
        >
          <td
            ref="showHintOwnershipTable"
            class="td-corporation"
            :style="{
              'background-color': corporations[index].color,
              color: corporations[index].text,
            }"
          >
            {{ corporations[index].name }}
          </td>
          <td v-for="cell in companyRow" v-bind:key="cell.key">
            <span class="input-percentage">%</span>
            <input
              placeholder="Share"
              type="number"
              v-model.number="cell.value"
              v-bind:key="cell.key"
              @keydown="$emit('calculate-player-stock-value')"
              @focus="setInputFocused(true, index, 'showHintOwnershipTable')"
              @blur="setInputFocused(false, null, 'showHintOwnershipTable')"
            />
          </td>
        </tr>
      </tbody>

      <thead>
        <tr>
          <th class="main-header" :colspan="players.length + 1">
            Players Scoring Summary
          </th>
        </tr>
      </thead>
      <tbody class="scoring-info">
        <tr>
          <td>Stock Value</td>
          <td
            v-for="(playerStockValue, index) in playersStockValue"
            v-bind:key="index"
          >
            <TableDataCurrency :currency="currency" />
            {{ playerStockValue }}
          </td>
        </tr>
        <tr>
          <td>Cash</td>
          <td v-for="(cash, index) in playersCash" v-bind:key="index">
            <TableDataCurrency :currency="currency" />
            <input
              type="number"
              v-model.number="cash.value"
              placeholder="Cash"
              v-on:change="$emit('update-local-storage')"
            />
          </td>
        </tr>
        <tr>
          <td>Simulated OR's Value</td>
          <td v-for="(cash, index) in playerSimulatedIncome" v-bind:key="index">
            <TableDataCurrency :currency="currency" />
            {{ cash }}
          </td>
        </tr>
        <tr class="wealth-table">
          <td>Total Wealth</td>
          <td v-for="(score, index) in playersScore" v-bind:key="index">
            <TableDataCurrency :currency="currency" />
            {{ score.totalWealth }}
          </td>
        </tr>
        <tr>
          <td>Ranking</td>
          <td v-for="(score, index) in playersScore" v-bind:key="index">
            {{ score.ranking }}
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
  name: "CorporationOwnershipTable",
  mixins: [checkCorpHintMixin],
  components: {
    TableDataCurrency,
  },

  props: {
    corporations: Array,
    currency: Object,
    players: Array,
    playerCorporationOwnership: Array,
    playersStockValue: Array,
    playersCash: Array,
    playerSimulatedIncome: Array,
  },

  computed: {
    playersScore() {
      var playersScore = [];

      for (let index = 0; index < this.playersStockValue.length; index++) {
        var totalWealth =
          this.playersStockValue[index] +
          Number(this.playersCash[index].value) +
          this.playerSimulatedIncome[index];

        playersScore.push({ totalWealth: Math.round(totalWealth) });
      }

      for (let index = 0; index < playersScore.length; index++) {
        playersScore[index].ranking = 1;

        for (let inIndex = 0; inIndex < playersScore.length; inIndex++) {
          if (
            index != inIndex &&
            playersScore[index].totalWealth < playersScore[inIndex].totalWealth
          ) {
            playersScore[index].ranking++;
          }
        }
      }

      return playersScore;
    },
  },
};
</script>

<style
  lang="less"
  src="../assets/less/_CorporationOwnershipTable.less"
  scoped
></style>
