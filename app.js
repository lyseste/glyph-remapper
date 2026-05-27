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
// Constants: Button layout (from button_positions.hpp, viewBox 0 0 140 72)
// ---------------------------------------------------------------------------
const BUTTON_LAYOUT = [
  // Left front cluster
  { id: 'BTN_LF4', x: 6,    y: 29,   r: 4,   label: 'LF4' },
  { id: 'BTN_LF3', x: 15,   y: 23,   r: 4,   label: 'LF3' },
  { id: 'BTN_LF2', x: 25,   y: 22,   r: 4,   label: 'LF2' },
  { id: 'BTN_LF1', x: 35,   y: 27,   r: 4,   label: 'LF1' },
  { id: 'BTN_LF5', x: 24,   y: 32,   r: 4,   label: 'LF5' },
  // Left upper row
  { id: 'BTN_LF8', x: 35,   y: 17,   r: 4,   label: 'LF8' },
  { id: 'BTN_LF7', x: 46,   y: 19,   r: 4,   label: 'LF7' },
  { id: 'BTN_LF6', x: 55,   y: 25,   r: 4,   label: 'LF6' },
  // Left thumb cluster
  { id: 'BTN_LT5', x: 30,   y: 46,   r: 4,   label: 'LT5' },
  { id: 'BTN_LT4', x: 38,   y: 40,   r: 4,   label: 'LT4' },
  { id: 'BTN_LT3', x: 46,   y: 46,   r: 4,   label: 'LT3' },
  { id: 'BTN_LT1', x: 38,   y: 52,   r: 4,   label: 'LT1' },
  { id: 'BTN_LT2', x: 46,   y: 58,   r: 4,   label: 'LT2' },
  { id: 'BTN_LT6', x: 59,   y: 50,   r: 5.5, label: 'LT6', large: true },
  // RF center cluster
  { id: 'BTN_RF16',x: 72,   y: 35,   r: 4,   label: 'RF16' },
  { id: 'BTN_RF13',x: 64,   y: 20,   r: 4,   label: 'RF13' },
  { id: 'BTN_RF14',x: 74,   y: 15,   r: 4,   label: 'RF14' },
  { id: 'BTN_RF15',x: 84,   y: 15,   r: 4,   label: 'RF15' },
  { id: 'BTN_RF10',x: 64,   y: 30,   r: 4,   label: 'RF10' },
  { id: 'BTN_RF11',x: 74,   y: 25,   r: 4,   label: 'RF11' },
  { id: 'BTN_RF12',x: 84,   y: 25,   r: 4,   label: 'RF12' },
  // RF face buttons top row
  { id: 'BTN_RF5', x: 93,   y: 17,   r: 4,   label: 'RF5' },
  { id: 'BTN_RF6', x: 102,  y: 13,   r: 4,   label: 'RF6' },
  { id: 'BTN_RF7', x: 112,  y: 14,   r: 4,   label: 'RF7' },
  { id: 'BTN_RF8', x: 122,  y: 19,   r: 4,   label: 'RF8' },
  // RF face buttons bottom row
  { id: 'BTN_RF1', x: 93,   y: 27,   r: 4,   label: 'RF1' },
  { id: 'BTN_RF2', x: 102,  y: 23,   r: 4,   label: 'RF2' },
  { id: 'BTN_RF3', x: 112,  y: 24,   r: 4,   label: 'RF3' },
  { id: 'BTN_RF4', x: 122,  y: 29,   r: 4,   label: 'RF4' },
  // RF9
  { id: 'BTN_RF9', x: 101,  y: 34,   r: 4,   label: 'RF9' },
  // Right thumb cluster
  { id: 'BTN_RT4', x: 90,   y: 40,   r: 4,   label: 'RT4' },
  { id: 'BTN_RT3', x: 82,   y: 46,   r: 4,   label: 'RT3' },
  { id: 'BTN_RT5', x: 98,   y: 46,   r: 4,   label: 'RT5' },
  { id: 'BTN_RT1', x: 90,   y: 52,   r: 4,   label: 'RT1' },
  { id: 'BTN_RT2', x: 82,   y: 58,   r: 4,   label: 'RT2' },
  // Menu buttons (top bar)
  { id: 'BTN_MB1', x: 35,   y: 5.5,  r: 2.5, label: 'MB1', menu: true },
  { id: 'BTN_MB2', x: 43,   y: 5.5,  r: 2.5, label: 'MB2', menu: true },
  { id: 'BTN_MB3', x: 51,   y: 5.5,  r: 2.5, label: 'MB3', menu: true },
  { id: 'BTN_MB4', x: 59,   y: 5.5,  r: 2.5, label: 'MB4', menu: true },
  { id: 'BTN_MB5', x: 75,   y: 5.5,  r: 2.5, label: 'MB5', menu: true },
  { id: 'BTN_MB6', x: 83,   y: 5.5,  r: 2.5, label: 'MB6', menu: true },
  { id: 'BTN_MB7', x: 91,   y: 5.5,  r: 2.5, label: 'MB7', menu: true },
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

const BACKEND_IDS = ['COMMS_BACKEND_DINPUT','COMMS_BACKEND_XINPUT','COMMS_BACKEND_NINTENDO_SWITCH',
  'COMMS_BACKEND_GAMECUBE','COMMS_BACKEND_N64','COMMS_BACKEND_NES','COMMS_BACKEND_SNES',
  'COMMS_BACKEND_PASSTHROUGH_PS4','COMMS_BACKEND_PASSTHROUGH_PS5'];

const SOCD_TYPES = ['SOCD_NEUTRAL','SOCD_2IP','SOCD_2IP_NO_REAC','SOCD_DIR1_PRIORITY','SOCD_DIR2_PRIORITY'];

const LAYOUT_PLATES = ['LAYOUT_PLATE_EVERYTHING','LAYOUT_PLATE_FGC','LAYOUT_PLATE_SPLIT_FGC','LAYOUT_PLATE_PLATFORM_FIGHTER'];

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
  // Left stick click (firmware: LT2)
  BTN_LT2: 'ls',
  // Face buttons / triggers / bumpers (XInput layout)
  BTN_RF1: 'a',  BTN_RF2: 'b',  BTN_RF3: 'rt', BTN_RF4: 'lt',
  BTN_RF5: 'x',  BTN_RF6: 'y',  BTN_RF7: 'rb', BTN_RF8: 'lb',
  // NOTE: Firmware FGC mode also maps RT1=rs and RT3/5/2/4 = right-stick,
  // and LF8/6/7/LT6 = left-stick directions. These are intentionally omitted
  // from the configurator display to match the original layout where the
  // FGC profile only shows the digital fight-stick face buttons + D-pad.
  // Menu buttons (MB1-MB7) are handled via profile.menuButtonIcon — not in this map.
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
  // Melee20Button uses LT6 for direct DPad up, and LF7 for down
  BTN_LT6: 'dup',
  BTN_LF7: 'ddown',
  // Single Start (MB1 in Melee18Button is unused here; MB7 already covers start)
};

