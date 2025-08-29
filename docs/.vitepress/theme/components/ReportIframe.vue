<template>
  <div class="report-container">
    <iframe
      :src="iframeSrc"
      width="100%"
      :height="height"
      frameborder="0"
      :title="title">
    </iframe>
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
	height: {
		type: String,
		default: "1000px",
	},
	title: {
		type: String,
		required: true,
	},
});

const iframeSrc = computed(() => withBase(props.src));
</script>

<style scoped>
.report-container {
  border: 1px solid var(--vp-c-border);
  border-radius: 0.375rem;
  overflow: hidden;
  margin-top: 1rem;
}

.report-container iframe {
  display: block;
  border: none;
}
</style>
