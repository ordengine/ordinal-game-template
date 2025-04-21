import { World } from "miniplex"
import createReactAPI from "miniplex-react"
import {makeStore} from "statery";
import { useStore } from "statery";
import React, {useEffect, useMemo, useRef} from "react";

///
/// camera defaults, ECS setup, global systemStore + useSystem, global GUI store + useGUI
///

export const CANVAS_DEFAULTS = {
    shadows: true,
    dpr: 1,
    camera: {fov: 32, position: [11, 2, 0], near: 0.1, far: 100000},
    gl: {
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false,
        antialias: false,
        alpha: false,
    }
}

const world = new World()
export const ECS = createReactAPI(world)

export const systemStore = makeStore({
    systemArray: []
})

let systemIdCounter = 0
const generateSystemId = () => `gui-${systemIdCounter++}`

export const useSystem = (system) => {
    const id = useMemo(() => generateSystemId(), [])
    const ref = useRef(null)

    useEffect(() => {
        if (!system) {
            return
        }

        const systemWithKey = { id, system, ref }

        systemStore.set((state) => ({
            systemArray: [...state.systemArray, systemWithKey],
        }))

        return () => {
            systemStore.set((state) => ({
                systemArray: state.systemArray.filter((el) => el.id !== id),
            }))
        }
    }, [id, system])

    const remove = () => {
        systemStore.set((state) => ({
            systemArray: state.systemArray.filter((el) => el.id !== id),
        }))
    }

    return { id, ref, remove }
}

export const Systems = () => {
    const { systemArray } = useStore(systemStore);
    return (
        <>
            {systemArray.map((system, index) => (
                <system.system key={index} />
            ))}
        </>
    )
}

export const guiStore = makeStore({
    elementArray: [],
})

let elementIdCounter = 0
const generateId = () => `gui-${elementIdCounter++}`

export const useGUI = (element) => {
    const id = useMemo(() => generateId(), [])
    const ref = useRef(null)

    useEffect(() => {
        if (!element || (typeof element !== 'function' && !React.isValidElement(element))) {
            console.warn('useGUI: invalid element provided')
            return
        }

        const elementWithKey = { id, element, ref }

        guiStore.set((state) => ({
            elementArray: [...state.elementArray, elementWithKey],
        }))

        return () => {
            guiStore.set((state) => ({
                elementArray: state.elementArray.filter((el) => el.id !== id),
            }))
        }
    }, [id, element])

    const remove = () => {
        guiStore.set((state) => ({
            elementArray: state.elementArray.filter((el) => el.id !== id),
        }))
    }

    return { id, ref, remove }
}

export const GUI = () => {
    const { elementArray } = useStore(guiStore);

    return (
        <>
            {elementArray.map(({ id, element, ref }) =>
                typeof element === 'function'
                    ? React.cloneElement(element({ ref }), { key: id })
                    : React.cloneElement(element, { key: id, ref })
            )}
        </>
    )
}
