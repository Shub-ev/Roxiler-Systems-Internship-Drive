# Task Title Roxiler-Systems-Internship-Drive

# Link https://roxiler-systems-internship-drive-frontend.onrender.com/ (hosted on free service provider hence backend takes time sometime)

This Task is a full-stack web application built using the MERN (MongoDB, Express, React, Node.js) stack. It includes various components for data visualization and management of monthly sales data. The project features APIs for fetching data, seeding the database, and presenting user-friendly interfaces for data visualization.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Technologies Used](#technologies-used)
4. [Project Structure](#project-structure)
5. [Components Overview](#components-overview)
6. [API Endpoints](#api-endpoints)

## Overview

This project involves fetching product sales data from a third-party API and storing it in a database. The application then allows users to visualize sales data using charts and graphs for a particular month. The UI components are implemented in React and feature a clean, responsive design, while the backend is built with Express.js for efficient data handling and retrieval.

## Installation

1. **Clone the repository:**
   git clone https://github.com/Shub-ev/Roxiler-Systems-Internship-Drive.git
   cd Roxiler-Systems-Internship-Drive/

2. **Install Backend Dependencies**
   cd mern_challenge_backend
   npm install

3. **Start Backed Server**
   npm run start
   
4. **Install Frontend Dependencies**
   cd mern_challenge_frontend
   npm install

5. **Start Backed**
   npm run dev

## Technologies Used
    Frontend: React.js, TypeScript, Recharts, CSS
    Backend: Node.js, Express.js
    Database: MongoDB (using MongoDB Atlas)
    Project Structure
    The project is divided into a frontend (frontend) and backend (backend) section, with each having its own distinct directory:

    **Backend Structure**
      backend
        server.js: Entry point for the server.
        routes/: Contains all the API route files.
          apiData.routes.js: Defines the routes for interacting with product sales data.
        controllers/: Defines all controller methods.
          apiData.controller.js: Implements logic for fetching, seeding, and retrieving data from the database.
        models/: MongoDB data models.
          apiData.model.js: Defines the schema for the sales data.
        config/: Configuration files, such as MongoDB connection.
          config.js: Establishes the connection to the MongoDB Atlas database.
        
    **Frontend Structure**
      frontend
        public/: Contains static assets.
        src/: All source code for the frontend.
        components/: React components.
        Graph.tsx: Component for displaying bar chart statistics.
        MonthSelector.tsx: Component for selecting a specific month.
        Statistics.tsx: Component for visualizing detailed statistics.
        interfaces/: TypeScript interfaces.
        ApiData.ts: Interface representing the structure of data fetched from the API.
        App.tsx: Main application component.
        api/: API utility functions to fetch data.

        
## Components Overview
    1. Graph Component (Graph.tsx)
        Props: Accepts allApiData as an array of products.
        Functionality: Displays a bar chart visualizing the count of products in specific price ranges.
        Libraries Used: recharts for data visualization.
        Data Categorization: Groups products into predefined price ranges and calculates counts for each range.
    2. MonthSelector Component (MonthSelector.tsx)
        Functionality: A dropdown to allow the user to select a specific month.
        Purpose: Triggers data fetching for the selected month to display the statistics.
    3. Statistics Component (Statistics.tsx)
        Props: Accepts aggregated sales data for visualization.
        UI: Displays different key values to provide insight into monthly sales.
        Interaction: Reacts to changes in the MonthSelector to update displayed data.


## API Endpoints
        1. Seed Data API
          Endpoint: /initializeSeed
          Method: POST
          Description: Fetches product transaction data from a third-party API and seeds the MongoDB database.
          Usage: Used to initialize the database with data.
        2. Fetch Monthly Data API
          Endpoint: /apiData
          Method: GET
          Description: Retrieves sales data for a given month.
          Params: monthNumber - the month for which sales data is required.
        3. Sales Data API
          Endpoint: /apiSales
          Method: GET
          Description: Fetches a specific batch of sales data to show Sales info.
