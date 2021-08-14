import Roact from "@rbxts/roact";
import { A, pipe, E } from "shared/fp-ts";
import { noOpIO } from "shared/fp/fp-ts-ext";
import { match } from "shared/matchers";
import { Wearable } from "shared/Wearable.domain";
import { ArmorMenu } from "./ArmorMenu";
import { neonBlue } from "./Color";
import { FullScreenModalHeader, FullScreenOverlay } from "./FullScreenModal";
import { makePaddingAll } from "./UI.utilities";
import { WeaponsMenu } from "./WeaponsMenu";
import { List, ListItemButton } from "./List";
import { Remotes } from "shared/remotes";

const PurchaseWearable = Remotes.Client.Get("PurchaseWearable");

export type WeaponsTab = { tag: "weapons" };
export const weaponsTab: WeaponsTab = { tag: "weapons" };
export type ArmorTab = { tag: "armor" };
export const armorTab: ArmorTab = { tag: "armor" };
export type InventoryTab = WeaponsTab | ArmorTab;

export type Inventory = { tag: "inventory"; tab: InventoryTab };
export const inventory = (tab: InventoryTab): Inventory => ({
  tag: "inventory",
  tab,
});

export type ArmorShop = { tag: "armorShop"; wearables: Array<Wearable> };
export const armorShop = (wearables: Array<Wearable>): ArmorShop => ({
  tag: "armorShop",
  wearables,
});

export type Closed = { tag: "closed" };
export const closed: Closed = { tag: "closed" };

export type MenuState = ArmorShop | Inventory | Closed;

export const isOpen = (menuState: MenuState): menuState is Inventory =>
  menuState.tag === "inventory";
export const isClosed = (menuState: MenuState): menuState is Closed =>
  menuState.tag === "closed";

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
  );
};

interface InventoryMenuProps {
  onCloseButtonClick: () => void;
  tab: InventoryTab;
  onTabClick: (tab: InventoryTab) => void;
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
  );
};

const ListWrapper: Roact.FunctionComponent = (props) => {
  return (
    <frame Size={new UDim2(0.32, 0, 1, 0)} BackgroundTransparency={1}>
      {props[Roact.Children]}
      <uipadding {...makePaddingAll(new UDim(0, 8))} />
    </frame>
  );
};

export const ArmorShopMenu = (props: {
  wearables: Array<Wearable>;
  onCloseButtonClick: () => void;
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
        <MenuTabButton text="Weapons" onClick={noOpIO} />
      </frame>
      <frame
        Position={new UDim2(0, 0, 0, 80)}
        Size={new UDim2(1, 0, 1, 0)}
        BackgroundTransparency={1}
      >
        <ListWrapper>
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
                        print(res.left);
                      }
                    })
                  }
                />
              ))
            )}
          </List>
        </ListWrapper>
      </frame>
    </screengui>
  );
};
