import Net from "@rbxts/net";
import { Wearable } from "shared/Wearable.domain";
import { E, O } from "./fp-ts";

export const Remotes = Net.Definitions.Create({
  PrintMessage: Net.Definitions.ClientToServerEvent<[message: string]>(),
  EquipWeapon: Net.Definitions.ServerAsyncFunction<(weapon: Tool) => string>(),
  UnequipWeapon: Net.Definitions.ServerAsyncFunction<() => string>(),
  AttachWearable:
    Net.Definitions.ServerAsyncFunction<
      (wearable: Wearable) => O.Option<Array<Wearable>>
    >(),
  DetachWearable:
    Net.Definitions.ServerAsyncFunction<
      (wearable: Wearable) => O.Option<Array<Wearable>>
    >(),
  PurchaseWearable:
    Net.Definitions.ServerAsyncFunction<
      (wearable: Wearable) => E.Either<string, Wearable>
    >(),
});
