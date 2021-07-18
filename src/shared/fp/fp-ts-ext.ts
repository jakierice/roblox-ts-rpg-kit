export const noOpIO: () => void = () => {}
export const runIO = (io: () => void) => io()
