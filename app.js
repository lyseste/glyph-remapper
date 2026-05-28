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

// ---------------------------------------------------------------------------
// Constants: Button layout (positions from the reference layout SVG,
// viewBox 0 0 912 491). Buttons are r=29.3 except LT6 (large, r=34.5) and
// the menu cluster MB1-7 (r=8.5). Menu buttons sit in the top-left corner.
// ---------------------------------------------------------------------------
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
  // mockup so the assigned icon is readable; centres spaced 29 units apart so
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

// ---------------------------------------------------------------------------
// Mode → button → output mapping (derived from firmware src/modes/*)
// Outputs use platform-agnostic IDs that are later styled per platform.
//   Face buttons: a, b, x, y
//   Bumpers/triggers: lb, rb, lt, rt
//   Stick clicks: ls, rs
//   D-pad: dup, ddown, dleft, dright
//   Left stick directions: lsl, lsr, lsu, lsd
//   C-stick / Right stick directions: csl, csr, csu, csd
//   System: start, select, home, capture
//   Platform-fighter modifiers: mx, my
// ---------------------------------------------------------------------------
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
  MODE_PROJECT_M: PLATFORM_FIGHTER_MAP,
  MODE_RIVALS_OF_AETHER: PLATFORM_FIGHTER_MAP,
  MODE_RIVALS2: PLATFORM_FIGHTER_MAP,
  MODE_MELEE: MELEE_MAP,
  MODE_64: SMASH64_MAP,
  // keyboard / custom – left undefined; falls back to blank
};

// Map proto OutputOption enum values (used in profile.menuButtonIcon) to our
// platform-agnostic output ids. Allows menu buttons to display the icon the
// user configured rather than the firmware default.
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

// ---------------------------------------------------------------------------
// Platform display styles
// Each output id resolves to a visual: { label?, glyph?, bg, fg, kind }
// kind: 'face' | 'shoulder' | 'system' | 'dpad' | 'stick' | 'cstick' | 'mod'
// glyph: 'cross' | 'circle' | 'square' | 'triangle' (PS face-button shapes)
// ---------------------------------------------------------------------------
const DARK_BG = '#404040';        // controller-button base when mapped
const POPUP_NEUTRAL_BG = '#2F2F2F'; // popup glyph base (lighter than popup card)
const LIGHT_TEXT = '#f5f5f5';

function mkFace(label, bg, fg = '#fff') { return { label, bg, fg, kind: 'face' }; }
function mkFaceGlyph(glyph, color) { return { glyph, bg: DARK_BG, fg: color, kind: 'face' }; }
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

