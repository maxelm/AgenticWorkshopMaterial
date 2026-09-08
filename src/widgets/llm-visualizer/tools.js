// Real, callable tools offered to tool-calling-capable models in the LLM
// Visualizer. Each entry pairs an OpenAI-style function schema (sent to the
// model as part of the request) with a browser-side `execute` implementation
// that actually runs when the model asks to call it.

let cachedLocation = null; // { latitude, longitude, accuracy } | null
let lastLocationError = null;

/**
 * Requests geolocation permission (if not already granted/denied) and caches
 * the result. Intended to be called once when the widget mounts so the
 * browser's permission prompt appears immediately, well before any tool call
 * needs the location.
 */
export function primeLocationPermission() {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      lastLocationError = "Geolocation is not supported by this browser.";
      resolve({ granted: false, error: lastLocationError });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        cachedLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        lastLocationError = null;
        resolve({ granted: true, location: cachedLocation });
      },
      (err) => {
        lastLocationError = err?.message || "Location permission was denied.";
        resolve({ granted: false, error: lastLocationError });
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    );
  });
}

function readOpenWeatherApiKey() {
  const key = import.meta.env.OPENWEATHER_API_KEY;
  return key && key.length > 0 ? key : null;
}

export const LOCATION_TOOL_ID = "get_current_location";
export const WEATHER_TOOL_ID = "get_current_weather";
export const CALCULATOR_TOOL_ID = "calculator";
export const GEOCODING_TOOL_ID = "geocode";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

function mean(values) {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function variance(values, sample) {
  const m = mean(values);
  const divisor = sample ? values.length - 1 : values.length;
  if (divisor <= 0) return null;
  return values.reduce((acc, v) => acc + (v - m) ** 2, 0) / divisor;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function mode(values) {
  const counts = new Map();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  const maxCount = Math.max(...counts.values());
  return [...counts.entries()]
    .filter(([, c]) => c === maxCount)
    .map(([v]) => v)
    .sort((a, b) => a - b);
}

// Binary/unary arithmetic operations, operating on `a` (and `b` where needed).
const CALCULATOR_OPERATIONS = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) throw new Error("Division by zero.");
    return a / b;
  },
  power: (a, b) => a ** b,
  modulo: (a, b) => {
    if (b === 0) throw new Error("Division by zero.");
    return a % b;
  },
  sqrt: (a) => {
    if (a < 0) throw new Error("Cannot take the square root of a negative number.");
    return Math.sqrt(a);
  },
  abs: (a) => Math.abs(a),
};

// Statistical operations, operating on the `numbers` array.
const STATISTICS_OPERATIONS = {
  sum: (values) => values.reduce((a, b) => a + b, 0),
  mean,
  median,
  mode,
  min: (values) => Math.min(...values),
  max: (values) => Math.max(...values),
  range: (values) => Math.max(...values) - Math.min(...values),
  variance: (values) => variance(values, false),
  sample_variance: (values) => variance(values, true),
  std_dev: (values) => {
    const v = variance(values, false);
    return v == null ? null : Math.sqrt(v);
  },
  sample_std_dev: (values) => {
    const v = variance(values, true);
    return v == null ? null : Math.sqrt(v);
  },
  count: (values) => values.length,
};

