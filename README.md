<h1 align="center">
  <img src="https://ik.imagekit.io/lyseste/glyph-remapper/glyph-remapper-logo.png?updatedAt=1779998874001" alt="Open Glyph Remapper Logo" height="100">
</h1>

<p align="center">
  A browser-based configurator for the <strong>Glyph</strong> leverless game controller by <a href="https://limitlabs.com/">Limit Labs</a>. <br>
  Edit profiles, customize per-button RGB, configure SOCD, and flash configs to the device over WebSerial.
</p>

---

## Table of contents

1. [Quick start](#quick-start)
2. [Features](#features)
3. [Project layout](#project-layout)
4. [How the app talks to the device](#how-the-app-talks-to-the-device)
5. [Data model](#data-model)
6. [Mode system](#mode-system)
7. [Contributing](#contributing)

---

## Quick start

### Hosted version

If you just want to use the app, an always-up-to-date build is hosted at:

> **<https://lyseste.com/glyph-remapper/>**

Open it in a browser that supports WebSerial and skip to **[Connecting to the device](#connecting-to-the-device)** below.

### Requirements

- WebSerial only works on `https://` origins **or** `http://localhost`. A static file server is fine for local dev.

### Run locally

```bash
# from the repo root (where index.html lives)
npx serve -p 5500
```

Then open <http://localhost:5500/>

Any static file server works e.g. `python -m http.server 5500`, the VS Code "Live Server" extension, etc. The only constraint is that the origin needs to be `https://` or `http://localhost` for WebSerial to function.

### Connecting to the device

1. Hold **RT2** while plugging the Glyph into USB to put it in Configurator mode, or open the Glyph menu and go to configuration.
2. Click **Connect** in the toolbar and select the Glyph serial port.
3. **Load Config** reads the current profiles off the device.
4. Make your changes, then **Save to Device** writes the new config back to the device.

You can also work entirely offline using the **Config File** ⬇ / ⬆ buttons to export/import JSON. The JSON format is compatible with the official LimitLabs configurator.

---

## Project layout

`app.js` is structured top-to-bottom roughly like this:

1. `PROTO_DEF` — inline protobuf schema (`GregTurbo/HayBox-proto#db4e2f6`)
2. `BUTTON_LAYOUT` — physical button positions in the controller SVG (viewBox `912 × 491`)
3. `PLATFORM_STYLES` (Xbox / PS / Switch / GameCube) + `MODE_OUTPUT_MAP` with per-mode mappings
4. HID keycode tables + keyboard helpers
5. RGB / LED helpers (`ensureRgbConfig`, `getButtonColor`, `setButtonColor`, `stripDisabledLeds`, …)
6. Button-remap helpers (`remapMap`, `resolveLogicalButton`, `resolveButtonOutput`, `findPhysicalButtonForOutput`, `preserveOutputsAcrossModeChange`, …)
7. WebSerial I/O (`serialConnect`, `sendPacket`, `readPacket`, `loadConfigFromDevice`, `saveConfigToDevice`)
8. protobuf encode/decode (`configToBinary`, `binaryToConfig`)
9. SVG render loop (`buildControllerSVG`) + `renderButtonIcon` and glyph builders
10. Popup logic (`openOutputPopup`, `applyOutput`, `unmapSelected`, key-capture, color controls)
11. Sidebar + settings panel rendering and event wiring
12. `DEFAULT_CONFIG_JSON` with an embedded "Load Defaults" payload, mirrors the official Limit Labs default profile set
13. `DOMContentLoaded` boot

---

## External references (not in this repo)

This repo only contains the configurator. The firmware and protobuf schema live in their own projects — you don't need either to run the app, but you'll want them when adding new modes or backends:

| What | Where | Why you'd need it |
|------|-------|--------------------|
| **Glyph firmware** | <https://github.com/LimitLabs/FW-Glyph> | Each mode file in `src/modes/` (e.g. `Ultimate.cpp`, `FgcMode.cpp`, `RivalsOfAether.cpp`) tells you exactly which physical button fires which output — the source used for `MODE_OUTPUT_MAP`. |
| **Protobuf schema** | <https://github.com/GregTurbo/HayBox-proto> | Defines the `Config` message format we send to the device. The schema is embedded inline in `app.js` as `PROTO_DEF`; refer back to the canonical `.proto` whenever you add or rename fields. |
| **HayBox** | <https://github.com/JonnyHaystack/HayBox> | The base controller-firmware framework the Glyph builds on, in case you want to understand how modes/backends/inputs are wired together at the framework level. |

Throughout this README, line numbers like `Ultimate.cpp:24` refer to files in the firmware repo above.

---

## How the app talks to the device

The Glyph (RP2040, USB VID/PID `0x2E8A:0x1092`, baud `115200`) speaks a small request/response protocol on a USB CDC serial endpoint. Each packet is:

```
[1 byte command id] [N bytes protobuf body]
↑                   ↑
└─ from `Command`   └─ optional, schema-dependent
   enum in PROTO_DEF
```

Packets are wrapped in **COBS framing** (Consistent Overhead Byte Stuffing) terminated by `0x00`, which lets the firmware unambiguously locate packet boundaries on the byte stream. Both ends use [`eric-wieser/PacketIO`](https://github.com/eric-wieser/PacketIO) (the firmware) and a small JS COBS encoder/decoder in `app.js`.

### Commands

| Id | Name | Direction | Body |
|----|------|-----------|------|
| 1  | `CMD_GET_DEVICE_INFO` | host → device | none |
| 2  | `CMD_SET_DEVICE_INFO` | host → device | `DeviceInfo` proto |
| 3  | `CMD_GET_CONFIG` | host → device | none |
| 4  | `CMD_SET_CONFIG` | both ways | full `Config` proto |
| 5  | `CMD_ERROR` | device → host | UTF-8 error string |
| 6  | `CMD_SUCCESS` | device → host | none |
| 7  | `CMD_REBOOT_FIRMWARE` | host → device | none |
| 8  | `CMD_REBOOT_BOOTLOADER` | host → device | none |

### Load / save flow

- **Load Config**: host sends `CMD_GET_CONFIG`. Device replies with a `CMD_SET_CONFIG` packet containing the full `Config` proto. `binaryToConfig` decodes it; the UI re-renders.
- **Save to Device**: host calls `configToBinary(config)` to serialise, then sends `CMD_SET_CONFIG` + the binary. Device replies with `CMD_SUCCESS` or `CMD_ERROR <message>`.

### protobuf

The schema is embedded inline in `app.js` as the `PROTO_DEF` string. The host uses [`protobuf.js`](https://github.com/protobufjs/protobuf.js) loaded lazily from CDN on the first WebSerial call. This avoids a build step entirely. Field-name camelCasing (`buttonColors`, `rgbConfig`, `keyboardModeConfig`) matches what `protobuf.js` produces from the proto's snake_case.

---

## Data model

Everything mirrors the firmware's protobuf `Config` message (defined in [GregTurbo/HayBox-proto `config.proto`](https://github.com/GregTurbo/HayBox-proto)). Stored at runtime in the top-level JS variable `config`. The JSON shape is identical, so JSON exports / imports / device transfers are all the same structure.

```
Config
├── gameModeConfigs[]                 ← profiles
│   └── GameModeConfig
│       ├── modeId                    ← MODE_MELEE / MODE_FGC / MODE_KEYBOARD / …
│       ├── name
│       ├── socdPairs[]               ← per-profile SOCD rules
│       ├── buttonRemapping[]         ← physical button → logical button (bypassed by keyboard mode)
│       ├── applicableBackends[]      ← COMMS_BACKEND_* strings
│       ├── menuButtonIcon[7]         ← MB1..MB7 icons (display-only; firmware MB→output mapping is fixed)
│       ├── rgbConfig                 ← 1-based index into Config.rgbConfigs[]
│       └── keyboardModeConfig        ← 1-based index into Config.keyboardModes[] (KEYBOARD only)
│
├── rgbConfigs[]                      ← LED palettes, shared by index
│   └── RgbConfig
│       ├── buttonColors[]            ← { button: 'BTN_X', color: 0xRRGGBB (uint32) }
│       ├── defaultColor              ← uint32 (fallback color, defaults to 0x22D3EE)
│       ├── animation                 ← RGB_ANIM_STATIC | RAINBOW_SHIFT | RAINBOW_XWAVE_LEFT | UNSPECIFIED
│       └── speed
│
├── keyboardModes[]                   ← keyboard layouts, shared by index
│   └── KeyboardModeConfig
│       └── buttonsToKeycodes[]       ← { button: 'BTN_X', keycode: <USB HID scancode> }
│
├── communicationBackendConfigs[]
├── rgbBrightness                     ← uint32 0-255
└── defaultBackendConfig / defaultUsbBackendConfig / defaultDashboardOption
```

### Important pitfalls

- **`rgbConfig` and `keyboardModeConfig` are 1-based.** Value `0` means "unset"; index into the array is `value − 1`. Helpers `ensureRgbConfig()` / `ensureKeyboardConfig()` always pad with valid blank objects (never `null`) so protobuf encoding can't fail.
- **Multiple profiles can share an `rgbConfig` index.** Editing one currently edits the other's palette too. Copy-on-write is a future cleanup.
- **Color values are packed uint32** in `0xRRGGBB` form. `colorIntToHex` / `parseHexInput` convert.
- **Explicit disables** are remap entries with no `activates` field (`{physicalButton: 'BTN_X'}`). This is how the official defaults mark unused buttons; the firmware treats them as no-op.

---

## Mode system

Each mode interprets the physical buttons differently. The app captures this in `MODE_OUTPUT_MAP`, which maps `modeId → { physicalButton → outputId }`.

| Mode | Map | Notes |
|------|-----|-------|
| `MODE_MELEE` | `MELEE_MAP` | Direct D-pad on LT6/LF7/LF8/LF6; RF7 = light shield (analog R 49); RF8 = mid shield (analog R 94). |
| `MODE_PROJECT_M` | `PROJECT_M_MAP` | Same as `PLATFORM_FIGHTER_MAP` + RF9 acts as light shield. |
| `MODE_ULTIMATE` | `PLATFORM_FIGHTER_MAP` | Base layout: A=RT1, B=RF1, X=RF2, Y=RF6, RB=RF3, LT=LF4, RT=RF5, D-pad on RF8/RF7/LF8/LF6. |
| `MODE_RIVALS_OF_AETHER` | `ROA_MAP` | PFM + RF9 fires `buttonL` (LB on XInput). |
| `MODE_RIVALS2` | `ROA2_MAP` | PFM + LT5 fires `buttonL`. |
| `MODE_FGC` | `FGC_MAP` | Digital D-pad on LF1/LF2/LF3/LT1; face buttons on RF1-8; L-stick directions on LF8/LF6/LF7/LT6; C-stick on RT2-5. |
| `MODE_64` | `SMASH64_MAP` | Smash 64 C-pad on RF7/RF8/RF2/RF6 instead of the RT cluster. |
| `MODE_KEYBOARD` | (none) | Each physical button fires a USB HID scancode from `KeyboardModeConfig.buttonsToKeycodes`; `buttonRemapping` is bypassed by the firmware. |

### How the popup actually creates a remap

The data model only knows about **physical → physical** remappings (`ButtonRemap.activates`). When the user picks an output (e.g. "D-Down") for `BTN_RF10`, the popup:

1. Calls `findPhysicalButtonForOutput('ddown', profile.modeId)` to find which physical button **natively** produces that output in the current mode (`BTN_RF7` in Ultimate, `BTN_LF2` in FGC, …).
2. Stores `{physicalButton: 'BTN_RF10', activates: 'BTN_RF7'}`.

This is why **`preserveOutputsAcrossModeChange()`** exists — when the mode changes, every entry's `activates` is rewritten to whichever button natively produces the same output in the new mode, so the user's bindings stay semantically identical. Outputs that don't exist in the new mode (e.g. the platform-fighter `mx`/`my` modifiers going into FGC) get the button explicitly disabled.

### Menu buttons (MB1 – MB7)

| Button | UI behavior | Firmware behavior |
|--------|--------------|--------------------|
| **MB1** | Not remappable. Popup shows only the LED color picker. Ring is always visible. | Hardware-reserved menu button (opens device menu). Has a physical LED. |
| **MB2 – MB7** | Remappable via the popup (saved to `menuButtonIcon[i]`, not `buttonRemapping`). LED row hidden — these buttons have **no physical LED** on the device. | Icons MB4 = capture, MB5 = home, MB6 = select/back, MB7 = start are hardcoded in every controller mode (`Ultimate.cpp` line 24 etc.), regardless of what `menuButtonIcon` says. `menuButtonIcon` only affects what icon the configurator renders. |

`stripDisabledLeds()` filters out any color entries for MB2-7 before binary encoding and JSON export, so imported configs can't accidentally leak LED data for buttons that have no LED.

### Keyboard mode specifics

- The popup swaps the output-glyph grid for a **"click then press a key"** capture box. The page listens for `keydown` and converts `event.code` → HID scancode using `EVENT_CODE_TO_HID` (USB HID Usage Page `0x07`).
- `Escape` cancels capture without binding (so the user can always escape the capture state).
- The firmware bypasses `buttonRemapping` (see `CustomKeyboardMode.cpp`); the host follows the same convention.
- Backends section is hidden because **only the DInput backend emits HID keyboard reports**. Switching into keyboard mode forces `applicableBackends = ['COMMS_BACKEND_DINPUT']`; switching out restores the USB triplet. Non-keyboard ↔ non-keyboard transitions don't touch the backend list.

---

## Contributing

### Adding a new game mode

1. **Read the firmware mode file** in [`FW-Glyph/src/modes/`](https://github.com/LimitLabs/FW-Glyph) (e.g. `Ultimate.cpp`, `FgcMode.cpp`) to figure out which physical button fires which output.
2. **Add a `<MODE>_MAP` constant** in `app.js`, e.g.:
   ```js
   const NEW_MODE_MAP = {
     ...PLATFORM_FIGHTER_MAP,
     BTN_RF8: 'rt_light',
   };
   ```
3. **Register it** in `MODE_OUTPUT_MAP`:
   ```js
   const MODE_OUTPUT_MAP = {
     ...
     MODE_NEW: NEW_MODE_MAP,
   };
   ```
4. Make sure the `modeId` value is in `GAME_MODE_IDS` (used for the dropdown).

### Adding a new platform display style

1. Define a `<PLATFORM>_STYLE` object with entries for every output id (`a`, `b`, `x`, `y`, `lb`, …, `dup`, …, `lsl`, …, `csu`, …, `mx`, `my`, `rt_light`, `rt_mid`). The helpers `mkFace`, `mkShoulder`, `mkSystem`, `mkDpad`, `mkStick`, `mkMod`, `mkFaceGlyph` cover the common patterns.
2. Add it to `PLATFORM_STYLES`.
3. Add a tab in `index.html` (`<button class="platform-tab" data-platform="<name>">`).
4. If you want platform-specific Kenney SVG icons, add entries to the `_SVG_BY_PLATFORM` map.

### Adding a new backend

1. Make sure the backend's enum value is in `PROTO_DEF`'s `CommunicationBackendId`.
2. Decide whether it's a standalone choice or part of a group (USB-style).
3. Add to `BACKEND_CHOICES`. The renderer handles both `string` and `{id, label, members}` forms.
4. If the backend needs a forced display style (like GameCube does), wire it into `updateGcTab()` / `selectedPlatform`.

### Testing protobuf round-trips

When touching anything that mutates `config.rgbConfigs`, `config.keyboardModes`, `config.gameModeConfigs`, or any encoding helper, run this in the browser dev console:

```js
const ok = await ensureProtobuf();
const bytes = configToBinary(config);
const decoded = binaryToConfig(bytes);
JSON.stringify(decoded.gameModeConfigs[0]);  // compare to JSON.stringify(config.gameModeConfigs[0])
```

Things that bite during encoding:

- `null` entries in `rgbConfigs[]` or `keyboardModes[]` — `protobuf.js` rejects them. Always pad with blank objects, never `null`.
- Enum values must be **strings** (`'RGB_ANIM_STATIC'`, `'BTN_LF1'`) — the decoder is called with `{ enums: String }`.
- Color values are packed `uint32` in `0xRRGGBB`.

### Verifying behavior without a device

Most of the app works fine without a Glyph plugged in — load defaults, edit, export JSON, re-import, mode-switch, etc. The only paths that require WebSerial are **Connect**, **Load Config**, and **Save to Device**.

---

## Acknowledgements

- [Limit Labs](https://limitlabs.com/) — designers of the Glyph hardware and firmware.
- [JonnyHaystack/HayBox](https://github.com/JonnyHaystack/HayBox) — the controller firmware framework the Glyph is built on.
- [GregTurbo/HayBox-proto](https://github.com/GregTurbo/HayBox-proto) — the configurator protobuf schema fork the Glyph uses.
- [eric-wieser/PacketIO](https://github.com/eric-wieser/PacketIO) — the COBS framing library on the firmware side.
- [Kenney](https://kenney.nl/) — gamepad button icons used in the controller display.

---

## License

See [`LICENSE`](LICENSE).
