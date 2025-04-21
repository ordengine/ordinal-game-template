import {Bloom, BrightnessContrast, DepthOfField, EffectComposer, HueSaturation} from "@react-three/postprocessing";

export const PostprocessingSystem = () => {

    return (
        <EffectComposer multisampling={6}>
            <Bloom
                mipmapBlur
                radius={0.8}
                luminanceThreshold={1.1}
                intensity={0.9}
                kernelSize={5}
            />
        </EffectComposer>
    )
}
