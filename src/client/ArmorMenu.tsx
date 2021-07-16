import Roact from '@rbxts/roact'
import { t } from '@rbxts/t'
import { ReplicatedStorage } from '@rbxts/services'
import Hooks from '@rbxts/roact-hooks'

const ListSpacer = () => (
  <frame
    Size={new UDim2(1, 0, 0, 8)}
    Position={new UDim2(0, 0, 0, 0)}
    BackgroundTransparency={1}
  ></frame>
)

export const ArmorMenuUI: Hooks.FC = (_props, { useEffect, useState }) => {
  const [accessories, setAccessories] = useState<Array<Accessory>>([])

  useEffect(() => {
    const list = ReplicatedStorage.FindFirstChild('Accessories')?.GetChildren()

    if (t.array(t.intersection(t.instanceOf('Accessory')))(list)) {
      setAccessories(list)
    }
  }, [])

  return (
    <frame
      Size={new UDim2(1, 0, 0, 0)}
      Position={new UDim2(0, 0, 0, 0)}
      BackgroundColor3={new Color3(0, 0, 0)}
      BackgroundTransparency={1}
    >
      <uilistlayout FillDirection="Vertical" Padding={new UDim(0, 8)} />
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
    </frame>
  )
}

export const ArmorMenu = new Hooks(Roact)(ArmorMenuUI)
