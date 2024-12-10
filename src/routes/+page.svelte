<script lang="ts">
    import { onMount } from 'svelte';
    import TodoItem from './TodoItem.svelte';
    import Loader from './Loader.svelte';
  
    let todos: Array<{ id: number; title: string; completed: boolean }> = [];
    let newTodoTitle = '';
    let isLoading = true;
  
    onMount(async () => {
      await fetchTodos();
    });
  
    async function fetchTodos() {
      isLoading = true;
      const response = await fetch('/api/todos');
      todos = await response.json();
      isLoading = false;
    }
  
    async function addTodo() {
      if (newTodoTitle.trim()) {
        isLoading = true;
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTodoTitle }),
        });
        const newTodo = await response.json();
        todos = [...todos, newTodo];
        newTodoTitle = '';
        isLoading = false;
      }
    }
  
    async function toggleTodo(id: number, completed: boolean) {
      isLoading = true;
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed }),
      });
      const updatedTodo = await response.json();
      todos = todos.map((todo) => (todo.id === id ? updatedTodo : todo));
      isLoading = false;
    }
  
    async function deleteTodo(id: number) {
      isLoading = true;
      await fetch('/api/todos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      todos = todos.filter((todo) => todo.id !== id);
      isLoading = false;
    }
  </script>
  
  <main class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-4 py-5 sm:p-6">
        <h1 class="text-3xl font-bold text-primary-600 mb-6">Todo App</h1>
        <form on:submit|preventDefault={addTodo} class="mb-6">
          <div class="flex items-center border-b border-primary-300 py-2">
            <input
              bind:value={newTodoTitle}
              type="text"
              placeholder="Add a new todo..."
              class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
            <button
              type="submit"
              class="flex-shrink-0 bg-primary-500 hover:bg-primary-600 border-primary-500 hover:border-primary-600 text-sm border-4 text-white py-1 px-2 rounded"
              disabled={isLoading}
            >
              Add
            </button>
          </div>
        </form>
        {#if isLoading}
          <div class="flex justify-center items-center py-4">
            <Loader />
          </div>
        {:else}
          <ul class="divide-y divide-gray-200">
            {#each todos as todo (todo.id)}
              <TodoItem {todo} on:toggle={(e) => toggleTodo(todo.id, e.detail)} on:delete={() => deleteTodo(todo.id)} />
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </main>