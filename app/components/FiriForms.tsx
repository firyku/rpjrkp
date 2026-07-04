
import { useState } from 'react';
import { Plus, Edit3, Trash2, Save } from 'lucide-react';

export default function FiriForms() {
  const [pekerjaanList, setPekerjaanList] = useState<{id: number, title: string, desc: string, deadline: string}[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', desc: '', deadline: '' });

  const handleSave = () => {
    if (editingId) {
      setPekerjaanList(pekerjaanList.map(item => item.id === editingId ? { ...formData, id: editingId } : item));
      setEditingId(null);
    } else {
      setPekerjaanList([...pekerjaanList, { ...formData, id: Date.now() }]);
    }
    setFormData({ title: '', desc: '', deadline: '' });
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleDelete = (id: number) => {
    setPekerjaanList(pekerjaanList.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <section id="pekerjaan" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Pekerjaan</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2" onClick={() => {setEditingId(null); setFormData({title: '', desc: '', deadline: ''})}}><Plus size={18}/> Tambah</button>
        </div>
        <div className="space-y-4 mb-6">
          <input type="text" placeholder="Judul" className="w-full p-3 border rounded-xl" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <textarea placeholder="Deskripsi" className="w-full p-3 border rounded-xl" value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} />
          <input type="date" className="w-full p-3 border rounded-xl" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
          <button onClick={handleSave} className="bg-sky-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Save size={18}/> {editingId ? 'Update' : 'Simpan'}</button>
        </div>
        <div className="space-y-2">
          {pekerjaanList.map(item => (
            <div key={item.id} className="flex justify-between items-center p-4 border rounded-xl">
              <div><h3 className="font-bold">{item.title}</h3><p className="text-sm text-gray-500">{item.deadline}</p></div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="text-blue-500"><Edit3 size={18}/></button>
                <button onClick={() => handleDelete(item.id)} className="text-red-500"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* ... Repeat similar pattern for other sections ... */}
    </div>
  );
}
