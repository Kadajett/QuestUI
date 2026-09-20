# Component catalog

QuestUI tracks the complete shadcn component catalog available on 2026-09-19: 64 source-copy compositions. `cli/catalog.ts` is the canonical machine-readable list. Every CLI name maps to `components/quest/<name>.tsx` and `public/r/quest-<name>.json`.

The **Astryx foundation** column identifies the semantic or interactive primitive beneath the Quest composition. `kbd`, `Direction`, native select, and SVG chart surfaces intentionally use their native platform elements where that is the correct semantic primitive.

| CLI name | Primary exports | Astryx foundation |
|---|---|---|
| `button` | `Button` | `Button` |
| `card` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | `Card` |
| `badge` | `Badge` | `Badge` |
| `separator` | `Separator` | `Divider` |
| `avatar` | `Avatar` | `Avatar` |
| `input` | `Input` | `TextInput` |
| `textarea` | `Textarea` | `TextArea` |
| `label` | `Label` | `Field` |
| `checkbox` | `Checkbox` | `CheckboxInput` |
| `radio-group` | `RadioGroup`, `RadioGroupItem` | `RadioList` |
| `switch` | `Switch` | `Switch` |
| `slider` | `Slider` | `Slider` |
| `select` | `Select` | `Selector` |
| `popover` | `Popover` | `Popover` |
| `calendar` | `Calendar` | `Calendar` |
| `combobox` | `Combobox` | `Selector` |
| `alert` | `Alert` | `Banner` |
| `tooltip` | `Tooltip` | `Tooltip` |
| `tabs` | `Tabs`, `Tab` | `TabList` |
| `dialog` | `Dialog` | `Dialog` |
| `progress` | `Progress` | `ProgressBar` |
| `skeleton` | `Skeleton` | `Skeleton` |
| `accordion` | `Accordion`, `AccordionItem` | `Collapsible` |
| `toast` | `Toast`, `ToastViewport`, `useToast` | `Toast` |
| `dropdown-menu` | `DropdownMenu` | `DropdownMenu` |
| `context-menu` | `ContextMenu` | `ContextMenu` |
| `hover-card` | `HoverCard` | `HoverCard` |
| `aspect-ratio` | `AspectRatio` | `AspectRatio` |
| `button-group` | `ButtonGroup` | `ButtonGroup` |
| `empty` | `Empty` | `EmptyState` |
| `item` | `Item` | `Item` |
| `kbd` | `Kbd` | native `kbd` |
| `typography` | `Typography`, `TypographyHeading`, `TypographyList`, `TypographyCode` | `Text` |
| `direction` | `Direction` | native direction boundary |
| `spinner` | `Spinner` | `Spinner` |
| `breadcrumb` | `Breadcrumb`, `BreadcrumbItem` | `Breadcrumbs` |
| `pagination` | `Pagination` | `Pagination` |
| `scroll-area` | `ScrollArea` | `ScrollableArea` |
| `sidebar` | `Sidebar`, `SidebarItem`, `SidebarSection`, `SidebarHeading`, `SidebarCollapseButton`, `SidebarMobile` | `SideNav` |
| `navigation-menu` | `NavigationMenu`, `NavigationMenuLink`, `NavigationMenuItem` | `TopNav` |
| `alert-dialog` | `AlertDialog` | `AlertDialog` |
| `sheet` | `Sheet` | `Dialog` |
| `drawer` | `Drawer` | `BottomSheet` |
| `collapsible` | `Collapsible` | `Collapsible` |
| `command` | `Command`, `CommandInput`, `CommandFooter` | `CommandPalette` |
| `menubar` | `Menubar`, `MenubarMenu` | `Toolbar` |
| `field` | `Field` | `Field` |
| `input-group` | `InputGroup`, `InputGroupText`, `InputGroupInput` | `InputGroup` |
| `native-select` | `NativeSelect` | `Field` + native `select` |
| `input-otp` | `InputOTP` | `Field` |
| `toggle` | `Toggle` | `ToggleButton` |
| `toggle-group` | `ToggleGroup`, `ToggleGroupItem` | `ToggleButtonGroup` |
| `date-picker` | `DatePicker` | `DateInput` |
| `table` | `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableCell`, `TableHead`, `TableCaption` | `Table` |
| `data-table` | `DataTable` | `Table` |
| `carousel` | `Carousel` | `Carousel` |
| `chart` | `Chart` | accessible SVG + Astryx layout |
| `resizable` | `ResizablePanel`, `ResizableHandle`, `Resizable` | `Resizable` |
| `attachment` | `Attachment`, `AttachmentInput`, `AttachmentGroup` | `Item` |
| `bubble` | `Bubble`, `BubbleGroup` | `Chat` |
| `marker` | `Marker` | `Text` |
| `message` | `Message`, `MessageAvatar`, `MessageGroup`, `MessageContent`, `MessageHeader`, `MessageFooter` | `Chat` |
| `message-scroller` | `MessageScroller` | `Chat` |
| `questionnaire` | `Questionnaire` | `RadioList` |

## Delivery contract

- CLI slug: `separator`
- Source path: `components/quest/separator.tsx`
- Registry item: `public/r/quest-separator.json`
- Consumer path after the default init: `src/components/quest/separator.tsx`

The same transformation applies to every row. Registry items include the transitive Quest source/style closure, bundled font data, OFL licenses, Astryx license notice, runtime dependencies, and the StyleX compiler dependency.

## Regenerating artifacts

```sh
npm run registry
```

The generator removes stale `quest-*.json` entries before writing the current catalog. Do not hand-edit `public/r`.
