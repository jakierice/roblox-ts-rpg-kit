import Roact from '@rbxts/roact'
import { Players, UserInputService } from '@rbxts/services'
import { AccessoryMenu } from './HUD'
import Hooks from '@rbxts/roact-hooks'

const MenuButton = ({ onClick }: { onClick: () => void }) => (
  <imagebutton
    Image="rbxassetid://7097495552"
    HoverImage="rbxassetid://7097576626"
    Position={new UDim2(0.02, 0, 0.32, 0)}
    Size={new UDim2(0, 72, 0, 72)}
    Style="Custom"
    ScaleType="Fit"
    SliceScale={1}
    Visible={true}
    BackgroundTransparency={1}
    Event={{ MouseButton1Click: onClick }}
  />
)

const PlayerUI = new Hooks(Roact)((_props, { useState, useEffect }) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    UserInputService.InputBegan.Connect((input) => {
      print('Key pressed ', input.KeyCode)
      if (input.KeyCode === Enum.KeyCode.Tab && isOpen) {
        setIsOpen(false)
      }

      if (input.KeyCode === Enum.KeyCode.Tab && !isOpen) {
        setIsOpen(true)
      }
    })
  }, [])

  return (
    <screengui>
      {!isOpen && <MenuButton onClick={() => setIsOpen(true)} />}
      <AccessoryMenu menuState={isOpen} />
    </screengui>
  )
})

Roact.mount(
  <PlayerUI />,
  Players.LocalPlayer.FindFirstChildOfClass('PlayerGui'),
)