export const TOOL_DEFINITIONS = [
  {
    id: LOCATION_TOOL_ID,
    label: "📍 Current location",
    description: "Browser Geolocation API",
    schema: {
      type: "function",
      function: {
        name: LOCATION_TOOL_ID,
        description:
          "Get the user's current geographic location (latitude/longitude) using the browser's Geolocation API.",
        parameters: { type: "object", properties: {}, required: [] },
      },
    },
    async execute() {
      if (cachedLocation) return cachedLocation;
      const result = await primeLocationPermission();
      if (!result.granted) {
        return { error: result.error || "Location unavailable." };
      }
      return result.location;
    },
  },
  {
    id: WEATHER_TOOL_ID,
    label: "☀️ Current weather",
    description: "OpenWeather Current Weather Data API",
    schema: {
      type: "function",
      function: {
        name: WEATHER_TOOL_ID,
        description:
          "Get current weather conditions for a location via the OpenWeather Current Weather Data API. If latitude/longitude are omitted, the user's current browser location is used instead.",
        parameters: {
          type: "object",
          properties: {
            latitude: { type: "number", description: "Latitude, decimal degrees." },
            longitude: { type: "number", description: "Longitude, decimal degrees." },
            units: {
              type: "string",
              enum: ["standard", "metric", "imperial"],
              description: "Unit system for temperature/wind speed. Defaults to metric.",
            },
          },
          required: [],
        },
      },
    },
    async execute(args = {}) {
      const apiKey = readOpenWeatherApiKey();
      if (!apiKey) {
        return {
          error:
            "OPENWEATHER_API_KEY is not configured. Add it to frontend/.env and restart the dev server.",
        };
      }

      let { latitude, longitude, units = "metric" } = args;
      if (latitude == null || longitude == null) {
        const loc = cachedLocation || (await primeLocationPermission()).location;
        if (!loc) {
          return { error: "No location available to look up weather for." };
        }
        latitude = loc.latitude;
        longitude = loc.longitude;
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          return {
            error: `OpenWeather API error ${res.status}: ${text.slice(0, 200)}`,
          };
        }
        const json = await res.json();
        return {
          latitude: json.coord?.lat,
          longitude: json.coord?.lon,
          location_name: json.name,
          temperature: json.main?.temp,
          feels_like: json.main?.feels_like,
          humidity: json.main?.humidity,
          pressure: json.main?.pressure,
          wind_speed: json.wind?.speed,
          clouds: json.clouds?.all,
          condition: json.weather?.[0]?.description,
          units,
        };
      } catch (err) {
        return { error: err instanceof Error ? err.message : String(err) };
      }
    },
  },
  {
    id: CALCULATOR_TOOL_ID,
    label: "🧮 Calculator",
    description: "Arithmetic & statistics",
    schema: {
      type: "function",
      function: {
        name: CALCULATOR_TOOL_ID,
        description:
          "Perform arithmetic (add, subtract, multiply, divide, power, modulo, sqrt, abs) or " +
          "statistics (sum, mean, median, mode, min, max, range, variance, sample_variance, " +
          "std_dev, sample_std_dev, count) calculations. Use `a`/`b` for arithmetic operations " +
          "and `numbers` (an array) for statistics operations.",
        parameters: {
          type: "object",
          properties: {
            operation: {
              type: "string",
              enum: [
                ...Object.keys(CALCULATOR_OPERATIONS),
                ...Object.keys(STATISTICS_OPERATIONS),
              ],
              description: "Which operation to perform.",
            },
            a: { type: "number", description: "First operand (arithmetic operations)." },
            b: {
              type: "number",
              description: "Second operand (required for add/subtract/multiply/divide/power/modulo).",
            },
            numbers: {
              type: "array",
              items: { type: "number" },
              description: "List of numbers (required for statistics operations).",
            },
          },
          required: ["operation"],
        },
      },
    },
    async execute(args = {}) {
      const { operation, a, b, numbers } = args;
      try {
        if (operation in CALCULATOR_OPERATIONS) {
          if (a == null) return { error: "`a` is required for this operation." };
          const needsB = ["add", "subtract", "multiply", "divide", "power", "modulo"].includes(
            operation,
          );
          if (needsB && b == null) {
            return { error: "`b` is required for this operation." };
          }
          const result = needsB
            ? CALCULATOR_OPERATIONS[operation](a, b)
            : CALCULATOR_OPERATIONS[operation](a);
          return { operation, result };
        }
        if (operation in STATISTICS_OPERATIONS) {
          if (!Array.isArray(numbers) || numbers.length === 0) {
            return { error: "`numbers` (a non-empty array) is required for this operation." };
          }
          const result = STATISTICS_OPERATIONS[operation](numbers);
          return { operation, result };
        }
        return { error: `Unknown operation: ${operation}` };
      } catch (err) {
        return { error: err instanceof Error ? err.message : String(err) };
      }
    },
  },
  {
    id: GEOCODING_TOOL_ID,
    label: "🗺️ Geocoding",
    description: "OpenStreetMap Nominatim",
    schema: {
      type: "function",
      function: {
        name: GEOCODING_TOOL_ID,
        description:
          "Convert between place names/addresses and geographic coordinates using the OpenStreetMap " +
          "Nominatim API. Use mode 'search' with a free-form `query` (e.g. an address, city, or " +
          "landmark) to get its latitude/longitude. Use mode 'reverse' with `latitude`/`longitude` " +
          "to get the address at that location.",
        parameters: {
          type: "object",
          properties: {
            mode: {
              type: "string",
              enum: ["search", "reverse"],
              description: "'search' (place name → coordinates) or 'reverse' (coordinates → address).",
            },
            query: {
              type: "string",
              description: "Free-form place name or address to search for. Required for mode 'search'.",
            },
            latitude: {
              type: "number",
              description: "Latitude, decimal degrees. Required for mode 'reverse'.",
            },
            longitude: {
              type: "number",
              description: "Longitude, decimal degrees. Required for mode 'reverse'.",
            },
          },
          required: ["mode"],
        },
      },
    },
    async execute(args = {}) {
      const { mode, query, latitude, longitude } = args;
      try {
        if (mode === "search") {
          if (!query) return { error: "`query` is required for mode 'search'." };
          const url = `${NOMINATIM_BASE_URL}/search?format=jsonv2&limit=5&addressdetails=1&q=${encodeURIComponent(query)}`;
          const res = await fetch(url, {
            headers: { Accept: "application/json" },
          });
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            return { error: `Nominatim API error ${res.status}: ${text.slice(0, 200)}` };
          }
          const results = await res.json();
          if (!Array.isArray(results) || results.length === 0) {
            return { error: `No results found for "${query}".` };
          }
          return {
            results: results.map((r) => ({
              display_name: r.display_name,
              latitude: Number(r.lat),
              longitude: Number(r.lon),
              type: r.type,
              category: r.category,
              importance: r.importance,
            })),
          };
        }
        if (mode === "reverse") {
          if (latitude == null || longitude == null) {
            return { error: "`latitude` and `longitude` are required for mode 'reverse'." };
          }
          const url = `${NOMINATIM_BASE_URL}/reverse?format=jsonv2&addressdetails=1&lat=${latitude}&lon=${longitude}`;
          const res = await fetch(url, {
            headers: { Accept: "application/json" },
          });
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            return { error: `Nominatim API error ${res.status}: ${text.slice(0, 200)}` };
          }
          const result = await res.json();
          if (result.error) return { error: result.error };
          return {
            display_name: result.display_name,
            latitude: Number(result.lat),
            longitude: Number(result.lon),
            address: result.address,
          };
        }
        return { error: `Unknown mode: ${mode}. Use 'search' or 'reverse'.` };
      } catch (err) {
        return { error: err instanceof Error ? err.message : String(err) };
      }
    },
  },
];

export function getToolDefinition(name) {
  return TOOL_DEFINITIONS.find((t) => t.schema.function.name === name);
}
