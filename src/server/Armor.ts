import { ReplicatedStorage } from '@rbxts/services'
import { t } from '@rbxts/t'

type AccessoryKey = 'WaistPack' | 'BackHarness'

export function equipAccessory(player: Player, key: AccessoryKey) {
  const humanoid = player.WaitForChild('Humanoid')
  const accessories = ReplicatedStorage.FindFirstChild('Accessories')
  if (
    t.instanceOf('Humanoid')(humanoid) &&
    t.instanceOf('Folder')(accessories) &&
    t.array(t.intersection(t.instanceOf('Accessory')))(accessories)
  ) {
    const accessory = accessories.find((a) => a.Name === key)
    if (accessory) {
      humanoid.AddAccessory(accessory)
    }
  }
}
