<template>
  <div id="app" class="app">
    <h1 class="appHeader">18xx calculator</h1>
    <div class="calculator">
      <div>TESTING3 Dev version</div>
      <p class="infoText">
        A simple tool for scoring results in 18xx games. It can calculate end
        stock value and simulate operating rounds revenue. Operating rounds
        revenue can either be equal or different. A wide array of 18xx titles
        are available.
      </p>
      <p class="infoText">
        Thoughts, ideas, comments etc, please contact me:
        <a href="mailto: emil.mossberg@gmail.com">emil.mossberg@gmail.com</a>.
      </p>
      <div class="topRow">
        <div class="leftColumn"><GameSettings /> <BankSummary /></div>

        <GameTable
          :table-data="corporationsWealth"
          :disabled="simulatedRounds === 0"
          :update-action="'updateCorporationWealth'"
          :td-placeholder="placeholderValuesWealth"
        >
          <template v-slot:table-header>
            <CorpWealthTHeader />
          </template>
          <template slot="additional-cell" slot-scope="{ index }"
            ><SelectTCell :index="index" v-if="multipleShare"
          /></template>
          <template v-slot:input-sign> </template>
          <template v-slot:additional-rows>
            <AdvancedSimulationTRow v-if="advancedSimulation" />
          </template>
        </GameTable>
      </div>
      <CorpHintMobile />
      <div class="bottomRow">
        <HoldingErrorMessage />
        <GameTable
          class="holdingMatrix"
          :table-data="playerCorporationOwnership"
          :update-action="'updateCorporationOwnership'"
          :td-placeholder="placeholderValuesHoldings"
        >
          <template v-slot:table-header>
            <HoldingsTHeader />
          </template>
          <template v-slot:input-sign>
            <span class="inputSign right">%</span>
          </template>
          <template v-slot:additional-rows>
            <thead>
              <tr>
                <th class="mainHeader" :colspan="selectedPlayerCount + 1">
                  Players Scoring Summary Table
                </th>
              </tr>
            </thead>
            <ScoringRows />
          </template>
        </GameTable>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { version } from "../package";
import config from "@/config.js";
import GameSettings from "./components/GameSettings";
import BankSummary from "./components/BankSummary";
import AdvancedSimulationTRow from "./components/AdvancedSimulationTRow";
import ScoringRows from "@/components/ScoringRows";
import CorpHintMobile from "./components/CorpHintMobile";
import CorpWealthTHeader from "./components/CorpWealthTHeader";
import GameTable from "./components/GameTable";
import HoldingsTHeader from "./components/HoldingsTHeader";
import HoldingErrorMessage from "./components/HoldingErrorMessage";
import SelectTCell from "./components/SelectTCell";

export default {
  name: "App",
  components: {
    BankSummary,
    AdvancedSimulationTRow,
    CorpHintMobile,
    GameTable,
    CorpWealthTHeader,
    GameSettings,
    HoldingsTHeader,
    HoldingErrorMessage,
    ScoringRows,
    SelectTCell,
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
      "simulatedRounds",
      "advancedSimulation",
      "multipleShare",
    ]),
    ...mapGetters(["placeholderValuesHoldings", "placeholderValuesWealth"]),
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
