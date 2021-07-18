import Roact from "@rbxts/roact"
import { FullScreenModalHeader, FullScreenOverlay } from "./FullScreenModal"
import { WeaponsMenu } from "./WeaponsMenu"

export type Open = { tag: "open" }
export const open: Open = { tag: "open" }
export type Closed = { tag: "closed" }
export const closed: Closed = { tag: "closed" }
export type MenuState = Open | Closed

export const isOpen = (menuState: MenuState): menuState is Open =>
  menuState.tag === "open"
export const isClosed = (menuState: MenuState): menuState is Closed =>
  menuState.tag === "closed"

interface MainMenuProps {
  onCloseButtonClick: () => void
}

export const MainMenu = (props: MainMenuProps) => {
  return (
    <screengui>
      <FullScreenOverlay />
      <FullScreenModalHeader onClose={props.onCloseButtonClick} />
      <frame
        Position={new UDim2(0, 0, 0, 40)}
        Size={new UDim2(1, 0, 1, 0)}
        BackgroundTransparency={1}
      >
        <WeaponsMenu />
      </frame>
    </screengui>
  )
}
