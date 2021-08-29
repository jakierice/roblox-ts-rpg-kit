import Hooks, { HookFunctions } from "@rbxts/roact-hooks"
import Roact from "@rbxts/roact"
import { A, pipe, E, O, Eq } from "shared/fp-ts"
import { ArmorMenu } from "./ArmorMenu"
import { FullScreenModalHeader, FullScreenOverlay } from "./FullScreenModal"
import { HUD } from "./HUD"
import { List, ListItemButton } from "./List"
import { Remotes } from "shared/remotes"
import { WeaponsMenu } from "./WeaponsMenu"
import { Wearable, wearableD } from "shared/Wearable.domain"
import { makePaddingAll } from "./UI.utilities"
import { makeUseIO } from "./useIO"
import { match } from "shared/matchers"
import { neonBlue } from "./Color"
import { noOpIO } from "shared/fp/fp-ts-ext"
import { shopMenuTriggers } from "shared/Shop.domain"
import { t } from "@rbxts/t"
import { tuple } from "shared/fp/function"

const PurchaseWearable = Remotes.Client.Get("PurchaseWearable")

export type WeaponsTab = { tag: "weapons" }
export const weaponsTab: WeaponsTab = { tag: "weapons" }
export type ArmorTab = { tag: "armor" }
export const armorTab: ArmorTab = { tag: "armor" }
export type InventoryTab = WeaponsTab | ArmorTab

export type Inventory = { tag: "inventory"; tab: InventoryTab }
export const inventory = (tab: InventoryTab): Inventory => ({
  tag: "inventory",
  tab,
})

export type ArmorShop = { tag: "armorShop"; wearables: Array<Wearable> }
export const armorShop = (wearables: Array<Wearable>): ArmorShop => ({
  tag: "armorShop",
  wearables,
})

export type Closed = { tag: "closed" }
export const closed: Closed = { tag: "closed" }

export type MenuState = ArmorShop | Inventory | Closed

export const isOpen = (menuState: MenuState): menuState is Inventory =>
  menuState.tag === "inventory"
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

interface InventoryMenuProps {
  onCloseButtonClick: () => void
  tab: InventoryTab
  onTabClick: (tab: InventoryTab) => void
}

export const InventoryMenu = (props: InventoryMenuProps) => {
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

const MenuSidebarList: Roact.FunctionComponent = (props) => {
  return (
    <frame Size={new UDim2(0.32, 0, 1, 0)} BackgroundTransparency={1}>
      {props[Roact.Children]}
      <uipadding {...makePaddingAll(new UDim(0, 8))} />
    </frame>
  )
}

export const ArmorShopMenu = (props: {
  wearables: Array<Wearable>
  onCloseButtonClick: () => void
}) => {
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
        <MenuTabButton text="For Sale" onClick={noOpIO} />
      </frame>
      <frame
        Position={new UDim2(0, 0, 0, 80)}
        Size={new UDim2(1, 0, 1, 0)}
        BackgroundTransparency={1}
      >
        <MenuSidebarList>
          <List padding={new UDim(0, 0)}>
            {pipe(
              props.wearables,
              A.map((wearable) => (
                <ListItemButton
                  isActive={true}
                  text={wearable.DisplayName.Value}
                  onClick={() =>
                    PurchaseWearable.CallServerAsync(wearable).then((res) => {
                      if (E.isLeft(res)) {
                        print(res.left)
                      }
                    })
                  }
                />
              ))
            )}
          </List>
        </MenuSidebarList>
      </frame>
    </screengui>
  )
}

const useMenu = ({ useState }: { useState: HookFunctions["useState"] }) => {
  const [menuState, setMenuState] = useState<MenuState>(closed)

  const toggleMenu = () =>
    pipe(
      menuState,
      match({
        inventory: () => closed,
        armorShop: () => closed,
        closed: () => inventory(weaponsTab),
      }),
      setMenuState
    )

  const addTriggerEvents = pipe(
    shopMenuTriggers,
    O.map(
      (ts) => () =>
        ts.forEach((trigger) => {
          trigger.Transparency = 1
          const wearables = pipe(
            trigger.StockFolder.Value?.GetChildren(),
            O.fromPredicate(t.array(wearableD))
          )

          trigger.Touched.Connect(() => {
            if (O.isSome(wearables) && menuState.tag !== "armorShop") {
              setMenuState(armorShop(wearables.value))
            }
          })
        })
    ),
    O.getOrElse(() => noOpIO)
  )

  return { menuState, setMenuState, addTriggerEvents, toggleMenu }
}

export const MainMenu = new Hooks(Roact)(
  (_props, { useState, useEffect, useValue }) => {
    const useIO = makeUseIO(useEffect, useValue)
    const { menuState, setMenuState, addTriggerEvents, toggleMenu } = useMenu({
      useState,
    })

    useIO(addTriggerEvents, tuple(), Eq.tuple())

    return (
      <screengui>
        {pipe(
          menuState,
          match({
            inventory: ({ tab }) => (
              <InventoryMenu
                onCloseButtonClick={toggleMenu}
                tab={tab}
                onTabClick={(t) => setMenuState(inventory(t))}
              />
            ),
            armorShop: ({ wearables }) => (
              <ArmorShopMenu
                wearables={wearables}
                onCloseButtonClick={toggleMenu}
              />
            ),
            closed: () => <HUD onMenuButtonClick={toggleMenu} />,
          })
        )}
      </screengui>
    )
  }
)
