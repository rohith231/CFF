MVP platform with Reactjs and Nodejs

Fully Coded Components

MVP Dashboard React Nodejs is built with more individual components, giving you the freedom of choosing and combining. All components can take variations in color, that you can easily modify using SASS files. This development process is seamless, Every element has multiple states for colors, styles, hover, focus, that you can easily access and use.

Rest API

Get connected to the Dashboard with a fully functional API made in NodeJS, containing multiple endpoints for managing the platform, each one of them being well documented and easily configurable.

Front-End Pages

Requirements Please install all below required softwares to run the application.

1.react 2.arcgis api for javascript 3.@arcgis/core (package for using es6 modules) 4.reactstrap (if any styling needed other than gis part)

steps to use template: -after unzipping, open terminal in project folder -install all packages by using cmd (>>npm i) -after the packages got installed, start the project by cmd (>>npm start)

to work with gismaps use components:

-TesDashboardMap.js (for web map) -DashboardScene.js (for web scene)

to work outside of maps use components: -Index.js in (src/views directory) -Sidebar.js (to work in sidebar)

to create new functionality in sidebar: -create new js file in sidebar folder -copy either chartBar or functionalityBar code and use it as a reference. -to toggle functionality in sidebar create new state in GlobalState file and use it.

to work with extra modules use: -recharts (for charts) -fontawesome (for icons) -react-bootstrap -bootstrap -reactstrap
