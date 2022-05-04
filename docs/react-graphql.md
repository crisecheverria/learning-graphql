# React & GraphQL

## Create react app

Open your terminal an run: `npx create-react-app react-graphql`

## Axios

Open your terminal an move inside the React app and run: `npm install axios --save`

## Setup Axios

Inside `src/App.js`

```js
import "./App.css";
import axios from "axios";

const axiosGitHubGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

function App() {
  return <div className="App">Learn React & Graphql</div>;
}

export default App;
```

Next, we are goinf to build a issue listing App for GitHub Repositories.

Inside `src/App.js`

```js
function App() {
  const onSubmit = (e) => {
    e.preventDefault();
  };

  const onChange = () => {};

  return (
    <div className="App">
      Learn React & Graphql
      <form onSubmit={onSubmit}>
        <label htmlFor="url">Show open issues for https://github.com/</label>
        <input
          id="url"
          type="text"
          onChange={onChange}
          style={{ width: "300px" }}
        />
        <button type="submit">Search</button>
      </form>
      <hr />
    </div>
  );
}
```

Let's add some state using React.useState Hook

```js
import { useState } from "react";

...

function App() {
  const [repository, setRepository] = useState({
    path: "the-road-to-learn-react/the-road-to-learn-react",
    organization: null,
    errors: null,
  });

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const onChange = (event) => setRepository({ path: event.target.value });

  return (
    <div className="App">
      Learn React & Graphql
      <form onSubmit={onSubmit}>
        <label htmlFor="url">Show open issues for https://github.com/</label>
        <input
          id="url"
          type="text"
          onChange={onChange}
          value={repository.path}
          style={{ width: "300px" }}
        />
        <button type="submit">Search</button>
      </form>
      <hr />
    </div>
  );
}

export default App;
```

## Graphql Query in React

```js
import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const axiosGitHubGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

const GET_ORGANIZATION = `
{
  organization(login: "the-road-to-learn-react") {
    name
    url
  }
}
`;

function App() {
  const [repository, setRepository] = useState({
    path: "the-road-to-learn-react/the-road-to-learn-react",
    organization: null,
    errors: null,
  });

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const onChange = (event) => setRepository({ path: event.target.value });

  const onFetchFromGitHub = () => {
    axiosGitHubGraphQL
      .post("", { query: GET_ORGANIZATION })
      .then((result) => console.log(result));
  };

  useEffect(() => {
    onFetchFromGitHub();
  }, []);

  return <div className="App">...</div>;
}

export default App;
```

Don't forget to add a `.env` file in the project in order to save the GitHub Access Token

```
REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN=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
```

Let's update the state from the query fetch results

```js
...

function App() {
  ...

  const onFetchFromGitHub = () => {
    axiosGitHubGraphQL.post("", { query: GET_ORGANIZATION }).then((result) =>
      setRepository({
        organization: result.data.data.organization,
        errors: result.data.errors,
      })
    );
  };

  useEffect(() => {
    onFetchFromGitHub();
  }, []);

  return (
    <div className="App">
      Learn React & Graphql
      ...
      <hr />
      {repository.organization ? (
        <Organization
          organization={repository.organization}
          errors={repository.errors}
        />
      ) : (
        <p>No information yet ...</p>
      )}
    </div>
  );
}

const Organization = ({ organization, errors }) => {
  if (errors) {
    return (
      <p>
        <strong>Something went wrong:</strong>
        {errors.map((error) => error.message).join(" ")}
      </p>
    );
  }
  return (
    <div>
      <p>
        <strong>Issues from Organization:</strong>
        <a href={organization.url}>{organization.name}</a>
      </p>
    </div>
  );
};
```