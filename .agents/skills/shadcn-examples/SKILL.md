---
name: shadcn-examples
description: >-
  Official shadcn/ui usage examples for registry components, charts, and
  blocks. Use when composing UI, looking up component API patterns, building
  forms, charts, sidebars, login/signup pages, or needing copy-pasteable
  reference code for any shadcn registry item.
---

# shadcn/ui Examples

Copy-pasteable usage examples from the official `new-york-v4` registry.
**Read only the matching file below — never load the entire skill tree.**

## Workflow

1. Identify the component, composite, chart family, or block you need.
2. Open the linked file in this skill.
3. Adapt imports to this project (`@/components/ui`, `@/lib/utils`, `@/hooks`).
4. Follow project shadcn rules: `FieldGroup`/`Field`, `gap-*` (not `space-y-*`), `data-icon` on button icons. See [`../shadcn/SKILL.md`](../shadcn/SKILL.md).

## Import rewrite

Examples are already rewritten for this project:

| Registry path | Project alias |
| --- | --- |
| `@/registry/new-york-v4/ui/...` | `@/components/ui/...` |
| `@/registry/new-york-v4/hooks/...` | `@/hooks/...` |
| `@/registry/new-york-v4/lib/...` | `@/lib/...` |
| `from "cn"` | `from "@/lib/utils"` |

## Components & composites

- [`accordion`](examples/accordion.md)
- [`alert`](examples/alert.md)
- [`alert-dialog`](examples/alert-dialog.md)
- [`aspect-ratio`](examples/aspect-ratio.md)
- [`avatar`](examples/avatar.md)
- [`badge`](examples/badge.md)
- [`breadcrumb`](examples/breadcrumb.md)
- [`button`](examples/button.md)
- [`button-group`](examples/button-group.md)
- [`calendar`](examples/calendar.md)
- [`card`](examples/card.md)
- [`carousel`](examples/carousel.md)
- [`chart`](examples/chart.md)
- [`checkbox`](examples/checkbox.md)
- [`collapsible`](examples/collapsible.md)
- [`combobox`](examples/combobox.md)
- [`command`](examples/command.md)
- [`context-menu`](examples/context-menu.md)
- [`data-table`](examples/data-table.md)
- [`date-picker`](examples/date-picker.md)
- [`dialog`](examples/dialog.md)
- [`drawer`](examples/drawer.md)
- [`dropdown-menu`](examples/dropdown-menu.md)
- [`empty`](examples/empty.md)
- [`field`](examples/field.md)
- [`forms`](examples/forms.md)
- [`hover-card`](examples/hover-card.md)
- [`input`](examples/input.md)
- [`input-group`](examples/input-group.md)
- [`input-otp`](examples/input-otp.md)
- [`item`](examples/item.md)
- [`kbd`](examples/kbd.md)
- [`label`](examples/label.md)
- [`menubar`](examples/menubar.md)
- [`mode-toggle`](examples/mode-toggle.md)
- [`native-select`](examples/native-select.md)
- [`navigation-menu`](examples/navigation-menu.md)
- [`pagination`](examples/pagination.md)
- [`popover`](examples/popover.md)
- [`progress`](examples/progress.md)
- [`radio-group`](examples/radio-group.md)
- [`resizable`](examples/resizable.md)
- [`scroll-area`](examples/scroll-area.md)
- [`select`](examples/select.md)
- [`separator`](examples/separator.md)
- [`sheet`](examples/sheet.md)
- [`skeleton`](examples/skeleton.md)
- [`slider`](examples/slider.md)
- [`sonner`](examples/sonner.md)
- [`spinner`](examples/spinner.md)
- [`switch`](examples/switch.md)
- [`table`](examples/table.md)
- [`tabs`](examples/tabs.md)
- [`textarea`](examples/textarea.md)
- [`toggle`](examples/toggle.md)
- [`toggle-group`](examples/toggle-group.md)
- [`tooltip`](examples/tooltip.md)
- [`typography`](examples/typography.md)

## Charts

- [`area`](charts/area.md)
- [`bar`](charts/bar.md)
- [`line`](charts/line.md)
- [`pie`](charts/pie.md)
- [`radar`](charts/radar.md)
- [`radial`](charts/radial.md)
- [`tooltip`](charts/tooltip.md)

## Blocks

- [`dashboard-01`](blocks/dashboard-01.md)
- [`login`](blocks/login.md)
- [`sidebar-01`](blocks/sidebar-01.md)
- [`sidebar-02`](blocks/sidebar-02.md)
- [`sidebar-03`](blocks/sidebar-03.md)
- [`sidebar-04`](blocks/sidebar-04.md)
- [`sidebar-05`](blocks/sidebar-05.md)
- [`sidebar-06`](blocks/sidebar-06.md)
- [`sidebar-07`](blocks/sidebar-07.md)
- [`sidebar-08`](blocks/sidebar-08.md)
- [`sidebar-09`](blocks/sidebar-09.md)
- [`sidebar-10`](blocks/sidebar-10.md)
- [`sidebar-11`](blocks/sidebar-11.md)
- [`sidebar-12`](blocks/sidebar-12.md)
- [`sidebar-13`](blocks/sidebar-13.md)
- [`sidebar-14`](blocks/sidebar-14.md)
- [`sidebar-15`](blocks/sidebar-15.md)
- [`sidebar-16`](blocks/sidebar-16.md)
- [`signup`](blocks/signup.md)

## Gaps (no `registry:example`)

| Item | Where to look |
| --- | --- |
| `attachment`, `bubble`, `marker`, `message`, `message-scroller` | [`../shadcn/rules/chat.md`](../shadcn/rules/chat.md) |
| `direction` | No official example yet — use the installed component source |
| `toast` / `toast-*` | Deprecated — use [`sonner`](examples/sonner.md) |
| `sidebar` UI primitive | See [blocks](#blocks) (`sidebar-01`…`sidebar-16`) and `dashboard-01` |

## Regenerating

From this skill directory (requires the local `ui` repo):

```bash
node scripts/generate.mjs /path/to/ui/apps/v4/registry/new-york-v4
```
