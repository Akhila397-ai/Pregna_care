export const traceRequest = (name: string) => {
  console.log(`[${name}] called at:`, new Date().toISOString());
  console.trace();
};
