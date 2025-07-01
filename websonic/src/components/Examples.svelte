<script>
  import { createEventDispatcher } from 'svelte';
  import { examples as examplesByCategory } from 'websonic-engine';

  const dispatch = createEventDispatcher();

  function handleSelect(example) {
    dispatch('select', example);
  }
</script>

<div class="examples">
  <h2>Examples</h2>
  {#each Object.entries(examplesByCategory) as [category, examples]}
    <div class="category">
      <h3>{category}</h3>
      <ul>
        {#each examples as example}
          <li>
            <button on:click={() => handleSelect(example)}>
              {example.name}
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</div>

<style>
  .examples {
    padding: 1rem;
    background-color: var(--editor-background);
    color: var(--text-color);
    height: 100%;
    overflow-y: auto;
  }

  h2 {
    margin-top: 0;
    color: var(--primary-color);
  }

  h3 {
    color: var(--primary-color);
    margin-top: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  button {
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    font-size: 1rem;
    text-align: left;
    padding: 0;
  }

  button:hover {
    color: var(--primary-color);
  }
</style>
