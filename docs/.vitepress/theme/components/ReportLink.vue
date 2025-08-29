<template>
  <div class="report-controls">
    <a :href="linkUrl" target="_blank">
      {{ linkText }}
    </a>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { withBase } from "../utils";

const props = defineProps({
	src: {
		type: String,
		required: true,
	},
	linkText: {
		type: String,
		default: "Open in Full Page ↗",
	},
});

const linkUrl = computed(() => withBase(props.src));
</script>

<style scoped>
.report-controls {
  margin: 1.5rem 0;
  text-align: left;
}
</style>
