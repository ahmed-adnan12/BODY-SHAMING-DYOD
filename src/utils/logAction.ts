const API_BASE = `${window.location.protocol}//${window.location.hostname}:5000`;

export async function logAction(action: string) {
  try {
    await fetch(`${API_BASE}/api/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action })
    });
  } catch (error) {
    console.error("Unable to write activity log", error);
  }
}