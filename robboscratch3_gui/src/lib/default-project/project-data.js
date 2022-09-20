import {defineMessages} from 'react-intl';
import sharedMessages from '../shared-messages';

let messages = defineMessages({
    computer_beep: {
        defaultMessage: 'Beep',
        description: 'Name for the beep sound',
        id: 'gui.defaultProject.beep'
    },
    variable: {
        defaultMessage: 'my variable',
        description: 'Name for the default variable',
        id: 'gui.defaultProject.variable'
    }
});

messages = {...messages, ...sharedMessages};

// use the default message if a translation function is not passed
const defaultTranslator = msgObj => msgObj.defaultMessage;

/**
 * Generate a localized version of the default project
 * @param {function} translateFunction a function to use for translating the default names
 * @return {object} the project data json for the default project
 */
const projectData = translateFunction => {
    const translator = translateFunction || defaultTranslator;
    return ({
        targets: [
            
    {
      isStage: true,
      name: 'Stage',
      variables: {
        '`jEk@4|i[#Fk?(8x)AV.-my variable': [
         translator(messages.variable),
          0
        ]
      },
      lists: {},
      broadcasts: {},
      blocks: {},
      currentCostume: 0,
      costumes: [
        {
          assetId: 'cd21514d0531fdffb22204e0ec5ed84a',
          name: translator(messages.backdrop, {index: 1}),
          md5ext: 'cd21514d0531fdffb22204e0ec5ed84a.svg',
          dataFormat: 'svg',
          rotationCenterX: 240,
          rotationCenterY: 180
        }
      ],
      sounds: [
        {
          assetId: '83a9787d4cb6f3b7632b4ddfebf74367',
          name: translator(messages.pop),
          dataFormat: 'wav',
          format: '',
          rate: 11025,
          sampleCount: 258,
          md5ext: '83a9787d4cb6f3b7632b4ddfebf74367.wav'
        }
      ],
      volume: 100,
    },
    {
      isStage: false,
      name: translator(messages.sprite, {index: 1}),
      variables: {},
      lists: {},
      broadcasts: {},
      blocks: {},
      currentCostume: 0,
      costumes: [

        {
                    assetId: 'f8e72b8244738d0b448e46b38c5db6c2',
                    name: translator(messages.costume, {index: 1}),
                    md5ext: 'f8e72b8244738d0b448e46b38c5db6c2.svg',
                    dataFormat: 'svg',
                    bitmapResolution: 1,
                    rotationCenterX: 67,
                    rotationCenterY: 95
                },
                {
                  assetId: 'bb3a866c4db08353f6faf43c54990f10',
                  name: translator(messages.costume, {index: 2}),
                  md5ext: 'bb3a866c4db08353f6faf43c54990f10.svg',
                  dataFormat: 'svg',
                  bitmapResolution: 1,
                  rotationCenterX: 67,
                  rotationCenterY: 95
                },
                {
                  assetId: 'bb6b82c9fa7c432c552ca2f251ae2078',
                  name: translator(messages.costume, {index: 3}),
                  md5ext: 'bb6b82c9fa7c432c552ca2f251ae2078.svg',
                  dataFormat: 'svg',
                  bitmapResolution: 1,
                  rotationCenterX: 67,
                  rotationCenterY: 95
                },
                {
                  assetId: 'be2345a4417ff516f9c1a5ece86a8c64',
                  name: translator(messages.costume, {index: 4}),
                  md5ext: 'be2345a4417ff516f9c1a5ece86a8c64.svg',
                  dataFormat: 'svg',
                  bitmapResolution: 1,
                  rotationCenterX: 67,
                  rotationCenterY: 95
                }
      ],
      sounds: [
        {
          assetId: '28c76b6bebd04be1383fe9ba4933d263',
          name: translator(messages.computer_beep),
          dataFormat: 'wav',
          format: '',
          rate:11025,
          sampleCount: 9536,
          md5ext: '28c76b6bebd04be1383fe9ba4933d263.wav'
        }
      ],
      volume: 100,
      visible: true,
      x: 0,
      y: 0,
      size: 100,
      direction: 90,
      draggable: false,
      rotationStyle: 'all around'
    }
  ],
  meta: {
    semver: '3.0.0',
    vm: '0.1.0',
    agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
  }
    });
};


export default projectData;
