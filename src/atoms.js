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

export const LoadPPGListAtom = atom({
    key: 'LoadPPGList',
    default: [0,0,0,0,0,0,0,0,0,0,0],
});
export const LoadPPGListTimeAtom = atom({
    key: 'LoadPPGListTime',
    default: ["0","0","0","0","0","0","0","0","0","0","0"],
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
    default: 0,
});

export const LoadTempListAtom = atom({
    key: 'LoadTempList',
    default: [0,0,0,0,0,0,0,0,0,0,0],
});
export const LoadTempListTimeAtom = atom({
    key: 'LoadTempListTime',
    default: ["0","0","0","0","0","0","0","0","0","0","0"],
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

export const EDAValueAtom = atom({
    key: 'EDAValue',
    default: 0,
});

export const locationAtom = atom({
    key: 'location',
    default: {latitude:0,longitude:0},
});

export const DominantLevelAtom = atom({
    key: 'DominantLevel',
    default: '',
});

export const TimeLevelAtom = atom({
    key: 'TimeLevel',
    default: '',
});


export const PatientAtom = atom({
    key: 'Patient',
    default: {},
});
export const PatientsAtom = atom({
    key: 'Patients',
    default: [],
});