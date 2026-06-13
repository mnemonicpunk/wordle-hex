<script lang="ts">
  import confetti from 'canvas-confetti';
  import { onMount } from 'svelte';
  import { settings } from '../settings.svelte';

  // Colors aligned with the theme palette
  const PALETTES: Record<string, string[]> = {
    light:          ['#538d4e','#b59f3b','#d3d6da','#1a1a1b'],
    dark:           ['#538d4e','#b59f3b','#818384','#ffffff'],
    'high-contrast':['#f5793a','#85c0f9','#ffffff','#f5793a'],
  };

  onMount(() => {
    const colors = PALETTES[settings.theme] ?? PALETTES.dark;

    // First burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.55 },
      colors,
      scalar: 1.1,
    });

    // Follow-up burst for depth
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 90,
        origin: { y: 0.45, x: 0.35 },
        colors,
        scalar: 0.9,
      });
      confetti({
        particleCount: 60,
        spread: 90,
        origin: { y: 0.45, x: 0.65 },
        colors,
        scalar: 0.9,
      });
    }, 200);
  });
</script>
