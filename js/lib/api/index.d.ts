import events = require("events");
import { ILocListEntry } from "./ILocListEntry";
import syntax = require("./ISyntaxHighlighting");
import * as omni from "./OmniCompletionmanager";
export default class Vim extends events.EventEmitter {
    private _serverName;
    private _commandNameToFunction;
    private _pluginName;
    private _omniCompletionManager;
    private _evalSequence;
    private _evalCallbacks;
    omniCompleters: omni.OmniCompletionManager;
    constructor(serverName: string, pluginName: string, channel: string);
    serverName: string;
    pluginName: string;
    addCommand(name: string, callbackFunction: Function): void;
    exec(command: string): void;
    eval(command: string, callbackFunction: Function): void;
    loadPlugin(pluginPackageFilePath: string): void;
    rawExec(command: string): void;
    echo(msg: string): void;
    echohl(msg: string, highlightGroup: string): void;
    setSyntaxHighlighting(syntaxHighlightingInfo: syntax.ISyntaxHighlighting): void;
    clearErrors(key: string): void;
    setErrors(key: string, errors: ILocListEntry[]): void;
    setLocationList(locations: ILocListEntry[]): void;
    setQuickFixList(locations: ILocListEntry[]): void;
    private _rawExec(command);
    private _executeEvent(command);
    private _executeCommand(command);
    private _onBufferChanged(bufferChangeInfo);
    private _onEvalResult(command);
    private _handleCommand(command);
}
