import {Layer} from "./layer";

export class Namespace {

    private static _instance: Namespace

    private layer: Map<string, Layer> | null

    private constructor() {
        this.layer = new Map<string, Layer>()
    }

    public static get Instance() {
        return this._instance || (this._instance = new this())
    }

    addLayer(id: string, layer: Layer): void {
        this.layer.set(id, layer)
    }

    removeLayer(id: string): void {
        this.layer.delete(id)
    }

    getLayer(id: string): Layer {
        return this.layer.get(id)
    }
}
