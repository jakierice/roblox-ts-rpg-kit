import Roact from "@rbxts/roact"

export const FullScreenOverlay = () => (
  <screengui IgnoreGuiInset={true}>
    <frame
      Size={new UDim2(1, 0, 1, 0)}
      Position={new UDim2(0, 0, 0, 0)}
      BackgroundColor3={new Color3(0, 0, 0)}
      BackgroundTransparency={0.4}
    ></frame>
  </screengui>
)

export const FullScreenModalHeader = (props: { onClose: () => void }) => {
  return (
    <frame
      Size={new UDim2(1, 0, 0, 48)}
      Position={new UDim2(0, 0, 0, 0)}
      BackgroundTransparency={1}
    >
      <imagebutton
        Image="rbxassetid://7103099860"
        Size={new UDim2(0, 132, 0, 32)}
        AnchorPoint={new Vector2(1, 0)}
        Position={new UDim2(1, 0, 0, 0)}
        BackgroundTransparency={1}
        Event={{ MouseButton1Click: props.onClose }}
      />
      <frame
        Size={new UDim2(1, 0, 0, 4)}
        Position={new UDim2(0, 0, 0, 32)}
        BackgroundColor3={new Color3(0, 255, 255)}
      ></frame>
      <frame
        Size={new UDim2(1, 0, 0, 4)}
        Position={new UDim2(0, 0, 0, 32)}
        BackgroundTransparency={1}
      ></frame>
    </frame>
  )
}
