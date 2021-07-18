import Roact from "@rbxts/roact"
import { black, neonBlue } from "./Color"

export const ListItemButton = (props: {
  text: string
  onClick: () => void
  isActive: boolean
}) => {
  const textColor = props.isActive ? black : neonBlue

  const backgroundTransparency = props.isActive ? 0 : 1

  return (
    <frame
      AutomaticSize="Y"
      Size={new UDim2(1, 0, 0, 0)}
      BackgroundTransparency={1}
      BorderSizePixel={0}
    >
      <textbutton
        AutomaticSize="Y"
        Size={new UDim2(1, 0, 0, 0)}
        TextSize={12}
        Text={props.text}
        TextXAlignment="Left"
        TextColor3={textColor}
        BorderSizePixel={0}
        BackgroundColor3={neonBlue}
        BackgroundTransparency={backgroundTransparency}
        Event={{
          MouseButton1Click: props.onClick,
        }}
      >
        <uipadding
          PaddingTop={new UDim(0, 8)}
          PaddingRight={new UDim(0, 8)}
          PaddingBottom={new UDim(0, 8)}
          PaddingLeft={new UDim(0, 8)}
        />
      </textbutton>
      <frame
        Position={new UDim2(0, 0, 1, 0)}
        Size={new UDim2(1, 0, 0, 2)}
        BackgroundColor3={neonBlue}
      />
    </frame>
  )
}

export const List: Roact.FunctionComponent<{ padding: UDim }> = (props) => {
  return (
    <frame
      Size={new UDim2(1, 0, 1, 0)}
      Position={new UDim2(0, 0, 0, 0)}
      BackgroundTransparency={1}
    >
      <uilistlayout
        FillDirection="Vertical"
        Padding={props.padding}
        SortOrder="Name"
      />
      {props[Roact.Children]}
    </frame>
  )
}
