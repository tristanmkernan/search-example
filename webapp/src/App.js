import React, { useCallback } from 'react';
import create from 'zustand';
import cx from 'classnames';
import moment from 'moment';
import faker from 'faker';
import { debounce } from 'debounce';

import 'bulma/css/bulma.min.css';

const fetchSearchResults = async (term) => {
  //const response = await fetch(`http://localhost:8000/search?term=${term}`);

  //const data = await response.json();
  
  return [{
    title: faker.lorem.word(),
    image: faker.image.imageUrl(),
    content: faker.lorem.paragraph(),
    timestamp: faker.date.past()
  }];
}

const useStore = create(set => ({
  loading: false,
  options: [],
  search: async (term) => {
    set({ loading: true });

    try {
      const options = await fetchSearchResults(term);

      set(state => ({ options }));
    } catch (e) {
      
    } finally {
      set({ loading: false });
    }
  },
}));

function App() {
  const { loading, options, search } = useStore();

  const debouncedSearch = useCallback(
    debounce(search, 1000),
    [search]
  );

  const handleSearchChange = useCallback(
    (event) => debouncedSearch(event.target.value),
    [debouncedSearch]
  );

  return (
    <div className="container" style={{marginTop: '4rem'}}>
      <div className="field">
        <label className="label">
          Search for article by title or content
        </label>
        <div className={cx("control", {"is-loading": loading})}>
          <input onChange={handleSearchChange} className="input" type="text" placeholder="Primary input" />
        </div>
      </div>

      <div className="" style={{marginTop: '2rem'}}>
        {options.map(
          ({ title, content, timestamp, image }) => (
            <article key={title} className="media">
              <figure className="media-left">
                <p className="image is-64x64">
                  <img src={image} />
                </p>
              </figure>
              <div className="media-content">
                <div className="content">
                  <p>
                    <strong>{title}</strong> <small>last updated {moment(timestamp).format('MMM Do YY')}</small>
                    <br />
                    {content}
                  </p>
                </div>
              </div>
            </article>            
          )
        )}
      </div>
    </div>
  );
}

export default App;
