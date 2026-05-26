'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchContacts() {
    try {
      setError(null);
      const res = await fetch('/api/contacts');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '연락처를 불러오는데 실패했습니다.');
      }
      if (Array.isArray(data)) {
        setContacts(data);
      } else {
        setContacts([]);
      }
    } catch (err) {
      console.error(err);
      setError('데이터베이스 연결 실패: Supabase 설정 및 환경변수(env)를 확인해주세요.');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    try {
      setError(null);
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '연락처 추가에 실패했습니다.');
      }
      setForm({ name: '', phone: '' });
      fetchContacts();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      setError(null);
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '연락처 삭제에 실패했습니다.');
      }
      fetchContacts();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  function startEdit(contact) {
    setEditingId(contact.id);
    setEditForm({ name: contact.name, phone: contact.phone });
  }

  async function handleEdit(e) {
    e.preventDefault();
    try {
      setError(null);
      const res = await fetch(`/api/contacts/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '연락처 수정에 실패했습니다.');
      }
      setEditingId(null);
      fetchContacts();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            전화번호부
          </h1>
          <p className="text-gray-500 text-sm">Supabase와 함께하는 안전하고 빠른 연락처 관리 시스템</p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3.5 rounded-xl mb-6 text-sm flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600 font-bold text-lg ml-2 transition">
              &times;
            </button>
          </div>
        )}

        {/* 추가 폼 */}
        <form onSubmit={handleAdd} className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm p-6 mb-8 flex flex-col sm:flex-row gap-3 transition-all duration-300 hover:shadow-md">
          <input
            type="text"
            placeholder="이름"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="flex-1 border border-gray-200 bg-white/50 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
          <input
            type="tel"
            placeholder="전화번호"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            className="flex-1 border border-gray-200 bg-white/50 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow active:scale-95"
          >
            추가
          </button>
        </form>

        {/* 연락처 목록 */}
        <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 text-sm">불러오는 중...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-gray-400 text-sm">저장된 연락처가 없습니다.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">이름</th>
                  <th className="px-6 py-4">전화번호</th>
                  <th className="px-6 py-4 text-right">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {contacts.map((contact) =>
                  editingId === contact.id ? (
                    <tr key={contact.id} className="bg-blue-50/30">
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="border border-blue-300 rounded-lg px-3 py-1.5 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="border border-blue-300 rounded-lg px-3 py-1.5 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="px-6 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={handleEdit}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg mr-2 transition-all active:scale-95 shadow-sm"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-150 hover:bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95"
                        >
                          취소
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={contact.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-800">{contact.name}</td>
                      <td className="px-6 py-4 text-gray-600 font-mono">{contact.phone}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => startEdit(contact)}
                          className="bg-amber-400 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg mr-2 transition-all active:scale-95 shadow-sm"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
