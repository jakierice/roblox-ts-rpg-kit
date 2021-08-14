import Roact from "@rbxts/roact";
import { t } from "@rbxts/t";
import Hooks from "@rbxts/roact-hooks";

import { Remotes } from "shared/remotes";
import { A, E, Eq, O, pipe } from "shared/fp-ts";
import { List, ListItemButton } from "./List";
import { Players } from "@rbxts/services";
import { makePaddingAll } from "./UI.utilities";
import { noOpIO } from "shared/fp/fp-ts-ext";
import {
  eqWearable,
  getWearables,
  Wearable,
  wearableD,
} from "shared/Wearable.domain";
import { makeUseIO } from "./useIO";
import { tuple } from "shared/fp/function";

const AttachWearable = Remotes.Client.Get("AttachWearable");
const DetachWearable = Remotes.Client.Get("DetachWearable");

const CurrentEquipmentWrapper: Roact.FunctionComponent = (props) => {
  return (
    <frame
      Position={new UDim2(0.32, 0, 0, 0)}
      Size={new UDim2(0.68, 0, 1, 0)}
      BackgroundTransparency={1}
    >
      {props[Roact.Children]}
      <uipadding {...makePaddingAll(new UDim(0, 8))} />
    </frame>
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

export const ArmorMenu = new Hooks(Roact)(
  (_props, { useState, useEffect, useValue }) => {
    const useIO = makeUseIO(useEffect, useValue);
    const [wearables, setWearables] = useState<O.Option<Array<Wearable>>>(
      O.none
    );
    const [attachedAccessories, setAttachedAccessories] = useState<
      O.Option<Array<Wearable>>
    >(O.none);

    const getAccessoriesIO: () => void = () => {
      const humanoid =
        Players.LocalPlayer.Character?.FindFirstChildOfClass("Humanoid");
      const accessories = humanoid?.GetAccessories();

      pipe(
        accessories,
        O.fromPredicate(t.array(wearableD)),
        setAttachedAccessories
      );
    };

    const getWearablesIO: () => void = pipe(
      Players.LocalPlayer,
      getWearables,
      E.fold(
        (e) => () => print("Could not get Player wearables. Error: ", e),
        (ws) => () => setWearables(O.some(ws))
      )
    );

    useIO(
      getWearablesIO,
      tuple(attachedAccessories),
      Eq.tuple(O.getEq(A.getEq(eqWearable)))
    );
    useIO(
      getAccessoriesIO,
      tuple(wearables),
      Eq.tuple(O.getEq(A.getEq(eqWearable)))
    );

    return (
      <>
        <ListWrapper>
          <List padding={new UDim(0, 0)}>
            {pipe(
              wearables,
              O.map(
                A.map((wearable) => (
                  <ListItemButton
                    isActive={true}
                    text={wearable.DisplayName.Value}
                    onClick={() =>
                      AttachWearable.CallServerAsync(wearable).then(
                        setAttachedAccessories
                      )
                    }
                  />
                ))
              ),
              O.getOrElse(() => [
                <ListItemButton
                  isActive={true}
                  text="You don't have any Wearables"
                  onClick={noOpIO}
                />,
              ])
            )}
          </List>
        </ListWrapper>
        <CurrentEquipmentWrapper>
          <List padding={new UDim(0, 0)}>
            {pipe(
              attachedAccessories,
              O.map(
                A.map((wearable) => (
                  <ListItemButton
                    isActive={true}
                    text={wearable.DisplayName.Value + " [E]"}
                    onClick={() =>
                      DetachWearable.CallServerAsync(wearable).then(
                        setWearables
                      )
                    }
                  />
                ))
              ),
              O.toUndefined
            )}
          </List>
        </CurrentEquipmentWrapper>
      </>
    );
  }
);
