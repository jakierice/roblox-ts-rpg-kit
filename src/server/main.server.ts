import { Players } from "@rbxts/services";
import { t } from "@rbxts/t";
import { O, E, pipe } from "shared/fp-ts";
import { noOpIO } from "shared/fp/fp-ts-ext";
import { findFirstChild } from "shared/Instance.utilities";
import { Remotes } from "shared/remotes";
import {
  getReplicatedStorageWearables,
  wearableD,
} from "shared/Wearable.domain";

const EquipWeapon = Remotes.Server.Create("EquipWeapon");
const UnequipWeapon = Remotes.Server.Create("UnequipWeapon");
const AttachWearable = Remotes.Server.Create("AttachWearable");
const DetachWearable = Remotes.Server.Create("DetachWearable");
const PurchaseWearable = Remotes.Server.Create("PurchaseWearable");

EquipWeapon.SetCallback((player, weapon) => {
  const humanoid = player.Character?.FindFirstChildOfClass("Humanoid");
  humanoid?.EquipTool(weapon);

  return `Weapon has been equipped!`;
});

UnequipWeapon.SetCallback((player) => {
  const humanoid = player.Character?.FindFirstChildOfClass("Humanoid");
  humanoid?.UnequipTools();

  return `Weapon has been unequipped!`;
});

AttachWearable.SetCallback((player, wearable) =>
  pipe(
    player.Character?.FindFirstChildOfClass("Humanoid"),
    O.fromPredicate(t.instanceOf("Humanoid")),
    O.chain((h) => {
      h.AddAccessory(wearable);

      return pipe(h.GetAccessories(), O.fromPredicate(t.array(wearableD)));
    })
  )
);

DetachWearable.SetCallback((player, wearable) => {
  const humanoid = player.Character?.FindFirstChildOfClass("Humanoid");
  const currentAccessories = humanoid?.GetAccessories();
  const wearablesFolder = player.FindFirstChild("Wearables");

  const targetAccessory = currentAccessories?.find((a) => a === wearable);

  if (targetAccessory) {
    targetAccessory.Parent = wearablesFolder;
  }

  return pipe(
    wearablesFolder?.GetChildren(),
    O.fromPredicate(t.array(wearableD))
  );
});

PurchaseWearable.SetCallback((player, wearable) => {
  const accountBalance: number = pipe(
    player,
    findFirstChild("Stats"),
    O.chain(findFirstChild("Gold")),
    O.chain(O.fromPredicate(t.numberPositive)),
    O.getOrElse(() => 0)
  );

  const addToBackpackIO = (instance: Instance) =>
    pipe(
      player,
      findFirstChild("Backpack"),
      O.map((backpack) => () => {
        instance.Clone().Parent = backpack;
      }),
      O.getOrElse(() => noOpIO)
    );
  const addToStarterGearIO = (instance: Instance) =>
    pipe(
      player,
      findFirstChild("StarterGear"),
      O.map((starterGear) => () => {
        instance.Clone().Parent = starterGear;
      }),
      O.getOrElse(() => noOpIO)
    );

  if (wearable.Price.Value <= accountBalance) {
    addToStarterGearIO(wearable);
    addToBackpackIO(wearable);

    return E.right(wearable);
  } else {
    return E.left(
      `Insufficient funds to purchase ${wearable.DisplayName.Value}`
    );
  }
});

// initialize player inventory
Players.PlayerAdded.Connect((player) =>
  pipe(getReplicatedStorageWearables, (ws) => {
    const wearablesFolder = new Instance("Folder");
    wearablesFolder.Name = "Wearables";

    if (E.isRight(ws)) {
      wearablesFolder.Parent = player;

      ws.right.forEach((w) => {
        const clone = w.Clone();
        clone.Parent = wearablesFolder;
      });
    }
  })
);
