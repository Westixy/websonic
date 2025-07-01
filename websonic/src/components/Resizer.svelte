<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function onMouseDown(e) {
    e.preventDefault();

    function onMouseMove(e) {
      dispatch('move', { y: e.clientY });
    }

    function onMouseUp() {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
</script>

<div class="resizer" on:mousedown={onMouseDown}></div>

<style>
  .resizer {
    height: 5px;
    background-color: var(--border-color);
    cursor: ns-resize;
    flex-shrink: 0;
  }
  .resizer:hover {
    background-color: var(--primary-color);
  }
</style>
