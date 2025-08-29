<template>
  <div class="gallery-card">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <a :href="href" class="gallery-link">{{ linkText }} →</a>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true,
  },
  linkText: {
    type: String,
    default: 'View Report',
  },
});
</script>

<style scoped>
.gallery-card {
  display: block;
  border: 1px solid var(--vp-c-border);
  border-radius: 0.5rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
}

.gallery-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px var(--vp-shadow-2);
}

.gallery-card h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: var(--vp-c-text-1);
  font-size: 1.25rem;
  font-weight: 600;
}

.gallery-card p {
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.gallery-link {
  display: inline-flex;
  align-items: center;
  color: var(--vp-c-brand-1);
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.gallery-card:hover .gallery-link {
  color: var(--vp-c-brand-2);
}

@media (max-width: 768px) {
  .gallery-card {
    padding: 1rem;
  }
}

/* Enhanced dark mode support */
@media (prefers-color-scheme: dark) {
  .gallery-card {
    background: var(--vp-c-bg-alt);
  }
  
  .gallery-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}

/* Ensure proper contrast in both modes */
.gallery-card {
  --shadow-color: rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .gallery-card {
  --shadow-color: rgba(0, 0, 0, 0.3);
}

.gallery-card:hover {
  box-shadow: 0 4px 12px var(--shadow-color);
}
</style>
