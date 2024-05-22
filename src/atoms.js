import { atom } from "recoil"

export const BPMAtom = atom({
    key: 'BPM',
    default: "--",
});

export const TempAtom = atom({
    key: 'Temp',
    default: "--",
});

export const StepsAtom = atom({
    key: 'Steps',
    default: "--",
});

export const ConnectedAtom = atom({
    key: 'Connected',
    default: false,
});

export const DeviceNameAtom = atom({
    key: 'DeviceName',
    default: null,
});

export const DeviceCharacteristiqueAtom = atom({
    key: 'DeviceCharacteristique',
    default: null,
});

export const PPGListAtom = atom({
    key: 'PPGList',
    default: [0,0,0,0,0,0,0,0,0,0,0],
});
export const PPGListTimeAtom = atom({
    key: 'PPGListTime',
    default: ["0","0","0","0","0","0","0","0","0","0","0"],
});
export const PPGValueAtom = atom({
    key: 'PPGValue',
    default: {},
});




export const TempListAtom = atom({
    key: 'TempList',
    default: [0,0,0,0,0,0,0,0,0,0,0],
});
export const TempListTimeAtom = atom({
    key: 'TempListTime',
    default: ["0","0","0","0","0","0","0","0","0","0","0"],
});
export const TempValueAtom = atom({
    key: 'TempValue',
    default: {},
});