import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Pencil, Trash2, X, AlertTriangle, Save, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, type Product, CATEGORIES } from "@/lib/mock-data";
import { getProducts, deleteProduct, updateProduct } from "@/services/api";

export const Route = createFileRoute("/admin/manage-items")({
  head: () => ({ meta: [{ title: "Manage Items — Eve Admin" }] }),
  component: ManageItems,
});

function ManageItems() {
  const [list, setList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<Product | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", price: 0, stock: 0, category: "" });
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setList(res.data.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Delete product via API
  const del = async (p: Product) => {
    try {
      await deleteProduct(p._id);
      setList((prev) => prev.filter((i) => i._id !== p._id));
      toast.success(`${p.name} deleted`);
      setConfirm(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  // Open edit modal
  const openEdit = (p: Product) => {
    setEditing(p);
    setEditForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, category: p.category });
    setEditPreview(p.image);
    setEditImage(null);
  };

  // Handle edit image change
  const onEditFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setEditPreview(URL.createObjectURL(f));
      setEditImage(f);
    }
  };

  // Save edited product via API
  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("price", String(editForm.price));
      formData.append("stock", String(editForm.stock));
      formData.append("category", editForm.category);
      if (editImage) {
        formData.append("image", editImage);
      }

      const res = await updateProduct(editing._id, formData);
      const updated = res.data.data;
      setList((prev) => prev.map((i) => i._id === editing._id ? updated : i));
      toast.success(`${updated.name} updated`);
      setEditing(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const field = "w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl text-gold">Manage Products</motion.h1>
      <p className="mt-1 text-sm text-white/60">{list.length} products in your boutique</p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-8 glass-dark rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-widest text-white/50 bg-white/5">
              <tr>
                <th className="text-left px-6 py-3">Image</th>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Description</th>
                <th className="text-left px-6 py-3">Price</th>
                <th className="text-left px-6 py-3">Stock</th>
                <th className="text-right px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {list.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-white/40">No products yet. Add your first product!</td></tr>
              )}
              {list.map((p) => (
                <tr key={p._id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="h-14 w-14 rounded-xl object-cover" />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-white/5 grid place-items-center"><ImageIcon className="h-6 w-6 text-white/30" /></div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gold">{p.name}</td>
                  <td className="px-6 py-4 text-white/70 max-w-xs"><span className="line-clamp-2">{p.description}</span></td>
                  <td className="px-6 py-4">{formatPrice(p.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2 py-1 text-xs ${p.stock > 20 ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300"}`}>
                      {p.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-full bg-white/5 hover:bg-gold hover:text-primary transition"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setConfirm(p)} className="p-2 rounded-full bg-white/5 hover:bg-rose-500 transition"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setConfirm(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl bg-sidebar text-white p-8 border border-white/10 shadow-luxe"
          >
            <button onClick={() => setConfirm(null)} className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10"><X className="h-4 w-4" /></button>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-500/20 text-rose-300">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-xl text-center">Delete this product?</h3>
            <p className="mt-2 text-sm text-white/60 text-center">"{confirm.name}" will be permanently removed.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 rounded-full border border-white/20 py-2.5 text-sm hover:bg-white/10">Cancel</button>
              <button onClick={() => del(confirm)} className="flex-1 rounded-full bg-rose-500 hover:bg-rose-600 py-2.5 text-sm font-medium">Delete</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditing(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-sidebar text-white p-8 border border-white/10 shadow-luxe max-h-[90vh] overflow-y-auto"
          >
            <button onClick={() => setEditing(null)} className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10"><X className="h-4 w-4" /></button>
            <h3 className="font-display text-2xl text-gold">Edit Product</h3>

            <div className="mt-6 grid gap-4">
              {/* Image */}
              <label className="group flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed border-white/20 hover:border-gold transition-colors cursor-pointer overflow-hidden">
                {editPreview ? (
                  <img src={editPreview} alt="preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center p-6 text-white/50">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-xs">Click to change image</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={onEditFile} className="hidden" />
              </label>

              <div>
                <label className="text-xs uppercase tracking-widest text-white/60">Name</label>
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={`mt-1.5 ${field}`} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-white/60">Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} className={`mt-1.5 ${field} resize-none`} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs uppercase tracking-widest text-white/60">Price (₹)</label>
                  <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} className={`mt-1.5 ${field}`} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-white/60">Stock</label>
                  <input type="number" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })} className={`mt-1.5 ${field}`} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-white/60">Category</label>
                  <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className={`mt-1.5 ${field}`}>
                    {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} className="bg-sidebar">{c}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={saveEdit} disabled={saving} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold text-primary font-medium py-3 shadow-gold hover:shadow-luxe transition disabled:opacity-60">
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
