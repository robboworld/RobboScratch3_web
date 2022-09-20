import {applyMiddleware, compose, combineReducers} from 'redux';
import alertsReducer, {alertsInitialState} from './alerts';
import assetDragReducer, {assetDragInitialState} from './asset-drag';
import cardsReducer, {cardsInitialState} from './cards';
import colorPickerReducer, {colorPickerInitialState} from './color-picker';
import connectionModalReducer, {connectionModalInitialState} from './connection-modal';
import customProceduresReducer, {customProceduresInitialState} from './custom-procedures';
import blockDragReducer, {blockDragInitialState} from './block-drag';
import editorTabReducer, {editorTabInitialState} from './editor-tab';
import hoveredTargetReducer, {hoveredTargetInitialState} from './hovered-target';
import menuReducer, {menuInitialState} from './menus';
import micIndicatorReducer, {micIndicatorInitialState} from './mic-indicator';
import modalReducer, {modalsInitialState} from './modals';
import modeReducer, {modeInitialState} from './mode';
import monitorReducer, {monitorsInitialState} from './monitors';
import monitorLayoutReducer, {monitorLayoutInitialState} from './monitor-layout';
import projectChangedReducer, {projectChangedInitialState} from './project-changed';
import projectStateReducer, {projectStateInitialState} from './project-state';
import projectTitleReducer, {projectTitleInitialState} from './project-title';
import fontsLoadedReducer, {fontsLoadedInitialState} from './fonts-loaded';
import restoreDeletionReducer, {restoreDeletionInitialState} from './restore-deletion';
import stageSizeReducer, {stageSizeInitialState} from './stage-size';
import targetReducer, {targetsInitialState} from './targets';
import timeoutReducer, {timeoutInitialState} from './timeout';
import toolboxReducer, {toolboxInitialState} from './toolbox';
import vmReducer, {vmInitialState} from './vm';
import vmStatusReducer, {vmStatusInitialState} from './vm-status';
import throttle from 'redux-throttle';

import decks from '../lib/libraries/decks/index.jsx';

import robot_sensors,{robot_sensors_InitialState} from '../RobboGui/reducers/robot_sensors';
import lab_external_sensors,{lab_external_sensors_InitialState} from '../RobboGui/reducers/lab_external_sensors';
import robot_special_sensors,{robot_special_sensors_InitialState}  from '../RobboGui/reducers/robot_special_sensors'
import lab_special_sensors,{lab_special_sensors_InitialState}  from '../RobboGui/reducers/lab_special_sensors'
import trash_reducer from '../RobboGui/reducers/trash_reducer';
import sensors_choose_window,{sensors_choose_window_InitialState} from '../RobboGui/reducers/sensors_choose_window';
import sensors_palette,{sensors_palette_InitialState} from '../RobboGui/reducers/sensors_palette';
import robots,{robots_InitialState} from '../RobboGui/reducers/robots';
import laboratories,{laboratories_InitialState} from '../RobboGui/reducers/laboratories';
import extension_pack,{extension_pack_InitialState} from '../RobboGui/reducers/extension_pack';
import color_corrector_table,{color_corrector_table_InitialState} from '../RobboGui/reducers/color_corrector_table';
import robbo_menu,{robbo_menu_InitialState} from '../RobboGui/reducers/robbo_menu';
import settings,{settings_InitialState} from '../RobboGui/reducers/settings';
import draggable_window,{draggable_window_InitialState} from '../RobboGui/reducers/draggable_window';
import new_draggable_window,{new_draggable_window_InitialState} from '../RobboGui/reducers/new_draggable_window';
import devices_firmware_flasher,{devices_firmware_flasher_InitialState} from '../RobboGui/reducers/devices_firmware_flasher';
import iot_blocks,{iot_blocks_InitialState} from '../RobboGui/reducers/iot_blocks';

import thunk from 'redux-thunk';

const guiMiddleware = compose(applyMiddleware(throttle(300, {leading: true, trailing: true}),thunk));

