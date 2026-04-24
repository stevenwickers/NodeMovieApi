export function toString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export function toStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const cleaned = value
      .filter((v): v is string => typeof v === "string")
      .map(v => v.trim())
      .filter(Boolean);

    return cleaned.length > 0 ? cleaned : undefined;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    return trimmed.includes(",")
      ? trimmed.split(",").map(v => v.trim()).filter(Boolean)
      : [trimmed];
  }

  return undefined;
}