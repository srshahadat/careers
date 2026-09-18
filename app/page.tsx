"use client";

import { useState, FormEvent } from "react";

// 👉 Customize this list with your actual departments.
// "specializations" (flat) or "specializationGroups" (grouped, shown with
// section headers in the dropdown) are only shown as a second dropdown
// when present — used for Developer roles so applicants pick their stack.
type Department = {
  name: string;
  description: string;
  specializations?: string[];
  specializationGroups?: { group: string; options: string[] }[];
};

const DEPARTMENTS: Department[] = [
  {
    name: "Digital Marketer",
    description:
      "Marketing our web, app, and digital services online (SEO, social media, ads, content).",
  },
  {
    name: "Offline Marketer",
    description:
      "POS management and business-management-system sales — field visits and lead generation.",
  },
  {
    name: "Developer",
    description: "Software development across our tech stack.",
    specializationGroups: [
      {
        group: "Frontend Development",
        options: ["HTML, CSS, JS", "React", "Next.js", "TypeScript"],
      },
      {
        group: "Backend Development",
        options: ["Laravel", "Go", "Node.js"],
      },
      {
        group: "Full Stack Development",
        options: ["Full Stack (Laravel + React)", "Full Stack (Next.js)"],
      },
      {
        group: "Mobile App Development",
        options: ["Flutter", "React Native"],
      },
      {
        group: "UI/UX & Product Design",
        options: ["UI/UX Designer (Figma)"],
      },
    ],
  },
  {
    name: "Product Sales Man (SR)",
    description: "Selling our handmade products directly to customers.",
  },
  {
    name: "Dropshipping Partner",
    description: "Running dropshipping business on our ShadeenLife platform.",
  },
];

const COMPANY_NAME = "Your Company Name"; // 👉 change this

type SubmitState = "idle" | "loading" | "success" | "error";

export default function HomePage() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  const selectedDeptInfo = DEPARTMENTS.find((d) => d.name === selectedDept);
  const needsSpecialization = Boolean(
    selectedDeptInfo?.specializations || selectedDeptInfo?.specializationGroups
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setState("success");
      form.reset();
      setSelectedDept("");
    } catch (err: any) {
      setState("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-700 to-brand-500 text-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-100">
            We're hiring
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Build your career at {COMPANY_NAME}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-50">
            We're growing our team across marketing, development, sales, and
            our dropshipping platform. Pick your department below and apply
            in minutes.
          </p>
          <a
            href="#apply"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* Departments */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-2xl font-bold text-slate-900">Open Departments</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {DEPARTMENTS.map((dept) => (
            <div
              key={dept.name}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900">{dept.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{dept.description}</p>
              {dept.specializations && (
                <p className="mt-2 text-xs font-medium text-brand-600">
                  Stacks: {dept.specializations.join(", ")}
                </p>
              )}
              {dept.specializationGroups && (
                <div className="mt-2 space-y-1">
                  {dept.specializationGroups.map((g) => (
                    <p key={g.group} className="text-xs text-slate-500">
                      <span className="font-semibold text-brand-600">{g.group}:</span>{" "}
                      {g.options.join(", ")}
                    </p>
                  ))}
                </div>
              )}
              <a
                href="#apply"
                onClick={() => setSelectedDept(dept.name)}
                className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline"
              >
                Apply for this department →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Apply form */}
      <section id="apply" className="bg-white">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">Apply Now</h2>
          <p className="mb-8 text-slate-500">
            Choose your department first so we know exactly where to route
            your application.
          </p>

          {state === "success" ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
              <p className="text-lg font-semibold text-green-700">
                🎉 Application submitted successfully!
              </p>
              <p className="mt-2 text-sm text-green-600">
                Thank you for applying. Our team will review your application
                and contact you if there's a match.
              </p>
              <button
                onClick={() => setState("idle")}
                className="mt-4 text-sm font-semibold text-green-700 underline"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Department *
                </label>
                <select
                  required
                  name="department"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none ring-brand-500 focus:ring-2"
                >
                  <option value="" disabled>
                    Select a department
                  </option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {selectedDeptInfo && (
                  <p className="mt-1 text-xs text-slate-400">
                    {selectedDeptInfo.description}
                  </p>
                )}
              </div>

              {needsSpecialization && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Specialization / Tech Stack *
                  </label>
                  <select
                    required
                    name="specialization"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none ring-brand-500 focus:ring-2"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select your primary stack
                    </option>
                    {selectedDeptInfo?.specializationGroups
                      ? selectedDeptInfo.specializationGroups.map((g) => (
                          <optgroup key={g.group} label={g.group}>
                            {g.options.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </optgroup>
                        ))
                      : selectedDeptInfo?.specializations?.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Full Name *
                </label>
                <input
                  required
                  name="full_name"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none ring-brand-500 focus:ring-2"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Email *
                  </label>
                  <input
                    required
                    name="email"
                    type="email"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none ring-brand-500 focus:ring-2"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Phone *
                  </label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none ring-brand-500 focus:ring-2"
                    placeholder="+880 1XXXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Cover Letter (optional)
                </label>
                <textarea
                  name="cover_letter"
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none ring-brand-500 focus:ring-2"
                  placeholder="Tell us why you're a great fit..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Resume / CV (PDF or Word, max 5MB) *
                </label>
                <input
                  required
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
                />
              </div>

              {/* Honeypot field for basic spam protection — kept hidden from real users */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              {state === "error" && (
                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={state === "loading"}
                className="w-full rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-brand-700 disabled:opacity-60"
              >
                {state === "loading" ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
      </footer>
    </main>
  );
}
