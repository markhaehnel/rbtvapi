# rbtvapi
[![build status](https://gitlab.com/mhaehnel/rbtvapi/badges/master/build.svg)](https://gitlab.com/mhaehnel/rbtvapi/commits/master)

Publishes stream and schedule infos.

## Requirements
Node 7.5+ with ```--harmony``` flag set.

## Usage
```bash
# Download dependencies
yarn # or 'npm install'

# Configure the environment
export RBTVKEY=XXXXXXXXXXXXXXXX #RBTV API key
export RBTVSECRET=XXXXXXXXXXXXXXXX #RBTV API secret
export YOUTUBEKEY=XXXXXXXXXXXXXXXX #YouTube Data API v3 secret
export YOUTUBECHANNELID=XXXXXXXXXXXXXXXX #YouTube Channel ID of RBTV

# Start the api server
yarn start # or 'npm start'
```
