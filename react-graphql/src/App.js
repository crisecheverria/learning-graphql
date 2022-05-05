import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const axiosGitHubGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

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
  const [repository, setRepository] = useState({
    path: "the-road-to-learn-react/the-road-to-learn-react",
    organization: null,
    errors: null,
  });

  const onSubmit = (e) => {
    onFetchFromGitHub(repository.path);
    e.preventDefault();
  };

  const onChange = (event) => setRepository({ path: event.target.value });

  const onFetchFromGitHub = (path) =>
    getIssuesOfRepository(path).then((queryResult) =>
      setRepository(resolveIssuesQuery(queryResult))
    );

  useEffect(() => {
    repository.path && onFetchFromGitHub(repository.path);
  }, [repository.path]);

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
