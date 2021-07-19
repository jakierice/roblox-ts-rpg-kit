import Roact from "@rbxts/roact"
import { t } from "@rbxts/t"
import Hooks from "@rbxts/roact-hooks"

import { Remotes } from "shared/remotes"
import { A, E, O, pipe } from "shared/fp-ts"
import { List, ListItemButton } from "./List"
import { Players, ReplicatedStorage } from "@rbxts/services"
import { makePaddingAll } from "./UI.utilities"
import { neonBlue } from "./Color"

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

const wearableD = t.intersection(
  t.instanceOf("Accessory"),
  t.children({ DisplayName: t.instanceOf("StringValue") })
)

const getWearables = (replicatedStorage: ReplicatedStorage) =>
  pipe(
    replicatedStorage.FindFirstChild("Wearables"),
    E.decode(t.instanceOf("Folder")),
    E.map((a) => a.GetChildren()),
    E.map((as) => {
      print("Stuff from Wearables folder", as)
      return as
    }),
    E.chain(E.decode(t.array(wearableD)))
  )

const ListWrapper: Roact.FunctionComponent = (props) => {
  return (
    <frame Size={new UDim2(0.32, 0, 1, 0)} BackgroundTransparency={1}>
      {props[Roact.Children]}
      <uipadding {...makePaddingAll(new UDim(0, 8))} />
    </frame>
  )
}

export type Wearable = t.static<typeof wearableD>

export const ArmorMenu = new Hooks(Roact)((_props, { useEffect, useState }) => {
  const [wearables, setWearables] = useState<
    O.Option<E.Either<string, Array<Wearable>>>
  >(O.none)
  const [attachedAccessories, setAttachedAccessories] = useState<
    O.Option<Array<Wearable>>
  >(O.none)

  const setAccessoriesIO = () =>
    pipe(ReplicatedStorage, getWearables, O.some, setWearables)

  useEffect(setAccessoriesIO, [])

  useEffect(() => {
    const accessories =
      Players.LocalPlayer.Character?.FindFirstChildOfClass(
        "Humanoid"
      )?.GetAccessories()

    pipe(
      accessories,
      O.fromPredicate(t.array(wearableD)),
      setAttachedAccessories
    )
  }, [])

  print("wearables: ", wearables)

  return (
    <>
      <ListWrapper>
        <List padding={new UDim(0, 0)}>
          {pipe(
            wearables,
            O.map(
              E.fold(
                (a) => [
                  <textlabel
                    Text={a}
                    TextColor3={neonBlue}
                    TextSize={24}
                    TextWrap={true}
                    Size={new UDim2(1, 0, 1, 0)}
                    TextXAlignment="Center"
                    BackgroundTransparency={1}
                  >
                    <uipadding {...makePaddingAll(new UDim(0, 8))} />
                  </textlabel>,
                ],
                A.map((wearable) => (
                  <ListItemButton
                    isActive={true}
                    text={wearable.DisplayName.Value}
                    onClick={() => AttachWearable.CallServerAsync(wearable)}
                  />
                ))
              )
            ),
            O.toUndefined
          )}
        </List>
      </ListWrapper>
      <CurrentEquipmentWrapper>
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
      </CurrentEquipmentWrapper>
    </>
  )
})
