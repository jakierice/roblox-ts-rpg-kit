import Roact from "@rbxts/roact"
import { pipe } from "shared/fp-ts"
import { match } from "shared/matchers"
import { ArmorMenu } from "./ArmorMenu"
import { neonBlue } from "./Color"
import { FullScreenModalHeader, FullScreenOverlay } from "./FullScreenModal"
import { makePaddingAll } from "./UI.utilities"
import { WeaponsMenu } from "./WeaponsMenu"

export type WeaponsTab = { tag: "weapons" }
export const weaponsTab: WeaponsTab = { tag: "weapons" }
export type ArmorTab = { tag: "armor" }
export const armorTab: ArmorTab = { tag: "armor" }
export type MainMenuTab = WeaponsTab | ArmorTab
export type Open = { tag: "open"; tab: MainMenuTab }
export const open = (tab: MainMenuTab): Open => ({ tag: "open", tab })
export type Closed = { tag: "closed" }
export const closed: Closed = { tag: "closed" }
export type MenuState = Open | Closed

export const isOpen = (menuState: MenuState): menuState is Open =>
  menuState.tag === "open"
export const isClosed = (menuState: MenuState): menuState is Closed =>
  menuState.tag === "closed"

const MenuTabButton = (props: { text: string; onClick: () => void }) => {
  return (
    <textbutton
      AutomaticSize="XY"
      Text={props.text}
      TextSize={16}
      TextColor3={neonBlue}
      Event={{ MouseButton1Click: props.onClick }}
      BackgroundTransparency={1}
      BorderMode="Outline"
      BorderColor3={neonBlue}
      BorderSizePixel={4}
    >
      <uipadding {...makePaddingAll(new UDim(0, 8))} />
    </textbutton>
  )
}

interface MainMenuProps {
  onCloseButtonClick: () => void
  tab: MainMenuTab
  onTabClick: (tab: MainMenuTab) => void
}

export const MainMenu = (props: MainMenuProps) => {
  return (
    <screengui>
      <FullScreenOverlay />
      <FullScreenModalHeader onClose={props.onCloseButtonClick} />
      <frame
        Size={new UDim2(1, 0, 0, 32)}
        Position={new UDim2(0, 0, 0, 48)}
        BackgroundTransparency={1}
      >
        <uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 8)} />
        <MenuTabButton
          text="Weapons"
          onClick={() => props.onTabClick(weaponsTab)}
        />
        <MenuTabButton
          text="Armor"
          onClick={() => props.onTabClick(armorTab)}
        />
      </frame>
      <frame
        Position={new UDim2(0, 0, 0, 80)}
        Size={new UDim2(1, 0, 1, 0)}
        BackgroundTransparency={1}
      >
        {pipe(
          props.tab,
          match({ weapons: () => <WeaponsMenu />, armor: () => <ArmorMenu /> })
        )}
      </frame>
    </screengui>
  )
}