const guiInitialState = {
    alerts: alertsInitialState,
    assetDrag: assetDragInitialState,
    blockDrag: blockDragInitialState,
    cards: cardsInitialState,
    colorPicker: colorPickerInitialState,
    connectionModal: connectionModalInitialState,
    customProcedures: customProceduresInitialState,
    editorTab: editorTabInitialState,
    mode: modeInitialState,
    hoveredTarget: hoveredTargetInitialState,
    stageSize: stageSizeInitialState,
    menus: menuInitialState,
    micIndicator: micIndicatorInitialState,
    modals: modalsInitialState,
    monitors: monitorsInitialState,
    monitorLayout: monitorLayoutInitialState,
    projectChanged: projectChangedInitialState,
    projectState: projectStateInitialState,
    projectTitle: projectTitleInitialState,
    fontsLoaded: fontsLoadedInitialState,
    restoreDeletion: restoreDeletionInitialState,
    targets: targetsInitialState,
    timeout: timeoutInitialState,
    toolbox: toolboxInitialState,
    vm: vmInitialState,
    vmStatus: vmStatusInitialState,

    robot_sensors:robot_sensors_InitialState,
  lab_external_sensors:lab_external_sensors_InitialState,
  robot_special_sensors:robot_special_sensors_InitialState,
  lab_special_sensors: lab_special_sensors_InitialState,
  sensors_choose_window:sensors_choose_window_InitialState,
  sensors_palette:sensors_palette_InitialState,
  robots:robots_InitialState,
  laboratories:laboratories_InitialState,
  extension_pack:extension_pack_InitialState,
  color_corrector_table:color_corrector_table_InitialState,
  robbo_menu:robbo_menu_InitialState,
  settings:settings_InitialState,
  draggable_window: draggable_window_InitialState,
  new_draggable_window: new_draggable_window_InitialState,
  devices_firmware_flasher:devices_firmware_flasher_InitialState,
  iot_blocks:iot_blocks_InitialState
};

const initPlayer = function (currentState) {
    return Object.assign(
        {},
        currentState,
        {mode: {
            isFullScreen: currentState.mode.isFullScreen,
            isPlayerOnly: true,
            // When initializing in player mode, make sure to reset
            // hasEverEnteredEditorMode
            hasEverEnteredEditor: false
        }}
    );
};
const initFullScreen = function (currentState) {
    return Object.assign(
        {},
        currentState,
        {mode: {
            isFullScreen: true,
            isPlayerOnly: currentState.mode.isPlayerOnly,
            hasEverEnteredEditor: currentState.mode.hasEverEnteredEditor
        }}
    );
};

const initEmbedded = function (currentState) {
    return Object.assign(
        {},
        currentState,
        {mode: {
            showBranding: true,
            isFullScreen: true,
            isPlayerOnly: true,
            hasEverEnteredEditor: false
        }}
    );
};

const initTutorialCard = function (currentState, deckId) {
    return Object.assign(
        {},
        currentState,
        {
            cards: {
                visible: true,
                content: decks,
                activeDeckId: deckId,
                step: 0,
                x: 0,
                y: 0,
                dragging: false
            }
        }
    );
};

const initPreviewInfo = function (currentState) {
    return Object.assign(
        {},
        currentState,
        {
            modals: {
                previewInfo: false // this key must match `MODAL_PREVIEW_INFO` in modals.js //modified_by_Yaroslav
            }
        }
    );
};

const initTelemetryModal = function (currentState) {
    return Object.assign(
        {},
        currentState,
        {
            modals: {
                telemetryModal: true // this key must match `MODAL_TELEMETRY` in modals.js
            }
        }
    );
};

const guiReducer = combineReducers({
    alerts: alertsReducer,
    assetDrag: assetDragReducer,
    blockDrag: blockDragReducer,
    cards: cardsReducer,
    colorPicker: colorPickerReducer,
    connectionModal: connectionModalReducer,
    customProcedures: customProceduresReducer,
    editorTab: editorTabReducer,
    mode: modeReducer,
    hoveredTarget: hoveredTargetReducer,
    stageSize: stageSizeReducer,
    menus: menuReducer,
    micIndicator: micIndicatorReducer,
    modals: modalReducer,
    monitors: monitorReducer,
    monitorLayout: monitorLayoutReducer,
    projectChanged: projectChangedReducer,
    projectState: projectStateReducer,
    projectTitle: projectTitleReducer,
    fontsLoaded: fontsLoadedReducer,
    restoreDeletion: restoreDeletionReducer,
    targets: targetReducer,
    timeout: timeoutReducer,
    toolbox: toolboxReducer,
    vm: vmReducer,
    vmStatus: vmStatusReducer,

    robot_sensors:robot_sensors,
  lab_external_sensors:lab_external_sensors,
  robot_special_sensors: robot_special_sensors,
  lab_special_sensors: lab_special_sensors,
  sensors_choose_window:sensors_choose_window,
  sensors_palette:sensors_palette,
  robots:robots,
  laboratories:laboratories,
  extension_pack:extension_pack,
  color_corrector_table:color_corrector_table,
  robbo_menu:robbo_menu,
  settings:settings,
  draggable_window: draggable_window,
  new_draggable_window: new_draggable_window,
  devices_firmware_flasher:devices_firmware_flasher,
  iot_blocks:iot_blocks
});

export {
    guiReducer as default,
    guiInitialState,
    guiMiddleware,
    initEmbedded,
    initFullScreen,
    initPlayer,
    initPreviewInfo,
    initTelemetryModal,
    initTutorialCard
};
