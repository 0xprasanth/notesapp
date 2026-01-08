"use client";

import { useState, useEffect, type FormEvent } from "react";

import { X } from "lucide-react";
import {
  validateTaskTitle,
  validateTaskDescription,
  validateDeadline,
} from "@/lib/validation";
import { format } from "date-fns";
import type { CreateTaskPayload, Task } from "@/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskPayload) => Promise<void>;
  task?: Task | null;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  task,
}: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    reminderMinutes: 30,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [selectedQuickOption, setselectedQuickOption] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (task) {
      const deadlineDate = new Date(task.deadline);
      const formattedDate = format(deadlineDate, "yyyy-MM-dd");
      const formattedTime = format(deadlineDate, "HH:mm");

      setFormData({
        title: task.title,
        description: task.description || "",
        date: formattedDate,
        time: formattedTime,
        reminderMinutes: (task as any).reminderMinutes ?? 30,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        reminderMinutes: 30,
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const titleError = validateTaskTitle(formData.title);
    if (titleError) newErrors.title = titleError;

    const descError = validateTaskDescription(formData.description);
    if (descError) newErrors.description = descError;

    // combine date and time into ISO-compatible string for validation
    const combined =
      formData.date && formData.time
        ? `${formData.date}T${formData.time}`
        : formData.date || formData.time;
    const deadlineError = validateDeadline(combined as string);
    if (deadlineError) newErrors.deadline = deadlineError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const isoDeadline = new Date(
        `${formData.date}T${formData.time}`,
      ).toISOString();
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        deadline: isoDeadline,
        reminderMinutes: Number(formData.reminderMinutes) || undefined,
      } as any);
      onClose();
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    // reset quick-select when user manually edits date/time
    setselectedQuickOption(undefined);
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const applyShortcut = (type: "30m" | "1h" | "tonight" | "tomorrow") => {
    const now = new Date();
    let target = new Date(now);
    setselectedQuickOption(type);
    if (type === "30m") {
      target.setMinutes(now.getMinutes() + 30);
      // align minutes to available dropdown step (15 minutes)
      const step = 15;
      const m = target.getMinutes();
      const rounded = Math.round(m / step) * step;
      if (rounded === 60) {
        target.setMinutes(0);
        target.setHours(target.getHours() + 1);
      } else {
        target.setMinutes(rounded);
      }
    } else if (type === "1h") {
      target.setHours(now.getHours() + 1);
      // align minutes to available dropdown step (15 minutes)
      const step = 15;
      const m = target.getMinutes();
      const rounded = Math.round(m / step) * step;
      if (rounded === 60) {
        target.setMinutes(0);
        target.setHours(target.getHours() + 1);
      } else {
        target.setMinutes(rounded);
      }
    } else if (type === "tonight") {
      // set to 22:00 tonight
      target.setHours(22, 0, 0, 0);
      // if it's already past 22:00, use tomorrow 22:00
      if (target <= now) target.setDate(target.getDate() + 1);
    } else if (type === "tomorrow") {
      target.setDate(now.getDate() + 1);
      // default time 09:00
      target.setHours(9, 0, 0, 0);
    }

    const d = format(target, "yyyy-MM-dd");
    const t = format(target, "HH:mm");
    setFormData((prev) => ({ ...prev, date: d, time: t }));
    setErrors((prev) => ({ ...prev, deadline: "" }));
  };

  const generateTimeOptions = (stepMinutes = 15) => {
    const options: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += stepMinutes) {
        const hh = String(h).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        options.push(`${hh}:${mm}`);
      }
    }
    return options;
  };

  // Minimum selectable date (today) in yyyy-MM-dd format
  const minDate = format(new Date(), "yyyy-MM-dd");

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <Label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Task Title *
            </Label>
            <Input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`input-field ${errors.title ? "border-red-500" : ""}`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`input-field ${errors.description ? "border-red-500" : ""}`}
              placeholder="Enter task description (optional)"
              rows={4}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="date"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Date *
            </Label>
            <div className="grid grid-cols-2 gap-5">
              <div>
                {" "}
                <Input
                  type="date"
                  id="date"
                  value={formData.date}
                  min={minDate}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className={`input-field ${errors.deadline ? "border-red-500" : ""}`}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="time" className="sr-only">
                  Time
                </Label>
                <select
                  id="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  className={`w-full rounded-md border px-3 py-2 ${errors.deadline ? "border-red-500" : "border-gray-200"}`}
                >
                  <option value="">Select time</option>
                  {generateTimeOptions(15).map((t) => {
                    // disable time options that are in the past when date is today
                    const disableForToday =
                      formData.date === minDate &&
                      new Date(`${formData.date}T${t}`) <= new Date();
                    return (
                      <option key={t} value={t} disabled={disableForToday}>
                        {t}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="mt-2 flex space-x-2">
              <button
                type="button"
                onClick={() => applyShortcut("30m")}
                className={`rounded bg-gray-100 px-2 py-1 text-sm ${selectedQuickOption === "30m" && "bg-green-600 text-white"}`}
              >
                In 30 mins
              </button>
              <button
                type="button"
                onClick={() => applyShortcut("1h")}
                className={`rounded bg-gray-100 px-2 py-1 text-sm ${selectedQuickOption === "1h" && "bg-green-600 text-white"}`}
              >
                In 1 hour
              </button>
              <button
                type="button"
                onClick={() => applyShortcut("tonight")}
                className={`rounded bg-gray-100 px-2 py-1 text-sm ${selectedQuickOption === "tonight" && "bg-green-600 text-white"}`}
              >
                Tonight
              </button>
              <button
                type="button"
                onClick={() => applyShortcut("tomorrow")}
                className={`rounded bg-gray-100 px-2 py-1 text-sm ${selectedQuickOption === "tomorrow" && "bg-green-600 text-white"}`}
              >
                Tomorrow
              </button>
            </div>

            <div className="mt-3">
              <Label
                htmlFor="reminder"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Reminder
              </Label>
              <select
                id="reminder"
                value={String(formData.reminderMinutes)}
                onChange={(e) =>
                  handleInputChange("reminderMinutes", Number(e.target.value))
                }
                className="w-full rounded-md border border-gray-200 px-3 py-2"
              >
                <option value="0">None</option>
                <option value="15">15 minutes before</option>
                <option value="30">30 minutes before</option>
                <option value="60">1 hour before</option>
              </select>
            </div>

            {errors.deadline && (
              <p className="mt-1 text-sm text-red-500">{errors.deadline}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 cursor-pointer"
              disabled={loading}
              variant={"outline"}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-primary flex-1 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
