# Scenarios

## Usage

Install the node modules using:

```
$ npm install
```

Run the server using:

```
$ SECRET=X node faye.js
```

Open `index.html` in your browser.

## Scenario 1: Subscribing to Faye server that was down when client connects

This was the first scenario I tried to fix:

* Open `index.html` in your browser.
* Wait for `Subscription failed` message to appear in console.
* Start the Faye server using: `SECRET=Y node faye.js`
* Wait for the client to reconnect.

You should see the following message in your browser console:
* `Subscription failed`

The client is using an old secret when the server comes back online. Using the
rejected promise the client would be able to retrieve a new secret.

## Scenario 2: Resubscribing to crashed Faye server

This was the second scenario I tried to fix:

* Start the Faye server using: `SECRET=X node faye.js`
* Open `index.html` in your browser.
* Perform the following cURL statement:

```
curl -X POST -H 'Content-Type: application/json' -d '{"channel":"/foo", "data":{"foo":"bar"}}' http://localhost:9292/faye
```

You should see the following messages in your browser console:
* `Subscription succeeded`
* `Message received: { foo: 'bar' }`

Now perform the following steps:
* Take down the Faye server (to simulate crash or network disconnection).
* Wait for the client to notice the disconnection.
* Restart the Faye server using: `SECRET=Y node faye.js`
* Wait for the client to reconnect.
* Perform the above cURL statement.

No messages are shown in the browser console as the resubscribe message by the
client fails. The only way to retry this subscription is to catch the error
when it passes the extension.
