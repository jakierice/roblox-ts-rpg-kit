import Roact from '@rbxts/roact'
import { t } from '@rbxts/t'
import { ReplicatedStorage } from '@rbxts/services'
import Hooks from '@rbxts/roact-hooks'

const FullScreenOverlay = () => (
  <screengui IgnoreGuiInset={true}>
    <frame
      Size={new UDim2(1, 0, 1, 0)}
      Position={new UDim2(0, 0, 0, 0)}
      BackgroundColor3={new Color3(0, 0, 0)}
      BackgroundTransparency={0.4}
    ></frame>
  </screengui>
)

const ListSpacer = () => (
  <frame
    Size={new UDim2(1, 0, 0, 8)}
    Position={new UDim2(0, 0, 0, 0)}
    BackgroundTransparency={1}
  ></frame>
)

export const AccessoryMenuUI: Hooks.FC<{ menuState: boolean }> = (
  props,
  { useEffect, useState },
) => {
  const [accessories, setAccessories] = useState<Array<Accessory>>([])

  useEffect(() => {
    const list = ReplicatedStorage.FindFirstChild('Accessories')?.GetChildren()

    if (t.array(t.intersection(t.instanceOf('Accessory')))(list)) {
      setAccessories(list)
    }
  }, [])

  print('Menu is open ', props.menuState)

  return props.menuState ? (
    <>
      <FullScreenOverlay />
      <screengui>
        <frame
          Size={new UDim2(0.9, 0, 0.9, 0)}
          Position={new UDim2(0.5, 0, 0.5, 0)}
          AnchorPoint={new Vector2(0.5, 0.5)}
          BackgroundColor3={new Color3(0, 0, 0)}
          BackgroundTransparency={1}
        >
          <uilistlayout FillDirection="Vertical" Padding={new UDim(0, 8)} />
          <>
            {accessories.map((accessory) => (
              <>
                <textbutton
                  Size={new UDim2(0.32, 0, 0, 32)}
                  TextSize={12}
                  Text={accessory.Name}
                  TextColor3={new Color3(255, 255, 255)}
                  BorderMode="Outline"
                  BorderSizePixel={2}
                  BorderColor3={new Color3(0, 255, 255)}
                  BackgroundColor3={new Color3(0, 0, 0)}
                />
                <ListSpacer />
              </>
            ))}
          </>
        </frame>
      </screengui>
    </>
  ) : (
    <></>
  )
}

export const AccessoryMenu = new Hooks(Roact)(AccessoryMenuUI)
