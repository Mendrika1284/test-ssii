<template>
  <h1 class="pageTitleH1"><slot /></h1>
</template>
<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "TitleH1",
});
</script>

<style lang="scss" scoped>
.pageTitleH1 {
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  color: #18191d;
  margin-bottom: 20px;
}
</style>
