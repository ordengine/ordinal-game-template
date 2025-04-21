import {useEffect, useRef} from "react";
import {useFrame} from "@react-three/fiber";
import {Environment} from "@react-three/drei";

export const LightSystem = () => {

    const ref = useRef()
    const lightRef = useRef()
    const targetRef = useRef()

    useEffect(function onStart() {
        lightRef.current.target = targetRef.current
        ref.current.position.set(-2, 5, 1)
        targetRef.current.position.set(0, 0, 0)
    })

    useFrame(() => {
        if (window.playerPos) {
            lightRef.current.target = targetRef.current
            ref.current.position.set(window.playerPos.x + -12, window.playerPos.y + 22, window.playerPos.z + 1)
            targetRef.current.position.set(window.playerPos.x + 0, window.playerPos.y, window.playerPos.z + 0)
        }
    })


    return (
        <>
            <Environment environmentIntensity={0.75}
                // files={'h1.hdr'}
                         files={'/content/8c4ea8f9fafef081345ba8a72c08efed2373d0ba33ac92aca5f043071fc42909i0?.hdr'}
            />
            <ambientLight intensity={1} />
            <group ref={ref}>
                <directionalLight
                    ref={lightRef}
                    color={[1, 1, 1]}
                    intensity={1.1}
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-near={1}
                    shadow-camera-far={50}
                    shadow-camera-left={-10}
                    shadow-camera-right={10}
                    shadow-camera-top={10}
                    shadow-camera-bottom={-10}
                    castShadow />
            </group>
            <group ref={targetRef} />
        </>
    )
}
