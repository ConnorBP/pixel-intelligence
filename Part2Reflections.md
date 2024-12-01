# Group 21 Part 2 Submission
## Pixel Intelligence
    A Pixel Art Editor with generative AI functionality, image downscale processing, image export, and a showcase gallery. Comp229 Group Project (Fall 2024).

###  **Group Members:**

 - Connor *"[ConnorBP](https://github.com/ConnorBP)"* Postma (301005412)
 - Yoon "[superYM222](https://github.com/superYM222)" Min (301317593)
 - Sanjeevkumar "[sanjeev-cs](https://github.com/sanjeev-cs)" Chauhan (301480021)
 - Parmila "[Parmilashams](https://github.com/Parmilashams)" Shams (301426195)

## [Issue Tracker](\> Latest live demo can be viewed on [Netlify](https://229-pixelai.netlify.app))

> View the past and current tasks on our [Github](https://229-pixelai.netlify.app).

## [Live Demo](https://229-pixelai.netlify.app)
> Latest live demo can be viewed on [Netlify](https://229-pixelai.netlify.app).







*See next page for reflections document*







# Group 21 --- Reflection

###### Changes Made to Original Requirements

- **Save Feature Removal**: The autosave functionality in the editor eliminates the need for a manual save button. This has been repurposed to allow users to download their work as JSON or export it as an image format.
- **Color Picker Update**: The original concept for the color picker was revised, resulting in a more efficient implementation.
- **Gallery Layout Redesign**: The gallery page's layout was overhauled to enhance usability and visual appeal.

###### Challenges Faced

- **Git Conflicts**: Merging contributions from the team occasionally caused conflicts, requiring collaborative resolution.
- **Component Communication**: Passing props and managing routes in the gallery posed challenges, especially with overlays.
- **Styling**: Designing and implementing UI components (e.g., ColorPickerToolbar, popups) within strict styling requirements proved complex.
- **Custom Features**: Issues like handling `onChange` in the custom color picker and integrating features like canvas size selection required debugging and iterative improvement.

###### Current Progress

- **Frontend**: The baseline structure and key components (color selection, canvas rendering, local storage, gallery grid, and popups) are complete and functional using test data.
- **Gallery**: Dynamic grid implemented with basic functionality for sharing and downloading images.
- **Popups**: Core features like naming, canvas sizing, and initial styling are operational, though further refinements (e.g., image previews) are ongoing.
- **Backend**: TODO

###### Division of Work

- **Connor**: Oversaw task distribution, handled GitHub issues, worked on core editor functionality, and initiated design changes like autosave and JSON downloads.
- **Sanjeev**: Focused on gallery design and functionality, including layout redesign, data flow improvements, and route management for overlays.
- **SuperYM222**: Worked on Menu, ColorPickerToolbar, and ConfirmationPopup components, addressing UI and functionality challenges.
- **Parmilashams**: Designed and implemented popups for creating and saving images, ensuring pixel-art styling, and contributed to gallery styling.

###### Next Steps

1. Implement gallery database and image hosting infrastructure.
2. Extend with core features such as generative AI, pixel-art downscaling, and enhanced editor tools.
3. Refine UX with additional styling and responsive design.
4. Pursue stretch goal improvements such as:
   - Clone-to-editor functionality from the gallery.
   - Extended gallery metadata (authors, descriptions, etc.).
   - downscaling projects support.

# Extended Personal Reflections (Optional)

### ConnorBP

​	We have been making use of the Github open source collaboration tools to disperse tasks. The modular nature of React has allowed us to break up most of the initial tasks into specific components from the Figma designs to start out. Even with this separation, merge conflicts inevitably arose. Helping out with resolving our git troubles has been somewhat of a challenge, but I'll take that over google docs any day.  We have currently completed the baseline structure for the frontend, established the primary components required for a functioning editor (Color selection, image data handling and storage, autosave and persistence, efficient canvas based rendering, various stylish popups for user prompts and menus, and initial toolbars). We also have the core functionality of the gallery page implemented with a nice dynamic grid, and a popup with the option to share and download images from the gallery when you click on one. Currently the data backing for this frontend is test data however as the backend upload system has not been our focus in this first stage. Some minor adjustments have been made to our design plans: While working on the editor's local storage data management I realized that every single change can be automatically saved as you do it. This negates the need for a save feature, so this will be removed or simply become the "download" feature. We will let users download the json canvas document, which they can later load, or export as a popular image format. We decided to go a different direction for the color picker than our original concept and it is working great. Next up for our roadmap is: Gallery database and image hosting infrastructure, generative ai usage, pixel-art specific downscaling algorithm, editor tooling improvements, and styling + UX improvements.

Added stretch goals: **Canvas resize-support** (Allow changing canvas size on existing drawing with downscale, upscale, centered, etc.). **Palletized export modes and RLE** (Quantize to the closest colour from a small subset for small color pallet usage and special encoding options). **Clone to editor from gallery mode** (allow user to choose a gallery image as a starting point, and keep track of author history). **Extended details on gallery listings** (authors, description, starting image, etc). **Import image** and downscale it to canvas.

### sanjeev-cs
​	As we worked on the Pixel Intelligence project, everything is going according to the initial planning. However, I changed the layout of the gallery page. The original design wasn’t as user-friendly as we wanted, so I decided to change it to something that looks better and works more smoothly. This new layout makes the page more visually appealing and easier to use.

​	While working on the gallery, I faced a few challenges. One issue was figuring out how to pass props from parent components to child components properly. It took some time to understand the flow of data and adjust the code so everything worked correctly. Another challenge was setting up the routes for the image detail overlay window. It was tricky to make sure the overlay opened and closed without affecting the rest of the gallery, but after some problem-solving, it worked as expected.

​	Right now, the project is moving along well. Our progress has been good. Connor helped a lot by creating detailed GitHub issues for each task and dividing the work among the team. This made it easier for everyone to stay focused and know what to do next. Overall, we’ve made some changes along the way, but the project is going well.

### superYM222

​	Connor announced the issues, we can choose the tasks.
I decided to Menu, ColorPickerToolbar, ConfirmationPopup parts and focused to following the initially designed UI and use cases. Firstly, Menu part, when user click menu button, it's toggle menu. However, I faced challenges two parts  ColorPickerToolbar , and custom colour picker part.  The CSS for the ColorPickerToolbar part was challenging. I needed to adjust it within the div box, but it wasn’t as easy as I expected. Moreover, There is an error in the onChange part of the custom color picker, and I am still working on resolving it.

### Parmilashams

​	The project has been progressing well. We are all doing our best to implement the key features of the project. Connor announced the issues we needed to address, and everyone could choose the tasks they wanted to work on. I chose to work on designing and coding on frontend on the "Create New Image" and "Save Image" popups. These popups are an important part of the user interface, allowing users to name and describe their images and select canvas sizes.
One of the challenges I faced was to make sure the design and functionality of the popups fit well with the overall theme of the project. I tried to ensure everything matched the pixel-art style while remaining user-friendly was not easy. However, it was interesting work, I enjoyed creating features like the canvas size selection and input fields. Currently, the popups are functional, but some features still need improvement, such as the image preview, which is not yet fully working. I will continue to work on this and collaborate with team members to ensure the popups integrate smoothly with the generative AI functionality and the gallery view. I am also working on styling the gallery to make it visually appealing and user-friendly, with a clean layout and responsive design that fits the overall theme of the project.
