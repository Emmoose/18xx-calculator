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
            <select v-model="selectedGame" @change="setupGame(false)">
              <option v-for="game in games" v-bind:key="game">
                {{ game }}
              </option>
            </select>
          </div>
          <div class="flex-column">
            <label>Select Player number</label>
            <select
              v-model.number="selectedPlayerCount"
              @change="changePlayerCount"
            >
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
        <div
          class="companyvalue-matrix"
          v-on:scroll="calulateIfCorpNameOutside('outsideCompanyValue')"
        >
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
                  ref="outsideCompanyValue"
                  class="td-corporation"
                  :style="{
                    'background-color': corporations[index].color,
                    color: corporations[index].text,
                  }"
                >
                  {{ corporations[index].name }}
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
                    @change="calculatePlayerStockValue"
                    @focus="
                      showCorporationTip(index, 'corporationTipCompanyValue')
                    "
                    @blur="hideCorporationTip('corporationTipCompanyValue')"
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
                    @change="runSimulation"
                    @focus="
                      showCorporationTip(index, 'corporationTipCompanyValue')
                    "
                    @blur="hideCorporationTip('corporationTipCompanyValue')"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        class="corporation-ownership-matrix"
        v-on:scroll="calulateIfCorpNameOutside('outsideCorporationOwnership')"
      >
        <div
          v-if="
            (outsideCompanyValue && corporationTipCompanyValue) ||
            (outsideCorporationOwnership && corporationTipOwnership)
          "
          class="corp-name-mobile"
          :style="{
            'background-color': inputFocusedCorporation.color,
            color: inputFocusedCorporation.text,
          }"
        >
          {{ inputFocusedCorporation.name }}
        </div>
        <table>
          <thead>
            <tr>
              <th :colspan="players.length + 1">Corporations Ownership</th>
            </tr>
            <tr>
              <th>Corporation</th>
              <th v-for="(player, index) in players" v-bind:key="index">
                <input
                  type="text"
                  v-model.number="player.name"
                  v-on:change="updateLocalStorage"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(companyRow, index) in playerCorporationOwnership"
              v-bind:key="index"
            >
              <td ref="outsideCorporationOwnership">
                <div
                  class="td-corporation"
                  v-if="corporations[index].name"
                  :style="{
                    'background-color': corporations[index].color,
                    color: corporations[index].text,
                  }"
                >
                  {{ corporations[index].name }}
                </div>
              </td>

              <td
                v-for="cell in companyRow"
                v-bind:key="cell.key"
                ref="outsideCorporationOwnership"
              >
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
                  @focus="showCorporationTip(index, 'corporationTipOwnership')"
                  @blur="hideCorporationTip('corporationTipOwnership')"
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
              <td>Stock Value</td>
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
              <td>Cash</td>
              <td v-for="(cash, index) in playersCash" v-bind:key="index">
                <span
                  class="currency-on-input"
                  v-bind:class="{
                    left: currency.location == 'left',
                    right: currency.location == 'right',
                  }"
                  >{{ currency.sign }}</span
                >
                <input v-model.number="cash.value" placeholder="Cash" />
              </td>
            </tr>
            <tr>
              <td>Simulated OR's Value</td>
              <td
                v-for="(cash, index) in playerSimulatedIncome"
                v-bind:key="index"
              >
                <span
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
              <td>Total Wealth</td>
              <td v-for="(wealth, index) in totalWealth" v-bind:key="index">
                <span
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

