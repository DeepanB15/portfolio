"use client";

import type { Dispatch, FormEventHandler, SetStateAction } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FlightButton } from "@/components/FlightButton";
import { profile } from "@/data/profile";

type SubmissionStatus = "idle" | "sending" | "sent" | "error";

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

type ContactFormDialogContentProps = {
  status: SubmissionStatus;
  formData: ContactFormData;
  setFormData: Dispatch<SetStateAction<ContactFormData>>;
  isFormValid: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

const fieldClassName =
  "w-full border-b border-zinc-200 bg-transparent px-3 py-3 text-[14px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-500";

export default function ContactFormDialogContent({
  status,
  formData,
  setFormData,
  isFormValid,
  onSubmit,
}: ContactFormDialogContentProps) {
  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
      <div className="border-b border-black/10 px-5 py-5 dark:border-white/[0.12] sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Get in touch
          </DialogTitle>

          <DialogDescription className="text-[13px] text-zinc-500 dark:text-zinc-400">
            Send a message directly to Deepan.
          </DialogDescription>
        </DialogHeader>
      </div>

      {status === "sent" ? (
        <div className="px-5 py-8 text-center sm:px-6">
          <p
            role="status"
            className="text-[14px] font-medium text-emerald-700 dark:text-emerald-400"
          >
            Your message was sent successfully.
          </p>

          <p className="mt-1 text-[12px] text-zinc-500">
            Thanks for reaching out. I’ll get back to you soon.
          </p>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="space-y-5 px-5 pb-5 sm:px-6 sm:pb-6"
        >
          <label className="block">
            <span className="ml-3 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
              Full name
            </span>

            <input
              required
              name="name"
              autoComplete="name"
              maxLength={120}
              value={formData.name}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  name: event.target.value,
                })
              }
              placeholder="Your name"
              className={fieldClassName}
            />
          </label>

          <label className="block">
            <span className="ml-3 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
              Email address
            </span>

            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              maxLength={254}
              value={formData.email}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  email: event.target.value,
                })
              }
              placeholder="you@example.com"
              className={fieldClassName}
            />
          </label>

          <label className="block">
            <span className="ml-3 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
              Message
            </span>

            <textarea
              required
              name="message"
              rows={4}
              maxLength={5000}
              value={formData.message}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  message: event.target.value,
                })
              }
              placeholder="How can I help?"
              className={`${fieldClassName} resize-y`}
            />
          </label>

          {status === "error" && (
            <p
              role="alert"
              className="text-[12px] text-rose-600 dark:text-rose-400"
            >
              Your message couldn’t be sent. Please try again or email{" "}
              <a
                className="underline underline-offset-2"
                href={`mailto:${profile.email}`}
              >
                {profile.email}
              </a>.
            </p>
          )}

          <div className="flex justify-center w-full pt-1">
            <div className="relative group">
              <div className="absolute -inset-[5px] rounded-[11px] border border-black/5 transition-colors duration-300 group-hover:border-black/10 dark:border-white/5 dark:group-hover:border-white/10" />

              <FlightButton
                type="submit"
                disabled={status === "sending" || !isFormValid}
                className="!relative !rounded-[6px] !border-black/5 !bg-zinc-50 !px-4 !py-2 !text-[13px] !font-medium !shadow-sm !shadow-black/20 !transition-all !duration-300 hover:!bg-zinc-100 dark:!border-white/5 dark:!bg-[#09090b] dark:!shadow-lg dark:!shadow-black/80 dark:hover:!bg-[#121214]"
              />
            </div>
          </div>
        </form>
      )}
    </DialogContent>
  );
}
