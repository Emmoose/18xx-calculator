<template>
  <div id="app" class="app">
    <div class="calculator">
      <h1>18xx calculator</h1>
      <p class="info-text">
        A simple tool for scoring results in 18xx games. It can calculate end
        stock value and operating rounds with full payout. A wide array of 18xx
        titles are available.
      </p>
      <p class="info-text">
        Thoughts, ideas, comments etc, please contact me:
        <a href="mailto: emil.mossberg@gmail.com">emil.mossberg@gmail.com</a>.
      </p>
      <div class="top-row">
        <GameSettings />
        <CorpHintMobile />
        <GameTable
          :table-data="corporationsWealth"
          :update-action="'updateCorporationWealth'"
          :td-placeholder="[' Stock value', 'Revenue']"
        >
          <template v-slot:table-header>
            <CorpWealthTHeader />
          </template>
          <template v-slot:input-sign> </template>
        </GameTable>
      </div>
      <GameTable
        :table-data="playerCorporationOwnership"
        :update-action="'updateCorporationOwnership'"
        :td-placeholder="PlaceholderValuesHoldings"
      >
        <template v-slot:table-header>
          <HoldingsTHeader />
        </template>
        <template v-slot:input-sign>
          <span class="input-sign right">%</span>
        </template>
        <template v-slot:additional-rows>
          <thead>
            <tr>
              <th class="main-header" :colspan="selectedPlayerCount + 1">
                Players Scoring Summary Table
              </th>
            </tr>
          </thead>
          <ScoringRows />
        </template>
      </GameTable>
      <BankSummary />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { version } from "../package";
import config from "@/config.js";
import GameSettings from "./components/GameSettings";
import BankSummary from "./components/BankSummary";
import ScoringRows from "@/components/ScoringRows";
import CorpHintMobile from "./components/CorpHintMobile";
import CorpWealthTHeader from "./components/CorpWealthTHeader";
import GameTable from "./components/GameTable";
import HoldingsTHeader from "./components/HoldingsTHeader";

export default {
  name: "App",
  components: {
    BankSummary,
    CorpHintMobile,
    GameTable,
    CorpWealthTHeader,
    GameSettings,
    HoldingsTHeader,
    ScoringRows,
  },

  methods: {
    setupNewGame(gameName) {
      this.$store.dispatch("setupNewGame", gameName);
    },
  },

  computed: {
    ...mapState([
      "corporationsWealth",
      "playerCorporationOwnership",
      "selectedPlayerCount",
    ]),
    ...mapGetters(["PlaceholderValuesHoldings"]),
  },

  created() {
    this.$store.dispatch("setupGameOptions");

    const savedXXGame = JSON.parse(window.localStorage.getItem("savedXXGame"));

    savedXXGame && savedXXGame.version === version
      ? this.$store.dispatch("setupCachedGame", savedXXGame)
      : this.$store.dispatch("setupNewGame", config.DEFAULT_GAME);
  },
};
</script>

<style lang="less" src="./assets/less/_App.less" global />
