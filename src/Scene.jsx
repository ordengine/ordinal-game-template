import {Canvas} from "@react-three/fiber";
import {CANVAS_DEFAULTS, useSystem, Systems, GUI} from "./modules/state.jsx";


import {RenderSystem} from "./systems/core/RenderSystem.jsx";
import {PostprocessingSystem} from "./systems/core/PostprocessingSystem.jsx";
import {LightSystem} from "./systems/core/LightSystem.jsx";
import {EnvironmentSystem} from "./systems/core/EnvironmentSystem.jsx";
import {TerrainSystem} from "./systems/TerrainSystem.jsx";
import {PlayerSystem} from "./systems/PlayerSystem.jsx";
import {MobSystem} from "./systems/MobSystem.jsx";

export const Scene = () => {

    useSystem(RenderSystem)
    useSystem(LightSystem)
    useSystem(PostprocessingSystem)
    useSystem(EnvironmentSystem)
    useSystem(TerrainSystem)
    useSystem(PlayerSystem)
    useSystem(MobSystem)


    return (
        <div className={'w-full h-full overflow-hidden'}>
            <Canvas {...CANVAS_DEFAULTS}>
                <Systems/>
            </Canvas>
            <GUI/>
        </div>
    )
}
