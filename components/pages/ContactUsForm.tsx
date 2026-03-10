"use client";

import React, { useState } from "react";

const inquiryTypes = [
  "ORDER HELP",
  "STYLING ADVICE",
  "RETURNS",
  "WHOLESALE",
  "OTHER",
];

export default function ContactUsForm() {
  const [selectedType, setSelectedType] = useState("ORDER HELP");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ ...formData, inquiryType: selectedType });
  };

  return (
    <section id="contact-us" className="w-full bg-white text-black">
      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden bg-black py-20 sm:py-28 md:py-36 lg:py-40 flex flex-col items-center justify-center text-center px-5"> 
        <p className="relative text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-white/50 mb-5 font-light">
          Get In Touch
        </p>
        <h1
          className="relative text-[clamp(28px,6vw,64px)] font-light leading-[1.15] text-white"
          style={{
            fontFamily:
              "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
          }}
        >
          We&rsquo;d love to{" "}
          <em className="italic decoration-white/40">
            hear
          </em>{" "}
          from you
        </h1>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 px-5 sm:px-8 md:px-12 py-16 sm:py-20 md:py-24">
        {/* ── LEFT: Contact Details ── */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-medium mb-3">
            Our Details
          </p>
          <h2
            className="text-[clamp(28px,4vw,44px)] font-light leading-[1.2] mb-2"
            style={{
              fontFamily:
                "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
            }}
          >
            Let&rsquo;s start a
            <br />
            <span className="text-black/60 italic">conversation</span>
          </h2>
          <p className="text-[13px] sm:text-[14px] text-black/50 leading-[1.7] mb-10 max-w-[380px] font-light">
            Whether you have a question about an order, need styling advice, or
            simply want to say hello — our team is ready.
          </p>

          {/* Contact Cards */}
          <div className="flex flex-col gap-5 mb-10">
            {/* Visit */}
            <ContactCard
              icon={
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              }
              label="Visit Us"
              primary="14 Linen Lane, Colombo 03"
              secondary="Sri Lanka · Ground Floor"
            />
            {/* Email */}
            <ContactCard
              icon={
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              }
              label="Email Us"
              primary="hello@iconicapparel.com"
              secondary="We reply within 24 hours"
            />
            {/* Call */}
            <ContactCard
              icon={
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
              }
              label="Call Us"
              primary="+94 11 234 5678"
              secondary="Mon – Sat, 9am – 6pm"
            />
          </div>

          {/* Store Hours */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-medium mb-4">
              Store Hours
            </p>
            <div className="border-t border-black/10">
              {[
                { day: "Monday – Friday", hours: "9:00 am – 7:00 pm" },
                { day: "Saturday", hours: "10:00 am – 6:00 pm" },
                { day: "Sunday", hours: "11:00 am – 4:00 pm" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3.5 border-b border-black/10 text-[13px] sm:text-[14px]"
                >
                  <span className="text-black/70 font-light">{item.day}</span>
                  <span className="text-black font-medium tracking-wide">
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Contact Form ── */}
        <div>
          <h3
            className="text-[clamp(24px,3.5vw,36px)] font-light mb-2"
            style={{
              fontFamily:
                "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
            }}
          >
            Send us a message
          </h3>
          <p className="text-[13px] text-black/50 leading-[1.6] mb-7 font-light max-w-[420px]">
            Fill in the form below and a member of our team will get back to you
            as soon as possible.
          </p>

          {/* Inquiry Type Pills */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            {inquiryTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 text-[10px] tracking-[0.15em] font-medium border cursor-pointer transition-all duration-200 ${
                  selectedType === type
                    ? "bg-black text-white border-black"
                    : "bg-transparent text-black/60 border-black/20 hover:border-black/50 hover:text-black"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Row: First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                label="First Name"
                name="firstName"
                placeholder="e.g. Amara"
                value={formData.firstName}
                onChange={handleChange}
              />
              <InputField
                label="Last Name"
                name="lastName"
                placeholder="e.g. Silva"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            {/* Row: Email & Order Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@email.com"
                value={formData.email}
                onChange={handleChange}
              />
              <InputField
                label="Order Number (Optional)"
                name="orderNumber"
                placeholder="#MA-00000"
                value={formData.orderNumber}
                onChange={handleChange}
              />
            </div>

            {/* Subject */}
            <InputField
              label="Subject"
              name="subject"
              placeholder="How can we help?"
              value={formData.subject}
              onChange={handleChange}
            />

            {/* Message */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium mb-2">
                Your Message
              </label>
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us everything..."
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-black/15 bg-transparent px-4 py-3 text-[14px] text-black placeholder:text-black/30 outline-none focus:border-black transition-colors resize-none font-light"
              />
            </div>

            {/* Submit Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
              <button
                type="submit"
                className="group flex items-center gap-3 bg-black text-white px-7 py-3.5 text-[11px] font-medium tracking-[0.2em] uppercase cursor-pointer hover:bg-black/80 transition-colors"
              >
                Send Message
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-none stroke-current transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
              <p className="text-[11px] text-black/35 font-light leading-[1.5] max-w-[220px]">
                Your information is kept private and never shared with third
                parties.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ── Sub-components ── */

function ContactCard({
  icon,
  label,
  primary,
  secondary,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  primary: string;
  secondary: string;
}>) {
  return (
    <div className="flex items-start gap-4 p-5 border border-black/10 hover:border-black/25 transition-colors group">
      <div className="w-10 h-10 border border-black/15 flex items-center justify-center text-black/50 shrink-0 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300">
        {icon}
      </div>
      <div>
        <p className="text-[9px] uppercase tracking-[0.3em] text-black/35 font-medium mb-1">
          {label}
        </p>
        <p className="text-[14px] sm:text-[15px] font-medium text-black leading-snug">
          {primary}
        </p>
        <p className="text-[12px] text-black/40 font-light mt-0.5">
          {secondary}
        </p>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  placeholder,
  value,
  onChange,
  type = "text",
}: Readonly<{
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}>) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-black/15 bg-transparent px-4 py-3 text-[14px] text-black placeholder:text-black/30 outline-none focus:border-black transition-colors font-light"
      />
    </div>
  );
}