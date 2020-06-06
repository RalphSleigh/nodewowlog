

export function IsElectron(): boolean {
    return process.versions.hasOwnProperty('electron')
}