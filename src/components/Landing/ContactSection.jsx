import React from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as HomeService from "../../api/homeService";

const CRIMSON = "#6e0001";
const CRIMSON_LIGHT = "#8a0000";

const ContactSection = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await HomeService.sendContactMessage(data);
      toast.success("Message sent successfully!");
      reset({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <section
      className="relative overflow-hidden py-20 bg-white"
      aria-labelledby="contact-heading"
    >
      {/* Decorative crimson radial glows */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            `radial-gradient(360px 140px at 10% 18%, ${CRIMSON}08, transparent), ` +
            `radial-gradient(320px 120px at 90% 82%, ${CRIMSON_LIGHT}06, transparent)`,
        }}
      />

      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2
            id="contact-heading"
            className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ color: CRIMSON }}
          >
            Contact Us
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            Have questions about My Safeti? We're here to help — send us a message and we'll get back
            to you as soon as we can.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card
            className="relative rounded-2xl overflow-hidden"
            style={{
              border: `1px solid rgba(110,0,1,0.06)`,
              boxShadow: "0 20px 50px rgba(16,24,40,0.06)",
            }}
          >
            {/* Top crimson accent bar */}
            <div
              className="absolute -top-1 left-6 right-6 h-1 rounded-t-xl"
              style={{
                background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                boxShadow: `0 6px 20px ${CRIMSON}20`,
              }}
            />

            <CardHeader className="pb-4 px-6" style={{ borderBottom: "1px solid rgba(110,0,1,0.04)" }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                    boxShadow: "0 8px 24px rgba(110,0,1,0.12)",
                  }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle style={{ color: CRIMSON, margin: 0 }}>Send us a message</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="px-6 pt-6 pb-8 bg-white">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm" style={{ color: "#1f2937" }}>
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Smith"
                      {...register("name", { required: "Name is required" })}
                      className="h-10"
                      style={{
                        background: "#fff",
                        border: `1px solid ${CRIMSON}20`,
                        color: "#111827",
                      }}
                    />
                    {errors.name && (
                      <Alert variant="destructive" className="mt-2 bg-rose-50 border-rose-200 text-rose-700">
                        <AlertDescription className="text-sm">{errors.name.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm" style={{ color: "#1f2937" }}>
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                      })}
                      className="h-10"
                      style={{
                        background: "#fff",
                        border: `1px solid ${CRIMSON}20`,
                        color: "#111827",
                      }}
                    />
                    {errors.email && (
                      <Alert variant="destructive" className="mt-2 bg-rose-50 border-rose-200 text-rose-700">
                        <AlertDescription className="text-sm">{errors.email.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm" style={{ color: "#1f2937" }}>
                    Subject *
                  </Label>
                  <Controller
                    name="subject"
                    control={control}
                    rules={{ required: "Subject is required" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          className="h-10"
                          style={{ background: "#fff", border: `1px solid ${CRIMSON}20`, color: "#111827" }}
                        >
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-slate-800" style={{ borderColor: `${CRIMSON}10` }}>
                          <SelectItem value="general" className="text-slate-800">General Inquiry</SelectItem>
                          <SelectItem value="support" className="text-slate-800">Technical Support</SelectItem>
                          <SelectItem value="partnership" className="text-slate-800">Insurance Partnership</SelectItem>
                          <SelectItem value="media" className="text-slate-800">Media & Press</SelectItem>
                          <SelectItem value="feedback" className="text-slate-800">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.subject && (
                    <Alert variant="destructive" className="mt-2 bg-rose-50 border-rose-200 text-rose-700">
                      <AlertDescription className="text-sm">{errors.subject.message}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm" style={{ color: "#1f2937" }}>
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    {...register("message", { required: "Message is required" })}
                    style={{
                      background: "#fff",
                      border: `1px solid ${CRIMSON}20`,
                      color: "#111827",
                    }}
                  />
                  {errors.message && (
                    <Alert variant="destructive" className="mt-2 bg-rose-50 border-rose-200 text-rose-700">
                      <AlertDescription className="text-sm">{errors.message.message}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    style={{
                      background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                      color: "#fff",
                      boxShadow: `0 12px 36px rgba(110,0,1,0.12)`,
                    }}
                    size="lg"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
