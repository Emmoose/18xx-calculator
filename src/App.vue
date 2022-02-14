<template>
  <div id="app" class="app">
    <div class="calculator">
      <h2>Game: {{ selectedGame }}</h2>
      <div class="top-row">
        <GameSettings
          :games="games"
          :selected-game="selectedGame"
          :selected-player-count="selectedPlayerCount"
          :max-player="selectedGameData.maxPlayer"
          :min-player="selectedGameData.minPlayer"
          v-bind:simulated-rounds="simulatedRounds"
          v-on:change-game="setupNewGame"
          v-on:change-player-count="changePlayerCount"
          v-on:change-simulated-rounds="changeSimulatedRounds"
        />
        <CorporationHintMobile
          :input-focused-corporation="inputFocusedCorporation"
          :show-hint-wealth-table="showHintWealthTable"
          :show-hint-ownership-table="showHintOwnershipTable"
        />
        <CorporationWealthTable
          :corporations="corporations"
          :corporations-wealth="corporationsWealth"
          :currency="currency"
          v-on:calculate-player-stock-value="calculatePlayerStockValue"
          v-on:run-simulator="runSimulation"
          v-on:toggle-corp-hint="toggleCorpHint"
        />
      </div>
      <CorporationOwnershipTable
        :corporations="corporations"
        :currency="currency"
        :players="players"
        :player-corporation-ownership="playerCorporationOwnership"
        :players-stock-value="playersStockValue"
        :player-simulated-income="playerSimulatedIncome"
        v-bind:players-cash="playersCash"
        v-on:update-local-storage="updateLocalStorage"
        v-on:toggle-corp-hint="toggleCorpHint"
      />
      <BankSummary
        :players-cash="playersCash"
        :player-simulated-income="playerSimulatedIncome"
      />
    </div>
  </div>
</template>

<script>
import gameData from "./assets/gameData.json";
import GameSettings from "./components/GameSettings";
import BankSummary from "./components/BankSummary";
import CorporationHintMobile from "./components/CorporationHintMobile";
import CorporationWealthTable from "./components/CorporationWealthTable";
import CorporationOwnershipTable from "./components/CorporationOwnershipTable";

export default {
  name: "App",
  components: {
    BankSummary,
    CorporationHintMobile,
    CorporationWealthTable,
    GameSettings,
    CorporationOwnershipTable,
  },

  data: function () {
    return {
      STORAGE_VERSION: 1,
      // Related to game
      games: [],
      initialGameSetup: true,
      selectedGame: null,
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
        sign: null,
        location: null,
      },

      // Related to mobile corporation hint
      showHintWealthTable: false,
      showHintOwnershipTable: false,
      inputFocusedCorporation: { information: { color: null, text: null } },
    };
  },

  methods: {
    changeSimulatedRounds(numberRounds) {
      this.simulatedRounds = numberRounds;
      this.runSimulation();
    },

    toggleCorpHint(boolean, index, table) {
      if (boolean) {
        this[table] = true;
        this.inputFocusedCorporation = this.corporations[index];
      } else {
        this[table] = false;
      }
    },

    setupCachedGame(savedXXGame) {
      this.selectedGame = savedXXGame.selectedGame;

      this.setupSelectedGameData();

      this.selectedPlayerCount = this.oldSelectedPlayerCount =
        savedXXGame.players.length;
      this.corporationsWealth = JSON.parse(
        JSON.stringify(savedXXGame.corporationsWealth)
      );
      this.playerCorporationOwnership = JSON.parse(
        JSON.stringify(savedXXGame.playerCorporationOwnership)
      );
      this.players = JSON.parse(JSON.stringify(savedXXGame.players));
      this.playersCash = JSON.parse(JSON.stringify(savedXXGame.playersCash));
      this.simulatedRounds = savedXXGame.simulatedRounds;

      this.setupPlayersTotals();
    },

    setupNewGame(gameName) {
      this.selectedGame = gameName;
      this.setupSelectedGameData();

      this.selectedPlayerCount = this.oldSelectedPlayerCount =
        this.selectedGameData.minPlayer;
      // List player cash
      this.playersCash = Array(this.selectedPlayerCount)
        .fill()
        .map(() => ({
          value: null,
        }));
      this.setupMatrixes();
      this.setupPlayersTotals();
      this.updateLocalStorage();
    },

    setupSelectedGameData() {
      this.selectedGameData = gameData.filter(
        (game) => game.gameName == this.selectedGame
      )[0];

      this.corporations = this.selectedGameData.corporations;
      this.currency = this.selectedGameData.currency;
    },

    setupMatrixes() {
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
    },

    setupPlayersTotals() {
      // List player stock value
      this.playersStockValue = Array(this.selectedPlayerCount).fill(0);

      this.playerSimulatedIncome = Array(this.selectedPlayerCount).fill(0);
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

    changePlayerCount(event) {
      this.selectedPlayerCount = parseInt(event.target.value);

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
      localStorage.setItem(
        "savedXXGame",
        JSON.stringify({
          players: this.players,
          playersCash: this.playersCash,
          selectedGame: this.selectedGame,
          corporationsWealth: this.corporationsWealth,
          playerCorporationOwnership: this.playerCorporationOwnership,
          simulatedRounds: this.simulatedRounds,
          STORAGE_VERSION: this.STORAGE_VERSION,
        })
      );
    },
  },

  computed: {
    playersScore() {
      var playersScore = [];

      for (let index = 0; index < this.playersStockValue.length; index++) {
        var totalWealth =
          this.playersStockValue[index] +
          Number(this.playersCash[index].value) +
          this.playerSimulatedIncome[index];

        playersScore.push({ totalWealth });
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

  watch: {
    playerCorporationOwnership: {
      handler() {
        this.runSimulation();
        this.calculatePlayerStockValue();
      },
      deep: true,
    },

    playerCash: {
      handler() {
        this.updateLocalStorage();
      },
      deep: true,
    },
  },

  created: function () {
    this.games = gameData.map((game) => game.gameName); // Create select options
    var savedXXGame = JSON.parse(window.localStorage.getItem("savedXXGame"));
    savedXXGame && savedXXGame.STORAGE_VERSION == this.STORAGE_VERSION
      ? this.setupCachedGame(savedXXGame)
      : this.setupNewGame("18Chesapeake");

    this.runSimulation();
  },
};
</script>

<style lang="less" src="./assets/less/_App.less" />
