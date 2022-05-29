var googleAnalyticsMixin = {
  data() {
    return {
      hasGaEventSimulation: false,
    };
  },

  methods: {
    gaEventSimulation: function (value) {
      if (!this.hasGaEventSimulation) {
        console.log("testing sim mixin function");

        this.$gtag.event("used-simulation-rounds", {
          "event-category": "18xx-simulator-events",
          value: value,
        });
        this.hasGaEventSimulation = true;
      }
    },

    gaEventChangeGame: function (value) {
      this.$gtag.event("changed-game", {
        "event-category": "18xx-simulator-events",
        value: value,
      });
    },

    gaEventChangePlayerCount: function (value) {
      this.$gtag.event("changed-player-count", {
        "event-category": "18xx-simulator-events",
        value: value,
      });
    },
  },
};

export default googleAnalyticsMixin;
