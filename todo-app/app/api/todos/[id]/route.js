import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// PATCH /api/todos/:id -> update any subset of fields (title, description,
// deadline, completed). Used both for full edits and for the
// complete/incomplete toggle.
export async function PATCH(request, { params }) {
  const { id } = params;
  const body = await request.json();

  const allowedFields = ['title', 'description', 'deadline', 'completed'];
  const updates = {};
  for (const key of allowedFields) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/todos/:id
export async function DELETE(request, { params }) {
  const { id } = params;

  const { error } = await supabase.from('todos').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