const MODE_OUTPUT_MAP = {
  MODE_FGC: FGC_MAP,
  MODE_ULTIMATE: PLATFORM_FIGHTER_MAP,
  MODE_PROJECT_M: PLATFORM_FIGHTER_MAP,
  MODE_RIVALS_OF_AETHER: PLATFORM_FIGHTER_MAP,
  MODE_RIVALS2: PLATFORM_FIGHTER_MAP,
  MODE_MELEE: MELEE_MAP,
  // 64, custom, keyboard – left undefined for now; falls back to blank
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
// Each output id resolves to a visual: { label, bg, fg, kind }
// kind: 'face' | 'shoulder' | 'system' | 'dpad' | 'stick' | 'cstick' | 'mod'
// ---------------------------------------------------------------------------
const NEUTRAL_LIGHT = '#d8dee5';
const NEUTRAL_DARK_TEXT = '#1a2a40';
const SYSTEM_BG = '#5a6878';
const MOD_BG = '#7a8898';

function mkFace(label, bg, fg = '#fff') { return { label, bg, fg, kind: 'face' }; }
function mkShoulder(label) { return { label, bg: NEUTRAL_LIGHT, fg: NEUTRAL_DARK_TEXT, kind: 'shoulder' }; }
function mkSystem(label) { return { label, bg: SYSTEM_BG, fg: '#fff', kind: 'system' }; }
function mkDpad(dir) { return { label: dir, bg: SYSTEM_BG, fg: '#fff', kind: 'dpad' }; }
function mkStick(kind, dir) { return { label: dir, bg: NEUTRAL_LIGHT, fg: NEUTRAL_DARK_TEXT, kind }; }
function mkMod(label) { return { label, bg: MOD_BG, fg: '#fff', kind: 'mod' }; }

const XBOX_STYLE = {
  a: mkFace('A', '#2ea043'),
  b: mkFace('B', '#e0464a'),
  x: mkFace('X', '#3a86c9'),
  y: mkFace('Y', '#e8c038', NEUTRAL_DARK_TEXT),
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
};

// PlayStation: face buttons get position-mapped to PS symbols & colors.
// Xbox A (bottom) → Cross, B (right) → Circle, X (left) → Square, Y (top) → Triangle.
const PS_STYLE = {
  a: mkFace('✕', '#5b7ec5'),   // Cross (blue)
  b: mkFace('●', '#cc5562'),   // Circle (red)
  x: mkFace('■', '#e266a8'),   // Square (pink)
  y: mkFace('▲', '#5fc295'),   // Triangle (green)
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
};

// Switch: A/B and X/Y are swapped relative to Xbox.
// Xbox A (bottom) → Switch B, B (right) → Switch A, X (left) → Switch Y, Y (top) → Switch X.
const SWITCH_STYLE = {
  a: mkFace('B', '#3a4555'),
  b: mkFace('A', '#3a4555'),
  x: mkFace('Y', '#3a4555'),
  y: mkFace('X', '#3a4555'),
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
  const Config = pbRoot.lookupType('Config');
  const msg = Config.fromObject(cfg);
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
    $('connect-icon').textContent = '✓';
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
  $('connect-icon').textContent = '⚡';
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
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
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

// Build a set of buttons that are remap targets but not also sources, i.e.
// buttons whose firmware default role has been "moved" to another physical
// position by the user. These should not display their default output.
function consumedTargets(profile) {
  const consumed = new Set();
  if (!profile?.buttonRemapping) return consumed;
  const sources = new Set(profile.buttonRemapping.map(r => r.physicalButton));
  for (const r of profile.buttonRemapping) {
    if (r.activates && r.activates !== 'BTN_UNSPECIFIED' && !sources.has(r.activates)) {
      consumed.add(r.activates);
    }
  }
  return consumed;
}

// Resolve the platform-agnostic output id for a physical button in the given profile.
// Returns null if the button has no output (unmapped, disabled, or consumed).
function resolveButtonOutput(physBtnId, profile, rmap, consumed) {
  if (!profile) return null;

  // Menu buttons (MB1-MB7) display whatever menuButtonIcon says.
  if (physBtnId.startsWith('BTN_MB')) {
    const mbIdx = parseInt(physBtnId.slice(6), 10) - 1;
    const outOpt = profile.menuButtonIcon?.[mbIdx];
    if (!outOpt || outOpt === 'OUT_UNSPECIFIED') return null;
    return OUTPUT_OPTION_TO_OUTPUT_ID[outOpt] || null;
  }

  // Main buttons: hide remap targets (their role moved elsewhere)
  if (consumed && consumed.has(physBtnId)) return null;

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
    applicableBackends: ['COMMS_BACKEND_XINPUT'],
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

  // Controller body
  const body = svgEl('rect', { x:1, y:1, width:138, height:70, rx:9, ry:9, class:'controller-body' });
  s.appendChild(body);

  // Render all buttons
  const profile = currentProfile();
  const rmap = remapMap(profile);
  const consumed = consumedTargets(profile);
  const platformStyle = PLATFORM_STYLES[selectedPlatform] || XBOX_STYLE;

  for (const btn of BUTTON_LAYOUT) {
    const outputId = resolveButtonOutput(btn.id, profile, rmap, consumed);
    const style = outputId ? platformStyle[outputId] : null;
    const isMapped = !!style;

    const classes = ['btn-group'];
    if (btn.large) classes.push('btn-large');
    if (btn.menu) classes.push('btn-menu');
    classes.push(isMapped ? 'mapped' : 'unmapped');
    if (btn.id === selectedBtnId) classes.push('selected');

    const g = svgEl('g', {
      class: classes.join(' '),
      'data-btn': btn.id,
      role: 'button',
      tabindex: '0',
      'aria-label': btn.id + (style ? ' → ' + style.label : '')
    });

    // Outer teal ring
    g.appendChild(svgEl('circle', { cx: btn.x, cy: btn.y, r: btn.r, class: 'btn-ring' }));

    // Base fill (dark background inside ring, or solid dark fill if unmapped)
    g.appendChild(svgEl('circle', { cx: btn.x, cy: btn.y, r: btn.r - 0.4, class: 'btn-fill' }));

    if (style) {
      renderButtonIcon(g, btn, style);
    }

    g.addEventListener('click', () => openButtonModal(btn.id));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openButtonModal(btn.id); });

    s.appendChild(g);
  }
}

