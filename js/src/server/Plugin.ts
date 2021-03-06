import * as events from "events";
import path = require("path");
import readline = require("readline");
import minimatch = require("minimatch");

import {IPluginConfiguration} from "./IPluginConfiguration";
import IRemoteCommandExecutor = require("./Commands/IRemoteCommandExecutor");

import { IPluginHost } from "./IPluginHost";
import { IPluginHostFactory } from "./IPluginHostFactory";

export default class Plugin extends events.EventEmitter {

    private _pluginPath: string;
    private _pluginName: string;
    private _gvimServerName: string;
    private _config: IPluginConfiguration = null;
    private _commandExecutor: IRemoteCommandExecutor;

    private _pluginHost: IPluginHost;
    private _pluginHostFactory: IPluginHostFactory;

    public get pluginName(): string {
        return this._pluginName;
    }

    public get pluginPath(): string {
        return this._pluginPath;
    }

    public get pluginHost(): IPluginHost {
        return this._pluginHost;
    }

    constructor(commandExecutor: IRemoteCommandExecutor, pluginHostFactory: IPluginHostFactory, gvimServerName: string, pluginName: string, pluginPath: string, config: IPluginConfiguration) {
        super();

        this._gvimServerName = gvimServerName;
        this._pluginName = pluginName;
        this._pluginPath = pluginPath;
        this._config = config;
        this._commandExecutor = commandExecutor;
        this._pluginHostFactory = pluginHostFactory;
    }

    public start(): void {
        if (this._pluginHost)
            return;

        this._pluginHost = this._pluginHostFactory.createPluginHost();
        this._pluginHost.start(this._gvimServerName, this._pluginName, this._pluginPath);

        this._pluginHost.on("message", (msg) => {
            this._handleMessage(msg);
        });
    }

    public showDevTools(): void {
        this._pluginHost.showDevTools();
    }

    public hideDevTools(): void {
        this._pluginHost.hideDevTools();
    }

    private _handleMessage(data): void {
        if (data && data.type) {
            if (data.type === "command") {
                var command = data.command.split("\"").join("\\\"");
                this._commandExecutor.executeCommand(this._gvimServerName, command);
            } else if(data.type === "loadplugin") {
                this.emit("loadplugin", data.pluginPath);
            }
        }
    }

    public notifyEvent(eventName: string, eventArgs: any) {
        console.log(this._pluginName + ": firing event - " + eventName + "|" + JSON.stringify(eventArgs));

        var commandInfo = {
            type: "event",
            eventName: eventName,
            callContext: eventArgs
        };

        this._writeToPlugin(commandInfo, eventArgs);
    }

    public startOmniComplete(omniCompletionArgs: any): void {
        var commandInfo = {
            type: "omnicomplete",
            arguments: omniCompletionArgs
        };

        this._writeToPlugin(commandInfo, omniCompletionArgs);
    }

    public onBufferChanged(bufferChangedEventArgs: any): void {
        var commandInfo = {
            type: "bufferChanged",
            arguments: bufferChangedEventArgs
        };
        this._writeToPlugin(commandInfo, bufferChangedEventArgs);
    }

    public execute(commandName: string, callContext: any) {
        var commandInfo = {
            type: "execute",
            command: commandName,
            callContext: callContext
        };
        this._writeToPlugin(commandInfo, callContext);
    }

    private _writeToPlugin(command: any, context: any): void {
        if (this._pluginHost) {
            if (this._isCommandHandled(context)) {
                console.log("Writing to plugin: " + this._pluginName);
                this._pluginHost.sendCommand(command);
            } else {
                console.log("Command ignored for buffer: " + context.currentBuffer);
            }
        }
    }

    private _isCommandHandled(context: any): boolean {
        var filterPassed = true;
        if (this._config.supportedFiles) {
            var anyMatches = false;

            var matches = this._config.supportedFiles.filter((fileFilter) => minimatch(context.currentBuffer, fileFilter, { matchBase: true }));
            filterPassed = filterPassed && matches.length > 0;
        }

        if (this._config.supportedFileTypes) {
            var matches = this._config.supportedFileTypes.filter(f => f === context.filetype);
            filterPassed = filterPassed && matches.length > 0;
        }

        return filterPassed;
    }

    public dispose(): void {
        if(this._pluginHost) {
            this._pluginHost.dispose();
            this._pluginHost = null;
        }
    }
}
