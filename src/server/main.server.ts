import { Remotes } from "shared/remotes"

const EquipWeapon = Remotes.Server.Create("EquipWeapon")
const UnequipWeapon = Remotes.Server.Create("UnequipWeapon")
const AttachWearable = Remotes.Server.Create("AttachWearable")
const DetachWearable = Remotes.Server.Create("DetachWearable")

EquipWeapon.SetCallback((player, weapon) => {
  const humanoid = player.Character?.FindFirstChildOfClass("Humanoid")
  humanoid?.EquipTool(weapon)

  return `Weapon has been equipped!`
})

UnequipWeapon.SetCallback((player) => {
  const humanoid = player.Character?.FindFirstChildOfClass("Humanoid")
  humanoid?.UnequipTools()

  return `Weapon has been unequipped!`
})

AttachWearable.SetCallback((player, wearable) => {
  const humanoid = player.Character?.FindFirstChildOfClass("Humanoid")
  humanoid?.AddAccessory(wearable)

  return `Wearable has been attached!`
})

DetachWearable.SetCallback((player, wearable) => {
  const humanoid = player.Character?.FindFirstChildOfClass("Humanoid")
  const currentAccessories = humanoid?.GetAccessories()

  const targetAccessory = currentAccessories?.find((a) => a === wearable)

  targetAccessory?.Destroy()

  return `Accessory has been detached!`
})