// Render the platform-styled icon inside a button (colored disk + label).
function renderButtonIcon(g, btn, style) {
  const innerR = btn.r - 1;
  // Colored disk
  g.appendChild(svgEl('circle', {
    cx: btn.x, cy: btn.y, r: innerR,
    class: 'btn-icon-disk',
    fill: style.bg
  }));

  // Direction arrows are drawn as SVG arrows for dpad/stick/cstick
  if (style.kind === 'dpad' || style.kind === 'stick' || style.kind === 'cstick') {
    renderDirectionGlyph(g, btn, style);
    return;
  }

  // Otherwise, render the text label centered on the disk
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
  for (const b of BACKEND_IDS) {
    const checked = profile.applicableBackends?.includes(b);
    const lbl = document.createElement('label');
    lbl.className = 'checkbox-item';
    lbl.innerHTML = `<input type="checkbox" value="${b}"${checked ? ' checked' : ''}> ${b.replace('COMMS_BACKEND_', '')}`;
    lbl.querySelector('input').addEventListener('change', () => {
      if (!profile.applicableBackends) profile.applicableBackends = [];
      const val = lbl.querySelector('input').value;
      if (lbl.querySelector('input').checked) {
        if (!profile.applicableBackends.includes(val)) profile.applicableBackends.push(val);
      } else {
        profile.applicableBackends = profile.applicableBackends.filter(x => x !== val);
      }
    });
    beDiv.appendChild(lbl);
  }

  // Layout plate
  const lpSelect = $('set-layout-plate');
  lpSelect.innerHTML = '';
  for (const lp of LAYOUT_PLATES) {
    const opt = document.createElement('option');
    opt.value = lp;
    opt.textContent = lp.replace('LAYOUT_PLATE_', '');
    if (lp === profile.layoutPlate) opt.selected = true;
    lpSelect.appendChild(opt);
  }

  // SOCD pairs
  renderSocdList(profile);

  // Remap list
  renderRemapList(profile);
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
// Button assignment modal
// ---------------------------------------------------------------------------
function openButtonModal(btnId) {
  const btn = BUTTON_BY_ID[btnId];
  if (!btn) return;

  selectedBtnId = btnId;
  buildControllerSVG(); // re-render to highlight selected

  const profile = currentProfile();
  if (!profile) return;

  $('modal-physical').textContent = btnId.replace('BTN_', '');
  $('modal-title').textContent = 'Assign: ' + btnId.replace('BTN_', '');

  // Find current activates value
  const existing = profile.buttonRemapping?.find(r => r.physicalButton === btnId);
  const currentActivates = existing?.activates ?? 'BTN_UNSPECIFIED';

  const activatesSelect = $('modal-activates');
  activatesSelect.innerHTML = '';
  // Add "Default (no remap)" option
  const defOpt = document.createElement('option');
  defOpt.value = '__default__';
  defOpt.textContent = '— Default (remove remap entry) —';
  activatesSelect.appendChild(defOpt);

  for (const b of ALL_BUTTONS) {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b === 'BTN_UNSPECIFIED' ? 'Disabled (BTN_UNSPECIFIED)' : b.replace('BTN_', '');
    if (b === currentActivates && existing) opt.selected = true;
    activatesSelect.appendChild(opt);
  }
  if (!existing) defOpt.selected = true;

  $('modal-overlay').classList.remove('hidden');
}

function closeButtonModal() {
  $('modal-overlay').classList.add('hidden');
}

function applyButtonModal() {
  const profile = currentProfile();
  if (!profile) { closeButtonModal(); return; }

  const activates = $('modal-activates').value;
  if (!profile.buttonRemapping) profile.buttonRemapping = [];

  const existingIdx = profile.buttonRemapping.findIndex(r => r.physicalButton === selectedBtnId);

  if (activates === '__default__') {
    // Remove the remap entry if it exists
    if (existingIdx >= 0) profile.buttonRemapping.splice(existingIdx, 1);
  } else {
    if (existingIdx >= 0) {
      profile.buttonRemapping[existingIdx].activates = activates;
    } else {
      profile.buttonRemapping.push({ physicalButton: selectedBtnId, activates });
    }
  }

  closeButtonModal();
  renderAll();
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
    if (p) p.modeId = $('set-mode-id').value;
    renderProfileList();
  });

  $('set-layout-plate').addEventListener('change', () => {
    const p = currentProfile();
    if (p) p.layoutPlate = $('set-layout-plate').value;
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

  // Modal
  $('modal-close').addEventListener('click', closeButtonModal);
  $('modal-cancel').addEventListener('click', closeButtonModal);
  $('modal-ok').addEventListener('click', applyButtonModal);
  $('modal-overlay').addEventListener('click', e => { if (e.target === $('modal-overlay')) closeButtonModal(); });

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
// ---------------------------------------------------------------------------
const DEFAULT_CONFIG_JSON = JSON.stringify({"gameModeConfigs":[{"modeId":"MODE_MELEE","name":"Melee","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP_NO_REAC"}],"buttonRemapping":[],"rgbConfig":1,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_XINPUT","COMMS_BACKEND_DINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_PROJECT_M","name":"Brawl","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_2IP_NO_REAC"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP_NO_REAC"}],"buttonRemapping":[],"rgbConfig":2,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_XINPUT","COMMS_BACKEND_DINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_ULTIMATE","name":"Ultimate","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP"}],"buttonRemapping":[],"rgbConfig":3,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_XINPUT","COMMS_BACKEND_DINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_FGC","name":"Split FGC","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_LT1","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_RT1","activates":"BTN_LT1"},{"physicalButton":"BTN_LF5","activates":"BTN_LT2"},{"physicalButton":"BTN_RF9","activates":"BTN_RT1"}],"rgbConfig":4,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_XINPUT","COMMS_BACKEND_DINPUT","COMMS_BACKEND_NINTENDO_SWITCH"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_XB_START"]},{"modeId":"MODE_FGC","name":"FGC","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_LT1","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[{"physicalButton":"BTN_RF10","activates":"BTN_RF1"},{"physicalButton":"BTN_RF11","activates":"BTN_RF2"},{"physicalButton":"BTN_RF12","activates":"BTN_RF3"},{"physicalButton":"BTN_RF1","activates":"BTN_RF4"},{"physicalButton":"BTN_RF13","activates":"BTN_RF5"},{"physicalButton":"BTN_RF14","activates":"BTN_RF6"},{"physicalButton":"BTN_RF15","activates":"BTN_RF7"},{"physicalButton":"BTN_RF5","activates":"BTN_RF8"},{"physicalButton":"BTN_LF6","activates":"BTN_LF1"},{"physicalButton":"BTN_LF7","activates":"BTN_LF2"},{"physicalButton":"BTN_LF8","activates":"BTN_LF3"},{"physicalButton":"BTN_LT6","activates":"BTN_LT1"},{"physicalButton":"BTN_RF16","activates":"BTN_LT2"}],"rgbConfig":5,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_XINPUT","COMMS_BACKEND_DINPUT","COMMS_BACKEND_NINTENDO_SWITCH"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_XB_START"]},{"modeId":"MODE_64","name":"Smash64","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_NEUTRAL"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_NEUTRAL"}],"buttonRemapping":[],"rgbConfig":6,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_N64"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_START"]},{"modeId":"MODE_RIVALS_OF_AETHER","name":"RoA","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP"}],"buttonRemapping":[{"physicalButton":"BTN_RF7","activates":"BTN_LF7"},{"physicalButton":"BTN_RF8","activates":"BTN_LT6"}],"rgbConfig":7,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_XINPUT","COMMS_BACKEND_DINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]},{"modeId":"MODE_RIVALS2","name":"RoA2","socdPairs":[{"buttonDir1":"BTN_LF3","buttonDir2":"BTN_LF1","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_LF2","buttonDir2":"BTN_RF4","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT3","buttonDir2":"BTN_RT5","socdType":"SOCD_2IP"},{"buttonDir1":"BTN_RT2","buttonDir2":"BTN_RT4","socdType":"SOCD_2IP"}],"buttonRemapping":[{"physicalButton":"BTN_RF7","activates":"BTN_LF7"},{"physicalButton":"BTN_RF8","activates":"BTN_LT6"}],"rgbConfig":8,"layoutPlate":"LAYOUT_PLATE_EVERYTHING","applicableBackends":["COMMS_BACKEND_XINPUT","COMMS_BACKEND_DINPUT","COMMS_BACKEND_NINTENDO_SWITCH","COMMS_BACKEND_GAMECUBE"],"menuButtonIcon":["OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_UNSPECIFIED","OUT_HOME","OUT_XB_BACK","OUT_START"]}],"communicationBackendConfigs":[{"backendId":"COMMS_BACKEND_XINPUT","defaultModeConfig":1},{"backendId":"COMMS_BACKEND_NINTENDO_SWITCH","defaultModeConfig":1},{"backendId":"COMMS_BACKEND_DINPUT","defaultModeConfig":1},{"backendId":"COMMS_BACKEND_GAMECUBE","defaultModeConfig":1},{"backendId":"COMMS_BACKEND_N64","defaultModeConfig":6},{"backendId":"COMMS_BACKEND_CONFIGURATOR","activationBinding":["BTN_RT2"]}],"keyboardModes":[],"rgbConfigs":[],"defaultBackendConfig":1,"defaultUsbBackendConfig":1,"rgbBrightness":255,"defaultDashboardOption":"DASHBOARD_MENU_BUTTON_HINTS"});

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
