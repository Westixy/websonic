<script>
  import { createEventDispatcher, afterUpdate } from 'svelte';
  export let messages = [];
  const dispatch = createEventDispatcher();

  let messagesEl;

  afterUpdate(() => {
    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  });
</script>

<div class="console">
  <div class="header">
    <span>Console</span>
    <button on:click={() => dispatch('clear')}>Clear</button>
  </div>
  <div class="messages" bind:this={messagesEl}>
    {#each messages as msg}
      <div class="message" class:error={msg.type === 'error'}>
        <span class="timestamp">[{msg.time}]</span>
        <span class="content">{msg.content}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .console {
    display: flex;
    flex-direction: column;
    background-color: var(--editor-background);
    color: var(--text-color);
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 0.9rem;
    border-top: 1px solid var(--border-color);
    height: 200px; /* Set a fixed height for the console */
    flex-shrink: 0; /* Prevent the console from shrinking */
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    font-weight: bold;
    border-bottom: 1px solid var(--border-color);
    background-color: #3a3a3a;
    flex-shrink: 0;
  }

  button {
    padding: 0.2rem 0.5rem;
    border: 1px solid var(--primary-color);
    border-radius: 4px;
    background-color: transparent;
    color: var(--primary-color);
    cursor: pointer;
    font-size: 0.8rem;
  }

  button:hover {
    background-color: var(--primary-color);
    color: var(--background-color);
  }

  .messages {
    flex-grow: 1;
    padding: 0.5rem 1rem;
    overflow-y: auto;
  }

  .message {
    margin-bottom: 0.25rem;
  }

  .message.error {
    color: #ff5555;
  }

  .timestamp {
    color: #888;
    margin-right: 0.5rem;
  }
</style>

