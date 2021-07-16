import Roact from '@rbxts/roact'
import {
  GuiService,
  Players,
  StarterGui,
  UserInputService,
} from '@rbxts/services'
import { HUD } from './HUD'
import Hooks from '@rbxts/roact-hooks'

import { MainMenu, MenuState, closed, open } from './MainMenu'
import { match } from 'shared/matchers'
import { pipe } from 'shared/fp-ts'

StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false)

const PlayerUI = new Hooks(Roact)((_props, { useState, useEffect }) => {
  const [menuState, setMenuState] = useState<MenuState>(closed)

  const toggleMenuIO = () =>
    pipe(
      menuState,
      match({
        open: () => closed,
        closed: () => open,
      }),
      setMenuState,
    )

  const handleInput = (input: InputObject) => {
    print('InputBegan')
    if (input.KeyCode === Enum.KeyCode.Tab) {
      setMenuState(open)
    }

    if (input.KeyCode === Enum.KeyCode.Backspace) {
      setMenuState(closed)
    }
  }

  useEffect(() => {
    UserInputService.InputBegan.Connect(handleInput)
  }, [])

  return (
    <screengui>
      {pipe(
        menuState,
        match({
          open: () => <MainMenu onCloseButtonClick={toggleMenuIO} />,
          closed: () => <HUD onMenuButtonClick={toggleMenuIO} />,
        }),
      )}
    </screengui>
  )
})

Roact.mount(
  <PlayerUI />,
  Players.LocalPlayer.FindFirstChildOfClass('PlayerGui'),
)
