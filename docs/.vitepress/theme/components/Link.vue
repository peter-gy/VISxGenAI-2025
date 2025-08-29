<template>
  <a :href="linkUrl" v-bind="$attrs">
    <slot />
  </a>
</template>

<script setup>
import { computed } from "vue";
import { withBase } from "../utils";

const props = defineProps({
	href: {
		type: String,
		required: true,
	},
});

const linkUrl = computed(() => withBase(props.href));
</script>

<style scoped>
a {
  color: inherit;
  text-decoration: inherit;
}

a:hover {
  text-decoration: underline;
}
</style>
