import Net from "@rbxts/net"
import { Wearable } from "client/ArmorMenu"

export const Remotes = Net.Definitions.Create({
  PrintMessage: Net.Definitions.ClientToServerEvent<[message: string]>(),
  EquipWeapon: Net.Definitions.ServerAsyncFunction<(weapon: Tool) => string>(),
  UnequipWeapon: Net.Definitions.ServerAsyncFunction<() => string>(),
  AttachWearable:
    Net.Definitions.ServerAsyncFunction<(wearable: Wearable) => string>(),
  DetachWearable:
    Net.Definitions.ServerAsyncFunction<(wearable: Wearable) => string>(),
})
