/* =============================================================================
   Glyph Configurator
   WebSerial + Protobuf + JSON config manager
   ============================================================================= */

'use strict';

// ---------------------------------------------------------------------------
// Constants: Protobuf schema (GregTurbo/HayBox-proto fork)
// ---------------------------------------------------------------------------
const PROTO_DEF = `
syntax = "proto3";
enum Command { CMD_UNSPECIFIED=0; CMD_GET_DEVICE_INFO=1; CMD_SET_DEVICE_INFO=2; CMD_GET_CONFIG=3; CMD_SET_CONFIG=4; CMD_ERROR=5; CMD_SUCCESS=6; CMD_REBOOT_FIRMWARE=7; CMD_REBOOT_BOOTLOADER=8; }
enum Button { BTN_UNSPECIFIED=0; BTN_LF1=1; BTN_LF2=2; BTN_LF3=3; BTN_LF4=4; BTN_LF5=5; BTN_LF6=6; BTN_LF7=7; BTN_LF8=8; BTN_LF9=9; BTN_LF10=10; BTN_LF11=11; BTN_LF12=12; BTN_LF13=13; BTN_LF14=14; BTN_LF15=15; BTN_LF16=16; BTN_RF1=17; BTN_RF2=18; BTN_RF3=19; BTN_RF4=20; BTN_RF5=21; BTN_RF6=22; BTN_RF7=23; BTN_RF8=24; BTN_RF9=25; BTN_RF10=26; BTN_RF11=27; BTN_RF12=28; BTN_RF13=29; BTN_RF14=30; BTN_RF15=31; BTN_RF16=32; BTN_LT1=33; BTN_LT2=34; BTN_LT3=35; BTN_LT4=36; BTN_LT5=37; BTN_LT6=38; BTN_LT7=39; BTN_LT8=40; BTN_RT1=41; BTN_RT2=42; BTN_RT3=43; BTN_RT4=44; BTN_RT5=45; BTN_RT6=46; BTN_RT7=47; BTN_RT8=48; BTN_MB1=49; BTN_MB2=50; BTN_MB3=51; BTN_MB4=52; BTN_MB5=53; BTN_MB6=54; BTN_MB7=55; BTN_MB8=56; BTN_MB9=57; BTN_MB10=58; BTN_MB11=59; BTN_MB12=60; }
enum SocdType { SOCD_UNSPECIFIED=0; SOCD_NEUTRAL=1; SOCD_2IP=2; SOCD_2IP_NO_REAC=3; SOCD_DIR1_PRIORITY=4; SOCD_DIR2_PRIORITY=5; }
enum GameModeId { MODE_UNSPECIFIED=0; MODE_MELEE=1; MODE_PROJECT_M=2; MODE_ULTIMATE=3; MODE_FGC=4; MODE_RIVALS_OF_AETHER=5; MODE_KEYBOARD=6; MODE_CUSTOM=7; MODE_64=8; MODE_RIVALS2=9; MODE_NUM_VALUES=10; }
enum CommunicationBackendId { COMMS_BACKEND_UNSPECIFIED=0; COMMS_BACKEND_DINPUT=1; COMMS_BACKEND_XINPUT=2; COMMS_BACKEND_GAMECUBE=3; COMMS_BACKEND_N64=4; COMMS_BACKEND_NES=5; COMMS_BACKEND_SNES=6; COMMS_BACKEND_NINTENDO_SWITCH=7; COMMS_BACKEND_CONFIGURATOR=8; COMMS_BACKEND_PASSTHROUGH_PS4=9; COMMS_BACKEND_PASSTHROUGH_PS5=10; }
enum RgbAnimationId { RGB_ANIM_UNSPECIFIED=0; RGB_ANIM_STATIC=1; RGB_ANIM_BREATHE=2; RGB_ANIM_REACTIVE_SIMPLE=3; RGB_ANIM_RAINBOW_SHIFT=4; RGB_ANIM_RAINBOW_XWAVE_LEFT=5; }
enum OutputOption { OUT_UNSPECIFIED=0; OUT_A=1; OUT_B=2; OUT_X=3; OUT_Y=4; OUT_LB=5; OUT_RB=6; OUT_LT=7; OUT_RT=8; OUT_START=9; OUT_SELECT=10; OUT_HOME=11; OUT_SW_CAPTURE=12; OUT_SHARE=13; OUT_DPAD_DOWN=14; OUT_DPAD_LEFT=15; OUT_DPAD_RIGHT=16; OUT_DPAD_UP=17; OUT_L3=18; OUT_R3=19; OUT_TP=20; OUT_TRIANGLE=21; OUT_SQUARE=22; OUT_CIRCLE=23; OUT_Z=24; OUT_ZL=25; OUT_ZR=26; OUT_LS_LEFT=27; OUT_LS_RIGHT=28; OUT_LS_UP=29; OUT_LS_DOWN=30; OUT_RS_LEFT=31; OUT_RS_RIGHT=32; OUT_RS_UP=33; OUT_RS_DOWN=34; OUT_CS_LEFT=35; OUT_CS_RIGHT=36; OUT_CS_UP=37; OUT_CS_DOWN=38; OUT_PLUS=39; OUT_MINUS=40; OUT_MENU=41; OUT_L=42; OUT_R=43; OUT_XB_START=44; OUT_XB_BACK=45; }
enum DigitalOutput { GP_UNSPECIFIED=0; GP_A=1; GP_B=2; GP_X=3; GP_Y=4; GP_LB=5; GP_RB=6; GP_LT=7; GP_RT=8; GP_START=9; GP_SELECT=10; GP_HOME=11; GP_CAPTURE=12; GP_DPAD_UP=13; GP_DPAD_DOWN=14; GP_DPAD_LEFT=15; GP_DPAD_RIGHT=16; GP_LSTICK_CLICK=17; GP_RSTICK_CLICK=18; }
enum AnalogAxis { AXIS_UNSPECIFIED=0; AXIS_LSTICK_X=1; AXIS_LSTICK_Y=2; AXIS_RSTICK_X=3; AXIS_RSTICK_Y=4; AXIS_LTRIGGER=5; AXIS_RTRIGGER=6; }
enum AnalogTrigger { TRIGGER_UNSPECIFIED=0; TRIGGER_LT=1; TRIGGER_RT=2; }
enum ModifierCombinationMode { COMBINATION_MODE_UNSPECIFIED=0; COMBINATION_MODE_COMPOUND=1; COMBINATION_MODE_OVERRIDE=2; }
enum LayoutPlate { LAYOUT_PLATE_UNSPECIFIED=0; LAYOUT_PLATE_EVERYTHING=1; LAYOUT_PLATE_FGC=2; LAYOUT_PLATE_SPLIT_FGC=3; LAYOUT_PLATE_PLATFORM_FIGHTER=4; }
enum DashboardOption { DASHBOARD_UNSPECIFIED=0; DASHBOARD_MENU_BUTTON_HINTS=1; DASHBOARD_INPUT_VIEWER=2; }
message ButtonRemap { Button physical_button=1; Button activates=2; }
message SocdPair { Button button_dir1=1; Button button_dir2=2; SocdType socd_type=3; }
message AnalogTriggerMapping { Button button=1; AnalogTrigger trigger=2; uint32 value=3; }
message AnalogModifier { repeated Button buttons=1; AnalogAxis axis=2; float multiplier=3; ModifierCombinationMode combination_mode=4; }
message ButtonComboMapping { repeated Button buttons=1; DigitalOutput digital_output=2; }
message Coords { uint32 x=1; uint32 y=2; }
message ButtonToKeycodeMapping { Button button=1; uint32 keycode=2; }
message ButtonToColorMapping { Button button=1; uint32 color=2; }
message CustomModeConfig { uint32 id=1; repeated Button digital_button_mappings=2; repeated Button stick_direction_mappings=3; repeated AnalogTriggerMapping analog_trigger_mappings=4; repeated AnalogModifier modifiers=5; uint32 stick_range=6; repeated ButtonComboMapping button_combo_mappings=7; }
message KeyboardModeConfig { uint32 id=1; repeated ButtonToKeycodeMapping buttons_to_keycodes=2; }
message GameModeConfig { GameModeId mode_id=1; string name=2; repeated SocdPair socd_pairs=3; repeated ButtonRemap button_remapping=4; repeated Button activation_binding=5; uint32 custom_mode_config=6; uint32 keyboard_mode_config=7; uint32 rgb_config=8; LayoutPlate layout_plate=200; repeated CommunicationBackendId applicable_backends=201; repeated OutputOption menu_button_icon=202; }
message CommunicationBackendConfig { CommunicationBackendId backend_id=1; uint32 default_mode_config=2; repeated Button activation_binding=3; repeated CommunicationBackendId secondary_backends=4; }
message RgbConfig { repeated ButtonToColorMapping button_colors=1; uint32 default_color=2; RgbAnimationId animation=3; uint32 speed=4; }
message MeleeOptions { bool crouch_walk_os=1; bool disable_ledgedash_socd_override=2; Coords custom_airdodge=3; }
message ProjectMOptions { bool true_z_press=1; bool disable_ledgedash_socd_override=2; Coords custom_airdodge=3; }
message Config { repeated GameModeConfig game_mode_configs=1; repeated CommunicationBackendConfig communication_backend_configs=2; repeated CustomModeConfig custom_modes=3; repeated KeyboardModeConfig keyboard_modes=4; repeated RgbConfig rgb_configs=5; uint32 default_backend_config=6; uint32 default_usb_backend_config=7; uint32 rgb_brightness=8; MeleeOptions melee_options=9; ProjectMOptions project_m_options=10; DashboardOption default_dashboard_option=200; }
message DeviceInfo { string firmware_name=1; string firmware_version=2; string device_name=3; }
`;

// Button positions in viewBox 0 0 912 491. r=29.3 except LT6 (r=34.5) and MB1-7 (r=8.5).
const BUTTON_LAYOUT = [
  // Left finger cluster
  { id: 'BTN_LF4', x:  55.35, y: 171.26, r: 29.30, label: 'LF4' },
  { id: 'BTN_LF3', x: 120.47, y: 130.89, r: 29.30, label: 'LF3' },
  { id: 'BTN_LF2', x: 192.10, y: 124.38, r: 29.30, label: 'LF2' },
  { id: 'BTN_LF1', x: 257.22, y: 154.33, r: 29.30, label: 'LF1' },
  { id: 'BTN_LF5', x: 181.68, y: 186.89, r: 29.30, label: 'LF5' },
  { id: 'BTN_LF8', x: 253.31, y:  89.21, r: 29.30, label: 'LF8' },
  { id: 'BTN_LF7', x: 324.95, y: 100.94, r: 29.30, label: 'LF7' },
  { id: 'BTN_LF6', x: 383.55, y: 141.31, r: 29.30, label: 'LF6' },
  // Left thumb cluster (+ LT6 large)
  { id: 'BTN_LT4', x: 281.97, y: 258.52, r: 29.30, label: 'LT4' },
  { id: 'BTN_LT5', x: 223.36, y: 287.17, r: 29.30, label: 'LT5' },
  { id: 'BTN_LT3', x: 334.07, y: 296.29, r: 29.30, label: 'LT3' },
  { id: 'BTN_LT1', x: 275.46, y: 323.64, r: 29.30, label: 'LT1' },
  { id: 'BTN_LT2', x: 328.86, y: 360.11, r: 29.30, label: 'LT2' },
  { id: 'BTN_LT6', x: 413.52, y: 309.30, r: 34.51, label: 'LT6', large: true },
  // RF central cluster — top row (RF13, RF14, RF15)
  { id: 'BTN_RF13', x: 444.77, y: 106.15, r: 29.30, label: 'RF13' },
  { id: 'BTN_RF14', x: 508.58, y:  77.49, r: 29.30, label: 'RF14' },
  { id: 'BTN_RF15', x: 581.52, y:  77.49, r: 29.30, label: 'RF15' },
  // RF central cluster — middle row (RF10, RF11, RF12 below RF13/14/15)
  { id: 'BTN_RF10', x: 444.77, y: 175.17, r: 29.30, label: 'RF10' },
  { id: 'BTN_RF11', x: 509.89, y: 145.22, r: 29.30, label: 'RF11' },
  { id: 'BTN_RF12', x: 581.52, y: 145.22, r: 29.30, label: 'RF12' },
  // RF16 (bottom of central cluster, below RF11)
  { id: 'BTN_RF16', x: 503.37, y: 212.94, r: 29.30, label: 'RF16' },
  // RF face buttons — upper arc (RF5-8)
  { id: 'BTN_RF5',  x: 653.15, y:  85.31, r: 29.30, label: 'RF5' },
  { id: 'BTN_RF6',  x: 719.57, y:  55.35, r: 29.30, label: 'RF6' },
  { id: 'BTN_RF7',  x: 791.20, y:  63.17, r: 29.30, label: 'RF7' },
  { id: 'BTN_RF8',  x: 856.32, y: 103.54, r: 29.30, label: 'RF8' },
  // RF face buttons — lower arc (RF1-4 below RF5-8)
  { id: 'BTN_RF1',  x: 653.15, y: 154.33, r: 29.30, label: 'RF1' },
  { id: 'BTN_RF2',  x: 719.57, y: 124.38, r: 29.30, label: 'RF2' },
  { id: 'BTN_RF3',  x: 791.20, y: 132.19, r: 29.30, label: 'RF3' },
  { id: 'BTN_RF4',  x: 856.32, y: 172.57, r: 29.30, label: 'RF4' },
  // RF9 (between RF4 and the right-thumb cluster)
  { id: 'BTN_RF9',  x: 711.76, y: 193.41, r: 29.30, label: 'RF9' },
  // Right thumb cluster
  { id: 'BTN_RT4',  x: 629.70, y: 258.52, r: 29.30, label: 'RT4' },
  { id: 'BTN_RT3',  x: 577.61, y: 296.29, r: 29.30, label: 'RT3' },
  { id: 'BTN_RT5',  x: 688.31, y: 287.18, r: 29.30, label: 'RT5' },
  { id: 'BTN_RT1',  x: 636.22, y: 323.64, r: 29.30, label: 'RT1' },
  { id: 'BTN_RT2',  x: 582.82, y: 360.11, r: 29.30, label: 'RT2' },
  // Menu buttons — top-left corner, in a row. Larger (r=13) than the layout SVG
  // mockup so the assigned icon is readable; centers spaced 29 units apart so
  // the row only grows slightly wider than before.
  { id: 'BTN_MB1', x:  60, y: 25, r: 13, label: 'MB1', menu: true },
  { id: 'BTN_MB2', x:  89, y: 25, r: 13, label: 'MB2', menu: true },
  { id: 'BTN_MB3', x: 118, y: 25, r: 13, label: 'MB3', menu: true },
  { id: 'BTN_MB4', x: 147, y: 25, r: 13, label: 'MB4', menu: true },
  { id: 'BTN_MB5', x: 176, y: 25, r: 13, label: 'MB5', menu: true },
  { id: 'BTN_MB6', x: 205, y: 25, r: 13, label: 'MB6', menu: true },
  { id: 'BTN_MB7', x: 234, y: 25, r: 13, label: 'MB7', menu: true },
];

const BUTTON_BY_ID = Object.fromEntries(BUTTON_LAYOUT.map(b => [b.id, b]));

// All known buttons for dropdown
const ALL_BUTTONS = [
  'BTN_UNSPECIFIED',
  ...['LF','RF','LT','RT','MB'].flatMap(g => {
    const max = {LF:8,RF:16,LT:6,RT:5,MB:7}[g];
    return Array.from({length:max},(_,i)=>`BTN_${g}${i+1}`);
  })
];

const GAME_MODE_IDS = ['MODE_MELEE','MODE_PROJECT_M','MODE_ULTIMATE','MODE_FGC',
  'MODE_RIVALS_OF_AETHER','MODE_KEYBOARD','MODE_CUSTOM','MODE_64','MODE_RIVALS2'];

// USB is a UI-only umbrella that maps to the three desktop/Switch backends.
// PASSTHROUGH_PS4 / PS5 are intentionally hidden from the UI for now.
const USB_BACKENDS = ['COMMS_BACKEND_DINPUT','COMMS_BACKEND_XINPUT','COMMS_BACKEND_NINTENDO_SWITCH'];

// Backend choices shown in the UI, in display order.
// Each entry is either a backend id (string) or a virtual group { id, label, members }.
const BACKEND_CHOICES = [
  { id: 'USB', label: 'USB', members: USB_BACKENDS },
  'COMMS_BACKEND_GAMECUBE',
  'COMMS_BACKEND_N64',
  'COMMS_BACKEND_NES',
  'COMMS_BACKEND_SNES',
];

const SOCD_TYPES = ['SOCD_NEUTRAL','SOCD_2IP','SOCD_2IP_NO_REAC','SOCD_DIR1_PRIORITY','SOCD_DIR2_PRIORITY'];

// Labels for menu button output options
const OUTPUT_OPTION_LABELS = {
  OUT_UNSPECIFIED:'—', OUT_A:'A', OUT_B:'B', OUT_X:'X', OUT_Y:'Y',
  OUT_START:'START', OUT_SELECT:'SEL', OUT_HOME:'HOME', OUT_XB_START:'XB\nSTART', OUT_XB_BACK:'BACK',
  OUT_SW_CAPTURE:'CAP', OUT_SHARE:'SHARE', OUT_MINUS:'−', OUT_PLUS:'+', OUT_MENU:'MENU',
  OUT_L:'L', OUT_R:'R', OUT_Z:'Z', OUT_ZL:'ZL', OUT_ZR:'ZR',
};

// Mode → button → output mapping (from firmware src/modes/*). Output IDs are
// platform-agnostic (a/b/x/y, lb/rb/lt/rt, ls/rs, dup/ddown/..., lsl/lsr/...,
// csl/csr/..., start/select/home/capture, mx/my modifiers) and styled per platform.
const FGC_MAP = {
  // D-pad (firmware: LF1/2/3=dpad right/down/left, LT1=dpad up)
  BTN_LF1: 'dright', BTN_LF2: 'ddown', BTN_LF3: 'dleft', BTN_LT1: 'dup',
  // Stick clicks (firmware: LT2=L3, RT1=R3)
  BTN_LT2: 'ls', BTN_RT1: 'rs',
  // Face buttons / triggers / bumpers (XInput layout)
  BTN_RF1: 'a',  BTN_RF2: 'b',  BTN_RF3: 'rt', BTN_RF4: 'lt',
  BTN_RF5: 'x',  BTN_RF6: 'y',  BTN_RF7: 'rb', BTN_RF8: 'lb',
  // Left-stick directions (firmware: LF8/6/7/LT6)
  BTN_LF8: 'lsl', BTN_LF6: 'lsr', BTN_LF7: 'lsd', BTN_LT6: 'lsu',
  // Right-stick / C-stick directions (firmware: RT3/5/2/4)
  BTN_RT3: 'csl', BTN_RT5: 'csr', BTN_RT2: 'csd', BTN_RT4: 'csu',
  // Menu buttons (MB1-MB7) handled via profile.menuButtonIcon — not in this map.
};

const PLATFORM_FIGHTER_MAP = {
  // Face buttons (XInput): RT1=A, RF1=B, RF2=X, RF6=Y
  BTN_RT1: 'a', BTN_RF1: 'b', BTN_RF2: 'x', BTN_RF6: 'y',
  // Shoulders: RF3=buttonR (RB), LF4=triggerL (LT), RF5=triggerR (RT)
  BTN_RF3: 'rb', BTN_LF4: 'lt', BTN_RF5: 'rt',
  // Direct D-Pad (Ultimate / ProjectM): RF8=up, RF7=down, LF8=left, LF6=right
  BTN_RF8: 'dup', BTN_RF7: 'ddown', BTN_LF8: 'dleft', BTN_LF6: 'dright',
  // Analog stick directions (digital→stick)
  BTN_LF3: 'lsl', BTN_LF1: 'lsr', BTN_LF2: 'lsd', BTN_RF4: 'lsu',
  // C-stick (right stick) directions
  BTN_RT3: 'csl', BTN_RT5: 'csr', BTN_RT2: 'csd', BTN_RT4: 'csu',
  // Modifiers
  BTN_LT1: 'mx', BTN_LT2: 'my',
  // Menu buttons (MB1-MB7) handled via profile.menuButtonIcon — not in this map.
};

const MELEE_MAP = {
  ...PLATFORM_FIGHTER_MAP,
  // Direct DPad in Melee20Button uses LT6/LF7/LF8/LF6 (LF8/LF6 same as PFM).
  BTN_LT6: 'dup',
  BTN_LF7: 'ddown',
  // RF7 = light shield, RF8 = mid shield (triggerRAnalog at 49 / 94).
  // These override PFM's RF7=ddown / RF8=dup since Melee uses LT6/LF7 for those.
  BTN_RF7: 'rt_light',
  BTN_RF8: 'rt_mid',
};

// ProjectM adds RF9 as light shield (triggerRAnalog=49) on top of PFM.
// Brawl / Project M: same as PFM. RF9 in firmware (ProjectM.cpp:47) is
// commented out, so no light-shield assignment — leave the map untouched.
const PROJECT_M_MAP = {
  ...PLATFORM_FIGHTER_MAP,
};

// RoA: Melee-style D-pad, RF7/RF8 are stick clicks (not dpad like PFM), RF9 = LB.
const ROA_MAP = {
  // Face buttons (same as PFM)
  BTN_RT1: 'a', BTN_RF1: 'b', BTN_RF2: 'x', BTN_RF6: 'y',
  // Shoulders
  BTN_RF3: 'rb', BTN_LF4: 'lt', BTN_RF5: 'rt',
  // D-Pad (Melee-style: LT6=up, LF7=down, LF8=left, LF6=right)
  BTN_LT6: 'dup', BTN_LF7: 'ddown', BTN_LF8: 'dleft', BTN_LF6: 'dright',
  // Stick clicks (RoA-specific: RF7=L3, RF8=R3 — NOT dpad like PFM)
  BTN_RF7: 'ls', BTN_RF8: 'rs',
  // Left-stick directions
  BTN_LF3: 'lsl', BTN_LF1: 'lsr', BTN_LF2: 'lsd', BTN_RF4: 'lsu',
  // C-stick (right stick) directions
  BTN_RT3: 'csl', BTN_RT5: 'csr', BTN_RT2: 'csd', BTN_RT4: 'csu',
  // Modifiers
  BTN_LT1: 'mx', BTN_LT2: 'my',
  // RoA-specific: RF9 = LB
  BTN_RF9: 'lb',
};

// RoA2: same as RoA but LT5 = LB (not RF9).
const ROA2_MAP = {
  // Face buttons
  BTN_RT1: 'a', BTN_RF1: 'b', BTN_RF2: 'x', BTN_RF6: 'y',
  // Shoulders
  BTN_RF3: 'rb', BTN_LF4: 'lt', BTN_RF5: 'rt',
  // D-Pad (Melee-style)
  BTN_LT6: 'dup', BTN_LF7: 'ddown', BTN_LF8: 'dleft', BTN_LF6: 'dright',
  // Stick clicks
  BTN_RF7: 'ls', BTN_RF8: 'rs',
  // Left-stick directions
  BTN_LF3: 'lsl', BTN_LF1: 'lsr', BTN_LF2: 'lsd', BTN_RF4: 'lsu',
  // C-stick (right stick) directions
  BTN_RT3: 'csl', BTN_RT5: 'csr', BTN_RT2: 'csd', BTN_RT4: 'csu',
  // Modifiers
  BTN_LT1: 'mx', BTN_LT2: 'my',
  // RoA2-specific: LT5 = LB
  BTN_LT5: 'lb',
};

// Smash 64 mode (src/modes/64.cpp) - c-pad uses RF7/RF8/RF2/RF6 (NOT RT cluster)
const SMASH64_MAP = {
  BTN_RT1: 'a', BTN_RF1: 'b',
  BTN_RF5: 'rt', BTN_RF3: 'rb',  // R trigger, Z (mapped to RB on XInput)
  BTN_LF4: 'lt',                  // L trigger
  // Left stick
  BTN_LF3: 'lsl', BTN_LF1: 'lsr', BTN_LF2: 'lsd', BTN_RF4: 'lsu',
  // Right stick / C-pad
  BTN_RF7: 'csl', BTN_RF8: 'csr', BTN_RF2: 'csd', BTN_RF6: 'csu',
  // D-Pad
  BTN_LT6: 'dup', BTN_LF7: 'ddown', BTN_LF8: 'dleft', BTN_LF6: 'dright',
};

const MODE_OUTPUT_MAP = {
  MODE_FGC: FGC_MAP,
  MODE_ULTIMATE: PLATFORM_FIGHTER_MAP,
  MODE_PROJECT_M: PROJECT_M_MAP,
  MODE_RIVALS_OF_AETHER: ROA_MAP,
  MODE_RIVALS2: ROA2_MAP,
  MODE_MELEE: MELEE_MAP,
  MODE_64: SMASH64_MAP,
  // keyboard / custom – left undefined; falls back to blank
};

// Preserve each button's effective output across a mode change by rewriting
// its remap to whichever new-mode button natively produces the same output.
// Explicit disables and MB buttons untouched; outputs missing from new mode
// (e.g. mx/my → FGC) become explicit disables.
function preserveOutputsAcrossModeChange(profile, oldMode, newMode) {
  // Keyboard uses buttonsToKeycodes, not buttonRemapping — nothing to translate.
  if (oldMode === 'MODE_KEYBOARD' || newMode === 'MODE_KEYBOARD') return;
  // CUSTOM ↔ controller: dispatch to the dedicated translators (CUSTOM has no MODE_OUTPUT_MAP).
  if (oldMode !== 'MODE_CUSTOM' && newMode === 'MODE_CUSTOM') {
    translateControllerToCustom(profile, oldMode);
    return;
  }
  if (oldMode === 'MODE_CUSTOM' && newMode !== 'MODE_CUSTOM') {
    translateCustomToController(profile, newMode);
    return;
  }
  // Impossible in practice (mode-change handler bails on same-mode), but
  // defensively bail if somehow both are CUSTOM.
  if (oldMode === 'MODE_CUSTOM' && newMode === 'MODE_CUSTOM') return;

  const oldModeMap = MODE_OUTPUT_MAP[oldMode] || {};
  const newModeMap = MODE_OUTPUT_MAP[newMode] || {};

  if (!Array.isArray(profile.buttonRemapping)) profile.buttonRemapping = [];

  // Snapshot effective outputs under oldMode; skip explicit disables.
  const rmap = remapMap(profile);
  const oldEffective = {};
  for (const btn of BUTTON_LAYOUT) {
    if (btn.id.startsWith('BTN_MB')) continue;
    const existing = profile.buttonRemapping.find(r => r.physicalButton === btn.id);
    if (existing && (!existing.activates || existing.activates === 'BTN_UNSPECIFIED')) continue;
    const logical = resolveLogicalButton(btn.id, rmap);
    if (!logical) continue;
    const out = oldModeMap[logical];
    if (out) oldEffective[btn.id] = out;
  }

  // Reverse index for the new mode: outputId → physicalButton it lives on.
  const newOutputToBtn = {};
  for (const [phys, out] of Object.entries(newModeMap)) {
    if (!(out in newOutputToBtn)) newOutputToBtn[out] = phys;
  }

  // For each preserved button, install whatever remap entry is required so
  // that the new-mode resolution lands back on the same output.
  for (const [physBtn, desiredOutput] of Object.entries(oldEffective)) {
    const newTarget = newOutputToBtn[desiredOutput];
    const idx = profile.buttonRemapping.findIndex(r => r.physicalButton === physBtn);

    if (newTarget == null) {
      // Output missing from new mode → explicit-disable so mode default doesn't take over.
      const disableEntry = { physicalButton: physBtn };
      if (idx >= 0) profile.buttonRemapping[idx] = disableEntry;
      else          profile.buttonRemapping.push(disableEntry);
      continue;
    }

    if (newModeMap[physBtn] === desiredOutput) {
      // Native default already matches — drop any redundant remap.
      if (idx >= 0) profile.buttonRemapping.splice(idx, 1);
      continue;
    }

    const entry = { physicalButton: physBtn, activates: newTarget };
    if (idx >= 0) profile.buttonRemapping[idx] = entry;
    else          profile.buttonRemapping.push(entry);
  }
}

// Controller → CUSTOM: write each button's effective output into digital/
// stickDirectionMappings. Mode-specific outputs CUSTOM can't express (mx, my,
// rt_light, rt_mid) are dropped.
function translateControllerToCustom(profile, oldMode) {
  const oldModeMap = MODE_OUTPUT_MAP[oldMode] || {};
  const cc = ensureCustomConfig(profile);
  // Reset only the binding arrays; keep stick range / modifiers / triggers.
  cc.digitalButtonMappings  = [];
  cc.stickDirectionMappings = [];
  const additionalRemaps = [];

  const setDigital = (idx, btn) => {
    while (cc.digitalButtonMappings.length <= idx) cc.digitalButtonMappings.push('BTN_UNSPECIFIED');
    cc.digitalButtonMappings[idx] = btn;
  };
  const setStick = (idx, btn) => {
    while (cc.stickDirectionMappings.length <= idx) cc.stickDirectionMappings.push('BTN_UNSPECIFIED');
    cc.stickDirectionMappings[idx] = btn;
  };

  const rmap = remapMap(profile);
  for (const btn of BUTTON_LAYOUT) {
    if (btn.id.startsWith('BTN_MB')) continue;
    // Skip explicit disables: the user turned this button off on purpose.
    const existing = profile.buttonRemapping?.find(r => r.physicalButton === btn.id);
    if (existing && (!existing.activates || existing.activates === 'BTN_UNSPECIFIED')) continue;
    const logical = resolveLogicalButton(btn.id, rmap);
    if (!logical) continue;
    const output = oldModeMap[logical];
    if (!output) continue;

    const digIdx = OUTPUT_ID_TO_DIGITAL_INDEX[output];
    if (digIdx !== undefined) {
      const existingPrimary = cc.digitalButtonMappings[digIdx];
      if (!existingPrimary || existingPrimary === 'BTN_UNSPECIFIED') {
        setDigital(digIdx, btn.id);
      } else if (existingPrimary !== btn.id) {
        // Many-to-one: preserve as an additional-bind remap.
        additionalRemaps.push({ physicalButton: btn.id, activates: existingPrimary });
      }
      continue;
    }
    const stkIdx = OUTPUT_ID_TO_STICK_INDEX[output];
    if (stkIdx !== undefined) {
      const existingPrimary = cc.stickDirectionMappings[stkIdx];
      if (!existingPrimary || existingPrimary === 'BTN_UNSPECIFIED') {
        setStick(stkIdx, btn.id);
      } else if (existingPrimary !== btn.id) {
        additionalRemaps.push({ physicalButton: btn.id, activates: existingPrimary });
      }
    }
  }

  // Merge additional-bind entries in, replacing any prior entry for the same phys.
  const existing = Array.isArray(profile.buttonRemapping) ? profile.buttonRemapping : [];
  const additionalPhys = new Set(additionalRemaps.map(r => r.physicalButton));
  profile.buttonRemapping = existing
    .filter(r => !additionalPhys.has(r.physicalButton))
    .concat(additionalRemaps);
}

// CUSTOM → controller: produce buttonRemapping entries so each CUSTOM binding
// hits the same output in the new mode. Non-menu buttons unbound in CUSTOM
// get explicit disables so mode-map defaults don't leak in.
function translateCustomToController(profile, newMode) {
  const newModeMap = MODE_OUTPUT_MAP[newMode] || {};
  const cc = getCustomConfig(profile);
  const digital = cc?.digitalButtonMappings  || [];
  const stick   = cc?.stickDirectionMappings || [];

  // physBtn → outputId for each CUSTOM primary, used to resolve additional-bind entries.
  const primaryOutput = {};
  for (let i = 0; i < digital.length; i++) {
    const out = DIGITAL_OUTPUT_TO_OUTPUT_ID[i];
    const b = digital[i];
    if (out && b && b !== 'BTN_UNSPECIFIED' && !(b in primaryOutput)) primaryOutput[b] = out;
  }
  for (let i = 0; i < stick.length; i++) {
    const out = STICK_DIR_TO_OUTPUT_ID[i];
    const b = stick[i];
    if (out && b && b !== 'BTN_UNSPECIFIED' && !(b in primaryOutput)) primaryOutput[b] = out;
  }

  // Reverse index newModeMap; first-wins keeps output data clean.
  const outputToPhys = {};
  for (const [phys, out] of Object.entries(newModeMap)) {
    if (!(out in outputToPhys)) outputToPhys[out] = phys;
  }

  const remap = [];
  const bound = new Set();
  const addBind = (physBtn, output) => {
    if (!physBtn || physBtn === 'BTN_UNSPECIFIED') return;
    bound.add(physBtn);
    const target = outputToPhys[output];
    if (!target) { remap.push({ physicalButton: physBtn }); return; }   // output missing in new mode → disable
    if (newModeMap[physBtn] === output) return;
    remap.push({ physicalButton: physBtn, activates: target });
  };

  for (let i = 0; i < digital.length; i++) {
    const out = DIGITAL_OUTPUT_TO_OUTPUT_ID[i];
    if (out) addBind(digital[i], out);
  }
  for (let i = 0; i < stick.length; i++) {
    const out = STICK_DIR_TO_OUTPUT_ID[i];
    if (out) addBind(stick[i], out);
  }

  // CUSTOM additional-binds: resolve `{X, activates: Y}` through primaryOutput.
  for (const r of (profile.buttonRemapping || [])) {
    if (!r.activates || r.activates === 'BTN_UNSPECIFIED') continue;
    const out = primaryOutput[r.activates];
    if (!out) continue;
    addBind(r.physicalButton, out);
  }

  // Explicit-disable everything not bound in CUSTOM (stricter "unmapped = no output" semantics).
  for (const phys of Object.keys(newModeMap)) {
    if (phys.startsWith('BTN_MB')) continue;
    if (bound.has(phys)) continue;
    if (remap.find(r => r.physicalButton === phys)) continue;
    remap.push({ physicalButton: phys });
  }

  profile.buttonRemapping = remap;
}

// Firmware hardcodes MB4=capture, MB5=home, MB6=select, MB7=start in every
// controller mode; menuButtonIcon is a display hint. Used when the profile
// leaves menuButtonIcon as OUT_UNSPECIFIED.
const MENU_BUTTON_FIRMWARE_DEFAULTS = {
  BTN_MB4: 'capture',
  BTN_MB5: 'home',
  BTN_MB6: 'select',
  BTN_MB7: 'start',
};

// Proto OutputOption enum → internal output id (for menuButtonIcon display).
const OUTPUT_OPTION_TO_OUTPUT_ID = {
  OUT_A: 'a', OUT_B: 'b', OUT_X: 'x', OUT_Y: 'y',
  OUT_LB: 'lb', OUT_RB: 'rb', OUT_LT: 'lt', OUT_RT: 'rt',
  OUT_START: 'start', OUT_SELECT: 'select',
  OUT_HOME: 'home', OUT_SW_CAPTURE: 'capture', OUT_SHARE: 'capture',
  OUT_DPAD_UP: 'dup', OUT_DPAD_DOWN: 'ddown',
  OUT_DPAD_LEFT: 'dleft', OUT_DPAD_RIGHT: 'dright',
  OUT_L3: 'ls', OUT_R3: 'rs',
  // Xbox-specific variants
  OUT_XB_START: 'start', OUT_XB_BACK: 'select',
  // PlayStation cross-platform mappings
  OUT_TRIANGLE: 'y', OUT_CIRCLE: 'b', OUT_SQUARE: 'x',
  OUT_TP: 'home',
  // Switch / Nintendo
  OUT_PLUS: 'start', OUT_MINUS: 'select', OUT_MENU: 'start',
  OUT_L: 'lb', OUT_R: 'rb', OUT_Z: 'rb', OUT_ZL: 'lt', OUT_ZR: 'rt',
};

// digitalButtonMappings[i] slot maps to DigitalOutput (i+1); this array
// gives the internal output id for each slot.
const DIGITAL_OUTPUT_TO_OUTPUT_ID = [
  'a',       // GP_A = 1
  'b',       // GP_B = 2
  'x',       // GP_X = 3
  'y',       // GP_Y = 4
  'lb',      // GP_LB = 5
  'rb',      // GP_RB = 6
  'lt',      // GP_LT = 7
  'rt',      // GP_RT = 8
  'start',   // GP_START = 9
  'select',  // GP_SELECT = 10
  'home',    // GP_HOME = 11
  'capture', // GP_CAPTURE = 12
  'dup',     // GP_DPAD_UP = 13
  'ddown',   // GP_DPAD_DOWN = 14
  'dleft',   // GP_DPAD_LEFT = 15
  'dright',  // GP_DPAD_RIGHT = 16
  'ls',      // GP_LSTICK_CLICK = 17
  'rs',      // GP_RSTICK_CLICK = 18
];

// stickDirectionMappings[i] slot maps to StickDirectionButton (i+1). Right stick uses 'cs*' naming.
const STICK_DIR_TO_OUTPUT_ID = [
  'lsu',     // SD_LSTICK_UP = 1
  'lsd',     // SD_LSTICK_DOWN = 2
  'lsl',     // SD_LSTICK_LEFT = 3
  'lsr',     // SD_LSTICK_RIGHT = 4
  'csu',     // SD_RSTICK_UP = 5
  'csd',     // SD_RSTICK_DOWN = 6
  'csl',     // SD_RSTICK_LEFT = 7
  'csr',     // SD_RSTICK_RIGHT = 8
];

// output id → slot index in the corresponding CUSTOM array (reverse of above).
const OUTPUT_ID_TO_DIGITAL_INDEX = {};
const OUTPUT_ID_TO_STICK_INDEX = {};
DIGITAL_OUTPUT_TO_OUTPUT_ID.forEach((id, i) => { OUTPUT_ID_TO_DIGITAL_INDEX[id] = i; });
STICK_DIR_TO_OUTPUT_ID.forEach((id, i) => { OUTPUT_ID_TO_STICK_INDEX[id] = i; });

// Output ids CUSTOM firmware can drive. Excludes mx/my/rt_light/rt_mid (mode-specific).
const CUSTOM_MODE_OUTPUTS = new Set([
  ...DIGITAL_OUTPUT_TO_OUTPUT_ID,
  ...STICK_DIR_TO_OUTPUT_ID,
]);

// Trigger axes excluded: firmware's `triggerLDigital → 255` override at end of
// UpdateAnalogOutputs clobbers modifier writes. Use AnalogTriggerMapping instead.
const ANALOG_AXES = [
  { value: 'AXIS_LSTICK_X',  label: 'L-Stick X' },
  { value: 'AXIS_LSTICK_Y',  label: 'L-Stick Y' },
  { value: 'AXIS_RSTICK_X',  label: 'R-Stick X' },
  { value: 'AXIS_RSTICK_Y',  label: 'R-Stick Y' },
];

// No-op multiplier under both OVERRIDE and COMPOUND combination modes.
const MODIFIER_DEFAULT_MULTIPLIER = 0;
// Full digital press value (matches triggerLDigital → triggerLAnalog).
const TRIGGER_FULL_PRESS_VALUE = 255;

const MOD_COMBINATION_MODES = [
  { value: 'COMBINATION_MODE_OVERRIDE', label: 'Override' },
  { value: 'COMBINATION_MODE_COMPOUND', label: 'Compound' },
];

const ANALOG_TRIGGERS = [
  { value: 'TRIGGER_LT', label: 'LT (Left)' },
  { value: 'TRIGGER_RT', label: 'RT (Right)' },
];

// CUSTOM-only virtual outputs: M{n} = modifier group, T{n} = trigger mapping.
const MODIFIER_OUTPUT_PREFIX = 'mod:';
const TRIGGER_OUTPUT_PREFIX  = 'trig:';
function modifierOutputId(groupIdx) { return MODIFIER_OUTPUT_PREFIX + groupIdx; }
function triggerOutputId(idx)       { return TRIGGER_OUTPUT_PREFIX  + idx;      }
function isModifierOutputId(id) { return typeof id === 'string' && id.startsWith(MODIFIER_OUTPUT_PREFIX); }
function isTriggerOutputId(id)  { return typeof id === 'string' && id.startsWith(TRIGGER_OUTPUT_PREFIX);  }
function parseGroupIdx(outputId) { return parseInt(outputId.slice(outputId.indexOf(':') + 1), 10); }

// Group key for AnalogModifier.buttons — used to fold multi-axis entries with the same activation into one M-group.
function modifierGroupKey(buttons) {
  if (!Array.isArray(buttons) || buttons.length === 0) return '';
  return [...buttons].sort().join('|');
}

// Walk customConfig.modifiers and group entries by their `buttons` array.
// Returns [{ key, buttons, axes: { AXIS_*: multiplier }, combinationMode, entries: [proto refs] }].
// First-appearance order in the modifier array determines M-group numbering.
function modifierGroups(cc) {
  if (!cc || !Array.isArray(cc.modifiers)) return [];
  const byKey = new Map();
  for (const m of cc.modifiers) {
    const key = modifierGroupKey(m.buttons);
    let g = byKey.get(key);
    if (!g) {
      g = {
        key,
        buttons: Array.isArray(m.buttons) ? [...m.buttons] : [],
        axes: {},
        combinationMode: m.combinationMode || 'COMBINATION_MODE_OVERRIDE',
        entries: [],
      };
      byKey.set(key, g);
    }
    if (m.axis) g.axes[m.axis] = (m.multiplier != null ? Number(m.multiplier) : 0);
    g.entries.push(m);
  }
  return [...byKey.values()];
}

// ---------------------------------------------------------------------------
// Platform display styles. Each output id → { label?, glyph?, bg, fg, kind }.
// kind: face | shoulder | system | dpad | stick | cstick | mod
// glyph: cross | circle | square | triangle (PS face shapes)
// ---------------------------------------------------------------------------
const DARK_BG = '#404040';
const POPUP_NEUTRAL_BG = '#2F2F2F';
const LIGHT_TEXT = '#f5f5f5';

function mkFace(label, bg, fg = '#fff') { return { label, bg, fg, kind: 'face' }; }
// PS renders faces as SVG shapes; `label` is kept for text contexts (tooltips, dropdowns).
function mkFaceGlyph(glyph, color, label) { return { label, glyph, bg: DARK_BG, fg: color, kind: 'face' }; }
function mkShoulder(label) { return { label, bg: DARK_BG, fg: LIGHT_TEXT, kind: 'shoulder' }; }
function mkSystem(label) { return { label, bg: DARK_BG, fg: LIGHT_TEXT, kind: 'system' }; }
function mkDpad(dir) { return { label: dir, bg: DARK_BG, fg: LIGHT_TEXT, kind: 'dpad' }; }
function mkStick(kind, dir) { return { label: dir, bg: DARK_BG, fg: LIGHT_TEXT, kind }; }
function mkMod(label) { return { label, bg: DARK_BG, fg: LIGHT_TEXT, kind: 'mod' }; }

const XBOX_STYLE = {
  a: mkFace('A', '#2ea043'),
  b: mkFace('B', '#e0464a'),
  x: mkFace('X', '#3a86c9'),
  y: mkFace('Y', '#e8c038', '#1a2a40'),
  lb: mkShoulder('LB'), rb: mkShoulder('RB'),
  lt: mkShoulder('LT'), rt: mkShoulder('RT'),
  ls: mkShoulder('LS'), rs: mkShoulder('RS'),
  start: mkSystem('START'), select: mkSystem('BACK'),
  home: mkSystem('⌂'), capture: mkSystem('◉'),
  dup: mkDpad('↑'), ddown: mkDpad('↓'), dleft: mkDpad('←'), dright: mkDpad('→'),
  lsl: mkStick('stick', '←'), lsr: mkStick('stick', '→'),
  lsu: mkStick('stick', '↑'), lsd: mkStick('stick', '↓'),
  csl: mkStick('cstick', '←'), csr: mkStick('cstick', '→'),
  csu: mkStick('cstick', '↑'), csd: mkStick('cstick', '↓'),
  mx: mkMod('MX'), my: mkMod('MY'),
  // Melee-specific partial RT presses
  rt_light: mkShoulder('Lt'), rt_mid: mkShoulder('Md'),
};

// PS: face buttons position-mapped (A=cross, B=circle, X=square, Y=triangle).
const PS_STYLE = {
  a: mkFaceGlyph('cross',    '#7DB3E9', 'A'),   // Cross (blue)
  b: mkFaceGlyph('circle',   '#FF6666', 'B'),   // Circle (red)
  x: mkFaceGlyph('square',   '#FF69F8', 'X'),   // Square (pink)
  y: mkFaceGlyph('triangle', '#3EE3A1', 'Y'),   // Triangle (green)
  lb: mkShoulder('L1'), rb: mkShoulder('R1'),
  lt: mkShoulder('L2'), rt: mkShoulder('R2'),
  ls: mkShoulder('L3'), rs: mkShoulder('R3'),
  start: mkSystem('OPT'), select: mkSystem('CRE'),
  home: mkSystem('PS'), capture: mkSystem('MIC'),
  dup: mkDpad('↑'), ddown: mkDpad('↓'), dleft: mkDpad('←'), dright: mkDpad('→'),
  lsl: mkStick('stick', '←'), lsr: mkStick('stick', '→'),
  lsu: mkStick('stick', '↑'), lsd: mkStick('stick', '↓'),
  csl: mkStick('cstick', '←'), csr: mkStick('cstick', '→'),
  csu: mkStick('cstick', '↑'), csd: mkStick('cstick', '↓'),
  mx: mkMod('MX'), my: mkMod('MY'),
  rt_light: mkShoulder('Lt'), rt_mid: mkShoulder('Md'),
};

// Switch: labels are 1:1 with OutputState (firmware doesn't swap A↔B/X↔Y per backend).
const SWITCH_STYLE = {
  a: mkFace('A', DARK_BG, LIGHT_TEXT),
  b: mkFace('B', DARK_BG, LIGHT_TEXT),
  x: mkFace('X', DARK_BG, LIGHT_TEXT),
  y: mkFace('Y', DARK_BG, LIGHT_TEXT),
  lb: mkShoulder('L'),  rb: mkShoulder('R'),
  lt: mkShoulder('ZL'), rt: mkShoulder('ZR'),
  ls: mkShoulder('LS'), rs: mkShoulder('RS'),
  start: mkSystem('+'), select: mkSystem('−'),
  home: mkSystem('⌂'), capture: mkSystem('◻'),
  dup: mkDpad('↑'), ddown: mkDpad('↓'), dleft: mkDpad('←'), dright: mkDpad('→'),
  lsl: mkStick('stick', '←'), lsr: mkStick('stick', '→'),
  lsu: mkStick('stick', '↑'), lsd: mkStick('stick', '↓'),
  csl: mkStick('cstick', '←'), csr: mkStick('cstick', '→'),
  csu: mkStick('cstick', '↑'), csd: mkStick('cstick', '↓'),
  mx: mkMod('MX'), my: mkMod('MY'),
  rt_light: mkShoulder('Lt'), rt_mid: mkShoulder('Md'),
};

// GameCube: A/B/X/Y use GC colors; Z maps to rb; L/R are lt/rt; no lb.
const GC_STYLE = {
  a: mkFace('A', '#3cb34a'),
  b: mkFace('B', '#e03030'),
  x: mkFace('X', DARK_BG, LIGHT_TEXT),
  y: mkFace('Y', '#d4a017', '#1a1a00'),
  rb: mkShoulder('Z'),
  lt: mkShoulder('L'),  rt: mkShoulder('R'),
  ls: mkShoulder('L3'), rs: mkShoulder('R3'),
  start: mkSystem('START'), select: mkSystem('—'),
  home: mkSystem('⌂'), capture: mkSystem('◉'),
  dup: mkDpad('↑'), ddown: mkDpad('↓'), dleft: mkDpad('←'), dright: mkDpad('→'),
  lsl: mkStick('stick', '←'), lsr: mkStick('stick', '→'),
  lsu: mkStick('stick', '↑'), lsd: mkStick('stick', '↓'),
  csl: mkStick('cstick', '←'), csr: mkStick('cstick', '→'),
  csu: mkStick('cstick', '↑'), csd: mkStick('cstick', '↓'),
  mx: mkMod('MX'), my: mkMod('MY'),
  rt_light: mkShoulder('Lt'), rt_mid: mkShoulder('Md'),
};

// Nintendo 64: A blue, B green, C-buttons yellow-tinted. Z reuses GameCube's
// 'Z' shoulder; L/R borrow the Switch-style single-letter shoulder labels.
// No LB on the N64 controller, so 'lb' is intentionally omitted.
const N64_STYLE = {
  a: mkFace('A', '#3851a0'),                   // N64 A button (blue)
  b: mkFace('B', '#2f9e44'),                   // N64 B button (green)
  // X/Y aren't on the N64 controller but kept for cross-mode safety so any
  // mode that emits them still has a glyph to render.
  x: mkFace('X', DARK_BG, LIGHT_TEXT),
  y: mkFace('Y', DARK_BG, LIGHT_TEXT),
  rb: mkShoulder('Z'),                          // mirrors GC_STYLE.rb
  lt: mkShoulder('L'),                          // mirrors SWITCH_STYLE.lb
  rt: mkShoulder('R'),                          // mirrors SWITCH_STYLE.rb
  ls: mkShoulder('L3'), rs: mkShoulder('R3'),
  start: mkSystem('START'), select: mkSystem('—'),
  home: mkSystem('⌂'), capture: mkSystem('◉'),
  dup: mkDpad('↑'), ddown: mkDpad('↓'), dleft: mkDpad('←'), dright: mkDpad('→'),
  lsl: mkStick('stick', '←'), lsr: mkStick('stick', '→'),
  lsu: mkStick('stick', '↑'), lsd: mkStick('stick', '↓'),
  // N64 C-buttons are yellow on real hardware; we keep the cstick rendering
  // generic (matches GC/Switch) so the arrow icons read cleanly.
  csl: mkStick('cstick', '←'), csr: mkStick('cstick', '→'),
  csu: mkStick('cstick', '↑'), csd: mkStick('cstick', '↓'),
  mx: mkMod('MX'), my: mkMod('MY'),
  rt_light: mkShoulder('Lt'), rt_mid: mkShoulder('Md'),
};

const PLATFORM_STYLES = {
  xbox: XBOX_STYLE,
  playstation: PS_STYLE,
  switch: SWITCH_STYLE,
  gamecube: GC_STYLE,
  n64: N64_STYLE,
};

// Platform icon SVGs (base64) from kenney_input-prompts, baked in.
const _SVG = {
  gc__gamecube_button_color_a: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iIzEyREU3RSIgZD0iTTU2IDMyIFE1NiA0MiA0OC45NSA0OC45NSA0MiA1NiAzMiA1NiAyMi4wNSA1NiAxNSA0OC45NSA4IDQyIDggMzIgOCAyMi4wNSAxNSAxNSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxNSA1NiAyMi4wNSA1NiAzMiBNMzggNDIgTDQyIDQyIDM0IDIyIDMwIDIyIDIyIDQyIDI2IDQyIDI3LjYgMzggMzYuNCAzOCAzOCA0MiBNMzIgMjcgTDM0LjggMzQgMjkuMiAzNCAzMiAyNyIvPgogIDwvZz4KPC9zdmc+',
  gc__gamecube_button_color_b: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0U3MzI0NiIgZD0iTTU2IDMyIFE1NiA0MiA0OC45NSA0OC45NSA0MiA1NiAzMiA1NiAyMi4wNSA1NiAxNSA0OC45NSA4IDQyIDggMzIgOCAyMi4wNSAxNSAxNSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxNSA1NiAyMi4wNSA1NiAzMiBNMzcgMjggUTM3IDI4Ljg1IDM2LjQ1IDI5LjQgTDM2LjQgMjkuNCBRMzUuOCAzMCAzNSAzMCBMMjkgMzAgMjkgMjYgMzUgMjYgUTM1LjggMjYgMzYuMzUgMjYuNTUgTDM2LjQ1IDI2LjY1IFEzNyAyNy4yIDM3IDI4IE00MSAzNiBRNDEgMzMuNyAzOS41IDMyIDQxIDMwLjMgNDEgMjggNDEgMjUuNTUgMzkuMjUgMjMuOCBMMzkuMiAyMy43NSBRMzcuNDUgMjIgMzUgMjIgTDI1IDIyIDI1IDQyIDM1IDQyIFEzNy40NSA0MiAzOS4yIDQwLjI1IEwzOS4yNSA0MC4yIFE0MSAzOC40NSA0MSAzNiBNMzcgMzYgUTM3IDM2LjggMzYuNDUgMzcuMzUgTDM2LjM1IDM3LjQ1IFEzNS44IDM4IDM1IDM4IEwyOSAzOCAyOSAzNCAzNSAzNCBRMzUuOCAzNCAzNi40IDM0LjYgTDM2LjQ1IDM0LjYgUTM3IDM1LjE1IDM3IDM2Ii8+CiAgPC9nPgo8L3N2Zz4=',
  gc__gamecube_button_start: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTMxIDE2LjkgTDMxIDE5LjEgMzMgMTkuMSAzMyAxNi45IDMyLjc1IDE2LjM1IDMyLjc1IDE2LjQgUTMyLjQ1IDE2LjEgMzIgMTYuMSAzMS41NSAxNi4xIDMxLjIgMTYuNCBMMzEuMjUgMTYuMyBRMzEgMTYuNTUgMzEgMTYuOSBNMzkuMSAxOC4xIEwzOS40NSAxOCAzOS43IDE3LjggMzkuNzUgMTcuOCA0MCAxNy4xIDM5LjcgMTYuMzUgUTM5LjQ1IDE2LjEgMzkuMDUgMTYuMSBMMzggMTYuMSAzOCAxOC4xIDM5LjEgMTguMSBNMTggMTYuMSBRMTcuNiAxNi4xIDE3LjMgMTYuNCAxNyAxNi43IDE3IDE3LjEgMTcgMTcuNSAxNy4zIDE3LjggMTcuNiAxOC4xIDE3Ljk1IDE4LjEgTDE4LjA1IDE4LjEgUTE5LjIgMTguMSAyMC4xIDE5IDIxIDE5LjkgMjEgMjEuMSAyMSAyMi4zIDIwLjEgMjMuMiAxOS4yIDI0LjEgMTggMjQuMSBMMTYgMjQuMSAxNS4zIDIzLjggUTE1IDIzLjUgMTUgMjMuMSAxNSAyMi43IDE1LjMgMjIuNCAxNS42IDIyLjEgMTYgMjIuMSBMMTggMjIuMSBRMTguNCAyMi4xIDE4LjcgMjEuOCBMMTkgMjEuMSAxOC43IDIwLjQgUTE4LjQgMjAuMSAxOC4wNSAyMC4xIEwxNy45NSAyMC4xIFExNi44IDIwLjEgMTUuOSAxOS4yIDE1IDE4LjMgMTUgMTcuMSAxNSAxNS45IDE1LjkgMTUgMTYuOCAxNC4xIDE4IDE0LjEgTDIwIDE0LjEgUTIwLjQgMTQuMSAyMC43IDE0LjQgTDIxIDE1LjEgMjAuNyAxNS44IDIwIDE2LjEgMTggMTYuMSBNMjMgMTYuMSBRMjIuNiAxNi4xIDIyLjMgMTUuOCAyMiAxNS41IDIyIDE1LjEgMjIgMTQuNyAyMi4zIDE0LjQgMjIuNiAxNC4xIDIzIDE0LjEgTDI3IDE0LjEgUTI3LjQgMTQuMSAyNy43IDE0LjQgTDI4IDE1LjEgMjcuNyAxNS44IFEyNy40IDE2LjEgMjcgMTYuMSBMMjYgMTYuMSAyNiAyMy4xIDI1LjcgMjMuOCAyNSAyNC4xIDI0LjMgMjMuOCBRMjQgMjMuNSAyNCAyMy4xIEwyNCAxNi4xIDIzIDE2LjEgTTI5IDE2LjkgUTI5IDE1Ljc1IDI5Ljg1IDE0LjkgTDI5LjkgMTQuODUgUTMwLjc1IDE0LjEgMzIgMTQuMSAzMy4xNSAxNC4xIDM0LjA1IDE0Ljg1IEwzNC4xIDE0LjkgUTM1IDE1Ljc1IDM1IDE2LjkgTDM1IDIzLjEgMzQuNyAyMy44IFEzNC40IDI0LjEgMzQgMjQuMSBMMzMuMyAyMy44IFEzMyAyMy41IDMzIDIzLjEgTDMzIDIxLjEgMzEgMjEuMSAzMSAyMy4xIDMwLjcgMjMuOCBRMzAuNCAyNC4xIDMwIDI0LjEgTDI5LjMgMjMuOCBRMjkgMjMuNSAyOSAyMy4xIEwyOSAxNi45IE00MS4xIDE5LjIgTDQxLjEgMTkuMjUgNDAuNDUgMTkuNzUgNDEuOSAyMi42NSA0MS45NSAyMy40NSA0MS40NSAyNCA0MC43IDI0LjA1IFE0MC4zIDIzLjkgNDAuMSAyMy41NSBMMzguNCAyMC4xIDM4IDIwLjEgMzggMjMuMSAzNy43IDIzLjggMzcgMjQuMSAzNi4zIDIzLjggUTM2IDIzLjUgMzYgMjMuMSBMMzYgMTUuMSBRMzYgMTQuNyAzNi4zIDE0LjQgMzYuNiAxNC4xIDM3IDE0LjEgTDM5LjA1IDE0LjEgUTQwLjI1IDE0LjEgNDEuMSAxNC45NSA0MiAxNS44NSA0MiAxNy4xIDQyIDE4LjM1IDQxLjEgMTkuMiBNNDggMTQuMSBRNDguNCAxNC4xIDQ4LjcgMTQuNCBMNDkgMTUuMSA0OC43IDE1LjggUTQ4LjQgMTYuMSA0OCAxNi4xIEw0NyAxNi4xIDQ3IDIzLjEgNDYuNyAyMy44IDQ2IDI0LjEgNDUuMyAyMy44IFE0NSAyMy41IDQ1IDIzLjEgTDQ1IDE2LjEgNDQgMTYuMSBRNDMuNiAxNi4xIDQzLjMgMTUuOCA0MyAxNS41IDQzIDE1LjEgNDMgMTQuNyA0My4zIDE0LjQgNDMuNiAxNC4xIDQ0IDE0LjEgTDQ4IDE0LjEgTTQ0IDM5IFE0NCA0My45NSA0MC40NSA0Ny40NSAzNi45NSA1MSAzMiA1MSAyNy4wNSA1MSAyMy41IDQ3LjQ1IDIwIDQzLjk1IDIwIDM5IDIwIDM0LjA1IDIzLjUgMzAuNSAyNy4wNSAyNyAzMiAyNyAzNi45NSAyNyA0MC40NSAzMC41IDQ0IDM0LjA1IDQ0IDM5Ii8+CiAgPC9nPgo8L3N2Zz4=',
  gc__gamecube_button_x_tilted: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTIzLjQ1IDQ3LjM1IFEyMi4zNSA0Mi45NSAyMC4xIDM5LjEgMTcuODUgMzUuMjUgMTQuNjUgMzIuMDUgMTEuMSAyOC40NSAxMS4yIDIzLjQ1IDExLjMgMTguMzUgMTQuOCAxNC44NSBMMTYuOCAxMy4zNSAyMi4zIDEwLjE1IFEyNC43NSA4LjkgMjcuODUgOC44NSAzMi44IDguOCAzNi40NSAxMi40IDQxLjg1IDE3LjkgNDUuNiAyNC40IDQ5LjQgMzAuODUgNTEuNCAzOC4zNSA1Mi43IDQzLjIgNTAuMTUgNDcuNTUgNDguNiA1MC4xNSA0Ni4yNSA1MS43IEw0MC43NSA1NC45IDM4LjQ1IDU1LjggUTMzLjY1IDU3LjEgMjkuMjUgNTQuNyAyNC44NSA1Mi4yIDIzLjQ1IDQ3LjM1IE0yNy44IDI0IEwyNSAyNi44IDI5LjcgMzEuNSAyNSAzNi4yIDI3LjggMzkgMzIgMzQuOCAzNi4yIDM5IDM5IDM2LjIgMzQuMyAzMS41IDM5IDI2LjggMzYuMiAyNCAzMiAyOC4yIDI3LjggMjQiLz4KICA8L2c+Cjwvc3ZnPg==',
  gc__gamecube_button_y_tilted: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTQ0LjggNDQuMSBRNDAuMiA0NC4xIDM1Ljk1IDQ1LjI1IDMxLjYgNDYuNCAyNy43IDQ4LjcgMjMuMyA1MS4xIDE4LjQ1IDQ5LjggMTMuNiA0OC4zNSAxMS4xNSA0NC4wNSBMMTAuMTUgNDEuNzUgOC41IDM1LjYgUTcuOTUgMzIuOTUgOC42NSAyOS45NSA5Ljk1IDI1LjE1IDE0LjMgMjIuNTUgMjEuMDUgMTguNyAyOC4yNSAxNi44NSAzNS41IDE0Ljg1IDQzLjI1IDE0LjggNDguMzUgMTQuODUgNTEuODUgMTguMzUgNTMuOTUgMjAuNTUgNTQuOCAyMy4yIEw1Ni40NSAyOS4zNSA1Ni43NSAzMS44NSBRNTYuNzUgMzYuOCA1My4zIDQwLjQ1IDQ5LjggNDQgNDQuOCA0NC4xIE0zMSAzOSBMMzUgMzkgMzUgMzEuOCA0MCAyNi44IDM3LjIgMjQgMzMgMjguMiAyOC44IDI0IDI2IDI2LjggMzEgMzEuOCAzMSAzOSIvPgogIDwvZz4KPC9zdmc+',
  gc__gamecube_button_z: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTQ4IDE2IFE1NiAxNiA1NiAyNCBMNTYgNDAgUTU2IDQ4IDQ4IDQ4IEwxNiA0OCBROCA0OCA4IDQwIEw4IDI0IFE4IDE2IDE2IDE2IEw0OCAxNiBNMzggMjQgTDI2IDI0IDI2IDI4IDMyIDI4IDI2IDM3LjYgMjYgNDAgMzggNDAgMzggMzYgMzIgMzYgMzggMjYuNCAzOCAyNCIvPgogIDwvZz4KPC9zdmc+',
  gc__gamecube_dpad_down: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTM0IDIzIEwzNCAxNCAzMCAxNCAzMCAyMyAzNCAyMyBNNDEgMzQgTDUwIDM0IDUwIDMwIDQxIDMwIDQxIDM0IE0yMyA0MSBMMTIgNDEgUTggNDEgOCAzNyBMOCAyNyBROCAyMyAxMiAyMyBMMjMgMjMgMjMgMTIgUTIzIDggMjcgOCBMMzcgOCBRNDEgOCA0MSAxMiBMNDEgMjMgNTIgMjMgUTU2IDIzIDU2IDI3IEw1NiAzNyBRNTYgNDEgNTIgNDEgTDQxIDQxIDM0IDQxIDMwIDQxIDIzIDQxIE0xNCAzNCBMMjMgMzQgMjMgMzAgMTQgMzAgMTQgMzQiLz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0U3MzI0NiIgZD0iTTIzIDQxIEwzMCA0MSAzMCA1MCAzNCA1MCAzNCA0MSA0MSA0MSA0MSA1MiBRNDEgNTYgMzcgNTYgTDI3IDU2IFEyMyA1NiAyMyA1MiBMMjMgNDEiLz4KICA8L2c+Cjwvc3ZnPg==',
  gc__gamecube_dpad_left: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTMwIDE0IEwzMCAyMyAzNCAyMyAzNCAxNCAzMCAxNCBNNDEgMzQgTDUwIDM0IDUwIDMwIDQxIDMwIDQxIDM0IE0yMyAyMyBMMjMgMTIgUTIzIDggMjcgOCBMMzcgOCBRNDEgOCA0MSAxMiBMNDEgMjMgNTIgMjMgUTU2IDIzIDU2IDI3IEw1NiAzNyBRNTYgNDEgNTIgNDEgTDQxIDQxIDQxIDUyIFE0MSA1NiAzNyA1NiBMMjcgNTYgUTIzIDU2IDIzIDUyIEwyMyA0MSAyMyAzNCAyMyAzMCAyMyAyMyBNMzAgNDEgTDMwIDUwIDM0IDUwIDM0IDQxIDMwIDQxIi8+CiAgICA8cGF0aCBzdHJva2U9Im5vbmUiIGZpbGw9IiNFNzMyNDYiIGQ9Ik0yMyAyMyBMMjMgMzAgMTQgMzAgMTQgMzQgMjMgMzQgMjMgNDEgMTIgNDEgUTggNDEgOCAzNyBMOCAyNyBROCAyMyAxMiAyMyBMMjMgMjMiLz4KICA8L2c+Cjwvc3ZnPg==',
  gc__gamecube_dpad_right: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTQxIDQxIEw0MSA1MiBRNDEgNTYgMzcgNTYgTDI3IDU2IFEyMyA1NiAyMyA1MiBMMjMgNDEgMTIgNDEgUTggNDEgOCAzNyBMOCAyNyBROCAyMyAxMiAyMyBMMjMgMjMgMjMgMTIgUTIzIDggMjcgOCBMMzcgOCBRNDEgOCA0MSAxMiBMNDEgMjMgNDEgMzAgNDEgMzQgNDEgNDEgTTIzIDM0IEwyMyAzMCAxNCAzMCAxNCAzNCAyMyAzNCBNMzQgNDEgTDMwIDQxIDMwIDUwIDM0IDUwIDM0IDQxIE0zNCAxNCBMMzAgMTQgMzAgMjMgMzQgMjMgMzQgMTQiLz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0U3MzI0NiIgZD0iTTQxIDIzIEw1MiAyMyBRNTYgMjMgNTYgMjcgTDU2IDM3IFE1NiA0MSA1MiA0MSBMNDEgNDEgNDEgMzQgNTAgMzQgNTAgMzAgNDEgMzAgNDEgMjMiLz4KICA8L2c+Cjwvc3ZnPg==',
  gc__gamecube_dpad_up: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTQxIDIzIEw1MiAyMyBRNTYgMjMgNTYgMjcgTDU2IDM3IFE1NiA0MSA1MiA0MSBMNDEgNDEgNDEgNTIgUTQxIDU2IDM3IDU2IEwyNyA1NiBRMjMgNTYgMjMgNTIgTDIzIDQxIDEyIDQxIFE4IDQxIDggMzcgTDggMjcgUTggMjMgMTIgMjMgTDIzIDIzIDMwIDIzIDM0IDIzIDQxIDIzIE0xNCAzMCBMMTQgMzQgMjMgMzQgMjMgMzAgMTQgMzAgTTM0IDQxIEwzMCA0MSAzMCA1MCAzNCA1MCAzNCA0MSBNNDEgMzAgTDQxIDM0IDUwIDM0IDUwIDMwIDQxIDMwIi8+CiAgICA8cGF0aCBzdHJva2U9Im5vbmUiIGZpbGw9IiNFNzMyNDYiIGQ9Ik0yMyAyMyBMMjMgMTIgUTIzIDggMjcgOCBMMzcgOCBRNDEgOCA0MSAxMiBMNDEgMjMgMzQgMjMgMzQgMTQgMzAgMTQgMzAgMjMgMjMgMjMiLz4KICA8L2c+Cjwvc3ZnPg==',
  gc__gamecube_stick_c_color_down: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwIiBkPSJNMjUuNiAzNyBMMzguNCAzNyBRNDAuMjUgMzYuOTUgNDEuNyAzOC40IDQyLjQ1IDM5LjE1IDQyLjggNDAuMTUgTDQzIDQxLjY1IFE0MyA0My41IDQxLjggNDQuODUgTDQxLjcgNDQuOTUgMzUuMyA1MS42IDM1LjMgNTEuNjUgUTMzLjg1IDUzLjA1IDMyIDUzIDMwIDUzIDI4LjcgNTEuNiBMMjIuMyA0NC45NSAyMi4yNSA0NC44NSBRMjEgNDMuNSAyMSA0MS42NSAyMSA0MC44IDIxLjI1IDQwLjE1IDIxLjU1IDM5LjIgMjIuMjUgMzguNSAyMy41NSAzNyAyNS42IDM3IE0zMC44NSA0OS41IFEzMS4zIDUwIDMyIDUwIDMyLjY1IDUwIDMzLjE1IDQ5LjUgTDM5LjU1IDQyLjg1IFE0MCA0Mi4zNSA0MCA0MS42NSBMNDAgNDEuMyAzOS41NSA0MC41IFEzOS4wNSA0MCAzOC40IDQwIEwyNS42IDQwIFEyNC45IDQwIDI0LjQ1IDQwLjUgTDI0LjA1IDQxLjMgMjQgNDEuNjUgUTI0IDQyLjM1IDI0LjQ1IDQyLjg1IEwzMC44NSA0OS41Ii8+CiAgICA8cGF0aCBzdHJva2U9Im5vbmUiIGZpbGw9IiNGRkNDMDAiIGQ9Ik00NC4xNSAxOSBRNDcuNyAyMiA0OCAyNS45NSBMNDggMjYuMDUgUTQ3LjcgMzAgNDQuMiAzMi45IEw0NCAzMy4wNSBRMzkuMzUgMzYuNzUgMzIuOCAzNyBMMzEuMiAzNyBRMjQuNTUgMzYuNzUgMTkuOCAzMi45NSBMMTkuNyAzMi45IFExNi4zIDMwIDE2IDI2LjEgTDE2IDI2LjA1IFExNi4yNSAyMiAxOS44NSAxOSBMMTkuOTUgMTguOSBRMjUgMTUgMzIgMTUgMzkuMTUgMTUgNDQuMiAxOSBMNDQuMTUgMTkgTTQzIDUwIFE0MyA1Mi41IDM5Ljc1IDU0LjI1IDM2LjU1IDU2IDMyIDU2IDI3LjUgNTYgMjQuMjUgNTQuMjUgMjEgNTIuNSAyMSA1MCBMMjEgNDcuOSBRMTcuOCA0Ni41NSAxNSA0NC4zIDggMzguNyA4IDMwLjY1IEw4IDMwLjEgOCAyOS41NSA4IDI5IDggMjguNSA4IDI4LjEgOCAyNy45NSA4IDI3LjQgUTggMTkuNCAxNSAxMy42NSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxMy42NSA1NiAxOS40IDU2IDI3LjQgTDU2IDI3Ljk1IDU2IDI4LjEgNTYgMjguNSA1NiAyOSA1NiAyOS41NSA1NiAzMC4xIDU2IDMwLjY1IFE1NiAzOC43IDQ4Ljk1IDQ0LjMgNDYuMiA0Ni41NSA0MyA0Ny45IEw0MyA1MCBNMzIuNSAyMCBRMzAgMjAgMjguMjUgMjEuNzUgMjYuNSAyMy41IDI2LjUgMjYgMjYuNSAyOC41IDI4LjI1IDMwLjI1IDMwIDMyIDMyLjUgMzIgMzUgMzIgMzYuNzUgMzAuMjUgTDM0LjY1IDI4LjE1IFEzMy43NSAyOSAzMi41IDI5IDMxLjI1IDI5IDMwLjQgMjguMTUgMjkuNSAyNy4yNSAyOS41IDI2IDI5LjUgMjQuNzUgMzAuNCAyMy45IDMxLjI1IDIzIDMyLjUgMjMgMzMuNzUgMjMgMzQuNjUgMjMuOSBMMzYuNzUgMjEuNzUgUTM1IDIwIDMyLjUgMjAgTTEyIDI3LjQgUTEyLjEgMzMuNDUgMTcuNCAzNy42NSBMMjEuMjUgNDAuMTUgUTIxIDQwLjggMjEgNDEuNjUgMjEgNDMuNSAyMi4yNSA0NC44NSBMMjIuMyA0NC45NSAyOC43IDUxLjYgUTMwIDUzIDMyIDUzIDMzLjg1IDUzLjA1IDM1LjMgNTEuNjUgTDM1LjMgNTEuNiA0MS43IDQ0Ljk1IDQxLjggNDQuODUgUTQzIDQzLjUgNDMgNDEuNjUgTDQyLjggNDAuMTUgNDYuNTUgMzcuNyA0Ni42IDM3LjY1IFE1MS45IDMzLjQgNTIgMjcuNCA1MS44NSAyMS40IDQ2LjU1IDE3LjEgNDAuNTUgMTIuMyAzMiAxMi4zIDIzLjQ1IDEyLjMgMTcuNCAxNy4xIEwxNy40NSAxNy4xIFExMi4xNSAyMS40IDEyIDI3LjQiLz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTMwLjg1IDQ5LjUgTDI0LjQ1IDQyLjg1IFEyNCA0Mi4zNSAyNCA0MS42NSBMMjQuMDUgNDEuMyAyNC40NSA0MC41IFEyNC45IDQwIDI1LjYgNDAgTDM4LjQgNDAgUTM5LjA1IDQwIDM5LjU1IDQwLjUgTDQwIDQxLjMgNDAgNDEuNjUgUTQwIDQyLjM1IDM5LjU1IDQyLjg1IEwzMy4xNSA0OS41IFEzMi42NSA1MCAzMiA1MCAzMS4zIDUwIDMwLjg1IDQ5LjUiLz4KICA8L2c+Cjwvc3ZnPg==',
  gc__gamecube_stick_c_color_left: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwIiBkPSJNMTYgMzIuNCBRMTYgMzQuMSAxNC45NSAzNS4zIEwxNC41IDM1Ljc1IFExMy4yNSAzNyAxMS4zNSAzNyAxMC4wNSAzNyA5IDM2LjQgTDguMTUgMzUuNzUgOC4wNSAzNS43IDEuNCAyOS4zIFEwIDI4IDAgMjYgLTAuMDUgMjQuMTUgMS4zNSAyMi43IEwxLjQgMjIuNyA4LjA1IDE2LjMgOC4xNSAxNi4yIFE5LjUgMTUgMTEuMzUgMTUgMTIuMzUgMTUgMTMuMTUgMTUuMzUgMTMuOTUgMTUuNjUgMTQuNiAxNi4zIDE1LjYgMTcuMyAxNS45IDE4LjU1IEwxNiAxOS42IDE2IDMyLjQgTTMuNSAyNy4xNSBMMTAuMTUgMzMuNTUgUTEwLjY1IDM0IDExLjM1IDM0IEwxMi41IDMzLjU1IFExMyAzMy4xIDEzIDMyLjQgTDEzIDE5LjYgUTEzIDE4Ljk1IDEyLjUgMTguNDUgMTIuMDUgMTggMTEuMzUgMTggTDEwLjkgMTguMDUgUTEwLjQ1IDE4LjE1IDEwLjE1IDE4LjQ1IEwzLjUgMjQuODUgUTMgMjUuMzUgMyAyNiAzIDI2LjcgMy41IDI3LjE1Ii8+CiAgICA8cGF0aCBzdHJva2U9Im5vbmUiIGZpbGw9IiNGRkNDMDAiIGQ9Ik00NC4xNSAxOSBRNDcuNyAyMiA0OCAyNS45NSBMNDggMjYuMDUgUTQ3LjcgMzAgNDQuMiAzMi45IEw0NCAzMy4wNSBRMzkuMDUgMzcgMzIgMzcgMjQuODUgMzcgMTkuOCAzMi45NSBMMTkuNyAzMi45IFExNi4zIDMwIDE2IDI2LjEgTDE2IDI2LjA1IFExNi4yNSAyMiAxOS44NSAxOSBMMTkuOTUgMTguOSBRMjUgMTUgMzIgMTUgMzkuMTUgMTUgNDQuMiAxOSBMNDQuMTUgMTkgTTQzIDUwIFE0MyA1Mi41IDM5Ljc1IDU0LjI1IDM2LjU1IDU2IDMyIDU2IDI3LjUgNTYgMjQuMjUgNTQuMjUgMjEgNTIuNSAyMSA1MCBMMjEgNDcuOSBRMTcuOCA0Ni41NSAxNSA0NC4zIDEwLjY1IDQwLjggOSAzNi40IDEwLjA1IDM3IDExLjM1IDM3IDEzLjI1IDM3IDE0LjUgMzUuNzUgTDE0Ljk1IDM1LjMgUTE2IDM2LjU1IDE3LjQgMzcuNjUgMjMuNDUgNDIuNSAzMiA0Mi41IDQwLjU1IDQyLjUgNDYuNTUgMzcuNyBMNDYuNiAzNy42NSBRNTEuOSAzMy40IDUyIDI3LjQgNTEuODUgMjEuNCA0Ni41NSAxNy4xIDQwLjU1IDEyLjMgMzIgMTIuMyAyMy40NSAxMi4zIDE3LjQgMTcuMSBMMTcuNDUgMTcuMSAxNS45IDE4LjU1IFExNS42IDE3LjMgMTQuNiAxNi4zIDEzLjk1IDE1LjY1IDEzLjE1IDE1LjM1IEwxNSAxMy42NSBRMjIuMDUgOCAzMiA4IDQyIDggNDguOTUgMTMuNjUgNTYgMTkuNCA1NiAyNy40IEw1NiAyNy45NSA1NiAyOC4xIDU2IDI4LjUgNTYgMjkgNTYgMjkuNTUgNTYgMzAuMSA1NiAzMC42NSBRNTYgMzguNyA0OC45NSA0NC4zIDQ2LjIgNDYuNTUgNDMgNDcuOSBMNDMgNTAgTTMyLjUgMjAgUTMwIDIwIDI4LjI1IDIxLjc1IDI2LjUgMjMuNSAyNi41IDI2IDI2LjUgMjguNSAyOC4yNSAzMC4yNSAzMCAzMiAzMi41IDMyIDM1IDMyIDM2Ljc1IDMwLjI1IEwzNC42NSAyOC4xNSBRMzMuNzUgMjkgMzIuNSAyOSAzMS4yNSAyOSAzMC40IDI4LjE1IDI5LjUgMjcuMjUgMjkuNSAyNiAyOS41IDI0Ljc1IDMwLjQgMjMuOSAzMS4yNSAyMyAzMi41IDIzIDMzLjc1IDIzIDM0LjY1IDIzLjkgTDM2Ljc1IDIxLjc1IFEzNSAyMCAzMi41IDIwIi8+CiAgICA8cGF0aCBzdHJva2U9Im5vbmUiIGZpbGw9IiNGRkZGRkYiIGQ9Ik0zLjUgMjcuMTUgUTMgMjYuNyAzIDI2IDMgMjUuMzUgMy41IDI0Ljg1IEwxMC4xNSAxOC40NSBRMTAuNDUgMTguMTUgMTAuOSAxOC4wNSBMMTEuMzUgMTggUTEyLjA1IDE4IDEyLjUgMTguNDUgMTMgMTguOTUgMTMgMTkuNiBMMTMgMzIuNCBRMTMgMzMuMSAxMi41IDMzLjU1IEwxMS4zNSAzNCBRMTAuNjUgMzQgMTAuMTUgMzMuNTUgTDMuNSAyNy4xNSIvPgogIDwvZz4KPC9zdmc+',
  gc__gamecube_stick_c_color_right: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwIiBkPSJNNDggMzIuNCBMNDggMTkuNiA0OC4xIDE4LjU1IFE0OC40IDE3LjMgNDkuNCAxNi4zIDUwIDE1LjY1IDUwLjg1IDE1LjM1IDUxLjY1IDE1IDUyLjY1IDE1IDU0LjUgMTUgNTUuODUgMTYuMiBMNTUuOTUgMTYuMyA2Mi42IDIyLjcgNjIuNjUgMjIuNyBRNjQuMDUgMjQuMTUgNjQgMjYgNjQgMjggNjIuNiAyOS4zIEw1NS45NSAzNS43IDU1Ljg1IDM1Ljc1IDU1IDM2LjQgUTUzLjk1IDM3IDUyLjY1IDM3IDUwLjc1IDM3IDQ5LjUgMzUuNzUgTDQ5LjA1IDM1LjMgUTQ4IDM0LjEgNDggMzIuNCBNNjAuNSAyNy4xNSBRNjEgMjYuNyA2MSAyNiA2MSAyNS4zNSA2MC41IDI0Ljg1IEw1My44NSAxOC40NSBRNTMuNSAxOC4xNSA1My4xIDE4LjA1IEw1Mi42NSAxOCBRNTEuOTUgMTggNTEuNSAxOC40NSA1MSAxOC45NSA1MSAxOS42IEw1MSAzMi40IFE1MSAzMy4xIDUxLjUgMzMuNTUgNTEuOTUgMzQgNTIuNjUgMzQgTDUzLjg1IDMzLjU1IDYwLjUgMjcuMTUiLz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGQ0MwMCIgZD0iTTQ0LjE1IDE5IFE0Ny43IDIyIDQ4IDI1Ljk1IEw0OCAyNi4wNSBRNDcuNyAzMCA0NC4yIDMyLjkgTDQ0IDMzLjA1IFEzOS4wNSAzNyAzMiAzNyAyNC44NSAzNyAxOS44IDMyLjk1IEwxOS43IDMyLjkgUTE2LjMgMzAgMTYgMjYuMSBMMTYgMjYuMDUgUTE2LjI1IDIyIDE5Ljg1IDE5IEwxOS45NSAxOC45IFEyNSAxNSAzMiAxNSAzOS4xNSAxNSA0NC4yIDE5IEw0NC4xNSAxOSBNMzkuNzUgNTQuMjUgUTM2LjU1IDU2IDMyIDU2IDI3LjUgNTYgMjQuMjUgNTQuMjUgMjEgNTIuNSAyMSA1MCBMMjEgNDcuOSBRMTcuOCA0Ni41NSAxNSA0NC4zIDggMzguNyA4IDMwLjY1IEw4IDMwLjEgOCAyOS41NSA4IDI5IDggMjguNSA4IDI4LjEgOCAyNy45NSA4IDI3LjQgUTggMTkuNCAxNSAxMy42NSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxMy42NSBMNTAuODUgMTUuMzUgUTUwIDE1LjY1IDQ5LjQgMTYuMyA0OC40IDE3LjMgNDguMSAxOC41NSBMNDYuNTUgMTcuMSBRNDAuNTUgMTIuMyAzMiAxMi4zIDIzLjQ1IDEyLjMgMTcuNCAxNy4xIEwxNy40NSAxNy4xIFExMi4xNSAyMS40IDEyIDI3LjQgMTIuMSAzMy40NSAxNy40IDM3LjY1IDIzLjQ1IDQyLjUgMzIgNDIuNSA0MC41NSA0Mi41IDQ2LjU1IDM3LjcgTDQ2LjYgMzcuNjUgNDkuMDUgMzUuMyA0OS41IDM1Ljc1IFE1MC43NSAzNyA1Mi42NSAzNyA1My45NSAzNyA1NSAzNi40IDUzLjM1IDQwLjggNDguOTUgNDQuMyA0Ni4yIDQ2LjU1IDQzIDQ3LjkgTDQzIDUwIFE0MyA1Mi41IDM5Ljc1IDU0LjI1IE0zMi41IDIwIFEzMCAyMCAyOC4yNSAyMS43NSAyNi41IDIzLjUgMjYuNSAyNiAyNi41IDI4LjUgMjguMjUgMzAuMjUgMzAgMzIgMzIuNSAzMiAzNSAzMiAzNi43NSAzMC4yNSBMMzQuNjUgMjguMTUgUTMzLjc1IDI5IDMyLjUgMjkgMzEuMjUgMjkgMzAuNCAyOC4xNSAyOS41IDI3LjI1IDI5LjUgMjYgMjkuNSAyNC43NSAzMC40IDIzLjkgMzEuMjUgMjMgMzIuNSAyMyAzMy43NSAyMyAzNC42NSAyMy45IEwzNi43NSAyMS43NSBRMzUgMjAgMzIuNSAyMCIvPgogICAgPHBhdGggc3Ryb2tlPSJub25lIiBmaWxsPSIjRkZGRkZGIiBkPSJNNjAuNSAyNy4xNSBMNTMuODUgMzMuNTUgNTIuNjUgMzQgUTUxLjk1IDM0IDUxLjUgMzMuNTUgNTEgMzMuMSA1MSAzMi40IEw1MSAxOS42IFE1MSAxOC45NSA1MS41IDE4LjQ1IDUxLjk1IDE4IDUyLjY1IDE4IEw1My4xIDE4LjA1IFE1My41IDE4LjE1IDUzLjg1IDE4LjQ1IEw2MC41IDI0Ljg1IFE2MSAyNS4zNSA2MSAyNiA2MSAyNi43IDYwLjUgMjcuMTUiLz4KICA8L2c+Cjwvc3ZnPg==',
  gc__gamecube_stick_c_color_up: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwIiBkPSJNMjUuNiAxNSBRMjMuOSAxNSAyMi43NSAxNCBMMjIuMjUgMTMuNSBRMjEgMTIuMjUgMjEgMTAuMzUgTDIxIDEwLjEgUTIxLjEgOC40IDIyLjI1IDcuMTUgTDIyLjMgNy4wNSAyOC43IDAuNCBRMzAgLTEgMzIgLTEgMzMuODUgLTEuMDUgMzUuMyAwLjM1IEwzNS4zIDAuNCA0MS43IDcuMDUgNDEuOCA3LjE1IFE0Mi45IDguNCA0MyAxMC4xIEw0MyAxMC4zNSBRNDMgMTIuMzUgNDEuNyAxMy42IEw0MS4zIDE0IFE0MCAxNS4wNSAzOC40IDE1IEwyNS42IDE1IE0zMC44NSAyLjUgTDI0LjQ1IDkuMTUgUTI0IDkuNjUgMjQgMTAuMzUgMjQgMTEuMDUgMjQuNDUgMTEuNSAyNC45IDEyIDI1LjYgMTIgTDM4LjQgMTIgUTM5LjA1IDEyIDM5LjU1IDExLjUgNDAgMTEuMDUgNDAgMTAuMzUgNDAgOS42NSAzOS41NSA5LjE1IEwzMy4xNSAyLjUgUTMyLjY1IDIgMzIgMiAzMS4zIDIgMzAuODUgMi41Ii8+CiAgICA8cGF0aCBzdHJva2U9Im5vbmUiIGZpbGw9IiNGRkNDMDAiIGQ9Ik00MyA1MCBRNDMgNTIuNSAzOS43NSA1NC4yNSAzNi41NSA1NiAzMiA1NiAyNy41IDU2IDI0LjI1IDU0LjI1IDIxIDUyLjUgMjEgNTAgTDIxIDQ3LjkgUTE3LjggNDYuNTUgMTUgNDQuMyA4IDM4LjcgOCAzMC42NSBMOCAzMC4xIDggMjkuNTUgOCAyOSA4IDI4LjUgOCAyOC4xIDggMjcuOTUgOCAyNy40IFE4IDE5LjQgMTUgMTMuNjUgMTcuOCAxMS40IDIxIDEwLjEgTDIxIDEwLjM1IFEyMSAxMi4yNSAyMi4yNSAxMy41IEwyMi43NSAxNCBRMTkuODUgMTUuMTUgMTcuNCAxNy4xIEwxNy40NSAxNy4xIFExMi4xNSAyMS40IDEyIDI3LjQgMTIuMSAzMy40NSAxNy40IDM3LjY1IDIzLjQ1IDQyLjUgMzIgNDIuNSA0MC41NSA0Mi41IDQ2LjU1IDM3LjcgTDQ2LjYgMzcuNjUgUTUxLjkgMzMuNCA1MiAyNy40IDUxLjg1IDIxLjQgNDYuNTUgMTcuMSA0NC4xIDE1LjE1IDQxLjMgMTQgTDQxLjcgMTMuNiBRNDMgMTIuMzUgNDMgMTAuMzUgTDQzIDEwLjEgUTQ2LjIgMTEuNCA0OC45NSAxMy42NSA1NiAxOS40IDU2IDI3LjQgTDU2IDI3Ljk1IDU2IDI4LjEgNTYgMjguNSA1NiAyOSA1NiAyOS41NSA1NiAzMC4xIDU2IDMwLjY1IFE1NiAzOC43IDQ4Ljk1IDQ0LjMgNDYuMiA0Ni41NSA0MyA0Ny45IEw0MyA1MCBNNDQuMTUgMTkgUTQ3LjcgMjIgNDggMjUuOTUgTDQ4IDI2LjA1IFE0Ny43IDMwIDQ0LjIgMzIuOSBMNDQgMzMuMDUgUTM5LjA1IDM3IDMyIDM3IDI0Ljg1IDM3IDE5LjggMzIuOTUgTDE5LjcgMzIuOSBRMTYuMyAzMCAxNiAyNi4xIEwxNiAyNi4wNSBRMTYuMjUgMjIgMTkuODUgMTkgTDE5Ljk1IDE4LjkgUTI0LjcgMTUuMiAzMS4yIDE1IEwzMi44IDE1IFEzOS40NSAxNS4yNSA0NC4yIDE5IEw0NC4xNSAxOSBNMzIuNSAyMCBRMzAgMjAgMjguMjUgMjEuNzUgMjYuNSAyMy41IDI2LjUgMjYgMjYuNSAyOC41IDI4LjI1IDMwLjI1IDMwIDMyIDMyLjUgMzIgMzUgMzIgMzYuNzUgMzAuMjUgTDM0LjY1IDI4LjE1IFEzMy43NSAyOSAzMi41IDI5IDMxLjI1IDI5IDMwLjQgMjguMTUgMjkuNSAyNy4yNSAyOS41IDI2IDI5LjUgMjQuNzUgMzAuNCAyMy45IDMxLjI1IDIzIDMyLjUgMjMgMzMuNzUgMjMgMzQuNjUgMjMuOSBMMzYuNzUgMjEuNzUgUTM1IDIwIDMyLjUgMjAiLz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTMwLjg1IDIuNSBRMzEuMyAyIDMyIDIgMzIuNjUgMiAzMy4xNSAyLjUgTDM5LjU1IDkuMTUgUTQwIDkuNjUgNDAgMTAuMzUgNDAgMTEuMDUgMzkuNTUgMTEuNSAzOS4wNSAxMiAzOC40IDEyIEwyNS42IDEyIFEyNC45IDEyIDI0LjQ1IDExLjUgMjQgMTEuMDUgMjQgMTAuMzUgMjQgOS42NSAyNC40NSA5LjE1IEwzMC44NSAyLjUiLz4KICA8L2c+Cjwvc3ZnPg==',
  gc__gamecube_trigger_l: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTI3IDI1IEwyNyA0MiAzOSA0MiAzOSAzOCAzMSAzOCAzMSAyNSAyNyAyNSBNMzEuMzUgMTAgTDMyLjY1IDEwIFE0Mi4xNSAxMC4yIDQ4Ljk1IDE3IDU1LjY1IDIzLjcgNTYgMzIuOTUgTDU2IDQ2IFE1NiA1NCA0OCA1NCBMMTYgNTQgUTggNTQgOCA0NiBMOCAzMi45NSBROC4zNSAyMy43IDE1LjA1IDE3IDIxLjg1IDEwLjIgMzEuMzUgMTAiLz4KICA8L2c+Cjwvc3ZnPg==',
  gc__gamecube_trigger_r: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTMxLjM1IDEwIEwzMi42NSAxMCBRNDIuMTUgMTAuMiA0OC45NSAxNyA1NS42NSAyMy43IDU2IDMyLjk1IEw1NiA0NiBRNTYgNTQgNDggNTQgTDE2IDU0IFE4IDU0IDggNDYgTDggMzIuOTUgUTguMzUgMjMuNyAxNS4wNSAxNyAyMS44NSAxMC4yIDMxLjM1IDEwIE0yNiAyNSBMMjYgNDIgMzAgNDIgMzAgMzcgMzMgMzcgMzUuNSA0MiAzOS41IDQyIDM2LjQ1IDM1LjkgMzcuMiAzNS4yNSAzNy4yNSAzNS4yIDM4LjIgMzQgUTM5IDMyLjY1IDM5IDMxIDM5IDI4LjUgMzcuMjUgMjYuNzUgTDM2LjM1IDI2IFEzNC45IDI1IDMzIDI1IEwyNiAyNSBNMzMgMjkgUTMzLjggMjkgMzQuNCAyOS42IDM1IDMwLjIgMzUgMzEgMzUgMzEuOCAzNC40NSAzMi4zNSBMMzQuMzUgMzIuNDUgUTMzLjggMzMgMzMgMzMgTDMwIDMzIDMwIDI5IDMzIDI5Ii8+CiAgPC9nPgo8L3N2Zz4=',
  ps__playstation_button_color_circle: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGNjY2NiIgZD0iTTM3LjcgMjYuMzUgUTQwIDI4LjY1IDQwIDMyIDQwIDM1LjM1IDM3LjcgMzcuNyAzNS4zNSA0MCAzMiA0MCAyOC43IDQwIDI2LjQgMzcuNyBMMjYuMzUgMzcuNjUgUTI0IDM1LjMgMjQgMzIgMjQgMjguNyAyNi4zNSAyNi4zNSBMMjYuNCAyNi4zNSBRMjguNyAyNCAzMiAyNCAzNS4zNSAyNCAzNy43IDI2LjM1IE00NCAzMiBRNDQgMjcgNDAuNSAyMy41IDM3IDIwIDMyIDIwIDI3LjA1IDIwIDIzLjU1IDIzLjUgMjAgMjcgMjAgMzIgMjAgMzcgMjMuNTUgNDAuNSAyNy4wNSA0NCAzMiA0NCAzNyA0NCA0MC41IDQwLjUgNDQgMzcgNDQgMzIgTTU2IDMyIFE1NiA0MiA0OC45NSA0OC45NSA0MiA1NiAzMiA1NiAyMi4wNSA1NiAxNSA0OC45NSA4IDQyIDggMzIgOCAyMi4wNSAxNSAxNSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxNSA1NiAyMi4wNSA1NiAzMiIvPgogIDwvZz4KPC9zdmc+',
  ps__playstation_button_color_cross: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iIzdDNjZFOCIgZD0iTTIyLjggMjAgTDIwIDIyLjggMjkuMiAzMiAyMCA0MS4yIDIyLjggNDQgMzIgMzQuOCA0MS4yIDQ0IDQ0IDQxLjIgMzQuOCAzMiA0NCAyMi44IDQxLjIgMjAgMzIgMjkuMiAyMi44IDIwIE01NiAzMiBRNTYgNDIgNDguOTUgNDguOTUgNDIgNTYgMzIgNTYgMjIuMDUgNTYgMTUgNDguOTUgOCA0MiA4IDMyIDggMjIuMDUgMTUgMTUgMjIuMDUgOCAzMiA4IDQyIDggNDguOTUgMTUgNTYgMjIuMDUgNTYgMzIiLz4KICA8L2c+Cjwvc3ZnPg==',
  ps__playstation_button_color_square: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGNjlGOCIgZD0iTTU2IDMyIFE1NiA0MiA0OC45NSA0OC45NSA0MiA1NiAzMiA1NiAyMi4wNSA1NiAxNSA0OC45NSA4IDQyIDggMzIgOCAyMi4wNSAxNSAxNSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxNSA1NiAyMi4wNSA1NiAzMiBNMjAgMjAgTDIwIDQ0IDQ0IDQ0IDQ0IDIwIDIwIDIwIE0yNCA0MCBMMjQgMjQgNDAgMjQgNDAgNDAgMjQgNDAiLz4KICA8L2c+Cjwvc3ZnPg==',
  ps__playstation_button_color_triangle: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iIzQwRTJBMCIgZD0iTTU2IDMyIFE1NiA0MiA0OC45NSA0OC45NSA0MiA1NiAzMiA1NiAyMi4wNSA1NiAxNSA0OC45NSA4IDQyIDggMzIgOCAyMi4wNSAxNSAxNSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxNSA1NiAyMi4wNSA1NiAzMiBNNDYgNDIgTDMyIDE4IDE4IDQyIDQ2IDQyIE0zMiAyNS45NSBMMzkuMDUgMzggMjUgMzggMzIgMjUuOTUiLz4KICA8L2c+Cjwvc3ZnPg==',
  ps__playstation_trigger_l1_alternative: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTU2IDIwIEw1NiA0MCBRNTYgNDQuOTUgNDkgNDguNSA0MS45NSA1MiAzMiA1MiAyMi4wNSA1MiAxNS4wNSA0OC41IDggNDQuOTUgOCA0MCBMOCAyMCBROCAxMiAxNiAxMiBMNDggMTIgUTU2IDEyIDU2IDIwIE0yMiAyMyBMMjIgNDAgMzQgNDAgMzQgMzYgMjYgMzYgMjYgMjMgMjIgMjMgTTQyIDIzIEwzOCAyMyAzNSAyNiAzNSAyNy45NSAzOCAyNy45NSAzOCAzMi44NSAzOCAzMi45NSAzOCA0MCA0MiA0MCA0MiAyMyIvPgogIDwvZz4KPC9zdmc+',
  ps__playstation_trigger_l2_alternative: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTE5IDI0IEwxOSA0MSAzMSA0MSAzMSAzNyAyMyAzNyAyMyAyNCAxOSAyNCBNNTYgNDQgUTU2IDUyIDQ4IDUyIEwxNiA1MiBROCA1MiA4IDQ0IEw4IDI0IFE4IDE5LjA1IDE1LjA1IDE1LjUgMjIuMDUgMTIgMzIgMTIgNDEuOTUgMTIgNDkgMTUuNSA1NiAxOS4wNSA1NiAyNCBMNTYgNDQgTTQwLjUgMjguNCBRNDEuMjUgMjkuMTUgNDAgMzAuNDUgTDMzIDM3IDMzIDQxIDM3Ljg1IDQxIDM3Ljk1IDQxIDQ1IDQxIDQ1IDM3IDM5IDM3IDQzLjQ1IDMyLjU1IFE0NS42NSAzMC4zNSA0NC40IDI3IEw0My40IDI1LjY1IDQzLjM1IDI1LjYgUTQxLjc1IDI0IDM5LjUgMjQgTDM3Ljg1IDI0IFEzNS45IDI0LjA1IDM0LjUgMjUuNCBMMzQuNCAyNS41IFEzMy4zNSAyNi42IDMzLjEgMjggTDMzIDI5IDM3IDI5IFEzNyAyOC42IDM3LjMgMjguMyAzNy41NSAyOC4wNSAzNy44NSAyOCBMMzcuOTUgMjggMzkuNSAyOCBRNDAuMSAyOCA0MC41IDI4LjQiLz4KICA8L2c+Cjwvc3ZnPg==',
  ps__playstation_trigger_r1_alternative: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTU2IDIwIEw1NiA0MCBRNTYgNDQuOTUgNDkgNDguNSA0MS45NSA1MiAzMiA1MiAyMi4wNSA1MiAxNS4wNSA0OC41IDggNDQuOTUgOCA0MCBMOCAyMCBROCAxMiAxNiAxMiBMNDggMTIgUTU2IDEyIDU2IDIwIE0yMSAyMyBMMjEgNDAgMjUgNDAgMjUgMzUgMjggMzUgMzAuNSA0MCAzNC41IDQwIDMxLjQ1IDMzLjkgMzIuMiAzMy4yNSAzMi4yNSAzMy4yIFEzNCAzMS40NSAzNCAyOSAzNCAyNi41IDMyLjI1IDI0Ljc1IDMwLjUgMjMgMjggMjMgTDIxIDIzIE00MyAyMyBMMzkgMjMgMzYgMjYgMzYgMjcuOTUgMzkgMjcuOTUgMzkgMzIuODUgMzkgMzIuOTUgMzkgNDAgNDMgNDAgNDMgMjMgTTI4IDI3IFEyOC44IDI3IDI5LjQgMjcuNiAzMCAyOC4yIDMwIDI5IDMwIDI5LjggMjkuNDUgMzAuMzUgTDI5LjM1IDMwLjQ1IFEyOC44IDMxIDI4IDMxIEwyNSAzMSAyNSAyNyAyOCAyNyIvPgogIDwvZz4KPC9zdmc+',
  ps__playstation_trigger_r2_alternative: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTU2IDQ0IFE1NiA1MiA0OCA1MiBMMTYgNTIgUTggNTIgOCA0NCBMOCAyNCBROCAxOS4wNSAxNS4wNSAxNS41IDIyLjA1IDEyIDMyIDEyIDQxLjk1IDEyIDQ5IDE1LjUgNTYgMTkuMDUgNTYgMjQgTDU2IDQ0IE00MS41IDI4LjQgUTQyLjI1IDI5LjE1IDQxIDMwLjQ1IEwzNCAzNyAzNCA0MSAzOC44NSA0MSAzOC45NSA0MSA0NiA0MSA0NiAzNyA0MCAzNyA0NC40NSAzMi41NSBRNDYuNjUgMzAuMzUgNDUuNCAyNyBMNDQuNCAyNS42NSA0NC4zNSAyNS42IFE0Mi43NSAyNCA0MC41IDI0IEwzOC44NSAyNCBRMzYuOSAyNC4wNSAzNS41IDI1LjQgTDM1LjQgMjUuNSBRMzQuMzUgMjYuNiAzNC4xIDI4IEwzNCAyOSAzOCAyOSBRMzggMjguNiAzOC4zIDI4LjMgTDM4Ljg1IDI4IDM4Ljk1IDI4IDQwLjUgMjggUTQxLjEgMjggNDEuNSAyOC40IE0yNSAyOCBRMjUuOCAyOCAyNi40IDI4LjYgMjcgMjkuMiAyNyAzMCAyNyAzMC44IDI2LjQ1IDMxLjM1IEwyNi4zNSAzMS40NSBRMjUuOCAzMiAyNSAzMiBMMjIgMzIgMjIgMjggMjUgMjggTTE4IDI0IEwxOCA0MSAyMiA0MSAyMiAzNiAyNSAzNiAyNy41IDQxIDMxLjUgNDEgMjguNDUgMzQuOSAyOS4yIDM0LjI1IDI5LjI1IDM0LjIgUTMxIDMyLjQ1IDMxIDMwIDMxIDI3LjUgMjkuMjUgMjUuNzUgMjcuNSAyNCAyNSAyNCBMMTggMjQiLz4KICA8L2c+Cjwvc3ZnPg==',
  ps__playstation4_button_options: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTEwLjg1IDEwLjggTDEwLjkgMTAuNzUgUTExLjc1IDEwIDEzIDEwIDE0LjE1IDEwIDE1LjA1IDEwLjc1IEwxNS4xIDEwLjggUTE2IDExLjY1IDE2IDEyLjggTDE2IDE3LjI1IFExNiAxOC4zNSAxNS4xIDE5LjI1IEwxNS4wNSAxOS4zIFExNC4xNSAyMCAxMyAyMCAxMS43NSAyMCAxMC45IDE5LjMgTDEwLjg1IDE5LjIgUTEwIDE4LjM1IDEwIDE3LjI1IEwxMCAxMi44IFExMCAxMS42NSAxMC44NSAxMC44IE0xMiAxMi44IEwxMiAxNy4yNSAxMi4yIDE3Ljc1IDEzIDE4IDEzLjc1IDE3Ljc1IDEzLjc1IDE3LjggMTQgMTcuMjUgMTQgMTIuOCAxMy43NSAxMi4yNSAxMy43NSAxMi4zIFExMy40NSAxMiAxMyAxMiAxMi41NSAxMiAxMi4yIDEyLjMgTDEyLjI1IDEyLjIgMTIgMTIuOCBNMjAuMSAxNCBMMjAuNDUgMTMuOSAyMC43IDEzLjcgMjAuNzUgMTMuNyAyMSAxMyAyMC43IDEyLjI1IFEyMC40NSAxMiAyMC4wNSAxMiBMMTkgMTIgMTkgMTQgMjAuMSAxNCBNMTkgMTkgTDE4LjcgMTkuNyBRMTguNCAyMCAxOCAyMCBMMTcuMyAxOS43IFExNyAxOS40IDE3IDE5IEwxNyAxMSBRMTcgMTAuNiAxNy4zIDEwLjMgMTcuNiAxMCAxOCAxMCBMMjAuMDUgMTAgUTIxLjI1IDEwIDIyLjEgMTAuODUgMjMgMTEuNzUgMjMgMTMgMjMgMTQuMjUgMjIuMSAxNS4xIEwyMi4xIDE1LjE1IDIxLjQ1IDE1LjY1IDIxLjM1IDE1LjcgMjAuMSAxNiAxOSAxNiAxOSAxOSBNMjUgMTIgTDI0LjMgMTEuNyBRMjQgMTEuNCAyNCAxMSAyNCAxMC42IDI0LjMgMTAuMyAyNC42IDEwIDI1IDEwIEwyOSAxMCAyOS43IDEwLjMgMzAgMTEgMjkuNyAxMS43IDI5IDEyIDI4IDEyIDI4IDE5IDI3LjcgMTkuNyBRMjcuNCAyMCAyNyAyMCBMMjYuMyAxOS43IDI2IDE5IDI2IDEyIDI1IDEyIE0zNiAxMi44IEwzNiAxNy4yNSAzNi4yIDE3Ljc1IDM3IDE4IDM3Ljc1IDE3Ljc1IDM3Ljc1IDE3LjggMzggMTcuMjUgMzggMTIuOCAzNy43NSAxMi4yNSAzNy43NSAxMi4zIFEzNy40NSAxMiAzNyAxMiAzNi41NSAxMiAzNi4yIDEyLjMgTDM2LjI1IDEyLjIgMzYgMTIuOCBNMzQuODUgMTAuOCBMMzQuOSAxMC43NSBRMzUuNzUgMTAgMzcgMTAgMzguMTUgMTAgMzkuMDUgMTAuNzUgTDM5LjEgMTAuOCBRNDAgMTEuNjUgNDAgMTIuOCBMNDAgMTcuMjUgUTQwIDE4LjM1IDM5LjEgMTkuMjUgTDM5LjA1IDE5LjMgUTM4LjE1IDIwIDM3IDIwIDM1Ljc1IDIwIDM0LjkgMTkuMyBMMzQuODUgMTkuMiBRMzQgMTguMzUgMzQgMTcuMjUgTDM0IDEyLjggUTM0IDExLjY1IDM0Ljg1IDEwLjggTTMzIDE5IEwzMi43IDE5LjcgMzIgMjAgUTMxLjYgMjAgMzEuMyAxOS43IDMxIDE5LjQgMzEgMTkgTDMxIDExIFEzMSAxMC42IDMxLjMgMTAuMyAzMS42IDEwIDMyIDEwIDMyLjQgMTAgMzIuNyAxMC4zIEwzMyAxMSAzMyAxOSBNNDcgMTkgTDQ2LjggMTkuNjUgNDYuMjUgMjAgNDUuNiAxOS45IDQ1LjEgMTkuNDUgNDMgMTUuMjUgNDMgMTkgNDIuNyAxOS43IDQyIDIwIDQxLjMgMTkuNyBRNDEgMTkuNCA0MSAxOSBMNDEgMTEgUTQxIDEwLjY1IDQxLjI1IDEwLjQgTDQxLjggMTAuMDUgNDIuNDUgMTAuMSA0Mi45IDEwLjU1IDQ1IDE0Ljc1IDQ1IDExIFE0NSAxMC42IDQ1LjMgMTAuMyA0NS42IDEwIDQ2IDEwIDQ2LjQgMTAgNDYuNyAxMC4zIEw0NyAxMSA0NyAxOSBNNTEgMTIgUTUwLjYgMTIgNTAuMyAxMi4zIDUwIDEyLjYgNTAgMTMgNTAgMTMuNCA1MC4zIDEzLjcgTDUwLjk1IDE0IDUxLjA1IDE0IFE1Mi4yIDE0IDUzLjEgMTQuOSA1NCAxNS44IDU0IDE3IDU0IDE4LjIgNTMuMSAxOS4xIDUyLjIgMjAgNTEgMjAgTDQ5IDIwIFE0OC42IDIwIDQ4LjMgMTkuNyA0OCAxOS40IDQ4IDE5IDQ4IDE4LjYgNDguMyAxOC4zIDQ4LjYgMTggNDkgMTggTDUxIDE4IFE1MS40IDE4IDUxLjcgMTcuNyBMNTIgMTcgNTEuNyAxNi4zIFE1MS40IDE2IDUxLjA1IDE2IEw1MC45NSAxNiBRNDkuOCAxNiA0OC45IDE1LjEgNDggMTQuMiA0OCAxMyA0OCAxMS44IDQ4LjkgMTAuOSA0OS44IDEwIDUxIDEwIEw1MyAxMCBRNTMuNCAxMCA1My43IDEwLjMgTDU0IDExIDUzLjcgMTEuNyA1MyAxMiA1MSAxMiBNMzIgMjYgUTM1LjMgMjYgMzcuNjUgMjguMzUgNDAgMzAuNyA0MCAzNCBMNDAgNDYgMzkuODUgNDcuNiBRMzkuNCA0OS45IDM3LjY1IDUxLjY1IDM1LjMgNTQgMzIgNTQgMjguNyA1NCAyNi4zNSA1MS42NSAyNC42IDQ5LjkgMjQuMTUgNDcuNiBMMjQgNDYgMjQgMzQgUTI0IDMwLjcgMjYuMzUgMjguMzUgMjguNyAyNiAzMiAyNiIvPgogIDwvZz4KPC9zdmc+',
  ps__playstation4_button_share: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTI4IDE5IEwyNy43IDE5LjcgUTI3LjQgMjAgMjcgMjAgTDI2LjMgMTkuNyAyNiAxOSAyNiAxNiAyNCAxNiAyNCAxOSAyMy43IDE5LjcgMjMgMjAgUTIyLjYgMjAgMjIuMyAxOS43IDIyIDE5LjQgMjIgMTkgTDIyIDExIFEyMiAxMC42IDIyLjMgMTAuMyAyMi42IDEwIDIzIDEwIDIzLjQgMTAgMjMuNyAxMC4zIEwyNCAxMSAyNCAxNCAyNiAxNCAyNiAxMSBRMjYgMTAuNiAyNi4zIDEwLjMgMjYuNiAxMCAyNyAxMCAyNy40IDEwIDI3LjcgMTAuMyBMMjggMTEgMjggMTkgTTE4IDEyIFExNy42IDEyIDE3LjMgMTIuMyAxNyAxMi42IDE3IDEzIDE3IDEzLjQgMTcuMyAxMy43IDE3LjYgMTQgMTcuOTUgMTQgTDE4LjA1IDE0IFExOS4yIDE0IDIwLjEgMTQuOSAyMSAxNS44IDIxIDE3IDIxIDE4LjIgMjAuMSAxOS4xIDE5LjIgMjAgMTggMjAgTDE2IDIwIDE1LjMgMTkuNyBRMTUgMTkuNCAxNSAxOSAxNSAxOC42IDE1LjMgMTguMyAxNS42IDE4IDE2IDE4IEwxOCAxOCBRMTguNCAxOCAxOC43IDE3LjcgTDE5IDE3IDE4LjcgMTYuMyBRMTguNCAxNiAxOC4wNSAxNiBMMTcuOTUgMTYgUTE2LjggMTYgMTUuOSAxNS4xIDE1IDE0LjIgMTUgMTMgMTUgMTEuOCAxNS45IDEwLjkgMTYuOCAxMCAxOCAxMCBMMjAgMTAgUTIwLjQgMTAgMjAuNyAxMC4zIEwyMSAxMSAyMC43IDExLjcgMjAgMTIgMTggMTIgTTM5LjEgMTQgTDM5LjQ1IDEzLjkgMzkuNyAxMy43IDM5Ljc1IDEzLjcgNDAgMTMgMzkuNyAxMi4yNSBRMzkuNDUgMTIgMzkuMDUgMTIgTDM4IDEyIDM4IDE0IDM5LjEgMTQgTTI5IDEyLjggUTI5IDExLjY1IDI5Ljg1IDEwLjggTDI5LjkgMTAuNzUgUTMwLjc1IDEwIDMyIDEwIDMzLjE1IDEwIDM0LjA1IDEwLjc1IEwzNC4xIDEwLjggUTM1IDExLjY1IDM1IDEyLjggTDM1IDE5IDM0LjcgMTkuNyBRMzQuNCAyMCAzNCAyMCBMMzMuMyAxOS43IFEzMyAxOS40IDMzIDE5IEwzMyAxNyAzMSAxNyAzMSAxOSAzMC43IDE5LjcgUTMwLjQgMjAgMzAgMjAgTDI5LjMgMTkuNyBRMjkgMTkuNCAyOSAxOSBMMjkgMTIuOCBNMzEgMTIuOCBMMzEgMTUgMzMgMTUgMzMgMTIuOCAzMi43NSAxMi4yNSAzMi43NSAxMi4zIFEzMi40NSAxMiAzMiAxMiAzMS41NSAxMiAzMS4yIDEyLjMgTDMxLjI1IDEyLjIgUTMxIDEyLjQ1IDMxIDEyLjggTTQxLjEgMTUuMSBMNDEuMSAxNS4xNSA0MC40NSAxNS42NSA0MS45IDE4LjU1IDQxLjk1IDE5LjM1IDQxLjQ1IDE5LjkgNDAuNyAxOS45NSBRNDAuMyAxOS44IDQwLjEgMTkuNDUgTDM4LjQgMTYgMzggMTYgMzggMTkgMzcuNyAxOS43IDM3IDIwIDM2LjMgMTkuNyBRMzYgMTkuNCAzNiAxOSBMMzYgMTEgUTM2IDEwLjYgMzYuMyAxMC4zIDM2LjYgMTAgMzcgMTAgTDM5LjA1IDEwIFE0MC4yNSAxMCA0MS4xIDEwLjg1IDQyIDExLjc1IDQyIDEzIDQyIDE0LjI1IDQxLjEgMTUuMSBNNDMgMTEgUTQzIDEwLjYgNDMuMyAxMC4zIDQzLjYgMTAgNDQgMTAgTDQ4IDEwIFE0OC40IDEwIDQ4LjcgMTAuMyBMNDkgMTEgNDguNyAxMS43IFE0OC40IDEyIDQ4IDEyIEw0NSAxMiA0NSAxNCA0OCAxNCBRNDguNCAxNCA0OC43IDE0LjMgTDQ5IDE1IDQ4LjcgMTUuNyBRNDguNCAxNiA0OCAxNiBMNDUgMTYgNDUgMTggNDggMTggUTQ4LjQgMTggNDguNyAxOC4zIEw0OSAxOSA0OC43IDE5LjcgUTQ4LjQgMjAgNDggMjAgTDQ0IDIwIFE0My42IDIwIDQzLjMgMTkuNyA0MyAxOS40IDQzIDE5IEw0MyAxMSBNMzIgMjYgUTM1LjMgMjYgMzcuNjUgMjguMzUgNDAgMzAuNyA0MCAzNCBMNDAgNDYgUTQwIDQ5LjMgMzcuNjUgNTEuNjUgMzUuMyA1NCAzMiA1NCAyOC43IDU0IDI2LjM1IDUxLjY1IDI0IDQ5LjMgMjQgNDYgTDI0IDM0IFEyNCAzMC43IDI2LjM1IDI4LjM1IDI4LjcgMjYgMzIgMjYiLz4KICA8L2c+Cjwvc3ZnPg==',
  ps__playstation4_touchpad: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTUwIDMyIFE1MCAzMS4xNSA0OS40IDMwLjU1IDQ4Ljg1IDMwIDQ4IDMwIDQ3LjE1IDMwIDQ2LjU1IDMwLjU1IDQ2IDMxLjE1IDQ2IDMyIDQ2IDMyLjg1IDQ2LjU1IDMzLjQgNDcuMTUgMzQgNDggMzQgNDguODUgMzQgNDkuNCAzMy40IDUwIDMyLjg1IDUwIDMyIE01MCAyNCBRNTAgMjMuMTUgNDkuNCAyMi41NSA0OC44NSAyMiA0OCAyMiA0Ny4xNSAyMiA0Ni41NSAyMi41NSA0NiAyMy4xNSA0NiAyNCA0NiAyNC44NSA0Ni41NSAyNS40IDQ3LjE1IDI2IDQ4IDI2IDQ4Ljg1IDI2IDQ5LjQgMjUuNCA1MCAyNC44NSA1MCAyNCBNNDIgMzIgUTQyIDMxLjE1IDQxLjQgMzAuNTUgNDAuODUgMzAgNDAgMzAgMzkuMTUgMzAgMzguNTUgMzAuNTUgMzggMzEuMTUgMzggMzIgMzggMzIuODUgMzguNTUgMzMuNCAzOS4xNSAzNCA0MCAzNCA0MC44NSAzNCA0MS40IDMzLjQgNDIgMzIuODUgNDIgMzIgTTM0IDMyIFEzNCAzMS4xNSAzMy40IDMwLjU1IDMyLjg1IDMwIDMyIDMwIDMxLjE1IDMwIDMwLjU1IDMwLjU1IDMwIDMxLjE1IDMwIDMyIDMwIDMyLjg1IDMwLjU1IDMzLjQgMzEuMTUgMzQgMzIgMzQgMzIuODUgMzQgMzMuNCAzMy40IDM0IDMyLjg1IDM0IDMyIE0zNCAyNCBRMzQgMjMuMTUgMzMuNCAyMi41NSAzMi44NSAyMiAzMiAyMiAzMS4xNSAyMiAzMC41NSAyMi41NSAzMCAyMy4xNSAzMCAyNCAzMCAyNC44NSAzMC41NSAyNS40IDMxLjE1IDI2IDMyIDI2IDMyLjg1IDI2IDMzLjQgMjUuNCAzNCAyNC44NSAzNCAyNCBNNDIgMjQgUTQyIDIzLjE1IDQxLjQgMjIuNTUgNDAuODUgMjIgNDAgMjIgMzkuMTUgMjIgMzguNTUgMjIuNTUgMzggMjMuMTUgMzggMjQgMzggMjQuODUgMzguNTUgMjUuNCAzOS4xNSAyNiA0MCAyNiA0MC44NSAyNiA0MS40IDI1LjQgNDIgMjQuODUgNDIgMjQgTTE2IDE2IEw0OCAxNiBRNTYgMTYgNTYgMjQgTDU2IDQwIFE1NiA0OCA0OCA0OCBMMTYgNDggUTggNDggOCA0MCBMOCAyNCBROCAxNiAxNiAxNiBNMTggNDAgUTE4IDM5LjE1IDE3LjQgMzguNTUgMTYuODUgMzggMTYgMzggMTUuMTUgMzggMTQuNTUgMzguNTUgMTQgMzkuMTUgMTQgNDAgMTQgNDAuODUgMTQuNTUgNDEuNCAxNS4xNSA0MiAxNiA0MiAxNi44NSA0MiAxNy40IDQxLjQgMTggNDAuODUgMTggNDAgTTI2IDQwIFEyNiAzOS4xNSAyNS40IDM4LjU1IDI0Ljg1IDM4IDI0IDM4IDIzLjE1IDM4IDIyLjU1IDM4LjU1IDIyIDM5LjE1IDIyIDQwIDIyIDQwLjg1IDIyLjU1IDQxLjQgMjMuMTUgNDIgMjQgNDIgMjQuODUgNDIgMjUuNCA0MS40IDI2IDQwLjg1IDI2IDQwIE0yNiAzMiBRMjYgMzEuMTUgMjUuNCAzMC41NSAyNC44NSAzMCAyNCAzMCAyMy4xNSAzMCAyMi41NSAzMC41NSAyMiAzMS4xNSAyMiAzMiAyMiAzMi44NSAyMi41NSAzMy40IDIzLjE1IDM0IDI0IDM0IDI0Ljg1IDM0IDI1LjQgMzMuNCAyNiAzMi44NSAyNiAzMiBNMjYgMjQgUTI2IDIzLjE1IDI1LjQgMjIuNTUgMjQuODUgMjIgMjQgMjIgMjMuMTUgMjIgMjIuNTUgMjIuNTUgMjIgMjMuMTUgMjIgMjQgMjIgMjQuODUgMjIuNTUgMjUuNCAyMy4xNSAyNiAyNCAyNiAyNC44NSAyNiAyNS40IDI1LjQgMjYgMjQuODUgMjYgMjQgTTE4IDMyIFExOCAzMS4xNSAxNy40IDMwLjU1IDE2Ljg1IDMwIDE2IDMwIDE1LjE1IDMwIDE0LjU1IDMwLjU1IDE0IDMxLjE1IDE0IDMyIDE0IDMyLjg1IDE0LjU1IDMzLjQgMTUuMTUgMzQgMTYgMzQgMTYuODUgMzQgMTcuNCAzMy40IDE4IDMyLjg1IDE4IDMyIE0xOCAyNCBRMTggMjMuMTUgMTcuNCAyMi41NSAxNi44NSAyMiAxNiAyMiAxNS4xNSAyMiAxNC41NSAyMi41NSAxNCAyMy4xNSAxNCAyNCAxNCAyNC44NSAxNC41NSAyNS40IDE1LjE1IDI2IDE2IDI2IDE2Ljg1IDI2IDE3LjQgMjUuNCAxOCAyNC44NSAxOCAyNCBNNDIgNDAgUTQyIDM5LjE1IDQxLjQgMzguNTUgNDAuODUgMzggNDAgMzggMzkuMTUgMzggMzguNTUgMzguNTUgMzggMzkuMTUgMzggNDAgMzggNDAuODUgMzguNTUgNDEuNCAzOS4xNSA0MiA0MCA0MiA0MC44NSA0MiA0MS40IDQxLjQgNDIgNDAuODUgNDIgNDAgTTM0IDQwIFEzNCAzOS4xNSAzMy40IDM4LjU1IDMyLjg1IDM4IDMyIDM4IDMxLjE1IDM4IDMwLjU1IDM4LjU1IDMwIDM5LjE1IDMwIDQwIDMwIDQwLjg1IDMwLjU1IDQxLjQgMzEuMTUgNDIgMzIgNDIgMzIuODUgNDIgMzMuNCA0MS40IDM0IDQwLjg1IDM0IDQwIE01MCA0MCBRNTAgMzkuMTUgNDkuNCAzOC41NSA0OC44NSAzOCA0OCAzOCA0Ny4xNSAzOCA0Ni41NSAzOC41NSA0NiAzOS4xNSA0NiA0MCA0NiA0MC44NSA0Ni41NSA0MS40IDQ3LjE1IDQyIDQ4IDQyIDQ4Ljg1IDQyIDQ5LjQgNDEuNCA1MCA0MC44NSA1MCA0MCIvPgogIDwvZz4KPC9zdmc+',
  switch__switch_button_a: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTU2IDMyIFE1NiA0MiA0OC45NSA0OC45NSA0MiA1NiAzMiA1NiAyMi4wNSA1NiAxNSA0OC45NSA4IDQyIDggMzIgOCAyMi4wNSAxNSAxNSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxNSA1NiAyMi4wNSA1NiAzMiBNMzggNDIgTDQyIDQyIDM0IDIyIDMwIDIyIDIyIDQyIDI2IDQyIDI3LjYgMzggMzYuNCAzOCAzOCA0MiBNMzIgMjcgTDM0LjggMzQgMjkuMiAzNCAzMiAyNyIvPgogIDwvZz4KPC9zdmc+',
  switch__switch_button_b: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTU2IDMyIFE1NiA0MiA0OC45NSA0OC45NSA0MiA1NiAzMiA1NiAyMi4wNSA1NiAxNSA0OC45NSA4IDQyIDggMzIgOCAyMi4wNSAxNSAxNSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxNSA1NiAyMi4wNSA1NiAzMiBNMzcgMjggUTM3IDI4Ljg1IDM2LjQ1IDI5LjQgTDM2LjQgMjkuNCBRMzUuOCAzMCAzNSAzMCBMMjkgMzAgMjkgMjYgMzUgMjYgUTM1LjggMjYgMzYuMzUgMjYuNTUgTDM2LjQ1IDI2LjY1IFEzNyAyNy4yIDM3IDI4IE00MSAzNiBRNDEgMzMuNyAzOS41IDMyIDQxIDMwLjMgNDEgMjggNDEgMjUuNTUgMzkuMjUgMjMuOCBMMzkuMiAyMy43NSBRMzcuNDUgMjIgMzUgMjIgTDI1IDIyIDI1IDQyIDM1IDQyIFEzNy40NSA0MiAzOS4yIDQwLjI1IEwzOS4yNSA0MC4yIFE0MSAzOC40NSA0MSAzNiBNMzcgMzYgUTM3IDM2LjggMzYuNDUgMzcuMzUgTDM2LjM1IDM3LjQ1IFEzNS44IDM4IDM1IDM4IEwyOSAzOCAyOSAzNCAzNSAzNCBRMzUuOCAzNCAzNi40IDM0LjYgTDM2LjQ1IDM0LjYgUTM3IDM1LjE1IDM3IDM2Ii8+CiAgPC9nPgo8L3N2Zz4=',
  switch__switch_button_l: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTQ2IDEyIEw0OC4xNSAxMi4yIFE1MC45NSAxMi42NSA1Mi40IDE0LjQ1IDU0IDE2LjQ1IDU0IDIwIEw1NCA0NCBRNTQgNTIgNDYgNTIgTDE4IDUyIFExMCA1MiAxMCA0NCBMMTAgMjggUTEwIDIxLjQgMTQuNyAxNi43IDE5LjQgMTIgMjYgMTIgTDQ2IDEyIE0yNSA0MiBMMzkgNDIgMzkgMzggMjkgMzggMjkgMjIgMjUgMjIgMjUgNDIiLz4KICA8L2c+Cjwvc3ZnPg==',
  switch__switch_button_minus: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTIwIDI5IEwyMCAzNSA0NCAzNSA0NCAyOSAyMCAyOSBNNTYgMzIgUTU2IDQyIDQ4Ljk1IDQ4Ljk1IDQyIDU2IDMyIDU2IDIyLjA1IDU2IDE1IDQ4Ljk1IDggNDIgOCAzMiA4IDIyLjA1IDE1IDE1IDIyLjA1IDggMzIgOCA0MiA4IDQ4Ljk1IDE1IDU2IDIyLjA1IDU2IDMyIi8+CiAgPC9nPgo8L3N2Zz4=',
  switch__switch_button_plus: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTU2IDMyIFE1NiA0MiA0OC45NSA0OC45NSA0MiA1NiAzMiA1NiAyMi4wNSA1NiAxNSA0OC45NSA4IDQyIDggMzIgOCAyMi4wNSAxNSAxNSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxNSA1NiAyMi4wNSA1NiAzMiBNMjkgMjAgTDI5IDI5IDIwIDI5IDIwIDM1IDI5IDM1IDI5IDQ0IDM1IDQ0IDM1IDM1IDQ0IDM1IDQ0IDI5IDM1IDI5IDM1IDIwIDI5IDIwIi8+CiAgPC9nPgo8L3N2Zz4=',
  switch__switch_button_r: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTI0IDIyIEwyNCA0MiAyOCA0MiAyOCAzNiAzNCAzNiAzNC41IDM2IDM2IDQyIDQwIDQyIDM4LjEgMzQuMzUgMzguMiAzNC4yNSAzOC4yNSAzNC4yIFE0MCAzMi40NSA0MCAzMCBMNDAgMjggUTQwIDI1LjUgMzguMjUgMjMuNzUgTDM4LjIgMjMuNyAzNyAyMi44IFEzNS43NSAyMi4wNSAzNC4yIDIyIEwyNCAyMiBNMjggMjYgTDM0IDI2IFEzNC44IDI2IDM1LjQgMjYuNiBMMzUuNDUgMjYuNiBRMzYgMjcuMTUgMzYgMjggTDM2IDMwIFEzNiAzMC44IDM1LjQ1IDMxLjM1IEwzNS4zNSAzMS40NSBRMzQuOCAzMiAzNCAzMiBMMjggMzIgMjggMjYgTTE4IDEyIEwzOCAxMiBRNDQuNiAxMiA0OS4zIDE2LjcgNTQgMjEuNCA1NCAyOCBMNTQgNDQgUTU0IDUyIDQ2IDUyIEwxOCA1MiBRMTAgNTIgMTAgNDQgTDEwIDIwIFExMCAxNi40NSAxMS42IDE0LjQ1IDEzLjA1IDEyLjY1IDE1Ljg1IDEyLjIgTDE4IDEyIi8+CiAgPC9nPgo8L3N2Zz4=',
  switch__switch_button_sync: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTQ4IDMyIFE0OCAyNS4zNSA0My4zIDIwLjY1IDM4LjY1IDE2IDMyIDE2IDI1LjM1IDE2IDIwLjY1IDIwLjY1IDE2IDI1LjM1IDE2IDMyIDE2IDM4LjY1IDIwLjY1IDQzLjMgMjUuMzUgNDggMzIgNDggMzguNjUgNDggNDMuMyA0My4zIDQ4IDM4LjY1IDQ4IDMyIE0yMy41IDIzLjUgUTI3IDIwIDMyIDIwIDM3IDIwIDQwLjUgMjMuNSA0NCAyNyA0NCAzMiA0NCAzNyA0MC41IDQwLjUgMzcgNDQgMzIgNDQgMjcgNDQgMjMuNSA0MC41IDIwIDM3IDIwIDMyIDIwIDI3IDIzLjUgMjMuNSBMMjMuNDUgMjMuNSAyMy41IDIzLjQ1IDIzLjUgMjMuNSBNMTYgOCBMNDggOCBRNTYgOCA1NiAxNiBMNTYgNDggUTU2IDU2IDQ4IDU2IEwxNiA1NiBROCA1NiA4IDQ4IEw4IDE2IFE4IDggMTYgOCIvPgogIDwvZz4KPC9zdmc+',
  switch__switch_button_x: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTU2IDMyIFE1NiA0MiA0OC45NSA0OC45NSA0MiA1NiAzMiA1NiAyMi4wNSA1NiAxNSA0OC45NSA4IDQyIDggMzIgOCAyMi4wNSAxNSAxNSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxNSA1NiAyMi4wNSA1NiAzMiBNMjMgMjUgTDI5IDMyIDIzIDM5IDIzIDQwIDI1LjI1IDQyIDI2LjQgNDIgMzIgMzUuNSAzNy42NSA0MiAzOC43NSA0MiA0MSA0MCA0MSAzOSAzNSAzMiA0MSAyNSA0MSAyNCAzOC43NSAyMiAzNy42NSAyMiAzMiAyOC41NSAyNi40IDIyIDI1LjI1IDIyIDIzIDI0IDIzIDI1Ii8+CiAgPC9nPgo8L3N2Zz4=',
  switch__switch_button_y: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTU2IDMyIFE1NiA0MiA0OC45NSA0OC45NSA0MiA1NiAzMiA1NiAyMi4wNSA1NiAxNSA0OC45NSA4IDQyIDggMzIgOCAyMi4wNSAxNSAxNSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxNSA1NiAyMi4wNSA1NiAzMiBNMjMgMjUgTDMwIDMyLjkgMzAgNDIgMzQgNDIgMzQgMzIuOSA0MSAyNSA0MSAyNCAzOC43NSAyMiAzNy42NSAyMiAzMiAyOC41NSAyNi40IDIyIDI1LjI1IDIyIDIzIDI0IDIzIDI1Ii8+CiAgPC9nPgo8L3N2Zz4=',
  switch__switch_button_zl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTM4IDQxIEwzOCAzMSAzNSAzMSAzNSA0NCA0NCA0NCA0NCA0MSAzOCA0MSBNNDguMyAxMCBRNTYgMTAuMTUgNTYgMTggTDU2IDQ2IFE1NiA1NCA0OCA1NCBMMTYgNTQgUTggNTQgOCA0NiBMOCAzMi45NSBROC4zNSAyMy43IDE1LjA1IDE3IDIxLjg1IDEwLjIgMzEuMzUgMTAgTDQ4LjMgMTAgTTE5IDMwIEwyOCAzMCAxOSA0MCAxOSA0NCAzMiA0NCAzMiA0MSAyMyA0MSAzMiAzMSAzMiAyNyAxOSAyNyAxOSAzMCIvPgogIDwvZz4KPC9zdmc+',
  switch__switch_button_zr: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTQwIDQxIEw0MSA0MC45IDQxIDQxIDQyIDQ0IDQ1IDQ0IDQzLjUgMzkuNSBRNDUgMzguMDUgNDUgMzYgNDUgMzMuOTUgNDMuNSAzMi40NSA0Mi4wNSAzMSA0MCAzMSBMMzQgMzEgMzQgNDQgMzcgNDQgMzcgNDEgNDAgNDEgTTM3IDM4IEwzNyAzNCA0MCAzNCBRNDAuODUgMzQgNDEuNCAzNC41NSA0MiAzNS4xNSA0MiAzNiA0MiAzNi44NSA0MS40IDM3LjQgNDAuODUgMzggNDAuMDUgMzggTDM3IDM4IE0xNS43IDEwIEwzMi42NSAxMCBRNDIuMTUgMTAuMiA0OC45NSAxNyA1NS42NSAyMy43IDU2IDMyLjk1IEw1NiA0NiBRNTYgNTQgNDggNTQgTDE2IDU0IFE4IDU0IDggNDYgTDggMTggUTggMTAuMTUgMTUuNyAxMCBNMTggMzAgTDI3IDMwIDE4IDQwIDE4IDQ0IDMxIDQ0IDMxIDQxIDIyIDQxIDMxIDMxIDMxIDI3IDE4IDI3IDE4IDMwIi8+CiAgPC9nPgo8L3N2Zz4=',
  universal__playstation_dpad_down: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTQwIDEwIEw0MCAxOS4xNSBRNDAgMjAgMzkuNDUgMjAuNiBMMzMuNDUgMjYuNiBRMzIuODUgMjcuMTUgMzIgMjcuMTUgMzEuMTUgMjcuMTUgMzAuNiAyNi42IEwyNC42IDIwLjYgUTI0IDIwIDI0IDE5LjE1IEwyNCAxMCBRMjQgOS4xNSAyNC42IDguNiAyNS4xNSA4IDI2IDggTDM4IDggUTM4Ljg1IDggMzkuNDUgOC42IDQwIDkuMTUgNDAgMTAgTTU2IDI2IEw1NiAzOCBRNTYgMzguODUgNTUuNDUgMzkuNDUgNTQuODUgNDAgNTQgNDAgTDQ0Ljg1IDQwIFE0NCA0MCA0My40NSAzOS40NSBMMzcuNDUgMzMuNDUgUTM2Ljg1IDMyLjg1IDM2Ljg1IDMyIDM2Ljg1IDMxLjE1IDM3LjQ1IDMwLjYgTDQzLjQ1IDI0LjYgUTQ0IDI0IDQ0Ljg1IDI0IEw1NCAyNCBRNTQuODUgMjQgNTUuNDUgMjQuNiA1NiAyNS4xNSA1NiAyNiBNMTkuMTUgNDAgTDEwIDQwIFE5LjE1IDQwIDguNiAzOS40NSA4IDM4Ljg1IDggMzggTDggMjYgUTggMjUuMTUgOC42IDI0LjYgOS4xNSAyNCAxMCAyNCBMMTkuMTUgMjQgUTIwIDI0IDIwLjYgMjQuNiBMMjYuNiAzMC42IFEyNy4xNSAzMS4xNSAyNy4xNSAzMiAyNy4xNSAzMi44NSAyNi42IDMzLjQ1IEwyMC42IDM5LjQ1IFEyMCA0MCAxOS4xNSA0MCIvPgogICAgPHBhdGggc3Ryb2tlPSJub25lIiBmaWxsPSIjRTczMjQ2IiBkPSJNMzMuNDUgMzcuNDUgTDM5LjQ1IDQzLjQ1IFE0MCA0NCA0MCA0NC44NSBMNDAgNTQgUTQwIDU0Ljg1IDM5LjQ1IDU1LjQ1IDM4Ljg1IDU2IDM4IDU2IEwyNiA1NiBRMjUuMTUgNTYgMjQuNiA1NS40NSAyNCA1NC44NSAyNCA1NCBMMjQgNDQuODUgUTI0IDQ0IDI0LjYgNDMuNDUgTDMwLjYgMzcuNDUgUTMxLjE1IDM2Ljg1IDMyIDM2Ljg1IDMyLjg1IDM2Ljg1IDMzLjQ1IDM3LjQ1Ii8+CiAgPC9nPgo8L3N2Zz4=',
  universal__playstation_dpad_left: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTQwIDEwIEw0MCAxOS4xNSBRNDAgMjAgMzkuNDUgMjAuNiBMMzMuNDUgMjYuNiBRMzIuODUgMjcuMTUgMzIgMjcuMTUgMzEuMTUgMjcuMTUgMzAuNiAyNi42IEwyNC42IDIwLjYgUTI0IDIwIDI0IDE5LjE1IEwyNCAxMCBRMjQgOS4xNSAyNC42IDguNiAyNS4xNSA4IDI2IDggTDM4IDggUTM4Ljg1IDggMzkuNDUgOC42IDQwIDkuMTUgNDAgMTAgTTU2IDI2IEw1NiAzOCBRNTYgMzguODUgNTUuNDUgMzkuNDUgNTQuODUgNDAgNTQgNDAgTDQ0Ljg1IDQwIFE0NCA0MCA0My40NSAzOS40NSBMMzcuNDUgMzMuNDUgUTM2Ljg1IDMyLjg1IDM2Ljg1IDMyIDM2Ljg1IDMxLjE1IDM3LjQ1IDMwLjYgTDQzLjQ1IDI0LjYgUTQ0IDI0IDQ0Ljg1IDI0IEw1NCAyNCBRNTQuODUgMjQgNTUuNDUgMjQuNiA1NiAyNS4xNSA1NiAyNiBNMzMuNDUgMzcuNDUgTDM5LjQ1IDQzLjQ1IFE0MCA0NCA0MCA0NC44NSBMNDAgNTQgUTQwIDU0Ljg1IDM5LjQ1IDU1LjQ1IDM4Ljg1IDU2IDM4IDU2IEwyNiA1NiBRMjUuMTUgNTYgMjQuNiA1NS40NSAyNCA1NC44NSAyNCA1NCBMMjQgNDQuODUgUTI0IDQ0IDI0LjYgNDMuNDUgTDMwLjYgMzcuNDUgUTMxLjE1IDM2Ljg1IDMyIDM2Ljg1IDMyLjg1IDM2Ljg1IDMzLjQ1IDM3LjQ1Ii8+CiAgICA8cGF0aCBzdHJva2U9Im5vbmUiIGZpbGw9IiNFNzMyNDYiIGQ9Ik0xOS4xNSA0MCBMMTAgNDAgUTkuMTUgNDAgOC42IDM5LjQ1IDggMzguODUgOCAzOCBMOCAyNiBROCAyNS4xNSA4LjYgMjQuNiA5LjE1IDI0IDEwIDI0IEwxOS4xNSAyNCBRMjAgMjQgMjAuNiAyNC42IEwyNi42IDMwLjYgUTI3LjE1IDMxLjE1IDI3LjE1IDMyIDI3LjE1IDMyLjg1IDI2LjYgMzMuNDUgTDIwLjYgMzkuNDUgUTIwIDQwIDE5LjE1IDQwIi8+CiAgPC9nPgo8L3N2Zz4=',
  universal__playstation_dpad_right: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTQwIDEwIEw0MCAxOS4xNSBRNDAgMjAgMzkuNDUgMjAuNiBMMzMuNDUgMjYuNiBRMzIuODUgMjcuMTUgMzIgMjcuMTUgMzEuMTUgMjcuMTUgMzAuNiAyNi42IEwyNC42IDIwLjYgUTI0IDIwIDI0IDE5LjE1IEwyNCAxMCBRMjQgOS4xNSAyNC42IDguNiAyNS4xNSA4IDI2IDggTDM4IDggUTM4Ljg1IDggMzkuNDUgOC42IDQwIDkuMTUgNDAgMTAgTTMzLjQ1IDM3LjQ1IEwzOS40NSA0My40NSBRNDAgNDQgNDAgNDQuODUgTDQwIDU0IFE0MCA1NC44NSAzOS40NSA1NS40NSAzOC44NSA1NiAzOCA1NiBMMjYgNTYgUTI1LjE1IDU2IDI0LjYgNTUuNDUgMjQgNTQuODUgMjQgNTQgTDI0IDQ0Ljg1IFEyNCA0NCAyNC42IDQzLjQ1IEwzMC42IDM3LjQ1IFEzMS4xNSAzNi44NSAzMiAzNi44NSAzMi44NSAzNi44NSAzMy40NSAzNy40NSBNMTkuMTUgNDAgTDEwIDQwIFE5LjE1IDQwIDguNiAzOS40NSA4IDM4Ljg1IDggMzggTDggMjYgUTggMjUuMTUgOC42IDI0LjYgOS4xNSAyNCAxMCAyNCBMMTkuMTUgMjQgUTIwIDI0IDIwLjYgMjQuNiBMMjYuNiAzMC42IFEyNy4xNSAzMS4xNSAyNy4xNSAzMiAyNy4xNSAzMi44NSAyNi42IDMzLjQ1IEwyMC42IDM5LjQ1IFEyMCA0MCAxOS4xNSA0MCIvPgogICAgPHBhdGggc3Ryb2tlPSJub25lIiBmaWxsPSIjRTczMjQ2IiBkPSJNNTYgMjYgTDU2IDM4IFE1NiAzOC44NSA1NS40NSAzOS40NSA1NC44NSA0MCA1NCA0MCBMNDQuODUgNDAgUTQ0IDQwIDQzLjQ1IDM5LjQ1IEwzNy40NSAzMy40NSBRMzYuODUgMzIuODUgMzYuODUgMzIgMzYuODUgMzEuMTUgMzcuNDUgMzAuNiBMNDMuNDUgMjQuNiBRNDQgMjQgNDQuODUgMjQgTDU0IDI0IFE1NC44NSAyNCA1NS40NSAyNC42IDU2IDI1LjE1IDU2IDI2Ii8+CiAgPC9nPgo8L3N2Zz4=',
  universal__playstation_dpad_up: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0U3MzI0NiIgZD0iTTQwIDEwIEw0MCAxOS4xNSBRNDAgMjAgMzkuNDUgMjAuNiBMMzMuNDUgMjYuNiBRMzIuODUgMjcuMTUgMzIgMjcuMTUgMzEuMTUgMjcuMTUgMzAuNiAyNi42IEwyNC42IDIwLjYgUTI0IDIwIDI0IDE5LjE1IEwyNCAxMCBRMjQgOS4xNSAyNC42IDguNiAyNS4xNSA4IDI2IDggTDM4IDggUTM4Ljg1IDggMzkuNDUgOC42IDQwIDkuMTUgNDAgMTAiLz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTU2IDI2IEw1NiAzOCBRNTYgMzguODUgNTUuNDUgMzkuNDUgNTQuODUgNDAgNTQgNDAgTDQ0Ljg1IDQwIFE0NCA0MCA0My40NSAzOS40NSBMMzcuNDUgMzMuNDUgUTM2Ljg1IDMyLjg1IDM2Ljg1IDMyIDM2Ljg1IDMxLjE1IDM3LjQ1IDMwLjYgTDQzLjQ1IDI0LjYgUTQ0IDI0IDQ0Ljg1IDI0IEw1NCAyNCBRNTQuODUgMjQgNTUuNDUgMjQuNiA1NiAyNS4xNSA1NiAyNiBNMzMuNDUgMzcuNDUgTDM5LjQ1IDQzLjQ1IFE0MCA0NCA0MCA0NC44NSBMNDAgNTQgUTQwIDU0Ljg1IDM5LjQ1IDU1LjQ1IDM4Ljg1IDU2IDM4IDU2IEwyNiA1NiBRMjUuMTUgNTYgMjQuNiA1NS40NSAyNCA1NC44NSAyNCA1NCBMMjQgNDQuODUgUTI0IDQ0IDI0LjYgNDMuNDUgTDMwLjYgMzcuNDUgUTMxLjE1IDM2Ljg1IDMyIDM2Ljg1IDMyLjg1IDM2Ljg1IDMzLjQ1IDM3LjQ1IE0xOS4xNSA0MCBMMTAgNDAgUTkuMTUgNDAgOC42IDM5LjQ1IDggMzguODUgOCAzOCBMOCAyNiBROCAyNS4xNSA4LjYgMjQuNiA5LjE1IDI0IDEwIDI0IEwxOS4xNSAyNCBRMjAgMjQgMjAuNiAyNC42IEwyNi42IDMwLjYgUTI3LjE1IDMxLjE1IDI3LjE1IDMyIDI3LjE1IDMyLjg1IDI2LjYgMzMuNDUgTDIwLjYgMzkuNDUgUTIwIDQwIDE5LjE1IDQwIi8+CiAgPC9nPgo8L3N2Zz4=',
  universal__switch_button_home: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTU2IDMyIFE1NiA0MS42NSA0OS40NSA0OC40NSBMNDguOTUgNDguOTUgUTQyIDU2IDMyIDU2IDIyLjA1IDU2IDE1IDQ4Ljk1IEwxNC41IDQ4LjQ1IFE4IDQxLjY1IDggMzIgOCAyMi4wNSAxNSAxNSBMMTUuOTUgMTQuMSBRMjIuNyA4IDMyIDggNDEuMzUgOCA0OCAxNC4xIEw0OC45NSAxNSBRNTYgMjIuMDUgNTYgMzIgTTIwLjYgMzAuNTUgUTIwIDMxLjEgMjAgMzEuOTUgTDIwIDMzLjE1IFEyMCAzMy45NSAyMC42IDM0LjU1IDIxLjE1IDM1LjEgMjIgMzUuMSBMMjQgMzUuMSAyNCA0MS4wNSAyNCA0MS4xNSBRMjQuMDUgNDEuOTUgMjQuNiA0Mi41IDI1LjE1IDQzIDI2IDQzIEwzOCA0MyBRMzguODUgNDMgMzkuNDUgNDIuNSBMNDAgNDEuMTUgNDAgNDEuMDUgNDAgMzUuMSA0MiAzNS4xIFE0Mi44NSAzNS4xIDQzLjQ1IDM0LjU1IDQ0IDMzLjk1IDQ0IDMzLjE1IEw0NCAzMS45NSBRNDQgMzEuMSA0My40NSAzMC41NSBMMzMuNDUgMjAuNiBRMzIuODUgMjAgMzIgMjAgMzEuMTUgMjAgMzAuNiAyMC42IEwyMC42IDMwLjU1IE0yOSAzOCBMMjkgMzEuOTUgMzUgMzEuOTUgMzUgMzggMjkgMzgiLz4KICA8L2c+Cjwvc3ZnPg==',
  universal__xbox_stick_l_down: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTMxLjIgMzcgUTI0LjU1IDM2Ljc1IDE5LjggMzIuOTUgTDE5LjcgMzIuOSBRMTYuMyAzMCAxNiAyNi4xIEwxNiAyNi4wNSBRMTYuMjUgMjIgMTkuODUgMTkgTDE5Ljk1IDE4LjkgUTI1IDE1IDMyIDE1IDM5LjE1IDE1IDQ0LjIgMTkgTDQ0LjE1IDE5IFE0Ny43IDIyIDQ4IDI1Ljk1IEw0OCAyNi4wNSBRNDcuNyAzMCA0NC4yIDMyLjkgTDQ0IDMzLjA1IFEzOS4zNSAzNi43NSAzMi44IDM3IEwzMS4yIDM3IE00Mi44IDQwLjE1IEw0Ni41NSAzNy43IDQ2LjYgMzcuNjUgUTUxLjkgMzMuNCA1MiAyNy40IDUxLjg1IDIxLjQgNDYuNTUgMTcuMSA0MC41NSAxMi4zIDMyIDEyLjMgMjMuNDUgMTIuMyAxNy40IDE3LjEgTDE3LjQ1IDE3LjEgUTEyLjE1IDIxLjQgMTIgMjcuNCAxMi4xIDMzLjQ1IDE3LjQgMzcuNjUgTDIxLjI1IDQwLjE1IFEyMSA0MC44IDIxIDQxLjY1IDIxIDQzLjUgMjIuMjUgNDQuODUgTDIyLjMgNDQuOTUgMjguNyA1MS42IFEzMCA1MyAzMiA1MyAzMy44NSA1My4wNSAzNS4zIDUxLjY1IEwzNS4zIDUxLjYgNDEuNyA0NC45NSA0MS44IDQ0Ljg1IFE0MyA0My41IDQzIDQxLjY1IEw0Mi44IDQwLjE1IE00MyA1MCBRNDMgNTIuNSAzOS43NSA1NC4yNSAzNi41NSA1NiAzMiA1NiAyNy41IDU2IDI0LjI1IDU0LjI1IDIxIDUyLjUgMjEgNTAgTDIxIDQ3LjkgUTE3LjggNDYuNTUgMTUgNDQuMyA4IDM4LjcgOCAzMC42NSBMOCAzMC4xIDggMjkuNTUgOCAyOSA4IDI4LjUgOCAyOC4xIDggMjcuOTUgOCAyNy40IFE4IDE5LjQgMTUgMTMuNjUgMjIuMDUgOCAzMiA4IDQyIDggNDguOTUgMTMuNjUgNTYgMTkuNCA1NiAyNy40IEw1NiAyNy45NSA1NiAyOC4xIDU2IDI4LjUgNTYgMjkgNTYgMjkuNTUgNTYgMzAuMSA1NiAzMC42NSBRNTYgMzguNyA0OC45NSA0NC4zIDQ2LjIgNDYuNTUgNDMgNDcuOSBMNDMgNTAgTTMxIDMwIEwzMSAyMCAyOCAyMCAyOCAzMyAzNyAzMyAzNyAzMCAzMSAzMCBNMjUuNiA0MCBMMzguNCA0MCBRMzkuMDUgNDAgMzkuNTUgNDAuNSBMNDAgNDEuMyA0MCA0MS42NSBRNDAgNDIuMzUgMzkuNTUgNDIuODUgTDMzLjE1IDQ5LjUgUTMyLjY1IDUwIDMyIDUwIDMxLjMgNTAgMzAuODUgNDkuNSBMMjQuNDUgNDIuODUgUTI0IDQyLjM1IDI0IDQxLjY1IEwyNC4wNSA0MS4zIDI0LjQ1IDQwLjUgUTI0LjkgNDAgMjUuNiA0MCIvPgogICAgPHBhdGggc3Ryb2tlPSJub25lIiBmaWxsPSIjRkZGRkZGIiBmaWxsLW9wYWNpdHk9IjAiIGQ9Ik0yNS42IDQwIFEyNC45IDQwIDI0LjQ1IDQwLjUgTDI0LjA1IDQxLjMgMjQgNDEuNjUgUTI0IDQyLjM1IDI0LjQ1IDQyLjg1IEwzMC44NSA0OS41IFEzMS4zIDUwIDMyIDUwIDMyLjY1IDUwIDMzLjE1IDQ5LjUgTDM5LjU1IDQyLjg1IFE0MCA0Mi4zNSA0MCA0MS42NSBMNDAgNDEuMyAzOS41NSA0MC41IFEzOS4wNSA0MCAzOC40IDQwIEwyNS42IDQwIE0zMi44IDM3IEwzOC40IDM3IFE0MC4yNSAzNi45NSA0MS43IDM4LjQgNDIuNDUgMzkuMTUgNDIuOCA0MC4xNSBMNDMgNDEuNjUgUTQzIDQzLjUgNDEuOCA0NC44NSBMNDEuNyA0NC45NSAzNS4zIDUxLjYgMzUuMyA1MS42NSBRMzMuODUgNTMuMDUgMzIgNTMgMzAgNTMgMjguNyA1MS42IEwyMi4zIDQ0Ljk1IDIyLjI1IDQ0Ljg1IFEyMSA0My41IDIxIDQxLjY1IDIxIDQwLjggMjEuMjUgNDAuMTUgMjEuNTUgMzkuMiAyMi4yNSAzOC41IDIzLjU1IDM3IDI1LjYgMzcgTDMxLjIgMzcgMzIuOCAzNyIvPgogIDwvZz4KPC9zdmc+',
  universal__xbox_stick_l_left: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTE2IDI2LjA1IFExNi4yNSAyMiAxOS44NSAxOSBMMTkuOTUgMTguOSBRMjUgMTUgMzIgMTUgMzkuMTUgMTUgNDQuMiAxOSBMNDQuMTUgMTkgUTQ3LjcgMjIgNDggMjUuOTUgTDQ4IDI2LjA1IFE0Ny43IDMwIDQ0LjIgMzIuOSBMNDQgMzMuMDUgUTM5LjA1IDM3IDMyIDM3IDI0Ljg1IDM3IDE5LjggMzIuOTUgTDE5LjcgMzIuOSBRMTYuMyAzMCAxNiAyNi4xIEwxNiAyNi4wNSBNMTQuOTUgMzUuMyBRMTYgMzYuNTUgMTcuNCAzNy42NSAyMy40NSA0Mi41IDMyIDQyLjUgNDAuNTUgNDIuNSA0Ni41NSAzNy43IEw0Ni42IDM3LjY1IFE1MS45IDMzLjQgNTIgMjcuNCA1MS44NSAyMS40IDQ2LjU1IDE3LjEgNDAuNTUgMTIuMyAzMiAxMi4zIDIzLjQ1IDEyLjMgMTcuNCAxNy4xIEwxNy40NSAxNy4xIDE1LjkgMTguNTUgUTE1LjYgMTcuMyAxNC42IDE2LjMgMTMuOTUgMTUuNjUgMTMuMTUgMTUuMzUgTDE1IDEzLjY1IFEyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxMy42NSA1NiAxOS40IDU2IDI3LjQgTDU2IDI3Ljk1IDU2IDI4LjEgNTYgMjguNSA1NiAyOSA1NiAyOS41NSA1NiAzMC4xIDU2IDMwLjY1IFE1NiAzOC43IDQ4Ljk1IDQ0LjMgNDYuMiA0Ni41NSA0MyA0Ny45IEw0MyA1MCBRNDMgNTIuNSAzOS43NSA1NC4yNSAzNi41NSA1NiAzMiA1NiAyNy41IDU2IDI0LjI1IDU0LjI1IDIxIDUyLjUgMjEgNTAgTDIxIDQ3LjkgUTE3LjggNDYuNTUgMTUgNDQuMyAxMC42NSA0MC44IDkgMzYuNCAxMC4wNSAzNyAxMS4zNSAzNyAxMy4yNSAzNyAxNC41IDM1Ljc1IEwxNC45NSAzNS4zIE0zMSAzMCBMMzEgMjAgMjggMjAgMjggMzMgMzcgMzMgMzcgMzAgMzEgMzAgTTMuNSAyNy4xNSBRMyAyNi43IDMgMjYgMyAyNS4zNSAzLjUgMjQuODUgTDEwLjE1IDE4LjQ1IFExMC40NSAxOC4xNSAxMC45IDE4LjA1IEwxMS4zNSAxOCBRMTIuMDUgMTggMTIuNSAxOC40NSAxMyAxOC45NSAxMyAxOS42IEwxMyAzMi40IFExMyAzMy4xIDEyLjUgMzMuNTUgTDExLjM1IDM0IFExMC42NSAzNCAxMC4xNSAzMy41NSBMMy41IDI3LjE1Ii8+CiAgICA8cGF0aCBzdHJva2U9Im5vbmUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMCIgZD0iTTMuNSAyNy4xNSBMMTAuMTUgMzMuNTUgUTEwLjY1IDM0IDExLjM1IDM0IEwxMi41IDMzLjU1IFExMyAzMy4xIDEzIDMyLjQgTDEzIDE5LjYgUTEzIDE4Ljk1IDEyLjUgMTguNDUgMTIuMDUgMTggMTEuMzUgMTggTDEwLjkgMTguMDUgUTEwLjQ1IDE4LjE1IDEwLjE1IDE4LjQ1IEwzLjUgMjQuODUgUTMgMjUuMzUgMyAyNiAzIDI2LjcgMy41IDI3LjE1IE0xNiAyNi4xIEwxNiAzMi40IFExNiAzNC4xIDE0Ljk1IDM1LjMgTDE0LjUgMzUuNzUgUTEzLjI1IDM3IDExLjM1IDM3IDEwLjA1IDM3IDkgMzYuNCBMOC4xNSAzNS43NSA4LjA1IDM1LjcgMS40IDI5LjMgUTAgMjggMCAyNiAtMC4wNSAyNC4xNSAxLjM1IDIyLjcgTDEuNCAyMi43IDguMDUgMTYuMyA4LjE1IDE2LjIgUTkuNSAxNSAxMS4zNSAxNSAxMi4zNSAxNSAxMy4xNSAxNS4zNSAxMy45NSAxNS42NSAxNC42IDE2LjMgMTUuNiAxNy4zIDE1LjkgMTguNTUgTDE2IDE5LjYgMTYgMjYuMDUgMTYgMjYuMSIvPgogIDwvZz4KPC9zdmc+',
  universal__xbox_stick_l_right: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwIiBkPSJNNTAuODUgMTUuMzUgUTUxLjY1IDE1IDUyLjY1IDE1IDU0LjUgMTUgNTUuODUgMTYuMiBMNTUuOTUgMTYuMyA2Mi42IDIyLjcgNjIuNjUgMjIuNyBRNjQuMDUgMjQuMTUgNjQgMjYgNjQgMjggNjIuNiAyOS4zIEw1NS45NSAzNS43IDU1Ljg1IDM1Ljc1IDU1IDM2LjQgUTUzLjk1IDM3IDUyLjY1IDM3IDUwLjc1IDM3IDQ5LjUgMzUuNzUgTDQ5LjA1IDM1LjMgUTQ4IDM0LjEgNDggMzIuNCBMNDggMjYuMDUgNDggMjUuOTUgNDggMTkuNiA0OC4xIDE4LjU1IFE0OC40IDE3LjMgNDkuNCAxNi4zIDUwIDE1LjY1IDUwLjg1IDE1LjM1IE02MC41IDI3LjE1IFE2MSAyNi43IDYxIDI2IDYxIDI1LjM1IDYwLjUgMjQuODUgTDUzLjg1IDE4LjQ1IFE1My41IDE4LjE1IDUzLjEgMTguMDUgTDUyLjY1IDE4IFE1MS45NSAxOCA1MS41IDE4LjQ1IDUxIDE4Ljk1IDUxIDE5LjYgTDUxIDMyLjQgUTUxIDMzLjEgNTEuNSAzMy41NSA1MS45NSAzNCA1Mi42NSAzNCBMNTMuODUgMzMuNTUgNjAuNSAyNy4xNSIvPgogICAgPHBhdGggc3Ryb2tlPSJub25lIiBmaWxsPSIjRkZGRkZGIiBkPSJNNjAuNSAyNy4xNSBMNTMuODUgMzMuNTUgNTIuNjUgMzQgUTUxLjk1IDM0IDUxLjUgMzMuNTUgNTEgMzMuMSA1MSAzMi40IEw1MSAxOS42IFE1MSAxOC45NSA1MS41IDE4LjQ1IDUxLjk1IDE4IDUyLjY1IDE4IEw1My4xIDE4LjA1IFE1My41IDE4LjE1IDUzLjg1IDE4LjQ1IEw2MC41IDI0Ljg1IFE2MSAyNS4zNSA2MSAyNiA2MSAyNi43IDYwLjUgMjcuMTUgTTU1IDM2LjQgUTUzLjM1IDQwLjggNDguOTUgNDQuMyA0Ni4yIDQ2LjU1IDQzIDQ3LjkgTDQzIDUwIFE0MyA1Mi41IDM5Ljc1IDU0LjI1IDM2LjU1IDU2IDMyIDU2IDI3LjUgNTYgMjQuMjUgNTQuMjUgMjEgNTIuNSAyMSA1MCBMMjEgNDcuOSBRMTcuOCA0Ni41NSAxNSA0NC4zIDggMzguNyA4IDMwLjY1IEw4IDMwLjEgOCAyOS41NSA4IDI5IDggMjguNSA4IDI4LjEgOCAyNy45NSA4IDI3LjQgUTggMTkuNCAxNSAxMy42NSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxMy42NSBMNTAuODUgMTUuMzUgUTUwIDE1LjY1IDQ5LjQgMTYuMyA0OC40IDE3LjMgNDguMSAxOC41NSBMNDYuNTUgMTcuMSBRNDAuNTUgMTIuMyAzMiAxMi4zIDIzLjQ1IDEyLjMgMTcuNCAxNy4xIEwxNy40NSAxNy4xIFExMi4xNSAyMS40IDEyIDI3LjQgMTIuMSAzMy40NSAxNy40IDM3LjY1IDIzLjQ1IDQyLjUgMzIgNDIuNSA0MC41NSA0Mi41IDQ2LjU1IDM3LjcgTDQ2LjYgMzcuNjUgNDkuMDUgMzUuMyA0OS41IDM1Ljc1IFE1MC43NSAzNyA1Mi42NSAzNyA1My45NSAzNyA1NSAzNi40IE00OCAyNS45NSBMNDggMjYuMDUgUTQ3LjcgMzAgNDQuMiAzMi45IEw0NCAzMy4wNSBRMzkuMDUgMzcgMzIgMzcgMjQuODUgMzcgMTkuOCAzMi45NSBMMTkuNyAzMi45IFExNi4zIDMwIDE2IDI2LjEgTDE2IDI2LjA1IFExNi4yNSAyMiAxOS44NSAxOSBMMTkuOTUgMTguOSBRMjUgMTUgMzIgMTUgMzkuMTUgMTUgNDQuMiAxOSBMNDQuMTUgMTkgUTQ3LjcgMjIgNDggMjUuOTUgTTMxIDMwIEwzMSAyMCAyOCAyMCAyOCAzMyAzNyAzMyAzNyAzMCAzMSAzMCIvPgogIDwvZz4KPC9zdmc+',
  universal__xbox_stick_l_up: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwIiBkPSJNNDMgMTAuMSBMNDMgMTAuMzUgUTQzIDEyLjM1IDQxLjcgMTMuNiBMNDEuMyAxNCBRNDAgMTUuMDUgMzguNCAxNSBMMzIuOCAxNSAzMS4yIDE1IDI1LjYgMTUgUTIzLjkgMTUgMjIuNzUgMTQgTDIyLjI1IDEzLjUgUTIxIDEyLjI1IDIxIDEwLjM1IEwyMSAxMC4xIFEyMS4xIDguNCAyMi4yNSA3LjE1IEwyMi4zIDcuMDUgMjguNyAwLjQgUTMwIC0xIDMyIC0xIDMzLjg1IC0xLjA1IDM1LjMgMC4zNSBMMzUuMyAwLjQgNDEuNyA3LjA1IDQxLjggNy4xNSBRNDIuOSA4LjQgNDMgMTAuMSBNMzAuODUgMi41IEwyNC40NSA5LjE1IFEyNCA5LjY1IDI0IDEwLjM1IDI0IDExLjA1IDI0LjQ1IDExLjUgMjQuOSAxMiAyNS42IDEyIEwzOC40IDEyIFEzOS4wNSAxMiAzOS41NSAxMS41IDQwIDExLjA1IDQwIDEwLjM1IDQwIDkuNjUgMzkuNTUgOS4xNSBMMzMuMTUgMi41IFEzMi42NSAyIDMyIDIgMzEuMyAyIDMwLjg1IDIuNSIvPgogICAgPHBhdGggc3Ryb2tlPSJub25lIiBmaWxsPSIjRkZGRkZGIiBkPSJNMzAuODUgMi41IFEzMS4zIDIgMzIgMiAzMi42NSAyIDMzLjE1IDIuNSBMMzkuNTUgOS4xNSBRNDAgOS42NSA0MCAxMC4zNSA0MCAxMS4wNSAzOS41NSAxMS41IDM5LjA1IDEyIDM4LjQgMTIgTDI1LjYgMTIgUTI0LjkgMTIgMjQuNDUgMTEuNSAyNCAxMS4wNSAyNCAxMC4zNSAyNCA5LjY1IDI0LjQ1IDkuMTUgTDMwLjg1IDIuNSBNNDEuMyAxNCBMNDEuNyAxMy42IFE0MyAxMi4zNSA0MyAxMC4zNSBMNDMgMTAuMSBRNDYuMiAxMS40IDQ4Ljk1IDEzLjY1IDU2IDE5LjQgNTYgMjcuNCBMNTYgMjcuOTUgNTYgMjguMSA1NiAyOC41IDU2IDI5IDU2IDI5LjU1IDU2IDMwLjEgNTYgMzAuNjUgUTU2IDM4LjcgNDguOTUgNDQuMyA0Ni4yIDQ2LjU1IDQzIDQ3LjkgTDQzIDUwIFE0MyA1Mi41IDM5Ljc1IDU0LjI1IDM2LjU1IDU2IDMyIDU2IDI3LjUgNTYgMjQuMjUgNTQuMjUgMjEgNTIuNSAyMSA1MCBMMjEgNDcuOSBRMTcuOCA0Ni41NSAxNSA0NC4zIDggMzguNyA4IDMwLjY1IEw4IDMwLjEgOCAyOS41NSA4IDI5IDggMjguNSA4IDI4LjEgOCAyNy45NSA4IDI3LjQgUTggMTkuNCAxNSAxMy42NSAxNy44IDExLjQgMjEgMTAuMSBMMjEgMTAuMzUgUTIxIDEyLjI1IDIyLjI1IDEzLjUgTDIyLjc1IDE0IFExOS44NSAxNS4xNSAxNy40IDE3LjEgTDE3LjQ1IDE3LjEgUTEyLjE1IDIxLjQgMTIgMjcuNCAxMi4xIDMzLjQ1IDE3LjQgMzcuNjUgMjMuNDUgNDIuNSAzMiA0Mi41IDQwLjU1IDQyLjUgNDYuNTUgMzcuNyBMNDYuNiAzNy42NSBRNTEuOSAzMy40IDUyIDI3LjQgNTEuODUgMjEuNCA0Ni41NSAxNy4xIDQ0LjEgMTUuMTUgNDEuMyAxNCBNMzEuMiAxNSBMMzIuOCAxNSBRMzkuNDUgMTUuMjUgNDQuMiAxOSBMNDQuMTUgMTkgUTQ3LjcgMjIgNDggMjUuOTUgTDQ4IDI2LjA1IFE0Ny43IDMwIDQ0LjIgMzIuOSBMNDQgMzMuMDUgUTM5LjA1IDM3IDMyIDM3IDI0Ljg1IDM3IDE5LjggMzIuOTUgTDE5LjcgMzIuOSBRMTYuMyAzMCAxNiAyNi4xIEwxNiAyNi4wNSBRMTYuMjUgMjIgMTkuODUgMTkgTDE5Ljk1IDE4LjkgUTI0LjcgMTUuMiAzMS4yIDE1IE0zMSAzMCBMMzEgMjAgMjggMjAgMjggMzMgMzcgMzMgMzcgMzAgMzEgMzAiLz4KICA8L2c+Cjwvc3ZnPg==',
  universal__xbox_stick_r_down: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTMxLjIgMzcgUTI0LjU1IDM2Ljc1IDE5LjggMzIuOTUgTDE5LjcgMzIuOSBRMTYuMyAzMCAxNiAyNi4xIEwxNiAyNi4wNSBRMTYuMjUgMjIgMTkuODUgMTkgTDE5Ljk1IDE4LjkgUTI1IDE1IDMyIDE1IDM5LjE1IDE1IDQ0LjIgMTkgTDQ0LjE1IDE5IFE0Ny43IDIyIDQ4IDI1Ljk1IEw0OCAyNi4wNSBRNDcuNyAzMCA0NC4yIDMyLjkgTDQ0IDMzLjA1IFEzOS4zNSAzNi43NSAzMi44IDM3IEwzMS4yIDM3IE00Mi44IDQwLjE1IEw0Ni41NSAzNy43IDQ2LjYgMzcuNjUgUTUxLjkgMzMuNCA1MiAyNy40IDUxLjg1IDIxLjQgNDYuNTUgMTcuMSA0MC41NSAxMi4zIDMyIDEyLjMgMjMuNDUgMTIuMyAxNy40IDE3LjEgTDE3LjQ1IDE3LjEgUTEyLjE1IDIxLjQgMTIgMjcuNCAxMi4xIDMzLjQ1IDE3LjQgMzcuNjUgTDIxLjI1IDQwLjE1IFEyMSA0MC44IDIxIDQxLjY1IDIxIDQzLjUgMjIuMjUgNDQuODUgTDIyLjMgNDQuOTUgMjguNyA1MS42IFEzMCA1MyAzMiA1MyAzMy44NSA1My4wNSAzNS4zIDUxLjY1IEwzNS4zIDUxLjYgNDEuNyA0NC45NSA0MS44IDQ0Ljg1IFE0MyA0My41IDQzIDQxLjY1IEw0Mi44IDQwLjE1IE00MyA1MCBRNDMgNTIuNSAzOS43NSA1NC4yNSAzNi41NSA1NiAzMiA1NiAyNy41IDU2IDI0LjI1IDU0LjI1IDIxIDUyLjUgMjEgNTAgTDIxIDQ3LjkgUTE3LjggNDYuNTUgMTUgNDQuMyA4IDM4LjcgOCAzMC42NSBMOCAzMC4xIDggMjkuNTUgOCAyOSA4IDI4LjUgOCAyOC4xIDggMjcuOTUgOCAyNy40IFE4IDE5LjQgMTUgMTMuNjUgMjIuMDUgOCAzMiA4IDQyIDggNDguOTUgMTMuNjUgNTYgMTkuNCA1NiAyNy40IEw1NiAyNy45NSA1NiAyOC4xIDU2IDI4LjUgNTYgMjkgNTYgMjkuNTUgNTYgMzAuMSA1NiAzMC42NSBRNTYgMzguNyA0OC45NSA0NC4zIDQ2LjIgNDYuNTUgNDMgNDcuOSBMNDMgNTAgTTMzIDMwIEwzNCAyOS45IDM0IDMwIDM1IDMzIDM4IDMzIDM2LjUgMjguNSBRMzggMjcuMDUgMzggMjUgMzggMjIuOTUgMzYuNSAyMS40NSAzNS4wNSAyMCAzMyAyMCBMMjcgMjAgMjcgMzMgMzAgMzMgMzAgMzAgMzMgMzAgTTMwIDI3IEwzMCAyMyAzMyAyMyBRMzMuODUgMjMgMzQuNCAyMy41NSAzNSAyNC4xNSAzNSAyNSAzNSAyNS44NSAzNC40IDI2LjQgMzMuODUgMjcgMzMuMDUgMjcgTDMwIDI3IE0zMC44NSA0OS41IEwyNC40NSA0Mi44NSBRMjQgNDIuMzUgMjQgNDEuNjUgTDI0LjA1IDQxLjMgMjQuNDUgNDAuNSBRMjQuOSA0MCAyNS42IDQwIEwzOC40IDQwIFEzOS4wNSA0MCAzOS41NSA0MC41IEw0MCA0MS4zIDQwIDQxLjY1IFE0MCA0Mi4zNSAzOS41NSA0Mi44NSBMMzMuMTUgNDkuNSBRMzIuNjUgNTAgMzIgNTAgMzEuMyA1MCAzMC44NSA0OS41Ii8+CiAgICA8cGF0aCBzdHJva2U9Im5vbmUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMCIgZD0iTTMwLjg1IDQ5LjUgUTMxLjMgNTAgMzIgNTAgMzIuNjUgNTAgMzMuMTUgNDkuNSBMMzkuNTUgNDIuODUgUTQwIDQyLjM1IDQwIDQxLjY1IEw0MCA0MS4zIDM5LjU1IDQwLjUgUTM5LjA1IDQwIDM4LjQgNDAgTDI1LjYgNDAgUTI0LjkgNDAgMjQuNDUgNDAuNSBMMjQuMDUgNDEuMyAyNCA0MS42NSBRMjQgNDIuMzUgMjQuNDUgNDIuODUgTDMwLjg1IDQ5LjUgTTMyLjggMzcgTDM4LjQgMzcgUTQwLjI1IDM2Ljk1IDQxLjcgMzguNCA0Mi40NSAzOS4xNSA0Mi44IDQwLjE1IEw0MyA0MS42NSBRNDMgNDMuNSA0MS44IDQ0Ljg1IEw0MS43IDQ0Ljk1IDM1LjMgNTEuNiAzNS4zIDUxLjY1IFEzMy44NSA1My4wNSAzMiA1MyAzMCA1MyAyOC43IDUxLjYgTDIyLjMgNDQuOTUgMjIuMjUgNDQuODUgUTIxIDQzLjUgMjEgNDEuNjUgMjEgNDAuOCAyMS4yNSA0MC4xNSAyMS41NSAzOS4yIDIyLjI1IDM4LjUgMjMuNTUgMzcgMjUuNiAzNyBMMzEuMiAzNyAzMi44IDM3Ii8+CiAgPC9nPgo8L3N2Zz4=',
  universal__xbox_stick_r_left: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTE2IDI2LjA1IFExNi4yNSAyMiAxOS44NSAxOSBMMTkuOTUgMTguOSBRMjUgMTUgMzIgMTUgMzkuMTUgMTUgNDQuMiAxOSBMNDQuMTUgMTkgUTQ3LjcgMjIgNDggMjUuOTUgTDQ4IDI2LjA1IFE0Ny43IDMwIDQ0LjIgMzIuOSBMNDQgMzMuMDUgUTM5LjA1IDM3IDMyIDM3IDI0Ljg1IDM3IDE5LjggMzIuOTUgTDE5LjcgMzIuOSBRMTYuMyAzMCAxNiAyNi4xIEwxNiAyNi4wNSBNMTQuOTUgMzUuMyBRMTYgMzYuNTUgMTcuNCAzNy42NSAyMy40NSA0Mi41IDMyIDQyLjUgNDAuNTUgNDIuNSA0Ni41NSAzNy43IEw0Ni42IDM3LjY1IFE1MS45IDMzLjQgNTIgMjcuNCA1MS44NSAyMS40IDQ2LjU1IDE3LjEgNDAuNTUgMTIuMyAzMiAxMi4zIDIzLjQ1IDEyLjMgMTcuNCAxNy4xIEwxNy40NSAxNy4xIDE1LjkgMTguNTUgUTE1LjYgMTcuMyAxNC42IDE2LjMgMTMuOTUgMTUuNjUgMTMuMTUgMTUuMzUgTDE1IDEzLjY1IFEyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxMy42NSA1NiAxOS40IDU2IDI3LjQgTDU2IDI3Ljk1IDU2IDI4LjEgNTYgMjguNSA1NiAyOSA1NiAyOS41NSA1NiAzMC4xIDU2IDMwLjY1IFE1NiAzOC43IDQ4Ljk1IDQ0LjMgNDYuMiA0Ni41NSA0MyA0Ny45IEw0MyA1MCBRNDMgNTIuNSAzOS43NSA1NC4yNSAzNi41NSA1NiAzMiA1NiAyNy41IDU2IDI0LjI1IDU0LjI1IDIxIDUyLjUgMjEgNTAgTDIxIDQ3LjkgUTE3LjggNDYuNTUgMTUgNDQuMyAxMC42NSA0MC44IDkgMzYuNCAxMC4wNSAzNyAxMS4zNSAzNyAxMy4yNSAzNyAxNC41IDM1Ljc1IEwxNC45NSAzNS4zIE0zMyAzMCBMMzQgMjkuOSAzNCAzMCAzNSAzMyAzOCAzMyAzNi41IDI4LjUgUTM4IDI3LjA1IDM4IDI1IDM4IDIyLjk1IDM2LjUgMjEuNDUgMzUuMDUgMjAgMzMgMjAgTDI3IDIwIDI3IDMzIDMwIDMzIDMwIDMwIDMzIDMwIE0zMCAyNyBMMzAgMjMgMzMgMjMgUTMzLjg1IDIzIDM0LjQgMjMuNTUgMzUgMjQuMTUgMzUgMjUgMzUgMjUuODUgMzQuNCAyNi40IDMzLjg1IDI3IDMzLjA1IDI3IEwzMCAyNyBNMy41IDI3LjE1IFEzIDI2LjcgMyAyNiAzIDI1LjM1IDMuNSAyNC44NSBMMTAuMTUgMTguNDUgUTEwLjQ1IDE4LjE1IDEwLjkgMTguMDUgTDExLjM1IDE4IFExMi4wNSAxOCAxMi41IDE4LjQ1IDEzIDE4Ljk1IDEzIDE5LjYgTDEzIDMyLjQgUTEzIDMzLjEgMTIuNSAzMy41NSBMMTEuMzUgMzQgUTEwLjY1IDM0IDEwLjE1IDMzLjU1IEwzLjUgMjcuMTUiLz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwIiBkPSJNMy41IDI3LjE1IEwxMC4xNSAzMy41NSBRMTAuNjUgMzQgMTEuMzUgMzQgTDEyLjUgMzMuNTUgUTEzIDMzLjEgMTMgMzIuNCBMMTMgMTkuNiBRMTMgMTguOTUgMTIuNSAxOC40NSAxMi4wNSAxOCAxMS4zNSAxOCBMMTAuOSAxOC4wNSBRMTAuNDUgMTguMTUgMTAuMTUgMTguNDUgTDMuNSAyNC44NSBRMyAyNS4zNSAzIDI2IDMgMjYuNyAzLjUgMjcuMTUgTTE2IDI2LjEgTDE2IDMyLjQgUTE2IDM0LjEgMTQuOTUgMzUuMyBMMTQuNSAzNS43NSBRMTMuMjUgMzcgMTEuMzUgMzcgMTAuMDUgMzcgOSAzNi40IEw4LjE1IDM1Ljc1IDguMDUgMzUuNyAxLjQgMjkuMyBRMCAyOCAwIDI2IC0wLjA1IDI0LjE1IDEuMzUgMjIuNyBMMS40IDIyLjcgOC4wNSAxNi4zIDguMTUgMTYuMiBROS41IDE1IDExLjM1IDE1IDEyLjM1IDE1IDEzLjE1IDE1LjM1IDEzLjk1IDE1LjY1IDE0LjYgMTYuMyAxNS42IDE3LjMgMTUuOSAxOC41NSBMMTYgMTkuNiAxNiAyNi4wNSAxNiAyNi4xIi8+CiAgPC9nPgo8L3N2Zz4=',
  universal__xbox_stick_r_right: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwIiBkPSJNNTAuODUgMTUuMzUgUTUxLjY1IDE1IDUyLjY1IDE1IDU0LjUgMTUgNTUuODUgMTYuMiBMNTUuOTUgMTYuMyA2Mi42IDIyLjcgNjIuNjUgMjIuNyBRNjQuMDUgMjQuMTUgNjQgMjYgNjQgMjggNjIuNiAyOS4zIEw1NS45NSAzNS43IDU1Ljg1IDM1Ljc1IDU1IDM2LjQgUTUzLjk1IDM3IDUyLjY1IDM3IDUwLjc1IDM3IDQ5LjUgMzUuNzUgTDQ5LjA1IDM1LjMgUTQ4IDM0LjEgNDggMzIuNCBMNDggMjYuMDUgNDggMjUuOTUgNDggMTkuNiA0OC4xIDE4LjU1IFE0OC40IDE3LjMgNDkuNCAxNi4zIDUwIDE1LjY1IDUwLjg1IDE1LjM1IE02MC41IDI3LjE1IFE2MSAyNi43IDYxIDI2IDYxIDI1LjM1IDYwLjUgMjQuODUgTDUzLjg1IDE4LjQ1IFE1My41IDE4LjE1IDUzLjEgMTguMDUgTDUyLjY1IDE4IFE1MS45NSAxOCA1MS41IDE4LjQ1IDUxIDE4Ljk1IDUxIDE5LjYgTDUxIDMyLjQgUTUxIDMzLjEgNTEuNSAzMy41NSA1MS45NSAzNCA1Mi42NSAzNCBMNTMuODUgMzMuNTUgNjAuNSAyNy4xNSIvPgogICAgPHBhdGggc3Ryb2tlPSJub25lIiBmaWxsPSIjRkZGRkZGIiBkPSJNNjAuNSAyNy4xNSBMNTMuODUgMzMuNTUgNTIuNjUgMzQgUTUxLjk1IDM0IDUxLjUgMzMuNTUgNTEgMzMuMSA1MSAzMi40IEw1MSAxOS42IFE1MSAxOC45NSA1MS41IDE4LjQ1IDUxLjk1IDE4IDUyLjY1IDE4IEw1My4xIDE4LjA1IFE1My41IDE4LjE1IDUzLjg1IDE4LjQ1IEw2MC41IDI0Ljg1IFE2MSAyNS4zNSA2MSAyNiA2MSAyNi43IDYwLjUgMjcuMTUgTTU1IDM2LjQgUTUzLjM1IDQwLjggNDguOTUgNDQuMyA0Ni4yIDQ2LjU1IDQzIDQ3LjkgTDQzIDUwIFE0MyA1Mi41IDM5Ljc1IDU0LjI1IDM2LjU1IDU2IDMyIDU2IDI3LjUgNTYgMjQuMjUgNTQuMjUgMjEgNTIuNSAyMSA1MCBMMjEgNDcuOSBRMTcuOCA0Ni41NSAxNSA0NC4zIDggMzguNyA4IDMwLjY1IEw4IDMwLjEgOCAyOS41NSA4IDI5IDggMjguNSA4IDI4LjEgOCAyNy45NSA4IDI3LjQgUTggMTkuNCAxNSAxMy42NSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxMy42NSBMNTAuODUgMTUuMzUgUTUwIDE1LjY1IDQ5LjQgMTYuMyA0OC40IDE3LjMgNDguMSAxOC41NSBMNDYuNTUgMTcuMSBRNDAuNTUgMTIuMyAzMiAxMi4zIDIzLjQ1IDEyLjMgMTcuNCAxNy4xIEwxNy40NSAxNy4xIFExMi4xNSAyMS40IDEyIDI3LjQgMTIuMSAzMy40NSAxNy40IDM3LjY1IDIzLjQ1IDQyLjUgMzIgNDIuNSA0MC41NSA0Mi41IDQ2LjU1IDM3LjcgTDQ2LjYgMzcuNjUgNDkuMDUgMzUuMyA0OS41IDM1Ljc1IFE1MC43NSAzNyA1Mi42NSAzNyA1My45NSAzNyA1NSAzNi40IE00OCAyNS45NSBMNDggMjYuMDUgUTQ3LjcgMzAgNDQuMiAzMi45IEw0NCAzMy4wNSBRMzkuMDUgMzcgMzIgMzcgMjQuODUgMzcgMTkuOCAzMi45NSBMMTkuNyAzMi45IFExNi4zIDMwIDE2IDI2LjEgTDE2IDI2LjA1IFExNi4yNSAyMiAxOS44NSAxOSBMMTkuOTUgMTguOSBRMjUgMTUgMzIgMTUgMzkuMTUgMTUgNDQuMiAxOSBMNDQuMTUgMTkgUTQ3LjcgMjIgNDggMjUuOTUgTTMzIDMwIEwzNCAyOS45IDM0IDMwIDM1IDMzIDM4IDMzIDM2LjUgMjguNSBRMzggMjcuMDUgMzggMjUgMzggMjIuOTUgMzYuNSAyMS40NSAzNS4wNSAyMCAzMyAyMCBMMjcgMjAgMjcgMzMgMzAgMzMgMzAgMzAgMzMgMzAgTTMwIDI3IEwzMCAyMyAzMyAyMyBRMzMuODUgMjMgMzQuNCAyMy41NSAzNSAyNC4xNSAzNSAyNSAzNSAyNS44NSAzNC40IDI2LjQgMzMuODUgMjcgMzMuMDUgMjcgTDMwIDI3Ii8+CiAgPC9nPgo8L3N2Zz4=',
  universal__xbox_stick_r_up: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwIiBkPSJNNDMgMTAuMSBMNDMgMTAuMzUgUTQzIDEyLjM1IDQxLjcgMTMuNiBMNDEuMyAxNCBRNDAgMTUuMDUgMzguNCAxNSBMMzIuOCAxNSAzMS4yIDE1IDI1LjYgMTUgUTIzLjkgMTUgMjIuNzUgMTQgTDIyLjI1IDEzLjUgUTIxIDEyLjI1IDIxIDEwLjM1IEwyMSAxMC4xIFEyMS4xIDguNCAyMi4yNSA3LjE1IEwyMi4zIDcuMDUgMjguNyAwLjQgUTMwIC0xIDMyIC0xIDMzLjg1IC0xLjA1IDM1LjMgMC4zNSBMMzUuMyAwLjQgNDEuNyA3LjA1IDQxLjggNy4xNSBRNDIuOSA4LjQgNDMgMTAuMSBNMzAuODUgMi41IEwyNC40NSA5LjE1IFEyNCA5LjY1IDI0IDEwLjM1IDI0IDExLjA1IDI0LjQ1IDExLjUgMjQuOSAxMiAyNS42IDEyIEwzOC40IDEyIFEzOS4wNSAxMiAzOS41NSAxMS41IDQwIDExLjA1IDQwIDEwLjM1IDQwIDkuNjUgMzkuNTUgOS4xNSBMMzMuMTUgMi41IFEzMi42NSAyIDMyIDIgMzEuMyAyIDMwLjg1IDIuNSIvPgogICAgPHBhdGggc3Ryb2tlPSJub25lIiBmaWxsPSIjRkZGRkZGIiBkPSJNMzAuODUgMi41IFEzMS4zIDIgMzIgMiAzMi42NSAyIDMzLjE1IDIuNSBMMzkuNTUgOS4xNSBRNDAgOS42NSA0MCAxMC4zNSA0MCAxMS4wNSAzOS41NSAxMS41IDM5LjA1IDEyIDM4LjQgMTIgTDI1LjYgMTIgUTI0LjkgMTIgMjQuNDUgMTEuNSAyNCAxMS4wNSAyNCAxMC4zNSAyNCA5LjY1IDI0LjQ1IDkuMTUgTDMwLjg1IDIuNSBNNDEuMyAxNCBMNDEuNyAxMy42IFE0MyAxMi4zNSA0MyAxMC4zNSBMNDMgMTAuMSBRNDYuMiAxMS40IDQ4Ljk1IDEzLjY1IDU2IDE5LjQgNTYgMjcuNCBMNTYgMjcuOTUgNTYgMjguMSA1NiAyOC41IDU2IDI5IDU2IDI5LjU1IDU2IDMwLjEgNTYgMzAuNjUgUTU2IDM4LjcgNDguOTUgNDQuMyA0Ni4yIDQ2LjU1IDQzIDQ3LjkgTDQzIDUwIFE0MyA1Mi41IDM5Ljc1IDU0LjI1IDM2LjU1IDU2IDMyIDU2IDI3LjUgNTYgMjQuMjUgNTQuMjUgMjEgNTIuNSAyMSA1MCBMMjEgNDcuOSBRMTcuOCA0Ni41NSAxNSA0NC4zIDggMzguNyA4IDMwLjY1IEw4IDMwLjEgOCAyOS41NSA4IDI5IDggMjguNSA4IDI4LjEgOCAyNy45NSA4IDI3LjQgUTggMTkuNCAxNSAxMy42NSAxNy44IDExLjQgMjEgMTAuMSBMMjEgMTAuMzUgUTIxIDEyLjI1IDIyLjI1IDEzLjUgTDIyLjc1IDE0IFExOS44NSAxNS4xNSAxNy40IDE3LjEgTDE3LjQ1IDE3LjEgUTEyLjE1IDIxLjQgMTIgMjcuNCAxMi4xIDMzLjQ1IDE3LjQgMzcuNjUgMjMuNDUgNDIuNSAzMiA0Mi41IDQwLjU1IDQyLjUgNDYuNTUgMzcuNyBMNDYuNiAzNy42NSBRNTEuOSAzMy40IDUyIDI3LjQgNTEuODUgMjEuNCA0Ni41NSAxNy4xIDQ0LjEgMTUuMTUgNDEuMyAxNCBNMzEuMiAxNSBMMzIuOCAxNSBRMzkuNDUgMTUuMjUgNDQuMiAxOSBMNDQuMTUgMTkgUTQ3LjcgMjIgNDggMjUuOTUgTDQ4IDI2LjA1IFE0Ny43IDMwIDQ0LjIgMzIuOSBMNDQgMzMuMDUgUTM5LjA1IDM3IDMyIDM3IDI0Ljg1IDM3IDE5LjggMzIuOTUgTDE5LjcgMzIuOSBRMTYuMyAzMCAxNiAyNi4xIEwxNiAyNi4wNSBRMTYuMjUgMjIgMTkuODUgMTkgTDE5Ljk1IDE4LjkgUTI0LjcgMTUuMiAzMS4yIDE1IE0zMCAyNyBMMzAgMjMgMzMgMjMgUTMzLjg1IDIzIDM0LjQgMjMuNTUgMzUgMjQuMTUgMzUgMjUgMzUgMjUuODUgMzQuNCAyNi40IDMzLjg1IDI3IDMzLjA1IDI3IEwzMCAyNyBNMzMgMzAgTDM0IDI5LjkgMzQgMzAgMzUgMzMgMzggMzMgMzYuNSAyOC41IFEzOCAyNy4wNSAzOCAyNSAzOCAyMi45NSAzNi41IDIxLjQ1IDM1LjA1IDIwIDMzIDIwIEwyNyAyMCAyNyAzMyAzMCAzMyAzMCAzMCAzMyAzMCIvPgogIDwvZz4KPC9zdmc+',
  universal__xbox_stick_side_l: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyIDI0IEw1MiAyNCBRNTYgMjQgNTYgMjggTDU2IDMyLjMgUTU1LjkgMzUuNCA1My43IDM3LjcgNTEuNCAzOS45IDQ4LjI1IDQwIEw0NCA0MCA0NCA1MiBRNDQgNTUuODUgNDAuMjUgNTYgTDIzLjc1IDU2IFEyMCA1NS44NSAyMCA1MiBMMjAgNDAgMTUuNzUgNDAgUTEyLjYgMzkuOSAxMC40IDM3LjcgOC4wNSAzNS4zNSA4IDMyLjE1IEw4IDI4IFE4IDI0IDEyIDI0IE0zMC44NSAxNy41IEwyNC40NSAxMC44NSBRMjQgMTAuMzUgMjQgOS42NSAyNCA4Ljk1IDI0LjQ1IDguNSAyNC45IDggMjUuNiA4IEwzOC40IDggUTM5LjA1IDggMzkuNTUgOC41IDQwIDguOTUgNDAgOS42NSA0MCAxMC4zNSAzOS41NSAxMC44NSBMMzMuMTUgMTcuNSBRMzIuNjUgMTggMzIgMTggMzEuMyAxOCAzMC44NSAxNy41IE0zMSA0MiBMMzEgMzIgMjggMzIgMjggNDUgMzcgNDUgMzcgNDIgMzEgNDIiLz4KICA8L2c+Cjwvc3ZnPg==',
  universal__xbox_stick_side_r: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTExLjc1IDM4IFE4LjEgMzcuOSA4IDM0LjI1IEw4IDMxLjc1IFE4LjEgMjguNiAxMC40IDI2LjMgMTIuNiAyNC4xIDE1Ljc1IDI0IEw0OC4yNSAyNCBRNTEuNCAyNC4xIDUzLjcgMjYuMyA1NS45IDI4LjYgNTYgMzEuNyBMNTYgMzQuMjUgUTU1LjkgMzcuOSA1Mi4yNSAzOCBMNDYgMzggNDYgNTIgUTQ2IDU1Ljg1IDQyLjI1IDU2IEwyMS43NSA1NiBRMTggNTUuODUgMTggNTIgTDE4IDM4IDExLjc1IDM4IE0zMC44NSAxNy41IEwyNC40NSAxMC44NSBRMjQgMTAuMzUgMjQgOS42NSAyNCA4Ljk1IDI0LjQ1IDguNSAyNC45IDggMjUuNiA4IEwzOC40IDggUTM5LjA1IDggMzkuNTUgOC41IDQwIDguOTUgNDAgOS42NSA0MCAxMC4zNSAzOS41NSAxMC44NSBMMzMuMTUgMTcuNSBRMzIuNjUgMTggMzIgMTggMzEuMyAxOCAzMC44NSAxNy41IE0yOSAzOSBMMjkgMzUgMzIgMzUgUTMyLjg1IDM1IDMzLjQgMzUuNTUgMzQgMzYuMTUgMzQgMzcgMzQgMzcuODUgMzMuNCAzOC40IDMyLjg1IDM5IDMyLjA1IDM5IEwyOSAzOSBNMzIgNDIgTDMzIDQxLjkgMzMgNDIgMzQgNDUgMzcgNDUgMzUuNSA0MC41IFEzNyAzOS4wNSAzNyAzNyAzNyAzNC45NSAzNS41IDMzLjQ1IDM0LjA1IDMyIDMyIDMyIEwyNiAzMiAyNiA0NSAyOSA0NSAyOSA0MiAzMiA0MiIvPgogIDwvZz4KPC9zdmc+',
  xbox__xbox_button_color_a: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iIzdEQjcwMCIgZD0iTTU2IDMyIFE1NiA0MiA0OC45NSA0OC45NSA0MiA1NiAzMiA1NiAyMi4wNSA1NiAxNSA0OC45NSA4IDQyIDggMzIgOCAyMi4wNSAxNSAxNSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxNSA1NiAyMi4wNSA1NiAzMiBNMzggNDIgTDQyIDQyIDM0IDIyIDMwIDIyIDIyIDQyIDI2IDQyIDI3LjYgMzggMzYuNCAzOCAzOCA0MiBNMzIgMjcgTDM0LjggMzQgMjkuMiAzNCAzMiAyNyIvPgogIDwvZz4KPC9zdmc+',
  xbox__xbox_button_color_b: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0VGNEUyOSIgZD0iTTU2IDMyIFE1NiA0MiA0OC45NSA0OC45NSA0MiA1NiAzMiA1NiAyMi4wNSA1NiAxNSA0OC45NSA4IDQyIDggMzIgOCAyMi4wNSAxNSAxNSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxNSA1NiAyMi4wNSA1NiAzMiBNMzcgMjggUTM3IDI4Ljg1IDM2LjQ1IDI5LjQgTDM2LjQgMjkuNCBRMzUuOCAzMCAzNSAzMCBMMjkgMzAgMjkgMjYgMzUgMjYgUTM1LjggMjYgMzYuMzUgMjYuNTUgTDM2LjQ1IDI2LjY1IFEzNyAyNy4yIDM3IDI4IE00MSAzNiBRNDEgMzMuNyAzOS41IDMyIDQxIDMwLjMgNDEgMjggNDEgMjUuNTUgMzkuMjUgMjMuOCBMMzkuMiAyMy43NSBRMzcuNDUgMjIgMzUgMjIgTDI1IDIyIDI1IDQyIDM1IDQyIFEzNy40NSA0MiAzOS4yIDQwLjI1IEwzOS4yNSA0MC4yIFE0MSAzOC40NSA0MSAzNiBNMzcgMzYgUTM3IDM2LjggMzYuNDUgMzcuMzUgTDM2LjM1IDM3LjQ1IFEzNS44IDM4IDM1IDM4IEwyOSAzOCAyOSAzNCAzNSAzNCBRMzUuOCAzNCAzNi40IDM0LjYgTDM2LjQ1IDM0LjYgUTM3IDM1LjE1IDM3IDM2Ii8+CiAgPC9nPgo8L3N2Zz4=',
  xbox__xbox_button_color_x: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iIzAwOUZFQiIgZD0iTTU2IDMyIFE1NiA0MiA0OC45NSA0OC45NSA0MiA1NiAzMiA1NiAyMi4wNSA1NiAxNSA0OC45NSA4IDQyIDggMzIgOCAyMi4wNSAxNSAxNSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxNSA1NiAyMi4wNSA1NiAzMiBNMjMgMjUgTDI5IDMyIDIzIDM5IDIzIDQwIDI1LjI1IDQyIDI2LjQgNDIgMzIgMzUuNSAzNy42NSA0MiAzOC43NSA0MiA0MSA0MCA0MSAzOSAzNSAzMiA0MSAyNSA0MSAyNCAzOC43NSAyMiAzNy42NSAyMiAzMiAyOC41NSAyNi40IDIyIDI1LjI1IDIyIDIzIDI0IDIzIDI1Ii8+CiAgPC9nPgo8L3N2Zz4=',
  xbox__xbox_button_color_y: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZFQjUwNCIgZD0iTTU2IDMyIFE1NiA0MiA0OC45NSA0OC45NSA0MiA1NiAzMiA1NiAyMi4wNSA1NiAxNSA0OC45NSA4IDQyIDggMzIgOCAyMi4wNSAxNSAxNSAyMi4wNSA4IDMyIDggNDIgOCA0OC45NSAxNSA1NiAyMi4wNSA1NiAzMiBNMjMgMjUgTDMwIDMyLjkgMzAgNDIgMzQgNDIgMzQgMzIuOSA0MSAyNSA0MSAyNCAzOC43NSAyMiAzNy42NSAyMiAzMiAyOC41NSAyNi40IDIyIDI1LjI1IDIyIDIzIDI0IDIzIDI1Ii8+CiAgPC9nPgo8L3N2Zz4=',
  xbox__xbox_button_menu: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTIxIDIyIEwyMSAyNiA0MyAyNiA0MyAyMiAyMSAyMiBNNTYgMzIgUTU2IDQyIDQ4Ljk1IDQ4Ljk1IDQyIDU2IDMyIDU2IDIyLjA1IDU2IDE1IDQ4Ljk1IDggNDIgOCAzMiA4IDIyLjA1IDE1IDE1IDIyLjA1IDggMzIgOCA0MiA4IDQ4Ljk1IDE1IDU2IDIyLjA1IDU2IDMyIE0yMSAzOCBMMjEgNDIgNDMgNDIgNDMgMzggMjEgMzggTTIxIDMwIEwyMSAzNCA0MyAzNCA0MyAzMCAyMSAzMCIvPgogIDwvZz4KPC9zdmc+',
  xbox__xbox_button_share: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTQwIDMxIEw0MCAzNyAyNCAzNyAyNCAzMSAyMSAzMSAyMSAzOSAyMiA0MCA0MiA0MCA0MyAzOSA0MyAzMSA0MCAzMSBNMzAgMzAgTDMwIDM0IDM0IDM0IDM0IDMwIDM3IDMwIDM3IDI5IDMyIDI0IDI3IDI5IDI3IDMwIDMwIDMwIE0yNCAxNiBMNDAgMTYgUTQzLjIgMTYgNDUuOTUgMTcuMSA0OC44NSAxOC4yNSA1MS4zIDIwLjcgNTYgMjUuNCA1NiAzMiA1NiAzOC42IDUxLjMgNDMuMyA0Ni42IDQ4IDQwIDQ4IEwyNCA0OCBRMTcuNCA0OCAxMi43IDQzLjMgOCAzOC42IDggMzIgOCAyNS40IDEyLjcgMjAuNyAxNS4xNSAxOC4yNSAxOC4wNSAxNy4xIDIwLjggMTYgMjQgMTYiLz4KICA8L2c+Cjwvc3ZnPg==',
  xbox__xbox_button_start: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTMxIDI5LjggUTMxIDI5LjQ1IDMxLjI1IDI5LjIgTDMxLjIgMjkuMyBRMzEuNTUgMjkgMzIgMjkgMzIuNDUgMjkgMzIuNzUgMjkuMyBMMzIuNzUgMjkuMjUgMzMgMjkuOCAzMyAzMiAzMSAzMiAzMSAyOS44IE0yOSAyOS44IEwyOSAzNiBRMjkgMzYuNCAyOS4zIDM2LjcgTDMwIDM3IFEzMC40IDM3IDMwLjcgMzYuNyBMMzEgMzYgMzEgMzQgMzMgMzQgMzMgMzYgUTMzIDM2LjQgMzMuMyAzNi43IEwzNCAzNyBRMzQuNCAzNyAzNC43IDM2LjcgTDM1IDM2IDM1IDI5LjggUTM1IDI4LjY1IDM0LjEgMjcuOCBMMzQuMDUgMjcuNzUgUTMzLjE1IDI3IDMyIDI3IDMwLjc1IDI3IDI5LjkgMjcuNzUgTDI5Ljg1IDI3LjggUTI5IDI4LjY1IDI5IDI5LjggTTM4IDMzIEwzOC40IDMzIDQwLjEgMzYuNDUgUTQwLjMgMzYuOCA0MC43IDM2Ljk1IEw0MS40NSAzNi45IDQxLjk1IDM2LjM1IDQxLjkgMzUuNTUgNDAuNDUgMzIuNjUgNDEuMSAzMi4xNSA0MS4xIDMyLjEgUTQyIDMxLjI1IDQyIDMwIDQyIDI4Ljc1IDQxLjEgMjcuODUgNDAuMjUgMjcgMzkuMDUgMjcgTDM3IDI3IFEzNi42IDI3IDM2LjMgMjcuMyAzNiAyNy42IDM2IDI4IEwzNiAzNiBRMzYgMzYuNCAzNi4zIDM2LjcgTDM3IDM3IDM3LjcgMzYuNyAzOCAzNiAzOCAzMyBNMzkuMSAzMSBMMzggMzEgMzggMjkgMzkuMDUgMjkgUTM5LjQ1IDI5IDM5LjcgMjkuMjUgTDQwIDMwIDM5Ljc1IDMwLjcgMzkuNyAzMC43IDM5LjQ1IDMwLjkgMzkuMSAzMSBNNDQgMjkgTDQ1IDI5IDQ1IDM2IFE0NSAzNi40IDQ1LjMgMzYuNyBMNDYgMzcgNDYuNyAzNi43IDQ3IDM2IDQ3IDI5IDQ4IDI5IFE0OC40IDI5IDQ4LjcgMjguNyBMNDkgMjggNDguNyAyNy4zIFE0OC40IDI3IDQ4IDI3IEw0NCAyNyBRNDMuNiAyNyA0My4zIDI3LjMgNDMgMjcuNiA0MyAyOCA0MyAyOC40IDQzLjMgMjguNyA0My42IDI5IDQ0IDI5IE0yNCAxNiBMNDAgMTYgUTQzLjIgMTYgNDUuOTUgMTcuMSA0OC44NSAxOC4yNSA1MS4zIDIwLjcgNTYgMjUuNCA1NiAzMiA1NiAzOC42IDUxLjMgNDMuMyA0Ni42IDQ4IDQwIDQ4IEwyNCA0OCBRMTcuNCA0OCAxMi43IDQzLjMgOCAzOC42IDggMzIgOCAyNS40IDEyLjcgMjAuNyAxNS4xNSAxOC4yNSAxOC4wNSAxNy4xIDIwLjggMTYgMjQgMTYgTTE4IDI5IEwyMCAyOSAyMC43IDI4LjcgMjEgMjggMjAuNyAyNy4zIFEyMC40IDI3IDIwIDI3IEwxOCAyNyBRMTYuOCAyNyAxNS45IDI3LjkgMTUgMjguOCAxNSAzMCAxNSAzMS4yIDE1LjkgMzIuMSAxNi44IDMzIDE3Ljk1IDMzIEwxOC4wNSAzMyBRMTguNCAzMyAxOC43IDMzLjMgTDE5IDM0IDE4LjcgMzQuNyBRMTguNCAzNSAxOCAzNSBMMTYgMzUgUTE1LjYgMzUgMTUuMyAzNS4zIDE1IDM1LjYgMTUgMzYgMTUgMzYuNCAxNS4zIDM2LjcgTDE2IDM3IDE4IDM3IFExOS4yIDM3IDIwLjEgMzYuMSAyMSAzNS4yIDIxIDM0IDIxIDMyLjggMjAuMSAzMS45IDE5LjIgMzEgMTguMDUgMzEgTDE3Ljk1IDMxIFExNy42IDMxIDE3LjMgMzAuNyAxNyAzMC40IDE3IDMwIDE3IDI5LjYgMTcuMyAyOS4zIDE3LjYgMjkgMTggMjkgTTIzIDI5IEwyNCAyOSAyNCAzNiBRMjQgMzYuNCAyNC4zIDM2LjcgTDI1IDM3IDI1LjcgMzYuNyAyNiAzNiAyNiAyOSAyNyAyOSBRMjcuNCAyOSAyNy43IDI4LjcgTDI4IDI4IDI3LjcgMjcuMyBRMjcuNCAyNyAyNyAyNyBMMjMgMjcgUTIyLjYgMjcgMjIuMyAyNy4zIDIyIDI3LjYgMjIgMjggMjIgMjguNCAyMi4zIDI4LjcgMjIuNiAyOSAyMyAyOSIvPgogIDwvZz4KPC9zdmc+',
  xbox__xbox_button_start_icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTI0IDE2IEw0MCAxNiBRNDMuMiAxNiA0NS45NSAxNy4xIDQ4Ljg1IDE4LjI1IDUxLjMgMjAuNyA1NiAyNS40IDU2IDMyIDU2IDM4LjYgNTEuMyA0My4zIDQ2LjYgNDggNDAgNDggTDI0IDQ4IFExNy40IDQ4IDEyLjcgNDMuMyA4IDM4LjYgOCAzMiA4IDI1LjQgMTIuNyAyMC43IDE1LjE1IDE4LjI1IDE4LjA1IDE3LjEgMjAuOCAxNiAyNCAxNiBNMjkgMjUgUTI4LjYgMjUgMjguMyAyNS4zIDI4IDI1LjYgMjggMjYgTDI4IDM4IFEyOCAzOC40IDI4LjMgMzguNyAyOC42IDM5IDI5IDM5IEwzMSAzOSAzMS43IDM4LjcgMzcuNyAzMi43IDM4IDMyIDM3LjcgMzEuMyAzMS43IDI1LjMgUTMxLjQgMjUgMzEgMjUgTDI5IDI1Ii8+CiAgPC9nPgo8L3N2Zz4=',
  xbox__xbox_button_view: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTI4IDQzIEwyOSA0NCA0NCA0NCA0NSA0MyA0NSAzMCA0NCAyOSAyOSAyOSAyOCAzMCAyOCA0MyBNMjAgMzUgTDIxIDM2IDI2IDM2IDI2IDMzIDIzIDMzIDIzIDIzLjk1IDM0IDIzLjk1IDM0IDI3IDM3IDI3IDM3IDIyIDM2IDIxIDIxIDIxIDIwIDIyIDIwIDM1IE01NiAzMiBRNTYgNDIgNDguOTUgNDguOTUgNDIgNTYgMzIgNTYgMjIuMDUgNTYgMTUgNDguOTUgOCA0MiA4IDMyIDggMjIuMDUgMTUgMTUgMjIuMDUgOCAzMiA4IDQyIDggNDguOTUgMTUgNTYgMjIuMDUgNTYgMzIgTTQyIDMyIEw0MiA0MSAzMSA0MSAzMSAzMiA0MiAzMiIvPgogIDwvZz4KPC9zdmc+',
  xbox__xbox_lb: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTQwIDM5IFE0MS42IDM5IDQyLjggMzcuOCA0NCAzNi42NSA0NCAzNSA0NCAzMy42IDQzLjEgMzIuNSA0NCAzMS40NSA0NCAzMCA0NCAyOC40IDQyLjggMjcuMiA0MS42IDI2IDQwIDI2IEwzMyAyNiAzMyAzOSA0MCAzOSBNNDAgMzEgTDM2IDMxIDM2IDI5IDQwIDI5IFE0MC40NSAyOSA0MC43IDI5LjMgTDQxIDMwIDQwLjcgMzAuNyBRNDAuNDUgMzEgNDAgMzEgTTQ4IDE2IFE1NiAxNiA1NiAyNCBMNTYgNDAgUTU2IDQ4IDQ4IDQ4IEwxNiA0OCBROCA0OCA4IDQwIEw4IDMyIFE4IDI1LjQgMTIuNyAyMC43IDE3LjQgMTYgMjQgMTYgTDQ4IDE2IE00MCAzNiBMMzYgMzYgMzYgMzQgNDAgMzQgUTQwLjQ1IDM0IDQwLjcgMzQuMyBMNDEgMzUgNDAuNyAzNS43IFE0MC40NSAzNiA0MCAzNiBNMjQgMzYgTDI0IDI2IDIxIDI2IDIxIDM5IDMwIDM5IDMwIDM2IDI0IDM2Ii8+CiAgPC9nPgo8L3N2Zz4=',
  xbox__xbox_rb: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTQwIDM5IFE0MS42IDM5IDQyLjggMzcuOCA0NCAzNi42NSA0NCAzNSA0NCAzMy42IDQzLjEgMzIuNSA0NCAzMS40NSA0NCAzMCA0NCAyOC40IDQyLjggMjcuMiA0MS42IDI2IDQwIDI2IEwzMyAyNiAzMyAzOSA0MCAzOSBNNDAgMzEgTDM2IDMxIDM2IDI5IDQwIDI5IFE0MC40NSAyOSA0MC43IDI5LjMgTDQxIDMwIDQwLjcgMzAuNyBRNDAuNDUgMzEgNDAgMzEgTTE2IDE2IEw0MCAxNiBRNDYuNiAxNiA1MS4zIDIwLjcgNTYgMjUuNCA1NiAzMiBMNTYgNDAgUTU2IDQ4IDQ4IDQ4IEwxNiA0OCBROCA0OCA4IDQwIEw4IDI0IFE4IDE2IDE2IDE2IE00MCAzNiBMMzYgMzYgMzYgMzQgNDAgMzQgUTQwLjQ1IDM0IDQwLjcgMzQuMyBMNDEgMzUgNDAuNyAzNS43IFE0MC40NSAzNiA0MCAzNiBNMjUgMzYgTDI2IDM1LjkgMjYgMzYgMjcgMzkgMzAgMzkgMjguNSAzNC41IFEzMCAzMy4wNSAzMCAzMSAzMCAyOC45NSAyOC41IDI3LjQ1IDI3LjA1IDI2IDI1IDI2IEwxOSAyNiAxOSAzOSAyMiAzOSAyMiAzNiAyNSAzNiBNMjIgMzMgTDIyIDI5IDI1IDI5IFEyNS44NSAyOSAyNi40IDI5LjU1IDI3IDMwLjE1IDI3IDMxIDI3IDMxLjg1IDI2LjQgMzIuNCAyNS44NSAzMyAyNS4wNSAzMyBMMjIgMzMiLz4KICA8L2c+Cjwvc3ZnPg==',
  xbox__xbox_lt: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTM3IDM2IEw0MSAzNiA0MSAyMyA0NiAyMyA0NiAxOSAzMiAxOSAzMiAyMyAzNyAyMyAzNyAzNiBNMTggMTkgTDE4IDM2IDMwIDM2IDMwIDMyIDIyIDMyIDIyIDE5IDE4IDE5IE0xNS43IDU0IFE4IDUzLjg1IDggNDYgTDggMTggUTggMTAgMTYgMTAgTDQ4IDEwIFE1NiAxMCA1NiAxOCBMNTYgMzEuMDUgUTU1LjY1IDQwLjMgNDguOTUgNDcgNDIuMTUgNTMuOCAzMi42NSA1NCBMMTUuNyA1NCIvPgogIDwvZz4KPC9zdmc+',
  xbox__xbox_rt: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzLz4KICA8Zz4KICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTM4IDM2IEw0MiAzNiA0MiAyMyA0NyAyMyA0NyAxOSAzMyAxOSAzMyAyMyAzOCAyMyAzOCAzNiBNNDguMyA1NCBMMzEuMzUgNTQgUTIxLjg1IDUzLjggMTUuMDUgNDcgOC4zNSA0MC4zIDggMzEuMDUgTDggMTggUTggMTAgMTYgMTAgTDQ4IDEwIFE1NiAxMCA1NiAxOCBMNTYgNDYgUTU2IDUzLjg1IDQ4LjMgNTQgTTI1IDIzIFEyNS44IDIzIDI2LjQgMjMuNiAyNyAyNC4yIDI3IDI1IDI3IDI1LjggMjYuNDUgMjYuMzUgTDI2LjM1IDI2LjQ1IFEyNS44IDI3IDI1IDI3IEwyMiAyNyAyMiAyMyAyNSAyMyBNMTggMTkgTDE4IDM2IDIyIDM2IDIyIDMxIDI1IDMxIDI3LjUgMzYgMzEuNSAzNiAyOC40NSAyOS45IDI5LjIgMjkuMjUgMjkuMjUgMjkuMiBRMzEgMjcuNDUgMzEgMjUgMzEgMjIuNSAyOS4yNSAyMC43NSAyNy41IDE5IDI1IDE5IEwxOCAxOSIvPgogIDwvZz4KPC9zdmc+',
};

const PLATFORM_ICONS = {
  xbox: {
    // universal
    dup:     _SVG.universal__playstation_dpad_up,
    ddown:   _SVG.universal__playstation_dpad_down,
    dleft:   _SVG.universal__playstation_dpad_left,
    dright:  _SVG.universal__playstation_dpad_right,
    lsu:     _SVG.universal__xbox_stick_l_up,
    lsd:     _SVG.universal__xbox_stick_l_down,
    lsl:     _SVG.universal__xbox_stick_l_left,
    lsr:     _SVG.universal__xbox_stick_l_right,
    csu:     _SVG.universal__xbox_stick_r_up,
    csd:     _SVG.universal__xbox_stick_r_down,
    csl:     _SVG.universal__xbox_stick_r_left,
    csr:     _SVG.universal__xbox_stick_r_right,
    ls:      _SVG.universal__xbox_stick_side_l,
    rs:      _SVG.universal__xbox_stick_side_r,
    home:    _SVG.universal__switch_button_home,
    // xbox-specific
    a:       _SVG.xbox__xbox_button_color_a,
    b:       _SVG.xbox__xbox_button_color_b,
    x:       _SVG.xbox__xbox_button_color_x,
    y:       _SVG.xbox__xbox_button_color_y,
    lb:      _SVG.xbox__xbox_lb,
    rb:      _SVG.xbox__xbox_rb,
    lt:      _SVG.xbox__xbox_lt,
    rt:      _SVG.xbox__xbox_rt,
    start:   _SVG.xbox__xbox_button_menu,
    select:  _SVG.xbox__xbox_button_view,
    capture: _SVG.xbox__xbox_button_share,
  },
  playstation: {
    // universal
    dup:     _SVG.universal__playstation_dpad_up,
    ddown:   _SVG.universal__playstation_dpad_down,
    dleft:   _SVG.universal__playstation_dpad_left,
    dright:  _SVG.universal__playstation_dpad_right,
    lsu:     _SVG.universal__xbox_stick_l_up,
    lsd:     _SVG.universal__xbox_stick_l_down,
    lsl:     _SVG.universal__xbox_stick_l_left,
    lsr:     _SVG.universal__xbox_stick_l_right,
    csu:     _SVG.universal__xbox_stick_r_up,
    csd:     _SVG.universal__xbox_stick_r_down,
    csl:     _SVG.universal__xbox_stick_r_left,
    csr:     _SVG.universal__xbox_stick_r_right,
    ls:      _SVG.universal__xbox_stick_side_l,
    rs:      _SVG.universal__xbox_stick_side_r,
    home:    _SVG.universal__switch_button_home,
    // playstation-specific
    a:       _SVG.ps__playstation_button_color_cross,
    b:       _SVG.ps__playstation_button_color_circle,
    x:       _SVG.ps__playstation_button_color_square,
    y:       _SVG.ps__playstation_button_color_triangle,
    start:   _SVG.ps__playstation4_button_options,
    select:  _SVG.ps__playstation4_touchpad,
    capture: _SVG.ps__playstation4_button_share,
    lb:      _SVG.ps__playstation_trigger_l1_alternative,
    rb:      _SVG.ps__playstation_trigger_r1_alternative,
    lt:      _SVG.ps__playstation_trigger_l2_alternative,
    rt:      _SVG.ps__playstation_trigger_r2_alternative,
  },
  switch: {
    // universal
    dup:     _SVG.universal__playstation_dpad_up,
    ddown:   _SVG.universal__playstation_dpad_down,
    dleft:   _SVG.universal__playstation_dpad_left,
    dright:  _SVG.universal__playstation_dpad_right,
    lsu:     _SVG.universal__xbox_stick_l_up,
    lsd:     _SVG.universal__xbox_stick_l_down,
    lsl:     _SVG.universal__xbox_stick_l_left,
    lsr:     _SVG.universal__xbox_stick_l_right,
    csu:     _SVG.universal__xbox_stick_r_up,
    csd:     _SVG.universal__xbox_stick_r_down,
    csl:     _SVG.universal__xbox_stick_r_left,
    csr:     _SVG.universal__xbox_stick_r_right,
    ls:      _SVG.universal__xbox_stick_side_l,
    rs:      _SVG.universal__xbox_stick_side_r,
    home:    _SVG.universal__switch_button_home,
    // switch-specific
    a:       _SVG.switch__switch_button_a,
    b:       _SVG.switch__switch_button_b,
    x:       _SVG.switch__switch_button_x,
    y:       _SVG.switch__switch_button_y,
    lb:      _SVG.switch__switch_button_l,
    rb:      _SVG.switch__switch_button_r,
    lt:      _SVG.switch__switch_button_zl,
    rt:      _SVG.switch__switch_button_zr,
    start:   _SVG.switch__switch_button_plus,
    select:  _SVG.switch__switch_button_minus,
    capture: _SVG.switch__switch_button_sync,
  },
  // N64 borrows GC's face buttons, Z, C-stick, D-pad, and menu icons; trigger
  // icons come from Switch (single-letter L / R). Left stick / clicks / home
  // stay universal across all platform styles.
  n64: {
    // Face buttons (from GameCube)
    a:       _SVG.gc__gamecube_button_color_a,
    b:       _SVG.gc__gamecube_button_color_b,
    // X/Y don't exist on the N64 — keep GC's as a safe fallback for cross-mode use
    x:       _SVG.gc__gamecube_button_x_tilted,
    y:       _SVG.gc__gamecube_button_y_tilted,
    // Z (from GameCube)
    rb:      _SVG.gc__gamecube_button_z,
    // L / R (from Switch)
    lt:      _SVG.switch__switch_button_l,
    rt:      _SVG.switch__switch_button_r,
    // C-buttons (from GameCube)
    csu:     _SVG.gc__gamecube_stick_c_color_up,
    csd:     _SVG.gc__gamecube_stick_c_color_down,
    csl:     _SVG.gc__gamecube_stick_c_color_left,
    csr:     _SVG.gc__gamecube_stick_c_color_right,
    // D-pad (from GameCube)
    dup:     _SVG.gc__gamecube_dpad_up,
    ddown:   _SVG.gc__gamecube_dpad_down,
    dleft:   _SVG.gc__gamecube_dpad_left,
    dright:  _SVG.gc__gamecube_dpad_right,
    // Menu buttons (matching GameCube's choices)
    start:   _SVG.gc__gamecube_button_start,
    select:  _SVG.switch__switch_button_minus,
    capture: _SVG.switch__switch_button_sync,
    // Universal left stick + clicks + home
    lsu:     _SVG.universal__xbox_stick_l_up,
    lsd:     _SVG.universal__xbox_stick_l_down,
    lsl:     _SVG.universal__xbox_stick_l_left,
    lsr:     _SVG.universal__xbox_stick_l_right,
    ls:      _SVG.universal__xbox_stick_side_l,
    rs:      _SVG.universal__xbox_stick_side_r,
    home:    _SVG.universal__switch_button_home,
  },
  // GC uses its own dpad and C-stick; left stick + clicks + home use universal.
  gamecube: {
    dup:     _SVG.gc__gamecube_dpad_up,
    ddown:   _SVG.gc__gamecube_dpad_down,
    dleft:   _SVG.gc__gamecube_dpad_left,
    dright:  _SVG.gc__gamecube_dpad_right,
    csu:     _SVG.gc__gamecube_stick_c_color_up,
    csd:     _SVG.gc__gamecube_stick_c_color_down,
    csl:     _SVG.gc__gamecube_stick_c_color_left,
    csr:     _SVG.gc__gamecube_stick_c_color_right,
    a:       _SVG.gc__gamecube_button_color_a,
    b:       _SVG.gc__gamecube_button_color_b,
    x:       _SVG.gc__gamecube_button_x_tilted,
    y:       _SVG.gc__gamecube_button_y_tilted,
    rb:      _SVG.gc__gamecube_button_z,
    lt:      _SVG.gc__gamecube_trigger_l,
    rt:      _SVG.gc__gamecube_trigger_r,
    start:   _SVG.gc__gamecube_button_start,
    select:  _SVG.switch__switch_button_minus,
    capture: _SVG.switch__switch_button_sync,
    lsu:     _SVG.universal__xbox_stick_l_up,
    lsd:     _SVG.universal__xbox_stick_l_down,
    lsl:     _SVG.universal__xbox_stick_l_left,
    lsr:     _SVG.universal__xbox_stick_l_right,
    ls:      _SVG.universal__xbox_stick_side_l,
    rs:      _SVG.universal__xbox_stick_side_r,
    home:    _SVG.universal__switch_button_home,
  },
};

function getIconPath(platform, outputId) {
  return PLATFORM_ICONS[platform]?.[outputId] ?? null;
}

// Commands (from proto)
const CMD = { GET_DEVICE_INFO:1, SET_DEVICE_INFO:2, GET_CONFIG:3, SET_CONFIG:4, ERROR:5, SUCCESS:6, REBOOT_FW:7, REBOOT_BL:8 };

// ---------------------------------------------------------------------------
// App state
// ---------------------------------------------------------------------------
let config = null;            // current config object (JS/JSON)
let selectedProfileIdx = -1;  // index into config.gameModeConfigs
let selectedBtnId = null;     // physical button id currently selected

let serialPort = null;
let serialReader = null;
let serialWriter = null;
let isConnected = false;

let pbRoot = null;            // protobuf.js root (loaded lazily)

let selectedPlatform = 'xbox';   // 'xbox' | 'playstation' | 'switch' | 'gamecube'
let remapViewMode   = 'simple';  // 'simple' | 'advanced'

// ---------------------------------------------------------------------------
// DOM references
// ---------------------------------------------------------------------------
const $  = id => document.getElementById(id);
const svg = () => $('controller-svg');

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------
function setStatus(msg, type = 'disconnected') {
  const bar = $('status-bar');
  bar.className = `status-bar status-${type}`;
  $('status-text').textContent = msg;
}

// ---------------------------------------------------------------------------
// Protobuf helpers
// ---------------------------------------------------------------------------
async function ensureProtobuf() {
  if (pbRoot) return true;
  if (typeof protobuf === 'undefined') {
    // Try loading dynamically
    try {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/protobufjs@7/dist/protobuf.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    } catch {
      setStatus('protobuf.js failed to load — device communication requires internet access', 'error');
      return false;
    }
  }
  try {
    pbRoot = protobuf.parse(PROTO_DEF, { keepCase: false }).root;
    return true;
  } catch (e) {
    console.error('Proto parse error:', e);
    return false;
  }
}

function configToBinary(cfg) {
  // Strip color entries for buttons with no physical LED (MB2-MB7) so they
  // never reach the device, and scrub cross-field violations that firmware
  // validates (see sanitizeConfigForEncode).
  const safeCfg = sanitizeConfigForEncode(stripDisabledLeds(cfg));
  const Config = pbRoot.lookupType('Config');
  const msg = Config.fromObject(safeCfg);
  const err = Config.verify(msg);
  if (err) throw new Error('Config verify: ' + err);
  return Config.encode(msg).finish();
}

function binaryToConfig(bytes) {
  const Config = pbRoot.lookupType('Config');
  const msg = Config.decode(bytes);
  return Config.toObject(msg, { enums: String, longs: Number, defaults: false });
}

// ---------------------------------------------------------------------------
// COBS encoding/decoding
// ---------------------------------------------------------------------------
function cobsEncode(data) {
  const out = new Uint8Array(data.length + Math.ceil(data.length / 254) + 2);
  let outIdx = 0;
  let codeIdx = 0;
  let code = 1;

  out[outIdx++] = 0; // placeholder
  codeIdx = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i] === 0x00) {
      out[codeIdx] = code;
      codeIdx = outIdx;
      out[outIdx++] = 0;
      code = 1;
    } else {
      out[outIdx++] = data[i];
      code++;
      if (code === 0xFF) {
        out[codeIdx] = 0xFF;
        codeIdx = outIdx;
        out[outIdx++] = 0;
        code = 1;
      }
    }
  }
  out[codeIdx] = code;
  return out.slice(0, outIdx);
}

function cobsDecode(data) {
  const out = [];
  let i = 0;
  while (i < data.length) {
    const code = data[i++];
    for (let j = 1; j < code && i < data.length; j++) {
      out.push(data[i++]);
    }
    if (code < 0xFF && i < data.length) {
      out.push(0x00);
    }
  }
  return new Uint8Array(out);
}

// ---------------------------------------------------------------------------
// WebSerial helpers
// ---------------------------------------------------------------------------
async function serialConnect() {
  if (!('serial' in navigator)) {
    setStatus('WebSerial not supported in this browser. Use Chrome or Edge.', 'error');
    return;
  }
  try {
    serialPort = await navigator.serial.requestPort({ filters: [{ usbVendorId: 0x2E8A, usbProductId: 0x1092 }] });
    await serialPort.open({ baudRate: 115200 });
    isConnected = true;
    $('btn-connect').classList.add('connected');
    $('connect-label').textContent = 'Disconnect';
    $('btn-load').disabled = false;
    $('btn-save').disabled = false;
    setStatus('Connected to Glyph — click Load Config to read profiles', 'connected');
  } catch (e) {
    if (e.name !== 'NotFoundError') {
      setStatus('Connection failed: ' + e.message, 'error');
    }
  }
}

async function serialDisconnect() {
  try {
    if (serialReader) { await serialReader.cancel(); serialReader = null; }
    if (serialWriter) { await serialWriter.close(); serialWriter = null; }
    if (serialPort) { await serialPort.close(); serialPort = null; }
  } catch (_) {}
  isConnected = false;
  $('connect-label').textContent = 'Connect';
  $('btn-load').disabled = true;
  $('btn-save').disabled = true;
  setStatus('Disconnected', 'disconnected');
}

async function sendPacket(writer, cmdId, data = new Uint8Array(0)) {
  const packet = new Uint8Array(1 + data.length);
  packet[0] = cmdId;
  if (data.length) packet.set(data, 1);
  const encoded = cobsEncode(packet);
  const withTerm = new Uint8Array(encoded.length + 1);
  withTerm.set(encoded);
  withTerm[encoded.length] = 0x00;
  await writer.write(withTerm);
}

async function readPacket(port, timeoutMs = 5000) {
  const bytes = [];
  const reader = port.readable.getReader();
  serialReader = reader;
  const timeoutId = setTimeout(() => reader.cancel(), timeoutMs);
  try {
    outer: while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      for (const b of value) {
        if (b === 0x00) { clearTimeout(timeoutId); break outer; }
        bytes.push(b);
      }
    }
  } catch (_) {}
  reader.releaseLock();
  serialReader = null;
  if (!bytes.length) return null;
  return cobsDecode(new Uint8Array(bytes));
}

async function loadConfigFromDevice() {
  if (!isConnected || !serialPort) return;
  if (!await ensureProtobuf()) return;
  setStatus('Loading config from device…', 'loading');
  try {
    const writer = serialPort.writable.getWriter();
    serialWriter = writer;
    await sendPacket(writer, CMD.GET_CONFIG);
    writer.releaseLock();
    serialWriter = null;

    const pkt = await readPacket(serialPort);
    if (!pkt || pkt.length < 1) { setStatus('No response from device', 'error'); return; }
    if (pkt[0] === CMD.ERROR) {
      const msg = new TextDecoder().decode(pkt.slice(1));
      setStatus('Device error: ' + msg, 'error'); return;
    }
    if (pkt[0] !== CMD.SET_CONFIG) { setStatus('Unexpected response: ' + pkt[0], 'error'); return; }
    config = binaryToConfig(pkt.slice(1));
    normalizeSharedIndices(config);
    selectedProfileIdx = config.gameModeConfigs?.length ? 0 : -1;
    renderAll();
    setStatus('Config loaded from device (' + (config.gameModeConfigs?.length || 0) + ' profiles)', 'connected');
  } catch (e) {
    setStatus('Load failed: ' + e.message, 'error');
  }
}

async function saveConfigToDevice() {
  if (!isConnected || !serialPort || !config) return;
  if (!await ensureProtobuf()) return;
  setStatus('Saving config to device…', 'loading');
  try {
    const bytes = configToBinary(config);
    const writer = serialPort.writable.getWriter();
    serialWriter = writer;
    await sendPacket(writer, CMD.SET_CONFIG, bytes);
    writer.releaseLock();
    serialWriter = null;

    const pkt = await readPacket(serialPort);
    if (!pkt || pkt.length < 1) { setStatus('No response after save', 'error'); return; }
    if (pkt[0] === CMD.ERROR) {
      const msg = new TextDecoder().decode(pkt.slice(1));
      setStatus('Save error: ' + msg, 'error'); return;
    }
    if (pkt[0] === CMD.SUCCESS) {
      setStatus('Config saved to device successfully', 'connected');
    }
  } catch (e) {
    setStatus('Save failed: ' + e.message, 'error');
  }
}

// ---------------------------------------------------------------------------
// Default config
// ---------------------------------------------------------------------------
function loadDefaultConfig() {
  // Deep clone from the embedded JSON
  config = JSON.parse(DEFAULT_CONFIG_JSON);
  normalizeSharedIndices(config);
  selectedProfileIdx = 0;
  renderAll();
  setStatus('Loaded default Glyph profiles', 'disconnected');
}

// ---------------------------------------------------------------------------
// JSON import/export
// ---------------------------------------------------------------------------
function exportConfig() {
  if (!config) { alert('No config loaded.'); return; }
  const safeCfg = sanitizeConfigForEncode(stripDisabledLeds(config));
  const blob = new Blob([JSON.stringify(safeCfg, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'glyph-config.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function importConfig(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      config = JSON.parse(e.target.result);
      normalizeSharedIndices(config);
      selectedProfileIdx = config.gameModeConfigs?.length ? 0 : -1;
      renderAll();
      setStatus('Config imported from file (' + (config.gameModeConfigs?.length || 0) + ' profiles)', 'disconnected');
    } catch (err) {
      alert('Failed to parse JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// ---------------------------------------------------------------------------
// Profile helpers
// ---------------------------------------------------------------------------
function currentProfile() {
  if (!config || selectedProfileIdx < 0) return null;
  return config.gameModeConfigs?.[selectedProfileIdx] ?? null;
}

// ---------------------------------------------------------------------------
// RGB / LED helpers
// ---------------------------------------------------------------------------
const DEFAULT_LED_COLOR_INT = 0x22D3EE;          // cyan accent
const DEFAULT_LED_COLOR_HEX = '#22d3ee';

// Keyboard mode — USB HID Usage Page 0x07 scancodes. DInput backend only.
const { EVENT_CODE_TO_HID, HID_TO_LABEL } = (function () {
  const codeToHid = {};
  const hidToLabel = {};
  // A-Z
  for (let i = 0; i < 26; i++) {
    const c = String.fromCharCode(65 + i);
    codeToHid['Key' + c] = 4 + i;
    hidToLabel[4 + i] = c;
  }
  // 1-9, 0
  for (let i = 1; i <= 9; i++) { codeToHid['Digit' + i] = 29 + i; hidToLabel[29 + i] = String(i); }
  codeToHid['Digit0'] = 39; hidToLabel[39] = '0';
  // F1-F12
  for (let i = 1; i <= 12; i++) { codeToHid['F' + i] = 57 + i; hidToLabel[57 + i] = 'F' + i; }
  // Numpad 1-9, 0
  for (let i = 1; i <= 9; i++) { codeToHid['Numpad' + i] = 88 + i; hidToLabel[88 + i] = 'N' + i; }
  codeToHid['Numpad0'] = 98; hidToLabel[98] = 'N0';
  // One-offs
  const SPECIAL = [
    ['Enter',         40, '↵'],   ['Escape',        41, 'ESC'],
    ['Backspace',     42, '⌫'],   ['Tab',           43, '⇥'],
    ['Space',         44, '␣'],   ['Minus',         45, '-'],
    ['Equal',         46, '='],   ['BracketLeft',   47, '['],
    ['BracketRight',  48, ']'],   ['Backslash',     49, '\\'],
    ['Semicolon',     51, ';'],   ['Quote',         52, '\''],
    ['Backquote',     53, '`'],   ['Comma',         54, ','],
    ['Period',        55, '.'],   ['Slash',         56, '/'],
    ['CapsLock',      57, 'CAPS'],['PrintScreen',   70, 'PRTSC'],
    ['ScrollLock',    71, 'SLCK'],['Pause',         72, 'PAUSE'],
    ['Insert',        73, 'INS'], ['Home',          74, 'HOME'],
    ['PageUp',        75, 'PGUP'],['Delete',        76, 'DEL'],
    ['End',           77, 'END'], ['PageDown',      78, 'PGDN'],
    ['ArrowRight',    79, '→'],   ['ArrowLeft',     80, '←'],
    ['ArrowDown',     81, '↓'],   ['ArrowUp',       82, '↑'],
    ['NumLock',       83, 'NUM'], ['NumpadDivide',  84, 'N/'],
    ['NumpadMultiply',85, 'N*'],  ['NumpadSubtract',86, 'N-'],
    ['NumpadAdd',     87, 'N+'],  ['NumpadEnter',   88, 'N↵'],
    ['NumpadDecimal', 99, 'N.'],
    ['ControlLeft', 224, 'LCTRL'], ['ShiftLeft',   225, 'LSHFT'],
    ['AltLeft',     226, 'LALT'],  ['MetaLeft',    227, 'LWIN'],
    ['ControlRight',228, 'RCTRL'], ['ShiftRight',  229, 'RSHFT'],
    ['AltRight',    230, 'RALT'],  ['MetaRight',   231, 'RWIN'],
  ];
  for (const [code, hid, label] of SPECIAL) { codeToHid[code] = hid; hidToLabel[hid] = label; }
  return { EVENT_CODE_TO_HID: codeToHid, HID_TO_LABEL: hidToLabel };
})();

function keycodeToLabel(hid) {
  return HID_TO_LABEL[hid] || ('0x' + (hid >>> 0).toString(16).toUpperCase());
}

// Get the (or lazily create) KeyboardModeConfig for this profile.
// `profile.keyboardModeConfig` is a 1-based index into `config.keyboardModes[]`.
function ensureKeyboardConfig(profile) {
  if (!config) return null;
  if (!Array.isArray(config.keyboardModes)) config.keyboardModes = [];

  const idx = (profile.keyboardModeConfig || 0) - 1;
  if (idx >= 0 && idx < config.keyboardModes.length && config.keyboardModes[idx]) {
    return config.keyboardModes[idx];
  }
  const fresh = { buttonsToKeycodes: [] };
  if (profile.keyboardModeConfig && profile.keyboardModeConfig > 0) {
    while (config.keyboardModes.length < profile.keyboardModeConfig - 1) {
      config.keyboardModes.push({ buttonsToKeycodes: [] });
    }
    if (config.keyboardModes.length === profile.keyboardModeConfig - 1) {
      config.keyboardModes.push(fresh);
    } else {
      config.keyboardModes[profile.keyboardModeConfig - 1] = fresh;
    }
    return fresh;
  }
  config.keyboardModes.push(fresh);
  profile.keyboardModeConfig = config.keyboardModes.length;
  return fresh;
}

function getKeyboardConfig(profile) {
  if (!profile || !config?.keyboardModes) return null;
  const idx = (profile.keyboardModeConfig || 0) - 1;
  if (idx < 0) return null;
  return config.keyboardModes[idx] || null;
}

function getButtonKeycode(profile, btnId) {
  const kb = getKeyboardConfig(profile);
  if (!kb?.buttonsToKeycodes) return null;
  const entry = kb.buttonsToKeycodes.find(b => b.button === btnId);
  return entry ? Number(entry.keycode) : null;
}

function setButtonKeycode(profile, btnId, keycode) {
  const kb = ensureKeyboardConfig(profile);
  if (!kb.buttonsToKeycodes) kb.buttonsToKeycodes = [];
  const i = kb.buttonsToKeycodes.findIndex(b => b.button === btnId);
  if (keycode == null) {
    if (i >= 0) kb.buttonsToKeycodes.splice(i, 1);
  } else if (i >= 0) {
    kb.buttonsToKeycodes[i].keycode = keycode;
  } else {
    kb.buttonsToKeycodes.push({ button: btnId, keycode });
  }
}

function isKeyboardProfile(profile) {
  return profile?.modeId === 'MODE_KEYBOARD';
}

// ---------------------------------------------------------------------------
// Custom mode helpers (customModeConfig is a 1-based index into Config.customModes[])
// ---------------------------------------------------------------------------
function isCustomProfile(profile) {
  return profile?.modeId === 'MODE_CUSTOM';
}

function makeBlankCustomConfig() {
  return {
    digitalButtonMappings: [],
    stickDirectionMappings: [],
    analogTriggerMappings: [],
    modifiers: [],
    // 100 = full XInput / Switch range. Users targeting Melee can drop this
    // to 80, but full range is the more common starting point.
    stickRange: 100,
    buttonComboMappings: [],
  };
}

function ensureCustomConfig(profile) {
  if (!config) return null;
  if (!Array.isArray(config.customModes)) config.customModes = [];

  const idx = (profile.customModeConfig || 0) - 1;
  if (idx >= 0 && idx < config.customModes.length && config.customModes[idx]) {
    return config.customModes[idx];
  }
  // Pad with blank CustomModeConfig objects (NOT nulls) — protobuf encoding
  // rejects null entries, same as the rgbConfigs pattern.
  const fresh = makeBlankCustomConfig();
  if (profile.customModeConfig && profile.customModeConfig > 0) {
    while (config.customModes.length < profile.customModeConfig - 1) {
      config.customModes.push(makeBlankCustomConfig());
    }
    if (config.customModes.length === profile.customModeConfig - 1) {
      config.customModes.push(fresh);
    }
    return fresh;
  }
  config.customModes.push(fresh);
  profile.customModeConfig = config.customModes.length;
  return fresh;
}

function getCustomConfig(profile) {
  if (!profile || !config?.customModes) return null;
  const idx = (profile.customModeConfig || 0) - 1;
  if (idx < 0) return null;
  return config.customModes[idx] || null;
}

// Add NEUTRAL entries for every axis the mode surfaces so rows default to Neutral, not None.
function seedNeutralSocdPairs(profile) {
  if (!Array.isArray(profile.socdPairs)) profile.socdPairs = [];
  for (const axis of SOCD_AXES) {
    const pairs = axisButtonPairs(profile, axis);
    for (const [a, b] of pairs) {
      if (!findSocdPair(profile, a, b)) {
        profile.socdPairs.push({
          buttonDir1: a,
          buttonDir2: b,
          socdType: 'SOCD_NEUTRAL',
        });
      }
    }
  }
}

// MB1 opens the device menu — never remappable, but has an addressable LED.
const NON_REMAPPABLE_BUTTONS = new Set(['BTN_MB1']);

// MB2-MB7 are mapped to gamepad outputs but have NO physical LED on the device,
// so we never write color entries for them and never expose color UI.
const NO_LED_BUTTONS = new Set([
  'BTN_MB2', 'BTN_MB3', 'BTN_MB4', 'BTN_MB5', 'BTN_MB6', 'BTN_MB7',
]);

function hasLED(btnId) { return !NO_LED_BUTTONS.has(btnId); }
function canRemap(btnId) { return !NON_REMAPPABLE_BUTTONS.has(btnId); }

const RGB_ANIMATIONS = [
  { value: 'RGB_ANIM_STATIC',              label: 'Static' },
  { value: 'RGB_ANIM_RAINBOW_XWAVE_LEFT',  label: 'Rainbow Wave' },
  { value: 'RGB_ANIM_RAINBOW_SHIFT',       label: 'Rainbow Shift' },
  { value: 'RGB_ANIM_UNSPECIFIED',         label: 'None' },
];

// Per-profile rainbow modes — animation, hue offset and speed are global to
// the RgbConfig, while per-button "participation" is encoded by the button's
// stored color: firmware treats color >= 0xFFFFFF as "rotate through hues",
// anything else as "LED off" during the animation (NeoPixelBackend.hpp).
const RAINBOW_ANIMATIONS = new Set([
  'RGB_ANIM_RAINBOW_XWAVE_LEFT',
  'RGB_ANIM_RAINBOW_SHIFT',
]);
// Five speed steps for the slider. The firmware computes
// deltaHue = elapsed_ms × 0.08 × speed each frame, so these values map roughly
// to "barely moving" → "very fast".
const RAINBOW_SPEED_STEPS = [1, 2, 4, 7, 12];
const DEFAULT_RAINBOW_SPEED = RAINBOW_SPEED_STEPS[2];   // step index 2 (middle)
// Sentinel value stored in buttonColors[].color to mark a button as
// "participating in the active rainbow animation". The firmware checks for
// color >= 0xFFFFFF; we use exactly 0xFFFFFF.
const RAINBOW_PARTICIPATING_COLOR = 0xFFFFFF;

function isRainbowAnim(animOrProfile) {
  if (!animOrProfile) return false;
  if (typeof animOrProfile === 'string') return RAINBOW_ANIMATIONS.has(animOrProfile);
  const rgb = getRgbConfig(animOrProfile);
  return RAINBOW_ANIMATIONS.has(rgb?.animation);
}

function colorIntToHex(c) {
  return '#' + (Number(c) >>> 0).toString(16).padStart(6, '0').slice(-6);
}

function parseHexInput(text) {
  let hex = String(text || '').trim().replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  return parseInt(hex, 16);
}

function rgbIntToHsv(c) {
  const r = ((c >> 16) & 0xff) / 255;
  const g = ((c >>  8) & 0xff) / 255;
  const b = ( c        & 0xff) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const v = max;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d > 0) {
    if      (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else                h = ((r - g) / d + 4) * 60;
  }
  return { h, s, v };
}

function hsvToRgbInt(h, s, v) {
  const f = n => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return (Math.round(f(5) * 255) << 16) | (Math.round(f(3) * 255) << 8) | Math.round(f(1) * 255);
}

// ---------------------------------------------------------------------------
// Saved-colors palette — user's quick-pick LED colors, persisted to localStorage.
// ---------------------------------------------------------------------------
const SAVED_COLORS_KEY = 'glyph-remapper:savedColors';
const SAVED_COLORS_MAX = 24;
let savedColors = [];

function loadSavedColorsFromStorage() {
  try {
    const raw = localStorage.getItem(SAVED_COLORS_KEY);
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      savedColors = arr
        .filter(c => typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c))
        .map(c => c.toLowerCase())
        .slice(0, SAVED_COLORS_MAX);
    }
  } catch { /* corrupt entry — ignore */ }
}

function persistSavedColors() {
  try { localStorage.setItem(SAVED_COLORS_KEY, JSON.stringify(savedColors)); } catch {}
}

function addSavedColor(hexLike) {
  const colorInt = parseHexInput(hexLike);
  if (colorInt == null) return false;
  const hex = colorIntToHex(colorInt);
  if (savedColors.includes(hex)) return false;
  savedColors.push(hex);
  if (savedColors.length > SAVED_COLORS_MAX) savedColors.shift();
  persistSavedColors();
  renderAllSavedColorPalettes();
  return true;
}

function removeSavedColor(hex) {
  const idx = savedColors.indexOf(hex);
  if (idx < 0) return;
  savedColors.splice(idx, 1);
  persistSavedColors();
  renderAllSavedColorPalettes();
}

// Render one palette container. `onPick(hex)` is invoked when a swatch is
// left-clicked. Right-clicking a swatch opens a small context menu with a
// Remove option — no hover overlay, so it's harder to delete by accident.
function renderSavedColorPalette(container, onPick) {
  if (!container) return;
  container.innerHTML = '';
  if (!savedColors.length) { container.hidden = true; return; }
  container.hidden = false;
  for (const hex of savedColors) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'saved-color';
    btn.style.background = hex;
    btn.title = `${hex} — right-click to remove`;
    btn.addEventListener('click', () => onPick(hex));
    btn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSavedColorMenu(hex, e.clientX, e.clientY);
    });
    container.appendChild(btn);
  }
}

// Saved-color context menu (rename'esque pattern from the profile menu).
let savedColorMenuTarget = null;

function openSavedColorMenu(hex, clientX, clientY) {
  savedColorMenuTarget = hex;
  const menu = $('saved-color-menu');
  menu.style.left = '-9999px';
  menu.style.top = '0';
  menu.classList.remove('hidden');
  const r = menu.getBoundingClientRect();
  let left = clientX, top = clientY;
  if (left + r.width  > window.innerWidth  - 8) left = window.innerWidth  - r.width  - 8;
  if (top  + r.height > window.innerHeight - 8) top  = window.innerHeight - r.height - 8;
  if (left < 8) left = 8;
  if (top  < 8) top  = 8;
  menu.style.left = `${Math.round(left)}px`;
  menu.style.top  = `${Math.round(top)}px`;
}

function closeSavedColorMenu() {
  $('saved-color-menu').classList.add('hidden');
  savedColorMenuTarget = null;
}

function renderAllSavedColorPalettes() {
  // Right panel: clicking a swatch loads it into the hex input + main swatch.
  renderSavedColorPalette($('panel-saved-colors'), (hex) => {
    $('set-rgb-color-hex').value = hex;
    $('set-rgb-color-hex').classList.remove('invalid');
    $('set-rgb-color-swatch').style.background = hex;
  });
  // Popup: clicking a swatch applies the color to the currently-selected
  // button (lives the popup-color-controls).
  renderSavedColorPalette($('popup-saved-colors'), (hex) => {
    const profile = currentProfile();
    if (!profile || !selectedBtnId) return;
    const colorInt = parseHexInput(hex);
    if (colorInt == null) return;
    setButtonColor(profile, selectedBtnId, colorInt);
    $('popup-color-swatch').style.background = hex;
    $('popup-color-hex').value = hex;
    $('popup-color-hex').classList.remove('invalid');
    applyLiveButtonColor(selectedBtnId, colorInt);
  });
}

// Get (or lazily create) the RgbConfig object for this profile.
// `profile.rgbConfig` is a 1-based index into `config.rgbConfigs[]`.
function makeBlankRgbConfig() {
  return {
    buttonColors: [],
    defaultColor: DEFAULT_LED_COLOR_INT,
    animation: 'RGB_ANIM_STATIC',
    speed: 100,
  };
}

function ensureRgbConfig(profile) {
  if (!config) return null;
  if (!Array.isArray(config.rgbConfigs)) config.rgbConfigs = [];

  const idx = (profile.rgbConfig || 0) - 1;

  if (idx >= 0 && idx < config.rgbConfigs.length && config.rgbConfigs[idx]) {
    return config.rgbConfigs[idx];
  }

  // Pad with valid (blank) RgbConfig objects, NOT nulls — otherwise protobuf
  // encoding (configToBinary) will reject the array when saving to the device.
  if (profile.rgbConfig && profile.rgbConfig > 0) {
    while (config.rgbConfigs.length < profile.rgbConfig - 1) {
      config.rgbConfigs.push(makeBlankRgbConfig());
    }
    const fresh = makeBlankRgbConfig();
    if (config.rgbConfigs.length === profile.rgbConfig - 1) {
      config.rgbConfigs.push(fresh);
    } else {
      config.rgbConfigs[profile.rgbConfig - 1] = fresh;
    }
    return fresh;
  }

  const fresh = makeBlankRgbConfig();
  config.rgbConfigs.push(fresh);
  profile.rgbConfig = config.rgbConfigs.length;
  return fresh;
}

// Non-mutating lookup of the profile's RgbConfig.
function getRgbConfig(profile) {
  if (!profile || !config?.rgbConfigs) return null;
  const idx = (profile.rgbConfig || 0) - 1;
  if (idx < 0) return null;
  return config.rgbConfigs[idx] || null;
}

// LED color for a button, or 0 (off) if no entry — matches firmware behavior.
function getButtonColor(profile, btnId) {
  const rgb = getRgbConfig(profile);
  if (!rgb) return 0;
  const entry = rgb.buttonColors?.find(c => c.button === btnId);
  if (entry) return Number(entry.color) >>> 0;
  return 0;
}

function setButtonColor(profile, btnId, color) {
  if (!hasLED(btnId)) return;   // MB2-MB7 have no physical LED

  const rgb = ensureRgbConfig(profile);
  if (!rgb.buttonColors) rgb.buttonColors = [];
  const idx = rgb.buttonColors.findIndex(c => c.button === btnId);
  const value = (Number(color) >>> 0);
  if (idx >= 0) rgb.buttonColors[idx].color = value;
  else rgb.buttonColors.push({ button: btnId, color: value });
}

// Paint every active LED-capable button with `colorInt`. Active = bound or MB1.
function paintActiveButtons(profile, colorInt) {
  const keyboardMode = isKeyboardProfile(profile);
  const rmap = remapMap(profile);
  for (const btn of BUTTON_LAYOUT) {
    if (!hasLED(btn.id)) continue;
    const active = NON_REMAPPABLE_BUTTONS.has(btn.id)
      || (keyboardMode
            ? (getButtonKeycode(profile, btn.id) != null)
            : (resolveButtonOutput(btn.id, profile, rmap) != null));
    if (active) setButtonColor(profile, btn.id, colorInt);
  }
}

// Wipe every LED on this profile. Used by the "Clear LEDs" button and by the
// "Clear binds" flow (so a wipe of binds also darkens the buttons).
function clearAllProfileLeds(profile) {
  for (const btn of BUTTON_LAYOUT) {
    if (!hasLED(btn.id)) continue;
    setButtonColor(profile, btn.id, 0);
  }
}

// Strip out color entries for buttons that physically lack an LED. Used as a
// safety net before encoding to protobuf and before JSON export, in case
// imported configs (or older state) contain entries for MB2-MB7.
function stripDisabledLeds(cfg) {
  if (!cfg?.rgbConfigs?.length) return cfg;
  const clone = JSON.parse(JSON.stringify(cfg));
  for (const rgb of clone.rgbConfigs) {
    if (rgb?.buttonColors?.length) {
      rgb.buttonColors = rgb.buttonColors.filter(bc => hasLED(bc.button));
    }
  }
  return clone;
}

// Drops CUSTOM-invalid buttonRemapping entries: explicit-disables (kill user
// binds under CUSTOM) and additional-binds whose `activates` isn't a primary
// (dead-letters). Called on CUSTOM entry and again in sanitizeConfigForEncode.
function sanitizeCustomButtonRemapping(profile) {
  if (!Array.isArray(profile.buttonRemapping) || profile.buttonRemapping.length === 0) return;
  const cc = getCustomConfig(profile);
  const primaries = new Set();
  for (const b of (cc?.digitalButtonMappings  || [])) if (b && b !== 'BTN_UNSPECIFIED') primaries.add(b);
  for (const b of (cc?.stickDirectionMappings || [])) if (b && b !== 'BTN_UNSPECIFIED') primaries.add(b);
  profile.buttonRemapping = profile.buttonRemapping.filter(r =>
    r.activates && r.activates !== 'BTN_UNSPECIFIED' && primaries.has(r.activates)
  );
}

function sanitizeConfigForEncode(cfg) {
  const modeCount = cfg?.gameModeConfigs?.length ?? 0;

  for (const p of (cfg?.gameModeConfigs || [])) {
    if (p.modeId !== 'MODE_CUSTOM'   && p.customModeConfig)   p.customModeConfig   = 0;
    if (p.modeId !== 'MODE_KEYBOARD' && p.keyboardModeConfig) p.keyboardModeConfig = 0;
    if (p.modeId === 'MODE_CUSTOM') sanitizeCustomButtonRemapping(p);
  }

  for (const bc of (cfg?.communicationBackendConfigs || [])) {
    if (typeof bc.defaultModeConfig === 'number' && bc.defaultModeConfig > modeCount) {
      bc.defaultModeConfig = 0;
    }
  }
  return cfg;
}

// rgbConfig / keyboardModeConfig / customModeConfig are 1-based shared-array
// indices; when two profiles share an index they mutate each other's data.
// The two helpers below split sharing at duplicate-time and load-time.

// Clone the shared entries this profile inherited (via duplicate) so it owns them.
function splitSharedIndices(profile, cfg = config) {
  if (!profile || !cfg?.gameModeConfigs) return;
  const others = cfg.gameModeConfigs.filter(p => p !== profile);
  const trySplit = (fieldName, arrayName) => {
    const idx1 = profile[fieldName];
    if (!idx1 || idx1 <= 0) return;
    if (!others.some(p => p[fieldName] === idx1)) return;
    const arr = cfg[arrayName];
    if (!Array.isArray(arr)) return;
    const src = arr[idx1 - 1];
    if (!src) return;
    arr.push(JSON.parse(JSON.stringify(src)));
    profile[fieldName] = arr.length;
  };
  trySplit('rgbConfig',          'rgbConfigs');
  trySplit('keyboardModeConfig', 'keyboardModes');
  trySplit('customModeConfig',   'customModes');
}

// Split any shared indices at load time so legacy configs don't propagate the bug.
function normalizeSharedIndices(cfg) {
  if (!cfg?.gameModeConfigs) return cfg;
  const FIELDS = [
    ['rgbConfig',          'rgbConfigs'],
    ['keyboardModeConfig', 'keyboardModes'],
    ['customModeConfig',   'customModes'],
  ];
  for (const [field, arrayName] of FIELDS) {
    const seen = new Set();
    for (const p of cfg.gameModeConfigs) {
      const idx = p[field];
      if (!idx || idx <= 0) continue;
      if (!seen.has(idx)) { seen.add(idx); continue; }
      const arr = cfg[arrayName];
      const src = arr?.[idx - 1];
      if (!src) continue;
      arr.push(JSON.parse(JSON.stringify(src)));
      p[field] = arr.length;
      seen.add(arr.length);
    }
  }
  return cfg;
}

// Live-update the ring stroke for a single button without rebuilding the whole SVG.
// The .btn-ring stroke reads from --led-color via CSS, so we set the custom
// property on the group element (inline style — overrides CSS rules). Also
// toggles the `.led-on` class so the ring shows / hides as the color flips
// between zero and non-zero (CSS hides the ring when `.led-on` is absent).
function applyLiveButtonColor(btnId, colorInt) {
  const g = svg().querySelector(`[data-btn="${btnId}"]`);
  if (!g) return;
  g.style.setProperty('--led-color', colorIntToHex(colorInt));
  const ledOn = NON_REMAPPABLE_BUTTONS.has(btnId)
    || (hasLED(btnId) && colorInt !== 0);
  g.classList.toggle('led-on', ledOn);
}

function remapMap(profile) {
  const map = {};
  if (!profile?.buttonRemapping) return map;
  for (const r of profile.buttonRemapping) {
    if (r.physicalButton) map[r.physicalButton] = r.activates ?? null;
  }
  return map;
}

// Follow the remap chain to the logical button that fires. Returns null if disabled.
function resolveLogicalButton(physBtnId, rmap) {
  if (!(physBtnId in rmap)) return physBtnId;
  const target = rmap[physBtnId];
  if (!target || target === 'BTN_UNSPECIFIED') return null;
  if (target === physBtnId) return physBtnId;
  // Don't follow further chains – buttonRemapping is a single-hop mapping in firmware.
  return target;
}

// Resolve a physical button's output id for this profile, or null if unmapped/disabled.
function resolveButtonOutput(physBtnId, profile, rmap) {
  if (!profile) return null;

  // MB: prefer explicit menuButtonIcon override; else the firmware's hardcoded default.
  if (physBtnId.startsWith('BTN_MB')) {
    // In CUSTOM, MB icons are cosmetic — actual output comes from digitalButtonMappings.
    if (isCustomProfile(profile)) return resolveCustomButtonOutput(physBtnId, profile);

    const mbIdx = parseInt(physBtnId.slice(6), 10) - 1;
    const outOpt = profile.menuButtonIcon?.[mbIdx];
    if (outOpt && outOpt !== 'OUT_UNSPECIFIED') {
      return OUTPUT_OPTION_TO_OUTPUT_ID[outOpt] || null;
    }
    // Keyboard mode doesn't emit gamepad outputs, so no MB defaults.
    if (isKeyboardProfile(profile)) return null;
    return MENU_BUTTON_FIRMWARE_DEFAULTS[physBtnId] || null;
  }

  const logical = resolveLogicalButton(physBtnId, rmap);
  if (!logical) return null;

  if (isCustomProfile(profile)) {
    return resolveCustomButtonOutput(logical, profile);
  }

  const modeMap = MODE_OUTPUT_MAP[profile.modeId];
  if (!modeMap) return null;
  return modeMap[logical] || null;
}

// CUSTOM button → output id. Priority: digital → stick → modifier → trigger.
function resolveCustomButtonOutput(btnId, profile) {
  const cc = getCustomConfig(profile);
  if (!cc) return null;
  const digital = cc.digitalButtonMappings || [];
  for (let i = 0; i < digital.length; i++) {
    if (digital[i] === btnId) {
      const out = DIGITAL_OUTPUT_TO_OUTPUT_ID[i];
      if (out) return out;
    }
  }
  const stickDirs = cc.stickDirectionMappings || [];
  for (let i = 0; i < stickDirs.length; i++) {
    if (stickDirs[i] === btnId) {
      const out = STICK_DIR_TO_OUTPUT_ID[i];
      if (out) return out;
    }
  }
  // Modifier group lookup: a button belongs to a group iff any modifier
  // entry's `buttons` array contains it (groups share their buttons across
  // axes, so finding one match is enough).
  const groups = modifierGroups(cc);
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].buttons.includes(btnId)) return modifierOutputId(i);
  }
  // Trigger mappings: one button per AnalogTriggerMapping entry.
  const triggers = cc.analogTriggerMappings || [];
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].button === btnId) return triggerOutputId(i);
  }
  return null;
}

function addProfile() {
  if (!config) {
    config = {
      gameModeConfigs: [], communicationBackendConfigs: [], keyboardModes: [],
      rgbConfigs: [], defaultBackendConfig: 1, defaultUsbBackendConfig: 1,
      rgbBrightness: 255, defaultDashboardOption: 'DASHBOARD_MENU_BUTTON_HINTS'
    };
  }
  const maxProfiles = 20;
  if ((config.gameModeConfigs?.length ?? 0) >= maxProfiles) {
    alert('Maximum of 20 profiles reached.');
    return;
  }
  if (!config.gameModeConfigs) config.gameModeConfigs = [];
  // New profile: blank CUSTOM canvas. User can switch mode for a specific template after.
  const newProfile = {
    modeId: 'MODE_CUSTOM',
    name: 'New Profile',
    socdPairs: [],
    buttonRemapping: [],
    rgbConfig: 0,
    layoutPlate: 'LAYOUT_PLATE_EVERYTHING',
    applicableBackends: [...USB_BACKENDS],
    menuButtonIcon: ['OUT_UNSPECIFIED','OUT_UNSPECIFIED','OUT_UNSPECIFIED','OUT_UNSPECIFIED','OUT_HOME','OUT_XB_BACK','OUT_START']
  };
  config.gameModeConfigs.push(newProfile);
  selectedProfileIdx = config.gameModeConfigs.length - 1;
  ensureCustomConfig(newProfile);   // attach blank CustomModeConfig
  renderAll();
}

function deleteProfile(idx) {
  if (!config?.gameModeConfigs) return;
  config.gameModeConfigs.splice(idx, 1);

  // Remap 1-based backend defaultModeConfig pointers; firmware rejects out-of-range.
  for (const bc of (config.communicationBackendConfigs || [])) {
    if (typeof bc.defaultModeConfig !== 'number' || bc.defaultModeConfig === 0) continue;
    if (bc.defaultModeConfig === idx + 1)     bc.defaultModeConfig = 0;
    else if (bc.defaultModeConfig >  idx + 1) bc.defaultModeConfig -= 1;
  }

  if (selectedProfileIdx >= config.gameModeConfigs.length) {
    selectedProfileIdx = config.gameModeConfigs.length - 1;
  }
  renderAll();
}

// Reorder profiles (0-based) and remap backend defaultModeConfig pointers.
function moveProfile(fromIdx, toIdx) {
  if (!config?.gameModeConfigs) return;
  const arr = config.gameModeConfigs;
  if (fromIdx === toIdx) return;
  if (fromIdx < 0 || fromIdx >= arr.length) return;
  if (toIdx < 0   || toIdx   >= arr.length) return;

  const [moved] = arr.splice(fromIdx, 1);
  arr.splice(toIdx, 0, moved);

  for (const bc of (config.communicationBackendConfigs || [])) {
    if (typeof bc.defaultModeConfig === 'number') {
      bc.defaultModeConfig = remapProfileIdx1(bc.defaultModeConfig, fromIdx, toIdx);
    }
  }
  selectedProfileIdx = remapProfileIdx0(selectedProfileIdx, fromIdx, toIdx);
  renderAll();
}

// 1-based index into gameModeConfigs after moving from→to (0-based). 0 = unset.
function remapProfileIdx1(oldIdx1, from, to) {
  if (oldIdx1 === 0) return 0;
  const idx = oldIdx1 - 1;
  if (idx === from) return to + 1;
  // Moving down: entries in (from, to] shift up by one.
  if (from < to && idx > from && idx <= to) return idx;
  // Moving up: entries in [to, from) shift down by one.
  if (from > to && idx >= to && idx < from) return idx + 2;
  return oldIdx1;
}

// Same but for 0-based indices (e.g. selectedProfileIdx).
function remapProfileIdx0(sel, from, to) {
  if (sel < 0) return sel;
  if (sel === from) return to;
  if (from < to && sel > from && sel <= to) return sel - 1;
  if (from > to && sel >= to && sel < from) return sel + 1;
  return sel;
}

// ---------------------------------------------------------------------------
// SVG rendering
// ---------------------------------------------------------------------------
const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function buildControllerSVG() {
  const s = svg();
  s.innerHTML = '';

  // Defs: a rainbow gradient used to stroke the rings of buttons that are
  // currently participating in a per-profile rainbow animation. Each button's
  // ring is a small circle inside the 912×491 viewBox, so we use the default
  // gradient bounding-box (each circle gets its own copy of the spectrum).
  const defs = svgEl('defs');
  const grad = svgEl('linearGradient', { id: 'rainbow-grad', x1: '0%', y1: '0%', x2: '100%', y2: '0%' });
  for (const [offset, color] of [
    ['0%',   '#ff3b30'], ['17%',  '#ff9500'], ['33%',  '#ffcc00'],
    ['50%',  '#34c759'], ['67%',  '#00b4d8'], ['83%',  '#5e5ce6'],
    ['100%', '#ff2d92'],
  ]) {
    grad.appendChild(svgEl('stop', { offset, 'stop-color': color }));
  }
  defs.appendChild(grad);
  s.appendChild(defs);

  // Controller body — fills the viewBox (912 x 491, rx=19)
  const body = svgEl('rect', { x:0, y:0, width:912, height:491, rx:19, ry:19, class:'controller-body' });
  s.appendChild(body);

  // Render all buttons
  const profile = currentProfile();
  const rmap = remapMap(profile);
  const platformStyle = PLATFORM_STYLES[selectedPlatform] || XBOX_STYLE;

  const keyboardMode = isKeyboardProfile(profile);
  const rainbowMode = isRainbowAnim(profile);

  for (const btn of BUTTON_LAYOUT) {
    let style = null;
    if (keyboardMode) {
      // Keyboard mode shows the HID key; firmware bypasses buttonRemapping.
      const keycode = getButtonKeycode(profile, btn.id);
      if (keycode != null) {
        style = { label: keycodeToLabel(keycode), bg: DARK_BG, fg: LIGHT_TEXT, kind: 'key' };
      }
    } else {
      const outputId = resolveButtonOutput(btn.id, profile, rmap);
      // Virtual M:n/T:n outputs aren't in PLATFORM_STYLES — synthesise.
      const baseStyle = outputId
        ? (platformStyle[outputId] || virtualOutputStyle(outputId))
        : null;
      style = baseStyle ? { ...baseStyle, _outputId: outputId } : null;
    }
    const isMapped = !!style;
    // Ring visibility is driven by stored color, not `mapped`.
    //   MB1: always shown (no off state); MB2-MB7: no LED, never shown
    //   - everything else: shown iff the stored color is non-zero
    const ledOn = NON_REMAPPABLE_BUTTONS.has(btn.id)
      || (hasLED(btn.id) && getButtonColor(profile, btn.id) !== 0);

    const classes = ['btn-group'];
    if (btn.large) classes.push('btn-large');
    if (btn.menu) classes.push('btn-menu');
    // `mapped` toggles icon styling; `led-on` toggles the colored ring separately.
    classes.push(isMapped ? 'mapped' : 'unmapped');
    if (ledOn) classes.push('led-on');
    if (btn.id === selectedBtnId) classes.push('selected');

    // Custom #btn-tooltip element; native browser tooltip not used.
    const shortName = btn.id.replace('BTN_', '');
    const tooltipText = style
      ? `${shortName} (${tooltipOutputLabel(style, keyboardMode)})`
      : shortName;

    const g = svgEl('g', {
      class: classes.join(' '),
      'data-btn': btn.id,
      'data-tooltip': tooltipText,
      role: 'button',
      tabindex: '0',
      'aria-label': tooltipText,
    });

    g.appendChild(svgEl('circle', { cx: btn.x, cy: btn.y, r: btn.r, class: 'btn-ring' }));
    if (ledOn && hasLED(btn.id)) {
      const stored = getButtonColor(profile, btn.id);
      // Rainbow: buttons "participate" iff stored color is 0xFFFFFF; render with rainbow-grad stroke.
      if (rainbowMode && stored >= RAINBOW_PARTICIPATING_COLOR) {
        g.style.setProperty('--led-color', 'url(#rainbow-grad)');
        g.classList.add('btn-rainbow');
      } else {
        g.style.setProperty('--led-color', colorIntToHex(stored));
      }
    }

    // Base fill (dark background inside ring, or solid dark fill if unmapped)
    g.appendChild(svgEl('circle', { cx: btn.x, cy: btn.y, r: btn.r - 0.4, class: 'btn-fill' }));

    if (style) {
      renderButtonIcon(g, btn, style);
    }

    g.addEventListener('click', (e) => openOutputPopup(btn.id, e));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openOutputPopup(btn.id, e); });

    s.appendChild(g);
  }
}

// Render the platform-styled icon inside a button (colored disk + label/glyph).
function renderButtonIcon(g, btn, style) {
  // Use a Kenney SVG icon when one is available for this platform + output.
  const iconPath = getIconPath(selectedPlatform, style._outputId);
  if (iconPath) {
    // Dark background disk — keeps the same base color as unmapped/text buttons.
    g.appendChild(svgEl('circle', {
      cx: btn.x, cy: btn.y, r: btn.r - 0.6,
      class: 'btn-icon-disk',
      fill: DARK_BG,
    }));
    const iconSize = btn.r * 1.8;
    g.appendChild(svgEl('image', {
      href: iconPath,
      x: btn.x - iconSize / 2,
      y: btn.y - iconSize / 2,
      width: iconSize,
      height: iconSize,
      preserveAspectRatio: 'xMidYMid meet',
      class: 'btn-icon-svg',
      'pointer-events': 'none',
    }));
    return;
  }

  const innerR = btn.r - 0.6;
  // Colored disk that covers the gray base fill
  g.appendChild(svgEl('circle', {
    cx: btn.x, cy: btn.y, r: innerR,
    class: 'btn-icon-disk',
    fill: style.bg
  }));

  // Direction arrows for dpad/stick/cstick
  if (style.kind === 'dpad' || style.kind === 'stick' || style.kind === 'cstick') {
    renderDirectionGlyph(g, btn, style);
    return;
  }

  // PlayStation face-button shapes (cross / circle / square / triangle)
  if (style.glyph) {
    const r = btn.r * 0.45;
    const sw = btn.r * 0.16;
    g.appendChild(buildPSFaceGlyphSvg(style.glyph, style.fg, btn.x, btn.y, r, sw));
    return;
  }

  // Text label
  const fontSize = labelFontSize(btn, style.label);
  const t = svgEl('text', {
    x: btn.x, y: btn.y,
    class: 'btn-icon-label',
    fill: style.fg,
    'font-size': fontSize
  });
  t.textContent = style.label;
  g.appendChild(t);
}

// Build a PS face-button glyph as an SVG <g> element with the shape centered at (cx, cy).
// Returns an element you can append directly into an SVG document.
// `r` is the half-extent of the shape, `sw` is stroke-width.
function buildPSFaceGlyphSvg(type, color, cx, cy, r, sw) {
  const NS = 'http://www.w3.org/2000/svg';
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('pointer-events', 'none');

  const common = el => {
    el.setAttribute('stroke', color);
    el.setAttribute('stroke-width', sw);
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke-linejoin', 'round');
    el.setAttribute('stroke-linecap', 'round');
    return el;
  };

  if (type === 'circle') {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy);
    c.setAttribute('r', r);
    g.appendChild(common(c));
  } else if (type === 'square') {
    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('x', cx - r); rect.setAttribute('y', cy - r);
    rect.setAttribute('width', r * 2); rect.setAttribute('height', r * 2);
    g.appendChild(common(rect));
  } else if (type === 'cross') {
    const l1 = document.createElementNS(NS, 'line');
    l1.setAttribute('x1', cx - r); l1.setAttribute('y1', cy - r);
    l1.setAttribute('x2', cx + r); l1.setAttribute('y2', cy + r);
    g.appendChild(common(l1));
    const l2 = document.createElementNS(NS, 'line');
    l2.setAttribute('x1', cx + r); l2.setAttribute('y1', cy - r);
    l2.setAttribute('x2', cx - r); l2.setAttribute('y2', cy + r);
    g.appendChild(common(l2));
  } else if (type === 'triangle') {
    // Upright triangle. Apex above center, base below.
    const apexOff = r * 1.05;
    const baseY = cy + r * 0.65;
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d',
      `M${cx} ${cy - apexOff}L${cx + r} ${baseY}L${cx - r} ${baseY}Z`
    );
    g.appendChild(common(p));
  }

  return g;
}

function labelFontSize(btn, label) {
  // Scale font with button radius; shrink for long labels
  let size = btn.r * 0.95;
  if (label && label.length >= 3) size = btn.r * 0.7;
  if (label && label.length >= 5) size = btn.r * 0.55;
  if (btn.menu) size = Math.min(size, btn.r * 0.95);
  return size.toFixed(2);
}

// Renders an arrow glyph for dpad / stick / cstick buttons.
// Uses small text label "L" / "C" badge to differentiate stick from cstick when needed.
function renderDirectionGlyph(g, btn, style) {
  const dir = style.label;  // '↑' '↓' '←' '→'
  const armLen = btn.r * 0.55;
  const headSize = btn.r * 0.35;
  let x1, y1, x2, y2, hx1, hy1, hx2, hy2;
  if (dir === '↑') {
    x1 = btn.x; y1 = btn.y + armLen * 0.5;
    x2 = btn.x; y2 = btn.y - armLen * 0.5;
    hx1 = x2 - headSize; hy1 = y2 + headSize;
    hx2 = x2 + headSize; hy2 = y2 + headSize;
  } else if (dir === '↓') {
    x1 = btn.x; y1 = btn.y - armLen * 0.5;
    x2 = btn.x; y2 = btn.y + armLen * 0.5;
    hx1 = x2 - headSize; hy1 = y2 - headSize;
    hx2 = x2 + headSize; hy2 = y2 - headSize;
  } else if (dir === '←') {
    x1 = btn.x + armLen * 0.5; y1 = btn.y;
    x2 = btn.x - armLen * 0.5; y2 = btn.y;
    hx1 = x2 + headSize; hy1 = y2 - headSize;
    hx2 = x2 + headSize; hy2 = y2 + headSize;
  } else { // →
    x1 = btn.x - armLen * 0.5; y1 = btn.y;
    x2 = btn.x + armLen * 0.5; y2 = btn.y;
    hx1 = x2 - headSize; hy1 = y2 - headSize;
    hx2 = x2 - headSize; hy2 = y2 + headSize;
  }
  const strokeW = (btn.r * 0.18).toFixed(2);
  // Arrow shaft
  g.appendChild(svgEl('line', {
    x1, y1, x2, y2, class: 'btn-dir-arrow',
    stroke: style.fg, 'stroke-width': strokeW
  }));
  // Arrow head as two lines
  g.appendChild(svgEl('line', {
    x1: hx1, y1: hy1, x2, y2, class: 'btn-dir-arrow',
    stroke: style.fg, 'stroke-width': strokeW
  }));
  g.appendChild(svgEl('line', {
    x1: hx2, y1: hy2, x2, y2, class: 'btn-dir-arrow',
    stroke: style.fg, 'stroke-width': strokeW
  }));

  // Small "C" badge for c-stick to disambiguate from L-stick
  if (style.kind === 'cstick') {
    const badge = svgEl('text', {
      x: btn.x + btn.r * 0.55, y: btn.y - btn.r * 0.55,
      class: 'btn-icon-label',
      fill: '#e8c038',
      'font-size': (btn.r * 0.55).toFixed(2)
    });
    badge.textContent = 'C';
    g.appendChild(badge);
  }
}

// ---------------------------------------------------------------------------
// Sidebar rendering
// ---------------------------------------------------------------------------
function renderProfileList() {
  const list = $('profile-list');
  list.innerHTML = '';
  const profiles = config?.gameModeConfigs ?? [];
  $('profile-count').textContent = `${profiles.length} / 20`;

  profiles.forEach((p, i) => {
    const item = document.createElement('div');
    item.className = 'profile-item' + (i === selectedProfileIdx ? ' selected' : '');
    item.dataset.idx = i;
    item.draggable = true;

    const modeShort = (p.modeId || 'MODE_UNSPECIFIED').replace('MODE_', '');
    item.innerHTML = `
      <span class="profile-item-name">${escHtml(p.name || 'Unnamed')}</span>
      <span class="profile-item-mode">${escHtml(modeShort)}</span>
      <button class="profile-item-del" title="Delete profile" aria-label="Delete profile" data-idx="${i}"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
    `;
    item.addEventListener('click', e => {
      if (e.target.classList.contains('profile-item-del')) return;
      if (e.target.classList.contains('profile-item-name-input')) return;  // editing
      selectedProfileIdx = i;
      selectedBtnId = null;
      renderAll();
    });
    item.querySelector('.profile-item-del').addEventListener('click', e => {
      e.stopPropagation();
      confirmNearAnchor(e.currentTarget, `Delete "${p.name || 'Unnamed'}"?`, () => deleteProfile(i));
    });
    item.addEventListener('contextmenu', e => {
      e.preventDefault();
      e.stopPropagation();
      openProfileContextMenu(i, e.clientX, e.clientY);
    });

    // Drag-and-drop reorder. dragstart stashes the source index in
    // dataTransfer; drop reads it back and calls moveProfile. The
    // dragover/leave classes drive the drop-indicator styles (thin accent
    // border above or below the target depending on drag direction).
    item.addEventListener('dragstart', e => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(i));
      item.classList.add('dragging');
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      list.querySelectorAll('.profile-item')
        .forEach(el => el.classList.remove('drop-before', 'drop-after'));
    });
    item.addEventListener('dragover', e => {
      // Suppress on the source item itself so it doesn't self-highlight.
      if (item.classList.contains('dragging')) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const rect = item.getBoundingClientRect();
      const before = (e.clientY - rect.top) < rect.height / 2;
      item.classList.toggle('drop-before', before);
      item.classList.toggle('drop-after', !before);
    });
    item.addEventListener('dragleave', () => {
      item.classList.remove('drop-before', 'drop-after');
    });
    item.addEventListener('drop', e => {
      e.preventDefault();
      const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
      const dropBefore = item.classList.contains('drop-before');
      item.classList.remove('drop-before', 'drop-after');
      if (Number.isNaN(fromIdx) || fromIdx === i) return;
      // Splice math: moving down shifts target up by 1; moving up doesn't.
      let toIdx;
      if (fromIdx < i) toIdx = dropBefore ? i - 1 : i;
      else             toIdx = dropBefore ? i     : i + 1;
      moveProfile(fromIdx, toIdx);
    });

    list.appendChild(item);
  });

  const noProfileMsg = $('no-profile-msg');
  noProfileMsg.style.display = profiles.length === 0 ? 'block' : 'none';
}

// ---------------------------------------------------------------------------
// Profile context menu (rename / duplicate)
// ---------------------------------------------------------------------------
let contextMenuProfileIdx = -1;

function openProfileContextMenu(profileIdx, clientX, clientY) {
  contextMenuProfileIdx = profileIdx;
  const menu = $('profile-context-menu');

  // Render off-screen to measure
  menu.style.left = '-9999px';
  menu.style.top = '0';
  menu.classList.remove('hidden');
  const r = menu.getBoundingClientRect();

  // Position within viewport
  let left = clientX;
  let top = clientY;
  if (left + r.width  > window.innerWidth  - 8) left = window.innerWidth  - r.width  - 8;
  if (top  + r.height > window.innerHeight - 8) top  = window.innerHeight - r.height - 8;
  if (left < 8) left = 8;
  if (top  < 8) top  = 8;

  menu.style.left = `${Math.round(left)}px`;
  menu.style.top  = `${Math.round(top)}px`;
}

function closeProfileContextMenu() {
  $('profile-context-menu').classList.add('hidden');
  contextMenuProfileIdx = -1;
}

function startRenameProfile(idx) {
  const item = document.querySelector(`.profile-item[data-idx="${idx}"]`);
  if (!item) return;
  const nameSpan = item.querySelector('.profile-item-name');
  if (!nameSpan) return;
  const profile = config.gameModeConfigs[idx];
  if (!profile) return;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'profile-item-name-input';
  input.value = profile.name || '';
  input.maxLength = 40;
  input.spellcheck = false;

  nameSpan.replaceWith(input);
  setTimeout(() => { input.focus(); input.select(); }, 0);

  let committed = false;
  const finish = (save) => {
    if (committed) return;
    committed = true;
    if (save) {
      const newName = input.value.trim();
      if (newName) profile.name = newName;
    }
    renderProfileList();
    if (idx === selectedProfileIdx) {
      $('settings-profile-name').textContent = profile.name || 'Profile Settings';
      $('set-name').value = profile.name || '';
    }
  };

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')   { e.preventDefault(); finish(true); }
    if (e.key === 'Escape')  { e.preventDefault(); finish(false); }
  });
  input.addEventListener('blur', () => finish(true));
  input.addEventListener('click', e => e.stopPropagation());
}

function startRenameProfileFromHeader() {
  if (selectedProfileIdx < 0) return;
  const title = $('settings-profile-name');
  if (!title) return;
  const profile = config.gameModeConfigs[selectedProfileIdx];
  if (!profile) return;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'settings-title-input';
  input.id = 'settings-profile-name';   // keep the id so post-finish lookups work
  input.value = profile.name || '';
  input.maxLength = 40;
  input.spellcheck = false;

  title.replaceWith(input);
  setTimeout(() => { input.focus(); input.select(); }, 0);

  let committed = false;
  const finish = (save) => {
    if (committed) return;
    committed = true;
    if (save) {
      const newName = input.value.trim();
      if (newName) profile.name = newName;
    }
    // Swap the input back for a span that carries the same id.
    const span = document.createElement('span');
    span.className = 'settings-title';
    span.id = 'settings-profile-name';
    span.textContent = profile.name || 'Profile Settings';
    input.replaceWith(span);
    renderProfileList();
    $('set-name').value = profile.name || '';
  };

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')   { e.preventDefault(); finish(true); }
    if (e.key === 'Escape')  { e.preventDefault(); finish(false); }
  });
  input.addEventListener('blur', () => finish(true));
  input.addEventListener('click', e => e.stopPropagation());
}

function duplicateProfile(srcIdx) {
  if (!config?.gameModeConfigs) return;
  const src = config.gameModeConfigs[srcIdx];
  if (!src) return;
  if (config.gameModeConfigs.length >= 20) {
    alert('Maximum of 20 profiles reached.');
    return;
  }
  const copy = JSON.parse(JSON.stringify(src));
  // Suffix " (copy)" — and avoid collisions for repeated duplicates.
  const baseName = (src.name || 'Unnamed') + ' (copy)';
  let name = baseName;
  let n = 2;
  const existing = new Set(config.gameModeConfigs.map(p => p.name));
  while (existing.has(name)) name = `${baseName} ${n++}`;
  copy.name = name;
  // JSON.parse copied the rgb/keyboard/custom INDEX verbatim, so the copy
  // currently shares those entries with the source. Split them off into
  // fresh slots BEFORE inserting the copy into gameModeConfigs so the
  // "any other profile has this index" scan sees only the source.
  splitSharedIndices(copy);
  // Insert directly after the source for a sensible visual position
  config.gameModeConfigs.splice(srcIdx + 1, 0, copy);
  selectedProfileIdx = srcIdx + 1;
  selectedBtnId = null;
  renderAll();
}

// ---------------------------------------------------------------------------
// Settings panel rendering
// ---------------------------------------------------------------------------
function renderSettingsPanel() {
  const profile = currentProfile();
  $('settings-panel').style.display = profile ? '' : 'none';
  if (!profile) return;

  $('settings-profile-name').textContent = profile.name || 'Profile Settings';
  $('set-name').value = profile.name || '';

  // Keyboard hides Backends (locked to DInput). Advanced remap is hidden for keyboard/custom.
  const keyboardMode = isKeyboardProfile(profile);
  const customMode   = isCustomProfile(profile);
  $('backends-group').style.display = keyboardMode ? 'none' : '';
  $('remap-group').style.display    = '';
  const advToggle = document.querySelector('#remap-body .remap-mode-switch');
  if (advToggle) advToggle.style.display = (keyboardMode || customMode) ? 'none' : '';
  $('custom-group').hidden          = !customMode;
  if (customMode) renderCustomModeSection(profile);

  // Mode select
  const modeSelect = $('set-mode-id');
  modeSelect.innerHTML = '';
  for (const m of GAME_MODE_IDS) {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m.replace('MODE_', '');
    if (m === profile.modeId) opt.selected = true;
    modeSelect.appendChild(opt);
  }

  // Backends
  const beDiv = $('set-backends');
  beDiv.innerHTML = '';
  if (!profile.applicableBackends) profile.applicableBackends = [];

  for (const choice of BACKEND_CHOICES) {
    const isGroup = typeof choice === 'object';
    const members = isGroup ? choice.members : [choice];
    const label   = isGroup ? choice.label   : choice.replace('COMMS_BACKEND_', '');
    // A group is "checked" if all its member backends are present in the profile.
    // A single backend is checked if it's in the profile.
    const checked = members.every(m => profile.applicableBackends.includes(m));

    const lbl = document.createElement('label');
    lbl.className = 'checkbox-item';
    lbl.innerHTML = `<input type="checkbox"${checked ? ' checked' : ''}> ${escHtml(label)}`;
    lbl.querySelector('input').addEventListener('change', (e) => {
      if (e.target.checked) {
        for (const m of members) {
          if (!profile.applicableBackends.includes(m)) profile.applicableBackends.push(m);
        }
      } else {
        profile.applicableBackends = profile.applicableBackends.filter(x => !members.includes(x));
      }
      updateGcTab();
    });
    beDiv.appendChild(lbl);
  }

  // SOCD pairs
  renderSocdList(profile);

  // Button Lighting (RGB animation + per-profile default color)
  renderRgbSection(profile);

  // Remap list (lives inside a collapsible group; visibility is independent of profile)
  renderRemapList(profile);
}

function renderRgbSection(profile) {
  // Populate the animation dropdown (first time only)
  const animSelect = $('set-rgb-animation');
  if (!animSelect.options.length) {
    for (const opt of RGB_ANIMATIONS) {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      animSelect.appendChild(o);
    }
  }

  const rgb = getRgbConfig(profile);
  const anim = rgb?.animation || 'RGB_ANIM_STATIC';
  animSelect.value = anim;

  const isStatic  = (anim === 'RGB_ANIM_STATIC');
  const isRainbow = RAINBOW_ANIMATIONS.has(anim);

  // Static: color swatch + hex + saved palette. Rainbow: speed slider.
  // Each block has its own "Apply to mapped buttons" so the button can sit in
  // the place that makes sense for the mode (just below the value being
  // applied).
  $('rgb-static-controls').hidden  = !isStatic;
  $('rgb-rainbow-controls').hidden = !isRainbow;

  if (isStatic) {
    const defaultColor = rgb?.defaultColor != null ? Number(rgb.defaultColor) >>> 0 : DEFAULT_LED_COLOR_INT;
    const hex = colorIntToHex(defaultColor);
    $('set-rgb-color-swatch').style.background = hex;
    $('set-rgb-color-hex').value = hex;
    $('set-rgb-color-hex').classList.remove('invalid');
  }
  if (isRainbow) {
    // Closest slider step for the current speed; fall back to the middle step.
    const speed = Number(rgb?.speed) || DEFAULT_RAINBOW_SPEED;
    let step = RAINBOW_SPEED_STEPS.indexOf(speed);
    if (step < 0) {
      step = RAINBOW_SPEED_STEPS.reduce(
        (best, v, i) => Math.abs(v - speed) < Math.abs(RAINBOW_SPEED_STEPS[best] - speed) ? i : best,
        2
      );
    }
    $('set-rgb-speed').value = String(step);
  }

  renderAllSavedColorPalettes();
}

// Custom mode section — stickRange + modifier/trigger lists. Button bindings edited via popup.
function renderCustomModeSection(profile) {
  const cc = ensureCustomConfig(profile);
  if (!cc) return;
  $('set-custom-stick-range').value = String(cc.stickRange || 100);   // Melee default fallback
  renderCustomModifierList(profile, cc);
  renderCustomTriggerList(profile, cc);
}

// One row per M-group. Button binding is set via the popup's M{n} virtual output.
function renderCustomModifierList(profile, cc) {
  const list = $('custom-modifiers-list');
  list.innerHTML = '';
  if (!Array.isArray(cc.modifiers)) cc.modifiers = [];
  modifierGroups(cc).forEach((group, groupIdx) => {
    list.appendChild(buildModifierGroupRow(profile, cc, group, groupIdx));
  });
}

function buildModifierGroupRow(profile, cc, group, groupIdx) {
  const row = document.createElement('div');
  row.className = 'custom-modifier-row';

  // Header: "M{n} → [phys dropdown]". Dropdown calls the same setCustomButtonOutput as the M{n} glyph.
  const head = document.createElement('div');
  head.className = 'custom-group-head';
  const currentBtn = group.buttons[0];   // M-group binds to exactly one phys
  head.innerHTML = `
    <span class="custom-group-name">M${groupIdx + 1}</span>
    <span class="remap-sep" aria-hidden="true">→</span>
    <select class="custom-group-bind" title="Bind this modifier to a physical button">
      ${physButtonOptionsWithUnbound(currentBtn)}
    </select>
  `;
  head.querySelector('select').addEventListener('change', e => {
    const newBtn = e.target.value;
    if (!newBtn) {
      // Unbound: keep entries (M-row persists) but empty buttons[] — firmware skips on mask=0.
      for (const entry of group.entries) entry.buttons = [];
    } else {
      setCustomButtonOutput(profile, newBtn, modifierOutputId(groupIdx));
    }
    renderRemapList(profile);
    buildControllerSVG();
    renderCustomModifierList(profile, cc);
  });
  row.appendChild(head);

  // Per-axis multiplier inputs. Six axes total — the firmware supports more
  // but stick/trigger axes are the only ones useful here.
  const settings = document.createElement('div');
  settings.className = 'custom-modifier-settings custom-modifier-axes';
  for (const axis of ANALOG_AXES) {
    const cur = group.axes[axis.value] ?? '';
    const field = document.createElement('div');
    field.className = 'custom-modifier-field';
    field.innerHTML = `
      <label>${escHtml(axis.label)}</label>
      <input type="number" step="0.01" min="0" max="2"
             placeholder="—" value="${cur !== '' ? cur : ''}">
    `;
    field.querySelector('input').addEventListener('input', e => {
      const raw = e.target.value.trim();
      writeModifierAxis(cc, group, axis.value, raw === '' ? null : parseFloat(raw));
      // Don't re-render — would lose input focus mid-typing. The group's
      // entries reference cc.modifiers directly so changes are already live.
    });
    settings.appendChild(field);
  }
  row.appendChild(settings);

  // Combination mode dropdown (single value for the whole group).
  const modeRow = document.createElement('div');
  modeRow.className = 'custom-modifier-mode-row';
  modeRow.innerHTML = `
    <label>Mode</label>
    <select>${
      MOD_COMBINATION_MODES.map(m =>
        `<option value="${m.value}"${m.value === group.combinationMode ? ' selected' : ''}>${escHtml(m.label)}</option>`
      ).join('')
    }</select>
  `;
  modeRow.querySelector('select').addEventListener('change', e => {
    for (const entry of group.entries) entry.combinationMode = e.target.value;
  });
  row.appendChild(modeRow);

  // Remove button — drops every entry in this group.
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'custom-modifier-remove';
  remove.title = 'Remove modifier';
  remove.setAttribute('aria-label', 'Remove modifier');
  remove.textContent = '✕';
  remove.addEventListener('click', () => {
    cc.modifiers = cc.modifiers.filter(m => !group.entries.includes(m));
    renderCustomModifierList(profile, cc);
    buildControllerSVG();
  });
  row.appendChild(remove);

  return row;
}

// Set/clear one axis in an M-group. `value === null` deletes the entry.
function writeModifierAxis(cc, group, axis, value) {
  if (!Array.isArray(cc.modifiers)) cc.modifiers = [];
  const existing = group.entries.find(e => e.axis === axis);
  if (value == null || Number.isNaN(value)) {
    if (existing) {
      cc.modifiers = cc.modifiers.filter(m => m !== existing);
      group.entries = group.entries.filter(m => m !== existing);
      delete group.axes[axis];
    }
    return;
  }
  if (existing) {
    existing.multiplier = value;
  } else {
    const entry = {
      buttons: [...group.buttons],
      axis,
      multiplier: value,
      combinationMode: group.combinationMode || 'COMBINATION_MODE_OVERRIDE',
    };
    cc.modifiers.push(entry);
    group.entries.push(entry);
  }
  group.axes[axis] = value;
}

// One row per T-entry. Button binding is set via the popup's T{n} virtual output.
function renderCustomTriggerList(profile, cc) {
  const list = $('custom-triggers-list');
  if (!list) return;
  list.innerHTML = '';
  if (!Array.isArray(cc.analogTriggerMappings)) cc.analogTriggerMappings = [];
  cc.analogTriggerMappings.forEach((t, idx) => {
    list.appendChild(buildAnalogTriggerRow(profile, cc, t, idx));
  });
}

function buildAnalogTriggerRow(profile, cc, trigger, idx) {
  const row = document.createElement('div');
  row.className = 'custom-modifier-row';

  // Header: "T{n} → [phys dropdown]" — same shortcut as the M-row picker.
  const head = document.createElement('div');
  head.className = 'custom-group-head';
  head.innerHTML = `
    <span class="custom-group-name">T${idx + 1}</span>
    <span class="remap-sep" aria-hidden="true">→</span>
    <select class="custom-group-bind" title="Bind this trigger to a physical button">
      ${physButtonOptionsWithUnbound(trigger.button)}
    </select>
  `;
  head.querySelector('select').addEventListener('change', e => {
    const newBtn = e.target.value;
    if (!newBtn) {
      // Clearing: set the proto field to BTN_UNSPECIFIED — firmware's
      // get_button short-circuits on that, so the trigger never fires.
      trigger.button = 'BTN_UNSPECIFIED';
    } else {
      setCustomButtonOutput(profile, newBtn, triggerOutputId(idx));
    }
    renderRemapList(profile);
    buildControllerSVG();
    renderCustomTriggerList(profile, cc);
  });
  row.appendChild(head);

  const settings = document.createElement('div');
  settings.className = 'custom-modifier-settings';
  // Trigger axis dropdown
  const trigField = document.createElement('div');
  trigField.className = 'custom-modifier-field';
  trigField.innerHTML = `<label>Trigger</label><select>${
    ANALOG_TRIGGERS.map(t => `<option value="${t.value}"${t.value === trigger.trigger ? ' selected' : ''}>${escHtml(t.label)}</option>`).join('')
  }</select>`;
  trigField.querySelector('select').addEventListener('change', e => {
    trigger.trigger = e.target.value;
  });
  settings.appendChild(trigField);

  // Value 0-255
  const valField = document.createElement('div');
  valField.className = 'custom-modifier-field';
  valField.innerHTML = `<label>Value (0–255)</label><input type="number" min="0" max="255" step="1" value="${trigger.value ?? 49}">`;
  valField.querySelector('input').addEventListener('input', e => {
    const v = parseInt(e.target.value, 10);
    if (!Number.isNaN(v)) trigger.value = Math.max(0, Math.min(255, v));
  });
  settings.appendChild(valField);

  row.appendChild(settings);

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'custom-modifier-remove';
  remove.title = 'Remove trigger';
  remove.setAttribute('aria-label', 'Remove trigger');
  remove.textContent = '✕';
  remove.addEventListener('click', () => {
    cc.analogTriggerMappings.splice(idx, 1);
    renderCustomTriggerList(profile, cc);
    buildControllerSVG();
  });
  row.appendChild(remove);

  return row;
}

// SOCD axes rendered when the profile has buttons producing them. D-pad is separate from stick.
const SOCD_AXES = [
  { id: 'left-x',  label: 'Left X',  outputPairs: [['lsl', 'lsr']] },
  { id: 'left-y',  label: 'Left Y',  outputPairs: [['lsu', 'lsd']] },
  { id: 'dpad-x',  label: 'D-Pad X', outputPairs: [['dleft', 'dright']] },
  { id: 'dpad-y',  label: 'D-Pad Y', outputPairs: [['dup',   'ddown']] },
  { id: 'right-x', label: 'Right X', outputPairs: [['csl', 'csr']] },
  { id: 'right-y', label: 'Right Y', outputPairs: [['csu', 'csd']] },
];

// Returns map outputId → [btnIds] producing that output in this profile,
// accounting for the active mode + remappings. Used to look up which physical
// buttons map to e.g. lsl, dright, csu, etc.
function buttonsByOutput(profile) {
  const out = {};
  const rmap = remapMap(profile);
  for (const btn of BUTTON_LAYOUT) {
    if (btn.id.startsWith('BTN_MB')) continue;
    const o = resolveButtonOutput(btn.id, profile, rmap);
    if (!o) continue;
    if (!out[o]) out[o] = [];
    out[o].push(btn.id);
  }
  return out;
}

// For an axis, list the physical-button pairs that should be SOCD-resolved.
// e.g. Left-X in Ultimate → [[LF3, LF1], [LF8, LF6]] (L-stick + D-pad).
function axisButtonPairs(profile, axis) {
  const byOut = buttonsByOutput(profile);
  const rmap = remapMap(profile);
  const pairs = [];
  for (const [outA, outB] of axis.outputPairs) {
    const aBtns = byOut[outA] || [];
    const bBtns = byOut[outB] || [];
    if (!aBtns.length || !bBtns.length) continue;
    // SOCD is resolved post-remap in firmware, so pairs use logical buttons.
    const aLogical = resolveLogicalButton(aBtns[0], rmap) || aBtns[0];
    const bLogical = resolveLogicalButton(bBtns[0], rmap) || bBtns[0];
    pairs.push([aLogical, bLogical]);
  }
  return pairs;
}

// Order-insensitive lookup of an existing SocdPair entry for two physical buttons.
function findSocdPair(profile, btnA, btnB) {
  if (!Array.isArray(profile.socdPairs)) return null;
  return profile.socdPairs.find(p =>
    (p.buttonDir1 === btnA && p.buttonDir2 === btnB) ||
    (p.buttonDir1 === btnB && p.buttonDir2 === btnA)
  ) || null;
}

function upsertSocdPair(profile, btnA, btnB, socdType) {
  if (!Array.isArray(profile.socdPairs)) profile.socdPairs = [];
  const existing = findSocdPair(profile, btnA, btnB);
  if (existing) existing.socdType = socdType;
  else profile.socdPairs.push({ buttonDir1: btnA, buttonDir2: btnB, socdType });
}

function removeSocdPair(profile, btnA, btnB) {
  if (!Array.isArray(profile.socdPairs)) return;
  profile.socdPairs = profile.socdPairs.filter(p => !(
    (p.buttonDir1 === btnA && p.buttonDir2 === btnB) ||
    (p.buttonDir1 === btnB && p.buttonDir2 === btnA)
  ));
}

// UI-only sentinel: "no socdPairs entry for this axis" (distinct from SOCD_NEUTRAL).
const SOCD_NONE = 'NONE';

function renderSocdList(profile) {
  const list = $('socd-list');
  list.innerHTML = '';
  const addBtn = $('btn-add-socd');

  if (isKeyboardProfile(profile)) {
    // Keyboard mode keeps the manual editor — there is no canonical stick/d-pad
    // axis to drive predefined pairs.
    addBtn.style.display = '';
    for (let i = 0; i < (profile.socdPairs?.length ?? 0); i++) {
      list.appendChild(buildSocdRow(profile.socdPairs[i], i, profile));
    }
    return;
  }

  // Controller modes — show one row per axis (Left X / Left Y / D-Pad X /
  // D-Pad Y / Right X / Right Y). Each axis is only rendered when the profile
  // actually has buttons producing those outputs. Axes with no existing
  // socdPairs entry display the "None" option — the user can explicitly opt
  // into a SOCD rule by picking any of the SOCD_* modes from the dropdown.
  addBtn.style.display = 'none';
  for (const axis of SOCD_AXES) {
    const pairs = axisButtonPairs(profile, axis);
    if (!pairs.length) continue;     // axis has no buttons in this mode — hide
    list.appendChild(buildSocdAxisRow(axis, pairs, profile));
  }
}

function buildSocdAxisRow(axis, pairs, profile) {
  const row = document.createElement('div');
  row.className = 'socd-item socd-axis-item';
  // Current type comes from the first existing pair. If no pair exists, the
  // axis is in the "None" state (no SOCD rule will be sent to the device).
  let currentType = SOCD_NONE;
  for (const [a, b] of pairs) {
    const ex = findSocdPair(profile, a, b);
    if (ex?.socdType) { currentType = ex.socdType; break; }
  }
  const options = [
    `<option value="${SOCD_NONE}"${currentType === SOCD_NONE ? ' selected' : ''}>NONE</option>`,
    ...SOCD_TYPES.map(t => `<option value="${t}"${t === currentType ? ' selected' : ''}>${t.replace('SOCD_','')}</option>`),
  ].join('');
  row.innerHTML = `
    <span class="socd-axis-label">${escHtml(axis.label)}</span>
    <span class="socd-sep">:</span>
    <select title="SOCD type for ${escHtml(axis.label)}">${options}</select>
  `;
  const select = row.querySelector('select');
  select.addEventListener('change', () => {
    if (select.value === SOCD_NONE) {
      for (const [a, b] of pairs) removeSocdPair(profile, a, b);
    } else {
      for (const [a, b] of pairs) upsertSocdPair(profile, a, b, select.value);
    }
  });
  return row;
}

// Keyboard-mode SOCD row — manual pair selection (kept from the previous UI).
function buildSocdRow(pair, idx, profile) {
  const row = document.createElement('div');
  row.className = 'socd-item';
  row.innerHTML = `
    <select class="socd-dir" title="Dir 1">${ALL_BUTTONS.map(b => `<option value="${b}"${b===pair.buttonDir1?' selected':''}>${b.replace('BTN_','')}</option>`).join('')}</select>
    <span class="socd-sep">↔</span>
    <select class="socd-dir" title="Dir 2">${ALL_BUTTONS.map(b => `<option value="${b}"${b===pair.buttonDir2?' selected':''}>${b.replace('BTN_','')}</option>`).join('')}</select>
    <span class="socd-sep">:</span>
    <select class="socd-type" title="SOCD type">${SOCD_TYPES.map(t => `<option value="${t}"${t===pair.socdType?' selected':''}>${t.replace('SOCD_','')}</option>`).join('')}</select>
    <button class="item-del-btn" title="Remove">✕</button>
  `;
  const [s1, s2, s3] = row.querySelectorAll('select');
  s1.addEventListener('change', () => { pair.buttonDir1 = s1.value; });
  s2.addEventListener('change', () => { pair.buttonDir2 = s2.value; });
  s3.addEventListener('change', () => { pair.socdType = s3.value; });
  row.querySelector('.item-del-btn').addEventListener('click', () => {
    profile.socdPairs.splice(idx, 1);
    renderSocdList(profile);
  });
  return row;
}

function renderRemapList(profile) {
  const list = $('remap-list');
  list.innerHTML = '';
  const chk = $('chk-remap-mode');
  if (chk) chk.checked = remapViewMode === 'advanced';

  // Keyboard / custom modes read their own binding tables, not buttonRemapping.
  // Rows are interactive: swap phys or output/keycode; ✕ clears; + adds on first unbound phys.
  if (isKeyboardProfile(profile)) {
    const kb = getKeyboardConfig(profile);
    const entries = (kb?.buttonsToKeycodes || []).filter(e => e.button && e.button !== 'BTN_UNSPECIFIED');
    // Stable order: by physical-button order on the device layout.
    entries.sort((a, b) => physBtnSortIndex(a.button) - physBtnSortIndex(b.button));
    for (const e of entries) {
      list.appendChild(buildKeyboardRemapRow(e.button, e.keycode, profile));
    }
    return;
  }
  if (isCustomProfile(profile)) {
    const cc = getCustomConfig(profile);
    if (cc) {
      const rows = [];
      (cc.digitalButtonMappings || []).forEach((btn, i) => {
        if (btn && btn !== 'BTN_UNSPECIFIED') {
          rows.push({ phys: btn, output: DIGITAL_OUTPUT_TO_OUTPUT_ID[i] });
        }
      });
      (cc.stickDirectionMappings || []).forEach((btn, i) => {
        if (btn && btn !== 'BTN_UNSPECIFIED') {
          rows.push({ phys: btn, output: STICK_DIR_TO_OUTPUT_ID[i] });
        }
      });
      // Sort by POPUP_OUTPUT_ORDER position — matches the simple view.
      rows.sort((a, b) => {
        const ia = POPUP_OUTPUT_ORDER.indexOf(a.output);
        const ib = POPUP_OUTPUT_ORDER.indexOf(b.output);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      });
      for (const { phys, output } of rows) {
        list.appendChild(buildCustomRemapRow(phys, output, profile));
      }
    }
    return;
  }

  if (remapViewMode === 'simple') {
    const modeMap = MODE_OUTPUT_MAP[profile.modeId] || {};
    const rmap = remapMap(profile);

    // Build effective mapping: every physical button that currently produces an output.
    // Buttons using the mode default (no explicit remap entry) are included too.
    const seen = new Set();
    const entries = [];  // [{ physBtn, outputId }]

    // 1. All buttons defined in the mode map — resolve their effective output.
    for (const physBtn of Object.keys(modeMap)) {
      if (seen.has(physBtn)) continue;
      seen.add(physBtn);
      const logical = resolveLogicalButton(physBtn, rmap);
      if (!logical) continue;               // explicitly disabled via remap entry
      const outputId = modeMap[logical];
      if (!outputId) continue;
      entries.push({ physBtn, outputId });
    }

    // 2. Buttons not in the mode map but given an explicit cross-remap.
    for (const r of (profile.buttonRemapping || [])) {
      if (!r.physicalButton || !r.activates || r.activates === 'BTN_UNSPECIFIED') continue;
      if (seen.has(r.physicalButton)) continue;
      const outputId = modeMap[r.activates];
      if (!outputId) continue;
      seen.add(r.physicalButton);
      entries.push({ physBtn: r.physicalButton, outputId });
    }

    // Sort by POPUP_OUTPUT_ORDER for a consistent, logical order.
    entries.sort((a, b) => {
      const ia = POPUP_OUTPUT_ORDER.indexOf(a.outputId);
      const ib = POPUP_OUTPUT_ORDER.indexOf(b.outputId);
      if (ia === -1 && ib === -1) return 0;
      return ia === -1 ? 1 : ib === -1 ? -1 : ia - ib;
    });

    for (const { physBtn, outputId } of entries) {
      list.appendChild(buildRemapRowSimple(physBtn, outputId, profile));
    }
  } else {
    for (let i = 0; i < (profile.buttonRemapping?.length ?? 0); i++) {
      list.appendChild(buildRemapRowAdvanced(profile.buttonRemapping[i], i, profile));
    }
  }
}

// Return a human-readable label for an output ID in the current platform style.
// Directional outputs get a context prefix so they're unambiguous in a dropdown.
function outputDropdownLabel(outputId) {
  const FIXED = {
    dup: 'D-Up', ddown: 'D-Down', dleft: 'D-Left', dright: 'D-Right',
    lsu: 'L-Up',  lsd: 'L-Down',  lsl: 'L-Left',  lsr: 'L-Right',
    csu: 'C-Up',  csd: 'C-Down',  csl: 'C-Left',  csr: 'C-Right',
    rt_light: 'Lt-Shield', rt_mid: 'Mid-Shield',
    // System buttons get word labels — the platform-styled glyphs (◉, ⌂, +)
    // aren't readable in a tooltip.
    home: 'Home', capture: 'Capture', start: 'Start', select: 'Back/Select',
    ls: 'L-Stick Click', rs: 'R-Stick Click',
    mx: 'Mod X', my: 'Mod Y',
  };
  if (FIXED[outputId]) return FIXED[outputId];
  if (isModifierOutputId(outputId)) return 'M' + (parseGroupIdx(outputId) + 1);
  if (isTriggerOutputId(outputId))  return 'T' + (parseGroupIdx(outputId) + 1);
  const style = (PLATFORM_STYLES[selectedPlatform] || XBOX_STYLE)[outputId];
  return style?.label || outputId;
}

// Synthesise a render-style for the M-{n} / T-{n} virtual outputs. Both look
// like compact rounded rects (kind: 'mod') so they pop visually next to the
// other shoulder/system buttons in the popup grid.
function virtualOutputStyle(outputId) {
  if (isModifierOutputId(outputId)) {
    return { label: 'M' + (parseGroupIdx(outputId) + 1), bg: DARK_BG, fg: LIGHT_TEXT, kind: 'mod' };
  }
  if (isTriggerOutputId(outputId)) {
    return { label: 'T' + (parseGroupIdx(outputId) + 1), bg: DARK_BG, fg: LIGHT_TEXT, kind: 'mod' };
  }
  return null;
}

// Tooltip label for a controller button. In keyboard mode we already have a
// HID-key label in style.label; for everything else we route through
// outputDropdownLabel() so "lsd" → "L-Down" rather than printing the raw id.
function tooltipOutputLabel(style, keyboardMode) {
  if (keyboardMode) return style.label;
  if (style._outputId) return outputDropdownLabel(style._outputId);
  return style.label || '';
}

// Sort-key helper so remap rows follow BUTTON_LAYOUT (physical device order).
const _PHYS_BTN_ORDER = (() => {
  const m = new Map();
  BUTTON_LAYOUT.forEach((b, i) => m.set(b.id, i));
  return m;
})();
function physBtnSortIndex(btnId) {
  return _PHYS_BTN_ORDER.get(btnId) ?? 999;
}

// First unbound non-MB physical button in BUTTON_LAYOUT order — used by + Add Remap.
function findFirstUnboundPhysButton(profile) {
  const bound = new Set();
  if (isCustomProfile(profile)) {
    const cc = getCustomConfig(profile);
    for (const arr of [cc?.digitalButtonMappings, cc?.stickDirectionMappings]) {
      for (const b of arr || []) {
        if (b && b !== 'BTN_UNSPECIFIED') bound.add(b);
      }
    }
  } else if (isKeyboardProfile(profile)) {
    const kb = getKeyboardConfig(profile);
    for (const e of (kb?.buttonsToKeycodes || [])) {
      if (e.button) bound.add(e.button);
    }
  }
  for (const btn of BUTTON_LAYOUT) {
    if (btn.id.startsWith('BTN_MB')) continue;
    if (!bound.has(btn.id)) return btn.id;
  }
  return null;
}

// Build the <option> list for a physical-button dropdown — all non-MB
// physical buttons, with the currently-bound one selected.
function physButtonOptions(selectedBtnId) {
  return BUTTON_LAYOUT
    .filter(b => !b.id.startsWith('BTN_MB'))
    .map(b => `<option value="${b.id}"${b.id === selectedBtnId ? ' selected' : ''}>${b.id.replace('BTN_', '')}</option>`)
    .join('');
}

// Same as physButtonOptions but prepends an "(unbound)" entry that maps to the
// empty string. Used by the M-group / T-entry in-row pickers where the binding
// can be cleared.
function physButtonOptionsWithUnbound(selectedBtnId) {
  const unboundSelected = !selectedBtnId || selectedBtnId === 'BTN_UNSPECIFIED' ? ' selected' : '';
  return `<option value=""${unboundSelected}>(unbound)</option>` + physButtonOptions(selectedBtnId);
}

// CUSTOM remap row: phys select moves binding, output select rebinds, ✕ clears.
function buildCustomRemapRow(physBtn, currentOutputId, profile) {
  const row = document.createElement('div');
  row.className = 'remap-item';

  const outputOpts = POPUP_OUTPUT_ORDER
    .filter(id => CUSTOM_MODE_OUTPUTS.has(id))
    .map(id => `<option value="${id}"${id === currentOutputId ? ' selected' : ''}>${escHtml(outputDropdownLabel(id))}</option>`)
    .join('');

  row.innerHTML = `
    <select title="Physical button">${physButtonOptions(physBtn)}</select>
    <span class="remap-sep">→</span>
    <select title="Output">${outputOpts}</select>
    <button class="item-del-btn" title="Clear this binding">✕</button>
  `;
  const [physSel, outSel] = row.querySelectorAll('select');

  physSel.addEventListener('change', () => {
    const newPhys = physSel.value;
    if (newPhys === physBtn) return;
    // Move the binding: clear the old phys, write the current output to the new.
    clearCustomButtonBinding(profile, physBtn);
    setCustomButtonOutput(profile, newPhys, outSel.value);
    renderRemapList(profile);
    buildControllerSVG();
  });

  outSel.addEventListener('change', () => {
    setCustomButtonOutput(profile, physBtn, outSel.value);
    renderRemapList(profile);
    buildControllerSVG();
  });

  row.querySelector('.item-del-btn').addEventListener('click', () => {
    clearCustomButtonBinding(profile, physBtn);
    renderRemapList(profile);
    buildControllerSVG();
  });

  return row;
}

// KEYBOARD-mode remap row. Phys side is a select; keycode side is a
// clickable label that delegates to the assign popup's key-capture flow
// (the popup already has a polished press-any-key UX; reusing it keeps the
// two entry points consistent and avoids a 100-option dropdown).
function buildKeyboardRemapRow(physBtn, keycode, profile) {
  const row = document.createElement('div');
  row.className = 'remap-item';

  const keyLabel = keycode != null ? keycodeToLabel(keycode) : '(unbound)';
  row.innerHTML = `
    <select title="Physical button">${physButtonOptions(physBtn)}</select>
    <span class="remap-sep">→</span>
    <button type="button" class="remap-keycode-btn" title="Click to re-bind (press any key)">${escHtml(keyLabel)}</button>
    <button class="item-del-btn" title="Clear this binding">✕</button>
  `;
  const physSel = row.querySelector('select');

  physSel.addEventListener('change', () => {
    const newPhys = physSel.value;
    if (newPhys === physBtn) return;
    // Move the keycode to the new physical button; clear the old.
    setButtonKeycode(profile, physBtn, null);
    setButtonKeycode(profile, newPhys, keycode);
    renderRemapList(profile);
    buildControllerSVG();
  });

  row.querySelector('.remap-keycode-btn').addEventListener('click', (e) => {
    // Reuse the assign popup's key-capture UI. stopPropagation prevents the
    // outside-click handler from immediately closing what we just opened.
    e.stopPropagation();
    openOutputPopup(physBtn);
  });

  row.querySelector('.item-del-btn').addEventListener('click', () => {
    setButtonKeycode(profile, physBtn, null);
    renderRemapList(profile);
    buildControllerSVG();
  });

  return row;
}

function buildRemapRowSimple(physBtn, currentOutputId, profile) {
  const modeMap = MODE_OUTPUT_MAP[profile.modeId] || {};
  const row = document.createElement('div');
  row.className = 'remap-item';

  const allOpts = ALL_BUTTONS
    .filter(b => b !== 'BTN_UNSPECIFIED')
    .map(b => `<option value="${b}"${b === physBtn ? ' selected' : ''}>${b.replace('BTN_', '')}</option>`)
    .join('');

  const outputOpts = [];
  const seenOutputs = new Set();
  for (const outId of POPUP_OUTPUT_ORDER) {
    if (seenOutputs.has(outId)) continue;
    const p = Object.entries(modeMap).find(([, o]) => o === outId)?.[0];
    if (!p) continue;
    seenOutputs.add(outId);
    const sel = outId === currentOutputId ? ' selected' : '';
    outputOpts.push(`<option value="${outId}"${sel}>${outputDropdownLabel(outId)}</option>`);
  }

  row.innerHTML = `
    <select title="Physical button">${allOpts}</select>
    <span class="remap-sep">→</span>
    <select title="Output">${outputOpts.join('')}</select>
    <button class="item-del-btn" title="Disable this button">✕</button>
  `;
  const [s1, s2] = row.querySelectorAll('select');

  s1.addEventListener('change', () => {
    const newPhysBtn = s1.value;
    if (newPhysBtn === physBtn) return;
    // Disable the old physical button and remap the new one to the same output.
    setRemap(physBtn, null);
    const activates = Object.entries(modeMap).find(([, o]) => o === s2.value)?.[0];
    if (activates) setRemap(newPhysBtn, activates);
    renderRemapList(profile);
    buildControllerSVG();
  });

  s2.addEventListener('change', () => {
    const activates = Object.entries(modeMap).find(([, o]) => o === s2.value)?.[0];
    if (activates) setRemap(physBtn, activates);
    buildControllerSVG();
  });

  row.querySelector('.item-del-btn').addEventListener('click', () => {
    setRemap(physBtn, null);   // add disabled entry → disappears from simple view
    renderRemapList(profile);
    buildControllerSVG();
  });
  return row;
}

// Advanced view: both sides show raw physical button IDs.
// X removes the entry from the array entirely.
function buildRemapRowAdvanced(remap, idx, profile) {
  const row = document.createElement('div');
  row.className = 'remap-item';
  const allOpts = ALL_BUTTONS
    .map(b => `<option value="${b}"${b === remap.physicalButton ? ' selected' : ''}>${b.replace('BTN_', '')}</option>`)
    .join('');
  const actOpts = ALL_BUTTONS
    .map(b => `<option value="${b}"${b === (remap.activates || 'BTN_UNSPECIFIED') ? ' selected' : ''}>${b.replace('BTN_', '')}</option>`)
    .join('');
  row.innerHTML = `
    <select title="Physical button">${allOpts}</select>
    <span class="remap-sep">→</span>
    <select title="Activates (physical)">${actOpts}</select>
    <button class="item-del-btn" title="Remove entry">✕</button>
  `;
  const [s1, s2] = row.querySelectorAll('select');
  s1.addEventListener('change', () => { remap.physicalButton = s1.value; buildControllerSVG(); });
  s2.addEventListener('change', () => { remap.activates = s2.value; buildControllerSVG(); });
  row.querySelector('.item-del-btn').addEventListener('click', () => {
    profile.buttonRemapping.splice(idx, 1);
    renderRemapList(profile);
    buildControllerSVG();
  });
  return row;
}

// ---------------------------------------------------------------------------
// Output-assignment popup
// ---------------------------------------------------------------------------

// Reverse of OUTPUT_OPTION_TO_OUTPUT_ID — used when writing menuButtonIcon.
const OUTPUT_ID_TO_OUTPUT_OPTION = {
  a: 'OUT_A', b: 'OUT_B', x: 'OUT_X', y: 'OUT_Y',
  lb: 'OUT_LB', rb: 'OUT_RB', lt: 'OUT_LT', rt: 'OUT_RT',
  start: 'OUT_XB_START', select: 'OUT_XB_BACK',
  home: 'OUT_HOME', capture: 'OUT_SW_CAPTURE',
  dup: 'OUT_DPAD_UP',   ddown: 'OUT_DPAD_DOWN',
  dleft: 'OUT_DPAD_LEFT', dright: 'OUT_DPAD_RIGHT',
  ls: 'OUT_L3', rs: 'OUT_R3',
};

// Logical order for the popup grid.
const POPUP_OUTPUT_ORDER = [
  // Face buttons
  'a', 'b', 'x', 'y',
  // System
  'home', 'select', 'start', 'capture',
  // D-pad (4 directions)
  'dup', 'ddown', 'dleft', 'dright',
  // Bumpers / triggers
  'lb', 'rb', 'lt', 'rt',
  // Stick clicks
  'ls', 'rs',
  // Platform-fighter modifiers
  'mx', 'my',
  // Melee analog shield steps
  'rt_light', 'rt_mid',
  // L-stick directions
  'lsu', 'lsd', 'lsl', 'lsr',
  // C-stick / Right-stick directions
  'csu', 'csd', 'csl', 'csr',
];

// Find the physical button that produces a given output in the current mode.
function findPhysicalButtonForOutput(outputId, modeId) {
  const modeMap = MODE_OUTPUT_MAP[modeId];
  if (!modeMap) return null;
  for (const [btn, out] of Object.entries(modeMap)) {
    if (out === outputId) return btn;
  }
  return null;
}

// Outputs that are always assignable regardless of mode (system / menu buttons).
// Non-MB buttons can bind these even if the mode map doesn't natively produce them.
// LS/RS excluded — only FGC + CUSTOM wire outputs.leftStickClick / rightStickClick.
const SYSTEM_OUTPUTS = new Set(['start', 'select', 'capture', 'home']);

// Backends that carry LS / RS. Console backends drop stick clicks in firmware.
const BACKENDS_WITH_STICK_CLICK = new Set([
  'COMMS_BACKEND_DINPUT',
  'COMMS_BACKEND_XINPUT',
  'COMMS_BACKEND_NINTENDO_SWITCH',
]);

function profileSupportsStickClick(profile) {
  const backends = profile?.applicableBackends;
  if (!Array.isArray(backends) || backends.length === 0) return true;
  return backends.some(b => BACKENDS_WITH_STICK_CLICK.has(b));
}

// Outputs bindable in this profile's mode. Adds SYSTEM_OUTPUTS everywhere,
// virtual M{n}/T{n} for CUSTOM. Strips ls/rs when no backend carries them.
function availableOutputs(profile) {
  const modeId = profile?.modeId;
  let base;
  if (modeId === 'MODE_CUSTOM') {
    base = new Set(CUSTOM_MODE_OUTPUTS);
    const cc = getCustomConfig(profile);
    if (cc) {
      modifierGroups(cc).forEach((_g, i) => base.add(modifierOutputId(i)));
      (cc.analogTriggerMappings || []).forEach((_t, i) => base.add(triggerOutputId(i)));
    }
  } else {
    const modeMap = MODE_OUTPUT_MAP[modeId];
    base = modeMap ? new Set(Object.values(modeMap)) : new Set();
    for (const s of SYSTEM_OUTPUTS) base.add(s);
  }
  if (!profileSupportsStickClick(profile)) {
    base.delete('ls');
    base.delete('rs');
  }
  return base;
}

function openOutputPopup(btnId, _evt) {
  const btn = BUTTON_BY_ID[btnId];
  if (!btn) return;
  const profile = currentProfile();
  if (!profile) return;

  selectedBtnId = btnId;
  buildControllerSVG();   // re-render to highlight selected (replaces <g> nodes)

  $('output-popup-btn-name').textContent = btnId.replace('BTN_', '');

  const remappable = canRemap(btnId);
  const hasLed = hasLED(btnId);
  const keyboardMode = isKeyboardProfile(profile);

  const rainbowMode = isRainbowAnim(profile);

  // Toggle popup sections per mode (keyboard swaps grid for key-capture; rainbow swaps color row for participate/off toggle).
  $('output-popup-grid').style.display     = (!keyboardMode && remappable) ? '' : 'none';
  $('output-popup-keyboard').style.display = (keyboardMode && remappable)  ? '' : 'none';
  $('output-popup-unmap').style.display    = remappable ? '' : 'none';
  $('output-popup-color').style.display    = (hasLed && !rainbowMode) ? '' : 'none';
  $('output-popup-rainbow').hidden         = !(hasLed && rainbowMode);
  $('popup-saved-colors').hidden           = !hasLed || rainbowMode || savedColors.length === 0;

  if (!keyboardMode) {
    const grid = $('output-popup-grid');
    grid.innerHTML = '';
    if (remappable) {
      const platformStyle = PLATFORM_STYLES[selectedPlatform] || XBOX_STYLE;
      const available = availableOutputs(profile);

      // First pass: the fixed order of platform outputs.
      for (const outId of POPUP_OUTPUT_ORDER) {
        if (!available.has(outId)) continue;
        const style = platformStyle[outId] || virtualOutputStyle(outId);
        if (!style) continue;
        grid.appendChild(renderOutputGlyph(outId, style));
      }
      // Second pass: any M:* / T:* virtual outputs the profile defines. They
      // come after the standard outputs since their numbering is data-driven.
      for (const outId of available) {
        if (!isModifierOutputId(outId) && !isTriggerOutputId(outId)) continue;
        const style = virtualOutputStyle(outId);
        grid.appendChild(renderOutputGlyph(outId, style));
      }
    }
  } else {
    // Show the current keycode (or prompt) on the capture button
    syncPopupKeyboardInput(btnId);
  }

  if (hasLed && !rainbowMode) {
    syncPopupColorControls(btnId);
    renderAllSavedColorPalettes();
  } else if (hasLed && rainbowMode) {
    syncPopupRainbowControls(btnId);
  }

  positionOutputPopup(btnId);
  $('output-popup').classList.remove('hidden');
}

function syncPopupKeyboardInput(btnId) {
  const btn = $('popup-keyboard-input');
  btn.classList.remove('capturing');
  const code = getButtonKeycode(currentProfile(), btnId);
  btn.textContent = (code != null) ? keycodeToLabel(code) : 'Click then press a key';
}

function syncPopupColorControls(btnId) {
  const profile = currentProfile();
  if (!profile) return;
  const color = getButtonColor(profile, btnId);
  const hex = colorIntToHex(color);
  $('popup-color-swatch').style.background = hex;
  $('popup-color-hex').value = hex;
  $('popup-color-hex').classList.remove('invalid');
}

// Rainbow popup mode: highlight whichever of the two toggle buttons matches
// the stored color for this button (participate = 0xFFFFFF, off = anything
// less). The matching button gets `.selected` so the user can see the state.
function syncPopupRainbowControls(btnId) {
  const profile = currentProfile();
  if (!profile) return;
  const stored = getButtonColor(profile, btnId);
  const participating = stored >= RAINBOW_PARTICIPATING_COLOR;
  $('popup-rainbow-on').classList.toggle('selected', participating);
  $('popup-rainbow-off').classList.toggle('selected', !participating);
}

function positionOutputPopup(btnId) {
  const popup = $('output-popup');

  // Look up the (freshly-rendered) <g> for this button so we get its current
  // screen rect — the original evt.currentTarget is detached after the SVG
  // rebuild and would yield a zero rect.
  const target = btnId ? svg().querySelector(`[data-btn="${btnId}"]`) : null;
  let rect = target?.getBoundingClientRect();
  if (!rect || (rect.width === 0 && rect.height === 0)) {
    rect = { left: window.innerWidth/2 - 130, top: 100, right: 0, bottom: 0, width: 0, height: 0 };
  }

  // Measure popup off-screen
  popup.style.left = '-9999px';
  popup.style.top = '0';
  popup.classList.remove('hidden');
  const pr = popup.getBoundingClientRect();
  const popupW = pr.width, popupH = pr.height;

  const gap = 12;
  let left = rect.right + gap;
  if (left + popupW > window.innerWidth - 16) left = rect.left - popupW - gap;
  if (left < 16) left = 16;

  let top = rect.top + rect.height/2 - popupH/2;
  if (top + popupH > window.innerHeight - 16) top = window.innerHeight - popupH - 16;
  if (top < 16) top = 16;

  popup.style.left = `${Math.round(left)}px`;
  popup.style.top  = `${Math.round(top)}px`;
}

function closeOutputPopup() {
  closeHsvPicker();
  $('output-popup').classList.add('hidden');
  if (selectedBtnId) {
    selectedBtnId = null;
    buildControllerSVG();
  }
}

function renderOutputGlyph(outputId, style) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'output-glyph';
  el.dataset.output = outputId;
  el.title = outputId;

  const iconPath = getIconPath(selectedPlatform, outputId);
  if (iconPath) {
    // Icon carries its own background; use neutral popup bg behind it.
    el.style.background = POPUP_NEUTRAL_BG;
    el.style.color = style.fg;
    const img = document.createElement('img');
    img.src = iconPath;
    img.alt = style.label || outputId;
    img.className = 'output-glyph-icon';
    el.appendChild(img);
  } else {
    // For neutral (non-colored) buttons, use a slightly lighter shade than the
    // popup card so they pop out. Face buttons with their canonical colors keep
    // their own background.
    el.style.background = (style.bg === DARK_BG) ? POPUP_NEUTRAL_BG : style.bg;
    el.style.color = style.fg;

    if (style.kind === 'dpad' || style.kind === 'stick' || style.kind === 'cstick') {
      el.appendChild(buildArrowGlyph(style.label, style.fg));
      if (style.kind === 'cstick') {
        const badge = document.createElement('span');
        badge.className = 'output-glyph-c-badge';
        badge.textContent = 'C';
        el.appendChild(badge);
      }
    } else if (style.glyph) {
      // PS face-button shape (cross / circle / square / triangle)
      const NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 36 36');
      svg.setAttribute('class', 'output-glyph-arrow');
      svg.appendChild(buildPSFaceGlyphSvg(style.glyph, style.fg, 18, 18, 12, 4));
      el.appendChild(svg);
    } else {
      el.textContent = style.label;
    }
  }

  el.addEventListener('click', (e) => {
    e.stopPropagation();
    applyOutput(outputId);
  });
  return el;
}

function buildArrowGlyph(direction, color) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '-10 -10 20 20');
  svg.setAttribute('class', 'output-glyph-arrow');
  const armLen = 8, headSize = 4, strokeW = 2;
  let x1, y1, x2, y2, hx1, hy1, hx2, hy2;
  if (direction === '↑') {
    x1=0; y1=armLen/2; x2=0; y2=-armLen/2;
    hx1=-headSize; hy1=-armLen/2 + headSize; hx2=headSize; hy2=-armLen/2 + headSize;
  } else if (direction === '↓') {
    x1=0; y1=-armLen/2; x2=0; y2=armLen/2;
    hx1=-headSize; hy1=armLen/2 - headSize; hx2=headSize; hy2=armLen/2 - headSize;
  } else if (direction === '←') {
    x1=armLen/2; y1=0; x2=-armLen/2; y2=0;
    hx1=-armLen/2 + headSize; hy1=-headSize; hx2=-armLen/2 + headSize; hy2=headSize;
  } else {
    x1=-armLen/2; y1=0; x2=armLen/2; y2=0;
    hx1=armLen/2 - headSize; hy1=-headSize; hx2=armLen/2 - headSize; hy2=headSize;
  }
  for (const [a, b, c, d] of [[x1,y1,x2,y2], [hx1,hy1,x2,y2], [hx2,hy2,x2,y2]]) {
    const ln = document.createElementNS(NS, 'line');
    ln.setAttribute('x1', a); ln.setAttribute('y1', b);
    ln.setAttribute('x2', c); ln.setAttribute('y2', d);
    ln.setAttribute('stroke', color);
    ln.setAttribute('stroke-width', strokeW);
    ln.setAttribute('stroke-linecap', 'round');
    ln.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(ln);
  }
  return svg;
}

function emptyMenuIconArray() {
  return ['OUT_UNSPECIFIED','OUT_UNSPECIFIED','OUT_UNSPECIFIED','OUT_UNSPECIFIED','OUT_UNSPECIFIED','OUT_UNSPECIFIED','OUT_UNSPECIFIED'];
}

// Snapshot whether a physical button currently has any kind of binding,
// before mutating it. Used to decide whether `applyOutput` / key-capture
// should auto-toggle the LED on (only on first assignment, not on
// re-bindings — re-bindings preserve whatever colour the user has set).
function buttonHasBinding(profile, btnId) {
  if (btnId.startsWith('BTN_MB')) {
    // MBs always count as bound — they have firmware defaults even when
    // menuButtonIcon is OUT_UNSPECIFIED, and MB1 is non-remappable anyway.
    return true;
  }
  if (isKeyboardProfile(profile)) {
    return getButtonKeycode(profile, btnId) != null;
  }
  return resolveButtonOutput(btnId, profile, remapMap(profile)) != null;
}

// After a first-time bind: default LED to cyan. Re-binds keep whatever color was set.
function autoEnableLedOnAssign(profile, btnId, wasBound) {
  if (wasBound) return;
  if (!hasLED(btnId)) return;
  if (getButtonColor(profile, btnId) !== 0) return;
  setButtonColor(profile, btnId, DEFAULT_LED_COLOR_INT);
}

// After unbind: LED off (MB1 has no off state; skip).
function autoDisableLedOnUnassign(profile, btnId) {
  if (!hasLED(btnId)) return;
  if (NON_REMAPPABLE_BUTTONS.has(btnId)) return;
  setButtonColor(profile, btnId, 0);
}

function applyOutput(outputId) {
  const profile = currentProfile();
  if (!profile || !selectedBtnId) { closeOutputPopup(); return; }

  const wasBound = buttonHasBinding(profile, selectedBtnId);

  // MB: write to menuButtonIcon (CUSTOM: route to digitalButtonMappings — icon is cosmetic).
  if (selectedBtnId.startsWith('BTN_MB')) {
    if (isCustomProfile(profile)) {
      setCustomButtonOutput(profile, selectedBtnId, outputId);
      autoEnableLedOnAssign(profile, selectedBtnId, wasBound);
      closeOutputPopup();
      renderAll();
      return;
    }
    const mbIdx = parseInt(selectedBtnId.slice(6), 10) - 1;
    if (!profile.menuButtonIcon) profile.menuButtonIcon = emptyMenuIconArray();
    profile.menuButtonIcon[mbIdx] = OUTPUT_ID_TO_OUTPUT_OPTION[outputId] || 'OUT_UNSPECIFIED';
    autoEnableLedOnAssign(profile, selectedBtnId, wasBound);
    closeOutputPopup();
    renderAll();
    return;
  }

  // CUSTOM: 'additional' mirrors controller-mode remap behaviour — adds a
  // duplicate binding when another button already primaries the output;
  // silently falls back to 'primary' when unbound or same button.
  if (isCustomProfile(profile)) {
    setCustomButtonOutput(profile, selectedBtnId, outputId, 'additional');
    autoEnableLedOnAssign(profile, selectedBtnId, wasBound);
    closeOutputPopup();
    renderAll();
    return;
  }

  // Controller: remap selectedBtn to the phys that natively produces outputId.
  const phys = findPhysicalButtonForOutput(outputId, profile.modeId);
  if (!phys) { closeOutputPopup(); return; }
  setRemap(selectedBtnId, phys);
  autoEnableLedOnAssign(profile, selectedBtnId, wasBound);
  closeOutputPopup();
  renderAll();
}

function unmapSelected() {
  const profile = currentProfile();
  if (!profile || !selectedBtnId) { closeOutputPopup(); return; }

  if (isKeyboardProfile(profile)) {
    // Keyboard mode: clear the keycode for this physical button.
    setButtonKeycode(profile, selectedBtnId, null);
  } else if (selectedBtnId.startsWith('BTN_MB')) {
    if (isCustomProfile(profile)) {
      // Custom mode: assignment lives in digitalButtonMappings, not menuButtonIcon.
      clearCustomButtonBinding(profile, selectedBtnId);
    } else {
      const mbIdx = parseInt(selectedBtnId.slice(6), 10) - 1;
      if (!profile.menuButtonIcon) profile.menuButtonIcon = emptyMenuIconArray();
      profile.menuButtonIcon[mbIdx] = 'OUT_UNSPECIFIED';
    }
  } else if (isCustomProfile(profile)) {
    clearCustomButtonBinding(profile, selectedBtnId);
  } else {
    setRemap(selectedBtnId, null);   // explicit disable
  }
  autoDisableLedOnUnassign(profile, selectedBtnId);
  closeOutputPopup();
  renderAll();
}

// CUSTOM write helpers ------------------------------------------------------

// Physical button owning the primary slot for a digital/stick output, or null.
function customPrimaryForOutput(cc, outputId) {
  if (!cc) return null;
  if (outputId in OUTPUT_ID_TO_DIGITAL_INDEX) {
    const b = cc.digitalButtonMappings?.[OUTPUT_ID_TO_DIGITAL_INDEX[outputId]];
    return (b && b !== 'BTN_UNSPECIFIED') ? b : null;
  }
  if (outputId in OUTPUT_ID_TO_STICK_INDEX) {
    const b = cc.stickDirectionMappings?.[OUTPUT_ID_TO_STICK_INDEX[outputId]];
    return (b && b !== 'BTN_UNSPECIFIED') ? b : null;
  }
  return null;
}

// mode='primary' overwrites the slot; mode='additional' adds a buttonRemapping
// entry so both this button and the existing primary fire the same output
// (via HandleRemap). Falls back to primary when there's no existing primary,
// when it's the same button, or when the output isn't digital/stick.
function setCustomButtonOutput(profile, btnId, outputId, mode = 'primary') {
  const cc = ensureCustomConfig(profile);
  if (!cc) return;

  if (mode === 'additional'
      && (outputId in OUTPUT_ID_TO_DIGITAL_INDEX || outputId in OUTPUT_ID_TO_STICK_INDEX)) {
    const primary = customPrimaryForOutput(cc, outputId);
    if (primary && primary !== btnId) {
      clearCustomButtonBinding(profile, btnId);
      if (!Array.isArray(profile.buttonRemapping)) profile.buttonRemapping = [];
      profile.buttonRemapping.push({ physicalButton: btnId, activates: primary });
      return;
    }
  }

  clearCustomButtonBinding(profile, btnId);

  if (outputId in OUTPUT_ID_TO_DIGITAL_INDEX) {
    const idx = OUTPUT_ID_TO_DIGITAL_INDEX[outputId];
    if (!Array.isArray(cc.digitalButtonMappings)) cc.digitalButtonMappings = [];
    while (cc.digitalButtonMappings.length <= idx) {
      cc.digitalButtonMappings.push('BTN_UNSPECIFIED');
    }
    cc.digitalButtonMappings[idx] = btnId;
  } else if (outputId in OUTPUT_ID_TO_STICK_INDEX) {
    const idx = OUTPUT_ID_TO_STICK_INDEX[outputId];
    if (!Array.isArray(cc.stickDirectionMappings)) cc.stickDirectionMappings = [];
    while (cc.stickDirectionMappings.length <= idx) {
      cc.stickDirectionMappings.push('BTN_UNSPECIFIED');
    }
    cc.stickDirectionMappings[idx] = btnId;
  } else if (isModifierOutputId(outputId)) {
    // Move the M-group's activation to btnId across all its axes.
    const groupIdx = parseGroupIdx(outputId);
    const groups = modifierGroups(cc);
    const target = groups[groupIdx];
    if (target) {
      for (const entry of target.entries) {
        entry.buttons = [btnId];
      }
    }
  } else if (isTriggerOutputId(outputId)) {
    const triggers = cc.analogTriggerMappings || [];
    const t = triggers[parseGroupIdx(outputId)];
    if (t) t.button = btnId;
  }
}

function clearCustomButtonBinding(profile, btnId) {
  const cc = getCustomConfig(profile);
  if (!cc) return;

  // If btnId is a primary with additional-bind dependents, promote the first
  // dependent into its slot and repoint the rest so their bindings stay live.
  const remap = Array.isArray(profile.buttonRemapping) ? profile.buttonRemapping : [];
  const findFirstDependent = () =>
    remap.find(r => r.physicalButton !== btnId && r.activates === btnId)?.physicalButton;

  const clearAndPromote = (arr) => {
    if (!Array.isArray(arr)) return;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== btnId) continue;
      const heir = findFirstDependent();
      if (heir) {
        arr[i] = heir;
        for (let j = remap.length - 1; j >= 0; j--) {
          const r = remap[j];
          if (r.physicalButton === heir && r.activates === btnId) {
            remap.splice(j, 1);
          } else if (r.activates === btnId) {
            r.activates = heir;
          }
        }
      } else {
        arr[i] = 'BTN_UNSPECIFIED';
      }
    }
  };
  clearAndPromote(cc.digitalButtonMappings);
  clearAndPromote(cc.stickDirectionMappings);

  // Drop remap entries FROM btnId (must run after promotion so heirs survive).
  if (Array.isArray(profile.buttonRemapping)) {
    profile.buttonRemapping = profile.buttonRemapping.filter(r => r.physicalButton !== btnId);
  }
  // M-group entries with empty buttons stay (firmware short-circuits mask=0),
  // triggers with BTN_UNSPECIFIED stay (get_button returns false) — keeps UI slots.
  if (Array.isArray(cc.modifiers)) {
    for (const m of cc.modifiers) {
      if (Array.isArray(m.buttons) && m.buttons.includes(btnId)) {
        m.buttons = m.buttons.filter(b => b !== btnId);
      }
    }
  }
  if (Array.isArray(cc.analogTriggerMappings)) {
    for (const t of cc.analogTriggerMappings) {
      if (t.button === btnId) t.button = 'BTN_UNSPECIFIED';
    }
  }
}

function setRemap(physBtnId, activates) {
  const profile = currentProfile();
  if (!profile) return;
  if (!profile.buttonRemapping) profile.buttonRemapping = [];
  const idx = profile.buttonRemapping.findIndex(r => r.physicalButton === physBtnId);
  const entry = activates ? { physicalButton: physBtnId, activates } : { physicalButton: physBtnId };
  if (idx >= 0) profile.buttonRemapping[idx] = entry;
  else profile.buttonRemapping.push(entry);
}

// ---------------------------------------------------------------------------
// Full render
// ---------------------------------------------------------------------------
// Console tabs shown when the matching backend is enabled; auto-switches to
// the first enabled tab. GameCube wins ties by list order.
const CONSOLE_TABS = [
  { platform: 'gamecube', backend: 'COMMS_BACKEND_GAMECUBE' },
  { platform: 'n64',      backend: 'COMMS_BACKEND_N64'      },
];

function updateGcTab() {
  const profile = currentProfile();
  // Keyboard mode doesn't emit gamepad outputs — hide the platform bar.
  const platformBar = document.querySelector('.platform-bar');
  if (platformBar) platformBar.classList.toggle('hidden', isKeyboardProfile(profile));

  let firstEnabled = null;
  const enabledByPlatform = {};
  for (const { platform, backend } of CONSOLE_TABS) {
    const tab = document.querySelector(`.platform-tab[data-platform="${platform}"]`);
    if (!tab) continue;
    const enabled = profile?.applicableBackends?.includes(backend) ?? false;
    tab.classList.toggle('hidden', !enabled);
    enabledByPlatform[platform] = enabled;
    if (enabled && !firstEnabled) firstEnabled = platform;
  }

  const consolePlatforms = new Set(CONSOLE_TABS.map(t => t.platform));
  const onConsoleTab = consolePlatforms.has(selectedPlatform);
  let target = null;

  if (onConsoleTab && !enabledByPlatform[selectedPlatform]) {
    // The console tab the user was on just lost its backend — fall back.
    target = firstEnabled || 'xbox';
  } else if (!onConsoleTab && firstEnabled) {
    // User was on Xbox/PS/Switch and a console backend just became active —
    // auto-switch to that console's display style.
    target = firstEnabled;
  }

  if (target && target !== selectedPlatform) {
    selectedPlatform = target;
    document.querySelectorAll('.platform-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.platform === selectedPlatform));
    buildControllerSVG();
  }
}

function renderAll() {
  renderProfileList();
  buildControllerSVG();
  renderSettingsPanel();
  updateGcTab();
}

// ---------------------------------------------------------------------------
// Settings panel event wiring (change handlers)
// ---------------------------------------------------------------------------
function wireSettingsHandlers() {
  $('set-name').addEventListener('input', () => {
    const p = currentProfile();
    if (p) {
      p.name = $('set-name').value;
      renderProfileList();
      $('settings-profile-name').textContent = p.name || 'Profile Settings';
    }
  });

  $('btn-rename-profile').addEventListener('click', startRenameProfileFromHeader);

  $('set-mode-id').addEventListener('change', () => {
    const p = currentProfile();
    if (!p) return;
    const oldMode = p.modeId;
    const newMode = $('set-mode-id').value;
    if (oldMode === newMode) return;

    // Rewrite binds so each button keeps its effective output under the new mode.
    preserveOutputsAcrossModeChange(p, oldMode, newMode);

    // Keyboard backends: DInput-only on entry (only backend that emits HID kbd),
    // restore USB triplet on exit. Non-keyboard transitions leave backends alone.
    if (newMode === 'MODE_KEYBOARD' && oldMode !== 'MODE_KEYBOARD') {
      p.applicableBackends = ['COMMS_BACKEND_DINPUT'];
    } else if (oldMode === 'MODE_KEYBOARD' && newMode !== 'MODE_KEYBOARD') {
      p.applicableBackends = [...USB_BACKENDS];
    }

    p.modeId = newMode;
    // Entering CUSTOM: drop source mode's explicit-disables, keep multi-bind entries.
    if (newMode === 'MODE_CUSTOM' && oldMode !== 'MODE_CUSTOM') {
      sanitizeCustomButtonRemapping(p);
    }
    // Leaving CUSTOM with no SOCDs: seed NEUTRAL so axis rows aren't "None".
    if (oldMode === 'MODE_CUSTOM' && newMode !== 'MODE_CUSTOM'
        && (!Array.isArray(p.socdPairs) || p.socdPairs.length === 0)) {
      seedNeutralSocdPairs(p);
    }
    // Legacy fields from an older handler; scrub in case they persisted in memory.
    delete p._preCustomButtonRemapping;
    delete p._preCustomModeId;
    renderProfileList();
    renderSettingsPanel();
    buildControllerSVG();
    updateGcTab();
  });

  // Custom mode: stick range input
  $('set-custom-stick-range').addEventListener('input', () => {
    const p = currentProfile();
    if (!p) return;
    const cc = ensureCustomConfig(p);
    const v = parseInt($('set-custom-stick-range').value, 10);
    if (!Number.isNaN(v)) cc.stickRange = Math.max(0, Math.min(127, v));
  });

  // Add M-group: one entry per axis, multiplier 0 (neutral in both combination modes).
  // Empty `buttons` is safe — all_buttons_held short-circuits on mask=0.
  $('btn-add-custom-modifier').addEventListener('click', () => {
    const p = currentProfile();
    if (!p) return;
    const cc = ensureCustomConfig(p);
    if (!Array.isArray(cc.modifiers)) cc.modifiers = [];
    for (const axis of ANALOG_AXES) {
      cc.modifiers.push({
        buttons: [],
        axis: axis.value,
        multiplier: MODIFIER_DEFAULT_MULTIPLIER,
        combinationMode: 'COMBINATION_MODE_OVERRIDE',
      });
    }
    renderCustomModifierList(p, cc);
    buildControllerSVG();
  });

  // Add T-entry: LT, full-press (255), unbound button. Safe — get_button short-circuits on BTN_UNSPECIFIED.
  $('btn-add-custom-trigger').addEventListener('click', () => {
    const p = currentProfile();
    if (!p) return;
    const cc = ensureCustomConfig(p);
    if (!Array.isArray(cc.analogTriggerMappings)) cc.analogTriggerMappings = [];
    cc.analogTriggerMappings.push({
      button: 'BTN_UNSPECIFIED',
      trigger: 'TRIGGER_LT',
      value: TRIGGER_FULL_PRESS_VALUE,
    });
    renderCustomTriggerList(p, cc);
    buildControllerSVG();
  });

  // Collapsible sections (Button Remapping, SOCD Pairs, Button Lighting).
  // Toggle button `aria-expanded` + body `hidden` off the same shared handler.
  const wireCollapse = (toggleId, bodyId) => {
    const toggle = $(toggleId);
    const body = $(bodyId);
    if (!toggle || !body) return;
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      body.hidden = expanded;
    });
  };
  wireCollapse('remap-toggle', 'remap-body');
  wireCollapse('socd-toggle', 'socd-body');
  wireCollapse('lighting-toggle', 'lighting-body');

  // RGB animation dropdown. Switching to a rainbow animation does NOT auto-mark
  // every button as participating — the user has to click "Apply to mapped
  // buttons" for that (so they can preview the speed/etc. first). Switching
  // away from rainbow leaves the per-button colors as-is.
  $('set-rgb-animation').addEventListener('change', () => {
    const p = currentProfile();
    if (!p) return;
    const rgb = ensureRgbConfig(p);
    rgb.animation = $('set-rgb-animation').value;
    if (RAINBOW_ANIMATIONS.has(rgb.animation) && !rgb.speed) {
      rgb.speed = DEFAULT_RAINBOW_SPEED;
    }
    renderRgbSection(p);
    buildControllerSVG();   // ring style may flip to/from rainbow
  });

  // Rainbow speed slider — 5 fixed steps mapped to firmware speed values.
  $('set-rgb-speed').addEventListener('input', () => {
    const p = currentProfile();
    if (!p) return;
    const rgb = ensureRgbConfig(p);
    const step = parseInt($('set-rgb-speed').value, 10) || 0;
    rgb.speed = RAINBOW_SPEED_STEPS[step] ?? DEFAULT_RAINBOW_SPEED;
  });

  // RGB color swatch: opens the HSV picker
  $('set-rgb-color-swatch').addEventListener('click', (e) => {
    e.stopPropagation();
    if (!currentProfile()) return;
    closeHsvPicker();
    openHsvPicker(e.currentTarget, parseHexInput($('set-rgb-color-hex').value) ?? DEFAULT_LED_COLOR_INT, (c) => {
      const h = colorIntToHex(c);
      $('set-rgb-color-swatch').style.background = h;
      $('set-rgb-color-hex').value = h;
      $('set-rgb-color-hex').classList.remove('invalid');
    });
  });

  $('set-rgb-color-hex').addEventListener('input', (e) => {
    const colorInt = parseHexInput(e.target.value);
    if (colorInt == null) { e.target.classList.add('invalid'); return; }
    e.target.classList.remove('invalid');
    $('set-rgb-color-swatch').style.background = colorIntToHex(colorInt);
    if (!$('hsl-picker').classList.contains('hidden')) {
      ({ h: _hsvH, s: _hsvS, v: _hsvV } = rgbIntToHsv(colorInt));
      _refreshHsvUI();
    }
  });

  // "+" — save the currently-typed color into the swatch palette.
  $('btn-save-color').addEventListener('click', () => {
    const hex = $('set-rgb-color-hex').value;
    if (!addSavedColor(hex)) {
      // parseHexInput failed (or duplicate) — flash the input to hint.
      $('set-rgb-color-hex').classList.add('invalid');
      setTimeout(() => $('set-rgb-color-hex').classList.remove('invalid'), 400);
    }
  });

  // "Apply to mapped buttons": paints static color, or 0xFFFFFF (rainbow "participate" sentinel).
  const applyRgbToMapped = () => {
    const p = currentProfile();
    if (!p) return;
    const rgb = ensureRgbConfig(p);
    const rainbow = RAINBOW_ANIMATIONS.has(rgb.animation);
    let colorInt;
    if (rainbow) {
      colorInt = RAINBOW_PARTICIPATING_COLOR;
    } else {
      colorInt = parseHexInput($('set-rgb-color-hex').value);
      if (colorInt == null) { $('set-rgb-color-hex').classList.add('invalid'); return; }
      rgb.defaultColor = colorInt;
    }
    paintActiveButtons(p, colorInt);
    buildControllerSVG();
  };
  $('btn-apply-rgb-static').addEventListener('click', applyRgbToMapped);
  $('btn-apply-rgb-rainbow').addEventListener('click', applyRgbToMapped);

  // "Clear LEDs" — set every LED-capable button (including MB1) to colour 0.
  // The user can then bring individual LEDs back via the per-button popup
  // (ON / colour picker) or re-Apply with a chosen colour.
  const clearAllLeds = () => {
    const p = currentProfile();
    if (!p) return;
    clearAllProfileLeds(p);
    buildControllerSVG();
  };
  $('btn-clear-rgb-static').addEventListener('click', clearAllLeds);
  $('btn-clear-rgb-rainbow').addEventListener('click', clearAllLeds);

  $('btn-add-socd').addEventListener('click', () => {
    const p = currentProfile();
    if (!p) return;
    if (!p.socdPairs) p.socdPairs = [];
    // Default to NEUTRAL — the common "cancel both" rule that most users
    // want when they add a new pair. 2IP_NO_REAC is a fighter-specific
    // choice and was a poor default here.
    p.socdPairs.push({ buttonDir1: 'BTN_LF3', buttonDir2: 'BTN_LF1', socdType: 'SOCD_NEUTRAL' });
    renderSocdList(p);
  });

  $('btn-add-remap').addEventListener('click', () => {
    const p = currentProfile();
    if (!p) return;

    // Custom mode: bind the first unbound phys to a default output ('a').
    // The user can immediately edit either side from the row.
    if (isCustomProfile(p)) {
      const phys = findFirstUnboundPhysButton(p);
      if (!phys) return;
      setCustomButtonOutput(p, phys, 'a');
      renderRemapList(p);
      buildControllerSVG();
      return;
    }
    // Keyboard mode: bind the first unbound phys to HID keycode 4 ('A').
    if (isKeyboardProfile(p)) {
      const phys = findFirstUnboundPhysButton(p);
      if (!phys) return;
      setButtonKeycode(p, phys, 4);
      renderRemapList(p);
      buildControllerSVG();
      return;
    }

    if (!p.buttonRemapping) p.buttonRemapping = [];

    if (remapViewMode === 'simple') {
      const modeMap = MODE_OUTPUT_MAP[p.modeId] || {};
      // Find the first explicitly disabled button that belongs to this mode
      // and re-enable it by removing its disabled entry (reverts to mode default).
      const disabledIdx = p.buttonRemapping.findIndex(r =>
        r.physicalButton && modeMap[r.physicalButton] &&
        (!r.activates || r.activates === 'BTN_UNSPECIFIED')
      );
      if (disabledIdx >= 0) {
        p.buttonRemapping.splice(disabledIdx, 1);
      } else {
        // No disabled mode buttons — add a remap for the first physical button
        // not currently in the effective mapping (e.g. a button outside the mode map).
        const rmap = remapMap(p);
        const candidateBtn = ALL_BUTTONS.find(b =>
          b !== 'BTN_UNSPECIFIED' && !b.startsWith('BTN_MB') && !modeMap[b]
        );
        if (candidateBtn) {
          const firstActivates = Object.keys(modeMap)[0];
          if (firstActivates) setRemap(candidateBtn, firstActivates);
        }
      }
    } else {
      p.buttonRemapping.push({ physicalButton: 'BTN_LF1' });  // advanced: raw entry
    }
    renderRemapList(p);
    buildControllerSVG();
  });

  $('chk-remap-mode').addEventListener('change', (e) => {
    remapViewMode = e.target.checked ? 'advanced' : 'simple';
    const p = currentProfile();
    if (p) renderRemapList(p);
  });

  // Populate preset dropdown from DEFAULT_CONFIG_JSON; option value = preset name.
  const presetSel = $('remap-preset-select');
  try {
    const defaults = JSON.parse(DEFAULT_CONFIG_JSON);
    for (const preset of (defaults.gameModeConfigs || [])) {
      if (!preset?.name) continue;
      const opt = document.createElement('option');
      opt.value = preset.name;
      opt.textContent = preset.name;
      presetSel.appendChild(opt);
    }
  } catch (e) {
    console.warn('Could not populate preset dropdown', e);
  }

  // Apply preset — overwrite the current profile's mode + binds + SOCD +
  // backends + menu-button icons with the selected factory-default preset.
  // Destructive, so confirm near the button first.
  $('btn-apply-preset').addEventListener('click', (e) => {
    const p = currentProfile();
    if (!p) return;
    const name = presetSel.value;
    if (!name) return;
    confirmNearAnchor(
      e.currentTarget,
      `Apply "${name}" preset?`,
      () => applyPresetToProfile(p, name),
    );
  });

  // Clear binds — mode-aware wipe. Confirms first because it's destructive.
  $('btn-clear-binds').addEventListener('click', (e) => {
    const p = currentProfile();
    if (!p) return;
    confirmNearAnchor(
      e.currentTarget,
      'Clear all binds on this profile?',
      () => clearAllBindings(p),
    );
  });
}

// Copy a factory preset's binds, SOCDs, backends, and menu icons onto profile.
// Never changes profile.modeId; cross-mode binds translate via preserveOutputsAcrossModeChange.
function applyPresetToProfile(profile, presetName) {
  let defaults;
  try {
    defaults = JSON.parse(DEFAULT_CONFIG_JSON);
  } catch { return; }
  const preset = defaults.gameModeConfigs?.find(p => p?.name === presetName);
  if (!preset) return;

  const targetMode = profile.modeId;
  const presetMode = preset.modeId;

  // Non-bind fields transfer directly. Keyboard stays DInput-only regardless.
  profile.socdPairs      = JSON.parse(JSON.stringify(preset.socdPairs || []));
  profile.menuButtonIcon = [...(preset.menuButtonIcon || [
    'OUT_UNSPECIFIED','OUT_UNSPECIFIED','OUT_UNSPECIFIED','OUT_UNSPECIFIED',
    'OUT_HOME','OUT_XB_BACK','OUT_START',
  ])];
  profile.applicableBackends = targetMode === 'MODE_KEYBOARD'
    ? ['COMMS_BACKEND_DINPUT']
    : [...(preset.applicableBackends || USB_BACKENDS)];

  // Binds: verbatim on mode match; translate cross-mode; keyboard only when both are keyboard.
  if (targetMode === presetMode) {
    if (targetMode === 'MODE_KEYBOARD') {
      const srcKb = defaults.keyboardModes?.[(preset.keyboardModeConfig || 0) - 1];
      if (srcKb) {
        const dstKb = ensureKeyboardConfig(profile);
        dstKb.buttonsToKeycodes = JSON.parse(JSON.stringify(srcKb.buttonsToKeycodes || []));
      }
    } else {
      profile.buttonRemapping = JSON.parse(JSON.stringify(preset.buttonRemapping || []));
    }
  } else if (presetMode !== 'MODE_KEYBOARD' && targetMode !== 'MODE_KEYBOARD') {
    // Cross-mode: install preset binds temporarily, translate to target format.
    profile.buttonRemapping = JSON.parse(JSON.stringify(preset.buttonRemapping || []));
    preserveOutputsAcrossModeChange(profile, presetMode, targetMode);
    if (targetMode === 'MODE_CUSTOM') {
      profile.buttonRemapping = [];   // residual; CUSTOM doesn't carry remaps
    }
  }
  // Keyboard preset on non-keyboard (or vice versa): binds untouched — different domains.

  // Paint LEDs on newly-active buttons (matches "Apply to active" in Button Lighting).
  const rgb = ensureRgbConfig(profile);
  const defaultColor = (rgb.defaultColor != null ? Number(rgb.defaultColor) >>> 0 : DEFAULT_LED_COLOR_INT);
  paintActiveButtons(profile, defaultColor);

  renderAll();
}

// Mode-aware "clear every binding". Controller modes get every non-MB
// physical button explicitly disabled (empty `activates` field) so the
// mode-map defaults don't leak through. Keyboard clears buttonsToKeycodes.
// Custom clears every mapping / modifier / trigger array on its config.
function clearAllBindings(profile) {
  if (isKeyboardProfile(profile)) {
    const kb = getKeyboardConfig(profile);
    if (kb) kb.buttonsToKeycodes = [];
  } else if (isCustomProfile(profile)) {
    const cc = getCustomConfig(profile);
    if (cc) {
      cc.digitalButtonMappings   = [];
      cc.stickDirectionMappings  = [];
      cc.modifiers               = [];
      cc.analogTriggerMappings   = [];
    }
    // Also drop any additional-binding remaps — with no primaries left they'd
    // be dead-letters, and Clear binds is meant to leave a truly blank slate.
    profile.buttonRemapping = [];
  } else {
    // Controller mode: explicit disable every remappable non-MB button.
    profile.buttonRemapping = BUTTON_LAYOUT
      .filter(b => !b.id.startsWith('BTN_MB'))
      .map(b => ({ physicalButton: b.id }));
  }
  // Also wipe every LED — a blank-binding profile should look blank on the
  // controller too (matches what "Clear LEDs" in Button Lighting does).
  clearAllProfileLeds(profile);
  renderAll();
}

// ---------------------------------------------------------------------------
// HSV color picker (shared popup for both LED color targets)
// ---------------------------------------------------------------------------
let _hsvH = 0, _hsvS = 0, _hsvV = 0;
let _hsvOnChange = null;

function openHsvPicker(anchorEl, colorInt, onChange) {
  ({ h: _hsvH, s: _hsvS, v: _hsvV } = rgbIntToHsv(Number(colorInt) >>> 0));
  _hsvOnChange = onChange;
  _refreshHsvUI();

  const picker = $('hsl-picker');
  picker.style.left = '-9999px';
  picker.style.top = '0';
  picker.classList.remove('hidden');

  const pr = picker.getBoundingClientRect();
  const ar = anchorEl.getBoundingClientRect();
  const gap = 10;
  // Prefer left of anchor to avoid covering the hex input / Apply controls.
  let left = ar.left - pr.width - gap;
  if (left < 8) left = ar.right + gap;
  if (left + pr.width > window.innerWidth - 12) left = window.innerWidth - pr.width - 12;
  if (left < 8) left = 8;
  let top = ar.top + ar.height / 2 - pr.height / 2;
  if (top + pr.height > window.innerHeight - 12) top = window.innerHeight - pr.height - 12;
  if (top < 8) top = 8;
  picker.style.left = `${Math.round(left)}px`;
  picker.style.top  = `${Math.round(top)}px`;
}

function closeHsvPicker() {
  $('hsl-picker').classList.add('hidden');
  _hsvOnChange = null;
}

function _refreshHsvUI() {
  const svArea  = $('hsl-sv-area');
  const svThumb = $('hsl-sv-thumb');
  const hThumb  = $('hsl-hue-thumb');

  svArea.style.background = [
    'linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))',
    'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))',
    `hsl(${_hsvH.toFixed(1)}, 100%, 50%)`,
  ].join(', ');

  svThumb.style.left       = `${_hsvS * 100}%`;
  svThumb.style.top        = `${(1 - _hsvV) * 100}%`;
  svThumb.style.background = colorIntToHex(hsvToRgbInt(_hsvH, _hsvS, _hsvV));

  hThumb.style.left       = `${_hsvH / 360 * 100}%`;
  hThumb.style.background = `hsl(${_hsvH.toFixed(1)}, 100%, 50%)`;
}

function wireHsvPickerHandlers() {
  const svArea   = $('hsl-sv-area');
  const hueTrack = $('hsl-hue-track');
  let svDown = false, hDown = false;

  function onSvMove(e) {
    const rect = svArea.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    _hsvS = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    _hsvV = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    _refreshHsvUI();
    if (_hsvOnChange) _hsvOnChange(hsvToRgbInt(_hsvH, _hsvS, _hsvV));
  }

  function onHMove(e) {
    const rect = hueTrack.getBoundingClientRect();
    if (!rect.width) return;
    _hsvH = Math.max(0, Math.min(360, ((e.clientX - rect.left) / rect.width) * 360));
    _refreshHsvUI();
    if (_hsvOnChange) _hsvOnChange(hsvToRgbInt(_hsvH, _hsvS, _hsvV));
  }

  svArea.addEventListener('pointerdown', e => { svDown = true; svArea.setPointerCapture(e.pointerId); onSvMove(e); });
  svArea.addEventListener('pointermove', e => { if (svDown) onSvMove(e); });
  svArea.addEventListener('pointerup',   () => { svDown = false; });

  hueTrack.addEventListener('pointerdown', e => { hDown = true; hueTrack.setPointerCapture(e.pointerId); onHMove(e); });
  hueTrack.addEventListener('pointermove', e => { if (hDown) onHMove(e); });
  hueTrack.addEventListener('pointerup',   () => { hDown = false; });
}

// ---------------------------------------------------------------------------
// Controller-button hover tooltips (data-tooltip on .btn-group). Uses
// mouseover/mouseout for target changes, mousemove only while visible.
// ---------------------------------------------------------------------------
function wireButtonTooltips() {
  const TOOLTIP_DELAY_MS = 500;
  const GUTTER = 8;
  const OFFSET = 14;

  const tooltipEl = $('btn-tooltip');
  const svgEl = svg();

  let target = null;
  let timer  = null;
  let cachedW = 0;
  let cachedH = 0;
  // Latest cursor position — dwell-delay uses current, not entry, coords.
  let lastX = 0;
  let lastY = 0;

  const cancelTimer = () => { if (timer) { clearTimeout(timer); timer = null; } };
  const hide = () => {
    cancelTimer();
    target = null;
    tooltipEl.classList.add('hidden');
  };
  const position = (clientX, clientY) => {
    let left = clientX + OFFSET;
    let top  = clientY + OFFSET;
    if (left + cachedW > window.innerWidth  - GUTTER) left = clientX - cachedW - OFFSET;
    if (top  + cachedH > window.innerHeight - GUTTER) top  = clientY - cachedH - OFFSET;
    if (left < GUTTER) left = GUTTER;
    if (top  < GUTTER) top  = GUTTER;
    tooltipEl.style.left = `${Math.round(left)}px`;
    tooltipEl.style.top  = `${Math.round(top)}px`;
  };

  svgEl.addEventListener('mouseover', (e) => {
    const grp = e.target.closest('.btn-group');
    if (!grp || grp === target) return;
    const text = grp.getAttribute('data-tooltip');
    if (!text) return;
    cancelTimer();
    target = grp;
    tooltipEl.classList.add('hidden');
    lastX = e.clientX;
    lastY = e.clientY;
    timer = setTimeout(() => {
      timer = null;
      tooltipEl.textContent = text;
      tooltipEl.classList.remove('hidden');
      // Measure once now that content + visibility are set; reused on each
      // mousemove for the rest of this hover.
      const r = tooltipEl.getBoundingClientRect();
      cachedW = r.width;
      cachedH = r.height;
      position(lastX, lastY);
    }, TOOLTIP_DELAY_MS);
  });

  svgEl.addEventListener('mouseout', (e) => {
    const grp = e.target.closest('.btn-group');
    if (!grp || grp !== target) return;
    // mouseout also fires when crossing between SVG children of the same
    // group — ignore those.
    const toGrp = e.relatedTarget?.closest?.('.btn-group');
    if (toGrp === grp) return;
    hide();
  });

  svgEl.addEventListener('mousemove', (e) => {
    // Always track the latest cursor position so the dwell timer can reveal
    // the tooltip at the cursor's *current* spot.
    lastX = e.clientX;
    lastY = e.clientY;
    // Cursor-tracking only paints after the dwell timer has fired.
    if (!target || timer) return;
    position(e.clientX, e.clientY);
  });

  svgEl.addEventListener('mouseleave', hide);
}

// ---------------------------------------------------------------------------
// Toolbar event wiring
// ---------------------------------------------------------------------------
function wireToolbarHandlers() {
  $('btn-connect').addEventListener('click', () => {
    if (isConnected) serialDisconnect(); else serialConnect();
  });

  $('btn-load').addEventListener('click', loadConfigFromDevice);
  $('btn-save').addEventListener('click', saveConfigToDevice);
  $('btn-defaults').addEventListener('click', e => {
    if (!config) { loadDefaultConfig(); return; }
    confirmNearAnchor(e.currentTarget, 'Load defaults?', loadDefaultConfig);
  });
  $('btn-export').addEventListener('click', exportConfig);
  $('file-import').addEventListener('change', e => {
    if (e.target.files[0]) importConfig(e.target.files[0]);
    e.target.value = '';
  });

  $('btn-add-profile').addEventListener('click', addProfile);

  // Platform style tabs
  document.querySelectorAll('.platform-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      selectedPlatform = tab.dataset.platform;
      document.querySelectorAll('.platform-tab').forEach(t => t.classList.toggle('active', t === tab));
      buildControllerSVG();
    });
  });

  // Output popup
  $('output-popup-close').addEventListener('click', closeOutputPopup);
  $('output-popup-unmap').addEventListener('click', unmapSelected);

  // Popup LED color controls
  $('popup-color-swatch').addEventListener('click', (e) => {
    e.stopPropagation();
    const profile = currentProfile();
    if (!profile || !selectedBtnId) return;
    closeHsvPicker();
    openHsvPicker(e.currentTarget, getButtonColor(profile, selectedBtnId), (c) => {
      setButtonColor(profile, selectedBtnId, c);
      const h = colorIntToHex(c);
      $('popup-color-swatch').style.background = h;
      $('popup-color-hex').value = h;
      $('popup-color-hex').classList.remove('invalid');
      applyLiveButtonColor(selectedBtnId, c);
    });
  });

  $('popup-color-hex').addEventListener('input', (e) => {
    const profile = currentProfile();
    if (!profile || !selectedBtnId) return;
    const colorInt = parseHexInput(e.target.value);
    if (colorInt == null) {
      e.target.classList.add('invalid');
      return;
    }
    e.target.classList.remove('invalid');
    setButtonColor(profile, selectedBtnId, colorInt);
    $('popup-color-swatch').style.background = colorIntToHex(colorInt);
    if (!$('hsl-picker').classList.contains('hidden')) {
      ({ h: _hsvH, s: _hsvS, v: _hsvV } = rgbIntToHsv(colorInt));
      _refreshHsvUI();
    }
    applyLiveButtonColor(selectedBtnId, colorInt);
  });

  // Keyboard mode: enter "capturing" state on click, listen for next keydown.
  let keyboardCapturing = false;
  $('popup-keyboard-input').addEventListener('click', () => {
    keyboardCapturing = true;
    const el = $('popup-keyboard-input');
    el.classList.add('capturing');
    el.textContent = 'Press any key…';
    el.focus();
  });

  $('popup-keyboard-input').addEventListener('blur', () => {
    if (!keyboardCapturing) return;
    keyboardCapturing = false;
    $('popup-keyboard-input').classList.remove('capturing');
    if (selectedBtnId) syncPopupKeyboardInput(selectedBtnId);
  });

  // Capture the next keydown while focused
  $('popup-keyboard-input').addEventListener('keydown', (e) => {
    if (!keyboardCapturing) return;
    e.preventDefault();
    e.stopPropagation();
    // Escape cancels capture without binding (so the user can always escape the capture state)
    if (e.code === 'Escape') {
      keyboardCapturing = false;
      $('popup-keyboard-input').classList.remove('capturing');
      if (selectedBtnId) syncPopupKeyboardInput(selectedBtnId);
      $('popup-keyboard-input').blur();
      return;
    }
    const hid = EVENT_CODE_TO_HID[e.code];
    if (hid == null) return;  // unsupported key; stay capturing
    const profile = currentProfile();
    if (!profile || !selectedBtnId) return;
    const wasBound = buttonHasBinding(profile, selectedBtnId);
    setButtonKeycode(profile, selectedBtnId, hid);
    autoEnableLedOnAssign(profile, selectedBtnId, wasBound);
    keyboardCapturing = false;
    const el = $('popup-keyboard-input');
    el.classList.remove('capturing');
    el.textContent = keycodeToLabel(hid);
    buildControllerSVG();
    // The Button Remapping list mirrors keyboardMode.buttonsToKeycodes — refresh
    // so the new binding shows up there too.
    if (isKeyboardProfile(profile)) renderRemapList(profile);
  });

  // "Assign Esc" — Escape during capture cancels, so it can't be bound that
  // way. This button is the only way to actually bind Escape (HID 41).
  $('popup-keyboard-esc').addEventListener('click', () => {
    const profile = currentProfile();
    if (!profile || !selectedBtnId) return;
    const wasBound = buttonHasBinding(profile, selectedBtnId);
    setButtonKeycode(profile, selectedBtnId, 41);
    autoEnableLedOnAssign(profile, selectedBtnId, wasBound);
    keyboardCapturing = false;
    const el = $('popup-keyboard-input');
    el.classList.remove('capturing');
    el.textContent = keycodeToLabel(41);
    buildControllerSVG();
    if (isKeyboardProfile(profile)) renderRemapList(profile);
  });

  // LED Off — write color 0 (firmware treats this as "LED unlit"). Updates
  // the popup colour controls + the live SVG without rebuilding.
  $('popup-led-off').addEventListener('click', () => {
    const profile = currentProfile();
    if (!profile || !selectedBtnId) return;
    closeHsvPicker();
    setButtonColor(profile, selectedBtnId, 0);
    $('popup-color-swatch').style.background = '#000000';
    $('popup-color-hex').value = '#000000';
    $('popup-color-hex').classList.remove('invalid');
    applyLiveButtonColor(selectedBtnId, 0);
  });
  // LED On — write the default cyan colour. Pair with Off as a quick toggle
  // for users who want the LED on without picking a specific colour.
  $('popup-led-on').addEventListener('click', () => {
    const profile = currentProfile();
    if (!profile || !selectedBtnId) return;
    closeHsvPicker();
    setButtonColor(profile, selectedBtnId, DEFAULT_LED_COLOR_INT);
    const hex = colorIntToHex(DEFAULT_LED_COLOR_INT);
    $('popup-color-swatch').style.background = hex;
    $('popup-color-hex').value = hex;
    $('popup-color-hex').classList.remove('invalid');
    applyLiveButtonColor(selectedBtnId, DEFAULT_LED_COLOR_INT);
  });

  // Rainbow-mode per-button toggles. The two buttons set the stored color to
  // 0xFFFFFF (participate) or 0 (LED off) — those are the only two states the
  // firmware distinguishes during a rainbow animation.
  $('popup-rainbow-on').addEventListener('click', () => {
    const profile = currentProfile();
    if (!profile || !selectedBtnId) return;
    setButtonColor(profile, selectedBtnId, RAINBOW_PARTICIPATING_COLOR);
    syncPopupRainbowControls(selectedBtnId);
    buildControllerSVG();   // ring needs to flip to the rainbow gradient
  });
  $('popup-rainbow-off').addEventListener('click', () => {
    const profile = currentProfile();
    if (!profile || !selectedBtnId) return;
    setButtonColor(profile, selectedBtnId, 0);
    syncPopupRainbowControls(selectedBtnId);
    buildControllerSVG();
  });

  // "+" save-color button inside the assign popup — same logic as the
  // right-panel button, but reads the popup's own hex input.
  $('popup-save-color').addEventListener('click', () => {
    const hex = $('popup-color-hex').value;
    if (!addSavedColor(hex)) {
      $('popup-color-hex').classList.add('invalid');
      setTimeout(() => $('popup-color-hex').classList.remove('invalid'), 400);
    }
  });

  // Profile context-menu actions
  $('profile-context-menu').addEventListener('click', (e) => {
    const action = e.target?.dataset?.action;
    if (!action) return;
    e.stopPropagation();
    const idx = contextMenuProfileIdx;
    closeProfileContextMenu();
    if (idx < 0) return;
    if (action === 'rename')    startRenameProfile(idx);
    if (action === 'duplicate') duplicateProfile(idx);
  });

  // Saved-color context-menu actions
  $('saved-color-menu').addEventListener('click', (e) => {
    const action = e.target?.dataset?.action;
    if (!action) return;
    e.stopPropagation();
    const hex = savedColorMenuTarget;
    closeSavedColorMenu();
    if (!hex) return;
    if (action === 'remove') removeSavedColor(hex);
  });

  // Suppress the browser's native context menu inside the sidebar so our
  // custom one takes precedence even on clicks not directly on a profile item.
  $('profile-list').addEventListener('contextmenu', (e) => {
    if (!e.target.closest('.profile-item')) e.preventDefault();
  });

  // Close picker and/or popup on outside-click
  document.addEventListener('click', (e) => {
    const picker = $('hsl-picker');
    if (!picker.classList.contains('hidden') &&
        !picker.contains(e.target) &&
        e.target.id !== 'popup-color-swatch' &&
        e.target.id !== 'set-rgb-color-swatch') {
      closeHsvPicker();
    }
    // Close the profile context menu on any outside click
    const ctx = $('profile-context-menu');
    if (!ctx.classList.contains('hidden') && !ctx.contains(e.target)) {
      closeProfileContextMenu();
    }
    // Same for the saved-color context menu
    const scm = $('saved-color-menu');
    if (!scm.classList.contains('hidden') && !scm.contains(e.target)) {
      closeSavedColorMenu();
    }
    const popup = $('output-popup');
    if (popup.classList.contains('hidden')) return;
    if (popup.contains(e.target)) return;
    if (e.target.closest('.btn-group')) return;
    if (picker.contains(e.target)) return;
    closeOutputPopup();
  });

  // Close picker / popup / context menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!$('hsl-picker').classList.contains('hidden')) { closeHsvPicker(); return; }
    if (!$('saved-color-menu').classList.contains('hidden')) { closeSavedColorMenu(); return; }
    if (!$('profile-context-menu').classList.contains('hidden')) { closeProfileContextMenu(); return; }
    if (!$('output-popup').classList.contains('hidden')) closeOutputPopup();
    else if (!$('help-overlay').classList.contains('hidden')) $('help-overlay').classList.add('hidden');
  });

  // Help
  $('btn-help').addEventListener('click', () => $('help-overlay').classList.remove('hidden'));
  $('help-close').addEventListener('click', () => $('help-overlay').classList.add('hidden'));
  $('help-overlay').addEventListener('click', e => { if (e.target === $('help-overlay')) $('help-overlay').classList.add('hidden'); });
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Floating confirm popup anchored next to a triggering button. Replaces the
// native window.confirm() so the prompt stays inside the app's visual style.
// Calls onConfirm() only if the ✓ button (or Enter) is pressed; ✕, Escape, or
// any outside click dismisses without firing.
let activeConfirmPopup = null;
function confirmNearAnchor(anchor, message, onConfirm) {
  dismissConfirmPopup();
  const popup = document.createElement('div');
  popup.className = 'confirm-popup';
  popup.innerHTML = `
    <div class="confirm-popup-msg">${escHtml(message)}</div>
    <div class="confirm-popup-actions">
      <button type="button" class="confirm-popup-yes" title="Confirm" aria-label="Confirm">✓</button>
      <button type="button" class="confirm-popup-no" title="Cancel" aria-label="Cancel">✕</button>
    </div>
  `;
  document.body.appendChild(popup);

  // Position centered below the anchor, flipping above and clamping to viewport.
  const rect = anchor.getBoundingClientRect();
  const pr = popup.getBoundingClientRect();
  const margin = 8;
  let top = rect.bottom + 6;
  let left = rect.left + rect.width / 2 - pr.width / 2;
  if (left < margin) left = margin;
  if (left + pr.width > window.innerWidth - margin) left = window.innerWidth - pr.width - margin;
  if (top + pr.height > window.innerHeight - margin) top = rect.top - pr.height - 6;
  popup.style.top = `${top + window.scrollY}px`;
  popup.style.left = `${left + window.scrollX}px`;

  const cleanup = () => {
    document.removeEventListener('mousedown', onOutside, true);
    document.removeEventListener('keydown', onKey, true);
    popup.remove();
    if (activeConfirmPopup === popup) activeConfirmPopup = null;
  };
  const onOutside = (e) => { if (!popup.contains(e.target)) cleanup(); };
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); cleanup(); }
    else if (e.key === 'Enter') { e.preventDefault(); cleanup(); onConfirm(); }
  };
  popup.querySelector('.confirm-popup-yes').addEventListener('click', () => { cleanup(); onConfirm(); });
  popup.querySelector('.confirm-popup-no').addEventListener('click', cleanup);
  // Defer outside-click handler so the click that opened the popup doesn't immediately close it.
  setTimeout(() => {
    document.addEventListener('mousedown', onOutside, true);
    document.addEventListener('keydown', onKey, true);
  }, 0);
  activeConfirmPopup = popup;
}
function dismissConfirmPopup() {
  if (activeConfirmPopup) activeConfirmPopup.remove();
  activeConfirmPopup = null;
}

// Embedded "Load Defaults" payload — the official Limit Labs default profiles.
const DEFAULT_CONFIG_JSON = `{"gameModeConfigs":[{"modeId":"MODE_MELEE","name":"Melee","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP_NO_REAC"}],"buttonRemapping":[{"physicalButton":"BTN_LF5"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":1,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_PROJECT_M","name":"Brawl","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP_NO_REAC"}],"buttonRemapping":[{"physicalButton":"BTN_LF5"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":2,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_ULTIMATE","name":"Ultimate","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP"}],"buttonRemapping":[{"physicalButton":"BTN_LF5"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":3,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_FGC","name":"Split FGC","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_LT1","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_RT1","activates":"BTN_LT1"},{"physicalButton":"BTN_LF5","activates":"BTN_LT2"},{"physicalButton":"BTN_RF9","activates":"BTN_RT1"},{"physicalButton":"BTN_LF4"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT2"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_RT2"},{"physicalButton":"BTN_RT3"},{"physicalButton":"BTN_RT4"},{"physicalButton":"BTN_RT5"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":4,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_XB_START"]},{"modeId":"MODE_FGC","name":"FGC","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_LT1","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_RF1","activates":"BTN_RF4"},{"physicalButton":"BTN_RF5","activates":"BTN_RF8"},{"physicalButton":"BTN_LF8","activates":"BTN_LF3"},{"physicalButton":"BTN_LF7","activates":"BTN_LF2"},{"physicalButton":"BTN_LF6","activates":"BTN_LF1"},{"physicalButton":"BTN_LT6","activates":"BTN_LT1"},{"physicalButton":"BTN_RF10","activates":"BTN_RF1"},{"physicalButton":"BTN_RF11","activates":"BTN_RF2"},{"physicalButton":"BTN_RF12","activates":"BTN_RF3"},{"physicalButton":"BTN_RF13","activates":"BTN_RF5"},{"physicalButton":"BTN_RF14","activates":"BTN_RF6"},{"physicalButton":"BTN_RF15","activates":"BTN_RF7"},{"physicalButton":"BTN_RF16","activates":"BTN_LT2"},{"physicalButton":"BTN_LF1"},{"physicalButton":"BTN_LF2"},{"physicalButton":"BTN_LF3"},{"physicalButton":"BTN_LF4"},{"physicalButton":"BTN_LF5"},{"physicalButton":"BTN_LT1"},{"physicalButton":"BTN_LT2"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_RF2"},{"physicalButton":"BTN_RF3"},{"physicalButton":"BTN_RF4"},{"physicalButton":"BTN_RF6"},{"physicalButton":"BTN_RF7"},{"physicalButton":"BTN_RF8"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RT1"},{"physicalButton":"BTN_RT2"},{"physicalButton":"BTN_RT3"},{"physicalButton":"BTN_RT4"},{"physicalButton":"BTN_RT5"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":5,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_XB_START"]},{"modeId":"MODE_64","name":"Smash64","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_LF5"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_RT2"},{"physicalButton":"BTN_RT3"},{"physicalButton":"BTN_RT4"},{"physicalButton":"BTN_RT5"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"},{"physicalButton":"BTN_MB4"},{"physicalButton":"BTN_MB5"},{"physicalButton":"BTN_MB6"}],"rgbConfig":6,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_N64"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_START"]},{"modeId":"MODE_RIVALS_OF_AETHER","name":"RoA","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_LF7","buttonDir2":"BTN_LT6"}],"buttonRemapping":[{"physicalButton":"BTN_RF7","activates":"BTN_LF7"},{"physicalButton":"BTN_RF8","activates":"BTN_LT6"},{"physicalButton":"BTN_LF5"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":7,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_RIVALS2","name":"RoA2","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_LF7","buttonDir2":"BTN_LT6"}],"buttonRemapping":[{"physicalButton":"BTN_RF7","activates":"BTN_LF7"},{"physicalButton":"BTN_RF8","activates":"BTN_LT6"},{"physicalButton":"BTN_LF5"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":8,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_MELEE","name":"GameCube","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_LF2","activates":"BTN_RF4"},{"physicalButton":"BTN_LF6","activates":"BTN_LF8"},{"physicalButton":"BTN_LF5","activates":"BTN_LF2"},{"physicalButton":"BTN_RF13","activates":"BTN_LT6"},{"physicalButton":"BTN_RF10","activates":"BTN_LF7"},{"physicalButton":"BTN_RF11","activates":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF4"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":9,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_MELEE","name":"N64","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_LF2","activates":"BTN_RF4"},{"physicalButton":"BTN_RF2","activates":"BTN_RF5"},{"physicalButton":"BTN_LF6","activates":"BTN_LF8"},{"physicalButton":"BTN_LF5","activates":"BTN_LF2"},{"physicalButton":"BTN_RF13","activates":"BTN_LT6"},{"physicalButton":"BTN_RF11","activates":"BTN_LF6"},{"physicalButton":"BTN_RF10","activates":"BTN_LF7"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF4"},{"physicalButton":"BTN_RF5"},{"physicalButton":"BTN_RF6"},{"physicalButton":"BTN_RF7"},{"physicalButton":"BTN_RF8"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":10,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_N64"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_FGC","name":"SNES","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_LT1","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_LF2","activates":"BTN_LT1"},{"physicalButton":"BTN_LT1","activates":"BTN_RF8"},{"physicalButton":"BTN_RT1","activates":"BTN_RF7"},{"physicalButton":"BTN_RF1","activates":"BTN_RF2"},{"physicalButton":"BTN_RF2","activates":"BTN_RF1"},{"physicalButton":"BTN_RF5","activates":"BTN_RF6"},{"physicalButton":"BTN_RF6","activates":"BTN_RF5"},{"physicalButton":"BTN_LF5","activates":"BTN_LF2"},{"physicalButton":"BTN_LF4"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT2"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF3"},{"physicalButton":"BTN_RF4"},{"physicalButton":"BTN_RF7"},{"physicalButton":"BTN_RF8"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_RT2"},{"physicalButton":"BTN_RT3"},{"physicalButton":"BTN_RT4"},{"physicalButton":"BTN_RT5"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"},{"physicalButton":"BTN_MB4"},{"physicalButton":"BTN_MB5"}],"rgbConfig":11,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_SNES"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_FGC","name":"NES","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_LT1","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_LF2","activates":"BTN_LT1"},{"physicalButton":"BTN_RF1","activates":"BTN_RF2"},{"physicalButton":"BTN_RF2","activates":"BTN_RF1"},{"physicalButton":"BTN_LF5","activates":"BTN_LF2"},{"physicalButton":"BTN_LF4"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT1"},{"physicalButton":"BTN_LT2"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF3"},{"physicalButton":"BTN_RF4"},{"physicalButton":"BTN_RF5"},{"physicalButton":"BTN_RF6"},{"physicalButton":"BTN_RF7"},{"physicalButton":"BTN_RF8"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_RT1"},{"physicalButton":"BTN_RT2"},{"physicalButton":"BTN_RT3"},{"physicalButton":"BTN_RT4"},{"physicalButton":"BTN_RT5"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"},{"physicalButton":"BTN_MB4"},{"physicalButton":"BTN_MB5"}],"rgbConfig":12,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_NES"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_KEYBOARD","name":"Keyboard","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_LT1","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP"}],"keyboardModeConfig":1,"rgbConfig":13,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT"]}],"communicationBackendConfigs":[{"backendId":"COMMS_BACKEND_XINPUT","defaultModeConfig":1},{"backendId":"COMMS_BACKEND_NINTENDO_SWITCH","defaultModeConfig":1},{"backendId":"COMMS_BACKEND_DINPUT","defaultModeConfig":1},{"backendId":"COMMS_BACKEND_GAMECUBE","defaultModeConfig":1},{"backendId":"COMMS_BACKEND_N64","defaultModeConfig":6},{"backendId":"COMMS_BACKEND_NES","defaultModeConfig":12},{"backendId":"COMMS_BACKEND_SNES","defaultModeConfig":11},{"backendId":"COMMS_BACKEND_CONFIGURATOR","activationBinding":["BTN_RT2"]}],"keyboardModes":[{"buttonsToKeycodes":[{"button":"BTN_LF1","keycode":4},{"button":"BTN_LF2","keycode":5},{"button":"BTN_LF3","keycode":6},{"button":"BTN_LF4","keycode":7},{"button":"BTN_LF5","keycode":8},{"button":"BTN_LF6","keycode":9},{"button":"BTN_LF7","keycode":10},{"button":"BTN_LF8","keycode":11},{"button":"BTN_LT1","keycode":12},{"button":"BTN_LT2","keycode":13},{"button":"BTN_LT3","keycode":14},{"button":"BTN_LT4","keycode":15},{"button":"BTN_LT5","keycode":16},{"button":"BTN_LT6","keycode":17},{"button":"BTN_RF1","keycode":18},{"button":"BTN_RF2","keycode":19},{"button":"BTN_RF3","keycode":20},{"button":"BTN_RF4","keycode":21},{"button":"BTN_RF5","keycode":22},{"button":"BTN_RF6","keycode":23},{"button":"BTN_RF7","keycode":24},{"button":"BTN_RF8","keycode":25},{"button":"BTN_RF9","keycode":26},{"button":"BTN_RF10","keycode":27},{"button":"BTN_RF11","keycode":28},{"button":"BTN_RF12","keycode":29},{"button":"BTN_RF13","keycode":30},{"button":"BTN_RF14","keycode":31},{"button":"BTN_RF15","keycode":32},{"button":"BTN_RF16","keycode":33},{"button":"BTN_RT1","keycode":34},{"button":"BTN_RT2","keycode":35},{"button":"BTN_RT3","keycode":36},{"button":"BTN_RT4","keycode":37},{"button":"BTN_RT5","keycode":38}]}],"rgbConfigs":[{"buttonColors":[{"button":"BTN_LF1","color":2282478},{"button":"BTN_LF2","color":2282478},{"button":"BTN_LF3","color":2282478},{"button":"BTN_LF4","color":2282478},{"button":"BTN_LT1","color":2282478},{"button":"BTN_LT2","color":2282478},{"button":"BTN_RF1","color":2282478},{"button":"BTN_RF2","color":2282478},{"button":"BTN_RF3","color":2282478},{"button":"BTN_RF4","color":2282478},{"button":"BTN_RF5","color":2282478},{"button":"BTN_RF6","color":2282478},{"button":"BTN_RF7","color":2282478},{"button":"BTN_RF8","color":2282478},{"button":"BTN_RT1","color":2282478},{"button":"BTN_RT2","color":2282478},{"button":"BTN_RT3","color":2282478},{"button":"BTN_RT4","color":2282478},{"button":"BTN_RT5","color":2282478},{"button":"BTN_MB1","color":2282478}],"animation":"RGB_ANIM_STATIC"},{"buttonColors":[{"button":"BTN_LF1","color":2282478},{"button":"BTN_LF2","color":2282478},{"button":"BTN_LF3","color":2282478},{"button":"BTN_LF4","color":2282478},{"button":"BTN_LT1","color":2282478},{"button":"BTN_LT2","color":2282478},{"button":"BTN_RF1","color":2282478},{"button":"BTN_RF2","color":2282478},{"button":"BTN_RF3","color":2282478},{"button":"BTN_RF4","color":2282478},{"button":"BTN_RF5","color":2282478},{"button":"BTN_RF6","color":2282478},{"button":"BTN_RF7","color":2282478},{"button":"BTN_RF8","color":2282478},{"button":"BTN_RT1","color":2282478},{"button":"BTN_RT2","color":2282478},{"button":"BTN_RT3","color":2282478},{"button":"BTN_RT4","color":2282478},{"button":"BTN_RT5","color":2282478},{"button":"BTN_MB1","color":2282478}],"animation":"RGB_ANIM_STATIC"},{"buttonColors":[{"button":"BTN_LF1","color":2282478},{"button":"BTN_LF2","color":2282478},{"button":"BTN_LF3","color":2282478},{"button":"BTN_LF4","color":2282478},{"button":"BTN_LT1","color":2282478},{"button":"BTN_LT2","color":2282478},{"button":"BTN_RF1","color":2282478},{"button":"BTN_RF2","color":2282478},{"button":"BTN_RF3","color":2282478},{"button":"BTN_RF4","color":2282478},{"button":"BTN_RF5","color":2282478},{"button":"BTN_RF6","color":2282478},{"button":"BTN_RF7","color":2282478},{"button":"BTN_RF8","color":2282478},{"button":"BTN_RT1","color":2282478},{"button":"BTN_RT2","color":2282478},{"button":"BTN_RT3","color":2282478},{"button":"BTN_RT4","color":2282478},{"button":"BTN_RT5","color":2282478},{"button":"BTN_MB1","color":2282478}],"animation":"RGB_ANIM_STATIC"},{"buttonColors":[{"button":"BTN_LF1","color":2282478},{"button":"BTN_LF2","color":2282478},{"button":"BTN_LF3","color":2282478},{"button":"BTN_LF5","color":2282478},{"button":"BTN_LT1","color":2282478},{"button":"BTN_RF1","color":2282478},{"button":"BTN_RF2","color":2282478},{"button":"BTN_RF3","color":2282478},{"button":"BTN_RF4","color":2282478},{"button":"BTN_RF5","color":2282478},{"button":"BTN_RF6","color":2282478},{"button":"BTN_RF7","color":2282478},{"button":"BTN_RF8","color":2282478},{"button":"BTN_RF9","color":2282478},{"button":"BTN_RT1","color":2282478},{"button":"BTN_MB1","color":2282478}],"animation":"RGB_ANIM_STATIC"},{"buttonColors":[{"button":"BTN_LF8","color":2282478},{"button":"BTN_LF7","color":2282478},{"button":"BTN_LF6","color":2282478},{"button":"BTN_LT6","color":2282478},{"button":"BTN_RF10","color":2282478},{"button":"BTN_RF11","color":2282478},{"button":"BTN_RF12","color":2282478},{"button":"BTN_RF1","color":2282478},{"button":"BTN_RF13","color":2282478},{"button":"BTN_RF14","color":2282478},{"button":"BTN_RF15","color":2282478},{"button":"BTN_RF5","color":2282478},{"button":"BTN_RF16","color":2282478},{"button":"BTN_MB1","color":2282478}],"animation":"RGB_ANIM_STATIC"},{"buttonColors":[{"button":"BTN_LF1","color":2282478},{"button":"BTN_LF2","color":2282478},{"button":"BTN_LF3","color":2282478},{"button":"BTN_LF4","color":2282478},{"button":"BTN_LT1","color":2282478},{"button":"BTN_LT2","color":2282478},{"button":"BTN_RF1","color":2282478},{"button":"BTN_RF2","color":2282478},{"button":"BTN_RF3","color":2282478},{"button":"BTN_RF4","color":2282478},{"button":"BTN_RF5","color":2282478},{"button":"BTN_RF6","color":2282478},{"button":"BTN_RT1","color":2282478},{"button":"BTN_MB1","color":2282478},{"button":"BTN_RF7","color":2282478},{"button":"BTN_RF8","color":2282478}],"animation":"RGB_ANIM_STATIC"},{"buttonColors":[{"button":"BTN_LF1","color":2282478},{"button":"BTN_LF2","color":2282478},{"button":"BTN_LF3","color":2282478},{"button":"BTN_LF4","color":2282478},{"button":"BTN_LT1","color":2282478},{"button":"BTN_LT2","color":2282478},{"button":"BTN_RF1","color":2282478},{"button":"BTN_RF2","color":2282478},{"button":"BTN_RF3","color":2282478},{"button":"BTN_RF4","color":2282478},{"button":"BTN_RF5","color":2282478},{"button":"BTN_RF6","color":2282478},{"button":"BTN_RF7","color":2282478},{"button":"BTN_RF8","color":2282478},{"button":"BTN_RT1","color":2282478},{"button":"BTN_RT2","color":2282478},{"button":"BTN_RT3","color":2282478},{"button":"BTN_RT4","color":2282478},{"button":"BTN_RT5","color":2282478},{"button":"BTN_MB1","color":2282478}],"animation":"RGB_ANIM_STATIC"},{"buttonColors":[{"button":"BTN_LF1","color":2282478},{"button":"BTN_LF2","color":2282478},{"button":"BTN_LF3","color":2282478},{"button":"BTN_LF4","color":2282478},{"button":"BTN_LT1","color":2282478},{"button":"BTN_LT2","color":2282478},{"button":"BTN_RF1","color":2282478},{"button":"BTN_RF2","color":2282478},{"button":"BTN_RF3","color":2282478},{"button":"BTN_RF4","color":2282478},{"button":"BTN_RF5","color":2282478},{"button":"BTN_RF6","color":2282478},{"button":"BTN_RF7","color":2282478},{"button":"BTN_RF8","color":2282478},{"button":"BTN_RT1","color":2282478},{"button":"BTN_RT2","color":2282478},{"button":"BTN_RT3","color":2282478},{"button":"BTN_RT4","color":2282478},{"button":"BTN_RT5","color":2282478},{"button":"BTN_MB1","color":2282478}],"animation":"RGB_ANIM_STATIC"},{"buttonColors":[{"button":"BTN_LF1","color":2282478},{"button":"BTN_LF2","color":2282478},{"button":"BTN_LF3","color":2282478},{"button":"BTN_LF4","color":2282478},{"button":"BTN_LT1","color":2282478},{"button":"BTN_LT2","color":2282478},{"button":"BTN_RF1","color":2282478},{"button":"BTN_RF2","color":2282478},{"button":"BTN_RF3","color":2282478},{"button":"BTN_RF5","color":2282478},{"button":"BTN_RF6","color":2282478},{"button":"BTN_RF7","color":2282478},{"button":"BTN_RF8","color":2282478},{"button":"BTN_RT1","color":2282478},{"button":"BTN_RT2","color":2282478},{"button":"BTN_RT3","color":2282478},{"button":"BTN_RT4","color":2282478},{"button":"BTN_RT5","color":2282478},{"button":"BTN_MB1","color":2282478},{"button":"BTN_LF6","color":2282478},{"button":"BTN_LF5","color":2282478},{"button":"BTN_RF13","color":2282478},{"button":"BTN_RF10","color":2282478},{"button":"BTN_RF11","color":2282478}],"animation":"RGB_ANIM_STATIC"},{"buttonColors":[{"button":"BTN_LF1","color":2282478},{"button":"BTN_LF2","color":2282478},{"button":"BTN_LF3","color":2282478},{"button":"BTN_LF4","color":2282478},{"button":"BTN_LT1","color":2282478},{"button":"BTN_LT2","color":2282478},{"button":"BTN_RF1","color":2282478},{"button":"BTN_RF2","color":2282478},{"button":"BTN_RF3","color":2282478},{"button":"BTN_RT1","color":2282478},{"button":"BTN_RT2","color":2282478},{"button":"BTN_RT3","color":2282478},{"button":"BTN_RT4","color":2282478},{"button":"BTN_RT5","color":2282478},{"button":"BTN_MB1","color":2282478},{"button":"BTN_LF5","color":2282478},{"button":"BTN_RF13","color":2282478},{"button":"BTN_LF6","color":2282478},{"button":"BTN_RF11","color":2282478},{"button":"BTN_RF10","color":2282478}],"animation":"RGB_ANIM_STATIC"},{"buttonColors":[{"button":"BTN_LF1","color":2282478},{"button":"BTN_LF2","color":2282478},{"button":"BTN_LF3","color":2282478},{"button":"BTN_LT1","color":2282478},{"button":"BTN_RF1","color":2282478},{"button":"BTN_RF2","color":2282478},{"button":"BTN_RF5","color":2282478},{"button":"BTN_RF6","color":2282478},{"button":"BTN_RT1","color":2282478},{"button":"BTN_MB1","color":2282478},{"button":"BTN_LF5","color":2282478}],"animation":"RGB_ANIM_STATIC"},{"buttonColors":[{"button":"BTN_LF1","color":2282478},{"button":"BTN_LF2","color":2282478},{"button":"BTN_LF3","color":2282478},{"button":"BTN_LF5","color":2282478},{"button":"BTN_RF1","color":2282478},{"button":"BTN_RF2","color":2282478},{"button":"BTN_MB1","color":2282478}],"animation":"RGB_ANIM_STATIC"},{"buttonColors":[{"button":"BTN_LF1","color":2282478},{"button":"BTN_LF2","color":2282478},{"button":"BTN_LF3","color":2282478},{"button":"BTN_LT1","color":2282478},{"button":"BTN_RF1","color":2282478},{"button":"BTN_RF2","color":2282478},{"button":"BTN_RF5","color":2282478},{"button":"BTN_RF6","color":2282478},{"button":"BTN_RT1","color":2282478},{"button":"BTN_MB1","color":2282478},{"button":"BTN_LF5","color":2282478}],"animation":"RGB_ANIM_STATIC"}],"defaultBackendConfig":1,"defaultUsbBackendConfig":1,"rgbBrightness":255,"defaultDashboardOption":"DASHBOARD_MENU_BUTTON_HINTS"}`;

// ---------------------------------------------------------------------------
// Sidebar drag-resize (session-only, not persisted).
// Min/max widths mirror CSS clamps so we never fight the layout.
// ---------------------------------------------------------------------------
function wireSidebarResize(handleId, panelId, edge) {
  const handle = $(handleId);
  const panel  = $(panelId);
  if (!handle || !panel) return;
  handle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = panel.getBoundingClientRect().width;
    const cs = getComputedStyle(panel);
    const minW = parseFloat(cs.minWidth) || 0;
    const maxW = parseFloat(cs.maxWidth) || Infinity;
    const dir  = edge === 'right' ? 1 : -1;   // right handle: dragging right grows width
    handle.classList.add('dragging');
    document.body.classList.add('resizing');
    const onMove = (ev) => {
      const w = Math.min(maxW, Math.max(minW, startW + dir * (ev.clientX - startX)));
      panel.style.width = `${w}px`;
    };
    const onUp = () => {
      handle.classList.remove('dragging');
      document.body.classList.remove('resizing');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  });
}

function wireResizeHandlers() {
  wireSidebarResize('sidebar-resize',  'sidebar',        'right');
  wireSidebarResize('settings-resize', 'settings-panel', 'left');
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  wireToolbarHandlers();
  wireSettingsHandlers();
  wireHsvPickerHandlers();
  wireButtonTooltips();
  wireResizeHandlers();

  // Restore the user's saved-color palette from localStorage before any
  // renderRgbSection / popup-open paints it.
  loadSavedColorsFromStorage();

  // Build empty SVG frame
  buildControllerSVG();

  // Auto-load defaults so the app isn't blank
  loadDefaultConfig();

  // Check WebSerial support
  if (!('serial' in navigator)) {
    $('btn-connect').disabled = true;
    $('btn-connect').title = 'WebSerial not supported — use Chrome or Edge for device communication';
    setStatus('WebSerial not supported in this browser. JSON import/export still works.', 'error');
  }
});
