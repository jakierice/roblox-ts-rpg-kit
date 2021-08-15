import Roact from "@rbxts/roact";
import { Players, StarterGui } from "@rbxts/services";
import { MainMenu } from "./MainMenu";
StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);

const PlayerUI = () => <MainMenu />;

Roact.mount(
  <PlayerUI />,
  Players.LocalPlayer.FindFirstChildOfClass("PlayerGui")
);
