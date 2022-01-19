<template>
  <div id="app" class="app">
    <div class="calculator">
      <h2>Game: {{ selectedGame }}</h2>
      <div class="top-row">
        <div class="game-settings">
          <p class="info-text">
            Simple app for calculating end game scoring and optionally to
            simulate operating rounds with full payout.
          </p>
          <div class="flex-column">
            <label>Select Game</label>
            <select v-model="selectedGame" @change="setupGame">
              <option v-for="game in games" v-bind:key="game">
                {{ game }}
              </option>
            </select>
          </div>
          <div class="flex-column">
            <label>Select Player number</label>
            <select v-model.number="selectedPlayerCount">
              <option v-for="count in playerCounts" v-bind:key="count">
                {{ count }}
              </option>
            </select>
            <label>Simulated Rounds</label>
            <div class="simulate-rounds">
              <button
                :disabled="simulatedRounds < 1"
                v-on:click="changeNumberSimulationRounds(-1)"
              >
                -1
              </button>
              <input
                type="number"
                v-model.number="simulatedRounds"
                @change="runSimulation"
              />
              <button v-on:click="changeNumberSimulationRounds(1)">+1</button>
            </div>
          </div>
        </div>

        <CorporationWealth
          v-bind:corporations-wealth="corporationsWealth"
          v-bind:currency="currency"
          v-on:sharepart-changed="calculatePlayerStockValue"
          v-on:company-revenue-changed="runSimulation"
        />
      </div>

      <div class="corporation-ownership-matrix">
        <table>
          <thead>
            <tr>
              <th :colspan="players.length + 1">Corporations Ownership</th>
            </tr>
            <tr>
              <th>Corporation</th>
              <th v-for="(player, index) in players" v-bind:key="index">
                <input type="text" v-model.number="player.name" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(companyRow, index) in playerCorporationOwnership"
              v-bind:key="index"
            >
              <td v-for="cell in companyRow" v-bind:key="cell.key">
                <div
                  class="td-corporation"
                  v-if="cell.name"
                  :style="{
                    'background-color': cell.color,
                    color: cell.text,
                  }"
                >
                  {{ cell.name }}
                </div>
                <span class="input-percentage" v-show="!cell.name">%</span>
                <input
                  placeholder="Share"
                  v-show="!cell.name"
                  type="number"
                  v-model.number="cell.value"
                  v-bind:key="cell.key"
                  @change="proxyCalcOwnershipDep"
                />
              </td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th :colspan="players.length + 1">Player Wealth</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                v-for="(playerStockValue, index) in playersStockValue"
                v-bind:key="index"
              >
                <span
                  v-if="index != 0"
                  class="currency-on-input"
                  v-bind:class="{
                    left: currency.location == 'left',
                    right: currency.location == 'right',
                  }"
                  >{{ currency.sign }}</span
                >
                {{ playerStockValue }}
              </td>
            </tr>
            <tr>
              <td v-for="(cash, index) in playersCash" v-bind:key="index">
                <span
                  v-if="index != 0"
                  class="currency-on-input"
                  v-bind:class="{
                    left: currency.location == 'left',
                    right: currency.location == 'right',
                  }"
                  >{{ currency.sign }}</span
                >
                <span v-if="index == 0">{{ cash }}</span>
                <input
                  v-if="index != 0"
                  v-model.number="cash.value"
                  placeholder="Cash"
                />
              </td>
            </tr>
            <tr>
              <td
                v-for="(cash, index) in playerSimulatedIncome"
                v-bind:key="index"
              >
                <span
                  v-if="index != 0"
                  class="currency-on-input"
                  v-bind:class="{
                    left: currency.location == 'left',
                    right: currency.location == 'right',
                  }"
                  >{{ currency.sign }}</span
                >
                <span>{{ cash }}</span>
              </td>
            </tr>

            <tr class="wealth-table">
              <td v-for="(wealth, index) in totalWealth" v-bind:key="index">
                <span
                  v-if="index != 0"
                  class="currency-on-input"
                  v-bind:class="{
                    left: currency.location == 'left',
                    right: currency.location == 'right',
                  }"
                  >{{ currency.sign }}</span
                >
                {{ wealth }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="bank-summation">
        <span>Sum cash and simulated operation: {{ bankSummation }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import gameData from "./assets/gameData.json";
import CorporationWealth from "./components/CorporationWealth.vue";

export default {
  name: "App",
  components: {
    CorporationWealth,
  },

  data: function () {
    return {
      games: [],
      initialGameSetup: true,
      selectedGame: "18Chesapeake",
      playerCounts: [],
      selectedPlayerCount: null,
      selectedGameData: {},
      players: [],
      corporations: [],
      corporationsWealth: [],
      playerCorporationOwnership: [],
      playersStockValue: [],
      playersCash: [],
      playerSimulatedIncome: [],
      simulatedRounds: 0,
      currency: {
        sign: "$",
        location: "left",
      },
    };
  },

  methods: {
    setupGame() {
      this.selectedGameData = gameData.filter(
        (game) => game.gameName == this.selectedGame
      )[0];

      this.corporations = this.selectedGameData.corporations;
      this.currency = this.selectedGameData.currency;

      this.setupPlayerCountOptions();
    },

    setupPlayerCountOptions() {
      var tempPlayerCounts = [];

      for (
        let index = this.selectedGameData.minPlayer;
        index <= this.selectedGameData.maxPlayer;
        index++
      ) {
        tempPlayerCounts.push(index);
      }

      this.playerCounts = tempPlayerCounts;

      this.selectedPlayerCount = this.selectedGameData.minPlayer;
      this.setupPlayerData();
    },

    setupPlayerData() {
      // Players list
      this.players = Array.from(
        new Array(this.selectedPlayerCount),
        (val, index) => {
          return { name: "player-" + (index + 1) };
        }
      );

      // Matrix for corporations earnings
      this.corporationsWealth = Array(this.corporations.length)
        .fill()
        .map((data, index) => ({
          information: this.corporations[index],
          revenue: null,
          stockValue: null,
        }));

      // Matrix for players shares in corporations
      this.playerCorporationOwnership = Array(this.corporations.length).fill(
        []
      );

      for (
        var outerIndex = 0;
        outerIndex < this.corporations.length;
        outerIndex++
      ) {
        var tempArray = [];

        tempArray.push(this.corporations[outerIndex]);

        for (
          let innerIndex = 0;
          innerIndex < this.selectedPlayerCount;
          innerIndex++
        ) {
          tempArray.push({ value: null, key: outerIndex + "#" + innerIndex });
        }
        this.playerCorporationOwnership[outerIndex] = tempArray;
      }

      // List player stock value
      this.playersStockValue = Array(this.selectedPlayerCount).fill(0);
      this.playersStockValue.unshift("Stock Value");

      // List player cash
      this.playersCash = Array(this.selectedPlayerCount)
        .fill()
        .map(() => ({
          value: null,
        }));

      this.playersCash.unshift("Cash");

      this.playerSimulatedIncome = Array(this.selectedPlayerCount).fill(0);
      this.playerSimulatedIncome.unshift("Simulated OR's Value");
    },

    proxyCalcOwnershipDep() {
      this.calculatePlayerStockValue();
      this.runSimulation();
    },

    //BAD IMPLEMENTATION LOOPING THROUGH ALL CAN IT BE DONE WITH COMPUTED OR SIMILAR?
    calculatePlayerStockValue() {
      var tempStockValue = Array(this.selectedPlayerCount).fill(0);
      tempStockValue.unshift("Stock Value");

      this.corporationsWealth.forEach((value, index) => {
        for (
          let innerIndex = 1;
          innerIndex < this.playerCorporationOwnership[index].length;
          innerIndex++
        ) {
          tempStockValue[innerIndex] =
            tempStockValue[innerIndex] +
            (value.stockValue *
              this.playerCorporationOwnership[index][innerIndex].value) /
              10; // Divide by 10 to get percentage
        }
      });

      this.playersStockValue = tempStockValue;
    },

    runSimulation() {
      var tempStockValue = Array(this.selectedPlayerCount).fill(0);
      tempStockValue.unshift("Simulated OR's Value");

      this.corporationsWealth.forEach((value, index) => {
        for (
          let innerIndex = 1;
          innerIndex < this.playerCorporationOwnership[index].length;
          innerIndex++
        ) {
          tempStockValue[innerIndex] =
            tempStockValue[innerIndex] +
            ((value.revenue *
              this.playerCorporationOwnership[index][innerIndex].value) /
              10) *
              this.simulatedRounds; // Divide by 10 to get percentage
        }
      });

      this.playerSimulatedIncome = tempStockValue;
    },

    changeNumberSimulationRounds(change) {
      this.simulatedRounds = this.simulatedRounds + change;
      this.runSimulation();
    },
  },

  computed: {
    totalWealth() {
      var tempTotalWealth = ["Total Wealth"];

      for (let index = 1; index < this.playersStockValue.length; index++) {
        tempTotalWealth.push(
          this.playersStockValue[index] +
            Number(this.playersCash[index].value) +
            this.playerSimulatedIncome[index]
        );
      }

      return tempTotalWealth;
    },

    bankSummation() {
      var cash = this.playersCash.reduce((acc, obj, currentIndex) => {
        if (currentIndex == 1) {
          return Number(obj.value);
        } else {
          return Number(acc) + Number(obj.value);
        }
      });

      return (
        this.playerSimulatedIncome.reduce(
          (previousValue, currentValue, currentIndex) => {
            if (currentIndex == 1) {
              return currentValue;
            } else {
              return previousValue + currentValue;
            }
          }
        ) + cash
      );
    },
  },

  watch: {
    selectedPlayerCount(newValue, oldValue) {
      if (oldValue) {
        var isPositiv = newValue - oldValue > 0;
        var diff = Math.abs(newValue - oldValue);

        for (let index = 0; index < diff; index++) {
          if (isPositiv) {
            this.playerCorporationOwnership.forEach(
              (corporation, indexInner) => {
                corporation.push({
                  value: null,
                  key: indexInner + "#" + corporation.length,
                });
              }
            );

            this.players.push({
              name: "player-" + Number(this.players.length + 1),
            });

            this.playersStockValue.push(0);
            this.playersCash.push({ value: null });
            this.playerSimulatedIncome.push(0);
          } else {
            this.playerCorporationOwnership.forEach((corporation) => {
              corporation.pop();
            });

            this.players.pop();

            this.playersStockValue.pop();
            this.playersCash.pop();
            this.playerSimulatedIncome.pop();
          }
        }
      }
    },
  },

  created: function () {
    this.games = gameData.map((game) => game.gameName); // Create select options
    this.setupGame();
    this.setupPlayerData();
    this.runSimulation();
  },
};
</script>

<style lang="less" src="./assets/less/_App.less" />
