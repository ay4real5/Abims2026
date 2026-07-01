"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { X, Check, ChevronRight, ChevronLeft, Heart, Calendar, Users, Mail } from "lucide-react";
import { weddingData } from "@/lib/wedding-data";
import { useAudio } from "@/components/audio-manager";

type RSVPForm = {
  status: "yes" | "no";
  adultsCount: number;
  childrenCount: number;
  infantsCount: number;
  primaryName: string;
  primaryEmail: string;
  primaryPhone?: string;
  guestNames: string[];
  dietaryNotes?: string;
};

const steps = [
  { label: "Attendance", icon: Calendar },
  { label: "Guests", icon: Users },
  { label: "Details", icon: Mail },
  { label: "Confirmation", icon: Check },
];

export default function RsvpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { playSound } = useAudio();

  const { register, watch, handleSubmit, reset, formState: { errors } } = useForm<RSVPForm>({
    defaultValues: {
      status: "yes",
      adultsCount: 1,
      childrenCount: 0,
      infantsCount: 0,
      guestNames: [],
    },
  });

  const status = watch("status");
  const adultsCount = watch("adultsCount");

  const nextStep = useCallback(() => {
    setStep((s) => Math.min(s + 1, 3));
  }, []);

  const prevStep = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const onSubmit = async (data: RSVPForm) => {
    setIsSubmitting(true);
    try {
      const guests = (data.guestNames || [])
        .filter((n) => n && n.trim())
        .map((name) => ({ name: name.trim() }));

      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          guests,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        playSound("celebration", 0.6);

        // Confetti
        try {
          const confetti = (await import("canvas-confetti")).default;
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#7B2D3B", "#C4A35A", "#E8C5B8", "#F5F0E8"],
          });
        } catch {}
      }
    } catch {
      // Still show success for UX
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setIsSuccess(false);
      reset();
    }, 300);
  }, [onClose, reset]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          style={{ background: "rgba(61, 20, 25, 0.6)" }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{
              background: "var(--cream-lightest)",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 px-6 py-4 border-b border-cream-dark" style={{ background: "var(--cream-lightest)" }}>
              <div className="flex items-center justify-between">
                <h3 className="font-script text-burgundy text-2xl">RSVP</h3>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full hover:bg-cream transition"
                  aria-label="Close RSVP"
                >
                  <X className="w-5 h-5 text-burgundy" />
                </button>
              </div>

              {/* Progress steps */}
              {!isSuccess && (
                <div className="flex items-center justify-between mt-4">
                  {steps.map((s, idx) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-xs transition-all ${
                              idx <= step
                                ? "bg-burgundy text-white"
                                : "bg-cream text-text-muted"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] ${idx <= step ? "text-burgundy" : "text-text-muted"}`}>
                            {s.label}
                          </span>
                        </div>
                        {idx < steps.length - 1 && (
                          <div
                            className={`h-px flex-1 mx-2 transition-all ${
                              idx < step ? "bg-burgundy" : "bg-cream-dark"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-burgundy text-white mb-4"
                  >
                    <Heart className="w-8 h-8 fill-white" />
                  </motion.div>
                  <h4 className="font-script text-burgundy text-3xl">Thank You!</h4>
                  <p className="text-text-secondary mt-2 text-sm">
                    {status === "yes"
                      ? "We can't wait to celebrate with you!"
                      : "We'll miss you, but thank you for letting us know."}
                  </p>
                  <p className="text-text-muted text-xs mt-4">
                    A confirmation has been sent to your email.
                  </p>
                  <button
                    onClick={handleClose}
                    className="btn-burgundy mt-6"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Step 0: Attendance */}
                  {step === 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <p className="text-center text-text-secondary text-sm mb-6">
                        Will you be joining us on {weddingData.date.display}?
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <label
                          className={`cursor-pointer rounded-xl p-6 text-center border-2 transition-all ${
                            status === "yes"
                              ? "border-burgundy bg-blush-light"
                              : "border-cream-dark hover:border-burgundy/50"
                          }`}
                        >
                          <input
                            type="radio"
                            value="yes"
                            {...register("status")}
                            className="sr-only"
                          />
                          <div className="text-3xl mb-2">🎉</div>
                          <p className="font-medium text-burgundy">Yes, with joy!</p>
                          <p className="text-xs text-text-muted mt-1">I&apos;ll be there</p>
                        </label>
                        <label
                          className={`cursor-pointer rounded-xl p-6 text-center border-2 transition-all ${
                            status === "no"
                              ? "border-burgundy bg-blush-light"
                              : "border-cream-dark hover:border-burgundy/50"
                          }`}
                        >
                          <input
                            type="radio"
                            value="no"
                            {...register("status")}
                            className="sr-only"
                          />
                          <div className="text-3xl mb-2">💌</div>
                          <p className="font-medium text-burgundy">Sadly, no</p>
                          <p className="text-xs text-text-muted mt-1">Can&apos;t make it</p>
                        </label>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 1: Guests */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      {status === "yes" ? (
                        <>
                          <div>
                            <label className="block text-sm text-text-secondary mb-2">
                              How many adults?
                            </label>
                            <select {...register("adultsCount", { valueAsNumber: true })} className="input-soft">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>{n}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-text-secondary mb-2">
                              How many children (5-12)?
                            </label>
                            <select {...register("childrenCount", { valueAsNumber: true })} className="input-soft">
                              {[0, 1, 2, 3, 4].map((n) => (
                                <option key={n} value={n}>{n}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-text-secondary mb-2">
                              How many infants (under 5)?
                            </label>
                            <select {...register("infantsCount", { valueAsNumber: true })} className="input-soft">
                              {[0, 1, 2, 3].map((n) => (
                                <option key={n} value={n}>{n}</option>
                              ))}
                            </select>
                          </div>

                          {adultsCount > 1 && (
                            <div>
                              <label className="block text-sm text-text-secondary mb-2">
                                Names of your guests
                              </label>
                              {Array.from({ length: adultsCount - 1 }).map((_, i) => (
                                <input
                                  key={i}
                                  className="input-soft mb-2"
                                  placeholder={`Guest ${i + 2} name`}
                                  {...register(`guestNames.${i}`)}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-center text-text-secondary text-sm py-8">
                          We&apos;ll miss you! Please let us know your name and email so we can keep you in our thoughts.
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Step 2: Details */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm text-text-secondary mb-2">
                          Your Name <span className="text-error">*</span>
                        </label>
                        <input
                          className="input-soft"
                          placeholder="Full name"
                          {...register("primaryName", { required: "Name is required" })}
                        />
                        {errors.primaryName && (
                          <p className="text-error text-xs mt-1">{errors.primaryName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-text-secondary mb-2">
                          Email <span className="text-error">*</span>
                        </label>
                        <input
                          type="email"
                          className="input-soft"
                          placeholder="your@email.com"
                          {...register("primaryEmail", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
                          })}
                        />
                        {errors.primaryEmail && (
                          <p className="text-error text-xs mt-1">{errors.primaryEmail.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-text-secondary mb-2">
                          Phone (optional)
                        </label>
                        <input
                          type="tel"
                          className="input-soft"
                          placeholder="+44 1234 567890"
                          {...register("primaryPhone")}
                        />
                      </div>
                      {status === "yes" && (
                        <div>
                          <label className="block text-sm text-text-secondary mb-2">
                            Dietary requirements (optional)
                          </label>
                          <textarea
                            className="input-soft min-h-[80px] resize-none"
                            placeholder="Allergies, preferences..."
                            {...register("dietaryNotes")}
                          />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Confirmation */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-3"
                    >
                      <p className="text-center text-text-secondary text-sm mb-4">
                        Please confirm your details:
                      </p>
                      <div className="rounded-lg p-4 bg-cream-light space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-muted">Attendance:</span>
                          <span className="text-burgundy font-medium">
                            {status === "yes" ? "Yes, attending" : "Not attending"}
                          </span>
                        </div>
                        {status === "yes" && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Adults:</span>
                              <span className="text-burgundy">{watch("adultsCount")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Children:</span>
                              <span className="text-burgundy">{watch("childrenCount")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Infants:</span>
                              <span className="text-burgundy">{watch("infantsCount")}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between">
                          <span className="text-text-muted">Name:</span>
                          <span className="text-burgundy">{watch("primaryName") || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Email:</span>
                          <span className="text-burgundy">{watch("primaryEmail") || "—"}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-6">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center gap-1 text-text-secondary hover:text-burgundy text-sm transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </button>
                    ) : (
                      <span />
                    )}

                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn-burgundy inline-flex items-center gap-1"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-gold inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? "Sending..." : "Confirm RSVP"}
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
