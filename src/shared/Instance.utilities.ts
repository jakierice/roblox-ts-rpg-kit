import { t } from "@rbxts/t";
import { O } from "./fp-ts";
import { pipe } from "./fp/function";

export const findHumanoid = (player: Player) =>
  pipe(
    player,
    (p) => p.FindFirstChild("Humanoid"),
    O.fromPredicate(t.instanceOf("Humanoid"))
  );

export const findFirstChild = (childName: string) => (instance: Instance) =>
  pipe(
    instance,
    (i) => i.FindFirstChild(childName),
    O.fromPredicate(t.Instance)
  );

export const getChildren = (instance: Instance) => instance.GetChildren();

