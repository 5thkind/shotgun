<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="./public/images/laika_logo.png" alt="Logo" width="120" height="80">
  </a>

  <h3 align="center">Shotgun Playlist to 5th Kind</h3>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

The Shotgun Playlist to 5th Kind repo is a server side rendered Express/Vue application that leverages Autodesk's Shotgun Rest API and 5th Kind's Rest API to take a playlist from Shotgun and upload it to 5th Kind.

**_Note:_** The following repo is set for a locally hosted version of shotgun and not does not officially support shotgun-cloud based implementations.

### Built With

- [Express](https://expressjs.com/)
- [Vue](https://vuejs.org/)
- [Shotgun Rest API](https://developer.shotgunsoftware.com/rest-api/)
- [Fifth Kind Rest API](https://www.5thkind.com/)

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- npm 6.14.8
- node 12.19.0
- locally hosted instance of Shotgun
- 5th Kind Account

### Installation

##### Clone the repo

```sh
git clone https://gitlab.pt.laika.com/pkubala/express-shotgun-vue

```

##### Install NPM packages

```sh
npm install
```

##### Obtain Shotgun Script Name and Key

In order to get authenticated into Shotgun as well as track instances in which this AMI is used, you will need to obtain a script key and script name from Shotgun. Follow Shotgun's official documentation if you need instruction on how to do this: https://support.shotgunsoftware.com/hc/en-us/articles/219031368-Create-and-manage-API-scripts

##### Create New Action Menu Item (AMI)

Inside of shotgun [create a new AMI](https://support.shotgunsoftware.com/hc/en-us/articles/219031318-Creating-custom-Action-Menu-Items) with it's targeted url at http://localhost:3000/fifthkind

##### Edit Config

In order to have the server run and connect to the all the external 3rd party API's you must edit the `./user_config.js` file. Inside that file is a single exported object that once filled out will give the application all the credentials it needs to interact with Shotgun and 5th Kind.

```sh
const config = {
  meta_url: "5thKIND-META-URL/",
  crs_url: "5thKIND-CRS-URL/",
  fifth_kind_username: "5th-KIND-USERNAME",
  fifth_kind_password: "5th-KIND-PASSWORD",
  fifth_kind_client_id: "5th-KIND-CLIENT-ID",
  shotgun_url: "LOCAL-SHOTGUN-URL",
  shotgun_script_key:
    "SCRIPT-KEY",
  shotgun_script_name: "SCRIPT-NAME"
};
```

##### Run Sever

```sh
npm run start
```

##### Run Sever for Development With Hot Reloading

```sh
npm run devstart
```

<!-- USAGE EXAMPLES -->

## Usage

The following application is intended to be used as a standalone application along side with your locally hosted instance of Shotgun (It is assumed that you are not utilizing cloud-based shotgun for this implementation).

This repo acts as a framework for you to [add custom Action Menu Items](https://support.shotgunsoftware.com/hc/en-us/articles/219031318-Creating-custom-Action-Menu-Items) (AMI) to Shotgun, but is mostly responsible for housing an AMI to upload a playlist from Shotgun to 5th Kind through Shotgun's AMI framework.

When the application is launched it will first authenticate between 5th-Kind and Shotgun. Then it will fetch all relevant data (The Shotgun Playlist and Version information and the 5th Kind Tags). A user will then need to select what Tags they want associated with the playlist they intend on uploading. Once they click upload, the code will check the follow Shotgun fields to see if the verisons exist on disk and then upload the media to 5th kind:

- `sg_path_to_movie`
- `sg_source_file_path`
- `sg_uploaded_movie_mp4`

**_Note_**: These paths where the media lives are custom and user defined to the another instance of Shotgun. If you do not want create or use these fields just edit the `prep5thKindApi()` function inside of `./views/fifthkind.ejs` to have the Shotgun fields you wish to use.

#### Code Structure

The code is broken up into three different directories

```sh
- ./public
- ./routes
- ./views
```

The public directory is responsible for hosing static files to be used by other other views. It stores, images, css stylesheets, common Vue components, and common JS services.

The routes directory is resposible for housing all your endpoints. It's here where you create new endpoints to either server-side render views or implementing other REST endpoints.

The views directory houses all the ejs templates and main page Vue components.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.
