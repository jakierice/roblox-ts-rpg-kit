import Roact from '@rbxts/roact'

const MenuButton = ({ onClick }: { onClick: () => void }) => (
  <imagebutton
    Image="rbxassetid://7097495552"
    HoverImage="rbxassetid://7097576626"
    Position={new UDim2(0.02, 0, 0.32, 0)}
    Size={new UDim2(0, 72, 0, 72)}
    Style="Custom"
    ScaleType="Fit"
    SliceScale={1}
    Visible={true}
    BackgroundTransparency={1}
    Event={{ MouseButton1Click: onClick }}
  />
)

interface HUDProps {
  onMenuButtonClick: () => void
}

export const HUD = (props: HUDProps) => {
  return <MenuButton onClick={props.onMenuButtonClick} />
}
