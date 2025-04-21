import {ECS, useGUI} from "../modules/state.jsx";
import {forwardRef, useImperativeHandle, useRef} from "react";



const Player = forwardRef((props, ref) => {

    const group = useRef()

    const HUD = useGUI(
        <div className={'absolute top-0 left-0 text-orange-400 p-2'}>
            player 1 HUD
        </div>
    )

    useImperativeHandle(ref, () => ({
        group
    }))

    return (
        <group ref={group}>
            <mesh scale={[0.8, 0.8, 0.8]} position={[0, 0.4, 0]}>
                <boxGeometry />
                <meshStandardMaterial color={'#ff9900'} />
            </mesh>
        </group>
    )
})



export const PlayerEntity = () => {

    return (
        <ECS.Entity>
            <ECS.Component name="isPlayer" data={true}/>

            <ECS.Component name="position" data={{x: 0, y: 0, z: 0}}/>
            <ECS.Component name="rotation" data={{x: 0, y: 0, z: 0}}/>
            <ECS.Component name="scale" data={{x: 1, y: 1, z: 1}}/>

            <ECS.Component name="velocity" data={{x: 0, y: 0, z: 0}}/>
            <ECS.Component name={'speed'} data={5} />

            <ECS.Component name="state" data={{
                walking: false,
                running: false,
                jumping: false,
                swimming: false,
                flying: false,
                mounted: false,
            }}/>

            <ECS.Component name="render">
                <Player />
            </ECS.Component>

        </ECS.Entity>
    )

}




export const PlayerSystem = () => {

    return (
        <PlayerEntity />
    )
}
