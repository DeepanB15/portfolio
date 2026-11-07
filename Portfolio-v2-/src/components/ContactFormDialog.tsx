"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import SoftPillButton from "@/components/pixel-perfect/soft-pill-button";

const ContactFormDialogContent = lazy(
  () => import("@/components/ContactFormDialogContent")
);

type SubmissionStatus = "idle" | "sending" | "sent" | "error";

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export function ContactFormDialog() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.message.trim() !== "";

  useEffect(() => {
    if (status !== "sent") return;

    const timeout = window.setTimeout(() => setOpen(false), 1200);

    return () => window.clearTimeout(timeout);
  }, [status]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (status === "sending") return;

    setStatus("sending");

    const form = event.currentTarget;

    try {
      const serviceId =
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId =
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey =
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS environment variables are missing.");
      }

      const { default: emailjs } = await import("@emailjs/browser");
      await emailjs.sendForm(
        serviceId,
        templateId,
        form,
        {
          publicKey,
        }
      );

      form.reset();

      setFormData({
        name: "",
        email: "",
        message: "",
      });

      setStatus("sent");
    } catch (error) {
      console.error(
        "Failed to send the portfolio contact message.",
        error
      );

      setStatus("error");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          setHasOpened(true);
          setStatus("idle");
        }
      }}
    >
      <DialogTrigger asChild>
        <SoftPillButton
          type="button"
          variant="primary"
          className="px-3 py-1.5 !text-[12px]"
        >
          Contact me
        </SoftPillButton>
      </DialogTrigger>

      {hasOpened && (
        <Suspense fallback={null}>
          <ContactFormDialogContent
            status={status}
            formData={formData}
            setFormData={setFormData}
            isFormValid={isFormValid}
            onSubmit={handleSubmit}
          />
        </Suspense>
      )}
    </Dialog>
  );
}
