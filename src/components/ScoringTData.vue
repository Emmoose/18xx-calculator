<template>
  <td>
    <slot><inputSign /></slot>
    {{ Math.ceil(cellValue) }}
  </td>
</template>

<script>
import inputSign from "@/components/inputSign";

export default {
  name: "ScoringTData",
  components: {
    inputSign,
  },

  props: {
    cellValue: Number,
  },
};
</script>
