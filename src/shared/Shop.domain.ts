import { t } from "@rbxts/t";

export const shopMenuTriggerD = t.intersection(
  t.instanceOf("Part"),
  t.children({ StockFolder: t.instanceOf("ObjectValue") })
);

export type ShopMenuTrigger = t.static<typeof shopMenuTriggerD>

