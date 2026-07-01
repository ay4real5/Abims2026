"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ImmersiveSection from "@/components/ImmersiveSection";
import { images } from "@/lib/config";

export default function Gallery() {
  const [photos, setPhotos] = useState<string[]>([]);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPhotos((p) => [...urls, ...p]);
  };

  return (
    <ImmersiveSection id="gallery" image={images.gallery}>
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          chapter="Chapter Seven"
          title="Live Gallery"
          subtitle="On the day, every photo you share becomes part of our wedding album. Upload your moments below."
        />

        <div className="flex justify-center mb-12">
          <label className="flex items-center gap-3 px-7 py-4 rounded-full bg-gold text-ink font-medium cursor-pointer hover:bg-gold-bright transition">
            <Upload className="h-5 w-5" />
            Upload Your Photos
            <input type="file" accept="image/*" multiple hidden onChange={onUpload} />
          </label>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="aspect-square rounded-xl card-glass grid place-items-center text-ivory/25"
                >
                  <Camera className="h-8 w-8" />
                </motion.div>
              ))
            : photos.map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="aspect-square rounded-xl overflow-hidden border border-gold/30"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Guest upload ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
        </div>
        <p className="text-center text-ivory/40 text-xs mt-6">
          Demo mode — uploads preview locally. Connect Cloudinary/Supabase Storage to save permanently.
        </p>
      </div>
    </ImmersiveSection>
  );
}
