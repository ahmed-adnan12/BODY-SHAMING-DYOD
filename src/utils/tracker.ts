export function logAction(action: string) {
  console.log(`[TRACKER] ${action} - ${new Date().toISOString()}`);
}