[![Build Status](https://travis-ci.com/teepha/send-it.svg)](https://travis-ci.com/teepha/send-it) [![Coverage Status](https://coveralls.io/repos/github/teepha/send-it/badge.svg?branch=develop)](https://coveralls.io/github/teepha/send-it?branch=develop) [![Maintainability](https://api.codeclimate.com/v1/badges/5c2633c9b0584da785c2/maintainability)](https://codeclimate.com/github/teepha/send-it/maintainability)


# SendIT
SendIT is a delivery service that allow users to send parcels to different destinations. It can be viewed online [here](http://teepha-send-it.herokuapp.com/).

<br>

### Management
The Project was managed using Pivotal Tracker, click [here](https://www.pivotaltracker.com/n/projects/2213253) to view the board.

<br>

### Getting Started
1. Clone the repository:
    ```
    $ git clone https://github.com/teepha/send-it
    ```

2. Navigate into the cloned repository folder:
    ```
    $ cd send-it
    ```

3. Install dependencies:
    ```
    $ npm install
    ```
<br>

### Usage
1. Start server
    ```
    $ npm run start:dev
    ```

2. Navigate to your browser and type in: http://localhost:3030

<br>

### API Endpoints
v1 of the API is hosted on Heroku, visit http://teepha-send-it.herokuapp.com to access the endpoints.

    POST =>  /api/v1/auth/signup  =>  Register a user 
    POST =>  /api/v1/auth/login  =>  Login a user 
    POST =>  /api/v1/parcels  =>  Create a parcel delivery order 
    GET  =>  /api/v1/parcels  =>  Admin Fetch all parcel delivery orders 
    GET  =>  /api/v1/parcels/:parcelId  =>  Fetch a specific parcel delivery order 
    GET  =>  /api/v1/users/:userId/parcels  =>  Fetch all parcel delivery orders by a specific user 
    PUT  =>  /api/v1/parcels/:parcelId/destination  =>  User change the location of a specific parcel delivery order 
    PUT  =>  /api/v1/parcels/:parcelId/cancel  =>  User cancel a specific parcel delivery order 
    PUT  =>  /api/v1/parcels/:parcelId/status  =>  Admin change the status of a specific parcel delivery order 
    PUT  =>  /api/v1/parcels/:parcelId/presentLocation  => Admin change the Present Location of a specific parcel delivery order

<br>

### External Dependencies/Packages
~ Babel/cli<br>
~ Babel/core<br>
~ Babel/node<br>
~ Babel/preset-env<br>
~ Babel-preset-airbnb<br>
~ Body-parser<br>
~ Express<br>
~ Winston<br>
~ Eslint<br>
~ Eslint-config-airbnb-base<br>
~ Eslint-plugin-import<br>
~ Jasmine<br>
~ Nodemon<br>
~ Supertest

<br>

### Running Tests
Run jasmine for the spec folder through bundle:
    ```npm test
    ```
    
<br>        
    
### Features
1. Users can create accounts based on the following criteria: **first name**, **last name**, **phone number**, **email address** and **password**
2. Users can log in to their accounts based on the following criteria: **email address** and **password**
3. Users can create Parcel Delivery order based on the following criteria: **pickup location**, **destination**, **recipient name** and **phone number**
4. Users can change the destination of a Parcel Delivery order.
5. Users can cancel a Parcel Delivery order.
6. Users can see the details of Parcel Delivery order.
7. Admin can change the status and present location of a Parcel Delivery order.
8. Admin can view all Parcel Delivery orders.

<br>

### Contributing
1. Fork it: [Fork the send-it project](https://github.com/teepha/send-it/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request