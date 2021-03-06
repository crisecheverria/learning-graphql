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

## GraphQL Nested Objects in React

```js
const GET_REPOSITORY_OF_ORGANIZATION = `
{
  organization(login: "the-road-to-learn-react") {
    name
    url
    repository(name: "the-road-to-learn-react") {
      name
      url
    }
  }
}
`;

function App() {
  ...

  const onFetchFromGitHub = () => {
    axiosGitHubGraphQL
      .post("", { query: GET_REPOSITORY_OF_ORGANIZATION })
      .then((result) =>
        ...
      );
  };

  ...

  return (
    ...
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
      <Repository repository={organization.repository} />
    </div>
  );
};

const Repository = ({ repository }) => (
  <div>
    <p>
      <strong>In Repository:</strong>
      <a href={repository.url}>{repository.name}</a>
    </p>
  </div>
);

export default App;
```

We just added the Repository component

Now, lets get issues from the Repository:

```js
const GET_ISSUES_OF_REPOSITORY = `
{
  organization(login: "the-road-to-learn-react") {
    name
    url
    repository(name: "the-road-to-learn-react") {
      name
      url
      issues(last: 5) {
        edges {
          node {
            id
            title
            url
          }
        }
      }
    }
  }
}
`;

function App() {
  ...
  cosnt onFetchFromGitHub = () => {
    axiosGitHubGraphQL
      .post('', { query: GET_ISSUES_OF_REPOSITORY })
      .then(result =>
      ...
    );
  };
  ...
}

const Repository = ({ repository }) => (
  <div>
    <p>
      <strong>In Repository:</strong>
      <a href={repository.url}>{repository.name}</a>
    </p>
  <ul>
  {repository.issues.edges.map(issue => (
    <li key={issue.node.id}>
      <a href={issue.node.url}>{issue.node.title}</a>
    </li>
  ))}
  </ul>
  </div>
);
```

## GraphQL Variables and Arguments in React

```js
const GET_ISSUES_OF_REPOSITORY = `
query ($organization: String!, $repository: String!) {
  organization(login: $organization) {
    name
    url
    repository(name: $repository) {
      name
      url
      issues(last: 5) {
        edges {
          node {
            id
            title
            url
          }
        }
      }
    }
  }
}
`;

function App() => {
  ...

  const onSubmit = (e) => {
    onFetchFromGitHub(repository.path);
    e.preventDefault();
  };

  const onFetchFromGitHub = (path) => {
    const [organization, repository] = path.split("/");

    axiosGitHubGraphQL
      .post("", {
        query: GET_ISSUES_OF_REPOSITORY,
        variables: { organization, repository },
      })
      .then((result) =>
        setRepository({
          organization: result.data.data.organization,
          errors: result.data.errors,
        })
      );
  };

  useEffect(() => {
    repository.path && onFetchFromGitHub(repository.path);
  }, [repository.path]);

  ...

}
```

## Code Refactor

```js
const getIssuesOfRepository = (path) => {
  const [organization, repository] = path.split("/");

  return axiosGitHubGraphQL.post("", {
    query: GET_ISSUES_OF_REPOSITORY,
    variables: { organization, repository },
  });
};

const resolveIssuesQuery = (queryResult) => () => ({
  organization: queryResult.data.data.organization,
  errors: queryResult.data.errors,
});

function App() {
  ...

  const onFetchFromGitHub = (path) => {
    getIssuesOfRepository(path).then((queryResult) =>
      setRepository(resolveIssuesQuery(queryResult))
    );
  };

  ...
}
```

## Apollo client

Let's use Apollo Client for handling the GraphQL calls

### Setup

```
npm install @apollo/client graphql
```

### Connect your client to React

Open `src/index.js`

```js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// Apollo Client
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Authorization
const authLink = setContext((_, { headers }) => {
  const token = process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql",
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

### Fetch data with useQuery

Open `src/App.js`

```js
import { useState } from "react";
import "./App.css";
import { useQuery, gql } from "@apollo/client";

const GET_ISSUES_OF_REPOSITORY = gql`
  query ($organization: String!, $repository: String!) {
    organization(login: $organization) {
      name
      url
      repository(name: $repository) {
        name
        url
        issues(last: 5) {
          edges {
            node {
              id
              title
              url
            }
          }
        }
      }
    }
  }
`;

const initialPath = "the-road-to-learn-react/the-road-to-learn-react";

function App() {
  const [repository, setRepository] = useState({
    path: initialPath,
    organization: null,
  });

  const [org, rep] = initialPath.split("/");
  const { loading, error, refetch } = useQuery(GET_ISSUES_OF_REPOSITORY, {
    variables: {
      organization: org,
      repository: rep,
    },
    onCompleted: (data) =>
      setRepository((prevState) => ({
        ...prevState,
        organization: data.organization,
        repository: data.organization.repository,
      })),
  });

  const onSubmit = (e) => {
    const [org, rep] = repository.path.split("/");
    refetch({ organization: org, repository: rep });
    e.preventDefault();
  };

  const onChange = (event) => setRepository({ path: event.target.value });

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading ...</p>;
  }

  if (error) {
    return (
      <p style={{ textAlign: "center" }}>
        <strong>Something went wrong:</strong>
        {error.message}
      </p>
    );
  }

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
      {repository.organization && (
        <Organization organization={repository.organization} />
      )}
    </div>
  );
}

const Organization = ({ organization }) => {
  return (
    <div>
      <p>
        <strong>Issues from Organization:</strong>
        <a href={organization.url}>{organization.name}</a>
      </p>
      <Repository repository={organization.repository} />
    </div>
  );
};

const Repository = ({ repository }) => (
  <div>
    <p>
      <strong>In Repository:</strong>
      <a href={repository.url}>{repository.name}</a>
    </p>
    <ul>
      {repository.issues.edges.map((issue) => (
        <li key={issue.node.id}>
          <a href={issue.node.url}>{issue.node.title}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default App;
```
