<template>
  <div class="holdingErrorMessage" v-if="checkAbove100Percentage.length > 0">
    <span
      v-for="(corporation, index) in checkAbove100Percentage"
      v-bind:key="index"
    >
      {{
        `${corporation}${index < checkAbove100Percentage.length - 1 ? "," : ""}`
      }} </span
    ><span> is above 100 % ownership!</span>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "HoldingErrorMessage",

  computed: {
    ...mapState(["checkAbove100Percentage"]),
  },
};
</script>
