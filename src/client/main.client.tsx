import Roact from "@rbxts/roact"
import { Players, StarterGui, UserInputService } from "@rbxts/services"
import { HUD } from "./HUD"
import Hooks from "@rbxts/roact-hooks"

import { MainMenu, MenuState, closed, open, weaponsTab } from "./MainMenu"
import { match } from "shared/matchers"
import { pipe } from "shared/fp-ts"

StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false)

const PlayerUI = new Hooks(Roact)((_props, { useState, useEffect }) => {
  const [menuState, setMenuState] = useState<MenuState>(closed)

  const toggleMenuIO = () =>
    pipe(
      menuState,
      match({
        open: () => closed,
        closed: () => open(weaponsTab),
      }),
      setMenuState
    )

  const handleInput = (input: InputObject) => {
    if (input.KeyCode === Enum.KeyCode.Tab) {
      setMenuState(open(weaponsTab))
    }

    if (input.KeyCode === Enum.KeyCode.Return) {
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
          open: ({ tab }) => (
            <MainMenu
              onCloseButtonClick={toggleMenuIO}
              tab={tab}
              onTabClick={(t) => setMenuState(open(t))}
            />
          ),
          closed: () => <HUD onMenuButtonClick={toggleMenuIO} />,
        })
      )}
    </screengui>
  )
})

Roact.mount(
  <PlayerUI />,
  Players.LocalPlayer.FindFirstChildOfClass("PlayerGui")
)
