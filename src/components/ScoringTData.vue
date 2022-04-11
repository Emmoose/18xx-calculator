<template>
  <td>
    <slot><CurrencySign /></slot>
    {{ Math.ceil(cellValue) }}
  </td>
</template>

<script>
import CurrencySign from "@/components/CurrencySign";

export default {
  name: "ScoringTData",
  components: {
    CurrencySign,
  },

  props: {
    cellValue: Number,
  },
};
</script>