export default {
  name: "App",

  data: function () {
    return {
      games: [],
      initialGameSetup: true,
      selectedGame: "18Chesapeake",
      playerCounts: [],
      selectedPlayerCount: null,
      oldSelectedPlayerCount: null,
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

      outsideCompanyValue: false,
      outsideCorporationOwnership: false,
      corporationTipCompanyValue: false,
      corporationTipOwnership: false,

      inputFocusedCorporation: { information: { color: null, text: null } },
    };
  },

  methods: {
    setupGame(cachedSetup) {
      this.selectedGameData = gameData.filter(
        (game) => game.gameName == this.selectedGame
      )[0];

      this.corporations = this.selectedGameData.corporations;
      this.currency = this.selectedGameData.currency;

      this.setupPlayerCountOptions(cachedSetup);
    },

    setupPlayerCountOptions(cachedSetup) {
      var tempPlayerCounts = [];

      for (
        let index = this.selectedGameData.minPlayer;
        index <= this.selectedGameData.maxPlayer;
        index++
      ) {
        tempPlayerCounts.push(index);
      }

      this.playerCounts = tempPlayerCounts;

      if (!cachedSetup) {
        this.selectedPlayerCount = this.oldSelectedPlayerCount =
          this.selectedGameData.minPlayer;

        this.setupPlayerData();
      }
    },

    setupPlayerData() {
      this.simulatedRounds = 0;

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
        .map(() => ({
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

      // List player cash
      this.playersCash = Array(this.selectedPlayerCount)
        .fill()
        .map(() => ({
          value: null,
        }));

      this.playerSimulatedIncome = Array(this.selectedPlayerCount).fill(0);
      this.updateLocalStorage();
    },

    proxyCalcOwnershipDep() {
      this.calculatePlayerStockValue();
      this.runSimulation();
    },

    //BAD IMPLEMENTATION LOOPING THROUGH ALL CAN IT BE DONE WITH COMPUTED OR SIMILAR?
    calculatePlayerStockValue() {
      var tempStockValue = Array(this.selectedPlayerCount).fill(0);

      this.corporationsWealth.forEach((value, index) => {
        for (
          let innerIndex = 0;
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
      this.updateLocalStorage();
    },

    runSimulation() {
      var tempStockValue = Array(this.selectedPlayerCount).fill(0);

      this.corporationsWealth.forEach((value, index) => {
        for (
          let innerIndex = 0;
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
      this.updateLocalStorage();
    },

    changeNumberSimulationRounds(change) {
      this.simulatedRounds = this.simulatedRounds + change;
      this.runSimulation();
      this.updateLocalStorage();
    },

    showCorporationTip(index, table) {
      this[table] = true;
      this.inputFocusedCorporation = this.corporations[index];
    },

    hideCorporationTip(table) {
      this[table] = false;
    },

    calulateIfCorpNameOutside(element) {
      this.$refs[element][0].getBoundingClientRect().x < -220
        ? (this[element] = true)
        : (this[element] = false);
    },

    changePlayerCount() {
      var isPositiv =
        this.selectedPlayerCount - this.oldSelectedPlayerCount > 0;
      var diff = Math.abs(
        this.selectedPlayerCount - this.oldSelectedPlayerCount
      );
      for (let index = 0; index < diff; index++) {
        if (isPositiv) {
          this.playerCorporationOwnership.forEach((corporation, indexInner) => {
            corporation.push({
              value: null,
              key: indexInner + "#" + corporation.length,
            });
          });

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

      this.oldSelectedPlayerCount = this.selectedPlayerCount;
      this.updateLocalStorage();
    },

    updateLocalStorage() {
      var localStorageCopy = {
        selectedGame: this.selectedGame,
        selectedPlayerCount: this.selectedPlayerCount,
        players: this.players,
        playersCash: this.playersCash,
        corporationsWealth: this.corporationsWealth,
        playerCorporationOwnership: this.playerCorporationOwnership,
        playersStockValue: this.playersStockValue,
        playerSimulatedIncome: this.playerSimulatedIncome,
        simulatedRounds: this.simulatedRounds,
      };

      localStorage.setItem("savedXXGame", JSON.stringify(localStorageCopy));
    },
  },

  computed: {
    totalWealth() {
      var tempTotalWealth = [];

      for (let index = 0; index < this.playersStockValue.length; index++) {
        tempTotalWealth.push(
          this.playersStockValue[index] +
            Number(this.playersCash[index].value) +
            this.playerSimulatedIncome[index]
        );
      }

      return tempTotalWealth;
    },

    bankSummation() {
      var cash = this.playersCash.reduce((acc, obj, index) => {
        if (index == 1) {
          return Number(acc.value) + Number(obj.value);
        } else {
          return Number(acc) + Number(obj.value);
        }
      });

      return (
        this.playerSimulatedIncome.reduce((previousValue, currentValue) => {
          return previousValue + currentValue;
        }) + cash
      );
    },
  },

  created: function () {
    this.games = gameData.map((game) => game.gameName); // Create select options

    var savedXXGame = JSON.parse(window.localStorage.getItem("savedXXGame"));

    if (savedXXGame) {
      this.selectedGame = savedXXGame.selectedGame;
      this.selectedPlayerCount = savedXXGame.selectedPlayerCount;
      this.oldSelectedPlayerCount = savedXXGame.selectedPlayerCount;
      this.corporationsWealth = JSON.parse(
        JSON.stringify(savedXXGame.corporationsWealth)
      );
      this.playerCorporationOwnership = JSON.parse(
        JSON.stringify(savedXXGame.playerCorporationOwnership)
      );
      this.playerSimulatedIncome = JSON.parse(
        JSON.stringify(savedXXGame.playerSimulatedIncome)
      );
      this.players = JSON.parse(JSON.stringify(savedXXGame.players));
      this.playersCash = JSON.parse(JSON.stringify(savedXXGame.playersCash));
      this.playersStockValue = JSON.parse(
        JSON.stringify(savedXXGame.playersStockValue)
      );
      this.simulatedRounds = JSON.parse(
        JSON.stringify(savedXXGame.simulatedRounds)
      );
      this.setupGame(true);
    } else {
      this.setupGame(false);
    }

    this.runSimulation();
  },
};
</script>

<style lang="less" src="./assets/less/_App.less" />
