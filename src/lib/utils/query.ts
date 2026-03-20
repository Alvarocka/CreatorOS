export function buildQueryString(
  current: Record<string, string | string[] | undefined>,
  updates: Record<string, string | undefined>
) {
  const params = new URLSearchParams();

  Object.entries(current).forEach(([key, value]) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((entry) => params.set(key, entry));
      return;
    }

    params.set(key, value);
  });

  Object.entries(updates).forEach(([key, value]) => {
    if (!value || value === "all") {
      params.delete(key);
      return;
    }

    params.set(key, value);
  });

  const output = params.toString();
  return output ? `?${output}` : "";
}
