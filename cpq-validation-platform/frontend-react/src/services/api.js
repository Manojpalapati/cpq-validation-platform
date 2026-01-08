/**
 * Trigger general automation (legacy)
 */
export async function triggerAutomation(orderId) {
  // Placeholder: hook to backend endpoint when available.
  console.info(`Triggering automation for ${orderId}`);
  return { ok: true };
}

/**
 * Trigger CPQ Validation Automation
 * Calls backend API to run Playwright automation
 */
export async function triggerCPQAutomation(orderId) {
  try {
    // TODO: Replace with actual backend API endpoint
    // The backend should:
    // 1. Update Firebase status to CPQ_IN_PROGRESS
    // 2. Run Playwright automation
    // 3. Update Firebase status to CPQ_DONE or CPQ_FAILED based on results
    
    console.info(`Triggering CPQ automation for order: ${orderId}`);
    
    // In production, this would be:
    // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/automation/cpq/${orderId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // if (!response.ok) throw new Error('Failed to trigger automation');
    // return await response.json();
    
    // For now, simulate API call
    // The backend automation will update Firebase status when complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { ok: true, orderId };
  } catch (error) {
    console.error('Error triggering CPQ automation:', error);
    throw error;
  }
}
