# Image Background Remover

## Overview
Image Background Remover is a web application that allows users to upload images and remove their backgrounds using AI. The app provides a simple and user-friendly interface to process images efficiently.

## Features
- Upload an image and remove its background automatically.
- Supports JPG, PNG, and other common image formats.
- Download the processed image with a transparent background.
- Dark mode and light mode support.
- Responsive design with mobile-friendly layout.

## Technologies Used
- React.js - Frontend framework.
- EmailJS - For email integration.
- @imgly/background-removal - AI background removal tool.
- CSS - For styling and responsiveness.


## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/image-bg-remover.git
   cd image-bg-remover

2. Install dependencies:
   npm install

3. Create a .env file in the root directory and add the following:
   REACT_APP_EMAILJS_USER_ID=your_emailjs_user_id
   REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
   REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id

4. Start the development server:
   npm start


## Usage

1. Open the app in your browser: http://localhost:3000
2. Click the "Choose File" button to upload an image
3. Wait for the AI to process and remove the background
4. Download the image with a transparent background

## Folder Structure
 
│-- src/
│   │-- Css/               # Stylesheets
│   │-- components/        # React components
│   │-- App.js             # Main app component
│   │-- index.js           # Entry point
│-- public/               # Static assets
│-- .env                  # Environment variables
│-- .gitignore            # Git ignore file
│-- README.md             # Documentation
│-- package.json          # Dependencies

## Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

## License

MIT License

## Contact

For questions or suggestions, reach out via [anuragmahanta274@gmail.com].
  make this for my project rreadme in react to upload on github
