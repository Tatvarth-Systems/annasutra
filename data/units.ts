export const UNIT_IDS = [
  "kg",
  "g",
  "litre",
  "ml",
  "nos",
  "packet",
  "box",
  "dozen",
  "bundle",
  "jar",
  "bottle",
  "plate",
] as const;

export type Unit = (typeof UNIT_IDS)[number];

type UnitInputConfig = {
  step: number;
  min: number;
};

const WHOLE_NUMBER_UNITS: ReadonlySet<Unit> = new Set([
  "nos",
  "packet",
  "box",
  "dozen",
  "bundle",
  "jar",
  "bottle",
  "plate",
]);

/** Returns the step/min input config for a unit, whole numbers only for count-based units. */
export const getUnitInputConfig = (unit: Unit): UnitInputConfig => {
  return WHOLE_NUMBER_UNITS.has(unit)
    ? { step: 1, min: 1 }
    : { step: 0.5, min: 0.05 };
};
