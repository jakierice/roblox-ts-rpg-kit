import { Remotes } from "shared/remotes"

const EquipWeapon = Remotes.Server.Create("EquipWeapon")
const UnequipWeapon = Remotes.Server.Create("UnequipWeapon")

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
