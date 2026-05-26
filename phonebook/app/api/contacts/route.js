import { createSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const supabase = createSupabaseClient();
  const { name, phone } = await request.json();

  if (!name || !phone) {
    return NextResponse.json({ error: '이름과 전화번호를 입력해주세요.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert([{ name, phone }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
