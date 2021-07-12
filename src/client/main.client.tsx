import Roact from '@rbxts/roact'
import { Players } from '@rbxts/services'
import { AccessoryMenu } from './HUD'

Roact.mount(
  <AccessoryMenu />,
  Players.LocalPlayer.FindFirstChildOfClass('PlayerGui'),
)
