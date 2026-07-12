"use client";

import type { CategoryId } from "@/data/categories";
import type { ClientDetails, OrderItem } from "@/lib/order/types";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type OrderStep = "category" | "items" | "review";

type StepGuardState = {
  client: ClientDetails | null;
  categoryId: CategoryId | null;
  items: OrderItem[];
};

/** Finds the first order-flow step whose prerequisite data is missing for the given step. */
const firstMissingStep = (
  step: OrderStep,
  state: StepGuardState,
): OrderStep | "client" | null => {
  if (!state.client) return "client";
  if (step !== "category" && !state.categoryId) return "category";
  if (step === "review" && state.items.length === 0) return "items";
  return null;
};

/** Redirects to the first missing prerequisite step; returns true once the current step's data is ready. */
export const useOrderStepGuard = (
  step: OrderStep,
  state: StepGuardState,
): boolean => {
  const router = useRouter();
  const missing = firstMissingStep(step, state);

  useEffect(() => {
    if (missing) router.replace(`/order/${missing}`);
  }, [missing, router]);

  return missing === null;
};