// PlayStation: face buttons get position-mapped to PS symbols.
// Xbox A (bottom) → Cross, B (right) → Circle, X (left) → Square, Y (top) → Triangle.
// Each glyph renders as an outlined SVG shape in its canonical color on a dark bg.
const PS_STYLE = {
  a: mkFaceGlyph('cross',    '#7DB3E9'),   // Cross (blue)
  b: mkFaceGlyph('circle',   '#FF6666'),   // Circle (red)
  x: mkFaceGlyph('square',   '#FF69F8'),   // Square (pink)
  y: mkFaceGlyph('triangle', '#3EE3A1'),   // Triangle (green)
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

// Switch: A/B and X/Y are swapped relative to Xbox.
// Xbox A (bottom) → Switch B, B (right) → Switch A, X (left) → Switch Y, Y (top) → Switch X.
const SWITCH_STYLE = {
  a: mkFace('B', DARK_BG, LIGHT_TEXT),
  b: mkFace('A', DARK_BG, LIGHT_TEXT),
  x: mkFace('Y', DARK_BG, LIGHT_TEXT),
  y: mkFace('X', DARK_BG, LIGHT_TEXT),
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

const PLATFORM_STYLES = {
  xbox: XBOX_STYLE,
  playstation: PS_STYLE,
  switch: SWITCH_STYLE,
};

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

let selectedPlatform = 'xbox';  // 'xbox' | 'playstation' | 'switch'

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
  // never reach the device.
  const safeCfg = stripDisabledLeds(cfg);
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
  selectedProfileIdx = 0;
  renderAll();
  setStatus('Loaded default Glyph profiles', 'disconnected');
}

// ---------------------------------------------------------------------------
// JSON import/export
// ---------------------------------------------------------------------------
function exportConfig() {
  if (!config) { alert('No config loaded.'); return; }
  const safeCfg = stripDisabledLeds(config);
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

// ---------------------------------------------------------------------------
// Keyboard mode — USB HID Keyboard/Keypad Usage Page (0x07) scancodes.
// The firmware reads `KeyboardModeConfig.buttonsToKeycodes` and emits a HID
// keyboard report; DInput is the only backend wired to deliver it.
// ---------------------------------------------------------------------------
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

// MB1 is the hardware "open device menu" button — never remappable, but it has
// an addressable LED so its color can still be customised.
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

function colorIntToHex(c) {
  return '#' + (Number(c) >>> 0).toString(16).padStart(6, '0').slice(-6);
}

function parseHexInput(text) {
  let hex = String(text || '').trim().replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  return parseInt(hex, 16);
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

// Get the LED color (as uint32) for a physical button on this profile.
// Falls back to the profile's default color, then to the global default.
function getButtonColor(profile, btnId) {
  const rgb = getRgbConfig(profile);
  if (!rgb) return DEFAULT_LED_COLOR_INT;
  const entry = rgb.buttonColors?.find(c => c.button === btnId);
  if (entry) return Number(entry.color) >>> 0;
  return (rgb.defaultColor != null) ? (Number(rgb.defaultColor) >>> 0) : DEFAULT_LED_COLOR_INT;
}

function setButtonColor(profile, btnId, color) {
  // MB2-MB7 have no physical LED — refuse any color assignment so they never
  // make it into config.rgbConfigs[].buttonColors.
  if (!hasLED(btnId)) return;
  const rgb = ensureRgbConfig(profile);
  if (!rgb.buttonColors) rgb.buttonColors = [];
  const idx = rgb.buttonColors.findIndex(c => c.button === btnId);
  const value = (Number(color) >>> 0);
  if (idx >= 0) rgb.buttonColors[idx].color = value;
  else rgb.buttonColors.push({ button: btnId, color: value });
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

// Live-update the ring stroke for a single button without rebuilding the whole SVG.
// The .btn-ring stroke reads from --led-color via CSS, so we set the custom
// property on the group element (inline style — overrides CSS rules).
function applyLiveButtonColor(btnId, colorInt) {
  const g = svg().querySelector(`[data-btn="${btnId}"]`);
  if (g) g.style.setProperty('--led-color', colorIntToHex(colorInt));
}

function remapMap(profile) {
  const map = {};
  if (!profile?.buttonRemapping) return map;
  for (const r of profile.buttonRemapping) {
    if (r.physicalButton) map[r.physicalButton] = r.activates ?? null;
  }
  return map;
}

// Follow the remap chain for a physical button.
// Returns the final "logical" button id that fires when this physical button is pressed.
// If the button is remapped to BTN_UNSPECIFIED, returns null (disabled).
function resolveLogicalButton(physBtnId, rmap) {
  if (!(physBtnId in rmap)) return physBtnId;
  const target = rmap[physBtnId];
  if (!target || target === 'BTN_UNSPECIFIED') return null;
  if (target === physBtnId) return physBtnId;
  // Don't follow further chains – buttonRemapping is a single-hop mapping in firmware.
  return target;
}

// Resolve the platform-agnostic output id for a physical button in the given profile.
// Returns null if the button has no output (unmapped or explicitly disabled).
//
// Notes on the "disabled" mechanism: the official configurator marks unused
// buttons by adding an entry to buttonRemapping with `physicalButton` set but
// `activates` missing/BTN_UNSPECIFIED. resolveLogicalButton() handles this by
// returning null when activates is falsy, so we don't need a separate
// target-hiding rule — the user/config decides what's disabled per profile.
function resolveButtonOutput(physBtnId, profile, rmap) {
  if (!profile) return null;

  // Menu buttons (MB1-MB7) display whatever menuButtonIcon says.
  if (physBtnId.startsWith('BTN_MB')) {
    const mbIdx = parseInt(physBtnId.slice(6), 10) - 1;
    const outOpt = profile.menuButtonIcon?.[mbIdx];
    if (!outOpt || outOpt === 'OUT_UNSPECIFIED') return null;
    return OUTPUT_OPTION_TO_OUTPUT_ID[outOpt] || null;
  }

  const logical = resolveLogicalButton(physBtnId, rmap);
  if (!logical) return null;
  const modeMap = MODE_OUTPUT_MAP[profile.modeId];
  if (!modeMap) return null;
  return modeMap[logical] || null;
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
  const newProfile = {
    modeId: 'MODE_MELEE',
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
  renderAll();
}

function deleteProfile(idx) {
  if (!config?.gameModeConfigs) return;
  config.gameModeConfigs.splice(idx, 1);
  if (selectedProfileIdx >= config.gameModeConfigs.length) {
    selectedProfileIdx = config.gameModeConfigs.length - 1;
  }
  renderAll();
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

  // Controller body — fills the viewBox (912 x 491, rx=19)
  const body = svgEl('rect', { x:0, y:0, width:912, height:491, rx:19, ry:19, class:'controller-body' });
  s.appendChild(body);

  // Render all buttons
  const profile = currentProfile();
  const rmap = remapMap(profile);
  const platformStyle = PLATFORM_STYLES[selectedPlatform] || XBOX_STYLE;

  const keyboardMode = isKeyboardProfile(profile);

  for (const btn of BUTTON_LAYOUT) {
    let style = null;
    if (keyboardMode) {
      // In keyboard mode the button shows whichever HID key it sends.
      // buttonRemapping is bypassed by the firmware here (per CustomKeyboardMode.cpp).
      const keycode = getButtonKeycode(profile, btn.id);
      if (keycode != null) {
        style = { label: keycodeToLabel(keycode), bg: DARK_BG, fg: LIGHT_TEXT, kind: 'key' };
      }
    } else {
      const outputId = resolveButtonOutput(btn.id, profile, rmap);
      style = outputId ? platformStyle[outputId] : null;
    }
    const isMapped = !!style;
    // Ring visibility:
    //   - MB1: always shown (it has an LED, can't be remapped → ring is the only signal)
    //   - MB2-MB7: never shown (no physical LED on the device)
    //   - all other buttons: shown when mapped
    const showRing = NON_REMAPPABLE_BUTTONS.has(btn.id)
      || (isMapped && hasLED(btn.id));

    const classes = ['btn-group'];
    if (btn.large) classes.push('btn-large');
    if (btn.menu) classes.push('btn-menu');
    classes.push(showRing ? 'mapped' : 'unmapped');
    if (btn.id === selectedBtnId) classes.push('selected');

    const g = svgEl('g', {
      class: classes.join(' '),
      'data-btn': btn.id,
      role: 'button',
      tabindex: '0',
      'aria-label': btn.id + (style ? ' → ' + style.label : '')
    });

    // Outer ring (color comes from the --led-color custom property below)
    g.appendChild(svgEl('circle', { cx: btn.x, cy: btn.y, r: btn.r, class: 'btn-ring' }));
    if (showRing && hasLED(btn.id)) {
      g.style.setProperty('--led-color', colorIntToHex(getButtonColor(profile, btn.id)));
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

    const modeShort = (p.modeId || 'MODE_UNSPECIFIED').replace('MODE_', '');
    item.innerHTML = `
      <span class="profile-item-name">${escHtml(p.name || 'Unnamed')}</span>
      <span class="profile-item-mode">${escHtml(modeShort)}</span>
      <button class="profile-item-del" title="Delete profile" data-idx="${i}">✕</button>
    `;
    item.addEventListener('click', e => {
      if (e.target.classList.contains('profile-item-del')) return;
      selectedProfileIdx = i;
      selectedBtnId = null;
      renderAll();
    });
    item.querySelector('.profile-item-del').addEventListener('click', e => {
      e.stopPropagation();
      if (confirm(`Delete profile "${p.name || 'Unnamed'}"?`)) deleteProfile(i);
    });
    list.appendChild(item);
  });

  const noProfileMsg = $('no-profile-msg');
  noProfileMsg.style.display = profiles.length === 0 ? 'block' : 'none';
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

  // Keyboard mode hides backends (DInput is forced) and Button Remapping
  // (the firmware bypasses buttonRemapping in keyboard mode).
  const keyboardMode = isKeyboardProfile(profile);
  $('backends-group').style.display = keyboardMode ? 'none' : '';
  $('remap-group').style.display    = keyboardMode ? 'none' : '';

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

  const defaultColor = rgb?.defaultColor != null ? Number(rgb.defaultColor) >>> 0 : DEFAULT_LED_COLOR_INT;
  const hex = colorIntToHex(defaultColor);
  $('set-rgb-color-picker').value = hex;
  $('set-rgb-color-hex').value = hex;
  $('set-rgb-color-hex').classList.remove('invalid');

  $('rgb-static-controls').hidden = (anim !== 'RGB_ANIM_STATIC');
}

function renderSocdList(profile) {
  const list = $('socd-list');
  list.innerHTML = '';
  for (let i = 0; i < (profile.socdPairs?.length ?? 0); i++) {
    const pair = profile.socdPairs[i];
    list.appendChild(buildSocdRow(pair, i, profile));
  }
}

function buildSocdRow(pair, idx, profile) {
  const row = document.createElement('div');
  row.className = 'socd-item';
  row.innerHTML = `
    <select title="Dir 1">${ALL_BUTTONS.map(b => `<option value="${b}"${b===pair.buttonDir1?' selected':''}>${b.replace('BTN_','')}</option>`).join('')}</select>
    <span class="socd-sep">↔</span>
    <select title="Dir 2">${ALL_BUTTONS.map(b => `<option value="${b}"${b===pair.buttonDir2?' selected':''}>${b.replace('BTN_','')}</option>`).join('')}</select>
    <span class="socd-sep">:</span>
    <select title="SOCD type">${SOCD_TYPES.map(t => `<option value="${t}"${t===pair.socdType?' selected':''}>${t.replace('SOCD_','')}</option>`).join('')}</select>
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
  for (let i = 0; i < (profile.buttonRemapping?.length ?? 0); i++) {
    const remap = profile.buttonRemapping[i];
    list.appendChild(buildRemapRow(remap, i, profile));
  }
}

function buildRemapRow(remap, idx, profile) {
  const row = document.createElement('div');
  row.className = 'remap-item';
  const allOpts = ALL_BUTTONS.map(b => `<option value="${b}"${b===remap.physicalButton?' selected':''}>${b.replace('BTN_','')}</option>`).join('');
  const actOpts = ALL_BUTTONS.map(b => `<option value="${b}"${b===(remap.activates||'BTN_UNSPECIFIED')?' selected':''}>${b.replace('BTN_','')}</option>`).join('');
  row.innerHTML = `
    <select title="Physical button">${allOpts}</select>
    <span class="remap-sep">→</span>
    <select title="Activates">${actOpts}</select>
    <button class="item-del-btn" title="Remove">✕</button>
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

// Set of outputs available in the current profile's mode.
function availableOutputs(modeId) {
  const modeMap = MODE_OUTPUT_MAP[modeId];
  if (!modeMap) return new Set();
  return new Set(Object.values(modeMap));
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

  // Toggle popup sections.
  //  - keyboard mode: hide output grid, show key-capture box, hide un-map for non-remappable buttons
  //  - controller mode: hide key-capture box, show output grid for remappable buttons
  $('output-popup-grid').style.display     = (!keyboardMode && remappable) ? '' : 'none';
  $('output-popup-keyboard').style.display = (keyboardMode && remappable)  ? '' : 'none';
  $('output-popup-unmap').style.display    = remappable ? '' : 'none';
  $('output-popup-color').style.display    = hasLed     ? '' : 'none';

  if (!keyboardMode) {
    const grid = $('output-popup-grid');
    grid.innerHTML = '';
    if (remappable) {
      const platformStyle = PLATFORM_STYLES[selectedPlatform] || XBOX_STYLE;
      const isMenuBtn = btnId.startsWith('BTN_MB');
      const available = availableOutputs(profile.modeId);

      for (const outId of POPUP_OUTPUT_ORDER) {
        if (!isMenuBtn && !available.has(outId)) continue;
        const style = platformStyle[outId];
        if (!style) continue;
        grid.appendChild(renderOutputGlyph(outId, style));
      }
    }
  } else {
    // Show the current keycode (or prompt) on the capture button
    syncPopupKeyboardInput(btnId);
  }

  if (hasLed) syncPopupColorControls(btnId);

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
  $('popup-color-picker').value = hex;
  $('popup-color-hex').value = hex;
  $('popup-color-hex').classList.remove('invalid');
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
  // For neutral (non-colored) buttons, use a slightly lighter shade than the
  // popup card so they pop out. Face buttons with their canonical colors keep
  // their own background.
  el.style.background = (style.bg === DARK_BG) ? POPUP_NEUTRAL_BG : style.bg;
  el.style.color = style.fg;
  el.title = outputId;

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

function applyOutput(outputId) {
  const profile = currentProfile();
  if (!profile || !selectedBtnId) { closeOutputPopup(); return; }

  // Menu buttons: write to menuButtonIcon
  if (selectedBtnId.startsWith('BTN_MB')) {
    const mbIdx = parseInt(selectedBtnId.slice(6), 10) - 1;
    if (!profile.menuButtonIcon) profile.menuButtonIcon = emptyMenuIconArray();
    profile.menuButtonIcon[mbIdx] = OUTPUT_ID_TO_OUTPUT_OPTION[outputId] || 'OUT_UNSPECIFIED';
    closeOutputPopup();
    renderAll();
    return;
  }

  // Main buttons: figure out which physical button produces this output in this mode,
  // then write a buttonRemapping entry (selectedBtn -> phys).
  const phys = findPhysicalButtonForOutput(outputId, profile.modeId);
  if (!phys) { closeOutputPopup(); return; }
  setRemap(selectedBtnId, phys);
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
    const mbIdx = parseInt(selectedBtnId.slice(6), 10) - 1;
    if (!profile.menuButtonIcon) profile.menuButtonIcon = emptyMenuIconArray();
    profile.menuButtonIcon[mbIdx] = 'OUT_UNSPECIFIED';
  } else {
    // Disable button: { physicalButton: BTN_X } with no activates.
    setRemap(selectedBtnId, null);
  }
  closeOutputPopup();
  renderAll();
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
function renderAll() {
  renderProfileList();
  buildControllerSVG();
  renderSettingsPanel();
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

  $('set-mode-id').addEventListener('change', () => {
    const p = currentProfile();
    if (!p) return;
    const oldMode = p.modeId;
    const newMode = $('set-mode-id').value;
    p.modeId = newMode;
    // Keyboard mode is DInput-only by firmware design — force the backend
    // list when switching in or restore USB defaults when switching out.
    if (newMode === 'MODE_KEYBOARD' && oldMode !== 'MODE_KEYBOARD') {
      p.applicableBackends = ['COMMS_BACKEND_DINPUT'];
    } else if (oldMode === 'MODE_KEYBOARD' && newMode !== 'MODE_KEYBOARD') {
      p.applicableBackends = [...USB_BACKENDS];
    }
    renderProfileList();
    renderSettingsPanel();   // toggle backends/remap visibility
    buildControllerSVG();    // re-render with new mode's labels
  });

  // Collapsible Button Remapping section
  $('remap-toggle').addEventListener('click', () => {
    const toggle = $('remap-toggle');
    const body = $('remap-body');
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    body.hidden = expanded;  // hide when previously expanded
  });

  // RGB animation dropdown
  $('set-rgb-animation').addEventListener('change', () => {
    const p = currentProfile();
    if (!p) return;
    const rgb = ensureRgbConfig(p);
    rgb.animation = $('set-rgb-animation').value;
    $('rgb-static-controls').hidden = (rgb.animation !== 'RGB_ANIM_STATIC');
  });

  // RGB color picker (live updates the hex field; doesn't apply until "Apply to mapped buttons")
  $('set-rgb-color-picker').addEventListener('input', (e) => {
    const colorInt = parseHexInput(e.target.value);
    if (colorInt == null) return;
    $('set-rgb-color-hex').value = colorIntToHex(colorInt);
    $('set-rgb-color-hex').classList.remove('invalid');
  });

  $('set-rgb-color-hex').addEventListener('input', (e) => {
    const colorInt = parseHexInput(e.target.value);
    if (colorInt == null) { e.target.classList.add('invalid'); return; }
    e.target.classList.remove('invalid');
    $('set-rgb-color-picker').value = colorIntToHex(colorInt);
  });

  // Apply the static color to every currently-mapped button in this profile.
  $('btn-apply-rgb').addEventListener('click', () => {
    const p = currentProfile();
    if (!p) return;
    const colorInt = parseHexInput($('set-rgb-color-hex').value);
    if (colorInt == null) { $('set-rgb-color-hex').classList.add('invalid'); return; }
    const rgb = ensureRgbConfig(p);
    rgb.defaultColor = colorInt;
    const keyboardMode = isKeyboardProfile(p);
    const rmap = remapMap(p);
    for (const btn of BUTTON_LAYOUT) {
      const active = keyboardMode
        ? (getButtonKeycode(p, btn.id) != null)
        : (resolveButtonOutput(btn.id, p, rmap) != null);
      if (active) setButtonColor(p, btn.id, colorInt);
    }
    buildControllerSVG();
  });

  $('btn-add-socd').addEventListener('click', () => {
    const p = currentProfile();
    if (!p) return;
    if (!p.socdPairs) p.socdPairs = [];
    p.socdPairs.push({ buttonDir1: 'BTN_LF3', buttonDir2: 'BTN_LF1', socdType: 'SOCD_2IP_NO_REAC' });
    renderSocdList(p);
  });

  $('btn-add-remap').addEventListener('click', () => {
    const p = currentProfile();
    if (!p) return;
    if (!p.buttonRemapping) p.buttonRemapping = [];
    p.buttonRemapping.push({ physicalButton: 'BTN_LF1', activates: 'BTN_UNSPECIFIED' });
    renderRemapList(p);
    buildControllerSVG();
  });
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
  $('btn-defaults').addEventListener('click', () => {
    if (config && !confirm('Load defaults? This will replace the current config.')) return;
    loadDefaultConfig();
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
  $('popup-color-picker').addEventListener('input', (e) => {
    const profile = currentProfile();
    if (!profile || !selectedBtnId) return;
    const colorInt = parseHexInput(e.target.value);
    if (colorInt == null) return;
    setButtonColor(profile, selectedBtnId, colorInt);
    $('popup-color-hex').value = colorIntToHex(colorInt);
    $('popup-color-hex').classList.remove('invalid');
    applyLiveButtonColor(selectedBtnId, colorInt);
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
    $('popup-color-picker').value = colorIntToHex(colorInt);
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
    setButtonKeycode(profile, selectedBtnId, hid);
    keyboardCapturing = false;
    const el = $('popup-keyboard-input');
    el.classList.remove('capturing');
    el.textContent = keycodeToLabel(hid);
    buildControllerSVG();
  });

  $('popup-remove-lighting').addEventListener('click', () => {
    const profile = currentProfile();
    if (!profile || !selectedBtnId) return;
    setButtonColor(profile, selectedBtnId, 0);
    $('popup-color-picker').value = '#000000';
    $('popup-color-hex').value = '#000000';
    $('popup-color-hex').classList.remove('invalid');
    applyLiveButtonColor(selectedBtnId, 0);
  });

  // Close popup on outside-click (but ignore clicks on controller buttons —
  // those re-open the popup with the new button's context).
  document.addEventListener('click', (e) => {
    const popup = $('output-popup');
    if (popup.classList.contains('hidden')) return;
    if (popup.contains(e.target)) return;
    if (e.target.closest('.btn-group')) return;
    closeOutputPopup();
  });

  // Close popup on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
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

// ---------------------------------------------------------------------------
// Default config (embedded JSON)
// Source: GlyphUserProfiles.json — the official Limit Labs default profiles.
// Each non-default-output button is explicitly listed in buttonRemapping with
// an empty `activates` field, marking it as disabled in that profile. This is
// how the original configurator decides which buttons to grey out.
// ---------------------------------------------------------------------------
const DEFAULT_CONFIG_JSON = `{"gameModeConfigs":[{"modeId":"MODE_MELEE","name":"Melee","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP_NO_REAC"}],"buttonRemapping":[{"physicalButton":"BTN_LF5"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":1,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_PROJECT_M","name":"Brawl","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP_NO_REAC"}],"buttonRemapping":[{"physicalButton":"BTN_LF5"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":2,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_ULTIMATE","name":"Ultimate","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP"}],"buttonRemapping":[{"physicalButton":"BTN_LF5"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":3,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_FGC","name":"Split FGC","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_LT1","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_RT1","activates":"BTN_LT1"},{"physicalButton":"BTN_LF5","activates":"BTN_LT2"},{"physicalButton":"BTN_RF9","activates":"BTN_RT1"},{"physicalButton":"BTN_LF4"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT2"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_RT2"},{"physicalButton":"BTN_RT3"},{"physicalButton":"BTN_RT4"},{"physicalButton":"BTN_RT5"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":4,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_XB_START"]},{"modeId":"MODE_FGC","name":"FGC","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_LT1","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_RF1","activates":"BTN_RF4"},{"physicalButton":"BTN_RF5","activates":"BTN_RF8"},{"physicalButton":"BTN_LF8","activates":"BTN_LF3"},{"physicalButton":"BTN_LF7","activates":"BTN_LF2"},{"physicalButton":"BTN_LF6","activates":"BTN_LF1"},{"physicalButton":"BTN_LT6","activates":"BTN_LT1"},{"physicalButton":"BTN_RF10","activates":"BTN_RF1"},{"physicalButton":"BTN_RF11","activates":"BTN_RF2"},{"physicalButton":"BTN_RF12","activates":"BTN_RF3"},{"physicalButton":"BTN_RF13","activates":"BTN_RF5"},{"physicalButton":"BTN_RF14","activates":"BTN_RF6"},{"physicalButton":"BTN_RF15","activates":"BTN_RF7"},{"physicalButton":"BTN_RF16","activates":"BTN_LT2"},{"physicalButton":"BTN_LF1"},{"physicalButton":"BTN_LF2"},{"physicalButton":"BTN_LF3"},{"physicalButton":"BTN_LF4"},{"physicalButton":"BTN_LF5"},{"physicalButton":"BTN_LT1"},{"physicalButton":"BTN_LT2"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_RF2"},{"physicalButton":"BTN_RF3"},{"physicalButton":"BTN_RF4"},{"physicalButton":"BTN_RF6"},{"physicalButton":"BTN_RF7"},{"physicalButton":"BTN_RF8"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RT1"},{"physicalButton":"BTN_RT2"},{"physicalButton":"BTN_RT3"},{"physicalButton":"BTN_RT4"},{"physicalButton":"BTN_RT5"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":5,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_XB_START"]},{"modeId":"MODE_64","name":"Smash64","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_LF5"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_RT2"},{"physicalButton":"BTN_RT3"},{"physicalButton":"BTN_RT4"},{"physicalButton":"BTN_RT5"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"},{"physicalButton":"BTN_MB4"},{"physicalButton":"BTN_MB5"},{"physicalButton":"BTN_MB6"}],"rgbConfig":6,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_N64"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_START"]},{"modeId":"MODE_RIVALS_OF_AETHER","name":"RoA","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP"}],"buttonRemapping":[{"physicalButton":"BTN_RF7","activates":"BTN_LF7"},{"physicalButton":"BTN_RF8","activates":"BTN_LT6"},{"physicalButton":"BTN_LF5"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":7,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_RIVALS2","name":"RoA2","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP"}],"buttonRemapping":[{"physicalButton":"BTN_RF7","activates":"BTN_LF7"},{"physicalButton":"BTN_RF8","activates":"BTN_LT6"},{"physicalButton":"BTN_LF5"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":8,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_MELEE","name":"GameCube","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_LF2","activates":"BTN_RF4"},{"physicalButton":"BTN_LF6","activates":"BTN_LF8"},{"physicalButton":"BTN_LF5","activates":"BTN_LF2"},{"physicalButton":"BTN_RF13","activates":"BTN_LT6"},{"physicalButton":"BTN_RF10","activates":"BTN_LF7"},{"physicalButton":"BTN_RF11","activates":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF4"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":9,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_MELEE","name":"N64","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_LF2","activates":"BTN_RF4"},{"physicalButton":"BTN_RF2","activates":"BTN_RF5"},{"physicalButton":"BTN_LF6","activates":"BTN_LF8"},{"physicalButton":"BTN_LF5","activates":"BTN_LF2"},{"physicalButton":"BTN_RF13","activates":"BTN_LT6"},{"physicalButton":"BTN_RF11","activates":"BTN_LF6"},{"physicalButton":"BTN_RF10","activates":"BTN_LF7"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF4"},{"physicalButton":"BTN_RF5"},{"physicalButton":"BTN_RF6"},{"physicalButton":"BTN_RF7"},{"physicalButton":"BTN_RF8"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"}],"rgbConfig":10,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT","COMMS_BACKEND_XINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_N64"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_FGC","name":"SNES","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_LT1","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_LF2","activates":"BTN_LT1"},{"physicalButton":"BTN_LT1","activates":"BTN_RF8"},{"physicalButton":"BTN_RT1","activates":"BTN_RF7"},{"physicalButton":"BTN_RF1","activates":"BTN_RF2"},{"physicalButton":"BTN_RF2","activates":"BTN_RF1"},{"physicalButton":"BTN_RF5","activates":"BTN_RF6"},{"physicalButton":"BTN_RF6","activates":"BTN_RF5"},{"physicalButton":"BTN_LF5","activates":"BTN_LF2"},{"physicalButton":"BTN_LF4"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT2"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF3"},{"physicalButton":"BTN_RF4"},{"physicalButton":"BTN_RF7"},{"physicalButton":"BTN_RF8"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_RT2"},{"physicalButton":"BTN_RT3"},{"physicalButton":"BTN_RT4"},{"physicalButton":"BTN_RT5"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"},{"physicalButton":"BTN_MB4"},{"physicalButton":"BTN_MB5"}],"rgbConfig":11,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_SNES"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_FGC","name":"NES","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_LT1","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_LF2","activates":"BTN_LT1"},{"physicalButton":"BTN_RF1","activates":"BTN_RF2"},{"physicalButton":"BTN_RF2","activates":"BTN_RF1"},{"physicalButton":"BTN_LF5","activates":"BTN_LF2"},{"physicalButton":"BTN_LF4"},{"physicalButton":"BTN_LF6"},{"physicalButton":"BTN_LF7"},{"physicalButton":"BTN_LF8"},{"physicalButton":"BTN_LT1"},{"physicalButton":"BTN_LT2"},{"physicalButton":"BTN_LT3"},{"physicalButton":"BTN_LT4"},{"physicalButton":"BTN_LT5"},{"physicalButton":"BTN_LT6"},{"physicalButton":"BTN_RF3"},{"physicalButton":"BTN_RF4"},{"physicalButton":"BTN_RF5"},{"physicalButton":"BTN_RF6"},{"physicalButton":"BTN_RF7"},{"physicalButton":"BTN_RF8"},{"physicalButton":"BTN_RF9"},{"physicalButton":"BTN_RF10"},{"physicalButton":"BTN_RF11"},{"physicalButton":"BTN_RF12"},{"physicalButton":"BTN_RF13"},{"physicalButton":"BTN_RF14"},{"physicalButton":"BTN_RF15"},{"physicalButton":"BTN_RF16"},{"physicalButton":"BTN_RT1"},{"physicalButton":"BTN_RT2"},{"physicalButton":"BTN_RT3"},{"physicalButton":"BTN_RT4"},{"physicalButton":"BTN_RT5"},{"physicalButton":"BTN_MB1"},{"physicalButton":"BTN_MB2"},{"physicalButton":"BTN_MB3"},{"physicalButton":"BTN_MB4"},{"physicalButton":"BTN_MB5"}],"rgbConfig":12,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_NES"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_KEYBOARD","name":"Keyboard","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_LT1","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP"}],"keyboardModeConfig":1,"rgbConfig":13,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_DINPUT"]}],"communicationBackendConfigs":[{"backendId":"COMMS_BACKEND_XINPUT","defaultModeConfig":1},{"backendId":"COMMS_BACKEND_NINTENDO_SWITCH","defaultModeConfig":1},{"backendId":"COMMS_BACKEND_DINPUT","defaultModeConfig":1},{"backendId":"COMMS_BACKEND_GAMECUBE","defaultModeConfig":1},{"backendId":"COMMS_BACKEND_N64","defaultModeConfig":6},{"backendId":"COMMS_BACKEND_NES","defaultModeConfig":12},{"backendId":"COMMS_BACKEND_SNES","defaultModeConfig":11},{"backendId":"COMMS_BACKEND_CONFIGURATOR","activationBinding":["BTN_RT2"]}],"keyboardModes":[{"buttonsToKeycodes":[{"button":"BTN_LF1","keycode":4},{"button":"BTN_LF2","keycode":5},{"button":"BTN_LF3","keycode":6},{"button":"BTN_LF4","keycode":7},{"button":"BTN_LF5","keycode":8},{"button":"BTN_LF6","keycode":9},{"button":"BTN_LF7","keycode":10},{"button":"BTN_LF8","keycode":11},{"button":"BTN_LT1","keycode":12},{"button":"BTN_LT2","keycode":13},{"button":"BTN_LT3","keycode":14},{"button":"BTN_LT4","keycode":15},{"button":"BTN_LT5","keycode":16},{"button":"BTN_LT6","keycode":17},{"button":"BTN_RF1","keycode":18},{"button":"BTN_RF2","keycode":19},{"button":"BTN_RF3","keycode":20},{"button":"BTN_RF4","keycode":21},{"button":"BTN_RF5","keycode":22},{"button":"BTN_RF6","keycode":23},{"button":"BTN_RF7","keycode":24},{"button":"BTN_RF8","keycode":25},{"button":"BTN_RF9","keycode":26},{"button":"BTN_RF10","keycode":27},{"button":"BTN_RF11","keycode":28},{"button":"BTN_RF12","keycode":29},{"button":"BTN_RF13","keycode":30},{"button":"BTN_RF14","keycode":31},{"button":"BTN_RF15","keycode":32},{"button":"BTN_RF16","keycode":33},{"button":"BTN_RT1","keycode":34},{"button":"BTN_RT2","keycode":35},{"button":"BTN_RT3","keycode":36},{"button":"BTN_RT4","keycode":37},{"button":"BTN_RT5","keycode":38}]}],"defaultBackendConfig":1,"defaultUsbBackendConfig":1,"rgbBrightness":255,"defaultDashboardOption":"DASHBOARD_MENU_BUTTON_HINTS"}`;

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  wireToolbarHandlers();
  wireSettingsHandlers();

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
