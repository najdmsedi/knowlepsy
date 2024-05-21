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


