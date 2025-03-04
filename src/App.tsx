import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [appliedValue, setAppliedValue] = useState('');
  const delay = 300;

  const findPerson =
    peopleFromServer.find(p => p.name === selectedPerson) || null;

  const applyValue = useCallback(debounce(setAppliedValue, delay), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    applyValue(e.target.value);
    setSelectedPerson('');
  };

  const selectPerson = (person: Person) => {
    setSelectedPerson(person.name);
    setIsOpen(false);
  };

  const filteredPeople = useMemo(() => {
    const normalizeValue = appliedValue.trim().toLowerCase();

    return peopleFromServer.filter(currPers =>
      currPers.name.toLowerCase().trim().includes(normalizeValue),
    );
  }, [appliedValue]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {findPerson
            ? `${findPerson.name} (${findPerson.born} - ${findPerson.died ?? 'still alive'})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              onChange={handleChange}
              value={selectedPerson ? selectedPerson : value}
              onFocus={() => setIsOpen(true)}
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {isOpen && (
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                  >
                    <p
                      className="has-text-link"
                      onClick={() => selectPerson(person)}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {filteredPeople.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
