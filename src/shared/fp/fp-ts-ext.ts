export const noOpIO = () => undefined
export const runIO = (io: () => void) => io()
