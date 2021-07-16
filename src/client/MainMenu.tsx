import Roact from '@rbxts/roact'
import { ArmorMenu } from './ArmorMenu'

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

export type Open = { tag: 'open' }
export const open: Open = { tag: 'open' }
export type Closed = { tag: 'closed' }
export const closed: Closed = { tag: 'closed' }
export type MenuState = Open | Closed

export const isOpen = (menuState: MenuState): menuState is Open =>
  menuState.tag === 'open'
export const isClosed = (menuState: MenuState): menuState is Closed =>
  menuState.tag === 'closed'

interface MainMenuProps {
  onCloseButtonClick: () => void
}

export const MainMenu = (props: MainMenuProps) => {
  return (
    <screengui>
      <FullScreenOverlay />
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
          Event={{ MouseButton1Click: props.onCloseButtonClick }}
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
      <frame
        Position={new UDim2(0, 32, 0, 40)}
        Size={new UDim2(1, 0, 1, 0)}
        BackgroundTransparency={1}
      >
        <ArmorMenu />
      </frame>
    </screengui>
  )
}
