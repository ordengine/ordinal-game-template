import {ECS, useGUI} from "../modules/state.jsx";
import {forwardRef, useEffect, useImperativeHandle, useRef} from "react";



const Mob = forwardRef((props, ref) => {

    const group = useRef()

    useImperativeHandle(ref, () => ({
        group
    }))

    return (
        <group ref={group}>
            <mesh scale={[0.2, 0.3, 0.2]}>
                <sphereGeometry />
                <meshToonMaterial color={[1, 4, 1]} />
            </mesh>
        </group>
    )
})



export const MobEntities = () => {
    const mobs = ECS.world.with("isMob")

    useGUI(
        <div className={'absolute top-0 right-0 text-lime-400 p-2'}>
            mobs: {mobs.entities.length}
        </div>
    )

    return (
        <ECS.Entities in={mobs}>
            <ECS.Component name="render">
                <Mob />
            </ECS.Component>
        </ECS.Entities>
    )

}




export const MobSystem = () => {


    useEffect(() => {
        const m1 = ECS.world.add({
            isMob: true,
            position: {
                x: 0,
                y: 0.2,
                z: -1
            }
        })

        const m2 = ECS.world.add({
            isMob: true,
            position: {
                x: 0.7,
                y: 0.3,
                z: 1.2
            }
        })

        return () => {
            ECS.world.remove(m1)
            ECS.world.remove(m2)
        }

    }, [])

    return (
        <MobEntities />
    )
}
