'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { practiceAreas } from '@/lib/site-data';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#2e3192] focus:bg-white focus:ring-2 focus:ring-[#2e3192]/10 aria-invalid:border-red-400 aria-invalid:ring-red-100';

export function ContactForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: 'General Legal Inquiry',
      message: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: ContactFormData) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to send message');
      }

      toast.success('Message sent successfully!', {
        description: 'We will respond to your inquiry within 24 hours.',
        duration: 6000,
      });
      form.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error('Failed to send message', {
        description: `${message} Please call us directly on +254 791 646 341.`,
        duration: 8000,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-2xl bg-white p-8 shadow-2xl shadow-slate-200 md:p-12"
        noValidate
      >
        <div className="mb-10">
          <h2 className="font-display text-3xl font-bold text-[#2e3192]">Inquiry Form</h2>
          <p className="mt-2 text-slate-500">
            Professional counsel for your legal needs. We typically respond within 24 hours.
          </p>
        </div>

        {/* Row 1: Name + Email */}
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className={inputClass}
                    placeholder="e.g. John Doe"
                    type="text"
                    autoComplete="name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className={inputClass}
                    placeholder="john@example.com"
                    type="email"
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 2: Phone + Subject */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone Number <span className="normal-case font-normal text-slate-400">(optional)</span>
                </FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className={inputClass}
                    placeholder="+254 700 000 000"
                    type="tel"
                    autoComplete="tel"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject of Inquiry</FormLabel>
                <FormControl>
                  <select {...field} className={inputClass}>
                    <option value="General Legal Inquiry">General Legal Inquiry</option>
                    {practiceAreas.map((area) => (
                      <option key={area.slug} value={area.title}>
                        {area.title}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 3: Message */}
        <div className="mt-6">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    className={`${inputClass} min-h-40 resize-y`}
                    placeholder="Please describe your legal requirements in detail..."
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#2e3192] px-8 py-5 text-sm font-black uppercase tracking-[.2em] text-white transition-all duration-300 hover:bg-[#ab812b] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sending Enquiry...
            </>
          ) : (
            <>
              <Send size={18} />
              Send Enquiry
            </>
          )}
        </button>

        <p className="mt-4 text-center text-xs text-slate-400">
          Your information is kept strictly confidential. We do not share client data.
        </p>
      </form>
    </Form>
  );
}
