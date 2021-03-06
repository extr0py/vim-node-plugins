import Session from "./Session";
import IRemoteCommandExecutor = require("./Commands/IRemoteCommandExecutor");

import {EventEmitter} from "events";
import {IPluginHostFactory} from "./IPluginHostFactory";

var SessionStartEvent = "start";
var SessionEndEvent= "end";

export default class SessionManager extends EventEmitter {

    private _sessions = {};
    private _commandExecutor: IRemoteCommandExecutor;
    private _pluginHostFactory: IPluginHostFactory;

    constructor(commandExecutor: IRemoteCommandExecutor, pluginHostFactory: IPluginHostFactory) {
        super();

        this._commandExecutor = commandExecutor;
        this._pluginHostFactory = pluginHostFactory;
    }

    public getSessions(): Session[] {
        return Object.keys(this._sessions).map((k) => (this._sessions[k]));
    }

    public getOrCreateSession(sessionName: string): Session {
        if (this._sessions[sessionName]) {
            console.log("Session exists: " + sessionName);
            return this._sessions[sessionName];
        }

        console.log("Creating new session: " + sessionName);
        var newSession = new Session(sessionName, this._commandExecutor, this._pluginHostFactory);

        this._sessions[sessionName] = newSession;

        this.emit(SessionStartEvent, newSession);

        return newSession;
    }

    public getSession(sessionName: string): Session {
        if (!this._sessions[sessionName]) {
            return null;
        }

        return this._sessions[sessionName];
    }

    public endSession(sessionName: string): void {
        console.log("Deleting session: " + sessionName);
        if (this._sessions[sessionName]) {
            var session = this._sessions[sessionName];

            this.emit(SessionEndEvent, session);

            session.dispose();
            session = null;
            delete this._sessions[sessionName];
        }
    }
}
