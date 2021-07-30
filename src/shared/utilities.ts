import { t } from "@rbxts/t"
import { O } from "./fp-ts"
import { pipe } from "./fp/function"

export const getBackpack = (player: Player) =>
  pipe(
    player.FindFirstChild("Backpack"),
    O.fromPredicate(t.instanceOf("Backpack"))
  )
