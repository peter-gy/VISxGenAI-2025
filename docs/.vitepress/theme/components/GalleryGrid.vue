<template>
  <div class="gallery-grid">
    <slot />
  </div>
</template>

<script setup>
// This component provides the grid layout for gallery cards
// It uses slots to allow flexible content composition
</script>

<style scoped>
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
