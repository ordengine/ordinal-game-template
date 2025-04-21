import {ECS, useGUI} from "../modules/state.jsx";
import {forwardRef, useEffect, useImperativeHandle, useRef} from "react";


const TerrainChunk = forwardRef((props, ref) => {

    const group = useRef()

    useImperativeHandle(ref, () => ({
        group
    }))

    return (
        <group ref={group}>
            <mesh scale={[3, 0.1, 1]}>
                <boxGeometry />
                <meshStandardMaterial color={'green'} />
            </mesh>
        </group>
    )
})



export const TerrainChunkEntities = () => {
    const terrainChunks = ECS.world.with("isTerrainChunk")


    useGUI(
        <div className={'absolute top-12 right-0 text-lime-600 p-2'}>
            terrain chunks: {terrainChunks.entities.length}
        </div>
    )

    return (
        <ECS.Entities in={terrainChunks}>
            <ECS.Component name="render">
                <TerrainChunk />
            </ECS.Component>
        </ECS.Entities>
    )

}




export const TerrainSystem = () => {


    useEffect(() => {
        const t1 = ECS.world.add({
            isTerrainChunk: true,
            position: {
                x: 0,
                y: 0,
                z: 0
            }
        })

        const t2 = ECS.world.add({
            isTerrainChunk: true,
            position: {
                x: 0,
                y: 0.0,
                z: 1.1
            }
        })

        const t3 = ECS.world.add({
            isTerrainChunk: true,
            position: {
                x: 0,
                y: 0.0,
                z: -1.1
            }
        })

        return () => {
            ECS.world.remove(t1)
            ECS.world.remove(t2)
            ECS.world.remove(t3)
        }

    }, [])

    return (
        <TerrainChunkEntities />
    )
}
