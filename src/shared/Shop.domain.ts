import { Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { O } from "./fp-ts";
import { pipe } from "./fp/function";
import { findFirstChild, getChildren } from "./Instance.utilities";

export const shopMenuTriggerD = t.intersection(
  t.instanceOf("Part"),
  t.children({ StockFolder: t.instanceOf("ObjectValue") })
);

export type ShopMenuTrigger = t.static<typeof shopMenuTriggerD>;

export const shopMenuTriggers = pipe(
  Workspace,
  findFirstChild("ShopMenuTriggers"),
  O.chain(O.fromPredicate(t.instanceOf("Folder"))),
  O.map(getChildren),
  O.chain(O.fromPredicate(t.array(shopMenuTriggerD)))
);
