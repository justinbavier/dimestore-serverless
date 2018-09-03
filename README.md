![doc-header](https://avatars.githubusercontent.com/justgiveadime)

# DimeStore API
This API is for handling data transfer of Dime.

### Set Up

**This project requires Serverless**

You can install it with `npm install serverless -g`. For deploying, you must have Dime AWS Credentials in your shell's profile.

```
export DIME_AWS_ACCESS_KEY=<your-key-here>;
export DIME_AWS_SECRET_KEY=<your-key-here>;
export DIME_S3_BUCKET=<your-key-here>;
```

Running the server offline is done with `serverless-offline`. After an `npm install`, run `npm start` to run it locally. You can then send requests to `http://localhost:3003/functionName`.

### Stripe and Plaid

This project depends on Plaid and Stripe account tokens in your shell profile.

```
export DIME_PLAID_CLIENT_ID=<your-key-here>;
export DIME_PLAID_SECRET=<your-key-here>;
export DIME_PLAID_PUBLIC_KEY=<your-key-here>;
export DIME_STRIPE_SECRET=<your-key-here>";
```


# API 

## `POST /user/create`

#### Creates a user.

### Headers:



### Body:

**cognitoId** - `username` from AWS Cognito Authentication

### Responses:

200 - OK

	{
	    "success": true,
	    "user": {
	        "id": String,
	        "email": String,
	        "progress": Number,
	        "totalDonated": Number,
	        "donationThreshold": Number,
	        "createdAt": Date
	    }
	}


400 - Error

#### **Content Type**: `application/json`

## `GET /user/:userId`

#### Gets a User by ID

### Path Parameters:

**userId** - ID of the User to get

### Headers:

### Responses:

200 - OK

	{
	    "success": true,
	    "user": {
	        "plaidItemId": String,
	        "lastName": String,
	        "updatedAt": Date,
	        "progress": Number,
	        "createdAt": Date,
	        "queuedCharities": [
	            {
	                "id": String
	            }
	        ],
	        "favoriteCharities": [
	        	  {
	        	  		"id": String
        	  	  }
	        ],
	        "donationThreshold": Number,
	        "email": String,
	        "id": String,
	        "firstName": String,
	        "totalDonated": Number
	    }
	}


404 - Not Found

#### **Content Type**: `application/json`

## `POST /user/:userId/update`

#### Gets a User by ID

### Path Parameters:

**userId** - ID of the User to Update

### Headers:

### Body:

The body for this endpoint takes any field that is defined on the User Schema and updates it. 

	{
        "plaidItemId": String,
        "plaidAccessToken": String,
        "plaidAccountId": String,
        "stripeBankToken": String,
        "lastName": String,
        "progress": Number,
        "queuedCharities": [],
        "favoriteCharities": [],
        "transactions": [],
        "donationThreshold": Number,
        "email": String,
        "id": String,
        "firstName": String,
        "totalDonated": Number
    }


### Responses:

200 - OK

	{
	    "success": true,
	    "user": {
	        "plaidItemId": String,
            "plaidAccessToken": String,
        	"plaidAccountId": String,
        	"stripeBankToken": String,
	        "lastName": String,
	        "updatedAt": Date,
	        "progress": Number,
	        "createdAt": Date,
	        "queuedCharities": [
	            {
	                "id": String
	            }
	        ],
	        "favoriteCharities": [
	        	  {
	        	  		"id": String
        	  	  }
	        ],
	        "donationThreshold": Number,
	        "email": String,
	        "id": String,
	        "firstName": String,
	        "totalDonated": Number
	    }
	}


404 - Not Found

#### **Content Type**: `application/json`

## `GET /charities/city/:city`

#### Gets Charities by their city

### Path Parameters:

**city** - LOWERCASE City Name

### Headers:


### Responses:

200 - OK

	{
	    "success": true,
	    "charities": [
	        {
	            "city": String,
	            "category": String,
	            "createdAt": Date,
	            "description": String,
	            "id": String,
	            "name": String
	        }
	    ]
	}

404 - Not Found

#### **Content Type**: `application/json`

## `GET /charity/:id`

#### Gets a Charitiy by ID

### Path Parameters:

**city** - LOWERCASE City Name

### Headers:


### Responses:

200 - OK

	{
	    "success": true,
	    "charity": {
            "city": String,
            "category": String,
            "createdAt": Date,
            "description": String,
            "id": String,
            "name": String
        }
	}

404 - Not Found

#### **Content Type**: `application/json`

## `POST /charity/create`

#### Creates a Charity

### Headers:

### Body:

The body for this endpoint takes any field that is defined on the Charity Schema and creates it. 

	    {
            "city": String,
            "category": String,
            "createdAt": Date,
            "description": String,
            "id": String,
            "name": String
        }

### Responses:

200 - OK

	{
	    "success": true,
	    "charity": {
            "city": String,
            "category": String,
            "createdAt": Date,
            "description": String,
            "id": String,
            "name": String
        }
	}


404 - Not Found

#### **Content Type**: `application/json`

## `POST /charity/:id/update`

#### Updates a Charity

### Headers:

### Body:

The body for this endpoint takes any field that is defined on the Charity Schema and updates it. 

	    {
            "city": String,
            "category": String,
            "createdAt": Date,
            "description": String,
            "id": String,
            "name": String
        }

### Responses:

200 - OK

	{
	    "success": true,
	    "charity": {
            "city": String,
            "category": String,
            "createdAt": Date,
            "description": String,
            "id": String,
            "name": String
        }
	}


404 - Not Found

#### **Content Type**: `application/json`



  

