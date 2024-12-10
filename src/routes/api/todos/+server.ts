import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { todos } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export async function GET() {
  const allTodos = await db.select().from(todos).orderBy(todos.createdAt);
  return json(allTodos);
}

export async function POST({ request }) {
  const { title } = await request.json();
  const newTodo = await db.insert(todos).values({ title }).returning();
  return json(newTodo[0]);
}

export async function PUT({ request }) {
  const { id, completed } = await request.json();
  const updatedTodo = await db
    .update(todos)
    .set({ completed })
    .where(eq(todos.id, id))
    .returning();
  return json(updatedTodo[0]);
}

export async function DELETE({ request }) {
  const { id } = await request.json();
  await db.delete(todos).where(eq(todos.id, id));
  return json({ success: true });
}