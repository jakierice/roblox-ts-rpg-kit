import Roact from '@rbxts/roact'
import { t } from '@rbxts/t'
import { ReplicatedStorage } from '@rbxts/services'
import Hooks from '@rbxts/roact-hooks'

export const AccessoryMenuUI: Hooks.FC = (props, { useEffect, useState }) => {
  const [accessories, setAccessories] = useState<Array<Accessory>>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    print('Getting list of acccessories')

    const list = ReplicatedStorage.FindFirstChild('Accessories')?.GetChildren()
    if (t.array(t.intersection(t.instanceOf('Accessory')))(list)) {
      setAccessories(list)
    }
  }, [])

  print('accessories', accessories)

  return isOpen ? (
    <screengui>
      <frame
        Size={new UDim2(1, 0, 1, 0)}
        Position={new UDim2(0, 0, 0, 0)}
        BackgroundColor3={new Color3(0, 0, 0)}
        BackgroundTransparency={0.7}
      >
        <uilistlayout FillDirection="Vertical" />
        <>
          {accessories.map((accessory) => (
            <textbutton
              Size={new UDim2(0.5, 0, 0.2, 0)}
              TextSize={24}
              Text={accessory.Name}
              TextColor3={new Color3(255, 255, 255)}
            />
          ))}
        </>
      </frame>
    </screengui>
  ) : (
    <></>
  )
}

export const AccessoryMenu = new Hooks(Roact)(AccessoryMenuUI)
