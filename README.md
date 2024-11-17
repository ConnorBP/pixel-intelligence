# pixel-intelligence

Pixel art editor with generative AI functionality. Comp229 Group Project.

**Group Members:**

- Connor _"ConnorBP"_ Postma
- Yoon "superYM222" Min
- Sanjeevkumar "sanjeev-cs" Chauhan
- Parmila "Parmilashams" Shams

# Design / Wireframes

mockup can be viewed here: https://www.figma.com/design/MgBOfcN73AzYPKFxObLKvs/Pixel-Editor-Concept?node-id=0-1&t=L3mJyJCMEhV7dZpK-1
Gallery Page: https://www.figma.com/design/7c2ijnyfajgfeeMJjpeS9j/Comp_229_Project?node-id=0-1&t=HFC8hwDvlPgtngwJ-1
Share Screen: https://www.figma.com/design/7c2ijnyfajgfeeMJjpeS9j/Comp_229_Project?node-id=20-30&t=HFC8hwDvlPgtngwJ-1
Color Selector Popup: https://www.figma.com/design/7c2ijnyfajgfeeMJjpeS9j/Comp_229_Project?node-id=20-2&t=HFC8hwDvlPgtngwJ-1

designs todo:

- [ ] create new image prompt screen (overlay)
- [x] share options prompt screen (overlay)
- [ ] save options screen (overlay)
- [ ] top-left context menu actions
- [x] color selector popup
- [ ] deletion confirmation popup
- [x] gallery page
- [ ] (Maybe) landing page
- [ ] (Maybe) color pallets menu

![first mockup](./docs/mockupv1.svg)
_first wireframe mockup of the pixel editor concept_

![Gallery Page](./docs/Gallery%20Page.svg)
![Share Screen](./docs/Share%20Screen.svg)
![Color Selector PopUp](./docs/Color%20Selector%20Screen.svg)

# Functional Requirements

## Required Features

The application must:

- have a maximum canvas size of 64px by 64px
- have a minimum canvas size of 8px by 8px
- allow users to select a resolution for their pixel art image on start
- load with a sensible default canvas size initially
- allow a prompt to generate an image on canvas creation
- store all editor state (especially pixels) on page reload using local storage
- allow the user to download a png copy of the image
- have drawing tools including: pencil, eraser, clear, eyedropper, and fill-bucket
- have a color selection tool with primary color, secondary color, and a swap button

## Strech Goals

- Crochet pattern export
- encoded url share codes for pixel art (could use RLE encoding format by ConnorBP)
- gallery with shared creations stored on server (maybe s3 bucket)
- extended color palete presets
- additional file export formats (popular sprite editor formats, json, webp, etc)
- login page (user login system)

## User Stories and Use Cases

### User Stories

- TODO

### Use Cases

- TODO
