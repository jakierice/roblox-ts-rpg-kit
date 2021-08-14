import Roact from "@rbxts/roact";
import {
  Players,
  StarterGui,
  UserInputService,
  Workspace,
} from "@rbxts/services";
import { HUD } from "./HUD";
import Hooks from "@rbxts/roact-hooks";

import {
  MenuState,
  closed,
  weaponsTab,
  inventory,
  armorShop,
  InventoryMenu,
  ArmorShopMenu,
} from "./MainMenu";
import { match } from "shared/matchers";
import { O, pipe } from "shared/fp-ts";
import { findFirstChild, getChildren } from "shared/Instance.utilities";
import { t } from "@rbxts/t";
import { shopMenuTriggerD } from "shared/Shop.domain";
import { wearableD } from "shared/Wearable.domain";
import { noOpIO } from "shared/fp/fp-ts-ext";

StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);

const PlayerUI = new Hooks(Roact)((_props, { useState, useEffect }) => {
  const [menuState, setMenuState] = useState<MenuState>(closed);

  const toggleMenuIO = () =>
    pipe(
      menuState,
      match({
        inventory: () => closed,
        armorShop: () => closed,
        closed: () => inventory(weaponsTab),
      }),
      setMenuState
    );

  const handleInput = (input: InputObject) => {
    if (input.KeyCode === Enum.KeyCode.Tab) {
      setMenuState(inventory(weaponsTab));
    }

    if (input.KeyCode === Enum.KeyCode.Return) {
      setMenuState(closed);
    }
  };

  useEffect(() => {
    UserInputService.InputBegan.Connect(handleInput);
  }, []);

  useEffect(() => {
    const shopMenuTriggers = pipe(
      Workspace,
      findFirstChild("ShopMenuTriggers"),
      O.chain(O.fromPredicate(t.instanceOf("Folder"))),
      O.map(getChildren),
      O.chain(O.fromPredicate(t.array(shopMenuTriggerD)))
    );

    print(shopMenuTriggers);

    const addTriggerTouchedEventsIO = pipe(
      shopMenuTriggers,
      O.map((ts) => () => {
        ts.forEach((trigger) =>
          trigger.Touched.Connect(() => {
            const wearables = pipe(
              trigger.StockFolder.Value?.GetChildren(),
              O.fromPredicate(t.array(wearableD))
            );

            if (O.isSome(wearables) && menuState.tag !== 'armorShop') {
              setMenuState(armorShop(wearables.value));
            }
          })
        );
      }),
      O.getOrElse(() => noOpIO)
    );

    addTriggerTouchedEventsIO();
  }, []);

  print(menuState);

  return (
    <screengui>
      {pipe(
        menuState,
        match({
          inventory: ({ tab }) => (
            <InventoryMenu
              onCloseButtonClick={toggleMenuIO}
              tab={tab}
              onTabClick={(t) => setMenuState(inventory(t))}
            />
          ),
          armorShop: ({ wearables }) => (
            <ArmorShopMenu
              wearables={wearables}
              onCloseButtonClick={toggleMenuIO}
            />
          ),
          closed: () => <HUD onMenuButtonClick={toggleMenuIO} />,
        })
      )}
    </screengui>
  );
});

Roact.mount(
  <PlayerUI />,
  Players.LocalPlayer.FindFirstChildOfClass("PlayerGui")
);
