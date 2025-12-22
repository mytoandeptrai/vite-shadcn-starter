const ctx: Worker = self as unknown as Worker;

ctx.addEventListener('message', async (event: MessageEvent<string>) => {
  console.log(`Worker received: ${event.data}`);
  // Perform a potentially expensive calculation
  const result = event.data.toUpperCase();
  ctx.postMessage(`Result: ${result}`);
});
