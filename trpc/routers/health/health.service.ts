export function getHealthHello(name?: string) {
  return {
    ok: true as const,
    message: name ? `Hello, ${name}` : 'tRPC is ready',
  }
}
