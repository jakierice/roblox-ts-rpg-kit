import { Players } from "@rbxts/services"
import { E, pipe } from "shared/fp-ts"
import { Remotes } from "shared/remotes"
import { getReplicatedStorageWearables } from "shared/Wearable.domain"

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
  const wearablesFolder = player.FindFirstChildOfClass("Folder")

  const targetAccessory = currentAccessories?.find((a) => a === wearable)

  if (targetAccessory) {
    targetAccessory.Parent = wearablesFolder
  }

  return `Accessory has been detached!`
})

// initialize player inventory
Players.PlayerAdded.Connect((player) =>
  pipe(getReplicatedStorageWearables, (ws) => {
    const wearablesFolder = new Instance("Folder")
    wearablesFolder.Name = "Wearables"

    if (E.isRight(ws)) {
      wearablesFolder.Parent = player

      ws.right.forEach((w) => {
        const clone = w.Clone()
        clone.Parent = wearablesFolder
      })
    }
  })
)
