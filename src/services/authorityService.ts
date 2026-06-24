// Mock authority API adapter for Phase 5

export async function submitWorkOrder(authorityId: string, issueId: string, note?: string) {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 400));
  return {
    workOrderId: `wo-${Date.now()}`,
    authorityId,
    issueId,
    status: 'open',
    message: note || 'Work order submitted',
    updatedAt: new Date().toISOString(),
  };
}

export async function pollWorkOrderStatus(workOrderId: string) {
  // Simulate polling: randomly progress status
  await new Promise(r => setTimeout(r, 600));
  const statuses = ['in_progress', 'closed'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  return {
    workOrderId,
    status,
    message: status === 'closed' ? 'Issue resolved by city crew' : 'Work in progress by department',
    updatedAt: new Date().toISOString(),
  };
}
