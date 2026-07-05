import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Upload, Save, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/mock-data";
import { createProduct } from "@/services/api";

export const Route = createFileRoute("/admin/add-items")({
  head: () => ({ meta: [{ title: "Add Items — Eve Admin" }] }),
  component: AddItems,
});

type Form = { name: string; description: string; price: number; stock: number; category: string };

function AddItems() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Form>();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setPreview(URL.createObjectURL(f));
      setImageFile(f);
    }
  };

  const onSubmit = async (data: Form) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("stock", String(data.stock));
      formData.append("category", data.category);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await createProduct(formData);
      toast.success("Product saved successfully!");
      reset();
      setPreview(null);
      setImageFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save product");
    }
  };

  const field = "w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";

  return (
    <div className="max-w-4xl">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl text-gold">Add New Product</motion.h1>
      <p className="mt-1 text-sm text-white/60">Upload a new item to the boutique.</p>

      <motion.form
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 glass-dark rounded-3xl border border-white/10 p-8 grid gap-6 lg:grid-cols-[280px_1fr]"
      >
        <div>
          <label className="text-xs uppercase tracking-widest text-white/60">Product Image</label>
          <label className="mt-2 group flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-white/20 hover:border-gold transition-colors cursor-pointer overflow-hidden">
            {preview ? (
              <img src={preview} alt="preview" className="h-full w-full object-cover" />
            ) : (
              <div className="text-center p-6 text-white/50">
                <ImageIcon className="h-10 w-10 mx-auto mb-2 group-hover:text-gold transition" />
                <p className="text-xs">Click to upload<br />PNG or JPG</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={onFile} className="hidden" />
          </label>
          <button type="button" className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full border border-white/20 py-2 text-xs text-white/80 hover:border-gold hover:text-gold transition">
            <Upload className="h-3.5 w-3.5" /> Choose file
          </button>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-white/60">Product Name</label>
            <input {...register("name", { required: true })} className={`mt-1.5 ${field}`} placeholder="e.g. Velvet Rose Serum" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-white/60">Description</label>
            <textarea {...register("description", { required: true })} rows={3} className={`mt-1.5 ${field} resize-none`} placeholder="A luxurious rose-infused serum..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs uppercase tracking-widest text-white/60">Price (₹)</label>
              <input {...register("price", { required: true, valueAsNumber: true })} type="number" className={`mt-1.5 ${field}`} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-white/60">Stock</label>
              <input {...register("stock", { required: true, valueAsNumber: true })} type="number" className={`mt-1.5 ${field}`} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-white/60">Category</label>
              <select {...register("category", { required: true })} className={`mt-1.5 ${field}`}>
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} className="bg-sidebar">{c}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold text-primary font-medium py-3 shadow-gold hover:shadow-luxe transition disabled:opacity-60">
            <Save className="h-4 w-4" /> {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
