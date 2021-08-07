import Roact from "@rbxts/roact"
import { t } from "@rbxts/t"
import Hooks from "@rbxts/roact-hooks"

import { Remotes } from "shared/remotes"
import { A, E, Eq, O, pipe } from "shared/fp-ts"
import { List, ListItemButton } from "./List"
import { Players } from "@rbxts/services"
import { makePaddingAll } from "./UI.utilities"
import { noOpIO } from "shared/fp/fp-ts-ext"
import {
  eqWearable,
  getWearables,
  Wearable,
  wearableD,
} from "shared/Wearable.domain"
import { useIO } from "./useIO"
import { tuple } from "shared/fp/function"

const AttachWearable = Remotes.Client.Get("AttachWearable")
const DetachWearable = Remotes.Client.Get("DetachWearable")

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
  )
}

const ListWrapper: Roact.FunctionComponent = (props) => {
  return (
    <frame Size={new UDim2(0.32, 0, 1, 0)} BackgroundTransparency={1}>
      {props[Roact.Children]}
      <uipadding {...makePaddingAll(new UDim(0, 8))} />
    </frame>
  )
}

export const ArmorMenu = new Hooks(Roact)((_props, hooks) => {
  const { useState } = hooks
  const [wearables, setWearables] = useState<O.Option<Array<Wearable>>>(O.none)
  const [attachedAccessories, setAttachedAccessories] = useState<
    O.Option<Array<Wearable>>
  >(O.none)

  const getAccessoriesIO: () => void = () => {
    const humanoid =
      Players.LocalPlayer.Character?.FindFirstChildOfClass("Humanoid")
    const accessories = humanoid?.GetAccessories()

    pipe(
      accessories,
      O.fromPredicate(t.array(wearableD)),
      setAttachedAccessories
    )
  }

  const getWearablesIO: () => void = pipe(
    Players.LocalPlayer,
    getWearables,
    E.fold(
      (e) => () => print("Could not get Player wearables. Error: ", e),
      (ws) => () => setWearables(O.some(ws))
    )
  )

  // const addAccessoriesListeners: () => void = pipe(
  //   attachedAccessories,
  //   O.map((as) => () => {
  //     as.forEach((a) => {
  //       a.AncestryChanged.Connect(() => {
  //         print("Ancestry of an accessory changed.")
  //         getAccessoriesIO()
  //       })
  //     })
  //     return as
  //   }),
  //   O.getOrElse(() => noOpIO)
  // )
  // const addWearablesListeners: () => void = pipe(
  //   wearables,
  //   O.map((ws) => () => {
  //     ws.forEach((w) => {
  //       w.AncestryChanged.Connect(() => {
  //         print("Ancestry of an accessory changed.")
  //         ;("Ancestry of a wearable changed.")
  //         getWearablesIO()
  //       })
  //     })
  //     return ws
  //   }),
  //   O.getOrElse(() => noOpIO)
  // )

  // const eqOptionArrayWearables = O.getEq(A.getEq(eqWearable))

  useIO(getWearablesIO, tuple(), Eq.tuple(), hooks)
  useIO(getAccessoriesIO, tuple(), Eq.tuple(), hooks)
  // useIO(
  //   addWearablesListeners,
  //   tuple(wearables),
  //   Eq.tuple(eqOptionArrayWearables),
  //   hooks
  // )
  // useIO(
  //   addAccessoriesListeners,
  //   tuple(attachedAccessories),
  //   Eq.tuple(eqOptionArrayWearables),
  //   hooks
  // )
  // // useEffect(addWearablesListeners, [wearables])
  // useEffect(addAccessoriesListeners, [attachedAccessories])

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
                  onClick={() => AttachWearable.CallServerAsync(wearable)}
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
                  onClick={() => DetachWearable.CallServerAsync(wearable)}
                />
              ))
            ),
            O.toUndefined
          )}
        </List>
      </CurrentEquipmentWrapper>
    </>
  )
})
