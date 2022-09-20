import projectData from './project-data';

/* eslint-disable import/no-unresolved */
import popWav from '!arraybuffer-loader!./83a9787d4cb6f3b7632b4ddfebf74367.wav';
import computerBeep from '!arraybuffer-loader!./28c76b6bebd04be1383fe9ba4933d263.wav';
import backdrop from '!raw-loader!./cd21514d0531fdffb22204e0ec5ed84a.svg';
import costume1 from '!raw-loader!./f8e72b8244738d0b448e46b38c5db6c2.svg';
import costume2 from '!raw-loader!./bb3a866c4db08353f6faf43c54990f10.svg';
import costume3 from '!raw-loader!./bb6b82c9fa7c432c552ca2f251ae2078.svg';
import costume4 from '!raw-loader!./be2345a4417ff516f9c1a5ece86a8c64.svg';
/* eslint-enable import/no-unresolved */

const defaultProject = translator => {
    let _TextEncoder;
    if (typeof TextEncoder === 'undefined') {
        _TextEncoder = require('text-encoding').TextEncoder;
    } else {
        /* global TextEncoder */
        _TextEncoder = TextEncoder;
    }
    const encoder = new _TextEncoder();

    const projectJson = projectData(translator);

 return [{
    id: 0,
    assetType: 'Project',
    dataFormat: 'JSON',
    data: JSON.stringify(projectJson)
}, {
    id: '83a9787d4cb6f3b7632b4ddfebf74367',
    assetType: 'Sound',
    dataFormat: 'WAV',
    data: new Uint8Array(popWav)
}, {
    id: '28c76b6bebd04be1383fe9ba4933d263',
    assetType: 'Sound',
    dataFormat: 'WAV',
    data: new Uint8Array(computerBeep)
}, {
    id: 'cd21514d0531fdffb22204e0ec5ed84a',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(backdrop)
}, {
    id: 'f8e72b8244738d0b448e46b38c5db6c2',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(costume1)
},{
    id: 'bb3a866c4db08353f6faf43c54990f10',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(costume2)
},{
    id: 'bb6b82c9fa7c432c552ca2f251ae2078',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(costume3)
}, {
    id: 'be2345a4417ff516f9c1a5ece86a8c64',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(costume4)
}];

};

export default defaultProject;
