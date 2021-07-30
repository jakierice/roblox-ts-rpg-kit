import Roact from "@rbxts/roact"
import { t } from "@rbxts/t"
import Hooks from "@rbxts/roact-hooks"

import { Remotes } from "shared/remotes"
import { A, O, pipe } from "shared/fp-ts"
import { noOpIO } from "shared/fp/fp-ts-ext"
import { flow } from "shared/fp/function"
import { List, ListItemButton } from "./List"
import { makePaddingAll } from "./UI.utilities"
import { getBackpack } from "shared/utilities"
import { Players } from "@rbxts/services"

const EquipWeapon = Remotes.Client.Get("EquipWeapon")
const UnequipWeapon = Remotes.Client.Get("UnequipWeapon")
const getBackpackWeapons: (backpack: Backpack) => O.Option<Array<Tool>> = flow(
  (b) => b.GetChildren(),
  A.filter(t.instanceOf("Tool")),
  O.fromPredicate(A.isNonEmpty)
)

const ListWrapper: Roact.FunctionComponent = (props) => {
  return (
    <frame Size={new UDim2(0.32, 0, 1, 0)} BackgroundTransparency={1}>
      {props[Roact.Children]}
      <uipadding {...makePaddingAll(new UDim(0, 8))} />
    </frame>
  )
}

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

export const WeaponsMenu = new Hooks(Roact)(
  (_props, { useEffect, useState }) => {
    const [weapons, setWeapons] = useState<Array<Tool>>([])
    const [equippedWeapon, setEquippedWeapon] = useState<O.Option<Tool>>(O.none)

    // Note: This IO will get all of the Player's weapons from their Backpack,
    // add event connections that will update the state when each weapon is
    // equipped/unequipped, and then set the state of the list of weapons to be
    // used for rendering the WeaponsMenu's list of available weapons.
    const setWeaponsIO = () =>
      pipe(
        Players.LocalPlayer,
        getBackpack,
        O.chain(getBackpackWeapons),
        O.map(
          A.map((weapon) => {
            weapon.Equipped.Connect(() => setEquippedWeapon(O.some(weapon)))
            weapon.Unequipped.Connect(() => setEquippedWeapon(O.none))
            return weapon
          })
        ),
        O.map(setWeapons),
        O.getOrElse(noOpIO)
      )

    const addBackpackListenersIO = () =>
      pipe(
        Players.LocalPlayer,
        getBackpack,
        O.map((bp) => {
          bp.ChildAdded.Connect(setWeaponsIO)
          bp.ChildRemoved.Connect(setWeaponsIO)
        }),
        O.getOrElse(noOpIO)
      )

    // Note: Get and set weapons from the Backpack for for initial state.
    useEffect(setWeaponsIO, [])

    // Note: Add listeners to get weapons from Backpack and update state any time an
    // item is added or removed from the Backpack so that the list remains
    // accurate with the Player's actual backpack contents.
    useEffect(addBackpackListenersIO, [])

    return (
      <>
        <ListWrapper>
          <List padding={new UDim(0, 0)}>
            {pipe(
              weapons,
              A.map((weapon) => (
                <ListItemButton
                  isActive={false}
                  text={weapon.Name}
                  onClick={() => EquipWeapon.CallServerAsync(weapon)}
                />
              ))
            )}
          </List>
        </ListWrapper>
        <CurrentEquipmentWrapper>
          {pipe(
            equippedWeapon,
            O.map((weapon) => (
              <ListItemButton
                isActive={true}
                text={weapon.Name + " [E]"}
                onClick={() => UnequipWeapon.CallServerAsync()}
              />
            )),
            O.toUndefined
          )}
        </CurrentEquipmentWrapper>
      </>
    )
  }
)
