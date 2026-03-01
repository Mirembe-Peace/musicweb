import * as React from "react";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createBookingRequest } from "@/lib/api";
import { parseNumber } from "@/lib/format";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  eventType: z.enum(["WEDDING", "CORPORATE", "FESTIVAL", "PRIVATE", "OTHER"]),
  eventDate: z.string().min(1, "Please select a date"),
  location: z.string().min(2, "Please enter the location"),
  budgetUGX: z.string().optional(),
  message: z.string().max(1000, "Message is too long").optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Bookings() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      eventType: "CORPORATE",
      budgetUGX: "",
      message: "",
    },
  });

  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(values: FormValues) {
    try {
      setSubmitting(true);

      const budget = values.budgetUGX ? parseNumber(values.budgetUGX) : undefined;

      await createBookingRequest({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        eventType: values.eventType,
        eventDate: values.eventDate,
        location: values.location,
        budgetUGX: budget,
        message: values.message || undefined,
      });

      toast.success("Booking request sent", {
        description: "Thanks! We’ll get back to you shortly with availability and next steps.",
      });
      
      form.reset({
        fullName: "",
        email: "",
        phone: "",
        eventType: "CORPORATE",
        eventDate: "",
        location: "",
        budgetUGX: "",
        message: "",
      });
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
        : undefined;
      
      toast.error("Failed to send request", {
        description:
          errorMessage ||
          "Please try again. If it persists, contact bookings directly.",
      });

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container>
      <div className="py-10">
        <SectionTitle
          eyebrow="Bookings"
          title="Book Ashaba"
          subtitle="Send a booking request for weddings, corporate events, festivals, and private shows. We’ll respond with availability and pricing options."
        />

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3 rounded-3xl border bg-card p-6 shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+256 7xx xxx xxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="WEDDING">Wedding</SelectItem>
                            <SelectItem value="CORPORATE">Corporate</SelectItem>
                            <SelectItem value="FESTIVAL">Festival</SelectItem>
                            <SelectItem value="PRIVATE">Private</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, venue, or address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budgetUGX"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (UGX) — optional</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 1,500,000" inputMode="numeric" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message — optional</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about the event (time, set length, band setup, sound, special requests)..."
                          className="min-h-30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Sending..." : "Send booking request"}
                </Button>

                <p className="text-xs text-muted-foreground">
                  By submitting, you agree that we can contact you about this booking.
                </p>
              </form>
            </Form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <div className="font-black text-lg">What happens next?</div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• We confirm availability for your date.</li>
                <li>• We share pricing + performance options.</li>
                <li>• You receive a confirmation & booking details.</li>
              </ul>

              <div className="mt-5 h-2 w-full rounded-full bg-linear-to-r from-[hsl(var(--brand-green))] via-[hsl(var(--brand-yellow))] to-[hsl(var(--brand-red))]" />
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <div className="font-black text-lg">Direct contact</div>
              <div className="mt-3 text-sm text-muted-foreground">
                Email: bookings@ashabamusic.com <br />
                Phone: +256 … <br />
                Location: Uganda
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}