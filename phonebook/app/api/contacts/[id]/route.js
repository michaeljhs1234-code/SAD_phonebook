import { createSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const supabase = createSupabaseClient();
  const { id } = await params;
  const { name, phone } = await request.json();

  if (!name || !phone) {
    return NextResponse.json({ error: '이름과 전화번호를 입력해주세요.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('contacts')
    .update({ name, phone })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request, { params }) {
  const supabase = createSupabaseClient();
  const { id } = await params;

  const { error } = await supabase.from('contacts').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
