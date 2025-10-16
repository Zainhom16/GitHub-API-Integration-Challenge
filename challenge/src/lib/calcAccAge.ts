export function calculateAccountAge(createdAt: string): number {
  const createdDate = new Date(createdAt).getTime();
  const now = Date.now();
  const years = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24 * 365));
  return years;
}
