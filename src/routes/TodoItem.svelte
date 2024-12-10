<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    export let todo: { id: number; title: string; completed: boolean };
    export let isLoading = false;
  
    const dispatch = createEventDispatcher();
  
    function toggleTodo() {
      dispatch('toggle', !todo.completed);
    }
  
    function deleteTodo() {
      dispatch('delete');
    }
  </script>
  
  <li class="py-4">
    <div class="flex items-center">
      <input
        type="checkbox"
        checked={todo.completed}
        on:change={toggleTodo}
        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        disabled={isLoading}
      />
      <label for="todo-{todo.id}" class="ml-3 block text-gray-900">
        <span class={todo.completed ? 'line-through text-gray-500' : ''}>{todo.title}</span>
      </label>
      <button
        on:click={deleteTodo}
        class="ml-auto bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs disabled:opacity-50"
        disabled={isLoading}
      >
        Delete
      </button>
    </div>
  </li>