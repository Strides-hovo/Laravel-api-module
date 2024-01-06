### GET request with a header
GET {{$url_1}}
Accept: application/json


### Send POST request with json body
POST {{$url_2}}
Content-Type: application/json

{
"id": 999,
"value": "content"
}


### GET request with a header
GET {{$url_3}}
Accept: application/json


### Send PUT request with json body
PUT {{$url_4}}
Content-Type: application/json

{
"id": 999,
"value": "content"
}


### Send DELETE request with json body
DELETE {{$url_5}}
Content-Type: application/json
