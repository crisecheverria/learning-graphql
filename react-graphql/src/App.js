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
