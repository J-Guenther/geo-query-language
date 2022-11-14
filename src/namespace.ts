import {FeatureCollection} from "./geo/featureCollection";

export class Namespace {

    private static _instance: Namespace

    private featureCollections: Map<string, FeatureCollection> | null

    private constructor() {
        this.featureCollections = new Map<string, FeatureCollection>()
    }

    public static get Instance() {
        return this._instance || (this._instance = new this())
    }

    addFeatureCollection(id: string, featureCollection: FeatureCollection): void {
        this.featureCollections.set(id, featureCollection)
    }

    removeFeatureCollection(id: string): void {
        this.featureCollections.delete(id)
    }

    getFeatureCollection(id: string): FeatureCollection {
        return this.featureCollections.get(id)
    }
}
