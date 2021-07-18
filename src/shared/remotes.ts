import Net from "@rbxts/net"

export const Remotes = Net.Definitions.Create({
  PrintMessage: Net.Definitions.ClientToServerEvent<[message: string]>(),
  EquipWeapon: Net.Definitions.ServerAsyncFunction<(weapon: Tool) => string>(),
  UnequipWeapon: Net.Definitions.ServerAsyncFunction<() => string>(),
})
