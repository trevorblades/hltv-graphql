# HLTV.org GraphQL API

This API wraps the unofficial [`hltv`](https://github.com/gigobyte/HLTV) Node client.

## Running locally

Clone this repo and `cd` into it. You're going to need to create a `.env` file that exposes a `PORT` variable. It will look like this:

```bash
# specify the port you want the server to listen to
PORT=4000
```

Next, install the project dependencies and start up the dev server. If everything works, you'll see a 🚀 successful 🚀 message in your terminal.

```bash
$ npm install
$ npm start
```

If you access the provided URL in a browser ([http://localhost:4000/graphql](http://localhost:4000/graphql) in this example), you'll get a GraphQL playground to read over the API schema and test out some queries.
