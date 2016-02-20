import PluginManager from "./PluginManager";

export default class Session {

    private _session: string;
    private _pluginManager: PluginManager;

    constructor(session: string) {
        this._session = session;
        this._pluginManager = new PluginManager(session);
    }

    public get plugins(): PluginManager {
        return this._pluginManager;
    }
}