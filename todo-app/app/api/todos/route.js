import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/todos -> list all todos, soonest deadline first
export async function GET() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('deadline', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/todos -> create a todo
// body: { title: string, description?: string, deadline: string (ISO) }
export async function POST(request) {
  const body = await request.json();

  if (!body.title || !body.title.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  if (!body.deadline) {
    return NextResponse.json({ error: 'Deadline is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('todos')
    .insert({
      title: body.title.trim(),
      description: body.description?.trim() || null,
      deadline: body.deadline,
      completed: false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
