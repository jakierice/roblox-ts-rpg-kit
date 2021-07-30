import { ReplicatedStorage } from "@rbxts/services"
import { t } from "@rbxts/t"
import { E } from "./fp-ts"
import { pipe } from "./fp/function"

export const wearableD = t.intersection(
  t.instanceOf("Accessory"),
  t.children({ DisplayName: t.instanceOf("StringValue") })
)

export const getWearables = (player: Player) =>
  pipe(
    player.FindFirstChild("Wearables"),
    E.decode(t.instanceOf("Folder")),
    E.map((a) => a.GetChildren()),
    E.chain(E.decode(t.array(wearableD)))
  )

export const getReplicatedStorageWearables = pipe(
  ReplicatedStorage.FindFirstChild("Wearables"),
  E.decode(t.instanceOf("Folder")),
  E.map((a) => a.GetChildren()),
  E.chain(E.decode(t.array(wearableD)))
)
